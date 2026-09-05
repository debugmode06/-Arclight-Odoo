import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage, ProtectedRoute } from '../modules/auth';
import { AppLayout } from '../components/layout';
import { DashboardPage } from './pages/DashboardPage';

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
 * Owner: Member 1
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
        element: <PlaceholderPage title="Quotations Management" />,
      },
      {
        path: 'quotations/:id',
        element: <PlaceholderPage title="Quotation Detail" />,
      },
      {
        path: 'approvals',
        element: <PlaceholderPage title="Discount & Approval Governance" />,
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
        element: <PlaceholderPage title="Customer Login" />,
      },
      {
        path: 'quotes',
        element: <PlaceholderPage title="My Quotes" />,
      },
      {
        path: 'quotes/:id',
        element: <PlaceholderPage title="Quote Detail" />,
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
