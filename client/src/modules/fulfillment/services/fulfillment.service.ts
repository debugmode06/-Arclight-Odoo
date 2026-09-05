import apiClient from '@/services/api.client';

export class FulfillmentService {
  public static async list() {
    const res = await apiClient.get('/fulfillment');
    return res.data?.data || [];
  }

  public static async getById(id: string) {
    const res = await apiClient.get(`/fulfillment/${id}`);
    return res.data?.data;
  }

  public static async recommendSplit(quotationId: string) {
    const res = await apiClient.get('/fulfillment/recommend-split', {
      params: { quotationId },
    });
    return res.data?.data;
  }

  public static async allocateStock(quotationId: string, allocations?: any[]) {
    const res = await apiClient.post('/fulfillment/allocate', {
      quotationId,
      allocations,
    });
    return res.data?.data;
  }

  public static async getBackorders() {
    const res = await apiClient.get('/fulfillment/backorders');
    return res.data?.data || [];
  }

  public static async consolidateBackorder(id: string) {
    const res = await apiClient.post(`/fulfillment/backorders/${id}/consolidate`);
    return res.data?.data;
  }
}
