import { z } from 'zod';
import { QuotationStatus } from '../../../shared';

export const quotationLineSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  unitPrice: z.number().nonnegative('Unit price cannot be negative').optional(),
  discountPercent: z.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%').default(0),
  taxPercent: z.number().min(0).max(100).default(0).optional(),
});

export const createQuotationSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  currency: z.string().length(3).default('USD').optional(),
  priceListId: z.string().optional(),
  validUntil: z.string().datetime().or(z.string()).optional(),
  notes: z.string().max(1000).optional(),
  lines: z.array(quotationLineSchema).min(1, 'At least one line item is required'),
});

export const updateQuotationSchema = createQuotationSchema.partial();

export const listQuotationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  search: z.string().optional(),
  status: z.nativeEnum(QuotationStatus).optional(),
  customerId: z.string().optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
});
