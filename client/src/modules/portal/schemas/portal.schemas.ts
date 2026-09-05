import { z } from 'zod';

export const customerLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const lineCommentSchema = z.object({
  lineId: z.string().optional(),
  comment: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
});

export const changeRequestSchema = z.object({
  lineId: z.string().optional(),
  type: z.enum(['QUANTITY', 'PRODUCT', 'COMMERCIAL', 'DELIVERY', 'OTHER']),
  description: z.string().min(3, 'Please provide a clear description').max(1000),
  requestedValue: z.string().optional(),
});

export const counterOfferSchema = z.object({
  proposedDiscount: z.coerce.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%'),
  reason: z.string().min(5, 'Please provide a reason for the counter offer').max(1000),
});

export const confirmQuoteSchema = z.object({
  termsAccepted: z.boolean().refine((v) => v === true, {
    message: 'You must confirm acceptance of the terms to proceed',
  }),
  customerNotes: z.string().max(1000).optional(),
});

export type CustomerLoginFormValues = z.infer<typeof customerLoginSchema>;
export type LineCommentFormValues = z.infer<typeof lineCommentSchema>;
export type ChangeRequestFormValues = z.infer<typeof changeRequestSchema>;
export type CounterOfferFormValues = z.infer<typeof counterOfferSchema>;
export type ConfirmQuoteFormValues = z.infer<typeof confirmQuoteSchema>;
