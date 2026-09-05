import { z } from 'zod';
import { UserRole } from '../../../shared';

// Public registration roles allowed (prevent unauthorized admin creation)
const ALLOWED_REGISTER_ROLES = [UserRole.SALES_REP, UserRole.CUSTOMER] as const;

export const registerSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters').max(100),
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address').toLowerCase().trim(),
  password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).optional().refine(
    (role) => !role || ALLOWED_REGISTER_ROLES.includes(role as typeof ALLOWED_REGISTER_ROLES[number]),
    { message: 'Public registration is restricted to SALES_REP or CUSTOMER role' }
  ),
});

export const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address').toLowerCase().trim(),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string({ required_error: 'Refresh token is required' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
