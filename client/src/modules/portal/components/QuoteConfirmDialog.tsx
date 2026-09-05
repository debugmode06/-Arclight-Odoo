import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { termsAccepted: boolean; customerNotes?: string }) => Promise<any>;
  quotationNumber: string;
  totalAmount: number;
  currency: string;
  isSubmitting: boolean;
}

export const QuoteConfirmDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  quotationNumber,
  totalAmount,
  currency,
  isSubmitting,
}) => {
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('You must accept the terms and conditions to confirm this quotation.');
      return;
    }
    setError(null);
    try {
      await onConfirm({ termsAccepted, customerNotes: customerNotes.trim() || undefined });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to confirm quotation');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {isSuccess ? (
          <div className="py-8 text-center animate-in zoom-in-90 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Quotation Confirmed!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Thank you! Quotation <span className="font-bold text-slate-900">{quotationNumber}</span> has been officially confirmed and binding order processing has commenced.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Confirm Quotation</h3>
                  <p className="text-xs text-slate-500">Official Acceptance & Order Authorization</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium">
                  {error}
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quotation Reference</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">{quotationNumber}</div>
                <div className="text-xl font-black text-emerald-600 mt-1">
                  ${totalAmount.toLocaleString()} <span className="text-xs font-semibold text-slate-500">{currency}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PO Number or Purchase Notes (Optional)
                </label>
                <input
                  type="text"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. PO-884920 / Billing contact: finance@techcorp.com"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="accept-terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <label htmlFor="accept-terms" className="text-xs text-slate-600 cursor-pointer select-none leading-tight">
                  I confirm that I am authorized to accept this quotation on behalf of my organization and agree to the specified commercial terms.
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !termsAccepted}
                  className="flex items-center space-x-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-200 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Confirming Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Quotation Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
