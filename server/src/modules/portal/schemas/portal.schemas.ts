import { z } from 'zod';

export const portalLoginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export const lineCommentSchema = z.object({
  lineId: z.string().optional(),
  comment: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
});

export const changeRequestSchema = z.object({
  lineId: z.string().optional(),
  type: z.enum(['QUANTITY', 'PRODUCT', 'COMMERCIAL', 'DELIVERY', 'OTHER']),
  description: z.string().min(3, 'Description must be at least 3 characters').max(1000),
  requestedValue: z.union([z.string(), z.number()]).optional(),
});

export const counterOfferSchema = z.object({
  proposedDiscount: z.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%'),
  reason: z.string().min(5, 'Reason must be at least 5 characters long').max(1000),
});

export const confirmQuoteSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions to confirm the quotation',
  }),
  customerNotes: z.string().max(1000).optional(),
});
