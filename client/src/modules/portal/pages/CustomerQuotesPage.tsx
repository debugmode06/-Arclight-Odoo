import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, ArrowRight, FileText, CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react';
import { useCustomerQuotes } from '../hooks/useCustomerPortal';

export const CustomerQuotesPage: React.FC = () => {
  const { data: quotes, isLoading, isError } = useCustomerQuotes();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-2" />
        <span className="text-sm font-medium">Loading your quotations...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
        <AlertCircle className="w-5 h-5 mb-2 text-red-600" />
        <span>Failed to load quotations. Please ensure you are authenticated.</span>
      </div>
    );
  }

  let filtered = (quotes || []).filter((q) => {
    const matchesSearch =
      q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'ALL' || q.status.toUpperCase() === selectedStatus.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'amount') {
      return (b.totalWithTax || b.total || 0) - (a.totalWithTax || a.total || 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Corporate Quotations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review line pricing, add comments, request change adjustments, propose counter discounts, and confirm orders.
          </p>
        </div>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by quote # or company..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {['ALL', 'SENT', 'UNDER NEGOTIATION', 'CONFIRMED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-white text-purple-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Quotes' : st}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-600 self-end md:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none"
          >
            <option value="date">Newest Date</option>
            <option value="amount">Highest Total</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Quotations Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            No quotations matched your selected search criteria or status filter.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Quote Reference</th>
                  <th className="px-6 py-3.5">Customer & Tier</th>
                  <th className="px-6 py-3.5">Validity Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Grand Total</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((quote) => (
                  <tr key={quote.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-900">{quote.quotationNumber}</div>
                      <div className="text-[10px] text-slate-400">{quote.lineCount} items</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800 font-semibold">{quote.companyName}</div>
                      <div className="text-[10px] text-slate-400">{quote.customerName}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(quote.validUntil).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          quote.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : quote.status === 'UNDER NEGOTIATION'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-black text-slate-900">
                        {quote.currencySymbol || '₹'}{(quote.totalWithTax || quote.total || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">{quote.currencyCode || 'INR'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/customer/quotes/${quote.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-bold transition-colors text-xs"
                      >
                        <span>Review & Act</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {filtered.map((quote) => (
              <div key={quote.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-black text-slate-900 text-sm">{quote.quotationNumber}</div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      quote.status === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : quote.status === 'UNDER NEGOTIATION'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-0.5">
                  <div>Company: <span className="font-semibold text-slate-900">{quote.companyName}</span></div>
                  <div>Valid until: {new Date(quote.validUntil).toLocaleDateString()}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Total</div>
                    <div className="text-base font-black text-slate-900">
                      {quote.currencySymbol || '₹'}{(quote.totalWithTax || quote.total || 0).toLocaleString()} <span className="text-xs font-medium text-slate-500">{quote.currencyCode || 'INR'}</span>
                    </div>
                  </div>
                  <Link
                    to={`/customer/quotes/${quote.id}`}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-purple-600 text-white rounded-xl font-bold text-xs shadow-xs"
                  >
                    <span>View Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
