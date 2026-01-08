const axios = require('axios');
const express = require('express');
const router = express.Router();

// Route to return JSON output of API, call must be made with the name of a city.
router.get('/call', async (req, res) => {

  let { city } = req.query;

  if (!city) {
    res.status(400).json({ message: 'City is required.' });
    return;
  }

  try {
    const apiRes = await axios.get("http://api.weatherapi.com/v1/forecast.json", { params: { key: process.env.API_KEY, q: city, days: 4 } });
    res.json(apiRes.data);
  } catch (err) {
    console.error("Failed to reach API:", err);
    res.sendStatus(500);
  }
});

// Add city checking api https://documenter.getpostman.com/view/1134062/T1LJjU52
router.get('/autocomplete', async (req, res) => {
  let searchCity = req.query.q;
  if (!searchCity) {
    res.status(400).json({ message: 'Word to be searched is required.' });
    return;
  }
  try {
    const apiRes = await axios.get("http://api.weatherapi.com/v1/search.json", { params: { key: process.env.API_KEY, q: searchCity } });

    const cities = apiRes.data.map((city) => ({
      name: `${city.name}, ${city.country}`
    }));

    console.log("City autocomplete has matched:\n", cities);
    res.json({ suggestions: cities });

  } catch (err) {
    console.error("Failed to reach Weather API:", err);
    res.status(500).json({ message: 'Autocomplete failed' });
  }
});

module.exports = router;
