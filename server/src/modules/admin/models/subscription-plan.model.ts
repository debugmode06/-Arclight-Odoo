import mongoose, { Schema, Document } from 'mongoose';

export type BillingCycle = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface ISubscriptionPlan extends Document {
  name: string;
  code: string;
  billingCycle: BillingCycle;
  basePrice: number;
  description: string;
  prorationRule: string;
  cancellationRefundWindowDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    billingCycle: {
      type: String,
      enum: ['MONTHLY', 'QUARTERLY', 'YEARLY'],
      required: true,
      default: 'MONTHLY',
    },
    basePrice: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    prorationRule: { type: String, default: 'DAILY_PRO_RATA' },
    cancellationRefundWindowDays: { type: Number, default: 30 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SubscriptionPlan = mongoose.model<ISubscriptionPlan>('SubscriptionPlan', subscriptionPlanSchema);
