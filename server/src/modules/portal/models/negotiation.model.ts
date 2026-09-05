import mongoose, { Schema, Document } from 'mongoose';

export interface INegotiationComment {
  id: string;
  lineId?: string;
  comment: string;
  createdAt: Date;
  authorName: string;
  isCustomer: boolean;
}

export interface INegotiationChangeRequest {
  id: string;
  lineId?: string;
  type: 'QUANTITY' | 'PRODUCT' | 'COMMERCIAL' | 'DELIVERY' | 'OTHER';
  description: string;
  requestedValue?: string | number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
}

export interface INegotiationCounterOffer {
  id: string;
  currentDiscount: number;
  proposedDiscount: number;
  reason: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'REVISION_REQUIRED';
  createdAt: Date;
}

export interface INegotiationTimelineEvent {
  id: string;
  event: string;
  description: string;
  timestamp: Date;
  actor: 'CUSTOMER' | 'SALES_REP' | 'SYSTEM' | 'MANAGER';
  customerVisible: boolean;
}

export interface INegotiation extends Document {
  quotationId: string;
  customerId: string;
  status: 'SENT' | 'UNDER NEGOTIATION' | 'CONFIRMED' | string;
  comments: INegotiationComment[];
  changeRequests: INegotiationChangeRequest[];
  counterOffer?: INegotiationCounterOffer;
  timeline: INegotiationTimelineEvent[];
  confirmedAt?: Date;
  customerNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NegotiationSchema: Schema = new Schema(
  {
    quotationId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    status: { type: String, default: 'UNDER NEGOTIATION' },
    comments: [
      {
        id: { type: String, required: true },
        lineId: { type: String },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        authorName: { type: String, required: true },
        isCustomer: { type: Boolean, default: true },
      },
    ],
    changeRequests: [
      {
        id: { type: String, required: true },
        lineId: { type: String },
        type: { type: String, required: true },
        description: { type: String, required: true },
        requestedValue: { type: Schema.Types.Mixed },
        status: { type: String, default: 'PENDING' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    counterOffer: {
      id: { type: String },
      currentDiscount: { type: Number },
      proposedDiscount: { type: Number },
      reason: { type: String },
      status: { type: String, default: 'PENDING' },
      createdAt: { type: Date, default: Date.now },
    },
    timeline: [
      {
        id: { type: String, required: true },
        event: { type: String, required: true },
        description: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        actor: { type: String, default: 'CUSTOMER' },
        customerVisible: { type: Boolean, default: true },
      },
    ],
    confirmedAt: { type: Date },
    customerNotes: { type: String },
  },
  { timestamps: true }
);

export const NegotiationModel =
  mongoose.models.Negotiation || mongoose.model<INegotiation>('Negotiation', NegotiationSchema);
