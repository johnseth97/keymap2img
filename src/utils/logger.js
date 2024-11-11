// src/utils/logger.ts

import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'debug', // Set the minimum log level
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

export default logger;
