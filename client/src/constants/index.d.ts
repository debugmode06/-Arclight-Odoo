export declare const API_BASE_URL = "/api";
export declare const APP_NAME = "DealFlow360";
export declare const APP_VERSION = "0.1.0";
export declare const ROUTES: {
    readonly LOGIN: "/login";
    readonly APP: {
        readonly DASHBOARD: "/app/dashboard";
        readonly QUOTATIONS: "/app/quotations";
        readonly APPROVALS: "/app/approvals";
        readonly DEAL_TWIN: "/app/deal-twin";
        readonly FULFILLMENT: "/app/fulfillment";
        readonly BILLING: "/app/billing";
        readonly ANALYTICS: "/app/analytics";
        readonly ADMIN: "/app/admin";
    };
    readonly CUSTOMER: {
        readonly LOGIN: "/customer/login";
        readonly QUOTES: "/customer/quotes";
    };
};
export declare const QUERY_KEYS: {
    readonly AUTH: {
        readonly ME: readonly ["auth", "me"];
    };
    readonly QUOTATIONS: {
        readonly LIST: readonly ["quotations"];
        readonly DETAIL: (id: string) => readonly ["quotations", string];
    };
    readonly APPROVALS: {
        readonly LIST: readonly ["approvals"];
        readonly DETAIL: (id: string) => readonly ["approvals", string];
    };
    readonly FULFILLMENT: {
        readonly LIST: readonly ["fulfillment"];
    };
    readonly BILLING: {
        readonly INVOICES: readonly ["billing", "invoices"];
        readonly SUBSCRIPTIONS: readonly ["billing", "subscriptions"];
    };
    readonly ANALYTICS: {
        readonly DASHBOARD: readonly ["analytics", "dashboard"];
    };
    readonly ADMIN: {
        readonly PRODUCTS: readonly ["admin", "products"];
        readonly CATEGORIES: readonly ["admin", "categories"];
        readonly USERS: readonly ["admin", "users"];
    };
};
export declare const DEFAULT_PAGE_SIZE = 20;
export declare const ROLE_LABELS: Record<string, string>;
//# sourceMappingURL=index.d.ts.map