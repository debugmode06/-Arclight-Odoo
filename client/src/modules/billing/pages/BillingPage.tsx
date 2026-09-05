import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { billingService, BillingCalculationResult, InvoiceRecord } from '../services/billingService';

const StatCard: React.FC<{
  label: string;
  value: string;
  badge?: string;
  badgeColor?: string;
  sub?: string;
  icon?: React.ReactNode;
}> = ({ label, value, badge, badgeColor = 'purple', sub, icon }) => (
  <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-sm flex flex-col gap-1.5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      {icon && <span className="text-slate-300">{icon}</span>}
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-2xl font-black leading-none text-slate-900">{value}</span>
      {badge && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
          badgeColor === 'purple' ? 'bg-purple-100 text-purple-700' :
          badgeColor === 'teal' ? 'bg-teal-50 text-teal-700' :
          badgeColor === 'amber' ? 'bg-amber-50 text-amber-700' :
          'bg-slate-100 text-slate-600'
        }`}>{badge}</span>
      )}
    </div>
    {sub && <div className="text-[11px] text-slate-400 font-medium leading-snug">{sub}</div>}
  </div>
);

export const BillingPage: React.FC = () => {
  // Metric controls
  const [plan, setPlan] = useState<'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'>('PROFESSIONAL');
  const [orders, setOrders] = useState(2450);
  const [pallets, setPallets] = useState(45);
  const [apiCalls, setApiCalls] = useState(120000);
  const [freightSurcharge, setFreightSurcharge] = useState(180);
  const [includeSetupFee, setIncludeSetupFee] = useState(true);
  const [discount, setDiscount] = useState(150);

  // Calculation state
  const [calc, setCalc] = useState<BillingCalculationResult | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Local fallback calculation if backend request is loading/offline
  const calculateLocal = (): BillingCalculationResult => {
    const baseSub = plan === 'STARTER' ? 199 : plan === 'ENTERPRISE' ? 999 : 499;
    const setup = includeSetupFee ? 1200 : 0;

    let t1 = 0, t2 = 0, t3 = 0;
    if (orders <= 1000) {
      t1 = orders;
    } else if (orders <= 5000) {
      t1 = 1000;
      t2 = orders - 1000;
    } else {
      t1 = 1000;
      t2 = 4000;
      t3 = orders - 5000;
    }
    const orderCost = t1 * 0.50 + t2 * 0.35 + t3 * 0.20;
    const storageCost = pallets * 25;
    const apiCost = apiCalls * 0.001;
    const usageCost = orderCost + storageCost + apiCost + freightSurcharge;
    const subtotal = baseSub + setup + usageCost;
    const taxable = Math.max(0, subtotal - discount);
    const tax = taxable * 0.18;
    const total = taxable + tax;

    return {
      subscriptionPlan: plan,
      baseSubscriptionFee: baseSub,
      setupFee: setup,
      orderPricing: {
        tier1Orders: t1,
        tier1Cost: t1 * 0.50,
        tier2Orders: t2,
        tier2Cost: t2 * 0.35,
        tier3Orders: t3,
        tier3Cost: t3 * 0.20,
        totalOrderCost: orderCost,
      },
      storageCost,
      apiCallCost: apiCost,
      freightSurcharge,
      totalUsageCost: usageCost,
      subtotal,
      discountAmount: discount,
      taxRate: 0.18,
      taxAmount: tax,
      totalPayable: total,
      lineItems: [
        { description: `Monthly Subscription (${plan} Tier)`, category: 'SUBSCRIPTION', quantity: 1, unitPrice: baseSub, amount: baseSub },
        ...(setup > 0 ? [{ description: 'One-Time Integration & Setup Fee', category: 'SETUP', quantity: 1, unitPrice: setup, amount: setup }] : []),
        { description: `Fulfillment Orders (${orders.toLocaleString()} units - Tiered)`, category: 'USAGE', quantity: orders, unitPrice: Number((orderCost / Math.max(1, orders)).toFixed(4)), amount: orderCost },
        { description: `Warehouse Pallet Storage (${pallets} pallets @ $25/mo)`, category: 'USAGE', quantity: pallets, unitPrice: 25, amount: storageCost },
        { description: `API Infrastructure Calls (${apiCalls.toLocaleString()} calls)`, category: 'USAGE', quantity: apiCalls, unitPrice: 0.001, amount: apiCost },
        ...(freightSurcharge > 0 ? [{ description: 'Blended Multi-Warehouse Freight Surcharge', category: 'FREIGHT', quantity: 1, unitPrice: freightSurcharge, amount: freightSurcharge }] : []),
        ...(discount > 0 ? [{ description: 'Enterprise Volume Discount', category: 'DISCOUNT', quantity: 1, unitPrice: -discount, amount: -discount }] : []),
      ],
    };
  };

  useEffect(() => {
    billingService.calculateBill({
      subscriptionPlan: plan,
      ordersProcessed: orders,
      warehouseStoragePallets: pallets,
      apiCalls,
      freightSurcharge,
      includeSetupFee,
      discountAmount: discount,
    }).then(res => setCalc(res)).catch(() => setCalc(calculateLocal()));
  }, [plan, orders, pallets, apiCalls, freightSurcharge, includeSetupFee, discount]);

  useEffect(() => {
    billingService.getInvoices().then(res => setInvoices(res)).catch(() => {
      setInvoices([
        {
          _id: '1',
          invoiceNumber: 'INV-2026-0001',
          customerName: 'Acme Industries Ltd.',
          billingPeriod: 'Sep 2026',
          subscriptionPlan: 'PROFESSIONAL',
          subtotal: 3505,
          taxAmount: 603.9,
          discountAmount: 150,
          totalPayable: 3958.9,
          status: 'PENDING',
          dueDate: '2026-09-20',
          createdAt: new Date().toISOString(),
          lineItems: calculateLocal().lineItems,
        },
      ]);
    });
  }, []);

  const currentCalc = calc || calculateLocal();

  const handleGenerateInvoice = async () => {
    try {
      const inv = await billingService.createInvoice({
        subscriptionPlan: plan,
        ordersProcessed: orders,
        warehouseStoragePallets: pallets,
        apiCalls,
        freightSurcharge,
        includeSetupFee,
        discountAmount: discount,
        customerName: 'Acme Industries Ltd.',
      });
      setInvoices([inv, ...invoices]);
      setSelectedInvoice(inv);
      setIsInvoiceModalOpen(true);
      showToast('📄 Invoice INV-2026 generated and saved to database!');
    } catch {
      const mockInv: InvoiceRecord = {
        _id: String(Date.now()),
        invoiceNumber: `INV-2026-${String(invoices.length + 1).padStart(4, '0')}`,
        customerName: 'Acme Industries Ltd.',
        billingPeriod: 'Sep 2026',
        subscriptionPlan: plan,
        subtotal: currentCalc.subtotal,
        taxAmount: currentCalc.taxAmount,
        discountAmount: currentCalc.discountAmount,
        totalPayable: currentCalc.totalPayable,
        status: 'PENDING',
        dueDate: '2026-09-20',
        createdAt: new Date().toISOString(),
        lineItems: currentCalc.lineItems,
      };
      setInvoices([mockInv, ...invoices]);
      setSelectedInvoice(mockInv);
      setIsInvoiceModalOpen(true);
      showToast('📄 Invoice generated successfully!');
    }
  };

  return (
    <div className="relative min-h-screen pb-28 text-slate-900" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-purple-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center gap-2 animate-bounce">
          <span>{toast}</span>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {isInvoiceModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 text-sm">
                    {selectedInvoice.invoiceNumber}
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                    {selectedInvoice.status}
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-base mt-1">Official Tax Invoice — DealFlow360</h3>
                <p className="text-xs text-slate-400">Billed to: {selectedInvoice.customerName} ({selectedInvoice.billingPeriod})</p>
              </div>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-lg">✕</button>
            </div>

            {/* Invoice Table */}
            <div className="space-y-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="pb-2">DESCRIPTION</th>
                    <th className="pb-2 text-center">QTY</th>
                    <th className="pb-2 text-right">UNIT PRICE</th>
                    <th className="pb-2 text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {selectedInvoice.lineItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold text-slate-900">{item.description}</td>
                      <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                      <td className="py-2.5 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-slate-900">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Summary */}
              <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-4 space-y-2 text-xs font-bold">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono">${selectedInvoice.subtotal.toFixed(2)}</span>
                </div>
                {selectedInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Volume Discount</span>
                    <span className="font-mono">-${selectedInvoice.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>GST / Tax (18%)</span>
                  <span className="font-mono">${selectedInvoice.taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-purple-200 pt-2 flex justify-between text-slate-900 text-sm font-black">
                  <span>Total Payable Amount</span>
                  <span className="font-mono text-purple-900">${selectedInvoice.totalPayable.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100">
              <button onClick={() => setIsInvoiceModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Close</button>
              <button onClick={() => { window.print(); }} className="px-5 py-2 text-xs font-black bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md shadow-purple-500/25 flex items-center gap-1.5">
                🖨️ Download / Print Invoice (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOP HEADER BAR ─────────────────────────────────── */}
      <div className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-30 px-5 py-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold text-xs">DealFlow360</span>
            <span className="text-slate-400 text-xs">›</span>
            <span className="text-purple-700 font-black text-sm bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-100">Hybrid Billing Engine</span>
            <span className="text-slate-600 font-bold text-xs">Acme Industries Ltd.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-800 text-[10px] font-black rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span> Tiered Metered Billing
            </span>
            <button onClick={handleGenerateInvoice} className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl shadow-md shadow-purple-500/30 transition-all">
              <span>📄</span> Generate &amp; Save Invoice
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <div className="p-5 space-y-4">
        {/* ── 4 STAT CARDS ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard
            label="Total Estimated Bill"
            value={`$${currentCalc.totalPayable.toFixed(2)}`}
            badge="Includes 18% Tax"
            badgeColor="purple"
            sub="Base + Setup + Tiered Usage - Discount"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
          />
          <StatCard
            label="Subscription Base"
            value={`$${currentCalc.baseSubscriptionFee}/mo`}
            badge={plan}
            badgeColor="teal"
            sub="Monthly recurring enterprise tier"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
          />
          <StatCard
            label="Metered Usage Total"
            value={`$${currentCalc.totalUsageCost.toFixed(2)}`}
            badge="Real-time Metered"
            badgeColor="purple"
            sub={`${orders.toLocaleString()} orders + ${pallets} pallets + API`}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          />
          <StatCard
            label="Volume Discount"
            value={`-$${currentCalc.discountAmount.toFixed(2)}`}
            badge="Active Promo"
            badgeColor="teal"
            sub="Tier-1 Enterprise Loyalty credit"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
          />
        </div>

        {/* ── 2-COL MAIN GRID ───────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* LEFT 2 COLS: Subscription Plans + Metered Sliders */}
          <div className="xl:col-span-2 space-y-4">
            {/* 1. Subscription Plan Selector */}
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
              <h3 className="font-black text-slate-900 text-sm mb-1">1. Choose Monthly Subscription Plan</h3>
              <p className="text-xs text-slate-400 mb-4">Base platform tier covering core fulfillment, DealTwin simulator, and multi-depot routing</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'STARTER', name: 'Starter Tier', price: 199, sub: 'Small logistics operations', feat: 'Up to 5 depots · 500 included orders' },
                  { id: 'PROFESSIONAL', name: 'Professional Tier', price: 499, sub: 'Growing enterprise teams', feat: 'Unlimited depots · DealTwin AI · Priority Allocation', popular: true },
                  { id: 'ENTERPRISE', name: 'Enterprise Tier', price: 999, sub: 'Global multi-region hub', feat: 'Custom Hub Consolidation · Dedicated SLA' },
                ].map(p => (
                  <div
                    key={p.id}
                    onClick={() => setPlan(p.id as any)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all relative flex flex-col justify-between ${
                      plan === p.id
                        ? 'border-purple-600 bg-purple-50/50 shadow-md ring-2 ring-purple-500/20'
                        : 'border-slate-200 bg-white hover:border-purple-200'
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-2.5 right-4 bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                        RECOMMENDED
                      </span>
                    )}
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium mb-3">{p.sub}</div>
                      <div className="text-2xl font-black text-purple-900">${p.price}<span className="text-xs font-bold text-slate-500">/mo</span></div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-purple-100 text-[10px] font-medium text-slate-600">
                      ✓ {p.feat}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Interactive Usage Sliders & Metered Controls */}
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">2. Interactive Usage Metering &amp; Tiered Pricing</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Adjust monthly volume counters to simulate real-time hybrid billing</p>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-900 rounded-lg">
                  Tiered Volume Discounts Active
                </span>
              </div>

              {/* Slider 1: Orders Processed */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>📦 Orders Processed:</span>
                    <span className="font-mono font-black text-purple-900 text-sm bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      {orders.toLocaleString()} Units
                    </span>
                  </label>
                  <span className="text-[10px] font-bold text-purple-700">Tiered Rate Calculator</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={10000}
                  step={50}
                  value={orders}
                  onChange={e => setOrders(parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-100 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #7c3aed ${(orders / 10000) * 100}%, #e9d5ff ${(orders / 10000) * 100}%)`
                  }}
                />

                {/* Tier Breakdown Display */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="p-2 bg-purple-50/70 border border-purple-100 rounded-xl">
                    <div className="text-[9px] font-bold uppercase text-slate-400">Tier 1 (0-1k orders)</div>
                    <div className="text-xs font-black text-slate-900">{currentCalc.orderPricing.tier1Orders} orders @ $0.50</div>
                    <div className="text-[10px] font-bold text-purple-700">${currentCalc.orderPricing.tier1Cost.toFixed(2)}</div>
                  </div>
                  <div className="p-2 bg-purple-50/70 border border-purple-100 rounded-xl">
                    <div className="text-[9px] font-bold uppercase text-slate-400">Tier 2 (1k-5k orders)</div>
                    <div className="text-xs font-black text-slate-900">{currentCalc.orderPricing.tier2Orders} orders @ $0.35</div>
                    <div className="text-[10px] font-bold text-purple-700">${currentCalc.orderPricing.tier2Cost.toFixed(2)}</div>
                  </div>
                  <div className="p-2 bg-purple-50/70 border border-purple-100 rounded-xl">
                    <div className="text-[9px] font-bold uppercase text-slate-400">Tier 3 (5k+ orders)</div>
                    <div className="text-xs font-black text-slate-900">{currentCalc.orderPricing.tier3Orders} orders @ $0.20</div>
                    <div className="text-[10px] font-bold text-purple-700">${currentCalc.orderPricing.tier3Cost.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Slider 2: Warehouse Storage Pallets */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🏢 Warehouse Storage ($25/pallet/mo):</span>
                    <span className="font-mono font-black text-purple-900 text-sm bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      {pallets} Pallets
                    </span>
                  </label>
                  <span className="text-[10px] font-bold text-slate-500">${currentCalc.storageCost.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  step={5}
                  value={pallets}
                  onChange={e => setPallets(parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-100 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #7c3aed ${(pallets / 200) * 100}%, #e9d5ff ${(pallets / 200) * 100}%)`
                  }}
                />
              </div>

              {/* Slider 3: API Calls */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>⚡ API Calls ($0.001/call):</span>
                    <span className="font-mono font-black text-purple-900 text-sm bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      {apiCalls.toLocaleString()} Calls
                    </span>
                  </label>
                  <span className="text-[10px] font-bold text-slate-500">${currentCalc.apiCallCost.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={500000}
                  step={10000}
                  value={apiCalls}
                  onChange={e => setApiCalls(parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-100 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #7c3aed ${(apiCalls / 500000) * 100}%, #e9d5ff ${(apiCalls / 500000) * 100}%)`
                  }}
                />
              </div>

              {/* Options & Surcharges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Freight Surcharge ($)</label>
                  <input
                    type="number"
                    value={freightSurcharge}
                    onChange={e => setFreightSurcharge(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Volume Discount ($)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={includeSetupFee}
                      onChange={e => setIncludeSetupFee(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span>Include Setup Fee ($1,200)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Invoices History */}
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
              <h3 className="font-black text-slate-900 text-sm mb-3">Billing &amp; Invoice History</h3>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="pb-2">INVOICE #</th>
                    <th className="pb-2">CUSTOMER</th>
                    <th className="pb-2">PERIOD</th>
                    <th className="pb-2 text-right">TOTAL PAYABLE</th>
                    <th className="pb-2 text-center">STATUS</th>
                    <th className="pb-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invoices.map((inv) => (
                    <tr key={inv._id} className="hover:bg-purple-50/30">
                      <td className="py-3 font-mono font-bold text-purple-900">{inv.invoiceNumber}</td>
                      <td className="py-3 font-bold text-slate-900">{inv.customerName}</td>
                      <td className="py-3 text-slate-500">{inv.billingPeriod}</td>
                      <td className="py-3 text-right font-mono font-black text-slate-900">${inv.totalPayable.toFixed(2)}</td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[9px] rounded-md">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => { setSelectedInvoice(inv); setIsInvoiceModalOpen(true); }}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg text-[10px]"
                        >
                          View PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT 1 COL: Real-Time Total Bill Preview Card */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 sticky top-[60px] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="font-black text-slate-900 text-xs">Real-Time Hybrid Bill Breakdown</h3>
                  <p className="text-[9px] text-slate-400">Live summary calculation</p>
                </div>
                <span className="text-[9px] font-black px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md">LIVE</span>
              </div>

              {/* Itemized Lines */}
              <div className="space-y-2 text-xs">
                {currentCalc.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-50">
                    <div>
                      <div className="font-bold text-slate-800 text-[11px]">{item.description}</div>
                      <div className="text-[9px] text-slate-400 font-mono">Qty: {item.quantity}</div>
                    </div>
                    <span className={`font-mono font-bold ${item.amount < 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                      {item.amount < 0 ? `-$${Math.abs(item.amount).toFixed(2)}` : `$${item.amount.toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtotals & Taxes */}
              <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 font-bold">
                  <span>Subtotal</span>
                  <span className="font-mono">${currentCalc.subtotal.toFixed(2)}</span>
                </div>
                {currentCalc.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount</span>
                    <span className="font-mono">-${currentCalc.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 font-bold">
                  <span>Tax (18% GST)</span>
                  <span className="font-mono">${currentCalc.taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-purple-200 pt-2 flex justify-between text-slate-900 font-black text-sm">
                  <span>Total Payable</span>
                  <span className="font-mono text-purple-900">${currentCalc.totalPayable.toFixed(2)}</span>
                </div>
              </div>

              {/* Generate Invoice Button */}
              <button
                onClick={handleGenerateInvoice}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>📄</span> Generate &amp; Save Official Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM STICKY NAVIGATION BAR ── */}
      <div className="fixed bottom-0 left-56 right-0 bg-white/95 backdrop-blur-md border-t border-purple-100 shadow-2xl py-2.5 px-5 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { label: 'Quotation Builder & DealTwin', to: '/app/quotations', icon: '📝' },
            { label: 'Approval Queue & Audit Trail', to: '/app/approvals', icon: '✅' },
            { label: 'Fulfillment & Warehouse Split', to: '/app/fulfillment', icon: '📦' },
            { label: 'Customer Portal & Negotiation', to: '/customer/login', icon: '🌐' },
            { label: 'Hybrid Billing & Invoicing', to: '/app/billing', icon: '💳', active: true },
          ].map(tab => (
            <Link key={tab.to} to={tab.to} className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-xl whitespace-nowrap transition-all ${tab.active ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
              <span>{tab.icon}</span>{tab.label}
            </Link>
          ))}
        </div>
        <div className="text-[10px] font-bold text-slate-500">
          Billing Engine Active (Tiered Metering)
        </div>
      </div>
    </div>
  );
};
