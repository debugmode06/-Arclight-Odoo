import { Schema, model, Document, Types } from 'mongoose';

export interface IInventory extends Document {
  warehouseId: Types.ObjectId;
  productId: Types.ObjectId;
  quantityAvailable: number;
  quantityReserved: number;
  reorderPoint: number;
  reorderQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantityAvailable: { type: Number, required: true, default: 0, min: 0 },
    quantityReserved: { type: Number, required: true, default: 0, min: 0 },
    reorderPoint: { type: Number, required: true, default: 10, min: 0 },
    reorderQuantity: { type: Number, required: true, default: 50, min: 0 },
  },
  { timestamps: true }
);

// Compound index to ensure 1 inventory record per product per warehouse
inventorySchema.index({ warehouseId: 1, productId: 1 }, { unique: true });

export const Inventory = model<IInventory>('Inventory', inventorySchema);
