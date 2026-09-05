import mongoose, { Schema, Document } from 'mongoose';

export interface IFulfillmentLineAllocation {
  productId: mongoose.Types.ObjectId;
  warehouseId: mongoose.Types.ObjectId;
  allocatedQuantity: number;
  shippingCost: number;
}

export interface IFulfillmentBackorderItem {
  productId: mongoose.Types.ObjectId;
  orderedQuantity: number;
  allocatedQuantity: number;
  remainingQuantity: number;
  status: 'PENDING' | 'CONSOLIDATED';
}

export interface IFulfillment extends Document {
  quotationId: mongoose.Types.ObjectId;
  orderNumber: string;
  status: 'PENDING' | 'ALLOCATED' | 'PARTIAL' | 'SHIPPED' | 'DELIVERED';
  totalShipments: number;
  estimatedShippingCost: number;
  allocations: IFulfillmentLineAllocation[];
  backorders: IFulfillmentBackorderItem[];
  promisedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const fulfillmentSchema = new Schema<IFulfillment>(
  {
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation', required: true },
    orderNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['PENDING', 'ALLOCATED', 'PARTIAL', 'SHIPPED', 'DELIVERED'],
      default: 'PENDING',
    },
    totalShipments: { type: Number, default: 1 },
    estimatedShippingCost: { type: Number, default: 0 },
    allocations: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
        allocatedQuantity: { type: Number, required: true },
        shippingCost: { type: Number, default: 0 },
      },
    ],
    backorders: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        orderedQuantity: { type: Number, required: true },
        allocatedQuantity: { type: Number, required: true },
        remainingQuantity: { type: Number, required: true },
        status: { type: String, enum: ['PENDING', 'CONSOLIDATED'], default: 'PENDING' },
      },
    ],
    promisedDeliveryDate: { type: Date },
    actualDeliveryDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Fulfillment = mongoose.model<IFulfillment>('Fulfillment', fulfillmentSchema);
