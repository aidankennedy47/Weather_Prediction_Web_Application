const express = require('express');
const path = require("path");
const router = express.Router();
const db = require("../middleware/database");
const checkAuthentication = require("../middleware/auth");

// Get leaderboard
router.get('/', checkAuthentication, function (req, res, next) {
  res.sendFile(path.join(__dirname, "../protected/leaderboard.html"));
});

router.get("/data", checkAuthentication, async (req, res, next) => {
  // For now, we just send all the users, since there are only like 5 registered...
  try {
    const [rows] = await db.query("SELECT userID, firstName, lastName, username, points FROM User ORDER BY points DESC;");
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: 'Theres an error with the server' });
  }
});

router.get("/expand", checkAuthentication, async (req, res, next) => {
  let uuid = 0;
  try {
    uuid = Number(req.query.uuid);
  } catch (_) {
    console.error("Error parsing query parameter for user ID...");
  }
  try {
    // Exta user data
    const [extraFields] = await db.query("SELECT profile_picture_URL, country FROM User WHERE userID= ?", [uuid]);
    // Prediction count (which can count to points/pred).
    const [predCount] = await db.query("SELECT COUNT(userID) FROM History WHERE userID = ?", [uuid]);
    res.send({ extraFields: extraFields[0], predCount: predCount[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Failed to query db..." });
  }
});

module.exports = router;
