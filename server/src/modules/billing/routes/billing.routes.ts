import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../../shared';

export const billingRouter = Router();

// GET /api/billing/invoices
billingRouter.get('/invoices', (_req: Request, res: Response) => {
  // TODO: Member 3 — implement invoice listing
  sendSuccess(res, [], 'Invoices list endpoint — not yet implemented');
});

// GET /api/billing/invoices/:id
billingRouter.get('/invoices/:id', (_req: Request, res: Response) => {
  // TODO: Member 3 — implement invoice detail
  sendSuccess(res, null, 'Invoice detail endpoint — not yet implemented');
});

// GET /api/billing/subscriptions
billingRouter.get('/subscriptions', (_req: Request, res: Response) => {
  // TODO: Member 3 — implement subscription listing
  sendSuccess(res, [], 'Subscriptions list endpoint — not yet implemented');
});

// POST /api/billing/subscriptions
billingRouter.post('/subscriptions', (_req: Request, res: Response) => {
  // TODO: Member 3 — implement subscription creation
  sendSuccess(res, null, 'Create subscription endpoint — not yet implemented');
});

// GET /api/billing/credit-notes
billingRouter.get('/credit-notes', (_req: Request, res: Response) => {
  // TODO: Member 3 — implement credit note listing
  sendSuccess(res, [], 'Credit notes endpoint — not yet implemented');
});
