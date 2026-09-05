import apiClient, { extractData } from '@/services/api.client';
import { ApiResponse } from '@/types';
import {
  FulfillmentRecord,
  AllocationRecommendation,
  InventoryItem,
  Warehouse,
} from '../types/fulfillment.types';

export const fulfillmentService = {
  async getLatestFulfillment(fulfillmentNumber?: string): Promise<any> {
    const res = await apiClient.get<ApiResponse<any>>('/fulfillment/current', {
      params: { fulfillmentNumber },
    });
    return extractData(res);
  },

  async getFulfillments(): Promise<FulfillmentRecord[]> {
    const res = await apiClient.get<ApiResponse<FulfillmentRecord[]>>('/fulfillment');
    return extractData(res);
  },

  async getFulfillmentById(id: string): Promise<FulfillmentRecord> {
    const res = await apiClient.get<ApiResponse<FulfillmentRecord>>(`/fulfillment/${id}`);
    return extractData(res);
  },

  async recommendAllocation(payload: {
    items: Array<{ productId: string; quantity: number }>;
    strategy?: 'DIRECT_SPLIT' | 'HUB_CONSOLIDATION';
    depotAQtyOverride?: number;
  }): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>('/fulfillment/recommend', payload);
    return extractData(res);
  },

  async confirmAllocation(data: {
    fulfillmentNumber?: string;
    quotationId?: string;
    customerId?: string;
    allocations: Array<{ productId: string; warehouseId: string; quantityAllocated: number; shippingCost?: number }>;
    strategy?: 'DIRECT_SPLIT' | 'HUB_CONSOLIDATION';
    isManualOverride?: boolean;
    notes?: string;
  }): Promise<FulfillmentRecord> {
    const res = await apiClient.post<ApiResponse<FulfillmentRecord>>('/fulfillment/allocate', data);
    return extractData(res);
  },

  async shipFulfillment(id: string): Promise<FulfillmentRecord> {
    const res = await apiClient.post<ApiResponse<FulfillmentRecord>>(`/fulfillment/${id}/ship`);
    return extractData(res);
  },

  async manualOverride(data: {
    fulfillmentNumber?: string;
    depotAQty: number;
    depotBQty: number;
    notes?: string;
  }): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>('/fulfillment/override', data);
    return extractData(res);
  },

  async restoreSplit(fulfillmentNumber?: string): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>('/fulfillment/restore-split', { fulfillmentNumber });
    return extractData(res);
  },

  async receiveStock(data: {
    warehouseId: string;
    productId: string;
    receivedQty: number;
  }): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>('/fulfillment/inventory/receive', data);
    return extractData(res);
  },

  async getInventorySummary(): Promise<{ warehouses: Warehouse[]; inventory: InventoryItem[] }> {
    const res = await apiClient.get<ApiResponse<{ warehouses: Warehouse[]; inventory: InventoryItem[] }>>('/fulfillment/inventory');
    return extractData(res);
  },

  async updateStock(productId: string, warehouseId: string, quantityAvailable: number, reorderPoint?: number, reorderQuantity?: number): Promise<InventoryItem> {
    const res = await apiClient.put<ApiResponse<InventoryItem>>(`/fulfillment/inventory/${productId}`, {
      warehouseId,
      quantityAvailable,
      reorderPoint,
      reorderQuantity,
    });
    return extractData(res);
  },

  async getBackorders(): Promise<FulfillmentRecord[]> {
    const res = await apiClient.get<ApiResponse<FulfillmentRecord[]>>('/fulfillment/backorders');
    return extractData(res);
  },

  async getWarehouses(): Promise<Warehouse[]> {
    const res = await apiClient.get<ApiResponse<Warehouse[]>>('/fulfillment/warehouses');
    return extractData(res);
  },

  async createWarehouse(data: Partial<Warehouse>): Promise<Warehouse> {
    const res = await apiClient.post<ApiResponse<Warehouse>>('/fulfillment/warehouses', data);
    return extractData(res);
  },
};
