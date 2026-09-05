export interface CustomerUser {
    id: string;
    email: string;
    name: string;
    company: string;
    tier: string;
    role: 'CUSTOMER';
}
export interface CustomerQuoteLineItem {
    lineId: string;
    productId: string;
    productName: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
    discountAmount: number;
    lineTotal: number;
    notes?: string;
}
export interface NegotiationTimelineEvent {
    id: string;
    event: string;
    description: string;
    timestamp: string;
    actor: 'CUSTOMER' | 'SALES_REP' | 'SYSTEM' | 'MANAGER';
    customerVisible: boolean;
}
export interface CustomerLineComment {
    id: string;
    lineId?: string;
    comment: string;
    createdAt: string;
    authorName: string;
    isCustomer: boolean;
}
export interface CustomerChangeRequest {
    id: string;
    lineId?: string;
    type: 'QUANTITY' | 'PRODUCT' | 'COMMERCIAL' | 'DELIVERY' | 'OTHER';
    description: string;
    requestedValue?: string | number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
}
export interface CustomerCounterOffer {
    id: string;
    currentDiscount: number;
    proposedDiscount: number;
    reason: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'REVISION_REQUIRED';
    createdAt: string;
}
export interface CustomerQuotationSummary {
    id: string;
    quotationNumber: string;
    customerId: string;
    customerName: string;
    companyName: string;
    status: 'SENT' | 'UNDER NEGOTIATION' | 'CONFIRMED' | string;
    validUntil: string;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    total: number;
    currency: string;
    lineCount: number;
    createdAt: string;
    updatedAt: string;
}
export interface CustomerQuotationDetail extends CustomerQuotationSummary {
    lines: CustomerQuoteLineItem[];
    notes?: string;
    comments: CustomerLineComment[];
    changeRequests: CustomerChangeRequest[];
    counterOffer?: CustomerCounterOffer;
    timeline: NegotiationTimelineEvent[];
    canNegotiate: boolean;
    canConfirm: boolean;
}
//# sourceMappingURL=portal.types.d.ts.map