import React, { useState, useEffect } from 'react';
import { BillingService } from '../services/billing.service';
import { QuotationService } from '@/modules/quotations/services/quotation.service';
import {
  Receipt,
  Repeat,
  Calendar,
  CreditCard,
  DollarSign,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  X,
  Clock,
} from 'lucide-react';

export const BillingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'subscriptions' | 'schedules'>('invoices');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('WIRE');
  const [paymentTxn, setPaymentTxn] = useState<string>('');

  // Proration / Modify Modal State
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [prorationResult, setProrationResult] = useState<any | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [invList, subList, schList] = await Promise.all([
        BillingService.getInvoices(),
        BillingService.getSubscriptions(),
        BillingService.getSchedules(),
      ]);
      setInvoices(invList);
      setSubscriptions(subList);
      setSchedules(schList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openPaymentModal = (inv: any) => {
    setSelectedInvoice(inv);
    setPaymentAmount(inv.grandTotal - (inv.amountPaid || 0));
    setPaymentTxn(`TXN-REV-${Date.now().toString().slice(-6)}`);
    setShowPaymentModal(true);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    try {
      await BillingService.recordPayment(selectedInvoice._id, {
        amount: Number(paymentAmount),
        paymentMethod,
        transactionReference: paymentTxn,
      });
      alert(`Payment of $${paymentAmount} recorded successfully!`);
      setShowPaymentModal(false);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error?.message || err?.message || 'Payment recording failed');
    }
  };

  const openModifyModal = (sub: any) => {
    setSelectedSub(sub);
    setNewQuantity(sub.quantity + 1);
    setProrationResult(null);
    setShowModifyModal(true);
  };

  const handleExecuteProration = async () => {
    if (!selectedSub) return;
    try {
      const res = await BillingService.modifySubscription(selectedSub._id, {
        newQuantity: Number(newQuantity),
      });
      setProrationResult(res);
      alert(`Subscription adjusted! Prorated adjustment: $${res.proratedDelta} across remaining ${res.remainingDays} days.`);
      setShowModifyModal(false);
      loadData();
    } catch (err: any) {
      alert('Failed to modify subscription');
    }
  };

  const handleCancelSubscription = async (subId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription? A prorated credit note will be issued.')) return;
    try {
      const res = await BillingService.cancelSubscription(subId, 'Customer mid-cycle cancellation');
      alert(`Subscription cancelled. Credit note issued for $${res.refundCredit} (${res.remainingDays} days unconsumed).`);
      loadData();
    } catch (err) {
      alert('Failed to cancel subscription');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hybrid Billing & Recurring Subscriptions</h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-[#6344e7] uppercase tracking-wider">
              RevOps Billing Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Unified billing schedule orchestration, one-time invoice tracking, mid-cycle proration, and payment reconciliation.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'invoices' ? 'bg-purple-50 text-[#6344e7]' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Invoices & Payments ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'subscriptions' ? 'bg-purple-50 text-[#6344e7]' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Active Subscriptions ({subscriptions.filter((s) => s.status === 'ACTIVE').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'schedules' ? 'bg-purple-50 text-[#6344e7]' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Recurring Billing Schedules ({schedules.length})</span>
        </button>
      </div>

      {/* Tab 1: Invoices & Payments */}
      {activeTab === 'invoices' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Commercial Invoices & Accounts Receivable</h3>
              <p className="text-xs text-slate-500">Live order invoices generated from finalized quotation terms.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                  <th className="py-2.5 px-3 font-semibold">Invoice #</th>
                  <th className="py-2.5 px-3 font-semibold">Customer</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Grand Total</th>
                  <th className="py-2.5 px-3 font-semibold">Amount Paid</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-mono font-bold text-[#6344e7]">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{inv.customerId?.name || 'Customer'}</td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {inv.invoiceType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">${inv.grandTotal?.toLocaleString()}</td>
                    <td className="py-3 px-3 text-emerald-600 font-semibold">${inv.amountPaid?.toLocaleString() || 0}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : inv.status === 'PARTIALLY_PAID'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-purple-50 text-[#6344e7] border border-purple-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {inv.status !== 'PAID' && (
                        <button
                          type="button"
                          onClick={() => openPaymentModal(inv)}
                          className="px-3 py-1 bg-[#6344e7] hover:bg-[#5233d4] text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer shadow-2xs"
                        >
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Subscriptions & Proration */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Contract Subscriptions</h3>
              <p className="text-xs text-slate-500">
                Managed recurring commitments with automated proration math on mid-cycle changes.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                  <th className="py-2.5 px-3 font-semibold">Customer</th>
                  <th className="py-2.5 px-3 font-semibold">Plan Name</th>
                  <th className="py-2.5 px-3 font-semibold">Cycle</th>
                  <th className="py-2.5 px-3 font-semibold">Qty</th>
                  <th className="py-2.5 px-3 font-semibold">Cycle Amount</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-semibold text-slate-800">{sub.customerId?.name || 'Customer'}</td>
                    <td className="py-3 px-3 font-bold text-purple-900">{sub.planName}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-[#6344e7]">
                        {sub.billingCycle}
                      </span>
                    </td>
                    <td className="py-3 px-3">{sub.quantity}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">${sub.cycleAmount?.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sub.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : sub.status === 'MODIFIED'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      {sub.status !== 'CANCELLED' && (
                        <>
                          <button
                            type="button"
                            onClick={() => openModifyModal(sub)}
                            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-[#6344e7] rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Modify / Prorate
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelSubscription(sub._id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Schedules */}
      {activeTab === 'schedules' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Recurring Installments Calendar</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                  <th className="py-2.5 px-3 font-semibold">Period Name</th>
                  <th className="py-2.5 px-3 font-semibold">Billing Date</th>
                  <th className="py-2.5 px-3 font-semibold">Installment Amount</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedules.map((sch) => (
                  <tr key={sch._id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-slate-800">{sch.periodName}</td>
                    <td className="py-3 px-3 text-slate-600">
                      {new Date(sch.billingDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">${sch.amount?.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sch.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700'
                            : sch.status === 'SCHEDULED'
                            ? 'bg-purple-50 text-[#6344e7]'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {sch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Record Invoice Payment</h3>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500">Invoice:</span>
                <span className="font-bold text-slate-800 ml-1.5">{selectedInvoice.invoiceNumber}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Amount ($)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  <option value="WIRE">Bank Wire Transfer</option>
                  <option value="ACH_TRANSFER">ACH Direct Debit</option>
                  <option value="CREDIT_CARD">Corporate Credit Card</option>
                  <option value="CHECK">Check</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reference / Transaction ID</label>
                <input
                  type="text"
                  required
                  value={paymentTxn}
                  onChange={(e) => setPaymentTxn(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#6344e7] hover:bg-[#5233d4] text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modify / Proration Modal */}
      {showModifyModal && selectedSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Modify Subscription & Prorate</h3>
              <button
                type="button"
                onClick={() => setShowModifyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <div className="font-bold text-slate-800">{selectedSub.planName}</div>
                <div className="text-[11px] text-slate-500">Current Qty: {selectedSub.quantity} • Cycle: ${selectedSub.cycleAmount?.toLocaleString()}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Quantity / User Licenses</label>
                <input
                  type="number"
                  min="1"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Deterministic daily pro-rata algorithm: Calculates the incremental adjustment across the remaining days of the current monthly billing period and adjusts future scheduled installments.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModifyModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteProration}
                  className="px-4 py-1.5 bg-[#6344e7] hover:bg-[#5233d4] text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Commit Proration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
