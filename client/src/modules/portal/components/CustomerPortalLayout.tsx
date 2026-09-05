import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LogOut, FileText, LayoutDashboard, User } from 'lucide-react';
import { useCustomerAuth } from '../hooks/useCustomerPortal';

export const CustomerPortalLayout: React.FC = () => {
  const { customer, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/customer/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Customer Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Customer Tag */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">DealFlow360</span>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                    Customer Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {customer?.company || 'Commercial Partner Portal'}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/customer/quotes"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/customer/quotes') || location.pathname.startsWith('/customer/quotes/')
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>My Quotations</span>
              </Link>
            </nav>

            {/* Customer Profile & Logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2.5 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                  {customer?.name ? customer.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-bold text-slate-800 leading-none">{customer?.name || 'Valued Customer'}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{customer?.email}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                title="Log out of Customer Portal"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; {new Date().getFullYear()} DealFlow360 Enterprise Commerce. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Secure SSL Encrypted</span>
            <span>•</span>
            <span>Customer Terms & Confidentiality Guaranteed</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
