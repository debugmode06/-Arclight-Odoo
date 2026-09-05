import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { sendValidationError } from '../helpers/response.helper';

/**
 * Express middleware that validates req.body against a Zod schema.
 * Attaches validated data back to req.body on success.
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      sendValidationError(res, result.error.flatten());
      return;
    }
    req.body = result.data;
    next();
  };
}

/**
 * Express middleware that validates req.query against a Zod schema.
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      sendValidationError(res, result.error.flatten());
      return;
    }
    (req as unknown as Record<string, unknown>).validatedQuery = result.data;
    next();
  };
}

/**
 * Common pagination query schema
 */
export const paginationSchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform((v) => (v ? Math.min(parseInt(v, 10), 100) : 20)),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;
