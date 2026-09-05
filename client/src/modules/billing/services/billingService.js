import apiClient from '@/services/api.client';
export const billingService = {
    calculateBill: async (params) => {
        const res = await apiClient.post('/billing/calculate', params);
        return res.data.data;
    },
    getInvoices: async () => {
        const res = await apiClient.get('/billing/invoices');
        return res.data.data;
    },
    createInvoice: async (params) => {
        const res = await apiClient.post('/billing/invoices', params);
        return res.data.data;
    },
};
//# sourceMappingURL=billingService.js.map