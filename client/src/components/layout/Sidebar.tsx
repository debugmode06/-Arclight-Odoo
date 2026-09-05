import { NavLink } from 'react-router-dom';
import { useAuth } from '../../modules/auth';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
}

export function Sidebar() {
  const { user } = useAuth();

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/app/dashboard', icon: '📊' },
    { label: 'Quotations', path: '/app/quotations', icon: '📝', badge: '12' },
    { label: 'Approvals', path: '/app/approvals', icon: '✅', badge: '3' },
    { label: 'DealTwin AI', path: '/app/deal-twin', icon: '🔮' },
    { label: 'Fulfillment', path: '/app/fulfillment', icon: '📦' },
    { label: 'Billing & Invoices', path: '/app/billing', icon: '💳' },
    { label: 'Analytics', path: '/app/analytics', icon: '📈' },
    { label: 'Admin Settings', path: '/app/admin', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-surface-200 min-h-screen flex flex-col justify-between select-none shadow-xs">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-surface-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
            DF
          </div>
          <div>
            <h1 className="font-bold text-gray-900 tracking-tight leading-none text-base">
              DealFlow<span className="text-primary-600">360</span>
            </h1>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mt-0.5">
              Sales Operations Platform
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4 space-y-1">
          <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Main Navigation
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold shadow-xs border border-primary-100'
                    : 'text-gray-600 hover:bg-surface-100 hover:text-gray-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-100 text-primary-700">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* User Footer Context */}
      <div className="p-4 border-t border-surface-200 bg-surface-50/50">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-primary-600 font-medium truncate uppercase">{user?.role || 'SALES_REP'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
