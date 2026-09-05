import React, { useState, useEffect } from 'react';
import { AnalyticsService } from '../services/analytics.service';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Percent } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [pipeline, setPipeline] = useState<any | null>(null);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([AnalyticsService.getPipeline(), AnalyticsService.getDashboard()])
      .then(([p, m]) => {
        setPipeline(p);
        setMetrics(m);
      })
      .finally(() => setLoading(false));
  }, []);

  const barData = [
    { stage: 'Draft', count: pipeline?.DRAFT?.length || 0, value: pipeline?.DRAFT?.reduce((a: number, q: any) => a + q.grandTotal, 0) || 0 },
    { stage: 'Under Review', count: pipeline?.PENDING_APPROVAL?.length || 0, value: pipeline?.PENDING_APPROVAL?.reduce((a: number, q: any) => a + q.grandTotal, 0) || 0 },
    { stage: 'Approved', count: pipeline?.APPROVED?.length || 0, value: pipeline?.APPROVED?.reduce((a: number, q: any) => a + q.grandTotal, 0) || 0 },
    { stage: 'Won / Confirmed', count: pipeline?.WON?.length || 0, value: pipeline?.WON?.reduce((a: number, q: any) => a + q.grandTotal, 0) || 0 },
  ];

  const pieData = [
    { name: 'Approved / Won', value: metrics?.conversionRate || 35, color: '#10b981' },
    { name: 'Under Governance Review', value: 25, color: '#f59e0b' },
    { name: 'Draft Stage', value: 40, color: '#6344e7' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">RevOps Analytics & Revenue Intelligence</h1>
        <p className="text-xs text-slate-500 mt-1">
          Stage-by-stage pipeline distribution, conversion velocity, and margin retention performance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pipeline Value Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-[#6344e7]" />
              Pipeline Value by Governance Stage ($)
            </h3>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Pipeline Value']}
                  contentStyle={{ fontSize: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="value" fill="#6344e7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Rate Pie Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Deal Velocity Distribution
          </h3>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={45}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
