import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../../shared';

export const portalRouter = Router();

// POST /api/portal/auth/login
portalRouter.post('/auth/login', (_req: Request, res: Response) => {
  // TODO: Member 4 — implement customer portal login
  sendSuccess(res, null, 'Portal login endpoint — not yet implemented');
});

// GET /api/portal/quotes
portalRouter.get('/quotes', (_req: Request, res: Response) => {
  // TODO: Member 4 — implement customer quotes listing (CUSTOMER role)
  sendSuccess(res, [], 'Portal quotes endpoint — not yet implemented');
});

// GET /api/portal/quotes/:id
portalRouter.get('/quotes/:id', (_req: Request, res: Response) => {
  // TODO: Member 4 — implement customer quote detail
  sendSuccess(res, null, 'Portal quote detail endpoint — not yet implemented');
});

// POST /api/portal/quotes/:id/accept
portalRouter.post('/quotes/:id/accept', (_req: Request, res: Response) => {
  // TODO: Member 4 — implement quote acceptance
  sendSuccess(res, null, 'Portal accept quote endpoint — not yet implemented');
});

// POST /api/portal/quotes/:id/negotiate
portalRouter.post('/quotes/:id/negotiate', (_req: Request, res: Response) => {
  // TODO: Member 4 — implement negotiation request
  sendSuccess(res, null, 'Portal negotiate endpoint — not yet implemented');
});
