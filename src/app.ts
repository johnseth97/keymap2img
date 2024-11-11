// src/app.js

// 1. Load environment variables first
import 'dotenv/config';

import express from 'express';
import router from './routes/imageRoutes.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import logger from './utils/logger.js'; // Ensure this comes after dotenv

const app = express();
const PORT = process.env.PORT || 3000;

// Log the port to verify it's loaded correctly
logger.info(`Using PORT: ${PORT}`);

// Set HTTP Headers for security
app.use(helmet());

// Apply rate limiting to all requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Middleware to parse JSON (if needed in future)
app.use(express.json());

// Routes
app.use('/', router);

// Handle 404
app.use((req, res) => {
    res.status(404).send('Endpoint not found.');
});

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
