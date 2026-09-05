import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../../shared';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (_req: Request, res: Response) => {
  // TODO: Member 1 — Implement login (validate credentials, issue JWT)
  sendSuccess(res, null, 'Auth login endpoint — not yet implemented');
});

// POST /api/auth/logout
authRouter.post('/logout', (_req: Request, res: Response) => {
  // TODO: Member 1 — Implement logout
  sendSuccess(res, null, 'Auth logout endpoint — not yet implemented');
});

// POST /api/auth/refresh
authRouter.post('/refresh', (_req: Request, res: Response) => {
  // TODO: Member 1 — Implement token refresh
  sendSuccess(res, null, 'Auth refresh endpoint — not yet implemented');
});

// GET /api/auth/me
authRouter.get('/me', (_req: Request, res: Response) => {
  // TODO: Member 1 — Implement get current user (requireAuth)
  sendSuccess(res, null, 'Auth me endpoint — not yet implemented');
});
