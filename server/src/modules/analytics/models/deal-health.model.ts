import mongoose, { Schema, Document } from 'mongoose';

export interface IDealHealthAlert extends Document {
  quotationId: mongoose.Types.ObjectId;
  alertType: 'STALLED_DEAL' | 'DISCOUNT_ANOMALY' | 'DELIVERY_SLIPPAGE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  status: 'OPEN' | 'NUDGED' | 'RESOLVED';
  suggestedAction: string;
  nudgedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const dealHealthAlertSchema = new Schema<IDealHealthAlert>(
  {
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation', required: true },
    alertType: {
      type: String,
      enum: ['STALLED_DEAL', 'DISCOUNT_ANOMALY', 'DELIVERY_SLIPPAGE'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['OPEN', 'NUDGED', 'RESOLVED'],
      default: 'OPEN',
    },
    suggestedAction: { type: String, required: true },
    nudgedAt: { type: Date },
  },
  { timestamps: true }
);

export const DealHealthAlert = mongoose.model<IDealHealthAlert>(
  'DealHealthAlert',
  dealHealthAlertSchema
);
