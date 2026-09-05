import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { FulfillmentPage, InventoryPage } from '@/modules/fulfillment';
import { BillingPage } from '@/modules/billing';
const PlaceholderPage = ({ title }) => (_jsx("div", { className: "flex items-center justify-center min-h-[80vh]", children: _jsxs("div", { className: "bg-white rounded-2xl border border-purple-100 p-8 text-center max-w-md w-full shadow-sm", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl mx-auto mb-4 font-bold", children: "\uD83D\uDEA7" }), _jsx("h1", { className: "text-xl font-bold text-slate-900 mb-2", children: title }), _jsx("p", { className: "text-slate-500 text-sm", children: "This module belongs to another team member or is currently pending development." }), _jsx("div", { className: "mt-4 inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-200", children: "Module Under Construction" })] }) }));
export const router = createBrowserRouter([
    // ─── Public Auth Routes ─────────────────────────────────────────────────
    {
        path: '/login',
        element: _jsx(PlaceholderPage, { title: "Login" }),
    },
    {
        path: '/signup',
        element: _jsx(PlaceholderPage, { title: "Sign Up" }),
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
            },
        ],
    },
    // ─── Customer Portal Routes ─────────────────────────────────────────────
    {
        path: '/customer',
        children: [
            {
                path: 'login',
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
    },
    // ─── 404 ────────────────────────────────────────────────────────────────
    {
        path: '*',
        element: _jsx(PlaceholderPage, { title: "404 \u2014 Page Not Found" }),
    },
]);
//# sourceMappingURL=router.js.map