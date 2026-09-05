import React from 'react';
import { CommercialSummary, RiskEvaluation } from '../types/quotation.types';
import { RiskBadge } from './RiskBadge';
import { CheckCircle2, AlertTriangle, Info, ArrowUpRight, TrendingUp } from 'lucide-react';

interface Props {
  summary: CommercialSummary;
  risk: RiskEvaluation;
  currency?: string;
  isSubmitting?: boolean;
}

export const CommercialSummaryCard: React.FC<Props> = ({
  summary,
  risk,
  currency = 'USD',
}) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  // Determine margin color
  const getMarginColor = (pct: number) => {
    if (pct >= 30) return 'text-emerald-600 bg-emerald-500';
    if (pct >= 20) return 'text-amber-600 bg-amber-500';
    return 'text-rose-600 bg-rose-500';
  };

  const marginColor = getMarginColor(summary.grossMarginPercent);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          Commercial Summary
        </h3>
        <RiskBadge level={risk.level} score={risk.score} />
      </div>

      <div className="p-5 space-y-4">
        {/* Grand Total Highlight */}
        <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-100/60">
          <div className="text-xs font-medium text-purple-700 uppercase tracking-wide">
            Grand Total
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {formatMoney(summary.grandTotal)}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-purple-100/60">
            <span>Net Revenue: {formatMoney(summary.subtotal - summary.totalDiscount)}</span>
            <span>Tax: {formatMoney(summary.totalTax)}</span>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>List Subtotal</span>
            <span className="font-medium text-gray-900">{formatMoney(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Total Discount</span>
            <span className="font-medium text-rose-600">
              {summary.totalDiscount > 0 ? `-${formatMoney(summary.totalDiscount)}` : '$0.00'}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Total Estimated Cost</span>
            <span className="font-medium text-gray-700">{formatMoney(summary.costTotal)}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3">
          {/* Gross Margin Gauge */}
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="font-medium text-gray-700">Gross Margin</span>
            <span className="font-bold text-gray-900">
              {formatMoney(summary.grossMargin)}{' '}
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${marginColor.split(' ')[0]} bg-gray-100`}>
                {summary.grossMarginPercent.toFixed(1)}%
              </span>
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${marginColor.split(' ')[1]}`}
              style={{ width: `${Math.min(100, Math.max(0, summary.grossMarginPercent))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>0%</span>
            <span>Target: 30%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Governance & Approval Status Indicator */}
        <div className="border-t border-gray-100 pt-3">
          <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Governance Decision
          </div>
          {risk.requiresApproval ? (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Management Approval Required</div>
                <div className="text-amber-800 text-[11px] mt-0.5">
                  Commercial terms exceed standard sales delegation authority.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Within Standard Authority</div>
                <div className="text-emerald-800 text-[11px] mt-0.5">
                  Quote is compliant with all category and tier discount ceilings.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Explainable Risk Factors */}
        {risk.factors && risk.factors.length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-gray-400" />
              Evaluation Factors
            </div>
            <ul className="space-y-1.5">
              {risk.factors.map((factor, idx) => (
                <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="text-purple-500 font-bold mt-0.5">•</span>
                  <span className="leading-snug">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
