const express = require('express');
const router = express.Router();
const UsersModel = require('../models/users');

// Login route
router.post('/login', (req, res) => {
    const {username, password} = req.body;
    UsersModel.findOne({username: username})
    .then(user => {
        if(user){
            if(password === password){
                res.json("Success")
            }
            else{
                res.json("The password is incorrect")
            }
        }else{
            res.json("No record existed")
        }
    })
});

// Register route
router.post('/register', (req, res) => {
    UsersModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err => res.json(err));
});

module.exports = router;
