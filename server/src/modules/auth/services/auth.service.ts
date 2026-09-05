import jwt from 'jsonwebtoken';
import { UserModel, hashPassword } from '../models/user.model';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { env } from '../../../config/env.config';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../../shared';
import { UserRole } from '../../../shared';

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface AuthResult extends AuthTokens {
  user: Record<string, unknown>;
}

export class AuthService {
  /**
   * Helper to sign access and refresh JWT tokens
   */
  private generateTokens(userId: string, email: string, role: UserRole): AuthTokens {
    const token = jwt.sign(
      { id: userId, email, role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    const refreshToken = jwt.sign(
      { id: userId, type: 'refresh' },
      env.JWT_REFRESH_SECRET || env.JWT_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    return { token, refreshToken };
  }

  /**
   * Register a new user
   */
  async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await UserModel.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new ConflictError('Email address is already registered');
    }

    const passwordHash = await hashPassword(input.password);
    const assignedRole = input.role || UserRole.SALES_REP;

    const user = await UserModel.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: assignedRole,
      isActive: true,
    });

    const tokens = this.generateTokens(user.id, user.email, user.role);

    return {
      user: user.toJSON(),
      ...tokens,
    };
  }

  /**
   * Login user with email & password
   */
  async login(input: LoginInput): Promise<AuthResult> {
    const user = await UserModel.findOne({ email: input.email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated. Please contact an administrator.');
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = this.generateTokens(user.id, user.email, user.role);

    return {
      user: user.toJSON(),
      ...tokens,
    };
  }

  /**
   * Refresh access token using valid refresh token
   */
  async refreshToken(refreshTokenStr: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(
        refreshTokenStr,
        env.JWT_REFRESH_SECRET || env.JWT_SECRET
      ) as { id: string };

      const user = await UserModel.findById(decoded.id);
      if (!user || !user.isActive) {
        throw new UnauthorizedError('Invalid or expired refresh token');
      }

      return this.generateTokens(user.id, user.email, user.role);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  /**
   * Fetch current authenticated user by ID
   */
  async getCurrentUser(userId: string): Promise<Record<string, unknown>> {
    const user = await UserModel.findById(userId);
    if (!user || !user.isActive) {
      throw new NotFoundError('User not found or inactive');
    }
    return user.toJSON();
  }
}

export const authService = new AuthService();
