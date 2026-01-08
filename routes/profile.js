const express = require('express');
const path = require("path");
const router = express.Router();
const checkAuthentication = require("../middleware/auth");
const bcrypt = require('bcrypt');
const db = require('../middleware/database');

// Get profile page
// @ts-ignore
router.get('/', checkAuthentication, function (req, res, next) {
  res.sendFile(path.join(__dirname, "../protected/profile.html"));
});

// Updates Username
// @ts-ignore
router.post('/updateUsername', checkAuthentication, async (req, res, next) => {
  const { username, userID } = req.body;
  try {
    await db.execute("UPDATE User SET username = ? WHERE userID = ?", [username, userID]);

    // Updates user session information
    // @ts-ignore
    if (req.session.user) {
      // @ts-ignore
      req.session.user.username = username;
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("Error updating username");
  }
});

// Updates First Name
// @ts-ignore
router.post('/updateFname', checkAuthentication, async (req, res, next) => {
  const { fname, userID } = req.body;
  console.log("Update request received with:", req.body);
  try {
    await db.execute("UPDATE User SET firstName = ? WHERE userID = ?", [fname, userID]);

    // Updates user session information
    // @ts-ignore
    if (req.session.user) {
      // @ts-ignore
      req.session.user.fname = fname;
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("Error updating first name");
  }
});

// Updates Last Name
// @ts-ignore
router.post('/updateLname', checkAuthentication, async (req, res, next) => {
  const { lname, userID } = req.body;
  console.log("Update request received with:", req.body);
  try {
    await db.execute("UPDATE User SET lastName = ? WHERE userID = ?", [lname, userID]);

    // Updates user session information
    // @ts-ignore
    if (req.session.user) {
      // @ts-ignore
      req.session.user.lname = lname;
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("Error updating last name");
  }
});

// Updates Email
// @ts-ignore
router.post('/updateEmail', checkAuthentication, async (req, res, next) => {
  const { email, userID } = req.body;
  console.log("Update request received with:", req.body);
  try {
    await db.execute("UPDATE User SET email = ? WHERE userID = ?", [email, userID]);

    // Updates user session information
    // @ts-ignore
    if (req.session.user) {
      // @ts-ignore
      req.session.user.email = email;
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("Error updating email");
  }
});

// Updates password
// @ts-ignore
router.post('/updatePassword', checkAuthentication, async (req, res, next) => {

  // @ts-ignore
  const { userID } = req.session.user;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    res.status(400).send("There are missing fields!");
    return;
  }

  if (newPassword !== confirmPassword) {
    res.status(400).send("The new password does not match!");
    return;
  }

  try {
    const [userPassword] = await db.execute('SELECT password FROM User WHERE userID = ?', [userID]);
    const encryptPassword = userPassword[0].password;

    const check = await bcrypt.compare(currentPassword, encryptPassword);
    if (!check) {
      res.status(400).send("This is not your current password!");
      return;
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db.execute("UPDATE User SET password = ? WHERE userID = ?", [newHash, userID]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("There was an error updating the password!");
  }
});

// Deletes User Account
// @ts-ignore
router.post('/deleteUser', checkAuthentication, async (req, res, next) => {
  // @ts-ignore
  const { userID } = req.session.user;
  try {
    await db.execute("DELETE FROM History WHERE userID = ?", [userID]);
    await db.execute("DELETE FROM Prediction WHERE userID = ?", [userID]);
    await db.execute("DELETE FROM User WHERE userID = ?", [userID]);
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).send("Error deleting user");
        return;
      }
      res.clearCookie('connect.sid');
      res.status(200).send("User deleted successfully");
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});


// Gets User's past predictions
// @ts-ignore
router.get('/history', checkAuthentication, async (req, res, next) => {
  // @ts-ignore
  const { userID } = req.session.user;
  try {
    const [rows] = await db.query(
      "select History.pointsAwarded, Prediction.location, Prediction.predictedDate, Prediction.pointsBetted From History INNER JOIN Prediction ON History.predID = Prediction.PredID WHERE Prediction.userID = ?",
      [userID]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching history");
  }
});


module.exports = router;

