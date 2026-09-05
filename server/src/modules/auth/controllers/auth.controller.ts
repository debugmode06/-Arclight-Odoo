import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../../../shared';

export class AuthController {
  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ success: false, error: { message: 'Email and password are required' } });
        return;
      }
      const result = await AuthService.login(email, password);
      sendSuccess(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  public static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, firstName, lastName, role, company } = req.body;
      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({
          success: false,
          error: { message: 'Email, password, first name and last name are required' },
        });
        return;
      }
      const result = await AuthService.signup({ email, password, firstName, lastName, role, company });
      res.status(201).json({
        success: true,
        data: result,
        message: 'Account created successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: { message: 'Authentication required' } });
        return;
      }
      const user = await AuthService.getMe(req.user.id);
      sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  public static async logout(_req: Request, res: Response): Promise<void> {
    sendSuccess(res, { loggedOut: true }, 'Logged out successfully');
  }
}
