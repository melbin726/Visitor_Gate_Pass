// config/session.js

const session = require('express-session');

const sessionConfig = {
    secret: 'R@nd0m$tr1nG#f0rS3ss10ns', // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Set secure to true in production if using HTTPS
};

module.exports = session(sessionConfig);
