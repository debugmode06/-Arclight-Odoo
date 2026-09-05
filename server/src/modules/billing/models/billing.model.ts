import { Schema, model, Document, Types } from 'mongoose';

export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type SubscriptionTier = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';

export interface IUsageMetrics {
  ordersProcessed: number;
  warehouseStoragePallets: number;
  apiCalls: number;
  freightSurcharge: number;
}

export interface IInvoiceLineItem {
  description: string;
  category: 'SUBSCRIPTION' | 'USAGE' | 'SETUP' | 'FREIGHT' | 'DISCOUNT';
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  customerId?: Types.ObjectId;
  customerName: string;
  billingPeriod: string;
  subscriptionPlan: SubscriptionTier;
  baseSubscriptionFee: number;
  setupFee: number;
  usageMetrics: IUsageMetrics;
  lineItems: IInvoiceLineItem[];
  subtotal: number;
  taxRate: number; // e.g., 0.18 for 18% GST
  taxAmount: number;
  discountAmount: number;
  totalPayable: number;
  status: InvoiceStatus;
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceLineItemSchema = new Schema<IInvoiceLineItem>(
  {
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['SUBSCRIPTION', 'USAGE', 'SETUP', 'FREIGHT', 'DISCOUNT'],
      required: true,
    },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true, default: 0 },
    amount: { type: Number, required: true, default: 0 },
  },
  { _id: true }
);

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true, uppercase: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, required: true, default: 'Acme Industries Ltd.' },
    billingPeriod: { type: String, required: true, default: 'Sep 2026' },
    subscriptionPlan: {
      type: String,
      enum: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
      default: 'PROFESSIONAL',
    },
    baseSubscriptionFee: { type: Number, required: true, default: 499 },
    setupFee: { type: Number, required: true, default: 1200 },
    usageMetrics: {
      ordersProcessed: { type: Number, default: 2450 },
      warehouseStoragePallets: { type: Number, default: 45 },
      apiCalls: { type: Number, default: 120000 },
      freightSurcharge: { type: Number, default: 180 },
    },
    lineItems: [invoiceLineItemSchema],
    subtotal: { type: Number, required: true, default: 0 },
    taxRate: { type: Number, required: true, default: 0.18 },
    taxAmount: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, required: true, default: 0 },
    totalPayable: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED'],
      default: 'PENDING',
    },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export const Invoice = model<IInvoice>('Invoice', invoiceSchema);
