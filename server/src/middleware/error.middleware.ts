import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../shared/errors/app.error';
import { sendError, sendServerError } from '../shared/helpers/response.helper';
import { logger } from '../shared/utils/logger';
import { env } from '../config/env.config';

/**
 * Global error handler middleware.
 * Must be registered LAST in Express middleware chain.
 */
export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  logger.error('GlobalErrorHandler', `${req.method} ${req.path}`, err.message);

  // Operational errors (our AppError subclasses)
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.code, err.message);
    return;
  }

  // Zod validation errors (if not caught by middleware)
  if (err instanceof ZodError) {
    sendError(res, 400, 'VALIDATION_ERROR', 'Validation failed', err.flatten());
    return;
  }

  // Mongoose duplicate key error
  if ((err as NodeJS.ErrnoException).name === 'MongoServerError' && (err as unknown as { code: number }).code === 11000) {
    sendError(res, 409, 'CONFLICT', 'A resource with this identifier already exists');
    return;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    sendError(res, 400, 'BAD_REQUEST', 'Invalid ID format');
    return;
  }

  // Unknown errors — don't leak details in production
  if (env.isProduction) {
    sendServerError(res);
  } else {
    sendError(res, 500, 'SERVER_ERROR', err.message, {
      stack: err.stack,
    });
  }
}

/**
 * 404 handler for unmatched routes.
 */
export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`);
}
