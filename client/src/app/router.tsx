import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { LoginPage, ProtectedRoute } from '../modules/auth';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-surface-50">
    <div className="card text-center max-w-md w-full">
      <h1 className="text-2xl font-bold gradient-text mb-2">{title}</h1>
      <p className="text-gray-500 text-sm">This page is under construction.</p>
      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium">
        🚧 Module placeholder
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

  // ─── Internal App Routes (Protected) ──────────────────────────────────
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <PlaceholderPage title="Dashboard" />,
      },
      {
        path: 'quotations',
        element: <PlaceholderPage title="Quotations" />,
      },
      {
        path: 'quotations/:id',
        element: <PlaceholderPage title="Quotation Detail" />,
      },
      {
        path: 'approvals',
        element: <PlaceholderPage title="Approvals" />,
      },
      {
        path: 'deal-twin',
        element: <PlaceholderPage title="DealTwin" />,
      },
      {
        path: 'fulfillment',
        element: <PlaceholderPage title="Fulfillment" />,
      },
      {
        path: 'billing',
        element: <PlaceholderPage title="Billing" />,
      },
      {
        path: 'analytics',
        element: <PlaceholderPage title="Analytics" />,
      },
      {
        path: 'admin',
        element: <PlaceholderPage title="Admin" />,
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
