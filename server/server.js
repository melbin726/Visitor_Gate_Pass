const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const UsersModel = require('./models/users');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(cors()); // Adjust to match your frontend's URL

mongoose.connect("mongodb://127.0.0.1:27017/visitor_management")
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    UsersModel.findOne({ username: username })
        .then(user => {
            if (!user) {
                return res.json("No record existed");
            }
            // Compare passwords using bcrypt.compare
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        res.json("Success");
                    } else {
                        res.json("The password is incorrect");
                    }
                })
                .catch(err => {
                    console.error('Password comparison error:', err);
                    res.status(500).json({ message: 'Internal server error' });
                });
        })
        .catch(err => {
            console.error('User lookup error:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

// Register route
app.post('/api/register', (req, res) => {
    UsersModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err));
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
