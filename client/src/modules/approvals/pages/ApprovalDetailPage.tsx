import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ApprovalService } from '../services/approval.service';
import { ApprovalRequest } from '../types/approval.types';
import { QuotationNavbar } from '../../quotations/components/QuotationNavbar';
import { RiskBadge } from '../../quotations/components/RiskBadge';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Clock,
  User,
  ShieldCheck,
  FileText,
  DollarSign,
  Layers,
  MessageSquare,
} from 'lucide-react';

export const ApprovalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [approval, setApproval] = useState<ApprovalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Decision form
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchApproval = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await ApprovalService.getApprovalById(id);
      setApproval(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load approval request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproval();
  }, [id]);

  const handleAction = async (type: 'APPROVE' | 'REJECT' | 'RETURN') => {
    if (!id) return;

    if ((type === 'REJECT' || type === 'RETURN') && !comment.trim()) {
      setActionError(`A comment is required when ${type === 'REJECT' ? 'rejecting' : 'returning'} a quotation.`);
      return;
    }

    try {
      setSubmitting(true);
      setActionError(null);

      let updated;
      if (type === 'APPROVE') {
        updated = await ApprovalService.approve(id, comment.trim() || 'Approved proposal');
      } else if (type === 'REJECT') {
        updated = await ApprovalService.reject(id, comment.trim());
      } else {
        updated = await ApprovalService.returnForRevision(id, comment.trim());
      }

      setApproval(updated);
      setComment('');
      alert(
        type === 'APPROVE'
          ? 'Quotation approval recorded successfully!'
          : type === 'REJECT'
          ? 'Quotation has been rejected.'
          : 'Quotation has been returned to sales rep for revision.'
      );
    } catch (err: any) {
      setActionError(err.message || 'Failed to process approval action');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex flex-col font-sans">
        <QuotationNavbar />
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
          Loading approval evaluation details...
        </div>
      </div>
    );
  }

  if (error || !approval) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex flex-col font-sans">
        <QuotationNavbar />
        <div className="flex-1 max-w-2xl mx-auto px-4 py-16 text-center">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900">Approval Request Not Found</h2>
          <p className="text-xs text-gray-500 mt-1">{error}</p>
          <Link
            to="/app/approvals"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Approvals
          </Link>
        </div>
      </div>
    );
  }

  const quote = typeof approval.quotationId === 'object' ? approval.quotationId : null;
  const customer = quote && typeof quote.customerId === 'object' ? (quote.customerId as any) : null;
  const isFinalized = approval.status === 'APPROVED' || approval.status === 'REJECTED';

  return (
    <div className="min-h-screen bg-gray-50/60 flex flex-col font-sans">
      <QuotationNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/app/approvals"
              className="p-2 hover:bg-white rounded-lg border border-gray-200 text-gray-600 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Review: {approval.quotationNumber}
                </h1>
                <RiskBadge
                  level={approval.riskLevelSnapshot as any}
                  score={approval.riskScoreSnapshot}
                />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Submitted by {approval.requestedByNameSnapshot} on{' '}
                {new Date(approval.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/app/quotations/${quote?._id || approval.quotationId}`}
              className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-xs"
            >
              View Full Quotation
            </Link>
          </div>
        </div>

        {/* 2-Column Review Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Left Area: Proposal Summary & Line Items (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Commercial Context Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-600" />
                Commercial Terms & Governance Triggers
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/70 p-4 rounded-xl border border-gray-100 text-xs">
                <div>
                  <div className="text-gray-500">Grand Total</div>
                  <div className="text-base font-bold text-gray-900 mt-0.5">
                    ${(approval.grandTotalSnapshot || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Discount Amount</div>
                  <div className="text-base font-bold text-rose-600 mt-0.5">
                    ${(approval.discountSnapshot || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Gross Margin %</div>
                  <div className="text-base font-bold text-emerald-600 mt-0.5">
                    {approval.marginSnapshot?.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Risk Score</div>
                  <div className="text-base font-bold text-purple-700 mt-0.5">
                    {approval.riskScoreSnapshot} / 100
                  </div>
                </div>
              </div>

              {approval.reason && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                  <div className="font-semibold flex items-center gap-1.5 mb-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Governance Approval Requirement:
                  </div>
                  <div className="text-amber-800">{approval.reason}</div>
                </div>
              )}
            </div>

            {/* Line Items Snapshot */}
            {quote && quote.lines && quote.lines.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    Quotation Line Items ({quote.lines.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="py-2.5 px-4">Item</th>
                        <th className="py-2.5 px-3 text-right">Qty</th>
                        <th className="py-2.5 px-3 text-right">Price</th>
                        <th className="py-2.5 px-3 text-right">Discount</th>
                        <th className="py-2.5 px-3 text-right">Total</th>
                        <th className="py-2.5 px-4 text-right">Margin %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {quote.lines.map((line, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{line.productNameSnapshot}</div>
                            <div className="text-[10px] text-gray-500">{line.productCategorySnapshot}</div>
                          </td>
                          <td className="py-3 px-3 text-right font-medium text-gray-800">
                            {line.quantity}
                          </td>
                          <td className="py-3 px-3 text-right text-gray-700">
                            ${line.unitPrice?.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right font-semibold text-rose-600">
                            {line.discountPercent}%
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-gray-900">
                            ${line.lineTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-emerald-700">
                            {line.lineMarginPercent?.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Audit Trail & Action History */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                Audit Trail & History ({approval.actions?.length || 0})
              </h3>

              {!approval.actions || approval.actions.length === 0 ? (
                <p className="text-xs text-gray-500 italic">
                  No review actions have been taken yet on this request.
                </p>
              ) : (
                <div className="space-y-3">
                  {approval.actions.map((act, index) => (
                    <div
                      key={act._id || index}
                      className="p-3.5 rounded-lg bg-gray-50/80 border border-gray-200/70 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          <span>{act.actorNameSnapshot}</span>
                          <span className="px-1.5 py-0.2 bg-purple-100 text-purple-700 rounded text-[10px]">
                            {act.actorRole}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            act.action === 'APPROVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : act.action === 'REJECT'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {act.action}
                        </span>
                      </div>
                      <div className="text-gray-700 text-xs">{act.comment}</div>
                      <div className="text-[10px] text-gray-400">
                        {new Date(act.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Area: Approval Chain & Decision Console (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Multi-Step Approval Chain Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Required Approval Chain
              </h3>

              <div className="space-y-3">
                {approval.requiredSteps?.map((step, idx) => {
                  const isCurrent = approval.currentStep === step.step && !isFinalized;
                  const isPassed = step.status === 'APPROVED';

                  return (
                    <div
                      key={step.step}
                      className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isPassed
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                          : isCurrent
                          ? 'bg-purple-50/50 border-purple-300 text-purple-900 shadow-xs ring-1 ring-purple-200'
                          : 'bg-gray-50 border-gray-200 text-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            isPassed
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-300 text-gray-700'
                          }`}
                        >
                          {isPassed ? '✓' : step.step}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {step.step === 1 ? 'Step 1: Sales Manager Review' : 'Step 2: Finance Operations Review'}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Required Role: {step.role}
                          </div>
                        </div>
                      </div>

                      <div>
                        {isPassed ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            APPROVED
                          </span>
                        ) : isCurrent ? (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded animate-pulse">
                            ACTIVE STEP
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-gray-400">PENDING</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decision Actions Console */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                Review Decision
              </h3>

              {isFinalized ? (
                <div
                  className={`p-4 rounded-xl text-center text-xs font-semibold ${
                    approval.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  This approval request has been finalized as {approval.status}.
                </div>
              ) : (
                <div className="space-y-4">
                  {actionError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                      {actionError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-700">
                      Reviewer Comment & Rationale <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Specify rationale for approval, or feedback/guidance for rejection or revision..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleAction('APPROVE')}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </button>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleAction('RETURN')}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Return
                    </button>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleAction('REJECT')}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
