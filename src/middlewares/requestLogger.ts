import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  const originalSend = res.send;
  res.send = function (body) {
    logger.info(`Outgoing Response: ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`, {
      responseBody: body,
    });
    return originalSend.apply(res, arguments as any);
  };

  next();
};

export default requestLogger;