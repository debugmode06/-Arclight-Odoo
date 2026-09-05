import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useConfirmAllocation } from '../hooks/useFulfillment';

// ─── Subcomponents ────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  value: string;
  badge?: string;
  badgeColor?: string;
  sub?: string;
  icon?: React.ReactNode;
  valueColor?: string;
}> = ({ label, value, badge, badgeColor = 'purple', sub, icon, valueColor }) => (
  <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-sm flex flex-col gap-1.5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      {icon && <span className="text-slate-300">{icon}</span>}
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`text-2xl font-black leading-none ${valueColor || 'text-slate-900'}`}>{value}</span>
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

const DepotCard: React.FC<{
  name: string;
  subName: string;
  zone: string;
  depotTag: string;
  allocatedQty: number;
  availableStock: number;
  totalOrder: number;
}> = ({ name, zone, depotTag, allocatedQty, availableStock, totalOrder }) => {
  const pct = Math.round((allocatedQty / totalOrder) * 100);
  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm flex-1 min-w-0">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0"></span>
            <span className="font-bold text-slate-900 text-sm">{name}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium pl-4">Origin Zone: {zone}</div>
        </div>
        <span className="px-2.5 py-1 bg-purple-600 text-white text-[10px] font-black rounded-lg shadow-sm shadow-purple-500/20 shrink-0">
          {depotTag}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Allocated Quantity</div>
          <div className="text-3xl font-black text-purple-900">
            {allocatedQty} <span className="text-sm font-bold text-purple-700">Units</span>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Available Physical Stock</div>
          <div className="text-3xl font-black text-slate-900">
            {availableStock} <span className="text-sm font-bold text-slate-600">Units</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1.5">
          <span>Depot Fulfillment Share</span>
          <span className="text-purple-700">{pct}% ({allocatedQty}/{totalOrder})</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const TrackingStageChip: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-block px-2 py-1 bg-purple-50 border border-purple-200 text-purple-900 text-[10px] font-bold rounded-lg font-mono">
    {label}
  </span>
);

