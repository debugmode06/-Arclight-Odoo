import { Router } from 'express';
import {
  registerHandler,
  loginHandler,
  refreshTokenHandler,
  logoutHandler,
  meHandler,
} from '../controllers/auth.controller';
import { registerSchema, loginSchema, refreshTokenSchema } from '../schemas/auth.schema';
import { validateBody } from '../../../shared';
import { requireAuth } from '../../../middleware/auth.middleware';

export const authRouter = Router();

// POST /api/auth/register — Public user registration
authRouter.post('/register', validateBody(registerSchema), registerHandler);

// POST /api/auth/login — User login
authRouter.post('/login', validateBody(loginSchema), loginHandler);

// POST /api/auth/refresh — Refresh access token
authRouter.post('/refresh', validateBody(refreshTokenSchema), refreshTokenHandler);

// POST /api/auth/logout — User logout
authRouter.post('/logout', requireAuth, logoutHandler);

// GET /api/auth/me — Get current user profile
authRouter.get('/me', requireAuth, meHandler);

