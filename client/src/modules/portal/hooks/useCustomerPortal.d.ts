import { CustomerUser } from '../types/portal.types';
import { CustomerLoginFormValues } from '../schemas/portal.schemas';
export declare function useCustomerAuth(): {
    customer: CustomerUser | null;
    isAuthenticated: boolean;
    login: (credentials: CustomerLoginFormValues) => Promise<{
        accessToken: string;
        customer: CustomerUser;
    }>;
    logout: () => void;
};
export declare function useCustomerQuotes(): import("@tanstack/react-query").UseQueryResult<import("..").CustomerQuotationSummary[], Error>;
export declare function useCustomerQuoteDetail(quoteId: string): import("@tanstack/react-query").UseQueryResult<import("..").CustomerQuotationDetail, Error>;
export declare function usePortalActions(quoteId: string): {
    addComment: import("@tanstack/react-query").UseMutateAsyncFunction<import("..").CustomerQuotationDetail, Error, {
        comment: string;
        lineId?: string | undefined;
    }, unknown>;
    isAddingComment: boolean;
    submitChangeRequest: import("@tanstack/react-query").UseMutateAsyncFunction<import("..").CustomerQuotationDetail, Error, {
        type: "QUANTITY" | "PRODUCT" | "COMMERCIAL" | "DELIVERY" | "OTHER";
        description: string;
        lineId?: string | undefined;
        requestedValue?: string | undefined;
    }, unknown>;
    isSubmittingChangeRequest: boolean;
    submitCounterOffer: import("@tanstack/react-query").UseMutateAsyncFunction<import("..").CustomerQuotationDetail, Error, {
        proposedDiscount: number;
        reason: string;
    }, unknown>;
    isSubmittingCounterOffer: boolean;
    confirmQuote: import("@tanstack/react-query").UseMutateAsyncFunction<import("..").CustomerQuotationDetail, Error, {
        termsAccepted: boolean;
        customerNotes?: string | undefined;
    }, unknown>;
    isConfirmingQuote: boolean;
};
//# sourceMappingURL=useCustomerPortal.d.ts.map