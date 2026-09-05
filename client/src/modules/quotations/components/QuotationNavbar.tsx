import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, PlusCircle, CheckSquare, Layers } from 'lucide-react';

export const QuotationNavbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand & Module Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-purple-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
                DealFlow360
                <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-semibold tracking-normal">
                  Sales Ops
                </span>
              </div>
              <div className="text-xs text-gray-500">Commercial Governance & Quotation Lifecycle</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5">
            <NavLink
              to="/app/quotations"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 border border-purple-200/70 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <FileText className="w-4 h-4" />
              Quotations
            </NavLink>

            <NavLink
              to="/app/quotations/new"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 border border-purple-200/70 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <PlusCircle className="w-4 h-4" />
              New Quote
            </NavLink>

            <NavLink
              to="/app/approvals"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 border border-purple-200/70 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <CheckSquare className="w-4 h-4" />
              Approval Queue
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};
