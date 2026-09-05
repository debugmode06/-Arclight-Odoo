import apiClient from '@/services/api.client';

export class AdminService {
  public static async getUsers() {
    const res = await apiClient.get('/admin/users');
    return res.data?.data || [];
  }

  public static async getCategories() {
    const res = await apiClient.get('/admin/categories');
    return res.data?.data || [];
  }

  public static async getProducts() {
    const res = await apiClient.get('/admin/products');
    return res.data?.data || [];
  }

  public static async getDiscountRules() {
    const res = await apiClient.get('/admin/discount-rules');
    return res.data?.data || [];
  }

  public static async createDiscountRule(rule: any) {
    const res = await apiClient.post('/admin/discount-rules', rule);
    return res.data?.data;
  }

  public static async getApprovalRules() {
    const res = await apiClient.get('/admin/approval-rules');
    return res.data?.data || [];
  }

  public static async createApprovalRule(rule: any) {
    const res = await apiClient.post('/admin/approval-rules', rule);
    return res.data?.data;
  }

  public static async getWarehouses() {
    const res = await apiClient.get('/admin/warehouses');
    return res.data?.data || [];
  }

  public static async createWarehouse(warehouse: any) {
    const res = await apiClient.post('/admin/warehouses', warehouse);
    return res.data?.data;
  }

  public static async getInventory() {
    const res = await apiClient.get('/admin/inventory');
    return res.data?.data || [];
  }

  public static async updateStock(warehouseId: string, productId: string, availableQuantity: number) {
    const res = await apiClient.post('/admin/inventory/update-stock', {
      warehouseId,
      productId,
      availableQuantity,
    });
    return res.data?.data;
  }

  public static async getSubscriptionPlans() {
    const res = await apiClient.get('/admin/subscription-plans');
    return res.data?.data || [];
  }

  public static async createSubscriptionPlan(plan: any) {
    const res = await apiClient.post('/admin/subscription-plans', plan);
    return res.data?.data;
  }
}
