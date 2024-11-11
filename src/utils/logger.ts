// src/utils/logger.ts

import { createLogger, format, transports } from 'winston';

// Set the log level via an environment variable
const logLevel = process.env.LOG_LEVEL || 'info';

const logger = createLogger({
    level: logLevel,

    format: format.combine(
        format.timestamp(),
        format.printf(
            ({ timestamp, level, message }) =>
                `${timestamp} [${level.toUpperCase()}]: ${message}`
        )
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/app.log' }),
    ],
});

// Log warnings if LOG_LEVEL is not set
if (!process.env.LOG_LEVEL) {
    logger.warn(
        'Environment variable LOG_LEVEL is not set. Defaulting to info.'
    );
}

// Log the current log level for verification
logger.info(`LOG_LEVEL is set to: ${logLevel}`);

export default logger;
