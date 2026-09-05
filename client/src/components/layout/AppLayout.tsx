import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MemberSwitcherBar } from './MemberSwitcherBar';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans text-slate-800 antialiased">
      {/* Top Navigation Bar */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 relative">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Page Content */}
        <main className="flex-1 min-w-0 pb-20 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Floating Member 2 Switcher Bar */}
      <MemberSwitcherBar />
    </div>
  );
};

export default AppLayout;
