import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  FileText,
  ChevronDown,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Truck,
  Receipt,
  Users,
  Activity,
  BarChart2,
  Settings,
  CheckCircle2,
} from 'lucide-react';

interface SidebarProps {
  onNewQuotation?: () => void;
  pendingApprovalCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewQuotation, pendingApprovalCount = 4 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [quotationsExpanded, setQuotationsExpanded] = useState(true);

  const isQuotationsActive = location.pathname.startsWith('/app/quotations');

  return (
    <aside className="w-60 min-w-60 bg-white border-r border-slate-200/90 flex flex-col justify-between p-3.5 h-[calc(100vh-3.5rem)] sticky top-14 select-none overflow-y-auto">
      {/* Top Section */}
      <div className="space-y-3">
        {/* Workspace Brand Box */}
        <div className="bg-purple-50/80 border border-purple-100/90 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-[#6344e7] text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
            D
          </div>
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-xs font-bold text-slate-900 leading-tight">DealFlow360</span>
            <span className="text-[10px] text-slate-500 truncate leading-tight font-normal">
              Enterprise RevOps Intelligence
            </span>
          </div>
        </div>

        {/* Primary Action Button: New Quotation */}
        <button
          type="button"
          onClick={onNewQuotation || (() => navigate('/app/quotations/new'))}
          className="w-full bg-[#6344e7] hover:bg-[#5233d4] text-white font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-white" />
          <span>New Quotation</span>
        </button>

        {/* Navigation Group 1: REVOPS CORE */}
        <div className="pt-2">
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-2 mb-1.5">
            RevOps Core
          </div>

          <div className="space-y-0.5">
            {/* Overview */}
            <NavLink
              to="/app/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-[#6344e7] font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <LayoutGrid className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Overview</span>
            </NavLink>

            {/* Quotations Accordion Menu (Active) */}
            <div>
              <button
                type="button"
                onClick={() => setQuotationsExpanded(!quotationsExpanded)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isQuotationsActive
                    ? 'bg-purple-50 text-[#6344e7]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className={`w-3.5 h-3.5 ${isQuotationsActive ? 'text-[#6344e7]' : 'text-slate-500'} shrink-0`} />
                  <span>Quotations</span>
                </div>
                <ChevronDown
                  className={`w-3 h-3 text-current transition-transform duration-200 ${
                    quotationsExpanded ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>

              {/* Sub-items list */}
              {quotationsExpanded && (
                <div className="pl-6 pr-1 pt-1 space-y-0.5">
                  <NavLink
                    to="/app/quotations"
                    end
                    className="flex items-center justify-between py-1 px-2 rounded-md text-xs text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <span>My Quotes</span>
                    <span className="text-[11px] text-slate-400 font-normal">14</span>
                  </NavLink>

                  <NavLink
                    to="/app/quotations"
                    end
                    className="flex items-center justify-between py-1 px-2 rounded-md text-xs text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <span>All Quotes</span>
                    <span className="text-[11px] text-slate-400 font-normal">28</span>
                  </NavLink>

                  <NavLink
                    to="/app/approvals"
                    className="flex items-center justify-between py-1 px-2 rounded-md text-xs text-rose-600 font-semibold hover:bg-rose-50/60 transition-colors"
                  >
                    <span>Pending Approval</span>
                    <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-bold px-1.5 py-0.2 rounded leading-none">
                      {pendingApprovalCount}
                    </span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Pipeline */}
            <NavLink
              to="/app/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-[#6344e7] font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Pipeline</span>
            </NavLink>

            {/* Approvals */}
            <NavLink
              to="/app/approvals"
              className={({ isActive }) =>
                `flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-[#6344e7] font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Approvals</span>
              </div>
              <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-none">
                3
              </span>
            </NavLink>

            {/* DealTwin AI */}
            <NavLink
              to="/app/deal-twin"
              className={({ isActive }) =>
                `flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-[#6344e7] font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-purple-50/40'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#6344e7] shrink-0" />
                <span className="font-semibold text-slate-700">DealTwin AI</span>
              </div>
              <span className="bg-purple-100 text-[#6344e7] text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide leading-none">
                PREVIEW
              </span>
            </NavLink>
          </div>
        </div>

        {/* Navigation Group 2: FULFILLMENT & OPS */}
        <div className="pt-2">
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-2 mb-1.5">
            Fulfillment & Ops
          </div>

          <div className="space-y-0.5">
            <NavLink
              to="/app/fulfillment"
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Fulfillment</span>
            </NavLink>

            <NavLink
              to="/app/billing"
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Receipt className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Billing</span>
            </NavLink>

            <NavLink
              to="/app/analytics"
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Analytics</span>
            </NavLink>

            <NavLink
              to="/app/admin"
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Admin Config</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Bottom Footer: SLA Monitor & Engine Online Card */}
      <div className="pt-3 border-t border-slate-200/80 space-y-2">
        {/* SLA Monitor */}
        <div className="flex items-center justify-between px-2 text-[11px]">
          <span className="text-slate-500 font-medium">SLA Monitor</span>
          <span className="flex items-center gap-1 font-bold text-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            99.98%
          </span>
        </div>

        {/* Engine Status Box */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 flex items-center justify-between shadow-2xs">
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-slate-800 leading-tight">RevOps Engine Online</span>
            <span className="text-[10px] text-slate-400 leading-tight font-normal">Latency: 18ms</span>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        </div>
      </div>
    </aside>
  );
};

