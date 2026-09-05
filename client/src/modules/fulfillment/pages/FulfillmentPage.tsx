import React, { useState, useEffect } from 'react';
import { FulfillmentService } from '../services/fulfillment.service';
import { QuotationService } from '@/modules/quotations/services/quotation.service';
import { Quotation } from '@/modules/quotations/types/quotation.types';
import {
  Truck,
  Warehouse,
  Package,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sliders,
} from 'lucide-react';

export const FulfillmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'allocations' | 'backorders'>('orders');
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [fulfillments, setFulfillments] = useState<any[]>([]);
  const [backorders, setBackorders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Auto-split preview state
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('');
  const [splitPreview, setSplitPreview] = useState<any | null>(null);
  const [allocating, setAllocating] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [qList, fList, bList] = await Promise.all([
        QuotationService.getQuotations({ limit: 50 }),
        FulfillmentService.list(),
        FulfillmentService.getBackorders(),
      ]);
      setQuotations(qList.data);
      setFulfillments(fList);
      setBackorders(bList);
      if (qList.data.length > 0 && !selectedQuoteId) {
        setSelectedQuoteId(qList.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedQuoteId) return;
    FulfillmentService.recommendSplit(selectedQuoteId)
      .then(setSplitPreview)
      .catch(() => setSplitPreview(null));
  }, [selectedQuoteId]);

  const handleExecuteAllocation = async () => {
    if (!selectedQuoteId) return;
    try {
      setAllocating(true);
      await FulfillmentService.allocateStock(selectedQuoteId);
      alert('Warehouse fulfillment allocation completed successfully!');
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error?.message || err?.message || 'Allocation failed');
    } finally {
      setAllocating(false);
    }
  };

  const handleConsolidateBackorder = async (boId: string) => {
    try {
      await FulfillmentService.consolidateBackorder(boId);
      alert('Backorder consolidated and released for shipping!');
      loadData();
    } catch (err: any) {
      alert('Failed to consolidate backorder');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fulfillment & Warehouse Operations</h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-[#6344e7] uppercase tracking-wider">
              RevOps Logistics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Intelligent multi-warehouse stock splitting, shipment optimization, and backorder consolidation.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock Levels</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'orders' ? 'bg-purple-50 text-[#6344e7]' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Auto-Split & Order Allocation</span>
        </button>

        <button
          onClick={() => setActiveTab('allocations')}
          className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'allocations' ? 'bg-purple-50 text-[#6344e7]' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Completed Fulfillments ({fulfillments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('backorders')}
          className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'backorders' ? 'bg-purple-50 text-[#6344e7]' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Backorders Queue ({backorders.filter((b) => b.status === 'PENDING').length})</span>
        </button>
      </div>

      {/* Tab 1: Orders & Auto-Split */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Quotation Selection & Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-[#6344e7]" />
                Select Approved Deal for Fulfillment
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Quotation</label>
                <select
                  value={selectedQuoteId}
                  onChange={(e) => setSelectedQuoteId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  {quotations.map((q) => (
                    <option key={q._id} value={q._id}>
                      {q.quotationNumber} — {typeof q.customerId === 'object' ? q.customerId.name : 'Customer'} (${q.grandTotal?.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {splitPreview && (
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Calculated Shipments:</span>
                    <span className="font-bold text-slate-800">{splitPreview.totalShipments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Freight / Shipping Cost:</span>
                    <span className="font-bold text-emerald-600">${splitPreview.estimatedShippingCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pending Backorders:</span>
                    <span className="font-bold text-amber-600">{splitPreview.backorders?.length || 0} items</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={allocating || !splitPreview}
                onClick={handleExecuteAllocation}
                className="w-full py-2.5 px-4 bg-[#6344e7] hover:bg-[#5233d4] text-white font-semibold rounded-xl text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{allocating ? 'Executing Allocation...' : 'Confirm & Commit Warehouse Split'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Auto-Split Recommendation Details (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Recommended Warehouse Allocation Matrix
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Deterministic split algorithm minimizing shipments while preserving stock thresholds.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-[#6344e7]">
                  AUTO-SPLIT ACTIVE
                </span>
              </div>

              {splitPreview?.allocations?.length > 0 ? (
                <div className="space-y-3">
                  {splitPreview.allocations.map((alloc: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{alloc.productName}</span>
                          <span className="text-[10px] font-mono text-slate-500">{alloc.sku}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-2">
                          <span className="font-semibold text-purple-700">Source: {alloc.warehouseName} ({alloc.warehouseCode})</span>
                          <span>• Available: {alloc.availableStock}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-slate-900">
                          {alloc.allocatedQuantity} units allocated
                        </div>
                        <div className="text-[10px] text-slate-500">Shipping: ${alloc.shippingCost}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  Select a quotation to generate optimal multi-warehouse split.
                </div>
              )}

              {/* Backorder notice if any */}
              {splitPreview?.backorders?.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Backorder Queue Detected ({splitPreview.backorders.length} items)
                  </div>
                  <p className="text-[11px] text-amber-700">
                    Stock is insufficient across all depots for full immediate fulfillment. Fulfilling available stock; balance transferred to backorders queue.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Completed Fulfillments */}
      {activeTab === 'allocations' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Allocated & Shipped Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                  <th className="py-2.5 px-3 font-semibold">Order #</th>
                  <th className="py-2.5 px-3 font-semibold">Quotation</th>
                  <th className="py-2.5 px-3 font-semibold">Shipments</th>
                  <th className="py-2.5 px-3 font-semibold">Freight Cost</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Promise Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fulfillments.map((f) => (
                  <tr key={f._id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-mono font-bold text-[#6344e7]">{f.orderNumber}</td>
                    <td className="py-3 px-3 text-slate-800">{f.quotationId?.quotationNumber || 'QT-ORDER'}</td>
                    <td className="py-3 px-3">{f.totalShipments} Depot(s)</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">${f.estimatedShippingCost}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {f.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {f.promisedDeliveryDate ? new Date(f.promisedDeliveryDate).toLocaleDateString() : '5 business days'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Backorders & Consolidation */}
      {activeTab === 'backorders' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Backorder Queue</h3>
            <p className="text-xs text-slate-500">
              When replenishment arrives at any depot, consolidate remaining balances to complete customer orders.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                  <th className="py-2.5 px-3 font-semibold">Deal Reference</th>
                  <th className="py-2.5 px-3 font-semibold">Product</th>
                  <th className="py-2.5 px-3 font-semibold">Ordered</th>
                  <th className="py-2.5 px-3 font-semibold">Fulfilled</th>
                  <th className="py-2.5 px-3 font-semibold">Remaining</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {backorders.map((bo) => (
                  <tr key={bo._id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-[#6344e7]">{bo.quotationId?.quotationNumber || 'QT'}</td>
                    <td className="py-3 px-3 text-slate-800">{bo.productId?.name || 'Product'}</td>
                    <td className="py-3 px-3 text-slate-500">{bo.orderedQuantity} units</td>
                    <td className="py-3 px-3 text-emerald-600 font-semibold">{bo.allocatedQuantity} units</td>
                    <td className="py-3 px-3 text-rose-600 font-bold">{bo.remainingQuantity} units</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          bo.status === 'CONSOLIDATED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {bo.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {bo.status === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => handleConsolidateBackorder(bo._id)}
                          className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-[#6344e7] font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Consolidate Remaining Backorder
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
    </div>
  );
};
