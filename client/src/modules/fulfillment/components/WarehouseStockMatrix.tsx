import React, { useState } from 'react';
import { InventoryItem, Warehouse } from '../types/fulfillment.types';
import { useUpdateStock } from '../hooks/useFulfillment';

interface Props {
  warehouses: Warehouse[];
  inventory: InventoryItem[];
}

export const WarehouseStockMatrix: React.FC<Props> = ({ warehouses, inventory }) => {
  const updateStockMutation = useUpdateStock();
  const [editingItem, setEditingItem] = useState<{
    productId: string;
    warehouseId: string;
    productName: string;
    currentAvailable: number;
  } | null>(null);

  const [newStock, setNewStock] = useState<number>(0);

  const handleOpenEdit = (item: InventoryItem, whId: string) => {
    const prod = typeof item.productId === 'object' ? item.productId : { _id: item.productId, name: 'Product', sku: '', basePrice: 0, unit: 'unit' };
    setEditingItem({
      productId: prod._id,
      warehouseId: whId,
      productName: prod.name,
      currentAvailable: item.quantityAvailable,
    });
    setNewStock(item.quantityAvailable);
  };

  const handleSaveStock = () => {
    if (!editingItem) return;
    updateStockMutation.mutate(
      {
        productId: editingItem.productId,
        warehouseId: editingItem.warehouseId,
        quantityAvailable: newStock,
      },
      {
        onSuccess: () => {
          setEditingItem(null);
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Multi-Warehouse Inventory Matrix</h3>
          <p className="text-sm text-slate-500">Real-time stock availability, reserved inventory & reorder thresholds</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Warehouses: {warehouses.length}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <th className="p-3">Product / SKU</th>
              <th className="p-3">Warehouse</th>
              <th className="p-3 text-right">Available Stock</th>
              <th className="p-3 text-right">Reserved Stock</th>
              <th className="p-3 text-right">Reorder Point</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-600">
            {inventory.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  No inventory records found across warehouses.
                </td>
              </tr>
            ) : (
              inventory.map((item) => {
                const prod = typeof item.productId === 'object' ? item.productId : { _id: item.productId, name: 'Product', sku: 'SKU', basePrice: 0, unit: 'unit' };
                const wh = typeof item.warehouseId === 'object' ? item.warehouseId : { _id: item.warehouseId, name: 'Warehouse', code: 'WH' };
                const isLowStock = item.quantityAvailable <= item.reorderPoint;

                return (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-medium text-slate-900">
                      <div>{prod.name}</div>
                      <div className="text-xs text-slate-400 font-mono">SKU: {prod.sku}</div>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                        {wh.name} ({wh.code})
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {item.quantityAvailable} {prod.unit || 'units'}
                    </td>
                    <td className="p-3 text-right text-slate-500">
                      {item.quantityReserved} {prod.unit || 'units'}
                    </td>
                    <td className="p-3 text-right text-slate-500">{item.reorderPoint}</td>
                    <td className="p-3 text-center">
                      {isLowStock ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleOpenEdit(item, wh._id)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Stock Adjustment Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h4 className="text-lg font-bold text-slate-900 mb-1">Adjust Inventory Level</h4>
            <p className="text-xs text-slate-500 mb-4">{editingItem.productName}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Available Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStock}
                disabled={updateStockMutation.isPending}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                {updateStockMutation.isPending ? 'Saving...' : 'Update Stock Level'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
