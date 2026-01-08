const express = require('express');
const path = require("path");
const router = express.Router();
const checkAuthentication = require("../middleware/auth");
const db = require('../middleware/database');
const axios = require('axios');

// Get dashboard
// @ts-ignore
router.get('/', checkAuthentication, function (req, res, next) {
  res.sendFile(path.join(__dirname, "../protected/dashboard.html"));
});

// @ts-ignore
router.post('/', checkAuthentication, function (req, res, next) {
  res.redirect('/dashboard');
});

// @ts-ignore
router.post('/submit', async function (req, res, next) {
  console.log('Form submitted: ', req.body);
  const date = new Date().toISOString().split('T')[0];
  const {
    location,
    predictedDate,
    predictedType,
    predictedValue,
    pointsBetted
  } = req.body;

  if (location.trim() === '' || !location || typeof location !== 'string') {
    res.status(400).json({ success: false, message: 'Location is required.' });
    return;
  }

  try {
    const apiRes = await axios.get('http://api.weatherapi.com/v1/search.json', {
      params: { key: process.env.API_KEY, q: location.trim() }
    });
    if (!apiRes.data || apiRes.data.length === 0) {
      res.status(400).json({ success: false, message: 'Please enter a valid location.' });
      return;
    }
  } catch (err) {
    console.error("Error validating location", err);
    res.status(500).json({ success: false, message: 'Server error validating location.' });
    return;
  }

  /**
   * Check if a date is before the start of the current day
   */
  const isPastDate = (d) => d < new Date().setHours(0, 0, 0, 0);

  if (!predictedDate || isNaN(Date.parse(predictedDate)) || isPastDate(new Date(predictedDate))) {
    console.error(predictedDate, "is an invalid date...");
    res.status(400).json({ success: false, message: 'Predicted date is not valid.' });
    return;
  }

  if (!predictedValue || isNaN(predictedValue)) {
    res.status(400).json({ success: false, message: 'Prediction value is not valid.' });
    return;
  }

  if ((predictedType === 'predictedRainfall' || predictedType === 'predictedWindspeed') && (isNaN(predictedValue) || predictedValue < 0)) {
    res.status(400).json({ success: false, message: 'Predicted value cannot be negative.' });
    return;
  }

  if (!pointsBetted || isNaN(pointsBetted) || pointsBetted < 0) {
    res.status(400).json({ success: false, message: 'Points betted is not valid.' });
    return;
  }

  // @ts-ignore
  let { userID } = req.session.user;
  let predictedMaxTemp = predictedType === "predictedMaxTemp" ? predictedValue : null;
  let predictedMinTemp = predictedType === "predictedMinTemp" ? predictedValue : null;
  let predictedRainfall = predictedType === "predictedRainfall" ? predictedValue : null;
  let predictedWindspeed = predictedType === "predictedWindspeed" ? predictedValue : null;

  if ([predictedMaxTemp, predictedMinTemp, predictedRainfall, predictedWindspeed]
    .every((p) => p === null)) {
    res.status(400).json({ success: false, message: "Invalid prediction type!" });
    return;
  }

  console.log([userID, location, date, predictedDate,
    predictedMaxTemp, predictedMinTemp, predictedRainfall, predictedWindspeed, pointsBetted]);
  const query = "INSERT INTO Prediction (userID, location, date, predictedDate, predictedMaxTemp, predictedMinTemp, predictedRainfall, predictedWindspeed, pointsBetted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  try {
    // @ts-ignore
    if (req.session.user.points < pointsBetted) {
      console.error("You do not have enough points to make the prediction!");
      res.status(401).json({ success: false, message: 'You do not have enough points to make the prediction!' });
      return;
    }
    await db.execute(
      query,
      [
        userID,
        location,
        date,
        predictedDate,
        predictedMaxTemp,
        predictedMinTemp,
        predictedRainfall,
        predictedWindspeed,
        pointsBetted
      ]
    );
    // @ts-ignore
    req.session.user.points -= pointsBetted;
    await db.execute("UPDATE User SET points = points - ? WHERE userID = ?", [pointsBetted, userID]);
    console.log("Prediction inserted!");
    res.json({ message: 'You have made a prediction!' });
  } catch (err) {
    console.error(err, "Failed to insert prediction!");
    res.status(500).json({ message: 'Prediction failed to update prediction table in database!' });
  }
});

module.exports = router;
