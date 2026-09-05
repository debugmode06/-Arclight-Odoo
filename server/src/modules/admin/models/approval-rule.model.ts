import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../../shared';

export interface IApprovalRule extends Document {
  name: string;
  minDiscount: number;
  maxDiscount: number;
  requiredRole: UserRole;
  approvalOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const approvalRuleSchema = new Schema<IApprovalRule>(
  {
    name: { type: String, required: true, trim: true },
    minDiscount: { type: Number, required: true, default: 0 },
    maxDiscount: { type: Number, required: true, default: 100 },
    requiredRole: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.SALES_MANAGER,
    },
    approvalOrder: { type: Number, required: true, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ApprovalRule = mongoose.model<IApprovalRule>('ApprovalRule', approvalRuleSchema);
