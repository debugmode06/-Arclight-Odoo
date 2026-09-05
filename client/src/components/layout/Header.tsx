import { useAuth } from '../../modules/auth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-surface-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search quotations, deals, customers, invoices..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-50 border border-surface-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-4">
        {/* System Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/80 text-emerald-700 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>MongoDB Atlas Connected</span>
        </div>

        {/* User Info & Logout Button */}
        <div className="flex items-center gap-3 pl-4 border-l border-surface-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-900 leading-none">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 mt-0.5">{user?.email || 'user@dealflow360.com'}</p>
          </div>

          <button
            onClick={logout}
            title="Sign out of your session"
            className="px-3.5 py-1.5 rounded-xl border border-surface-200 hover:border-danger/30 hover:bg-danger-light text-gray-700 hover:text-danger text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 shadow-xs"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
