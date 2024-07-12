// routes/auth.js

const express = require('express');
const router = express.Router();
const UsersModel = require('../models/users');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    UsersModel.findOne({ username: username })
        .then(user => {
            if (!user) {
                return res.json("No record existed");
            }
            // Compare passwords (in plain text)
            if (password === user.password) {
                // Set session
                req.session.user = {
                    username: user.username,
                    role: user.role
                    // Add any other user data you need in session
                };
                res.json("Success");
            } else {
                res.json("The password is incorrect");
            }
        })
        .catch(err => {
            console.error('User lookup error:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
    const { username, password, role } = req.body;

    // For now, store password as plain text (not recommended, for demo purposes only)
    UsersModel.create({ username, password, role })
        .then(user => res.status(201).json(user))
        .catch(err => res.status(400).json(err));
});

module.exports = router;