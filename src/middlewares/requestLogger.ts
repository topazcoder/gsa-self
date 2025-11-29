import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  const originalSend = res.send;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.send = function (body: any, ...rest: any[]) {
      logger.info(`Outgoing Response: ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`, {
          responseBody: body,
        });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return originalSend.call(this, body, ...rest);
  };

  next();
};

export default requestLogger;