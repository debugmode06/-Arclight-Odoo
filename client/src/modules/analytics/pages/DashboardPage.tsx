import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AnalyticsService } from '../services/analytics.service';
import { QuotationService } from '@/modules/quotations/services/quotation.service';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Percent,
  Plus,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  FileText,
  Clock,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any | null>(null);
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      AnalyticsService.getDashboard(),
      QuotationService.getQuotations({ limit: 5 }),
      AnalyticsService.getDealHealth(),
    ])
      .then(([m, q, a]) => {
        setMetrics(m);
        setRecentQuotes(q.data);
        setAlerts(a.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">RevOps Executive Overview</h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-[#6344e7] uppercase tracking-wider">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time pipeline health, discount governance adherence, and cross-functional fulfillment status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/app/deal-twin"
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6344e7]" />
            <span>DealTwin Simulator</span>
          </Link>

          <Link
            to="/app/quotations/new"
            className="px-3.5 py-1.5 bg-[#6344e7] hover:bg-[#5233d4] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Deal</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-[#6344e7]" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ${metrics?.totalPipelineValue?.toLocaleString() || '0'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across {metrics?.totalQuotations || 0} active deals</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Contracted Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            ${metrics?.wonRevenue?.toLocaleString() || '0'}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Conversion Rate: {metrics?.conversionRate || 0}%
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Avg Gross Margin</span>
            <Percent className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {metrics?.averageMarginPercent || 0}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Target: &gt; 25.0% baseline</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Pending Approvals</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {metrics?.pendingApprovals || 0}
          </div>
          <Link to="/app/approvals" className="text-[11px] text-amber-700 font-semibold mt-1 hover:underline block">
            Review Approval Queue →
          </Link>
        </div>
      </div>

      {/* 2-Column Section: Deal Health & Recent Proposals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Deal Health Alerts (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Active Deal Health Alerts
            </h3>
            <Link to="/app/deal-health" className="text-[11px] font-bold text-[#6344e7] hover:underline">
              View All ({alerts.length})
            </Link>
          </div>

          <div className="space-y-2.5">
            {alerts.map((a) => (
              <div
                key={a._id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1 hover:border-purple-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{a.title}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      a.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {a.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{a.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotations (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#6344e7]" />
              Recent Commercial Proposals
            </h3>
            <Link to="/app/quotations" className="text-[11px] font-bold text-[#6344e7] hover:underline">
              All Quotations →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="py-2 px-2 font-semibold">Quote #</th>
                  <th className="py-2 px-2 font-semibold">Customer</th>
                  <th className="py-2 px-2 font-semibold">Amount</th>
                  <th className="py-2 px-2 font-semibold">Margin</th>
                  <th className="py-2 px-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentQuotes.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-2 font-mono font-bold text-[#6344e7]">
                      <Link to={`/app/quotations/${q._id}`}>{q.quotationNumber}</Link>
                    </td>
                    <td className="py-2.5 px-2 font-semibold text-slate-800">
                      {typeof q.customerId === 'object' ? q.customerId.name : 'Customer'}
                    </td>
                    <td className="py-2.5 px-2 font-bold text-slate-900">${q.grandTotal?.toLocaleString()}</td>
                    <td className="py-2.5 px-2 font-semibold text-emerald-600">{q.grossMarginPercent?.toFixed(1)}%</td>
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-50 text-[#6344e7]">
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
