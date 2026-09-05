import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { QuotationService } from '../services/quotation.service';
import { Quotation } from '../types/quotation.types';
import { QuotationNavbar } from '../components/QuotationNavbar';
import { QuotationStatusBadge } from '../components/QuotationStatusBadge';
import { RiskBadge } from '../components/RiskBadge';
import { CommercialSummaryCard } from '../components/CommercialSummaryCard';
import {
  ArrowLeft,
  Edit2,
  Send,
  Building,
  Calendar,
  Layers,
  User,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export const QuotationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await QuotationService.getQuotationById(id);
        setQuotation(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load quotation');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleSubmitForApproval = async () => {
    if (!quotation) return;
    try {
      setSubmitting(true);
      const updated = await QuotationService.submitQuotation(quotation._id);
      setQuotation(updated);
      alert(
        updated.status === 'APPROVED'
          ? 'Quotation auto-approved within standard sales authority!'
          : 'Quotation submitted for management review.'
      );
    } catch (err: any) {
      alert(err.message || 'Failed to submit quotation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex flex-col font-sans">
        <QuotationNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500 text-sm">Loading quotation details...</div>
        </div>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex flex-col font-sans">
        <QuotationNavbar />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-16 text-center">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900">Quotation Not Found</h2>
          <p className="text-sm text-gray-500 mt-1">{error || 'Unable to retrieve quotation.'}</p>
          <Link
            to="/app/quotations"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quotations
          </Link>
        </div>
      </div>
    );
  }

  const customer =
    typeof quotation.customerId === 'object' ? (quotation.customerId as any) : null;

  return (
    <div className="min-h-screen bg-gray-50/60 flex flex-col font-sans">
      <QuotationNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/app/quotations"
              className="p-2 hover:bg-white rounded-lg border border-gray-200 text-gray-600 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {quotation.quotationNumber}
                </h1>
                <QuotationStatusBadge status={quotation.status} />
                <RiskBadge level={quotation.discountRiskLevel} score={quotation.discountRiskScore} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Created on {new Date(quotation.createdAt).toLocaleDateString()} • Currency:{' '}
                {quotation.currency}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {(quotation.status === 'DRAFT' || quotation.status === 'RETURNED') && (
              <>
                <Link
                  to={`/app/quotations/${quotation._id}/edit`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Quotation
                </Link>
                <button
                  onClick={handleSubmitForApproval}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit for Approval
                </button>
              </>
            )}

            {quotation.status === 'PENDING_APPROVAL' && (
              <Link
                to="/app/approvals"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                View in Approval Queue
              </Link>
            )}
          </div>
        </div>

        {/* Status Callout Banner */}
        {quotation.status === 'PENDING_APPROVAL' && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-sm">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Pending Management Approval</div>
              <div className="text-xs text-amber-800 mt-0.5">
                This quotation is currently locked and undergoing commercial review. Once approved, it will advance to finalized status.
              </div>
            </div>
          </div>
        )}

        {quotation.status === 'APPROVED' && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-900 text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Quotation Officially Approved</div>
              <div className="text-xs text-emerald-800 mt-0.5">
                All commercial terms and discounts have been validated. The quote is ready for customer presentation and subsequent invoicing.
              </div>
            </div>
          </div>
        )}

        {quotation.status === 'RETURNED' && (
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-3 text-orange-900 text-sm">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Returned for Commercial Revision</div>
              <div className="text-xs text-orange-800 mt-0.5">
                Review comments: {quotation.notes || 'Please adjust the requested discounts or terms.'}
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Info & Line Items (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Customer Information Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-600" />
                Customer & Account
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-gray-500 font-medium">Customer Name</div>
                  <div className="text-sm font-semibold text-gray-900 mt-0.5">
                    {customer?.name || 'Customer'}
                  </div>
                  <div className="text-gray-500">{customer?.company}</div>
                </div>
                <div>
                  <div className="text-gray-500 font-medium">Customer Tier</div>
                  <div className="mt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {customer?.tier || 'STANDARD'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-medium">Account Contact</div>
                  <div className="text-gray-900 font-medium mt-0.5">{customer?.email}</div>
                  <div className="text-gray-500">{customer?.phone || 'No phone'}</div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Quotation Line Items ({quotation.lines.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Item & SKU</th>
                      <th className="py-3 px-3 text-right">Qty</th>
                      <th className="py-3 px-3 text-right">Unit Price</th>
                      <th className="py-3 px-3 text-right">Discount</th>
                      <th className="py-3 px-3 text-right">Total</th>
                      <th className="py-3 px-4 text-right">Margin %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {quotation.lines.map((l, index) => (
                      <tr key={index} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-900">{l.productNameSnapshot}</div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                            <span>SKU: {l.productSkuSnapshot}</span>
                            <span>•</span>
                            <span>{l.productCategorySnapshot}</span>
                          </div>
                          {l.governanceReason && (
                            <div className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
                              <span>⚠️ {l.governanceReason}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-gray-900">
                          {l.quantity}
                        </td>
                        <td className="py-3.5 px-3 text-right text-gray-700">
                          ${l.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <span
                            className={`font-semibold ${
                              l.discountPercent > 0 ? 'text-rose-600' : 'text-gray-500'
                            }`}
                          >
                            {l.discountPercent}%
                          </span>
                          {l.discountAmount > 0 && (
                            <div className="text-[10px] text-gray-400">
                              -${l.discountAmount.toFixed(2)}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-gray-900">
                          ${l.lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              l.lineMarginPercent >= 30
                                ? 'bg-emerald-50 text-emerald-700'
                                : l.lineMarginPercent >= 20
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {l.lineMarginPercent.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Deal Notes */}
            {quotation.notes && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Commercial Notes & Internal Justification
                </h3>
                <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {quotation.notes}
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar: Commercial & Risk Summary (4 cols) */}
          <div className="lg:col-span-4">
            <CommercialSummaryCard
              summary={{
                subtotal: quotation.subtotal,
                totalDiscount: quotation.totalDiscount,
                totalTax: quotation.totalTax,
                grandTotal: quotation.grandTotal,
                costTotal: quotation.costTotal,
                grossMargin: quotation.grossMargin,
                grossMarginPercent: quotation.grossMarginPercent,
              }}
              risk={{
                score: quotation.discountRiskScore,
                level: quotation.discountRiskLevel,
                factors: quotation.discountRiskFactors,
                requiresApproval: quotation.approvalRequired,
              }}
              currency={quotation.currency}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
