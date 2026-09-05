export interface BillingCalculateRequest {
    subscriptionPlan?: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
    ordersProcessed: number;
    warehouseStoragePallets: number;
    apiCalls: number;
    freightSurcharge?: number;
    includeSetupFee?: boolean;
    discountAmount?: number;
}
export interface BillingCalculationResult {
    subscriptionPlan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
    baseSubscriptionFee: number;
    setupFee: number;
    orderPricing: {
        tier1Orders: number;
        tier1Cost: number;
        tier2Orders: number;
        tier2Cost: number;
        tier3Orders: number;
        tier3Cost: number;
        totalOrderCost: number;
    };
    storageCost: number;
    apiCallCost: number;
    freightSurcharge: number;
    totalUsageCost: number;
    subtotal: number;
    discountAmount: number;
    taxRate: number;
    taxAmount: number;
    totalPayable: number;
    lineItems: Array<{
        description: string;
        category: string;
        quantity: number;
        unitPrice: number;
        amount: number;
    }>;
}
export interface InvoiceRecord {
    _id: string;
    invoiceNumber: string;
    customerName: string;
    billingPeriod: string;
    subscriptionPlan: string;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    totalPayable: number;
    status: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE';
    dueDate: string;
    createdAt: string;
    lineItems: Array<{
        description: string;
        category: string;
        quantity: number;
        unitPrice: number;
        amount: number;
    }>;
}
export declare const billingService: {
    calculateBill: (params: BillingCalculateRequest) => Promise<BillingCalculationResult>;
    getInvoices: () => Promise<InvoiceRecord[]>;
    createInvoice: (params: BillingCalculateRequest & {
        customerName?: string;
    }) => Promise<InvoiceRecord>;
};
//# sourceMappingURL=billingService.d.ts.map