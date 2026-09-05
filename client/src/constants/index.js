export const API_BASE_URL = '/api';
export const APP_NAME = 'DealFlow360';
export const APP_VERSION = '0.1.0';
// ─── Route paths ──────────────────────────────────────────────────────────
export const ROUTES = {
    LOGIN: '/login',
    APP: {
        DASHBOARD: '/app/dashboard',
        QUOTATIONS: '/app/quotations',
        APPROVALS: '/app/approvals',
        DEAL_TWIN: '/app/deal-twin',
        FULFILLMENT: '/app/fulfillment',
        BILLING: '/app/billing',
        ANALYTICS: '/app/analytics',
        ADMIN: '/app/admin',
    },
    CUSTOMER: {
        LOGIN: '/customer/login',
        QUOTES: '/customer/quotes',
    },
};
// ─── Query keys ─────────────────────────────────────────────────────────────
// Centralize TanStack Query keys to avoid typos and enable targeted invalidation
export const QUERY_KEYS = {
    AUTH: {
        ME: ['auth', 'me'],
    },
    QUOTATIONS: {
        LIST: ['quotations'],
        DETAIL: (id) => ['quotations', id],
    },
    APPROVALS: {
        LIST: ['approvals'],
        DETAIL: (id) => ['approvals', id],
    },
    FULFILLMENT: {
        LIST: ['fulfillment'],
    },
    BILLING: {
        INVOICES: ['billing', 'invoices'],
        SUBSCRIPTIONS: ['billing', 'subscriptions'],
    },
    ANALYTICS: {
        DASHBOARD: ['analytics', 'dashboard'],
    },
    ADMIN: {
        PRODUCTS: ['admin', 'products'],
        CATEGORIES: ['admin', 'categories'],
        USERS: ['admin', 'users'],
    },
};
// ─── Pagination ────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;
// ─── Role display names ────────────────────────────────────────────────────
export const ROLE_LABELS = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Administrator',
    SALES_MANAGER: 'Sales Manager',
    SALES_REP: 'Sales Representative',
    FINANCE: 'Finance',
    WAREHOUSE: 'Warehouse',
    CUSTOMER: 'Customer',
};
//# sourceMappingURL=index.js.map