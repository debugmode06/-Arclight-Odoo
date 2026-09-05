import mongoose, { Schema, Document, Types } from 'mongoose';
import { QuotationStatus } from '../../../shared';
import { IQuotationLine, quotationLineSchema } from './quotation-line.model';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IQuotation extends Document {
  quotationNumber: string;
  customerId: Types.ObjectId;
  currency: string;
  priceListId?: Types.ObjectId;
  status: QuotationStatus;
  lines: IQuotationLine[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  costTotal: number;
  grossMargin: number;
  grossMarginPercent: number;
  discountRiskScore: number;
  discountRiskLevel: RiskLevel;
  discountRiskFactors: string[];
  approvalRequired: boolean;
  currentApprovalRequestId?: Types.ObjectId;
  validUntil?: Date;
  notes?: string;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const quotationSchema = new Schema<IQuotation>(
  {
    quotationNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    currency: { type: String, default: 'USD', uppercase: true, trim: true },
    priceListId: { type: Schema.Types.ObjectId, ref: 'PriceList' },
    status: {
      type: String,
      enum: Object.values(QuotationStatus),
      default: QuotationStatus.DRAFT,
      required: true,
    },
    lines: { type: [quotationLineSchema], default: [] },
    subtotal: { type: Number, required: true, default: 0 },
    totalDiscount: { type: Number, required: true, default: 0 },
    totalTax: { type: Number, required: true, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 },
    costTotal: { type: Number, required: true, default: 0 },
    grossMargin: { type: Number, required: true, default: 0 },
    grossMarginPercent: { type: Number, required: true, default: 0 },
    discountRiskScore: { type: Number, required: true, default: 0, min: 0, max: 100 },
    discountRiskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW',
      required: true,
    },
    discountRiskFactors: { type: [String], default: [] },
    approvalRequired: { type: Boolean, default: false },
    currentApprovalRequestId: { type: Schema.Types.ObjectId, ref: 'ApprovalRequest' },
    validUntil: { type: Date },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

quotationSchema.index({ customerId: 1, status: 1 });
quotationSchema.index({ createdBy: 1, createdAt: -1 });

export const Quotation = mongoose.model<IQuotation>('Quotation', quotationSchema);
