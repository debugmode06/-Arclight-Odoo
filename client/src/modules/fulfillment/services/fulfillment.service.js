import apiClient, { extractData } from '@/services/api.client';
export const fulfillmentService = {
    async getFulfillments() {
        const res = await apiClient.get('/fulfillment');
        return extractData(res);
    },
    async getFulfillmentById(id) {
        const res = await apiClient.get(`/fulfillment/${id}`);
        return extractData(res);
    },
    async recommendAllocation(items) {
        const res = await apiClient.post('/fulfillment/recommend', { items });
        return extractData(res);
    },
    async confirmAllocation(data) {
        const res = await apiClient.post('/fulfillment/allocate', data);
        return extractData(res);
    },
    async shipFulfillment(id) {
        const res = await apiClient.post(`/fulfillment/${id}/ship`);
        return extractData(res);
    },
    async manualOverride(id, allocations, notes) {
        const res = await apiClient.post(`/fulfillment/${id}/override`, { allocations, notes });
        return extractData(res);
    },
    async getInventorySummary() {
        const res = await apiClient.get('/fulfillment/inventory');
        return extractData(res);
    },
    async updateStock(productId, warehouseId, quantityAvailable, reorderPoint, reorderQuantity) {
        const res = await apiClient.put(`/fulfillment/inventory/${productId}`, {
            warehouseId,
            quantityAvailable,
            reorderPoint,
            reorderQuantity,
        });
        return extractData(res);
    },
    async getBackorders() {
        const res = await apiClient.get('/fulfillment/backorders');
        return extractData(res);
    },
    async getWarehouses() {
        const res = await apiClient.get('/fulfillment/warehouses');
        return extractData(res);
    },
    async createWarehouse(data) {
        const res = await apiClient.post('/fulfillment/warehouses', data);
        return extractData(res);
    },
};
//# sourceMappingURL=fulfillment.service.js.map