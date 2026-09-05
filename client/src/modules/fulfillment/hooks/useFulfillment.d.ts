export declare function useFulfillments(): import("@tanstack/react-query").UseQueryResult<import("..").FulfillmentRecord[], Error>;
export declare function useFulfillmentDetail(id: string): import("@tanstack/react-query").UseQueryResult<import("..").FulfillmentRecord, Error>;
export declare function useInventorySummary(): import("@tanstack/react-query").UseQueryResult<{
    warehouses: import("..").Warehouse[];
    inventory: import("..").InventoryItem[];
}, Error>;
export declare function useBackorders(): import("@tanstack/react-query").UseQueryResult<import("..").FulfillmentRecord[], Error>;
export declare function useWarehouses(): import("@tanstack/react-query").UseQueryResult<import("..").Warehouse[], Error>;
export declare function useRecommendAllocation(): import("@tanstack/react-query").UseMutationResult<import("..").AllocationRecommendation, Error, {
    productId: string;
    quantity: number;
}[], unknown>;
export declare function useConfirmAllocation(): import("@tanstack/react-query").UseMutationResult<import("..").FulfillmentRecord, Error, {
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
}, unknown>;
export declare function useShipFulfillment(): import("@tanstack/react-query").UseMutationResult<import("..").FulfillmentRecord, Error, string, unknown>;
export declare function useUpdateStock(): import("@tanstack/react-query").UseMutationResult<import("..").InventoryItem, Error, {
    productId: string;
    warehouseId: string;
    quantityAvailable: number;
    reorderPoint?: number;
    reorderQuantity?: number;
}, unknown>;
//# sourceMappingURL=useFulfillment.d.ts.map