import mongoose, { Schema, Document } from 'mongoose';
import { CustomerTier } from '../../../shared';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone?: string;
  company: string;
  tier: CustomerTier;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, trim: true },
    company: { type: String, required: true, trim: true },
    tier: {
      type: String,
      enum: Object.values(CustomerTier),
      default: CustomerTier.STANDARD,
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>('Customer', customerSchema);
