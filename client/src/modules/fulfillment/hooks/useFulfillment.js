import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fulfillmentService } from '../services/fulfillment.service';
export function useFulfillments() {
    return useQuery({
        queryKey: ['fulfillments'],
        queryFn: () => fulfillmentService.getFulfillments(),
    });
}
export function useFulfillmentDetail(id) {
    return useQuery({
        queryKey: ['fulfillment', id],
        queryFn: () => fulfillmentService.getFulfillmentById(id),
        enabled: !!id,
    });
}
export function useInventorySummary() {
    return useQuery({
        queryKey: ['fulfillment-inventory'],
        queryFn: () => fulfillmentService.getInventorySummary(),
    });
}
export function useBackorders() {
    return useQuery({
        queryKey: ['fulfillment-backorders'],
        queryFn: () => fulfillmentService.getBackorders(),
    });
}
export function useWarehouses() {
    return useQuery({
        queryKey: ['warehouses'],
        queryFn: () => fulfillmentService.getWarehouses(),
    });
}
export function useRecommendAllocation() {
    return useMutation({
        mutationFn: (items) => fulfillmentService.recommendAllocation(items),
    });
}
export function useConfirmAllocation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: fulfillmentService.confirmAllocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fulfillments'] });
            queryClient.invalidateQueries({ queryKey: ['fulfillment-inventory'] });
        },
    });
}
export function useShipFulfillment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fulfillmentService.shipFulfillment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fulfillments'] });
        },
    });
}
export function useUpdateStock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => fulfillmentService.updateStock(data.productId, data.warehouseId, data.quantityAvailable, data.reorderPoint, data.reorderQuantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fulfillment-inventory'] });
            queryClient.invalidateQueries({ queryKey: ['fulfillment-backorders'] });
        },
    });
}
//# sourceMappingURL=useFulfillment.js.map