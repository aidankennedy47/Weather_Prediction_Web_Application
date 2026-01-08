# Group Repository for COMP SCI 2207/7207 Web & Database Computing Web Application Project (2023 Semester 1)

## Project Description
Forecast Fortune is a competitive web application, designed for weather enthusiasts or casual users. It allows users to log in and make predictions about future weather conditions such as maximum and minimum temperature, wind speed and rainfall for any city, worldwide. Based on the accuracy of their predictions, users will be rewarded with points, which contribute to their standings on the global leaderboard. The application leverages data from WeatherAPI to provide real-time forecast information, encouraging users to improve their understanding of meteorology through informed predictions. By combining gamification with weather forecasts, Forecast Fortune creates an engaging and education experience.

### Scoring

-   Predictions are scored for each day based on a scoring function.
-   Each score begins with a base amount of 100 points.
-   The 100 points are then divided by the difference between your predicted value and the actual value of the weather for that day.

```js
const basePoints = 100;
let score = basePoints / Math.abs(predictedValue - actualValue);
// If the predicted and actual values are the same, it divides by 0.1 to avoid a divide-by-zero.
```

-   Then, the function accounts for the number of points that the user bet.
-   The user may bet 0 points and they will recieve a very minimal reward as a result. This is to avoid softlocking users that have zero points.

This is implemented as such:

```js
score *= bet / baseScore + 0.01;
// This way, the score only increases when bet >= 100 points.
// But, the user can still earn points when bet == 0.
```

## Setup instructions for running the app

1. Ensure that the project repository is in a folder on the local machine, and that Docker and VS Code are available.
2. Open the repository in VS Code. If prompted to open in the container, accept it.
3. Run `npm install` in the terminal, which will install all of the packages used by the project. These include:

    - axios
    - bcrypt
    - cookie-parser
    - dotenv
    - express
    - express-session
    - mysql2
    - xss-clean

4. To set up the .env file:

    - You will need to create a .env in the root of the project. To do this, click new file, and name the file .env.
    - In the .env file, copy paste the following:

    ```sh
    API_KEY= da3fad16817842da88b40837252304
    DB_HOST= localhost
    DB_USER= user
    DB_PASSWORD= password
    DB_NAME= ForecastFortune
    SECRET_KEY= secret123
    ```

    - This sets up the api key, the user information for the database, and the key used to create user sessions

5. To ensure that the Database is running:
    - In the terminal, run `service mysql start`, which will start the database in the container. Note that this command has to be run each time the project is opened/new container is used
    - In the terminal, type `mysql < dbinit.sql`. This will load the database file. Loading this file will automatically set user privileges.
    - To check that that the database is working, run `mysql` in the terminal, followed by `SHOW DATABASES;`.
    - ForecastFortune should be listed in the databases shown
    - To further check that the dummy data is correctly installed, run `USE ForecastFortune;` followed by a simple query such as `SELECT * FROM User;`, which should produce a table in the terminal
    - You should now be good to go! Type `quit` in the terminal to exit mysql.
6. To start the application, run `npm start`, and then open `http://localhost:8080/` in your browser.
7. You should be routed to the login page. To access the application, you will need to create a new account, and then log in with that account.
8. You will be routed to the dashboard, where you will be able to search for cities, make a prediction, navigate to the leaderboard, and view your account information.

## List of features and functionality

### Signup/Login Features:

-   Signup page allows users to create an account with email and password.
-   Users can login and logout of the webpage
-   Errors are displayed when email/username is duplicated in the User database, and if an incorrect country-city pair are inputted

### Signup/Login Functions:

-   Signup form validation. Form takes email, password, user information, etc.
-   Login authentication. User is parsed through FortuneForecast's database and User tables to determine if they are an already established user.
-   Passwords of users are stored with bcrypt and salt hashing in the database.
-   Unauthenticated users will not be able to access the dashboard, leaderboard, or profile pages

### Dashboard Features:

-   Displays current weather.
-   Displays forecasts for next 2 days.
-   Displays dynamic weather icons for varying weather conditions.
-   Displays city, country, and respective weather statistics.

### Dashboard Functions:

-   Makes calls from WeatherAPI to display on the dashboard.
-   Initially displays weather data based on user's city/country.
-   Predictions for future dates can be made through the prediction form, giving users points.
-   Autocomplete of cities/countries searched in the search bar and prediction form location as a dropdown table.
-   Searching for a valid city will display and update the information on the page asynchronously
-   Prediction form can go back to previous tabs and forward to next tabs.
-   Predicted dates are restricted to today or future only.
-   Prediction form input is validated before submission - checks if the user has enough points to bet, has inputted a valid city, and a valid date.
-   Points are calculated and scored every 10 minutes on the day the prediction was based on. More points are added the further ahead the prediction and the closer the prediction is to the value.

### Sidebar

-   Sidebar displays when clicking on the user profile picture in the top right of the navigation bar, and can be acccessed from the dashboard, leaderboard, or profile page
-   Displays the user's username and the current amount of points that they have
-   Is used to navigate to the user's profile page, or to log out

### User Features:

-   Displays user profile image.
-   Has history of past predictions and the points earned.
-   Displays user info.

### User Functions:

-   User can delete their account, which will delete everything in the database, and then send the user back to the login page.
-   Can update account information and password, which will automatically update the session information.

### Leaderboard Features:

-   Users are ranked by score.
-   Displays username and their respective points.

### Leaderboard Functions:

-   Sorts users in descending order by points.
-   Can click on user in the leaderboard to show basic user information - name, country, total predications, and average points/prediction.
-   Can search for a user by username
-   Can refresh the leaderboard with up to date point information

## Bugs and Limitations

Forecast Fortune unfortunately has some minor feature limitations and bugs in the functionality.

-   Due to time constraints, the profile picture upload feature wasn't completed. As a result, all users have the default profile image.

### Demonstration and Testing Contraints

The project has had several function elements modified for the purpose of demonstration and testing. In a production build, these would be adressed and returned to their intended functionality.

-   Prediction scoring is checked every 10 minutes, instead of once-per-day.
-   Predictions can be placed for the same day. In production, predictions must be for a future date.
