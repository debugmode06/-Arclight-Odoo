import React from 'react';
import { LayoutDashboard, FileText, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const CustomerPortalBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Customer Dashboard', icon: LayoutDashboard, to: '/customer/dashboard', pathMatch: '/customer/dashboard' },
    { label: 'My Quotations', icon: FileText, to: '/customer/quotes', pathMatch: '/customer/quotes' },
    { label: 'Customer Portal', icon: ShieldCheck, to: '/customer/quotes', pathMatch: '/customer' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-md w-full px-4">
      <div className="bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-2xl p-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.pathMatch || (item.pathMatch === '/customer/quotes' && location.pathname.startsWith('/customer/quotes'));
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
