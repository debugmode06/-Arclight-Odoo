import React, { useState } from 'react';
import { X, MessageSquare, Send, Loader2 } from 'lucide-react';
import { CustomerQuoteLineItem } from '../types/portal.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { lineId?: string; comment: string }) => Promise<any>;
  lines: CustomerQuoteLineItem[];
  defaultLineId?: string;
  isSubmitting: boolean;
}

export const LineCommentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  lines,
  defaultLineId,
  isSubmitting,
}) => {
  const [selectedLineId, setSelectedLineId] = useState<string>(defaultLineId || '');
  const [commentText, setCommentText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setError('Please enter a comment before submitting.');
      return;
    }
    setError(null);
    try {
      await onSubmit({
        lineId: selectedLineId || undefined,
        comment: commentText.trim(),
      });
      setCommentText('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit comment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Line Comment</h3>
              <p className="text-xs text-slate-500">Provide Feedback or Ask a Question on Quotation Items</p>
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Quotation Item</label>
            <select
              value={selectedLineId}
              onChange={(e) => setSelectedLineId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            >
              <option value="">General (Overall Quotation)</option>
              {lines.map((item) => (
                <option key={item.lineId} value={item.lineId}>
                  {item.productName} ({item.quantity} × ${(item.effectiveUnitPrice || item.unitPrice || 0).toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Comment / Note</label>
            <textarea
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="e.g. Can you clarify if emergency weekend support is included in this line item pricing?"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
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
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-xl shadow-xs shadow-purple-200 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Comment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
