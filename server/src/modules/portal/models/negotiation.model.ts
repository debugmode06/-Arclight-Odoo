import mongoose, { Schema, Document } from 'mongoose';

export interface INegotiationMessage {
  senderRole: 'CUSTOMER' | 'SALES_REP';
  senderName: string;
  text: string;
  counterDiscountPercent?: number;
  lineId?: string;
  createdAt: Date;
}

export interface INegotiation extends Document {
  quotationId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  status: 'OPEN' | 'IN_REVIEW' | 'ACCEPTED' | 'REJECTED';
  messages: INegotiationMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const negotiationSchema = new Schema<INegotiation>(
  {
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    status: {
      type: String,
      enum: ['OPEN', 'IN_REVIEW', 'ACCEPTED', 'REJECTED'],
      default: 'OPEN',
    },
    messages: [
      {
        senderRole: { type: String, enum: ['CUSTOMER', 'SALES_REP'], required: true },
        senderName: { type: String, required: true },
        text: { type: String, required: true },
        counterDiscountPercent: { type: Number },
        lineId: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Negotiation = mongoose.model<INegotiation>('Negotiation', negotiationSchema);
