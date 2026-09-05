import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CustomerPortalLayout, CustomerAuthGuard, CustomerLoginPage, CustomerQuotesPage, CustomerQuoteDetailPage, CustomerDashboardPage, } from '../modules/portal';
// ─── Layout placeholders ─────────────────────────────────────────────────────
// TODO: Member 1 — Replace lazy imports with actual pages as they are built
const PlaceholderPage = ({ title }) => (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-surface-50", children: _jsxs("div", { className: "card text-center max-w-md w-full", children: [_jsx("h1", { className: "text-2xl font-bold gradient-text mb-2", children: title }), _jsx("p", { className: "text-gray-500 text-sm", children: "This page is under construction." }), _jsx("div", { className: "mt-4 inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium", children: "\uD83D\uDEA7 Module not yet implemented" })] }) }));
/**
 * Application Router
 * Owner: Member 1
 *
 * PROTECTED ROUTES:
 * - /app/* routes require authentication (implement requireAuth guard)
 * - /app/admin/* routes require ADMIN role
 * - /customer/* routes use customer session (separate from internal users)
 *
 * ADDING ROUTES:
 * - Open a GitHub issue to request a route addition
 * - Member 1 implements the route entry
 * - Module owner provides the page component
 */
export const router = createBrowserRouter([
    // ─── Public Auth Routes ─────────────────────────────────────────────────
    {
        path: '/login',
        element: _jsx(PlaceholderPage, { title: "Login" }),
        // TODO: Member 1 — Replace with <LoginPage />
    },
    {
        path: '/signup',
        element: _jsx(PlaceholderPage, { title: "Sign Up" }),
        // TODO: Member 1 — Replace with <SignupPage />
    },
    // ─── Internal App Routes ────────────────────────────────────────────────
    {
        path: '/app',
        // TODO: Member 1 — Wrap with <AppLayout /> + auth guard
        children: [
            {
                index: true,
                element: _jsx(Navigate, { to: "/app/dashboard", replace: true }),
            },
            {
                path: 'dashboard',
                element: _jsx(PlaceholderPage, { title: "Dashboard" }),
                // TODO: Member 1 — Replace with <DashboardPage />
            },
            {
                path: 'quotations',
                element: _jsx(PlaceholderPage, { title: "Quotations" }),
                // TODO: Member 2 — Replace with <QuotationsPage />
            },
            {
                path: 'quotations/:id',
                element: _jsx(PlaceholderPage, { title: "Quotation Detail" }),
                // TODO: Member 2 — Replace with <QuotationDetailPage />
            },
            {
                path: 'approvals',
                element: _jsx(PlaceholderPage, { title: "Approvals" }),
                // TODO: Member 2 — Replace with <ApprovalsPage />
            },
            {
                path: 'deal-twin',
                element: _jsx(PlaceholderPage, { title: "DealTwin" }),
                // TODO: Member 2 — Replace with <DealTwinPage />
            },
            {
                path: 'fulfillment',
                element: _jsx(PlaceholderPage, { title: "Fulfillment" }),
                // TODO: Member 3 — Replace with <FulfillmentPage />
            },
            {
                path: 'billing',
                element: _jsx(PlaceholderPage, { title: "Billing" }),
                // TODO: Member 3 — Replace with <BillingPage />
            },
            {
                path: 'analytics',
                element: _jsx(PlaceholderPage, { title: "Analytics" }),
                // TODO: Member 4 — Replace with <AnalyticsPage />
            },
            {
                path: 'admin',
                element: _jsx(PlaceholderPage, { title: "Admin" }),
                // TODO: Member 1 — Replace with <AdminPage /> (ADMIN role required)
            },
        ],
    },
    // ─── Customer Portal Routes ─────────────────────────────────────────────
    {
        path: '/customer',
        children: [
            {
                path: 'login',
                element: _jsx(CustomerLoginPage, {}),
            },
            {
                element: (_jsx(CustomerAuthGuard, { children: _jsx(CustomerPortalLayout, {}) })),
                children: [
                    {
                        index: true,
                        element: _jsx(Navigate, { to: "/customer/quotes", replace: true }),
                    },
                    {
                        path: 'dashboard',
                        element: _jsx(CustomerDashboardPage, {}),
                    },
                    {
                        path: 'quotes',
                        element: _jsx(CustomerQuotesPage, {}),
                    },
                    {
                        path: 'quotes/:id',
                        element: _jsx(CustomerQuoteDetailPage, {}),
                    },
                ],
            },
        ],
    },
    // ─── Root redirect ──────────────────────────────────────────────────────
    {
        path: '/',
        element: _jsx(Navigate, { to: "/app/dashboard", replace: true }),
    },
    // ─── 404 ────────────────────────────────────────────────────────────────
    {
        path: '*',
        element: _jsx(PlaceholderPage, { title: "404 \u2014 Page Not Found" }),
    },
]);
//# sourceMappingURL=router.js.map