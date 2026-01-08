// <!--
// File: login.html
// Description: Login page of the website.
// Created by: Vy
// Date: ??

// Edited by: Aidan
// Date: 13-05-25
// Changes:
//     link to database
//     made post route to modify database
//     added crypto module to make password secure
//     insert firstName, lastName, email and password into db
//     also added the country, location and initial points
// -->

const express = require('express');
const path = require("path");
const router = express.Router();
const db = require('../middleware/database');
const bcrypt = require('bcrypt');
const axios = require('axios');

// Get signup page
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
});

router.post('/submit', async function (req, res, next) {
  console.log('Form submitted: ', req.body);
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    country,
    location
  } = req.body;
  const points = 100;

  try {
    const apiRes = await axios.get('http://api.weatherapi.com/v1/search.json', { params: { key: process.env.API_KEY, q: location.trim() } });
    console.log(apiRes.data);
    const cityCountryPair = apiRes.data.find(
      (c) => c.name.toLowerCase() === location.trim().toLowerCase()
        && c.country.toLowerCase() === country.trim().toLowerCase()
    );

    if (!cityCountryPair) {
      res.status(400).json({ success: false, message: 'Please enter a valid city-and-country.' });
      return;
    }
  } catch (err) {
    console.error("Error validating location", err);
    res.status(500).json({ success: false, message: 'Server error validating location.' });
    return;
  }

  const query = "INSERT INTO User (firstName, lastName, email, username, password, country, location, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    const hashPassword = await bcrypt.hash(password, 12); // Password encryption with salting
    await db.execute(query, [firstName, lastName, email, username,
      hashPassword, country, location, points]);
    console.log("Signup successful!");
    res.status(200).json({ success: false, message: 'Signup successful!' });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      if (err.sqlMessage.includes('email')) {
        res.status(401).json({ success: false, message: 'This email already has an account!' });
      } else if (err.sqlMessage.includes('username')) {
        res.status(401).json({ success: false, message: 'This username already has an account!' });
      } else {
        res.status(401).json({ success: false, message: 'Error: Duplicate entry' });
      }
      return;
    }

    if (err.code === "ER_PARSE_ERROR") {
      res.status(500).json({ success: false, message: 'Error: Incorrect MySQL query' });
      return;
    }

    console.error(err);
    res.status(500).json({ message: 'There was an error with the server' });
  }
});

module.exports = router;
