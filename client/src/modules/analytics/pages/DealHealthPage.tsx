import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnalyticsService } from '../services/analytics.service';
import {
  Activity,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  Truck,
} from 'lucide-react';

export const DealHealthPage: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nudgedMap, setNudgedMap] = useState<Record<string, boolean>>({});

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const res = await AnalyticsService.getDealHealth();
      setAlerts(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleNudge = async (alertId: string) => {
    try {
      await AnalyticsService.sendNudge(alertId);
      setNudgedMap((prev) => ({ ...prev, [alertId]: true }));
      alert('Automated RevOps nudge email dispatched to deal owner!');
    } catch (err) {
      alert('Failed to send nudge');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deal Health & Anomaly Surveillance</h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-[#6344e7] uppercase tracking-wider">
              Automated Governance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Detecting stalled pipeline deals, historical discount anomalies, and delivery promise slippage.
          </p>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const isNudged = nudgedMap[alert._id] || alert.status === 'NUDGED';
          const quoteId = alert.quotationId?._id || alert.quotationId;

          return (
            <div
              key={alert._id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:border-purple-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                      alert.alertType === 'STALLED_DEAL'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : alert.alertType === 'DISCOUNT_ANOMALY'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-purple-50 text-[#6344e7] border border-purple-200'
                    }`}
                  >
                    {alert.alertType.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{alert.title}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>

                <div className="text-[11px] text-purple-700 font-semibold flex items-center gap-1.5 pt-1">
                  <span>Suggested Action:</span>
                  <span className="font-normal text-slate-700">{alert.suggestedAction}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {quoteId && (
                  <Link
                    to={`/app/quotations/${quoteId}`}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-2xs"
                  >
                    <span>Inspect Deal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}

                <button
                  type="button"
                  disabled={isNudged}
                  onClick={() => handleNudge(alert._id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                    isNudged
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-[#6344e7] hover:bg-[#5233d4] text-white'
                  }`}
                >
                  {isNudged ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Nudge Sent</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Nudge</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
