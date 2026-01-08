const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
require("dotenv").config();
const db = require("./middleware/database");
const axios = require("axios");
const xss = require('xss-clean');
const app = express();
// Body parser
app.use(express.json());

// Use xss-clean AFTER body parsing
app.use(xss());

// Example route
app.post('/comment', (req, res) => {
    const cleanComment = req.body.comment;
    res.send(`Comment received: ${cleanComment}`);
});

const dashboardRouter = require("./routes/dashboard");
const leaderboardRouter = require("./routes/leaderboard");
const loginRouter = require("./routes/login");
const sessionRouter = require("./routes/session");
const profileRouter = require("./routes/profile");
const apiRouter = require("./routes/api");
const signupRouter = require("./routes/signup");

// Express setup .
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session set up - make sure to add a key to your .env file
app.use(session({
    // @ts-ignore
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Change the router in the next line to choose where the default page goes
app.use("/", loginRouter);
// Routers
app.use("/signup", signupRouter);
app.use("/session", sessionRouter);
app.use("/dashboard", dashboardRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/login", loginRouter);
app.use("/profile", profileRouter);
app.use("/api", apiRouter);


// Daily prediction scoring
// Since this server does not have 100% uptime (or even close),
// we check every 10 minutes if today's predictions have been scored.
// Normally, this would be done at midnight or something

async function scoreTodays() {
    const today = new Date().toISOString().substring(0, 10);
    const todayMS = new Date(today).getTime();
    // Check if we have already called today
    const [weatherForToday] = await db.query("SELECT weatherID from Weather WHERE lastUpdated=?", [today]);
    if (!weatherForToday[0]) {
        console.log(`Scoring predictions for ${today}...`);
        // Proceed
        // Get today's predictions
        const [predictions] = await db.query("SELECT * FROM Prediction WHERE predictedDate=?", [today]);
        // @ts-ignore
        console.log(`${predictions.length} predictions will be scored...`);

        // Iterate by location
        // This line is super inefficient, but we only call it once per scoring round.

        // @ts-ignore
        Array.from(new Set(predictions.map((p) => p.location))).forEach(async (location) => {
            // Get the API for this location and day
            const rawResponse = await axios.get("http://api.weatherapi.com/v1/forecast.json", { params: { key: process.env.API_KEY, q: location, days: 1 } });
            const todaysData = rawResponse.data.forecast.forecastday[0].day;
            const filteredResponse = {
                location: location,
                lastUpdated: today,
                maxTemp: todaysData.maxtemp_c,
                minTemp: todaysData.mintemp_c,
                rainfall: todaysData.totalprecip_mm,
                windspeed: todaysData.maxwind_kph
            };
            // Record this in the db
            await db.query("INSERT INTO Weather VALUES (0,?,?,?,?,?,?);", [filteredResponse.location, filteredResponse.lastUpdated, filteredResponse.maxTemp, filteredResponse.minTemp, filteredResponse.rainfall, filteredResponse.windspeed]);

            // Get every prediciton for this weather
            // @ts-ignore
            predictions.filter((p) => p.location === location).forEach(async (pred) => {
                // This is the scoring function here.
                // Base score
                const baseScore = 100;
                let score = baseScore;
                // We divide out the absolute difference between the
                // predicted value and the actual value.
                // This way, the larger the difference, the lower the overall score.
                if (pred.predictedMaxTemp) {
                    score /= Math.abs(filteredResponse.maxTemp - pred.predictedMaxTemp) || 0.1;
                }
                if (pred.predictedMinTemp) {
                    score /= Math.abs(filteredResponse.minTemp - pred.predictedMinTemp) || 0.1;
                }
                if (pred.predictedRainfall) {
                    score /= Math.abs(filteredResponse.rainfall - pred.predictedRainfall) || 0.1;
                }
                if (pred.predictedWindspeed) {
                    score /= Math.abs(filteredResponse.windspeed - pred.predictedWindspeed) || 0.1;
                }
                // This next bit is just some arbitrary numbers to include the pointsBetted.
                score *= (pred.pointsBetted / baseScore) + 0.01;
                // Account for predictions further in the future.
                // 1 Week in advance will double the score.
                const predDateMS = new Date(pred.date).getTime();
                const diffInWeeks = Math.abs(predDateMS - todayMS) / (1000 * 60 * 60 * 24 * 7);

                // Uncomment this line for production.
                // score += diffInWeeks

                // Uncomment this line for testing/demos
                score *= diffInWeeks + 1;

                // Get the weather id form the db
                const [weather] = await db.query("SELECT weatherID FROM Weather WHERE location=? AND lastUpdated=?;", [location, today]);
                // Insert this into the history table
                await db.query("INSERT INTO History VALUES (0,?,?,?,?);", [pred.userID, pred.predID, weather[0].weatherID, Math.round(score)]);
                // Update the user score
                await db.query("UPDATE User SET points = points + ? WHERE userID = ?;", [Math.round(score), pred.userID]);
            });
        });
        console.log("Done scoring predictions...");
    }
}

// Call every 10 minutes
setInterval(scoreTodays, 1000 * 60 * 10);

module.exports = app;
