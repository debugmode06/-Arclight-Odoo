import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createBrowserRouter, Navigate } from 'react-router-dom';
<<<<<<< HEAD
import { AppLayout } from '@/components/layout';
import { FulfillmentPage, InventoryPage } from '@/modules/fulfillment';
import { BillingPage } from '@/modules/billing';
const PlaceholderPage = ({ title }) => (_jsx("div", { className: "flex items-center justify-center min-h-[80vh]", children: _jsxs("div", { className: "bg-white rounded-2xl border border-purple-100 p-8 text-center max-w-md w-full shadow-sm", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl mx-auto mb-4 font-bold", children: "\uD83D\uDEA7" }), _jsx("h1", { className: "text-xl font-bold text-slate-900 mb-2", children: title }), _jsx("p", { className: "text-slate-500 text-sm", children: "This module belongs to another team member or is currently pending development." }), _jsx("div", { className: "mt-4 inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-200", children: "Module Under Construction" })] }) }));
=======
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
>>>>>>> origin/feature/member4-portal-analytics
export const router = createBrowserRouter([
    // ─── Public Auth Routes ─────────────────────────────────────────────────
    {
        path: '/login',
        element: _jsx(PlaceholderPage, { title: "Login" }),
<<<<<<< HEAD
=======
        // TODO: Member 1 — Replace with <LoginPage />
>>>>>>> origin/feature/member4-portal-analytics
    },
    {
        path: '/signup',
        element: _jsx(PlaceholderPage, { title: "Sign Up" }),
<<<<<<< HEAD
    },
    // ─── Internal App Routes (Wrapped in AppLayout) ────────────────────────
    {
        path: '/app',
        element: _jsx(AppLayout, {}),
        children: [
            {
                index: true,
                element: _jsx(Navigate, { to: "/app/fulfillment", replace: true }),
            },
            {
                path: 'dashboard',
                element: _jsx(PlaceholderPage, { title: "Executive Dashboard" }),
            },
            {
                path: 'quotations',
                element: _jsx(PlaceholderPage, { title: "Quotations Management" }),
            },
            {
                path: 'pipeline',
                element: _jsx(PlaceholderPage, { title: "Sales Pipeline" }),
            },
            {
                path: 'approvals',
                element: _jsx(PlaceholderPage, { title: "Approvals Workflow" }),
            },
            {
                path: 'deal-twin',
                element: _jsx(PlaceholderPage, { title: "DealTwin Simulation Engine" }),
            },
            {
                path: 'fulfillment',
                element: _jsx(FulfillmentPage, {}),
            },
            {
                path: 'inventory',
                element: _jsx(InventoryPage, {}),
            },
            {
                path: 'billing',
                element: _jsx(BillingPage, {}),
            },
            {
                path: 'customers',
                element: _jsx(PlaceholderPage, { title: "Customer Management" }),
            },
            {
                path: 'analytics',
                element: _jsx(PlaceholderPage, { title: "Deal Health & Analytics" }),
            },
            {
                path: 'reports',
                element: _jsx(PlaceholderPage, { title: "Revenue Reports" }),
            },
            {
                path: 'admin',
                element: _jsx(PlaceholderPage, { title: "Admin Configurations" }),
=======
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
>>>>>>> origin/feature/member4-portal-analytics
            },
        ],
    },
    // ─── Customer Portal Routes ─────────────────────────────────────────────
    {
        path: '/customer',
        children: [
            {
                path: 'login',
<<<<<<< HEAD
                element: _jsx(PlaceholderPage, { title: "Customer Login" }),
            },
            {
                path: 'quotes',
                element: _jsx(PlaceholderPage, { title: "My Quotes" }),
            },
        ],
    },
    // ─── Root Redirect ──────────────────────────────────────────────────────
    {
        path: '/',
        element: _jsx(Navigate, { to: "/app/fulfillment", replace: true }),
=======
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
>>>>>>> origin/feature/member4-portal-analytics
    },
    // ─── 404 ────────────────────────────────────────────────────────────────
    {
        path: '*',
        element: _jsx(PlaceholderPage, { title: "404 \u2014 Page Not Found" }),
    },
]);
//# sourceMappingURL=router.js.map