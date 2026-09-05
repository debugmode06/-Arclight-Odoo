import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  warehouseId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  availableQuantity: number;
  reservedQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    availableQuantity: { type: Number, required: true, default: 0, min: 0 },
    reservedQuantity: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

inventorySchema.index({ warehouseId: 1, productId: 1 }, { unique: true });

export const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);
