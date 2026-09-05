import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  total: number;
  isRecurring: boolean;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  quotationId?: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  invoiceType: 'ONE_TIME' | 'RECURRING' | 'HYBRID';
  lines: IInvoiceLine[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'PARTIALLY_PAID' | 'REFUNDED';
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation' },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    invoiceType: {
      type: String,
      enum: ['ONE_TIME', 'RECURRING', 'HYBRID'],
      default: 'HYBRID',
    },
    lines: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        discountAmount: { type: Number, default: 0 },
        total: { type: Number, required: true },
        isRecurring: { type: Boolean, default: false },
      },
    ],
    subtotal: { type: Number, required: true },
    discountTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['DRAFT', 'ISSUED', 'PAID', 'PARTIALLY_PAID', 'REFUNDED'],
      default: 'ISSUED',
    },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
