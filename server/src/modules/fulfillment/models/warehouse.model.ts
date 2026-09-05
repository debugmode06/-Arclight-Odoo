import { Schema, model, Document } from 'mongoose';

export interface IWarehouse extends Document {
  code: string;
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contactEmail: string;
  contactPhone: string;
  shippingRatePerKm: number;
  shippingBaseFee: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const warehouseSchema = new Schema<IWarehouse>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true, default: 'USA' },
      zipCode: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    shippingRatePerKm: { type: Number, required: true, default: 0.5 },
    shippingBaseFee: { type: Number, required: true, default: 15.0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Warehouse = model<IWarehouse>('Warehouse', warehouseSchema);
