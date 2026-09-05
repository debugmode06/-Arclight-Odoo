import React from 'react';
import { CustomerQuoteLineItem } from '../types/portal.types';
import { CheckCircle2, Clock, MessageSquare, RotateCcw, MapPin, ArrowRight } from 'lucide-react';

interface Props {
  line: CustomerQuoteLineItem;
  currencySymbol: string;
  onFocusLine: (line: CustomerQuoteLineItem) => void;
  onAcceptLine: (lineId: string) => void;
  isFocused: boolean;
}

export const LineItemCard: React.FC<Props> = ({
  line,
  currencySymbol,
  onFocusLine,
  onAcceptLine,
  isFocused,
}) => {
  return (
    <div
      className={`bg-white rounded-3xl border transition-all p-6 shadow-sm relative ${
        isFocused
          ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-md'
          : 'border-slate-200/80 hover:border-purple-300'
      }`}
    >
      {/* Top Header Pills & Net Line Total */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 text-[10px] font-black bg-slate-100 text-slate-800 rounded-lg uppercase tracking-wider">
            {line.lineNo}
          </span>
          <span className="px-2.5 py-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            {line.categoryTag}
          </span>
          <span
            className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
              line.statusTagColor === 'green'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : line.statusTagColor === 'coral'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}
          >
            {line.statusTag}
          </span>
        </div>

        <div className="text-right">
          <div className="text-sm font-extrabold text-slate-900">
            {currencySymbol}{line.lineTotal.toLocaleString()} {line.unit && <span className="text-xs font-normal text-slate-500">/ {line.unit}</span>}
          </div>
          {line.discountAmount > 0 && (
            <div className="text-[11px] font-bold text-emerald-600">
              {line.discountPercent}% Off List (-{currencySymbol}{line.discountAmount.toLocaleString()})
            </div>
          )}
        </div>
      </div>

      {/* Main Title & Description */}
      <div className="mt-4">
        <h3 className="text-base font-black text-slate-900 leading-snug">{line.productName}</h3>
        {line.subtitle && (
          <div className="text-xs font-bold text-purple-700 mt-0.5">{line.subtitle}</div>
        )}
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{line.description}</p>
      </div>

      {/* Detailed Metrics Row */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Quantity</span>
          <span className="font-extrabold text-slate-900">{line.quantity} {line.unit}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">List Unit Price</span>
          <span className="font-semibold text-slate-700">{currencySymbol}{line.listUnitPrice.toLocaleString()} / {line.unit}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Effective Unit Price</span>
          <span className="font-extrabold text-emerald-700">{currencySymbol}{line.effectiveUnitPrice.toLocaleString()} / {line.unit}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Multi-Depot Allocation</span>
          <span className="font-semibold text-slate-800 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-purple-600 shrink-0" />
            {line.depotAllocation || 'Standard Warehouse'}
          </span>
        </div>
      </div>

      {/* Counter Offer Highlight Box (If Counter Submitted) */}
      {line.hasCounterOffer && (
        <div className="mt-4 bg-purple-50/90 border border-purple-200/80 rounded-2xl p-4 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs font-bold">
              <span className="px-2 py-0.5 bg-purple-700 text-white rounded-md text-[10px] font-black">YOU</span>
              <span className="text-slate-900 font-extrabold">Acme Requested Counter:</span>
              <span className="text-purple-800 font-black">
                {currencySymbol}{line.counterRequestedPrice?.toLocaleString()} / {line.unit}
              </span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full text-[10px] font-extrabold border border-rose-200">
                {line.counterDiscountPercent}% Discount (-{currencySymbol}{line.counterRequestedDiscountAmount?.toLocaleString()} requested)
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              {line.counterTimestamp || 'Submitted Today, 10:42 AM'}
            </span>
          </div>

          {line.counterMessage && (
            <blockquote className="text-xs text-slate-700 italic bg-white p-3 rounded-xl border border-purple-100 leading-relaxed">
              {line.counterMessage}
            </blockquote>
          )}
        </div>
      )}

      {/* Footer Notes & Action Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-[11px] text-slate-500 font-medium flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{line.notes || 'Inventory reserved and locked for customer review.'}</span>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          {line.hasCounterOffer ? (
            <>
              <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors">
                Withdraw Counter
              </button>
              <button
                onClick={() => onFocusLine(line)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs transition-all"
              >
                Adjust Terms in Drawer
              </button>
            </>
          ) : line.statusTag === 'Accepted Line Price' ? (
            <button
              onClick={() => onFocusLine(line)}
              className="px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
            >
              View Allocation &gt;
            </button>
          ) : (
            <>
              <button
                onClick={() => onFocusLine(line)}
                className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors"
              >
                Modify Request
              </button>
              <button
                onClick={() => onAcceptLine(line.lineId)}
                className="px-4 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
              >
                {line.customerActionText || `Accept Line (${currencySymbol}${line.lineTotal.toLocaleString()})`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
