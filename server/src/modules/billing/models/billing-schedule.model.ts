import mongoose, { Schema, Document } from 'mongoose';

export interface IBillingSchedule extends Document {
  subscriptionId: mongoose.Types.ObjectId;
  periodName: string;
  billingDate: Date;
  amount: number;
  status: 'UPCOMING' | 'SCHEDULED' | 'PAID';
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const billingScheduleSchema = new Schema<IBillingSchedule>(
  {
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
    periodName: { type: String, required: true },
    billingDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['UPCOMING', 'SCHEDULED', 'PAID'],
      default: 'SCHEDULED',
    },
    paidDate: { type: Date },
  },
  { timestamps: true }
);

export const BillingSchedule = mongoose.model<IBillingSchedule>(
  'BillingSchedule',
  billingScheduleSchema
);
