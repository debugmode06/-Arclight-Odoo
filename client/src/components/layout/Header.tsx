import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Bell,
  HelpCircle,
  ChevronDown,
  ChevronsUpDown,
  LogOut,
} from 'lucide-react';
import { AuthService } from '@/modules/auth';

interface HeaderProps {
  onCreateDeal?: () => void;
  onSimulateImpact?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCreateDeal, onSimulateImpact }) => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const initials = currentUser
    ? `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`.toUpperCase() || 'U'
    : 'AM';

  return (
    <header className="h-14 bg-white border-b border-slate-200/90 px-5 flex items-center justify-between sticky top-0 z-40 select-none shadow-2xs">
      {/* Brand & Version Pill */}
      <div className="flex items-center gap-2.5">
        <Link to="/app/quotations" className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-[#5B32E8] tracking-tight hover:opacity-90 transition-opacity">
            DealFlow360
          </span>
        </Link>
        <span className="bg-purple-50 text-[#6344e7] border border-purple-200/70 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
          RevOps v3.4
        </span>
      </div>

      {/* Center Controls: Account Selector + Global Search + Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Account Selector Pill */}
        <div className="hidden lg:flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-full px-3 py-1 text-xs text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer transition-colors">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span className="font-semibold text-slate-800">Acme Corp</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 font-normal">Enterprise Sales</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
        </div>

        {/* Global Search Bar */}
        <div className="relative flex items-center">
          <div className="flex items-center bg-slate-50/80 border border-slate-200/90 rounded-lg px-3 py-1.5 w-60 md:w-64 text-xs text-slate-700 shadow-2xs focus-within:ring-2 focus-within:ring-purple-400/40 focus-within:bg-white transition-all">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search quotation..."
              className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 w-full focus:outline-none"
            />
            <kbd className="bg-slate-100 border border-slate-200/80 text-slate-500 text-[10px] font-medium px-1.5 py-0.5 rounded shadow-2xs shrink-0 ml-1">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Simulate Impact Button */}
        <button
          type="button"
          onClick={onSimulateImpact || (() => navigate('/app/quotations/new'))}
          className="hidden md:flex items-center gap-1.5 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
          <span>Simulate Impact</span>
        </button>

        {/* Primary CTA: + Create Deal */}
        <button
          type="button"
          onClick={onCreateDeal || (() => navigate('/app/quotations/new'))}
          className="flex items-center gap-1.5 bg-[#6344e7] hover:bg-[#5233d4] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
          <span>Create Deal</span>
        </button>
      </div>

      {/* Right Controls: Notifications, Help, User Avatar & Role */}
      <div className="flex items-center gap-3">
        {/* Notification Bell with Badge */}
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => navigate('/app/approvals')}
          className="relative p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center absolute -top-0.5 -right-0.5 shadow-xs">
            3
          </span>
        </button>

        {/* Help Circle */}
        <button
          type="button"
          aria-label="Help"
          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Capsule & Logout */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-purple-100 text-[#6344e7] font-bold text-xs flex items-center justify-center border border-purple-200 shadow-2xs">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Alex Morgan'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium leading-tight flex items-center gap-1">
              <span className="inline-block px-1.5 py-0.2 bg-purple-50 text-purple-700 rounded text-[9px] font-bold border border-purple-100">
                {currentUser?.role || 'SALES_REP'}
              </span>
            </span>
          </div>

          <button
            type="button"
            title="Sign Out"
            onClick={() => AuthService.logout()}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
