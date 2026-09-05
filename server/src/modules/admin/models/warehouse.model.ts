import mongoose, { Schema, Document } from 'mongoose';

export interface IWarehouse extends Document {
  name: string;
  code: string;
  location: string;
  capacity: number;
  shippingCostWeight: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const warehouseSchema = new Schema<IWarehouse>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    location: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, default: 10000 },
    shippingCostWeight: { type: Number, required: true, default: 1.0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Warehouse = mongoose.model<IWarehouse>('Warehouse', warehouseSchema);
