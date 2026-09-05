import React, { useState } from 'react';
import { X, FileEdit, Send, Loader2 } from 'lucide-react';
import { CustomerQuoteLineItem } from '../types/portal.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    lineId?: string;
    type: 'QUANTITY' | 'PRODUCT' | 'COMMERCIAL' | 'DELIVERY' | 'OTHER';
    description: string;
    requestedValue?: string;
  }) => Promise<any>;
  lines: CustomerQuoteLineItem[];
  isSubmitting: boolean;
}

export const ChangeRequestModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  lines,
  isSubmitting,
}) => {
  const [selectedLineId, setSelectedLineId] = useState<string>('');
  const [requestType, setRequestType] = useState<'QUANTITY' | 'PRODUCT' | 'COMMERCIAL' | 'DELIVERY' | 'OTHER'>('QUANTITY');
  const [description, setDescription] = useState<string>('');
  const [requestedValue, setRequestedValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a description of your change request.');
      return;
    }
    setError(null);
    try {
      await onSubmit({
        lineId: selectedLineId || undefined,
        type: requestType,
        description: description.trim(),
        requestedValue: requestedValue.trim() || undefined,
      });
      setDescription('');
      setRequestedValue('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit change request');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileEdit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Request Quotation Change</h3>
              <p className="text-xs text-slate-500">Propose Modifications to Quantities, Deliverables, or Terms</p>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Request Type</label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as any)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
            >
              <option value="QUANTITY">Quantity Change Request</option>
              <option value="DELIVERY">Delivery Schedule / Phasing Request</option>
              <option value="COMMERCIAL">Commercial Terms / Payment Schedule</option>
              <option value="PRODUCT">Product Specification / Addon Request</option>
              <option value="OTHER">Other Specific Request</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Product Line (Optional)</label>
            <select
              value={selectedLineId}
              onChange={(e) => setSelectedLineId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            >
              <option value="">Applies to Entire Quotation</option>
              {lines.map((item) => (
                <option key={item.lineId} value={item.lineId}>
                  {item.productName} (Current Qty: {item.quantity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Requested Target Value (Optional)</label>
            <input
              type="text"
              value={requestedValue}
              onChange={(e) => setRequestedValue(e.target.value)}
              placeholder="e.g. 75 seats (or Phased Oct 1st rollout)"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description & Reason</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the change you are requesting and the business motivation..."
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
                  <span>Submit Change Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
