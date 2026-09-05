import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  customerId: mongoose.Types.ObjectId;
  quotationId?: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  planName: string;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  quantity: number;
  cycleAmount: number;
  status: 'ACTIVE' | 'MODIFIED' | 'CANCELLED';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  proratedCreditNoteAmount?: number;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation' },
    planId: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    planName: { type: String, required: true },
    billingCycle: {
      type: String,
      enum: ['MONTHLY', 'QUARTERLY', 'YEARLY'],
      required: true,
      default: 'MONTHLY',
    },
    quantity: { type: Number, required: true, default: 1 },
    cycleAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'MODIFIED', 'CANCELLED'],
      default: 'ACTIVE',
    },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    proratedCreditNoteAmount: { type: Number, default: 0 },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
