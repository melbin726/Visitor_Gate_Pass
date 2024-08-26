require("dotenv").config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const routes = require('./routes/auth.js'); // Adjust path as necessary
const connectDB = require('./config/db'); // Adjust path as necessary
const bodyParser = require('body-parser');

const app = express();

// Middleware
// Increase the limit for JSON payloads
app.use(bodyParser.json({ limit: '10mb' })); // or any limit you need

// Increase the limit for URL-encoded payloads
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cors({
    origin: true, // Adjust to your frontend's URL
    credentials: true // Allow credentials
}));

// Session middleware setup
app.use(session({
    secret: 'R@nd0m$tr1nG#f0rS3ss10ns', // Replace with a secure random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true in production if using HTTPS
}));

// Routes
app.use('/api', routes); // Mount main router

const PORT = process.env.PORT || 3001;

// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
