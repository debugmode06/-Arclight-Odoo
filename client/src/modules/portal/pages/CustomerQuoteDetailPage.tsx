import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building,
  Calendar,
  AlertCircle,
  Loader2,
  Receipt,
  Server,
  RefreshCw,
  TrendingDown,
  LayoutGrid,
  Lock,
  CheckCircle2,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { useCustomerQuoteDetail, usePortalActions } from '../hooks/useCustomerPortal';
import { CustomerQuoteLineItem } from '../types/portal.types';
import { LineItemCard } from '../components/LineItemCard';
import { SmartNegotiationAssistant } from '../components/SmartNegotiationAssistant';
import { CustomerPortalBottomNav } from '../components/CustomerPortalBottomNav';
import { QuoteConfirmDialog } from '../components/QuoteConfirmDialog';

export const CustomerQuoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const quoteId = id || 'qt_1001';

  const { data: quote, isLoading, isError, error } = useCustomerQuoteDetail(quoteId);
  const portalActions = usePortalActions(quoteId);

  const [focusedLineId, setFocusedLineId] = useState<string>('line_02');
  const [bomFilter, setBomFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED'>('ALL');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-2" />
        <span className="text-sm font-medium">Loading RevOps deal workspace...</span>
      </div>
    );
  }

  if (isError || !quote) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm max-w-lg mx-auto mt-10">
        <AlertCircle className="w-6 h-6 mb-2 text-red-600" />
        <h3 className="font-bold text-base">Workspace Access Restricted</h3>
        <p className="text-xs mt-1 text-red-600">
          {(error as Error)?.message || 'Quotation workspace not found.'}
        </p>
        <Link
          to="/customer/quotes"
          className="inline-block mt-4 text-xs font-bold bg-purple-700 text-white px-4 py-2 rounded-xl"
        >
          Back to Quotations List
        </Link>
      </div>
    );
  }

  const activeLine = quote.lines.find((l) => l.lineId === focusedLineId) || quote.lines[1] || quote.lines[0];
  const currencySymbol = quote.currencySymbol || '₹';

  const filteredLines = quote.lines.filter((line) => {
    if (bomFilter === 'PENDING') return line.hasCounterOffer;
    if (bomFilter === 'ACCEPTED') return line.statusTag === 'Accepted Line Price';
    return true;
  });

  const handleFocusLine = (line: CustomerQuoteLineItem) => {
    setFocusedLineId(line.lineId);
  };

  const handleAcceptLine = async (lineId: string) => {
    const line = quote.lines.find((l) => l.lineId === lineId);
    if (line) {
      line.statusTag = 'Accepted Line Price';
      line.statusTagColor = 'green';
      line.hasCounterOffer = false;
    }
  };

  const handleSubmitCounter = async (payload: { proposedDiscount: number; selectedTradeOffId?: string; justification?: string }) => {
    await portalActions.submitCounterOffer({
      proposedDiscount: payload.proposedDiscount,
      reason: payload.justification || 'Submitted via Smart Negotiation Assistant Workspace',
    });
  };

  const handleConfirmQuote = async () => {
    await portalActions.confirmQuote({ termsAccepted: true });
    setIsConfirmDialogOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 font-sans text-slate-900">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {quote.title}
              </h1>
              <span className="px-3 py-1 text-xs font-bold bg-purple-100 text-purple-800 rounded-full border border-purple-200 shrink-0">
                {quote.roundTag}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {quote.subtitle}
            </p>
          </div>

          {/* Top Right Summary KPI Boxes */}
          <div className="flex items-center space-x-4 self-start lg:self-auto shrink-0">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-center min-w-[130px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Base Quoted Total</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {currencySymbol}{quote.baseQuotedTotal.toLocaleString()}
              </div>
            </div>

            <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 text-center min-w-[150px]">
              <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Total with 18% GST</div>
              <div className="text-lg font-black text-purple-900 mt-0.5">
                {currencySymbol}{quote.totalWithTax.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row (4 Cards Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Net Contract Value */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Net Contract Value</span>
            <Receipt className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">
            {currencySymbol}{quote.netContractValue.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100">
            <span className="text-slate-500">18% Statutory GST:</span>
            <span className="font-extrabold text-slate-900">+{currencySymbol}{quote.taxAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 2: One-Time CapEx Items */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">One-Time CapEx Items</span>
            <Server className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">
            {currencySymbol}{quote.oneTimeCapEx.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100">
            <span className="text-slate-500 truncate">Laptops (10) + Impl:</span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full">
              83.8% of Total
            </span>
          </div>
        </div>

        {/* Card 3: Recurring OpEx SaaS */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Recurring OpEx SaaS (Annual)</span>
            <RefreshCw className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">
            {currencySymbol}{quote.recurringOpExAnnual.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ yr</span>
          </div>
          <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100">
            <span className="text-slate-500 truncate">Cloud RevOps & DealTwin™:</span>
            <span className="font-bold text-slate-800">10 Seats Active</span>
          </div>
        </div>

        {/* Card 4: Active Counter Delta */}
        <div className="bg-white rounded-2xl border border-rose-200/80 bg-gradient-to-b from-rose-50/20 to-white p-4 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Active Counter Delta</span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-100 text-rose-800 rounded-full border border-rose-200">
              {quote.pendingCountersCount} Items Pending
            </span>
          </div>
          <div className="text-xl font-black text-rose-600 mt-2">
            -{currencySymbol}{quote.activeCounterDelta.toLocaleString()} <span className="text-xs font-semibold text-slate-500">requested</span>
          </div>
          <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-rose-100">
            <span className="text-slate-500">Target Counter Total:</span>
            <span className="font-extrabold text-slate-900">{currencySymbol}{quote.targetCounterTotal.toLocaleString()} (Base)</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout (Two-Column Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 of 12 cols = 66%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quotation Bill of Materials Header Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-slate-900">Quotation Bill of Materials</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-100 text-slate-700 rounded-full">
                {quote.lineCount} Items
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setBomFilter('ALL')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    bomFilter === 'ALL' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Items ({quote.lines.length})
                </button>
                <button
                  onClick={() => setBomFilter('PENDING')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    bomFilter === 'PENDING' ? 'bg-white text-purple-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pending Counters ({quote.lines.filter((l) => l.hasCounterOffer).length})
                </button>
                <button
                  onClick={() => setBomFilter('ACCEPTED')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    bomFilter === 'ACCEPTED' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Accepted ({quote.lines.filter((l) => l.statusTag === 'Accepted Line Price').length})
                </button>
              </div>

              <div className="p-2 bg-slate-100 rounded-xl text-slate-500 cursor-pointer hover:bg-slate-200">
                <LayoutGrid className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Line Item Cards List */}
          <div className="space-y-4">
            {filteredLines.map((line) => (
              <LineItemCard
                key={line.lineId}
                line={line}
                currencySymbol={currencySymbol}
                onFocusLine={handleFocusLine}
                onAcceptLine={handleAcceptLine}
                isFocused={line.lineId === activeLine.lineId}
              />
            ))}
          </div>

          {/* Negotiation Activity & Official Audit Log Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>Negotiation Timeline</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Quotation Activity Log
              </span>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {quote.auditLogs.map((log) => (
                <div key={log.id} className="relative flex items-start space-x-3 text-xs">
                  <div
                    className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      log.isActiveSession ? 'border-purple-600 animate-ping' : 'border-slate-400'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        log.isActiveSession ? 'bg-purple-600' : 'bg-slate-400'
                      }`}
                    />
                  </div>

                  <div className="flex-1 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{log.event}</span>
                      <span className="text-[10px] font-semibold text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{log.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 of 12 cols = 34%) — Smart Negotiation Assistant */}
        <div className="lg:col-span-4 sticky top-20">
          <SmartNegotiationAssistant
            activeLine={activeLine}
            tradeOffs={quote.concessionTradeOffs}
            currencySymbol={currencySymbol}
            assignedRep={quote.assignedRep}
            onSubmitCounter={handleSubmitCounter}
            onAcceptLine={() => handleAcceptLine(activeLine.lineId)}
            isSubmitting={portalActions.isSubmittingCounterOffer}
          />
        </div>
      </div>

      {/* Floating Bottom Navigation Pill Bar */}
      <CustomerPortalBottomNav />

      {/* Confirm Quotation Dialog */}
      <QuoteConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmQuote}
        quotationNumber={quote.quotationNumber}
        totalAmount={quote.totalWithTax}
        currency={quote.currencySymbol}
        isSubmitting={portalActions.isConfirmingQuote}
      />
    </div>
  );
};
