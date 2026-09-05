import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PortalService } from '../services/portal.service';
import { FileText, ArrowRight, Clock, CheckCircle2, Shield } from 'lucide-react';

export const CustomerQuotesPage: React.FC = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PortalService.getCustomerQuotes()
      .then(setQuotes)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Your Quotations & Proposals</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review commercial terms, submit counter-proposals, and confirm authorized quotations.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading your quotations...</div>
      ) : quotes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-500">
          No quotations currently issued for your account.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quotes.map((q) => (
            <div
              key={q._id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:border-purple-200 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[#6344e7]">{q.quotationNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      q.status === 'APPROVED' || q.status === 'WON'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : q.status === 'PENDING_APPROVAL'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-purple-50 text-[#6344e7] border border-purple-200'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>

                <div className="text-xl font-extrabold text-slate-900">
                  ${q.grandTotal?.toLocaleString()} {q.currency}
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <div>Lines: {q.lines?.length || 0} product(s)</div>
                  {q.validUntil && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" /> Valid Until: {new Date(q.validUntil).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Created {new Date(q.createdAt).toLocaleDateString()}
                </span>
                <Link
                  to={`/customer/quotes/${q._id}`}
                  className="px-3 py-1.5 bg-[#6344e7] hover:bg-[#5233d4] text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs"
                >
                  <span>Review & Negotiate</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
