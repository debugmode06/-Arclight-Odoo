import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  invoiceId: mongoose.Types.ObjectId;
  quotationId?: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: 'CREDIT_CARD' | 'ACH_TRANSFER' | 'WIRE' | 'CHECK';
  transactionReference: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation' },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['CREDIT_CARD', 'ACH_TRANSFER', 'WIRE', 'CHECK'],
      default: 'WIRE',
    },
    transactionReference: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
