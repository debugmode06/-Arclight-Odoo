import React, { useState } from 'react';
import { ShieldCheck, Info, MessageSquare, Send, CheckCircle2, RotateCcw, Lock } from 'lucide-react';
import { CustomerQuoteLineItem, ConcessionTradeOff } from '../types/portal.types';

interface Props {
  activeLine: CustomerQuoteLineItem;
  tradeOffs: ConcessionTradeOff[];
  currencySymbol: string;
  assignedRep: {
    name: string;
    email: string;
    avatarInitials: string;
    title: string;
    statusText: string;
  };
  onSubmitCounter: (payload: { proposedDiscount: number; selectedTradeOffId?: string; justification?: string }) => Promise<void>;
  onAcceptLine: () => Promise<void>;
  isSubmitting: boolean;
}

export const SmartNegotiationAssistant: React.FC<Props> = ({
  activeLine,
  tradeOffs,
  currencySymbol,
  assignedRep,
  onSubmitCounter,
  onAcceptLine,
  isSubmitting,
}) => {
  const [discountPercent, setDiscountPercent] = useState<number>(18.0);
  const [selectedTradeOffId, setSelectedTradeOffId] = useState<string>(tradeOffs[0]?.id || '');
  const [justification, setJustification] = useState<string>('');

  const listUnitPrice = activeLine.listUnitPrice;
  const proposedNetPrice = Math.round(listUnitPrice * (1 - discountPercent / 100));
  const annualSavings = listUnitPrice - proposedNetPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitCounter({
      proposedDiscount: discountPercent,
      selectedTradeOffId,
      justification,
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-purple-200/80 shadow-xl overflow-hidden flex flex-col font-sans">
      {/* Smart Assistant Purple Top Header */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 p-5 text-white relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/30 flex items-center justify-center border border-purple-400/40">
              <ShieldCheck className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight leading-tight">Smart Negotiation Assistant</h3>
              <p className="text-[11px] text-purple-200/80">
                Live line-item calibration workspace. Propose adjustments or trade concessions for instant automatic approval.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-bold bg-purple-500/30 text-purple-100 rounded-full border border-purple-400/40 shrink-0">
            Customer Safe
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5 flex-1 bg-gradient-to-b from-purple-50/30 to-white text-slate-800">
        {/* Active Line in Focus */}
        <div className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between text-xs">
          <div>
            <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Active Line in Focus</div>
            <div className="font-extrabold text-slate-900 mt-0.5">{activeLine.productName}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400">Base Rate</div>
            <div className="font-extrabold text-slate-900">{currencySymbol}{activeLine.lineTotal.toLocaleString()}/yr</div>
          </div>
        </div>

        {/* Governance Delegation Notice Box */}
        <div className="bg-purple-50/80 border border-purple-200/80 rounded-2xl p-3.5 flex items-start space-x-3 text-xs text-purple-950">
          <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed text-[11px]">
            <span className="font-bold text-purple-900 block mb-0.5">Governance Delegation Notice</span>
            Your proposed {discountPercent}% discount exceeds {assignedRep.name}'s standard rep ceiling. Upon submission, this dossier route to <span className="font-bold text-purple-900">VP Commercial Governance</span> with an autonomous SLA resolution of <span className="font-bold text-purple-900">&lt; 2 Hours</span>.
          </div>
        </div>

        {/* Interactive Discount Range Slider */}
        <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Proposed Discount Percentage</span>
            <span className="font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 text-sm">
              {discountPercent.toFixed(1)}% ({currencySymbol}{(listUnitPrice - proposedNetPrice).toLocaleString()} saved)
            </span>
          </div>

          <div className="relative pt-2 pb-1">
            <input
              type="range"
              min="10"
              max="25"
              step="0.5"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2">
              <span>10% (Rep Offer)</span>
              <span className="text-purple-700 font-bold">18% (Selected)</span>
              <span>25% (Ceiling)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Proposed Net Price</div>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                {currencySymbol}{proposedNetPrice.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">/ yr</span>
              </div>
            </div>
            <div className="bg-purple-50/60 p-2.5 rounded-xl border border-purple-100">
              <div className="text-[10px] font-bold text-purple-600 uppercase">Annual Customer Savings</div>
              <div className="text-sm font-extrabold text-purple-700 mt-0.5">
                {currencySymbol}{annualSavings.toLocaleString()} <span className="text-[10px] text-purple-600 font-bold">total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instant Concession Trade-Offs Widget */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 flex items-center space-x-1.5">
              <span>Instant Concession Trade-Offs</span>
            </span>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Skip Approval Wait</span>
          </div>

          <div className="space-y-2">
            {tradeOffs.map((tf) => (
              <label
                key={tf.id}
                onClick={() => setSelectedTradeOffId(tf.id)}
                className={`flex items-start space-x-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedTradeOffId === tf.id
                    ? 'bg-purple-50/90 border-purple-400 ring-2 ring-purple-500/20 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-purple-200'
                }`}
              >
                <input
                  type="radio"
                  name="tradeoff"
                  checked={selectedTradeOffId === tf.id}
                  onChange={() => setSelectedTradeOffId(tf.id)}
                  className="mt-1 accent-purple-600"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-900">{tf.title}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                        tf.badgeType === 'success'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}
                    >
                      {tf.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">{tf.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Procurement Justification Input */}
        <div>
          <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Procurement Justification to Sales VP</span>
            <span className="text-[10px] text-slate-400 font-normal">Optional</span>
          </label>
          <textarea
            rows={3}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Detail budget alignment or expansion commitments to expedite approval..."
            className="w-full text-xs bg-white border border-slate-200 rounded-2xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        {/* Action Buttons */}
        <form onSubmit={handleSubmit} className="space-y-2 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 active:bg-purple-900 rounded-2xl shadow-lg shadow-purple-200 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Submit Counter Request ({currencySymbol}{proposedNetPrice.toLocaleString()}/yr)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="py-2 px-3 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-center transition-colors"
            >
              Withdraw Request
            </button>
            <button
              type="button"
              onClick={onAcceptLine}
              className="py-2 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-center transition-colors"
            >
              Accept Line ({currencySymbol}{activeLine.lineTotal.toLocaleString()})
            </button>
          </div>
        </form>

        <div className="text-center text-[10px] text-slate-400 font-medium pt-1 flex items-center justify-center space-x-1">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Encrypted 256-bit Procurement Channel • SLA &lt; 2h</span>
        </div>

        {/* Dedicated Sales Contact Card at Bottom */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between mt-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-xs border border-purple-200">
              {assignedRep.avatarInitials}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{assignedRep.name}</div>
              <div className="text-[10px] text-slate-500">{assignedRep.email}</div>
              <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{assignedRep.statusText}</span>
              </div>
            </div>
          </div>
          <button className="flex items-center space-x-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