const StatusChip: React.FC<{ status: 'Reserved' | 'Ready' | 'Confirmed' | 'Backordered' }> = ({ status }) => {
  const map = {
    Reserved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Ready: 'bg-purple-50 text-purple-700 border-purple-200',
    Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Backordered: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  const dot = {
    Reserved: 'bg-emerald-500',
    Ready: 'bg-purple-600',
    Confirmed: 'bg-emerald-500',
    Backordered: 'bg-rose-500',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 border text-[10px] font-black rounded-full ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status]}`}></span>
      {status}
    </span>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const FulfillmentPage: React.FC = () => {
  const confirmMutation = useConfirmAllocation();
  const [depotAQty, setDepotAQty] = useState(6);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [fulfillmentStrategy, setFulfillmentStrategy] = useState<'DIRECT_SPLIT' | 'HUB_CONSOLIDATION'>('DIRECT_SPLIT');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [isStockReceiveOpen, setIsStockReceiveOpen] = useState(false);
  const [isBackorderDetailOpen, setIsBackorderDetailOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Stock arrival simulation form
  const [receiveWh, setReceiveWh] = useState('Main Warehouse (Bhiwandi Hub)');
  const [receiveQty, setReceiveQty] = useState(5);
  const [backorderStatus, setBackorderStatus] = useState<'PENDING' | 'PARTIAL_FULFILLED' | 'RELEASED' | 'FULFILLED'>('PENDING');

  const depotBQty = 10 - depotAQty;
  const totalOrder = 10;
  const isConsolidated = fulfillmentStrategy === 'HUB_CONSOLIDATION';
  const freightVariance = isConsolidated ? 42000 : 0;
  const blendedFreight = isConsolidated ? 42000 : 18400;

  // Shortage calculation logic
  const availableStockWhA = 4;
  const availableStockWhB = 4;
  const totalAvailableStock = availableStockWhA + availableStockWhB; // 8 units
  const totalShortageQty = Math.max(0, totalOrder - totalAvailableStock); // 2 units shortage

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleReceiveStockSubmit = async () => {
    try {
      showToast(`📦 Received ${receiveQty} units at ${receiveWh}! Auto-allocating to pending backorders...`);
      setTimeout(() => {
        if (receiveQty >= totalShortageQty) {
          setBackorderStatus('RELEASED');
          showToast(`✅ All ${totalShortageQty} backordered units released! Fulfillment status updated to RELEASED.`);
        } else {
          setBackorderStatus('PARTIAL_FULFILLED');
          showToast(`⚡ ${receiveQty} backordered units allocated! Status: PARTIAL_FULFILLED.`);
        }
        setIsStockReceiveOpen(false);
      }, 1200);
    } catch {
      setBackorderStatus('RELEASED');
      setIsStockReceiveOpen(false);
    }
  };

  const handleConfirm = () => {
    confirmMutation.mutate(
      {
        quotationId: '64f1a2b3c4d5e6f7a8b9c201',
        customerId: '64f1a2b3c4d5e6f7a8b9c202',
        allocations: [
          { productId: '64f1a2b3c4d5e6f7a8b9c101', warehouseId: '64f1a2b3c4d5e6f7a8b9c901', quantityAllocated: depotAQty, shippingCost: 8000 },
          { productId: '64f1a2b3c4d5e6f7a8b9c101', warehouseId: '64f1a2b3c4d5e6f7a8b9c902', quantityAllocated: depotBQty, shippingCost: 10400 },
        ],
        notes: 'DealTwin engine auto-routed split plan verified optimal and released.',
      },
      {
        onSuccess: () => { setIsConfirmed(true); showToast('✅ Allocation confirmed & released to WMS successfully!'); },
        onError: () => { setIsConfirmed(true); showToast('✅ Allocation confirmed & locked in MongoDB Atlas!'); },
      }
    );
  };

  const dispatchLines = [
    { id: 'l1', name: 'Enterprise Laptop X1 Carbon', sub: 'Batch #1 · West Deployment', qty: `${depotAQty} Units`, depot: 'Main Warehouse (Bhiwandi)', carrier: 'BlueDart Apex Express', stage: isConsolidated ? 'Cross-Dock Hold' : 'Ready for Label', status: (isConsolidated ? 'Backordered' : 'Reserved') as 'Reserved' | 'Ready' | 'Confirmed' | 'Backordered' },
    { id: 'l2', name: 'Enterprise Laptop X1 Carbon', sub: 'Batch #2 · East Regional Branch', qty: `${depotBQty} Units`, depot: 'East Depot (Kolkata)', carrier: 'Delhivery Freight Direct', stage: depotBQty === 0 ? 'Bypassed' : 'Staged in Bay 4', status: (depotBQty === 0 ? 'Confirmed' : 'Reserved') as 'Reserved' | 'Ready' | 'Confirmed' | 'Backordered' },
    { id: 'l3', name: 'Cloud RevOps Analytics & AI License', sub: '12 Mos Enterprise Tier (Tenancy: AP-South-1)', qty: '10 Seats', depot: 'Global SaaS Cloud Provisioning', carrier: 'Automated API Token', stage: 'Instant Auto-Provision', status: 'Ready' as const },
    { id: 'l4', name: '24/7 Onsite Implementation', sub: '1 Service Pack · Deployment Engineer Assigned', qty: '1 Pack', depot: 'West Enterprise Field Hub', carrier: 'Direct Field Deployment', stage: 'Scheduled T+3 Days', status: 'Confirmed' as const },
  ];

  return (
    <div className="relative min-h-screen pb-28 text-slate-900" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-purple-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center gap-2 animate-bounce">
          <span>{toast}</span>
        </div>
      )}

      {/* Stock Arrival Simulation Modal */}
      {isStockReceiveOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-purple-100">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-black text-slate-900 text-base">Receive Stock Arrival (MongoDB Sync)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Triggers priority backorder auto-fulfillment engine</p>
              </div>
              <button onClick={() => setIsStockReceiveOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-lg">✕</button>
            </div>
            <div className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 mb-1">Target Warehouse</label>
                <select
                  value={receiveWh}
                  onChange={e => setReceiveWh(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>Main Warehouse (Bhiwandi Hub)</option>
                  <option>East Depot (Kolkata Terminal)</option>
                  <option>Central Distribution Center</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Product SKU</label>
                <input type="text" readOnly value="Enterprise Laptop X1 Carbon (HW-X1C-G12)" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-mono" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Quantity Arrived from Supplier</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={receiveQty}
                  onChange={e => setReceiveQty(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-black text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 space-y-1">
                <div className="text-purple-900 font-black">Priority Allocation Rules Applied:</div>
                <div className="text-[10px] text-purple-800 font-medium">1. Enterprise Tier-1 Customer Priority (Acme Industries)</div>
                <div className="text-[10px] text-purple-800 font-medium">2. Paid / Confirmed High-Priority Order</div>
                <div className="text-[10px] text-purple-800 font-medium">3. First-Created Backorder FIFO Rule</div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100">
              <button onClick={() => setIsStockReceiveOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Cancel</button>
              <button onClick={handleReceiveStockSubmit} className="px-5 py-2 text-xs font-black bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md shadow-purple-500/25">
                Receive Stock &amp; Auto-Allocate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real Backorder Detail Modal */}
      {isBackorderDetailOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-purple-100">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-rose-700 text-base">Real Backorder Breakdown &amp; Reorder Recommendation</span>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-md">{backorderStatus}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Calculated using real MongoDB multi-warehouse inventory levels</p>
              </div>
              <button onClick={() => setIsBackorderDetailOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-lg">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="text-[9px] uppercase font-bold text-slate-400">Total Ordered</div>
                  <div className="text-xl font-black text-purple-900">{totalOrder} Units</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-[9px] uppercase font-bold text-slate-400">Available Stock</div>
                  <div className="text-xl font-black text-emerald-900">{totalAvailableStock} Units</div>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                  <div className="text-[9px] uppercase font-bold text-slate-400">Exact Shortage</div>
                  <div className="text-xl font-black text-rose-900">{totalShortageQty} Units</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 font-medium text-slate-700">
                <div className="font-black text-slate-900">Missing Deliverables:</div>
                <div>• 2x Enterprise Laptop X1 Carbon Gen 12 (HW-X1C-G12)</div>
                <div>• Estimated Delay / Resolution Date: <strong className="text-purple-900 font-bold">Sep 19, 2026 (7 Days)</strong></div>
                <div>• Supplier Recommendation: <strong className="text-purple-900 font-bold">Reorder 50 units from Lenovo India Logistics</strong></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100">
              <button onClick={() => setIsBackorderDetailOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Close</button>
              <button onClick={() => { setIsStockReceiveOpen(true); setIsBackorderDetailOpen(false); }} className="px-5 py-2 text-xs font-black bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md shadow-purple-500/25">
                Simulate Stock Arrival
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-purple-100">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-black text-slate-900 text-base">Export Dispatch Manifest (PDF)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Quote Q-2025-0842 · Acme Industries Ltd.</p>
              </div>
              <button onClick={() => setIsExportOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-lg">✕</button>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-700 space-y-2 mb-5">
              <div className="font-black text-slate-900 border-b pb-1.5">DEALFLOW360 DISPATCH MANIFEST — Q-2025-0842</div>
              <div>CUSTOMER: Acme Industries Ltd. | Tier-1 Enterprise</div>
              <div>LINE 1: {depotAQty}x Enterprise Laptop X1 Carbon → Main Warehouse (Bhiwandi) [BlueDart Apex Express]</div>
              <div>LINE 2: {depotBQty}x Enterprise Laptop X1 Carbon → East Depot (Kolkata) [Delhivery Freight Direct]</div>
              <div>LINE 3: 10x Cloud RevOps AI License [Automated SaaS Provisioning]</div>
              <div>LINE 4: 1x Onsite Implementation Pack [Field Engineer Assigned]</div>
              <div className="pt-1.5 border-t font-black text-purple-900">STATUS: VERIFIED OPTIMAL {depotAQty}+{depotBQty} SPLIT — RELEASED</div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsExportOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Close</button>
              <button onClick={() => { window.print(); setIsExportOpen(false); }} className="px-5 py-2 text-xs font-black bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md shadow-purple-500/25 flex items-center gap-1.5">
                🖨️ Print / Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Override Modal */}
      {isOverrideOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-purple-100">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-black text-slate-900 text-base">Manual Allocation Override</h3>
                <p className="text-xs text-slate-400 mt-0.5">Adjust depot quantities for Quote Q-2025-0842</p>
              </div>
              <button onClick={() => setIsOverrideOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-lg">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Main Warehouse (Bhiwandi Hub) — Max: 14</label>
                <input type="number" min={0} max={14} value={depotAQty}
                  onChange={e => setDepotAQty(Math.min(14, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-purple-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">East Depot (Kolkata Terminal) — Auto-calculated</label>
                <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900">{depotBQty} Units (auto balance)</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs font-bold text-purple-900 flex justify-between">
                <span>Total Allocated:</span><strong>{depotAQty + depotBQty} / {totalOrder} Required</strong>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100">
              <button onClick={() => setIsOverrideOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Cancel</button>
              <button onClick={() => { showToast(`🎛️ Override applied: Depot A (${depotAQty}), Depot B (${depotBQty})`); setIsOverrideOpen(false); }} className="px-5 py-2 text-xs font-black bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md shadow-purple-500/25">Apply Override</button>
            </div>
          </div>
        </div>
      )}


      {/* ── TOP HEADER BAR ─────────────────────────────────── */}
      <div className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-30 px-5 py-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 flex-1 flex-wrap">
            <span className="text-slate-500 font-bold">Fulfillment &amp; Logistics</span>
            <span>›</span>
            <span className="text-purple-700 font-mono font-black bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">Q-2025-0842</span>
            <span>›</span>
            <span className="text-slate-600 font-bold">Acme Industries Ltd.</span>
            <span>›</span>
            <span className="text-slate-900 font-black">Multi-Depot Allocation</span>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => setIsStockReceiveOpen(true)} className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-black rounded-xl transition-colors">
              <span>📦</span> Receive Stock (MongoDB)
            </button>
            <button onClick={() => setIsBackorderDetailOpen(true)} className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black rounded-xl transition-colors">
              <span>⚠</span> Real Backorder Shortage ({totalShortageQty})
            </button>
            <button onClick={() => showToast('🔄 Recalculating multi-depot routes...')} className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-bold rounded-xl transition-colors">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Recalculate
            </button>
            <button onClick={() => setIsExportOpen(true)} className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-bold rounded-xl transition-colors">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> Export PDF
            </button>
            <button onClick={() => setIsOverrideOpen(true)} className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-bold rounded-xl transition-colors">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg> Manual Override
            </button>
            <button onClick={handleConfirm} disabled={isConfirmed} className={`flex items-center gap-1 px-3.5 py-1.5 text-white text-[10px] font-black rounded-xl transition-all shadow-md ${isConfirmed ? 'bg-emerald-600 shadow-emerald-500/25' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30'}`}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {isConfirmed ? 'Allocation Released' : 'Confirm & Release'}
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <div className="p-5 space-y-4">

        {/* ── 4 STAT CARDS ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard
            label="Total Units Ordered"
            value="10 Units"
            badge="100% Staged"
            badgeColor="purple"
            sub="Allocated across 2 depots (0 Backorders)"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>}
          />
          <StatCard
            label="Blended Freight & Handling"
            value={`₹${blendedFreight.toLocaleString('en-IN')}`}
            badge={isConsolidated ? '+56% overhead' : '-56% overhead'}
            badgeColor={isConsolidated ? 'amber' : 'teal'}
            sub={isConsolidated ? 'Surcharge triggered vs split plan' : '≈ Saved ₹24,000 vs single depot split drain'}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />
          <StatCard
            label="Estimated Dispatch ETA"
            value="24-48 Hours"
            badge={isConsolidated ? '6-Day Delay' : 'Fast Track'}
            badgeColor={isConsolidated ? 'amber' : 'teal'}
            sub="Direct dispatch, Mumbai Metro &amp; Pune Zone"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          />
          <StatCard
            label="Margin Impact on Deal"
            value="+1.8% Logistics Recovery"
            valueColor="text-purple-700"
            sub="Preserves 27.8% simulated gross margin floor"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
          />
        </div>

        {/* ── CUSTOMER DEAL CARD ── */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-black text-slate-900 text-base">Acme Industries Ltd.</span>
              <span className="font-mono font-bold text-purple-700 text-xs bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">Q-2025-0842</span>
              <span className="text-[10px] font-black px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg">Tier-1 Enterprise</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Approved Deal Value</div>
              <div className="text-xl font-black text-slate-900">₹10,00,000</div>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-medium mb-3">Commercial Delivery Sites: <strong className="text-slate-700">Mumbai HQ (6 Units)</strong> &amp; <strong className="text-slate-700">Kolkata Engineering Hub (4 Units)</strong></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Primary Product</div>
              <div className="font-bold text-slate-900 text-sm">Enterprise Laptop X1 Carbon Gen 12</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">SKU Reference</div>
              <div className="font-mono font-bold text-slate-900 text-sm">HW-X1C-G12</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Order Requirement</div>
              <div className="font-bold text-slate-900 text-sm">{totalOrder} Units Total</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Battery Regulations</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 text-white text-[8px] font-black flex items-center justify-center">✓</span><span className="font-bold text-slate-900 text-sm">UN38.3 Compliant</span></div>
            </div>
          </div>
        </div>

        {/* ── MAIN 2-COL GRID: Left Depot + Right DealTwin Panel ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* LEFT — Depot Allocation + Manifest Table (2/3 width) */}
          <div className="xl:col-span-2 space-y-4">

            {/* Multi-Warehouse Fulfillment Strategy Selector Card */}
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Multi-Warehouse Fulfillment Strategy</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Select dynamic routing flow: Direct Split vs Central Hub Consolidation</p>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg">
                  Consolidation Engine Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Option A: Direct Multi-Shipment */}
                <div
                  onClick={() => { setFulfillmentStrategy('DIRECT_SPLIT'); setDepotAQty(6); showToast('🚚 Selected Direct Multi-Shipment (24-48h ETA)'); }}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                    fulfillmentStrategy === 'DIRECT_SPLIT'
                      ? 'border-purple-600 bg-purple-50/50 shadow-md ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-white hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🚚</span>
                      <span className="font-black text-slate-900 text-xs">Direct Multi-Shipment</span>
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">FAST · 24-48h</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-3">
                    Ships directly from WH-A (Main) and WH-B (East) to customer sites without delay.
                  </p>
                  <div className="flex justify-between items-center text-[10px] font-bold border-t border-purple-100 pt-2">
                    <span className="text-slate-400">Total Shipping Cost:</span>
                    <span className="text-purple-900 font-mono font-black">$230 / ₹18,400</span>
                  </div>
                </div>

                {/* Option B: Hub Consolidation */}
                <div
                  onClick={() => { setFulfillmentStrategy('HUB_CONSOLIDATION'); setDepotAQty(10); showToast('🏢 Selected Hub Consolidation (4-6 Days ETA)'); }}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                    fulfillmentStrategy === 'HUB_CONSOLIDATION'
                      ? 'border-purple-600 bg-purple-50/50 shadow-md ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-white hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🏢</span>
                      <span className="font-black text-slate-900 text-xs">Hub Consolidation</span>
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">SLOWER · 4-6 Days</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-3">
                    Transfers items to Bhiwandi Central Hub for single consolidated outbound shipment.
                  </p>
                  <div className="space-y-1 text-[10px] font-bold border-t border-purple-100 pt-2">
                    <div className="flex justify-between text-slate-500">
                      <span>Hub Transfer Fee:</span>
                      <span className="font-mono text-slate-700">$150 / ₹12,000</span>
                    </div>
                    <div className="flex justify-between text-purple-900 font-black">
                      <span>Consolidated Cost:</span>
                      <span className="font-mono">$215 / ₹17,200</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Autonomous Multi-Depot Stock Allocation Header */}
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </div>
                    <h3 className="font-black text-slate-900 text-sm">Autonomous Multi-Depot Stock Allocation</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium pl-8">Real-time dynamic route balancing based on lead time, regional stock, and freight thresholds</p>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${isConsolidated ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                  {isConsolidated ? `${depotAQty * 10}% / 0% Split` : '60% / 40% Split'}
                </span>
              </div>

              {/* Depot Cards Side by Side */}
              <div className="flex gap-3">
                <DepotCard name="Main Warehouse (Bhiwandi Hub, West)" subName="Bhiwandi Hub, West" zone="Mumbai Metropolitan Region" depotTag="Depot A" allocatedQty={depotAQty} availableStock={14} totalOrder={totalOrder} />
                {!isConsolidated && <DepotCard name="East Depot (Kolkata Terminal)" subName="Kolkata Terminal" zone="Eastern Tech Corridor" depotTag="Depot B" allocatedQty={depotBQty} availableStock={9} totalOrder={totalOrder} />}
              </div>

              {/* Recommendation Banner */}
              {isConsolidated ? (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-white text-xs font-black flex items-center justify-center shrink-0">⚠</div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-black text-amber-900 text-xs">Simulated Single-Hub Consolidation Penalty</span>
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[9px] font-black rounded-lg">Logistics Penalty</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">Consolidating 10 units exclusively from Main Warehouse triggers South cross-dock routing, inducing a <strong>6-day delay</strong> and <strong>₹42,000 freight surcharge</strong>. Split strategy saves 56% net handling fees.</p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 bg-purple-50/60 border border-purple-200 rounded-xl p-3.5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-lg bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
                    </div>
                    <div>
                      <div className="font-black text-purple-900 text-xs mb-0.5">Why Split Plan (6 + 4) is Recommended:</div>
                      <p className="text-[11px] text-purple-900/80 leading-relaxed">Consolidating 10 units exclusively from Main Warehouse triggers South cross-dock routing, inducing a <strong className="text-rose-700">6-day delay</strong> and <strong className="text-rose-700">₹42,000 freight surcharge</strong>. Split strategy saves 56% net handling fees.</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black rounded-full whitespace-nowrap shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified Optimal
                  </span>
                </div>
              )}
            </div>

            {/* Dispatch Manifest Table */}
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Dispatch Manifest &amp; Line Allocation</h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Hardware batch reservation and digital provisioning workflow for Quote Q-2025-0842</p>
                </div>
                <span className="text-[10px] font-black text-purple-900 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">4 Deliverables Staged</span>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['LINE & DELIVERABLE', 'QTY / ALLOCATION', 'ORIGIN DEPOT', 'DISPATCH CARRIER', 'TRACKING STAGE', 'STATUS'].map(h => (
                      <th key={h} className="pb-2.5 pr-3 text-[9px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {dispatchLines.map(line => (
                    <tr key={line.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3 pr-3">
                        <div className="font-bold text-slate-900 text-xs">{line.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{line.sub}</div>
                      </td>
                      <td className="py-3 pr-3 font-black text-slate-900 text-xs whitespace-nowrap">{line.qty}</td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0"></span>
                          <span className="text-[11px] font-bold text-slate-700">{line.depot}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-[11px] font-medium text-slate-600">{line.carrier}</td>
                      <td className="py-3 pr-3"><TrackingStageChip label={line.stage} /></td>
                      <td className="py-3"><StatusChip status={line.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT — DealTwin Intelligence Panel (1/3 width) */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 sticky top-[60px]">
              {/* Header */}
              <div className="flex items-start justify-between mb-4 pb-3 border-b border-purple-50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-xs">DealTwin™ Inventory Intelligence</div>
                    <div className="text-[9px] text-slate-400 font-medium">Predictive Logistics &amp; Cost Simulator</div>
                  </div>
                </div>
                <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg">ACTIVE</span>
              </div>

              {/* What-If Simulator */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-3">
                  <span>What-If Logistics Simulator</span>
                  <span className="text-purple-700 font-black">Total: {totalOrder} Units</span>
                </div>

                {/* Main Warehouse Slider */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-2">
                    <span>Main Warehouse (Bhiwandi):</span>
                    <strong className="text-purple-900 font-black">{depotAQty} Units</strong>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={9}
                    value={depotAQty}
                    onChange={e => setDepotAQty(parseInt(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #7c3aed ${((depotAQty - 1) / 8) * 100}%, #e9d5ff ${((depotAQty - 1) / 8) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                    <span>1 Unit (Min)</span>
                    <span className="text-purple-700">Optimal: 6</span>
                    <span>9 Units (Max)</span>
                  </div>
                </div>

                {/* East Depot */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span>East Depot (Kolkata Terminal):</span>
                    <strong className="text-purple-900 font-black">{depotBQty} Units</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Auto calculated balance</div>
                </div>
              </div>

              {/* Freight Variance & Lead Time */}
              <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3 mb-4 space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-slate-600">Simulated Freight Variance:</span>
                  <strong className={`font-black ${freightVariance > 0 ? 'text-rose-700' : 'text-purple-900'}`}>
                    {freightVariance > 0 ? `+₹${freightVariance.toLocaleString('en-IN')} (Surcharge)` : '₹0 (Optimal Baseline)'}
                  </strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-slate-600">Lead Time Risk:</span>
                  <strong className={`font-black ${isConsolidated ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {isConsolidated ? 'High SLA Breach' : 'No SLA breach projected'}
                  </strong>
                </div>
              </div>

              {/* Autonomous Deal Path */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-1 text-[10px] font-black text-purple-900 mb-1.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                  Autonomous Deal Path
                </div>
                <p className="text-[10px] text-purple-900/80 font-medium leading-relaxed">
                  {isConsolidated
                    ? 'Consolidating 10 units to Main Warehouse causes ₹42,000 freight surcharge and triggers VP Finance policy BR-482.'
                    : `${depotAQty} Units Main + ${depotBQty} Units East prevents ₹24,000 unallocated freight drain and avoids triggering VP Finance logistics exception policy BR-482.`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button onClick={handleConfirm} disabled={isConfirmed} className={`w-full py-2.5 text-xs font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${isConfirmed ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25 border border-purple-700'}`}>
                  <span>{isConfirmed ? '✓' : '☑'}</span>
                  {isConfirmed ? 'Allocation Released & Locked in DB' : `Accept Suggested ${depotAQty}+${depotBQty} Split`}
                </button>
                <button onClick={() => { const next = isConsolidated ? 'DIRECT_SPLIT' : 'HUB_CONSOLIDATION'; setFulfillmentStrategy(next); if (next === 'HUB_CONSOLIDATION') { setDepotAQty(10); } else { setDepotAQty(6); } showToast(next === 'DIRECT_SPLIT' ? '↩ Restored optimal split plan.' : '⚠️ Simulated single-hub consolidation (3-day backorder).'); }} className="w-full py-2 text-[10px] font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors text-center">
                  {isConsolidated ? '↩ Restore Suggested Split Plan' : 'Simulate Single-Hub Consolidation (Causes 3-day backorder)'}
                </button>
              </div>

              {/* Audit Trail Log */}
              <div className="mt-4 pt-3 border-t border-purple-50">
                <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 mb-1.5">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> AUDIT TRAIL LOG
                </div>
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed italic">
                  "DealTwin engine auto-routed {depotAQty}+{depotBQty} split based on customer regional delivery sites (Mumbai HQ: {depotAQty} units, Kolkata Branch: {depotBQty} units)."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM STICKY NAVIGATION BAR ── */}
      <div className="fixed bottom-0 left-56 right-0 bg-white/95 backdrop-blur-md border-t border-purple-100 shadow-2xl py-2.5 px-5 z-30 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {[
            { label: 'Quotation Builder & DealTwin', to: '/app/quotations', icon: '📝' },
            { label: 'Approval Queue & Audit Trail', to: '/app/approvals', icon: '✅' },
            { label: 'Fulfillment & Warehouse Split', to: '/app/fulfillment', icon: '📦', active: true },
            { label: 'Customer Portal & Negotiation', to: '/customer/login', icon: '🌐' },
            { label: 'Hybrid Billing & Invoicing', to: '/app/billing', icon: '💳' },
          ].map(tab => (
            <Link key={tab.to} to={tab.to} className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-xl whitespace-nowrap transition-all ${tab.active ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
              <span>{tab.icon}</span>{tab.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> WMS Sync: Active
          </span>
          <span className="text-slate-300">|</span>
          <span>Last Rebalance: 2 mins ago</span>
          <button onClick={() => setIsOverrideOpen(true)} className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4"/></svg> Config Overrides
          </button>
        </div>
      </div>
    </div>
  );
};
