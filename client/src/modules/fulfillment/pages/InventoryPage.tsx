import React from 'react';
import { useInventorySummary } from '../hooks/useFulfillment';
import { WarehouseStockMatrix } from '../components/WarehouseStockMatrix';

export const InventoryPage: React.FC = () => {
  const { data, isLoading } = useInventorySummary();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-2xl text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-200 border border-purple-500/30 rounded-full text-xs font-semibold uppercase tracking-wide">
            Multi-Warehouse Network Operations
          </span>
          <h1 className="text-2xl font-black mt-2">Warehouse & Inventory Management</h1>
          <p className="text-sm text-purple-200 mt-1">
            Configure warehouse nodes, monitor real-time stock levels, and set stock reorder thresholds
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400">Loading multi-warehouse inventory matrix...</div>
      ) : (
        <WarehouseStockMatrix warehouses={data?.warehouses || []} inventory={data?.inventory || []} />
      )}
    </div>
  );
};
