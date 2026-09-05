import React from 'react';
import { FileText, CheckSquare, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const CustomerPortalBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Quotation & DealTwin', icon: FileText, to: '/customer/quotes', active: false },
    { label: 'Approval Queue', icon: CheckSquare, to: '/customer/quotes', active: false },
    { label: 'Warehouse Split', icon: Truck, to: '/customer/quotes', active: false },
    { label: 'Hybrid Billing', icon: CreditCard, to: '/customer/quotes', active: false },
    { label: 'Customer Portal', icon: ShieldCheck, to: '/customer/quotes', active: true },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-full px-4">
      <div className="bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-2xl p-1.5 flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                item.active
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
