import apiClient from '@/services/api.client';

export class AnalyticsService {
  public static async getDashboard() {
    const res = await apiClient.get('/analytics/dashboard');
    return res.data?.data;
  }

  public static async getDealHealth() {
    const res = await apiClient.get('/analytics/deal-health');
    return res.data?.data || [];
  }

  public static async sendNudge(alertId: string) {
    const res = await apiClient.post(`/analytics/deal-health/${alertId}/nudge`);
    return res.data?.data;
  }

  public static async getPipeline() {
    const res = await apiClient.get('/analytics/pipeline');
    return res.data?.data;
  }

  public static async getReports(filters?: any) {
    const res = await apiClient.get('/analytics/reports', { params: filters });
    return res.data?.data || [];
  }

  public static getExportUrl() {
    return '/api/analytics/reports/export';
  }
}
