import React, { useState } from 'react';
import { AllocationRecommendation } from '../types/fulfillment.types';
import { useConfirmAllocation } from '../hooks/useFulfillment';

interface Props {
  quotationId: string;
  customerId: string;
  recommendation: AllocationRecommendation;
  onSuccess?: () => void;
}

export const AllocationRecommendationCard: React.FC<Props> = ({
  quotationId,
  customerId,
  recommendation,
  onSuccess,
}) => {
  const confirmAllocationMutation = useConfirmAllocation();
  const [isOverrideMode, setIsOverrideMode] = useState<boolean>(false);
  const [overrideNotes, setOverrideNotes] = useState<string>('');

  const handleConfirm = () => {
    confirmAllocationMutation.mutate(
      {
        quotationId,
        customerId,
        allocations: recommendation.allocations.map((a) => ({
          productId: a.productId,
          warehouseId: a.warehouseId,
          quantityAllocated: a.quantityAllocated,
          shippingCost: a.shippingCost,
        })),
        isManualOverride: isOverrideMode,
        notes: overrideNotes || (isOverrideMode ? 'Manual warehouse manager override' : 'Automated multi-warehouse split'),
      },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Smart Fulfillment Engine</span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">Warehouse Split Recommendation</h3>
        </div>
        <div className="flex items-center gap-2">
          {recommendation.isSplitRequired ? (
            <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
              Multi-Warehouse Split Needed ({recommendation.totalShipments} Warehouses)
            </span>
          ) : (
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
              Single Warehouse Fulfillment (1 Shipment)
            </span>
          )}
        </div>
      </div>

      {/* Allocation breakdown list */}
      <div className="space-y-3 mb-6">
        {recommendation.allocations.map((alloc, idx) => (
          <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                {alloc.warehouseCode || 'WH'}
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm">{alloc.warehouseName}</div>
                <div className="text-xs text-slate-500">Allocation: <strong className="text-slate-800">{alloc.quantityAllocated} units</strong></div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">${alloc.shippingCost.toFixed(2)}</div>
              <div className="text-xs text-slate-400">Est. Shipping Cost</div>
            </div>
          </div>
        ))}

        {recommendation.backorders.map((bo, idx) => (
          <div key={idx} className="flex items-center justify-between p-3.5 bg-rose-50 border border-rose-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                BO
              </div>
              <div>
                <div className="font-semibold text-rose-900 text-sm">Backordered Quantity</div>
                <div className="text-xs text-rose-600">{bo.reason}</div>
              </div>
            </div>
            <div className="text-right font-bold text-rose-700 text-sm">
              {bo.quantityBackordered} units unfulfilled
            </div>
          </div>
        ))}
      </div>

      {/* Cost & Summary Header */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-slate-900 text-white rounded-lg mb-6">
        <div>
          <div className="text-xs text-slate-400">Total Required Shipments</div>
          <div className="text-lg font-bold">{recommendation.totalShipments} Shipment(s)</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Total Calculated Shipping Cost</div>
          <div className="text-lg font-bold text-emerald-400">${recommendation.totalShippingCost.toFixed(2)}</div>
        </div>
      </div>

      {/* Manual Override controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isOverrideMode}
            onChange={(e) => setIsOverrideMode(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-xs font-medium text-slate-700">Manual Manager Override Mode</span>
        </label>

        <button
          onClick={handleConfirm}
          disabled={confirmAllocationMutation.isPending}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
        >
          {confirmAllocationMutation.isPending ? 'Confirming...' : 'Confirm Stock Allocation & Lock Inventory'}
        </button>
      </div>
    </div>
  );
};
