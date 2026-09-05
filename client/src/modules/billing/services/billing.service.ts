import apiClient from '@/services/api.client';

export class BillingService {
  public static async getInvoices() {
    const res = await apiClient.get('/billing/invoices');
    return res.data?.data || [];
  }

  public static async getInvoiceById(id: string) {
    const res = await apiClient.get(`/billing/invoices/${id}`);
    return res.data?.data;
  }

  public static async recordPayment(invoiceId: string, payload: {
    amount: number;
    paymentMethod: string;
    transactionReference?: string;
    notes?: string;
  }) {
    const res = await apiClient.post(`/billing/invoices/${invoiceId}/payments`, payload);
    return res.data?.data;
  }

  public static async getSubscriptions() {
    const res = await apiClient.get('/billing/subscriptions');
    return res.data?.data || [];
  }

  public static async modifySubscription(id: string, payload: { newPlanId?: string; newQuantity?: number }) {
    const res = await apiClient.post(`/billing/subscriptions/${id}/modify`, payload);
    return res.data?.data;
  }

  public static async cancelSubscription(id: string, reason?: string) {
    const res = await apiClient.post(`/billing/subscriptions/${id}/cancel`, { reason });
    return res.data?.data;
  }

  public static async getSchedules(subscriptionId?: string) {
    const res = await apiClient.get('/billing/schedules', {
      params: { subscriptionId },
    });
    return res.data?.data || [];
  }

  public static async generateBillingForQuotation(quotationId: string) {
    const res = await apiClient.post('/billing/generate', { quotationId });
    return res.data?.data;
  }
}
