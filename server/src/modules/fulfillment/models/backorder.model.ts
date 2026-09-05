import mongoose, { Schema, Document } from 'mongoose';

export interface IBackorder extends Document {
  quotationId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  orderedQuantity: number;
  allocatedQuantity: number;
  remainingQuantity: number;
  status: 'PENDING' | 'CONSOLIDATED';
  createdAt: Date;
  updatedAt: Date;
}

const backorderSchema = new Schema<IBackorder>(
  {
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    orderedQuantity: { type: Number, required: true },
    allocatedQuantity: { type: Number, required: true },
    remainingQuantity: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'CONSOLIDATED'], default: 'PENDING' },
  },
  { timestamps: true }
);

export const Backorder = mongoose.model<IBackorder>('Backorder', backorderSchema);
