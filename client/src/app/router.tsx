import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { FulfillmentPage, InventoryPage } from '@/modules/fulfillment';
import { BillingPage } from '@/modules/billing';
import { LoginPage } from '@/modules/auth';
import {
  QuotationsPage,
  QuotationBuilderPage,
  QuotationDetailPage,
} from '@/modules/quotations';
import { ApprovalsPage, ApprovalDetailPage } from '@/modules/approvals';
import {
  CustomerPortalLayout,
  CustomerAuthGuard,
  CustomerLoginPage,
  CustomerQuotesPage,
  CustomerQuoteDetailPage,
  CustomerDashboardPage,
} from '@/modules/portal';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[80vh]">
    <div className="bg-white rounded-2xl border border-purple-100 p-8 text-center max-w-md w-full shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl mx-auto mb-4 font-bold">
        🚧
      </div>
      <h1 className="text-xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-500 text-sm">This module belongs to another team member or is currently pending development.</p>
      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-200">
        Module Under Construction
      </div>
    </div>
  </div>
);

export const router = createBrowserRouter([
  // ─── Public Auth Routes ─────────────────────────────────────────────────
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <LoginPage />,
  },

  // ─── Internal App Routes (Wrapped in AppLayout) ────────────────────────
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/fulfillment" replace />,
      },
      {
        path: 'dashboard',
        element: <PlaceholderPage title="Executive Dashboard" />,
      },
      {
        path: 'quotations',
        element: <QuotationsPage />,
      },
      {
        path: 'quotations/new',
        element: <QuotationBuilderPage />,
      },
      {
        path: 'quotations/:id',
        element: <QuotationDetailPage />,
      },
      {
        path: 'quotations/:id/edit',
        element: <QuotationBuilderPage />,
      },
      {
        path: 'pipeline',
        element: <PlaceholderPage title="Sales Pipeline" />,
      },
      {
        path: 'approvals',
        element: <ApprovalsPage />,
      },
      {
        path: 'approvals/:id',
        element: <ApprovalDetailPage />,
      },
      {
        path: 'deal-twin',
        element: <PlaceholderPage title="DealTwin Simulation Engine" />,
      },
      {
        path: 'fulfillment',
        element: <FulfillmentPage />,
      },
      {
        path: 'inventory',
        element: <InventoryPage />,
      },
      {
        path: 'billing',
        element: <BillingPage />,
      },
      {
        path: 'customers',
        element: <PlaceholderPage title="Customer Management" />,
      },
      {
        path: 'analytics',
        element: <PlaceholderPage title="Deal Health & Analytics" />,
      },
      {
        path: 'reports',
        element: <PlaceholderPage title="Revenue Reports" />,
      },
      {
        path: 'admin',
        element: <PlaceholderPage title="Admin Configurations" />,
      },
    ],
  },

  // ─── Customer Portal Routes (Member 4) ──────────────────────────────────
  {
    path: '/customer',
    children: [
      {
        path: 'login',
        element: <CustomerLoginPage />,
      },
      {
        element: (
          <CustomerAuthGuard>
            <CustomerPortalLayout />
          </CustomerAuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/customer/quotes" replace />,
          },
          {
            path: 'dashboard',
            element: <CustomerDashboardPage />,
          },
          {
            path: 'quotes',
            element: <CustomerQuotesPage />,
          },
          {
            path: 'quotes/:id',
            element: <CustomerQuoteDetailPage />,
          },
        ],
      },
    ],
  },

  // ─── Root Redirect ──────────────────────────────────────────────────────
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // ─── 404 ────────────────────────────────────────────────────────────────
  {
    path: '*',
    element: <PlaceholderPage title="404 — Page Not Found" />,
  },
]);
