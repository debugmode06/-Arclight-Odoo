import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../../../middleware/auth.middleware';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', AuthController.login);

// POST /api/auth/signup
authRouter.post('/signup', AuthController.signup);

// POST /api/auth/logout
authRouter.post('/logout', AuthController.logout);

// GET /api/auth/me
authRouter.get('/me', requireAuth, AuthController.me);
