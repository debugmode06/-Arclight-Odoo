import { z } from 'zod';

export const recommendAllocationSchema = z.object({
  quotationId: z.string().min(1, 'Quotation ID is required'),
});

export const manualAllocationOverrideSchema = z.object({
  allocations: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      warehouseId: z.string().min(1, 'Warehouse ID is required'),
      quantityAllocated: z.number().int().positive('Quantity must be positive'),
    })
  ).min(1, 'At least one allocation item is required'),
  notes: z.string().optional(),
});

export const updateInventorySchema = z.object({
  warehouseId: z.string().min(1, 'Warehouse ID is required'),
  quantityAvailable: z.number().int().min(0, 'Quantity available cannot be negative'),
  reorderPoint: z.number().int().min(0).optional(),
  reorderQuantity: z.number().int().min(0).optional(),
});

export const createWarehouseSchema = z.object({
  code: z.string().min(2, 'Warehouse code must be at least 2 characters'),
  name: z.string().min(2, 'Warehouse name is required'),
  location: z.object({
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().default('USA'),
    zipCode: z.string().min(1),
  }),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(5),
  shippingRatePerKm: z.number().min(0).default(0.5),
  shippingBaseFee: z.number().min(0).default(15.0),
});
