// src/app.js
import express from 'express';
import dotenv from 'dotenv';
import process from 'process';
import router from './routes/imageRoutes';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// --fix-- Replace the following code in src/app.js:

// Load environment variables
dotenv.config();

const app = express();

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
