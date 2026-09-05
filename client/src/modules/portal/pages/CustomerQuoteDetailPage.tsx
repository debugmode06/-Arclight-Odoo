import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortalService } from '../services/portal.service';
import {
  ArrowLeft,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Send,
  X,
  Clock,
  Building,
} from 'lucide-react';

export const CustomerQuoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Negotiation Modal State
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [negotiationText, setNegotiationText] = useState('');
  const [counterDiscount, setCounterDiscount] = useState<number>(15);
  const [submitting, setSubmitting] = useState(false);

  const loadQuote = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await PortalService.getCustomerQuoteById(id);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuote();
  }, [id]);

  const handleSubmitNegotiation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setSubmitting(true);
      const result = await PortalService.submitNegotiation(id, {
        text: negotiationText,
        counterDiscountPercent: Number(counterDiscount),
      });

      if (result.reapprovalTriggered) {
        alert(
          'Counter-proposal submitted. The requested discount exceeds standard sales authority and has been routed to executive sales management for review.'
        );
      } else {
        alert('Counter-proposal and feedback sent to your sales representative.');
      }
      setShowNegotiationModal(false);
      setNegotiationText('');
      loadQuote();
    } catch (err: any) {
      alert(err?.response?.data?.error?.message || err?.message || 'Failed to submit negotiation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptQuote = async () => {
    if (!id) return;
    if (!confirm('Confirm and accept this quotation? This will convert the terms into an authorized order.')) return;
    try {
      await PortalService.acceptQuote(id);
      alert('Congratulations! Quotation confirmed and converted to order.');
      loadQuote();
    } catch (err: any) {
      alert(err?.response?.data?.error?.message || err?.message || 'Failed to accept quotation');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading proposal details...</div>;
  }

  if (!data?.quotation) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-500">
        Quotation could not be located.
      </div>
    );
  }

  const quote = data.quotation;
  const negotiation = data.negotiation;

  return (
    <div className="space-y-6">
      {/* Back link & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/customer/quotes"
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{quote.quotationNumber}</h1>
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  quote.status === 'APPROVED' || quote.status === 'WON'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : quote.status === 'PENDING_APPROVAL'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-purple-50 text-[#6344e7] border border-purple-200'
                }`}
              >
                {quote.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Issued {new Date(quote.createdAt).toLocaleDateString()}
              {quote.validUntil && ` • Valid Until: ${new Date(quote.validUntil).toLocaleDateString()}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowNegotiationModal(true)}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Request Changes / Counter Discount</span>
          </button>

          {quote.status !== 'WON' && (
            <button
              type="button"
              onClick={handleAcceptQuote}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm & Accept Quotation</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Proposal Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
            Commercial Line Item Schedule
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                  <th className="py-2.5 px-3 font-semibold">Product Description</th>
                  <th className="py-2.5 px-3 font-semibold">SKU</th>
                  <th className="py-2.5 px-3 font-semibold">Qty</th>
                  <th className="py-2.5 px-3 font-semibold">Unit List Price</th>
                  <th className="py-2.5 px-3 font-semibold">Applied Discount</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Net Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quote.lines?.map((line: any) => (
                  <tr key={line._id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-slate-800">{line.productName}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{line.sku}</td>
                    <td className="py-3 px-3">{line.quantity}</td>
                    <td className="py-3 px-3 text-slate-700">${line.unitPrice?.toLocaleString()}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-600">{line.discountPercent}%</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      ${line.lineTotal?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-slate-100 gap-4">
          <div className="text-xs text-slate-500">
            {quote.notes && <p className="italic">Note: {quote.notes}</p>}
          </div>

          <div className="space-y-1.5 text-right text-xs">
            <div className="flex justify-between sm:justify-end gap-6 text-slate-600">
              <span>List Subtotal:</span>
              <span className="font-semibold">${quote.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between sm:justify-end gap-6 text-emerald-600 font-semibold">
              <span>Contractual Discount:</span>
              <span>-${quote.totalDiscount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between sm:justify-end gap-6 text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Investment:</span>
              <span className="text-[#6344e7]">${quote.grandTotal?.toLocaleString()} {quote.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Negotiation Thread History */}
      {negotiation?.messages?.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-[#6344e7]" />
            Negotiation & Feedback History
          </h3>

          <div className="space-y-3">
            {negotiation.messages.map((m: any, idx: number) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  m.senderRole === 'CUSTOMER'
                    ? 'bg-purple-50/60 border-purple-100 ml-auto max-w-xl text-slate-800'
                    : 'bg-slate-50 border-slate-200 mr-auto max-w-xl text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-bold text-[#6344e7]">{m.senderName} ({m.senderRole})</span>
                  <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="leading-relaxed">{m.text}</p>
                {m.counterDiscountPercent && (
                  <div className="text-[11px] font-bold text-purple-700 pt-1">
                    Proposed Counter Discount: {m.counterDiscountPercent}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Negotiation Modal */}
      {showNegotiationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Request Commercial Adjustments</h3>
              <button
                type="button"
                onClick={() => setShowNegotiationModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNegotiation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Counter Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={counterDiscount}
                  onChange={(e) => setCounterDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-purple-700 text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  If counter discount exceeds policy limits, the proposal will automatically re-enter executive review.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes & Commercial Justification</label>
                <textarea
                  rows={3}
                  required
                  value={negotiationText}
                  onChange={(e) => setNegotiationText(e.target.value)}
                  placeholder="e.g. Seeking 18% discount to meet Q3 procurement budget constraints..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNegotiationModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-[#6344e7] hover:bg-[#5233d4] text-white rounded-xl font-semibold shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Counter-Proposal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
