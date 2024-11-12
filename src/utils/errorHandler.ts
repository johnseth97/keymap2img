// src/utils/errorHandler.ts

import { Response } from 'express';
import logger from './logger.js';

/**
 * Handles errors by logging and sending an appropriate response.
 * @param error - The error object.
 * @param res - The Express response object.
 */
export function handleError(error: unknown, res: Response): void {
    if (error instanceof Error) {
        logger.error(`An error occurred: ${error.message}`);
        res.status(500).send(`Error generating image: ${error.message}`);
    } else {
        logger.error('An unknown error occurred.');
        res.status(500).send('Error generating image.');
    }
}
