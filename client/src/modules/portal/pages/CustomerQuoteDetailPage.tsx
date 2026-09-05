import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  FileEdit,
  TrendingDown,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Calendar,
  AlertCircle,
  Loader2,
  Info,
} from 'lucide-react';
import { useCustomerQuoteDetail, usePortalActions } from '../hooks/useCustomerPortal';
import { NegotiationTimeline } from '../components/NegotiationTimeline';
import { LineCommentModal } from '../components/LineCommentModal';
import { ChangeRequestModal } from '../components/ChangeRequestModal';
import { CounterOfferModal } from '../components/CounterOfferModal';
import { QuoteConfirmDialog } from '../components/QuoteConfirmDialog';

export const CustomerQuoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const quoteId = id || '';

  const { data: quote, isLoading, isError, error } = useCustomerQuoteDetail(quoteId);
  const portalActions = usePortalActions(quoteId);

  // Modal States
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
  const [selectedLineForComment, setSelectedLineForComment] = useState<string | undefined>(undefined);
  const [isChangeRequestModalOpen, setIsChangeRequestModalOpen] = useState<boolean>(false);
  const [isCounterOfferModalOpen, setIsCounterOfferModalOpen] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-2" />
        <span className="text-sm font-medium">Loading quotation details...</span>
      </div>
    );
  }

  if (isError || !quote) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm max-w-lg mx-auto mt-10">
        <AlertCircle className="w-6 h-6 mb-2 text-red-600" />
        <h3 className="font-bold text-base">Access Restricted or Quote Not Found</h3>
        <p className="text-xs mt-1 text-red-600">
          {(error as Error)?.message || 'You do not have authorization to view this quotation or it does not exist.'}
        </p>
        <Link
          to="/customer/quotes"
          className="inline-block mt-4 text-xs font-bold bg-red-600 text-white px-4 py-2 rounded-xl"
        >
          Return to My Quotations
        </Link>
      </div>
    );
  }

  const handleOpenCommentForLine = (lineId?: string) => {
    setSelectedLineForComment(lineId);
    setIsCommentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Back Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <Link
          to="/customer/quotes"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Quotations</span>
        </Link>

        {/* Customer Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {quote.canNegotiate && (
            <>
              <button
                onClick={() => handleOpenCommentForLine(undefined)}
                className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all"
              >
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Line Comment</span>
              </button>

              <button
                onClick={() => setIsChangeRequestModalOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all"
              >
                <FileEdit className="w-4 h-4 text-purple-600" />
                <span>Request Change</span>
              </button>

              <button
                onClick={() => setIsCounterOfferModalOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all"
              >
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                <span>Propose Counter-Discount</span>
              </button>
            </>
          )}

          {quote.canConfirm ? (
            <button
              onClick={() => setIsConfirmDialogOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-200 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Quotation</span>
            </button>
          ) : (
            <span className="flex items-center space-x-1 px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Quotation Confirmed</span>
            </span>
          )}
        </div>
      </div>

      {/* Quote Header Information Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-slate-900">{quote.quotationNumber}</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  quote.status === 'CONFIRMED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : quote.status === 'UNDER NEGOTIATION'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-purple-100 text-purple-800 border border-purple-200'
                }`}
              >
                {quote.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <Building className="w-3.5 h-3.5" />
              <span>Prepared for {quote.companyName} ({quote.customerName})</span>
            </p>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Issue Date</span>
              <span className="font-semibold text-slate-800">
                {new Date(quote.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Valid Until</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                {new Date(quote.validUntil).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Customer-Visible Quote Line Items Table */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Commercial Line Items</h3>

          {/* Desktop Line Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Product / Service</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-4 py-3 text-right">Customer Discount</th>
                  <th className="px-4 py-3 text-right">Line Total</th>
                  {quote.canNegotiate && <th className="px-4 py-3 text-center">Item Comment</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {quote.lines.map((line) => (
                  <tr key={line.lineId} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{line.productName}</div>
                      {line.description && (
                        <div className="text-[11px] text-slate-500 mt-0.5">{line.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold">{line.quantity}</td>
                    <td className="px-4 py-3.5 text-right">${line.unitPrice.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right">
                      {line.discountPercent > 0 ? (
                        <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded">
                          {line.discountPercent}% (${line.discountAmount.toLocaleString()})
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right font-black text-slate-900">
                      ${line.lineTotal.toLocaleString()}
                    </td>
                    {quote.canNegotiate && (
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleOpenCommentForLine(line.lineId)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Add comment for this item"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary Calculation Card */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="max-w-md text-xs text-slate-500 space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Customer Transparency Commitment</span>
            </div>
            <p>
              Prices and terms listed are customer-sanitized commercial values. Confidential internal margin metrics and approval details are excluded for security.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${quote.subtotal.toLocaleString()}</span>
            </div>
            {quote.discountAmount > 0 && (
              <div className="flex justify-between text-purple-700 font-medium">
                <span>Applied Discount</span>
                <span>-${quote.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Tax / VAT</span>
              <span className="font-semibold text-slate-900">${quote.taxAmount.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-black text-sm text-slate-900">
              <span>Grand Total</span>
              <span className="text-base text-purple-700 font-extrabold">
                ${quote.total.toLocaleString()} {quote.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* WOW FEATURE — Negotiation Timeline */}
      <NegotiationTimeline events={quote.timeline} currentStatus={quote.status} />

      {/* Customer Comments & Change Requests History Feed */}
      {(quote.comments.length > 0 || quote.changeRequests.length > 0) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Active Negotiation Feed</h3>

          {/* Customer Line Comments */}
          {quote.comments.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase">Comments</div>
              {quote.comments.map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                      {c.authorName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600">{c.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Change Requests Feed */}
          {quote.changeRequests.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-500 uppercase">Change Requests</div>
              {quote.changeRequests.map((cr) => (
                <div key={cr.id} className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="text-purple-800">[{cr.type}] {cr.description}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
                      {cr.status}
                    </span>
                  </div>
                  {cr.requestedValue && (
                    <div className="text-[11px] text-purple-700 font-semibold">
                      Target value: {cr.requestedValue}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interactive Modals */}
      <LineCommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        onSubmit={portalActions.addComment}
        lines={quote.lines}
        defaultLineId={selectedLineForComment}
        isSubmitting={portalActions.isAddingComment}
      />

      <ChangeRequestModal
        isOpen={isChangeRequestModalOpen}
        onClose={() => setIsChangeRequestModalOpen(false)}
        onSubmit={portalActions.submitChangeRequest}
        lines={quote.lines}
        isSubmitting={portalActions.isSubmittingChangeRequest}
      />

      <CounterOfferModal
        isOpen={isCounterOfferModalOpen}
        onClose={() => setIsCounterOfferModalOpen(false)}
        onSubmit={portalActions.submitCounterOffer}
        currentSubtotal={quote.subtotal}
        currentDiscountAmount={quote.discountAmount}
        isSubmitting={portalActions.isSubmittingCounterOffer}
      />

      <QuoteConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={portalActions.confirmQuote}
        quotationNumber={quote.quotationNumber}
        totalAmount={quote.total}
        currency={quote.currency}
        isSubmitting={portalActions.isConfirmingQuote}
      />
    </div>
  );
};
