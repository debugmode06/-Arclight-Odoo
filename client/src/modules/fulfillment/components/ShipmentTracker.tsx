import React from 'react';
import { FulfillmentRecord } from '../types/fulfillment.types';
import { useShipFulfillment } from '../hooks/useFulfillment';

interface Props {
  fulfillments: FulfillmentRecord[];
}

export const ShipmentTracker: React.FC<Props> = ({ fulfillments }) => {
  const shipMutation = useShipFulfillment();

  const handleMarkShipped = (id: string) => {
    shipMutation.mutate(id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ALLOCATED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">Allocated</span>;
      case 'PARTIALLY_FULFILLED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">Partially Fulfilled</span>;
      case 'SHIPPED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200">Shipped</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Delivered</span>;
      case 'BACKORDERED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">Backordered</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">Pending</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Active Fulfillment Orders</h3>
          <p className="text-sm text-slate-500">Track multi-warehouse shipments, tracking numbers & dispatch status</p>
        </div>
      </div>

      <div className="space-y-4">
        {fulfillments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
            No active fulfillment records found.
          </div>
        ) : (
          fulfillments.map((record) => {
            const quotationNum = typeof record.quotationId === 'object' ? record.quotationId.quotationNumber : record.quotationId;
            const customerName = typeof record.customerId === 'object' ? record.customerId.name : 'Customer';

            return (
              <div key={record._id} className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 text-base">{record.fulfillmentNumber}</span>
                      {getStatusBadge(record.status)}
                      {record.isManualOverride && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded">
                          Manual Override
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Quotation: <strong className="text-slate-700">{quotationNum || 'N/A'}</strong> | Customer: <strong className="text-slate-700">{customerName}</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">${record.totalShippingCost.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">{record.totalShipments} Shipment(s)</div>
                  </div>
                </div>

                {/* Warehouse Allocations detail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {record.allocations.map((alloc, idx) => {
                    const whName = typeof alloc.warehouseId === 'object' ? alloc.warehouseId.name : 'Warehouse';
                    const prodName = typeof alloc.productId === 'object' ? alloc.productId.name : 'Product';

                    return (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                        <div className="flex justify-between font-semibold text-slate-800 mb-1">
                          <span>{prodName}</span>
                          <span className="text-blue-600">{alloc.quantityAllocated} units</span>
                        </div>
                        <div className="text-slate-500 flex justify-between">
                          <span>Warehouse: {whName}</span>
                          {alloc.trackingNumber && <span className="font-mono text-purple-700">{alloc.trackingNumber}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {record.status === 'ALLOCATED' && (
                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleMarkShipped(record._id)}
                      disabled={shipMutation.isPending}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
                    >
                      {shipMutation.isPending ? 'Processing...' : 'Mark All Shipments Shipped'}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
