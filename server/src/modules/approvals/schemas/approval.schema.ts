import { z } from 'zod';
import { ApprovalStatus } from '../../../shared';

export const approvalActionSchema = z.object({
  comment: z.string().trim().min(1, 'Review comment is required').max(1000),
});

export const listApprovalsQuerySchema = z.object({
  status: z.nativeEnum(ApprovalStatus).optional(),
  quotationId: z.string().optional(),
});
