import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage, ProtectedRoute } from '../modules/auth';
import { AppLayout } from '../components/layout';
import { DashboardPage } from './pages/DashboardPage';
import {
  QuotationsPage,
  QuotationBuilderPage,
  QuotationDetailPage,
} from '../modules/quotations';
import { ApprovalsPage, ApprovalDetailPage } from '../modules/approvals';
import {
  CustomerPortalLayout,
  CustomerAuthGuard,
  CustomerLoginPage,
  CustomerQuotesPage,
  CustomerQuoteDetailPage,
  CustomerDashboardPage,
} from '../modules/portal';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="card text-center max-w-md w-full p-8 space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xl mx-auto">
        🚧
      </div>
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-500 text-sm">
        This module is part of the DealFlow360 team roadmap.
      </p>
      <div className="pt-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-100 text-gray-600 rounded-full text-xs font-semibold">
          Module ready for Member integration
        </span>
      </div>
    </div>
  </div>
);

/**
 * Application Router
 * Owner: Member 1 (Platform Foundation)
 */
export const router = createBrowserRouter([
  // ─── Public Auth Routes ─────────────────────────────────────────────────
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <PlaceholderPage title="Sign Up" />,
  },

  // ─── Internal App Routes (Protected Shell Layout) ───────────────────────
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
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
        element: <PlaceholderPage title="DealTwin AI Intelligence" />,
      },
      {
        path: 'fulfillment',
        element: <PlaceholderPage title="Warehouse & Fulfillment" />,
      },
      {
        path: 'billing',
        element: <PlaceholderPage title="Billing & Invoicing" />,
      },
      {
        path: 'analytics',
        element: <PlaceholderPage title="Sales & Performance Analytics" />,
      },
      {
        path: 'admin',
        element: <PlaceholderPage title="Admin & System Master Configuration" />,
      },
    ],
  },

  // ─── Customer Portal Routes ─────────────────────────────────────────────
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

  // ─── Root redirect ──────────────────────────────────────────────────────
  {
    path: '/',
    element: <Navigate to="/app/dashboard" replace />,
  },

  // ─── 404 ────────────────────────────────────────────────────────────────
  {
    path: '*',
    element: <PlaceholderPage title="404 — Page Not Found" />,
  },
]);

