// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const imageRoutes = require('./routes/imageRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Set HTTP Headers for security
app.use(helmet());

// Apply rate limiting to all requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON (if needed in future)
app.use(express.json());

// Routes
app.use('/', imageRoutes);

// Handle 404
app.use((req, res) => {
    res.status(404).send('Endpoint not found.');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
