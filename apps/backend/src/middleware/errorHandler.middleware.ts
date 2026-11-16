import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined
});

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const correlationId = (req.headers['x-correlation-id'] as string) || `req-${Date.now()}`;
  
  logger.error({
    correlationId,
    path: req.path,
    method: req.method,
    error: err.message || err,
    stack: err.stack
  }, 'Unhandled request error');

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || err.statusCode || 500;
  const clientMessage = statusCode >= 500 
    ? 'An unexpected error occurred. Please try again shortly.'
    : (err.message || 'Request could not be processed.');

  return res.status(statusCode).json({
    error: err.name || 'Error',
    message: clientMessage,
    correlationId
  });
}
