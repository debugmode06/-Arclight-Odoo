import { createBrowserRouter, Navigate } from 'react-router-dom';
import {
  QuotationsPage,
  QuotationBuilderPage,
  QuotationDetailPage,
} from '@/modules/quotations';
import { ApprovalsPage, ApprovalDetailPage } from '@/modules/approvals';
import { LoginPage, SignupPage } from '@/modules/auth';
import { AdminPage } from '@/modules/admin';
import { DealTwinPage } from '@/modules/dealTwin';
import { FulfillmentPage } from '@/modules/fulfillment';
import { BillingPage } from '@/modules/billing';
import {
  DashboardPage,
  DealHealthPage,
  AnalyticsPage,
  ReportsPage,
} from '@/modules/analytics';
import {
  CustomerPortalLayout,
  CustomerLoginPage,
  CustomerQuotesPage,
  CustomerQuoteDetailPage,
} from '@/modules/portal';
import { AppLayout } from '@/components/layout';

/**
 * Application Router
 * DealFlow360 Enterprise RevOps
 */
export const router = createBrowserRouter([
  // ─── Public Auth Routes ─────────────────────────────────────────────────
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },

  // ─── Internal App Routes ────────────────────────────────────────────────
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/quotations" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
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
        path: 'approvals',
        element: <ApprovalsPage />,
      },
      {
        path: 'approvals/:id',
        element: <ApprovalDetailPage />,
      },
      {
        path: 'deal-twin',
        element: <DealTwinPage />,
      },
      {
        path: 'fulfillment',
        element: <FulfillmentPage />,
      },
      {
        path: 'billing',
        element: <BillingPage />,
      },
      {
        path: 'deal-health',
        element: <DealHealthPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'pipeline',
        element: <AnalyticsPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'admin',
        element: <AdminPage />,
      },
      {
        path: 'customers',
        element: <Navigate to="/app/admin" replace />,
      },
    ],
  },

  // ─── Customer Portal Routes ─────────────────────────────────────────────
  {
    path: '/customer',
    element: <CustomerPortalLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/customer/quotes" replace />,
      },
      {
        path: 'login',
        element: <CustomerLoginPage />,
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

  // ─── Root redirect ──────────────────────────────────────────────────────
  {
    path: '/',
    element: <Navigate to="/app/quotations" replace />,
  },

  // ─── 404 ────────────────────────────────────────────────────────────────
  {
    path: '*',
    element: (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm text-center max-w-md w-full p-8">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#6344e7] flex items-center justify-center mx-auto mb-4 font-black text-xl">
            404
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Page Not Found</h1>
          <p className="text-slate-500 text-sm mb-6">The page you are looking for does not exist or has moved.</p>
          <a
            href="/app/quotations"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-[#6344e7] text-white rounded-xl text-xs font-semibold hover:bg-[#5233d4] transition-all shadow-xs"
          >
            Return to Quotations
          </a>
        </div>
      </div>
    ),
  },
]);
