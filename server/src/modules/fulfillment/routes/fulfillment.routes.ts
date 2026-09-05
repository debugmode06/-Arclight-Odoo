import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../../shared';

export const fulfillmentRouter = Router();

// GET /api/fulfillment
fulfillmentRouter.get('/', (_req: Request, res: Response) => {
  // TODO: Member 3 — implement fulfillment listing
  sendSuccess(res, [], 'Fulfillment list endpoint — not yet implemented');
});

// GET /api/fulfillment/inventory
fulfillmentRouter.get('/inventory', (_req: Request, res: Response) => {
  // TODO: Member 3 — implement inventory summary
  sendSuccess(res, [], 'Inventory endpoint — not yet implemented');
});

// GET /api/fulfillment/backorders
fulfillmentRouter.get('/backorders', (_req: Request, res: Response) => {
  // TODO: Member 3 — implement backorders listing
  sendSuccess(res, [], 'Backorders endpoint — not yet implemented');
});

// GET /api/fulfillment/:id
fulfillmentRouter.get('/:id', (_req: Request, res: Response) => {
  // TODO: Member 3 — implement fulfillment detail
  sendSuccess(res, null, 'Fulfillment detail endpoint — not yet implemented');
});

// POST /api/fulfillment/:id/allocate
fulfillmentRouter.post('/:id/allocate', (_req: Request, res: Response) => {
  // TODO: Member 3 — implement stock allocation
  sendSuccess(res, null, 'Allocate endpoint — not yet implemented');
});
