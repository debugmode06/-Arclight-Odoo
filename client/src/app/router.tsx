import { createBrowserRouter, Navigate } from 'react-router-dom';
import {
  QuotationsPage,
  QuotationBuilderPage,
  QuotationDetailPage,
} from '@/modules/quotations';
import { ApprovalsPage, ApprovalDetailPage } from '@/modules/approvals';
import { AppLayout } from '@/components/layout';

// ─── Layout placeholders ─────────────────────────────────────────────────────
// TODO: Member 1 — Replace lazy imports with actual pages as they are built

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-surface-50">
    <div className="card text-center max-w-md w-full">
      <h1 className="text-2xl font-bold gradient-text mb-2">{title}</h1>
      <p className="text-gray-500 text-sm">This page is under construction.</p>
      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium">
        🚧 Module not yet implemented
      </div>
    </div>
  </div>
);

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
    element: <PlaceholderPage title="Login" />,
    // TODO: Member 1 — Replace with <LoginPage />
  },
  {
    path: '/signup',
    element: <PlaceholderPage title="Sign Up" />,
    // TODO: Member 1 — Replace with <SignupPage />
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
        element: <PlaceholderPage title="Dashboard" />,
        // TODO: Member 1 — Replace with <DashboardPage />
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
        element: <PlaceholderPage title="DealTwin" />,
        // TODO: Member 2 — Replace with <DealTwinPage />
      },
      {
        path: 'fulfillment',
        element: <PlaceholderPage title="Fulfillment" />,
        // TODO: Member 3 — Replace with <FulfillmentPage />
      },
      {
        path: 'billing',
        element: <PlaceholderPage title="Billing" />,
        // TODO: Member 3 — Replace with <BillingPage />
      },
      {
        path: 'analytics',
        element: <PlaceholderPage title="Analytics" />,
        // TODO: Member 4 — Replace with <AnalyticsPage />
      },
      {
        path: 'admin',
        element: <PlaceholderPage title="Admin" />,
        // TODO: Member 1 — Replace with <AdminPage /> (ADMIN role required)
      },
    ],
  },

  // ─── Customer Portal Routes ─────────────────────────────────────────────
  {
    path: '/customer',
    // TODO: Member 4 — Wrap with <CustomerPortalLayout /> + customer auth guard
    children: [
      {
        path: 'login',
        element: <PlaceholderPage title="Customer Login" />,
        // TODO: Member 4 — Replace with <CustomerLoginPage />
      },
      {
        path: 'quotes',
        element: <PlaceholderPage title="My Quotes" />,
        // TODO: Member 4 — Replace with <CustomerQuotesPage />
      },
      {
        path: 'quotes/:id',
        element: <PlaceholderPage title="Quote Detail" />,
        // TODO: Member 4 — Replace with <CustomerQuoteDetailPage />
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
    element: <PlaceholderPage title="404 — Page Not Found" />,
  },
]);
