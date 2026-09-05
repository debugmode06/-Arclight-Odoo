import React, { useState, useEffect } from 'react';
import { AnalyticsService } from '../services/analytics.service';
import { Download, Filter, FileText, Search } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AnalyticsService.getReports()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter((r) => {
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch =
      r.quotationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      r.customer?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    window.open(AnalyticsService.getExportUrl(), '_blank');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">RevOps Reports & Data Export</h1>
          <p className="text-xs text-slate-500 mt-1">
            Export comprehensive commercial transactions, governance records, and audit baselines.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-3.5 py-1.5 bg-[#6344e7] hover:bg-[#5233d4] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Transactions (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="WON">Won / Confirmed</option>
          </select>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search report..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">Quote #</th>
                <th className="py-2.5 px-3 font-semibold">Customer</th>
                <th className="py-2.5 px-3 font-semibold">Tier</th>
                <th className="py-2.5 px-3 font-semibold">Grand Total</th>
                <th className="py-2.5 px-3 font-semibold">Discount</th>
                <th className="py-2.5 px-3 font-semibold">Margin</th>
                <th className="py-2.5 px-3 font-semibold">Risk</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#6344e7]">{r.quotationNumber}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{r.customer}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {r.tier}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">${r.grandTotal?.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-emerald-600 font-semibold">${r.discount?.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-bold text-purple-700">{r.grossMarginPercent?.toFixed(1)}%</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        r.riskLevel === 'LOW'
                          ? 'bg-emerald-50 text-emerald-700'
                          : r.riskLevel === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {r.riskLevel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-50 text-[#6344e7]">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
