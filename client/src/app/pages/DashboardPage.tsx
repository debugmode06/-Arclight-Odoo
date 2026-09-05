import { useAuth } from '../../modules/auth';
import { MetricCard } from '../../components/shared/MetricCard';
import { StatusPill } from '../../components/shared/StatusPill';

export function DashboardPage() {
  const { user } = useAuth();

  const recentQuotations = [
    {
      id: 'QT-2026-001',
      customer: 'Acme Corporation',
      product: 'Enterprise Cloud Suite',
      amount: '$124,000',
      discount: '12.5%',
      margin: '34.2%',
      status: 'APPROVED',
      date: '2026-09-05',
    },
    {
      id: 'QT-2026-002',
      customer: 'Global Logistics Inc',
      product: 'Warehouse Automation Package',
      amount: '$285,000',
      discount: '18.0%',
      margin: '22.8%',
      status: 'PENDING_APPROVAL',
      date: '2026-09-04',
    },
    {
      id: 'QT-2026-003',
      customer: 'Nexa Technologies',
      product: 'SaaS Platform License (500 seats)',
      amount: '$64,500',
      discount: '5.0%',
      margin: '48.0%',
      status: 'WON',
      date: '2026-09-03',
    },
    {
      id: 'QT-2026-004',
      customer: 'Apex Solutions',
      product: 'Custom ERP & Integration',
      amount: '$192,000',
      discount: '22.5%',
      margin: '18.4%',
      status: 'PENDING_APPROVAL',
      date: '2026-09-02',
    },
    {
      id: 'QT-2026-005',
      customer: 'Horizon Retail Group',
      product: 'POS Hardware & Software',
      amount: '$45,000',
      discount: '0.0%',
      margin: '52.1%',
      status: 'DRAFT',
      date: '2026-09-01',
    },
  ];

  const activityFeed = [
    { id: 1, text: 'Quotation QT-2026-001 approved by Finance Manager', time: '10 mins ago', type: 'success' },
    { id: 2, text: 'New quotation QT-2026-002 submitted for discount review', time: '45 mins ago', type: 'warning' },
    { id: 3, text: 'DealTwin AI flagged 1 high-risk discount margin on QT-2026-004', time: '2 hours ago', type: 'danger' },
    { id: 4, text: 'Invoice INV-2026-882 marked as PAID ($64,500)', time: '4 hours ago', type: 'info' },
  ];

  return (
    <div className="space-y-8 animate-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 bg-radial-gradient pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-sm mb-3">
            ✨ Welcome Back
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Good day, {user?.name || 'Sales Representative'} 👋
          </h1>
          <p className="text-primary-100 text-sm mt-1 max-w-xl">
            DealFlow360 Sales Operations Overview — Track active quotations, discount approvals, and revenue performance in real-time.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all">
            📥 Export Report
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-white text-primary-900 hover:bg-primary-50 text-sm font-bold shadow-lg transition-all">
            + New Quotation
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value="$1,248,500"
          change="14.2%"
          changeType="positive"
          subtitle="Q3 Target: $1.4M"
          icon={<span className="text-xl">💰</span>}
        />
        <MetricCard
          title="Active Deals"
          value="42 Deals"
          change="8 New"
          changeType="positive"
          subtitle="12 pending approval"
          icon={<span className="text-xl">📝</span>}
        />
        <MetricCard
          title="Win Rate"
          value="68.4%"
          change="3.1%"
          changeType="positive"
          subtitle="Target: 65.0%"
          icon={<span className="text-xl">🎯</span>}
        />
        <MetricCard
          title="Pending Approvals"
          value="$340,000"
          change="4 Deals"
          changeType="negative"
          subtitle="Manager & Finance review"
          icon={<span className="text-xl">⏳</span>}
        />
      </div>

      {/* Main Content Grid: Pipeline Table & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Quotations Table (2 Cols) */}
        <div className="lg:col-span-2 card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Active Deal Pipeline</h2>
              <p className="text-xs text-gray-500 mt-0.5">Recent quotations requiring action or monitoring</p>
            </div>
            <button className="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors">
              View All Quotations →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Quotation ID</th>
                  <th>Customer</th>
                  <th>Product / Package</th>
                  <th>Value</th>
                  <th>Discount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentQuotations.map((q) => (
                  <tr key={q.id} className="cursor-pointer">
                    <td className="font-bold text-primary-700">{q.id}</td>
                    <td className="font-semibold text-gray-900">{q.customer}</td>
                    <td className="text-gray-600 text-xs">{q.product}</td>
                    <td className="font-bold text-gray-900">{q.amount}</td>
                    <td className="text-xs font-medium text-amber-700">{q.discount}</td>
                    <td>
                      <StatusPill status={q.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar Widget: DealTwin AI & Live Activity */}
        <div className="space-y-8">
          {/* DealTwin AI Insights Card */}
          <div className="card p-6 bg-gradient-to-b from-primary-50/50 to-white border-primary-100 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-primary-100 text-primary-700 text-lg">🔮</span>
              <div>
                <h3 className="text-base font-bold text-gray-900">DealTwin AI Assistant</h3>
                <p className="text-xs text-gray-500">Real-time margin risk evaluation</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-surface-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-600">Pipeline Margin Health:</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Good (35.4% Avg)
                </span>
              </div>
              <div className="w-full bg-surface-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[78%]" />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-medium">
                ⚠️ <strong>QT-2026-004:</strong> 22.5% discount exceeds Sales Rep limit (15%). Requires Manager approval.
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
                💡 <strong>Optimization Tip:</strong> Bundling Cloud Suite with Support increases win rate by +24%.
              </div>
            </div>
          </div>

          {/* Live Activity Stream */}
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Live Activity Feed</h3>
            <div className="space-y-3">
              {activityFeed.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary-600 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 leading-snug">{item.text}</p>
                    <span className="text-[10px] text-gray-400 font-semibold">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
