import { Schema, Types } from 'mongoose';

export type GovernanceDecision = 'WITHIN_LIMIT' | 'APPROVAL_REQUIRED' | 'BLOCKED';

export interface IQuotationLine {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  productNameSnapshot: string;
  productSkuSnapshot: string;
  productCategorySnapshot?: string;
  quantity: number;
  unitPrice: number;
  costPriceSnapshot: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  lineSubtotal: number;
  lineTotal: number;
  lineCost: number;
  lineMargin: number;
  lineMarginPercent: number;
  appliedRuleNameSnapshot?: string;
  maxAllowedDiscountSnapshot?: number;
  approvalThresholdDiscountSnapshot?: number;
  governanceDecision: GovernanceDecision;
  governanceReason?: string;
}

export const quotationLineSchema = new Schema<IQuotationLine>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productNameSnapshot: { type: String, required: true },
    productSkuSnapshot: { type: String, required: true },
    productCategorySnapshot: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    costPriceSnapshot: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    discountAmount: { type: Number, default: 0, min: 0 },
    taxPercent: { type: Number, default: 0, min: 0, max: 100 },
    taxAmount: { type: Number, default: 0, min: 0 },
    lineSubtotal: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
    lineCost: { type: Number, required: true, min: 0 },
    lineMargin: { type: Number, required: true },
    lineMarginPercent: { type: Number, required: true },
    appliedRuleNameSnapshot: { type: String },
    maxAllowedDiscountSnapshot: { type: Number },
    approvalThresholdDiscountSnapshot: { type: Number },
    governanceDecision: {
      type: String,
      enum: ['WITHIN_LIMIT', 'APPROVAL_REQUIRED', 'BLOCKED'],
      default: 'WITHIN_LIMIT',
      required: true,
    },
    governanceReason: { type: String },
  },
  { _id: true }
);
