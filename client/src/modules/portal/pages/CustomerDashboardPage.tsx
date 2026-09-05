import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useCustomerQuotes, useCustomerAuth } from '../hooks/useCustomerPortal';

export const CustomerDashboardPage: React.FC = () => {
  const { customer } = useCustomerAuth();
  const { data: quotes, isLoading, isError } = useCustomerQuotes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-2" />
        <span className="text-sm font-medium">Loading your portal dashboard...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
        <AlertCircle className="w-5 h-5 mb-2 text-red-600" />
        <span>Failed to load portal data. Please verify your authentication.</span>
      </div>
    );
  }

  const quotesList = quotes || [];
  const totalQuotes = quotesList.length;
  const underNegotiation = quotesList.filter((q) => q.status === 'UNDER NEGOTIATION').length;
  const confirmedQuotes = quotesList.filter((q) => q.status === 'CONFIRMED').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-purple-400/30">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Commercial Account • {customer?.tier || 'Gold Partner'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {customer?.name || 'Partner'}!
          </h1>
          <p className="text-sm text-purple-100/80 mt-2 font-normal leading-relaxed">
            Review active quotations from DealFlow360, request commercial adjustments, propose counter discounts, or confirm pending orders.
          </p>
          <div className="mt-6 flex items-center space-x-3">
            <Link
              to="/customer/quotes"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-purple-900 hover:bg-purple-50 rounded-xl font-bold text-xs shadow-md transition-all"
            >
              <span>View All Quotations ({totalQuotes})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Quotations</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalQuotes}</div>
          <p className="text-xs text-slate-400 mt-1">Issued for {customer?.company}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Under Negotiation</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{underNegotiation}</div>
          <p className="text-xs text-slate-400 mt-1">Active comments or counter proposals</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Confirmed Orders</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{confirmedQuotes}</div>
          <p className="text-xs text-slate-400 mt-1">Confirmed & in fulfillment</p>
        </div>
      </div>

      {/* Recent Activity Table Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Recent Commercial Proposals</h2>
          <Link to="/customer/quotes" className="text-xs font-bold text-purple-600 hover:text-purple-800">
            See all →
          </Link>
        </div>

        {quotesList.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No active quotations shared with your account yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {quotesList.slice(0, 3).map((q) => (
              <div key={q.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{q.quotationNumber}</div>
                  <div className="text-[11px] text-slate-500">
                    {q.lineCount} items • Valid until {new Date(q.validUntil).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-slate-900">
                      {(q.currencySymbol || q.currency || '₹')}{(q.totalWithTax || q.total || 0).toLocaleString()}
                    </div>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      {q.status}
                    </span>
                  </div>
                  <Link
                    to={`/customer/quotes/${q.id}`}
                    className="p-2 rounded-xl text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
