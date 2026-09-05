import React from 'react';
import { FulfillmentRecord } from '../types/fulfillment.types';

interface Props {
  backorders: FulfillmentRecord[];
}

export const BackorderQueue: React.FC<Props> = ({ backorders }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Backorder Queue & Stock Deficits</h3>
          <p className="text-sm text-slate-500">Unfulfilled line items pending multi-warehouse replenishment</p>
        </div>
        <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full border border-rose-200">
          {backorders.length} Active Backorder Orders
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <th className="p-3">Order / Fulfillment Ref</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Backordered Items</th>
              <th className="p-3 text-right">Shortage Quantity</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-600">
            {backorders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">
                  No active backorders currently in queue.
                </td>
              </tr>
            ) : (
              backorders.map((record) => {
                const customerName = typeof record.customerId === 'object' ? record.customerId.name : 'Customer';

                return record.backorders.map((bo, idx) => {
                  const prodName = typeof bo.productId === 'object' ? bo.productId.name : 'Product';
                  const prodSku = typeof bo.productId === 'object' ? bo.productId.sku : '';

                  return (
                    <tr key={`${record._id}-${idx}`} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">{record.fulfillmentNumber}</td>
                      <td className="p-3">{customerName}</td>
                      <td className="p-3">
                        <div className="font-medium text-slate-900">{prodName}</div>
                        <div className="text-xs text-slate-400 font-mono">SKU: {prodSku}</div>
                      </td>
                      <td className="p-3 text-right font-bold text-rose-600">
                        {bo.quantityBackordered} units
                      </td>
                      <td className="p-3 text-center">
                        {bo.status === 'RESOLVED' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            Auto-Resolved
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                            Pending Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                });
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
