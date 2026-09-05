import { Schema, model, Document, Types } from 'mongoose';

export type AllocationStatus = 'ALLOCATED' | 'SHIPPED' | 'BACKORDERED';
export type FulfillmentStatus =
  | 'PENDING'
  | 'ALLOCATED'
  | 'PARTIALLY_FULFILLED'
  | 'RELEASED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'BACKORDERED'
  | 'CANCELLED';

export type FulfillmentStrategy = 'DIRECT_SPLIT' | 'HUB_CONSOLIDATION';

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
  quantityFulfilled: number;
  reason: string;
  status: 'PENDING' | 'PARTIAL_FULFILLED' | 'RESOLVED' | 'FULFILLED';
  resolvedAt?: Date;
}

export interface IAuditTrailEntry {
  action: string;
  user: string;
  timestamp: Date;
  details: string;
  previousValue?: string;
  newValue?: string;
}

export interface IFulfillment extends Document {
  fulfillmentNumber: string;
  quotationId: Types.ObjectId;
  customerId: Types.ObjectId;
  status: FulfillmentStatus;
  strategy: FulfillmentStrategy;
  allocations: IStockAllocation[];
  backorders: IBackorderItem[];
  totalOrderedQty: number;
  totalAllocatedQty: number;
  totalFulfilledQty: number;
  totalBackorderedQty: number;
  totalShipments: number;
  totalShippingCost: number;
  isManualOverride: boolean;
  notes?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  auditTrail: IAuditTrailEntry[];
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
    quantityBackordered: { type: Number, required: true, min: 0 },
    quantityFulfilled: { type: Number, required: true, default: 0, min: 0 },
    reason: { type: String, required: true, default: 'Insufficient multi-warehouse inventory' },
    status: {
      type: String,
      enum: ['PENDING', 'PARTIAL_FULFILLED', 'RESOLVED', 'FULFILLED'],
      default: 'PENDING',
    },
    resolvedAt: { type: Date },
  },
  { _id: true }
);

const auditTrailSchema = new Schema<IAuditTrailEntry>(
  {
    action: { type: String, required: true },
    user: { type: String, required: true, default: 'Vikram Mehta (Logistics Manager)' },
    timestamp: { type: Date, default: Date.now },
    details: { type: String, required: true },
    previousValue: { type: String },
    newValue: { type: String },
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
      enum: [
        'PENDING',
        'ALLOCATED',
        'PARTIALLY_FULFILLED',
        'RELEASED',
        'SHIPPED',
        'DELIVERED',
        'BACKORDERED',
        'CANCELLED',
      ],
      default: 'PENDING',
    },
    strategy: {
      type: String,
      enum: ['DIRECT_SPLIT', 'HUB_CONSOLIDATION'],
      default: 'DIRECT_SPLIT',
    },
    allocations: [allocationSchema],
    backorders: [backorderSchema],
    totalOrderedQty: { type: Number, required: true, default: 10 },
    totalAllocatedQty: { type: Number, required: true, default: 0 },
    totalFulfilledQty: { type: Number, required: true, default: 0 },
    totalBackorderedQty: { type: Number, required: true, default: 0 },
    totalShipments: { type: Number, required: true, default: 0 },
    totalShippingCost: { type: Number, required: true, default: 0 },
    isManualOverride: { type: Boolean, default: false },
    notes: { type: String },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    auditTrail: [auditTrailSchema],
  },
  { timestamps: true }
);

export const Fulfillment = model<IFulfillment>('Fulfillment', fulfillmentSchema);
