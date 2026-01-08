const express = require('express');
const path = require("path");
const router = express.Router();
const db = require('../middleware/database');
const bcrypt = require('bcrypt');

// Get login page
router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, "../public/login.html"));
});


// Gets user entered information and compares it against current entries in the database
router.post('/', async function (req, res, next) {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query(
            'SELECT * FROM User WHERE email = ?', // Queries database using email
            [email]
        );

        // @ts-ignore
        if (rows.length === 0) {
            res.status(401).json({ success: false, message: 'Incorrect email or password!' });
            return;
        }
        // Compares hashed passwords
        const matchPassword = await bcrypt.compare(password, rows[0].password);

        if (matchPassword) {
            // Setting up session information for users
            // @ts-ignore
            req.session.user = {

                userID: rows[0].userID,
                username: rows[0].username,
                fname: rows[0].firstName,
                lname: rows[0].lastName,
                email: rows[0].email,
                country: rows[0].country,
                city: rows[0].location,
                points: rows[0].points,
                profile: rows[0].profile_picture_URL
            };

            res.json({ redirect: '/dashboard' }); // Successful login occurs, redirects to dashboard
        } else { res.status(401).json({ success: false, message: 'Incorrect email or password!' }); }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Theres an error with the server' });
    }
});

// Delete session cookie when logged out
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ message: 'There was an error with the server - logout failed' });
            return;
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'You successfully logged out!' });
    });
});


module.exports = router;
