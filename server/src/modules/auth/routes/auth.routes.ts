import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { env } from '../../../config/env.config';
import { sendSuccess, sendUnauthorized } from '../../../shared';
import { requireAuth } from '../../../middleware/auth.middleware';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendUnauthorized(res, 'Email and password are required');
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim(), isActive: true });
    if (!user) {
      sendUnauthorized(res, 'Invalid email or password');
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      sendUnauthorized(res, 'Invalid email or password');
      return;
    }

    const payload = { id: user._id.toString(), email: user.email, role: user.role };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });

    sendSuccess(res, {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    }, 'Login successful');
  } catch (err) {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', (_req: Request, res: Response): void => {
  sendSuccess(res, null, 'Logged out successfully');
});

// POST /api/auth/refresh
authRouter.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      sendUnauthorized(res, 'Refresh token required');
      return;
    }
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as any;
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      sendUnauthorized(res, 'Invalid refresh token');
      return;
    }
    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
    sendSuccess(res, { accessToken }, 'Token refreshed');
  } catch {
    sendUnauthorized(res, 'Invalid or expired refresh token');
  }
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as any).user?.id).select('-password');
    if (!user) {
      sendUnauthorized(res, 'User not found');
      return;
    }
    sendSuccess(res, {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }, 'Current user retrieved');
  } catch {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
});
