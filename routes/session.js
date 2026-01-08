const express = require('express');
const router = express.Router();

// Allows vue to get user data
router.get('/user', function (req, res) {
  // @ts-ignore
  if (req.session.user) {
    // @ts-ignore
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not authenticated!' });
  }
});

module.exports = router;
