export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'SALES_MANAGER' | 'SALES_REP' | 'FINANCE' | 'WAREHOUSE' | 'CUSTOMER';
export type QuotationStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'WON' | 'LOST' | 'EXPIRED';
export type ApprovalStatus = 'PENDING' | 'MANAGER_APPROVED' | 'FINANCE_APPROVED' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'PARTIALLY_PAID';
export type FulfillmentStatus = 'PENDING' | 'ALLOCATED' | 'PARTIALLY_SHIPPED' | 'SHIPPED' | 'DELIVERED' | 'BACKORDERED';
export type CustomerTier = 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface SelectOption<T = string> {
    label: string;
    value: T;
}
export interface PaginationParams {
    page?: number;
    limit?: number;
}
//# sourceMappingURL=index.d.ts.map