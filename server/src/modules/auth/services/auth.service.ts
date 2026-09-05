import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { env } from '../../../config/env.config';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../../../shared';
import { UserRole } from '../../../shared';

export interface AuthTokens {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    company?: string;
    customerId?: string;
  };
}

export class AuthService {
  public static async login(email: string, password: string): Promise<AuthTokens> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Your account has been deactivated. Please contact an administrator.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    return this.generateAuthResponse(user);
  }

  public static async signup(payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    company?: string;
  }): Promise<AuthTokens> {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw new BadRequestError('A user with this email address already exists');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      role: payload.role || UserRole.SALES_REP,
      company: payload.company?.trim(),
      isActive: true,
    });

    return this.generateAuthResponse(user);
  }

  public static async getMe(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      company: user.company,
      customerId: user.customerId?.toString(),
    };
  }

  private static generateAuthResponse(user: IUser): AuthTokens {
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: (env.JWT_EXPIRES_IN || '7d') as any }
    );

    return {
      accessToken: token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: user.company,
        customerId: user.customerId?.toString(),
      },
    };
  }
}
