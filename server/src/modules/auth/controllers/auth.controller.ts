import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendCreated } from '../../../shared';

export async function registerHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.register(req.body);
    sendCreated(res, result, 'User registered successfully');
  } catch (error) {
    next(error);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
}

export async function refreshTokenHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.refreshToken(req.body.refreshToken);
    sendSuccess(res, result, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
}

export async function logoutHandler(_req: Request, res: Response): Promise<void> {
  sendSuccess(res, null, 'Logged out successfully');
}

export async function meHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.getCurrentUser(req.user!.id);
    sendSuccess(res, { user });
  } catch (error) {
    next(error);
  }
}
