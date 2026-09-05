export type FulfillmentStatus = 'PENDING' | 'ALLOCATED' | 'PARTIALLY_FULFILLED' | 'SHIPPED' | 'DELIVERED' | 'BACKORDERED' | 'CANCELLED';
export type AllocationStatus = 'ALLOCATED' | 'SHIPPED' | 'BACKORDERED';
export interface Warehouse {
    _id: string;
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
}
export interface InventoryItem {
    _id: string;
    warehouseId: Warehouse | string;
    productId: {
        _id: string;
        name: string;
        sku: string;
        basePrice: number;
        unit: string;
    } | string;
    quantityAvailable: number;
    quantityReserved: number;
    reorderPoint: number;
    reorderQuantity: number;
}
export interface StockAllocation {
    _id?: string;
    productId: {
        _id: string;
        name: string;
        sku: string;
    } | string;
    warehouseId: {
        _id: string;
        name: string;
        code: string;
    } | string;
    quantityAllocated: number;
    shippingCost: number;
    status: AllocationStatus;
    shippedAt?: string;
    trackingNumber?: string;
}
export interface BackorderItem {
    _id?: string;
    productId: {
        _id: string;
        name: string;
        sku: string;
    } | string;
    quantityBackordered: number;
    reason: string;
    status: 'PENDING' | 'RESOLVED';
    resolvedAt?: string;
}
export interface FulfillmentRecord {
    _id: string;
    fulfillmentNumber: string;
    quotationId: {
        _id: string;
        quotationNumber: string;
        total: number;
    } | string;
    customerId: {
        _id: string;
        name: string;
        company: string;
    } | string;
    status: FulfillmentStatus;
    allocations: StockAllocation[];
    backorders: BackorderItem[];
    totalShipments: number;
    totalShippingCost: number;
    isManualOverride: boolean;
    notes?: string;
    shippedAt?: string;
    deliveredAt?: string;
    createdAt: string;
    updatedAt: string;
}
export interface AllocationRecommendation {
    allocations: Array<{
        productId: string;
        warehouseId: string;
        warehouseName: string;
        warehouseCode: string;
        quantityAllocated: number;
        shippingCost: number;
        status: AllocationStatus;
    }>;
    backorders: Array<{
        productId: string;
        quantityBackordered: number;
        reason: string;
    }>;
    totalShipments: number;
    totalShippingCost: number;
    isSplitRequired: boolean;
    canFulfillCompletely: boolean;
}
//# sourceMappingURL=fulfillment.types.d.ts.map