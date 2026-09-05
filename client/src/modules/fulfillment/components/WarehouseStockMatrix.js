import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useUpdateStock } from '../hooks/useFulfillment';
export const WarehouseStockMatrix = ({ warehouses, inventory }) => {
    const updateStockMutation = useUpdateStock();
    const [editingItem, setEditingItem] = useState(null);
    const [newStock, setNewStock] = useState(0);
    const handleOpenEdit = (item, whId) => {
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
        if (!editingItem)
            return;
        updateStockMutation.mutate({
            productId: editingItem.productId,
            warehouseId: editingItem.warehouseId,
            quantityAvailable: newStock,
        }, {
            onSuccess: () => {
                setEditingItem(null);
            },
        });
    };
    return (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-slate-900", children: "Multi-Warehouse Inventory Matrix" }), _jsx("p", { className: "text-sm text-slate-500", children: "Real-time stock availability, reserved inventory & reorder thresholds" })] }), _jsx("div", { className: "flex gap-2", children: _jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500" }), " Active Warehouses: ", warehouses.length] }) })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-sm border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold", children: [_jsx("th", { className: "p-3", children: "Product / SKU" }), _jsx("th", { className: "p-3", children: "Warehouse" }), _jsx("th", { className: "p-3 text-right", children: "Available Stock" }), _jsx("th", { className: "p-3 text-right", children: "Reserved Stock" }), _jsx("th", { className: "p-3 text-right", children: "Reorder Point" }), _jsx("th", { className: "p-3 text-center", children: "Status" }), _jsx("th", { className: "p-3 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-200 text-slate-600", children: inventory.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "p-6 text-center text-slate-400", children: "No inventory records found across warehouses." }) })) : (inventory.map((item) => {
                                const prod = typeof item.productId === 'object' ? item.productId : { _id: item.productId, name: 'Product', sku: 'SKU', basePrice: 0, unit: 'unit' };
                                const wh = typeof item.warehouseId === 'object' ? item.warehouseId : { _id: item.warehouseId, name: 'Warehouse', code: 'WH' };
                                const isLowStock = item.quantityAvailable <= item.reorderPoint;
                                return (_jsxs("tr", { className: "hover:bg-slate-50 transition-colors", children: [_jsxs("td", { className: "p-3 font-medium text-slate-900", children: [_jsx("div", { children: prod.name }), _jsxs("div", { className: "text-xs text-slate-400 font-mono", children: ["SKU: ", prod.sku] })] }), _jsx("td", { className: "p-3", children: _jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800", children: [wh.name, " (", wh.code, ")"] }) }), _jsxs("td", { className: "p-3 text-right font-bold text-slate-900", children: [item.quantityAvailable, " ", prod.unit || 'units'] }), _jsxs("td", { className: "p-3 text-right text-slate-500", children: [item.quantityReserved, " ", prod.unit || 'units'] }), _jsx("td", { className: "p-3 text-right text-slate-500", children: item.reorderPoint }), _jsx("td", { className: "p-3 text-center", children: isLowStock ? (_jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800", children: "Low Stock" })) : (_jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800", children: "In Stock" })) }), _jsx("td", { className: "p-3 text-right", children: _jsx("button", { onClick: () => handleOpenEdit(item, wh._id), className: "px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded transition-colors", children: "Adjust Stock" }) })] }, item._id));
                            })) })] }) }), editingItem && (_jsx("div", { className: "fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200", children: [_jsx("h4", { className: "text-lg font-bold text-slate-900 mb-1", children: "Adjust Inventory Level" }), _jsx("p", { className: "text-xs text-slate-500 mb-4", children: editingItem.productName }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-700 mb-1", children: "New Available Quantity" }), _jsx("input", { type: "number", min: "0", value: newStock, onChange: (e) => setNewStock(parseInt(e.target.value) || 0), className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" })] }) }), _jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [_jsx("button", { onClick: () => setEditingItem(null), className: "px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg", children: "Cancel" }), _jsx("button", { onClick: handleSaveStock, disabled: updateStockMutation.isPending, className: "px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm", children: updateStockMutation.isPending ? 'Saving...' : 'Update Stock Level' })] })] }) }))] }));
};
//# sourceMappingURL=WarehouseStockMatrix.js.map