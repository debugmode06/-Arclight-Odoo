import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  categoryId: Types.ObjectId;
  basePrice: number; // in minor units / cents or 2-decimal dollars
  costPrice: number; // cost of goods sold
  unit: string;
  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    basePrice: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, required: true, min: 0 },
    unit: { type: String, default: 'unit' },
    isActive: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
