import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../../shared';

export const quotationsRouter = Router();

// GET /api/quotations
quotationsRouter.get('/', (_req: Request, res: Response) => {
  // TODO: Member 2 — implement quotation listing with filters
  sendSuccess(res, [], 'Quotations list endpoint — not yet implemented');
});

// POST /api/quotations
quotationsRouter.post('/', (_req: Request, res: Response) => {
  // TODO: Member 2 — implement quotation creation
  sendSuccess(res, null, 'Create quotation endpoint — not yet implemented');
});

// GET /api/quotations/:id
quotationsRouter.get('/:id', (_req: Request, res: Response) => {
  // TODO: Member 2 — implement quotation detail
  sendSuccess(res, null, 'Quotation detail endpoint — not yet implemented');
});

// PUT /api/quotations/:id
quotationsRouter.put('/:id', (_req: Request, res: Response) => {
  // TODO: Member 2 — implement quotation update
  sendSuccess(res, null, 'Update quotation endpoint — not yet implemented');
});

// POST /api/quotations/:id/submit
quotationsRouter.post('/:id/submit', (_req: Request, res: Response) => {
  // TODO: Member 2 — implement submit for approval
  sendSuccess(res, null, 'Submit quotation endpoint — not yet implemented');
});
