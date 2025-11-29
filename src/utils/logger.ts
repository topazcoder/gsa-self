// Express middleware for logging HTTP requests
import type { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
};
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info', // Default logging level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Log stack traces for errors
    format.splat(),
    format.json() // Output logs in JSON format for structured logging
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colorize output for console
        format.simple() // Simple format for console output
      ),
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to a file
    new transports.File({ filename: 'logs/combined.log' }), // Log all levels to another file
  ],
});

export default logger;