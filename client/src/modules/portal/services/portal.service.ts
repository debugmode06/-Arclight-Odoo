import apiClient from '@/services/api.client';

export class PortalService {
  public static async customerLogin(email: string) {
    const res = await apiClient.post('/portal/auth/login', { email });
    const data = res.data?.data;
    if (data?.accessToken) {
      localStorage.setItem('customerToken', data.accessToken);
      localStorage.setItem('currentCustomer', JSON.stringify(data.customer));
    }
    return data;
  }

  public static getCurrentCustomer() {
    const raw = localStorage.getItem('currentCustomer');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static async getCustomerQuotes() {
    const customer = this.getCurrentCustomer();
    const headers = customer ? { 'x-customer-id': customer.id } : {};
    const res = await apiClient.get('/portal/quotes', { headers });
    return res.data?.data || [];
  }

  public static async getCustomerQuoteById(id: string) {
    const customer = this.getCurrentCustomer();
    const headers = customer ? { 'x-customer-id': customer.id } : {};
    const res = await apiClient.get(`/portal/quotes/${id}`, { headers });
    return res.data?.data;
  }

  public static async submitNegotiation(
    id: string,
    payload: { text: string; counterDiscountPercent?: number; lineId?: string }
  ) {
    const customer = this.getCurrentCustomer();
    const headers = customer ? { 'x-customer-id': customer.id } : {};
    const res = await apiClient.post(`/portal/quotes/${id}/negotiate`, payload, { headers });
    return res.data?.data;
  }

  public static async acceptQuote(id: string) {
    const customer = this.getCurrentCustomer();
    const headers = customer ? { 'x-customer-id': customer.id } : {};
    const res = await apiClient.post(`/portal/quotes/${id}/accept`, {}, { headers });
    return res.data?.data;
  }

  public static customerLogout() {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('currentCustomer');
    window.location.href = '/customer/login';
  }
}
