import { CustomerUser, CustomerQuotationSummary, CustomerQuotationDetail } from '../types/portal.types';
import { CustomerLoginFormValues, LineCommentFormValues, ChangeRequestFormValues, CounterOfferFormValues, ConfirmQuoteFormValues } from '../schemas/portal.schemas';
export declare const customerAuth: {
    getToken(): string | null;
    setToken(token: string): void;
    getCustomer(): CustomerUser | null;
    setCustomer(customer: CustomerUser): void;
    clear(): void;
};
export declare const portalService: {
    login(credentials: CustomerLoginFormValues): Promise<{
        accessToken: string;
        customer: CustomerUser;
    }>;
    getQuotes(): Promise<CustomerQuotationSummary[]>;
    getQuoteById(id: string): Promise<CustomerQuotationDetail>;
    addComment(quoteId: string, payload: LineCommentFormValues): Promise<CustomerQuotationDetail>;
    submitChangeRequest(quoteId: string, payload: ChangeRequestFormValues): Promise<CustomerQuotationDetail>;
    submitCounterOffer(quoteId: string, payload: CounterOfferFormValues): Promise<CustomerQuotationDetail>;
    confirmQuote(quoteId: string, payload: ConfirmQuoteFormValues): Promise<CustomerQuotationDetail>;
    logout(): void;
};
//# sourceMappingURL=portal.service.d.ts.map