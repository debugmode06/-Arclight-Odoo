import mongoose, { Schema, Document, Types } from 'mongoose';
import { CustomerTier } from '../../../shared';

export interface IDiscountRule extends Document {
  name: string;
  description?: string;
  priority: number; // 1 (highest) to 7 (lowest)
  customerId?: Types.ObjectId;
  customerTier?: CustomerTier;
  productId?: Types.ObjectId;
  categoryId?: Types.ObjectId;
  maxAllowedDiscount: number; // Hard ceiling — above this is BLOCKED (e.g., 25)
  approvalThresholdDiscount: number; // Discretionary limit — above this requires APPROVAL (e.g., 10)
  minMarginPercent: number; // Minimum acceptable margin % (e.g., 20)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const discountRuleSchema = new Schema<IDiscountRule>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    priority: { type: Number, required: true, default: 7 },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    customerTier: { type: String, enum: Object.values(CustomerTier) },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    maxAllowedDiscount: { type: Number, required: true, min: 0, max: 100 },
    approvalThresholdDiscount: { type: Number, required: true, min: 0, max: 100 },
    minMarginPercent: { type: Number, required: true, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound index for rule lookup
discountRuleSchema.index({ customerId: 1, productId: 1, categoryId: 1, customerTier: 1, isActive: 1 });

export const DiscountRule = mongoose.model<IDiscountRule>('DiscountRule', discountRuleSchema);
