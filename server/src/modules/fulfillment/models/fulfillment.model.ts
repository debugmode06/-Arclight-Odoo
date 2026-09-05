import { Schema, model, Document, Types } from 'mongoose';

export type AllocationStatus = 'ALLOCATED' | 'SHIPPED' | 'BACKORDERED';
export type FulfillmentStatus =
  | 'PENDING'
  | 'ALLOCATED'
  | 'PARTIALLY_FULFILLED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'BACKORDERED'
  | 'CANCELLED';

export interface IStockAllocation {
  productId: Types.ObjectId;
  warehouseId: Types.ObjectId;
  quantityAllocated: number;
  shippingCost: number;
  status: AllocationStatus;
  shippedAt?: Date;
  trackingNumber?: string;
}

export interface IBackorderItem {
  productId: Types.ObjectId;
  quantityBackordered: number;
  reason: string;
  status: 'PENDING' | 'RESOLVED';
  resolvedAt?: Date;
}

export interface IFulfillment extends Document {
  fulfillmentNumber: string;
  quotationId: Types.ObjectId;
  customerId: Types.ObjectId;
  status: FulfillmentStatus;
  allocations: IStockAllocation[];
  backorders: IBackorderItem[];
  totalShipments: number;
  totalShippingCost: number;
  isManualOverride: boolean;
  notes?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const allocationSchema = new Schema<IStockAllocation>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    quantityAllocated: { type: Number, required: true, min: 1 },
    shippingCost: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['ALLOCATED', 'SHIPPED', 'BACKORDERED'],
      default: 'ALLOCATED',
    },
    shippedAt: { type: Date },
    trackingNumber: { type: String },
  },
  { _id: true }
);

const backorderSchema = new Schema<IBackorderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantityBackordered: { type: Number, required: true, min: 1 },
    reason: { type: String, required: true, default: 'Insufficient multi-warehouse inventory' },
    status: { type: String, enum: ['PENDING', 'RESOLVED'], default: 'PENDING' },
    resolvedAt: { type: Date },
  },
  { _id: true }
);

const fulfillmentSchema = new Schema<IFulfillment>(
  {
    fulfillmentNumber: { type: String, required: true, unique: true, uppercase: true },
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    status: {
      type: String,
      enum: ['PENDING', 'ALLOCATED', 'PARTIALLY_FULFILLED', 'SHIPPED', 'DELIVERED', 'BACKORDERED', 'CANCELLED'],
      default: 'PENDING',
    },
    allocations: [allocationSchema],
    backorders: [backorderSchema],
    totalShipments: { type: Number, required: true, default: 0 },
    totalShippingCost: { type: Number, required: true, default: 0 },
    isManualOverride: { type: Boolean, default: false },
    notes: { type: String },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

export const Fulfillment = model<IFulfillment>('Fulfillment', fulfillmentSchema);
