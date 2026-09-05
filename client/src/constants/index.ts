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
} as const;

// ─── Query keys ─────────────────────────────────────────────────────────────
// Centralize TanStack Query keys to avoid typos and enable targeted invalidation
export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'] as const,
  },
  QUOTATIONS: {
    LIST: ['quotations'] as const,
    DETAIL: (id: string) => ['quotations', id] as const,
  },
  APPROVALS: {
    LIST: ['approvals'] as const,
    DETAIL: (id: string) => ['approvals', id] as const,
  },
  FULFILLMENT: {
    LIST: ['fulfillment'] as const,
  },
  BILLING: {
    INVOICES: ['billing', 'invoices'] as const,
    SUBSCRIPTIONS: ['billing', 'subscriptions'] as const,
  },
  ANALYTICS: {
    DASHBOARD: ['analytics', 'dashboard'] as const,
  },
  ADMIN: {
    PRODUCTS: ['admin', 'products'] as const,
    CATEGORIES: ['admin', 'categories'] as const,
    USERS: ['admin', 'users'] as const,
  },
} as const;

// ─── Pagination ────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;

// ─── Role display names ────────────────────────────────────────────────────
export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Administrator',
  SALES_MANAGER: 'Sales Manager',
  SALES_REP: 'Sales Representative',
  FINANCE: 'Finance',
  WAREHOUSE: 'Warehouse',
  CUSTOMER: 'Customer',
};
