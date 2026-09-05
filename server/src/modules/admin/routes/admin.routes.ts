import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../../shared';

export const adminRouter = Router();

// GET /api/admin/users
adminRouter.get('/users', (_req: Request, res: Response) => {
  // TODO: Member 1 — requireAuth + requireRole(ADMIN)
  sendSuccess(res, [], 'Admin users endpoint — not yet implemented');
});

// GET /api/admin/products
adminRouter.get('/products', (_req: Request, res: Response) => {
  // TODO: Member 1 — implement product listing
  sendSuccess(res, [], 'Admin products endpoint — not yet implemented');
});

// GET /api/admin/categories
adminRouter.get('/categories', (_req: Request, res: Response) => {
  // TODO: Member 1 — implement category listing
  sendSuccess(res, [], 'Admin categories endpoint — not yet implemented');
});

// GET /api/admin/price-lists
adminRouter.get('/price-lists', (_req: Request, res: Response) => {
  // TODO: Member 1 — implement price list listing
  sendSuccess(res, [], 'Admin price-lists endpoint — not yet implemented');
});

// GET /api/admin/warehouses
adminRouter.get('/warehouses', (_req: Request, res: Response) => {
  // TODO: Member 1 — implement warehouse listing
  sendSuccess(res, [], 'Admin warehouses endpoint — not yet implemented');
});
