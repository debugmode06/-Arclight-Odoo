import React, { useState, useEffect, useTransition } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QuotationService } from '../services/quotation.service';
import { Quotation, QuotationStatus, RiskLevel } from '../types/quotation.types';
import { QuotationNavbar } from '../components/QuotationNavbar';
import { QuotationStatusBadge } from '../components/QuotationStatusBadge';
import { RiskBadge } from '../components/RiskBadge';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  Send,
  RefreshCw,
  Building,
} from 'lucide-react';

export const QuotationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [isPending, startTransition] = useTransition();

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (riskFilter !== 'ALL') params.riskLevel = riskFilter;

      const res = await QuotationService.listQuotations(params);
      setQuotations(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load quotations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [statusFilter, riskFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuotations();
  };

  const handleDelete = async (id: string, quoteNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete quotation ${quoteNumber}?`)) {
      return;
    }
    try {
      await QuotationService.deleteQuotation(id);
      setQuotations((prev) => prev.filter((q) => q._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete quotation');
    }
  };

  const handleSubmitQuote = async (id: string) => {
    try {
      const updated = await QuotationService.submitQuotation(id);
      setQuotations((prev) => prev.map((q) => (q._id === id ? updated : q)));
      alert(
        updated.status === 'APPROVED'
          ? 'Quotation auto-approved within authorized sales limits!'
          : 'Quotation submitted for management review.'
      );
    } catch (err: any) {
      alert(err.message || 'Failed to submit quotation');
    }
  };

  // Compute Metrics
  const totalValue = quotations.reduce((acc, q) => acc + (q.grandTotal || 0), 0);
  const pendingCount = quotations.filter((q) => q.status === 'PENDING_APPROVAL').length;
  const approvedValue = quotations
    .filter((q) => q.status === 'APPROVED')
    .reduce((acc, q) => acc + (q.grandTotal || 0), 0);
  const avgMargin =
    quotations.length > 0
      ? quotations.reduce((acc, q) => acc + (q.grossMarginPercent || 0), 0) / quotations.length
      : 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="min-h-screen bg-gray-50/60 flex flex-col font-sans">
      <QuotationNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quotations</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Build, govern, and track enterprise commercial proposals.
            </p>
          </div>
          <Link
            to="/app/quotations/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold shadow-sm shadow-purple-200 transition-all hover:shadow"
          >
            <Plus className="w-4 h-4" />
            New Quotation
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Total Pipeline</span>
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-gray-900 mt-2">
              {formatCurrency(totalValue)}
            </div>
            <div className="text-xs text-gray-500 mt-1">{quotations.length} active quotes</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Approved Deals</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-emerald-600 mt-2">
              {formatCurrency(approvedValue)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Ready for contract & invoicing</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Pending Review</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-amber-600 mt-2">{pendingCount}</div>
            <div className="text-xs text-gray-500 mt-1">Awaiting manager / finance sign-off</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Avg Gross Margin</span>
              <span className="text-xs font-bold text-purple-600">Benchmark 30%</span>
            </div>
            <div className="text-xl font-bold text-gray-900 mt-2">{avgMargin.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-1">Blended portfolio profitability</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search quotation #, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="RETURNED">Returned</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Risk Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium">Risk:</span>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="HIGH">High Risk</option>
                <option value="CRITICAL">Critical Risk</option>
              </select>
            </div>

            <button
              onClick={fetchQuotations}
              className="p-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-600 mb-2" />
              <div className="text-sm font-medium text-gray-600">Loading quotations...</div>
            </div>
          ) : error ? (
            <div className="py-16 text-center text-rose-600">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <div className="text-sm font-medium">{error}</div>
              <button
                onClick={fetchQuotations}
                className="mt-3 px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg hover:bg-rose-100"
              >
                Retry
              </button>
            </div>
          ) : quotations.length === 0 ? (
            <div className="py-20 text-center">
              <FileText className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <h3 className="text-sm font-semibold text-gray-900">No quotations found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No quotations match the active criteria. Create a new quotation to begin the sales workflow.
              </p>
              <Link
                to="/app/quotations/new"
                className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Quotation
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Quote #</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Gross Margin</th>
                    <th className="py-3.5 px-4">Governance Risk</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {quotations.map((quote) => {
                    const customer =
                      typeof quote.customerId === 'object' && quote.customerId !== null
                        ? (quote.customerId as any)
                        : null;

                    return (
                      <tr key={quote._id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-purple-700">
                          <Link
                            to={`/app/quotations/${quote._id}`}
                            className="hover:underline flex items-center gap-1"
                          >
                            {quote.quotationNumber}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-gray-900">
                            {customer?.name || 'Customer'}
                          </div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <span>{customer?.company}</span>
                            {customer?.tier && (
                              <span className="px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded text-[10px] font-semibold">
                                {customer.tier}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-900">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: quote.currency || 'USD',
                          }).format(quote.grandTotal)}
                          {quote.totalDiscount > 0 && (
                            <div className="text-[10px] text-rose-500 font-normal">
                              Disc: -${quote.totalDiscount.toFixed(2)}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-800">
                            {quote.grossMarginPercent.toFixed(1)}%
                          </div>
                          <div className="text-[10px] text-gray-500">
                            ${(quote.grossMargin || 0).toLocaleString()} margin
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <RiskBadge level={quote.discountRiskLevel} score={quote.discountRiskScore} />
                        </td>
                        <td className="py-3.5 px-4">
                          <QuotationStatusBadge status={quote.status} />
                        </td>
                        <td className="py-3.5 px-4 text-gray-500">
                          {new Date(quote.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Link
                              to={`/app/quotations/${quote._id}`}
                              className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-purple-600 transition-colors"
                              title="View Detail"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>

                            {(quote.status === 'DRAFT' || quote.status === 'RETURNED') && (
                              <>
                                <Link
                                  to={`/app/quotations/${quote._id}/edit`}
                                  className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-indigo-600 transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  onClick={() => handleSubmitQuote(quote._id)}
                                  className="p-1.5 hover:bg-purple-50 rounded text-gray-600 hover:text-purple-600 transition-colors"
                                  title="Submit for Approval"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}

                            {quote.status === 'DRAFT' && (
                              <button
                                onClick={() => handleDelete(quote._id, quote.quotationNumber)}
                                className="p-1.5 hover:bg-rose-50 rounded text-gray-400 hover:text-rose-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
