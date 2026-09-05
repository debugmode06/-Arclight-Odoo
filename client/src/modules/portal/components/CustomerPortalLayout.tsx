import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { PortalService } from '../services/portal.service';
import { Shield, FileText, LogOut, Building } from 'lucide-react';

export const CustomerPortalLayout: React.FC = () => {
  const navigate = useNavigate();
  const customer = PortalService.getCurrentCustomer() || {
    name: 'Acme Global Dynamics',
    tier: 'PLATINUM',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Customer Header */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link to="/customer/quotes" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6344e7] text-white font-black text-sm flex items-center justify-center shadow-xs">
              D
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">DealFlow360</span>
          </Link>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#6344e7] border border-purple-200">
            Customer Procurement Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-800">{customer.name}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-[#6344e7]">
              {customer.tier} TIER
            </span>
          </div>

          <button
            type="button"
            onClick={() => PortalService.customerLogout()}
            className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};
