import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/app/dashboard', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
    )},
    { label: 'Quotations', path: '/app/quotations', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    )},
    { label: 'Pipeline', path: '/app/pipeline', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    )},
    { label: 'Approvals', path: '/app/approvals', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
    )},
    { label: 'Fulfillment', path: '/app/fulfillment', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    ), badge: 'SPLIT' },
    { label: 'Billing', path: '/app/billing', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
    )},
    { label: 'Customers', path: '/app/customers', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )},
    { label: 'Deal Health', path: '/app/analytics', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    )},
    { label: 'Reports', path: '/app/reports', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    )},
    { label: 'Admin Config', path: '/app/admin', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    )},
  ];

  return (
    <div className="flex h-screen bg-[#f4f3ff] text-slate-900 overflow-hidden" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
      {/* ─── Sidebar ─────────────────────────────────────── */}
      <aside className="w-56 bg-white border-r border-purple-100 flex flex-col shadow-sm z-20 shrink-0">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-purple-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/30">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <div className="font-black text-slate-900 text-sm leading-none">DealFlow360</div>
              <div className="text-[9px] text-purple-500 font-semibold tracking-wider mt-0.5">Enterprise RevOps Intelligence</div>
            </div>
          </div>
        </div>

        {/* New Quotation Button */}
        <div className="px-3 pt-4 pb-3">
          <Link
            to="/app/quotations"
            className="flex items-center justify-center gap-2 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-500/30 transition-all"
          >
            <span className="text-base font-black leading-none">+</span>
            <span>New Quotation</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                    : 'text-slate-500 hover:bg-purple-50 hover:text-purple-900'
                }`}
              >
                <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-600'}`}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom bar */}
        <div className="border-t border-purple-50 p-3 space-y-2">
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setIsAlertsOpen(!isAlertsOpen)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-700 font-semibold transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              Alerts
            </button>
            <button className="text-xs text-slate-500 hover:text-purple-700 font-semibold transition-colors">Help</button>
            <button className="text-slate-400 hover:text-purple-600 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>

          <div className="flex items-center gap-2 px-2 py-1.5 bg-purple-50 rounded-xl border border-purple-100">
            <div className="w-6 h-6 rounded-lg bg-purple-600 text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-sm">
              VM
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-[11px] font-bold text-slate-800 truncate">Vikram Mehta</div>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" className="shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      </aside>

      {/* ─── Main ─────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-[#f4f3ff]">
        <Outlet />
      </main>
    </div>
  );
};
