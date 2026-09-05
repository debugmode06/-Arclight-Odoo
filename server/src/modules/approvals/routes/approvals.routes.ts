import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../../shared';

export const approvalsRouter = Router();

// GET /api/approvals
approvalsRouter.get('/', (_req: Request, res: Response) => {
  // TODO: Member 2 — implement approvals listing for current user
  sendSuccess(res, [], 'Approvals list endpoint — not yet implemented');
});

// GET /api/approvals/:id
approvalsRouter.get('/:id', (_req: Request, res: Response) => {
  // TODO: Member 2 — implement approval detail
  sendSuccess(res, null, 'Approval detail endpoint — not yet implemented');
});

// POST /api/approvals/:id/approve
approvalsRouter.post('/:id/approve', (_req: Request, res: Response) => {
  // TODO: Member 2 — implement approval action
  sendSuccess(res, null, 'Approve endpoint — not yet implemented');
});

// POST /api/approvals/:id/reject
approvalsRouter.post('/:id/reject', (_req: Request, res: Response) => {
  // TODO: Member 2 — implement rejection action
  sendSuccess(res, null, 'Reject endpoint — not yet implemented');
});
