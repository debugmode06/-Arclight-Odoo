import { FulfillmentRecord, AllocationRecommendation, InventoryItem, Warehouse } from '../types/fulfillment.types';
export declare const fulfillmentService: {
    getFulfillments(): Promise<FulfillmentRecord[]>;
    getFulfillmentById(id: string): Promise<FulfillmentRecord>;
    recommendAllocation(items: Array<{
        productId: string;
        quantity: number;
    }>): Promise<AllocationRecommendation>;
    confirmAllocation(data: {
        quotationId: string;
        customerId: string;
        allocations: Array<{
            productId: string;
            warehouseId: string;
            quantityAllocated: number;
            shippingCost?: number;
        }>;
        isManualOverride?: boolean;
        notes?: string;
    }): Promise<FulfillmentRecord>;
    shipFulfillment(id: string): Promise<FulfillmentRecord>;
    manualOverride(id: string, allocations: Array<{
        productId: string;
        warehouseId: string;
        quantityAllocated: number;
    }>, notes?: string): Promise<FulfillmentRecord>;
    getInventorySummary(): Promise<{
        warehouses: Warehouse[];
        inventory: InventoryItem[];
    }>;
    updateStock(productId: string, warehouseId: string, quantityAvailable: number, reorderPoint?: number, reorderQuantity?: number): Promise<InventoryItem>;
    getBackorders(): Promise<FulfillmentRecord[]>;
    getWarehouses(): Promise<Warehouse[]>;
    createWarehouse(data: Partial<Warehouse>): Promise<Warehouse>;
};
//# sourceMappingURL=fulfillment.service.d.ts.map