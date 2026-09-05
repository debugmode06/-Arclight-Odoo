import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useInventorySummary } from '../hooks/useFulfillment';
import { WarehouseStockMatrix } from '../components/WarehouseStockMatrix';
export const InventoryPage = () => {
    const { data, isLoading } = useInventorySummary();
    return (_jsxs("div", { className: "p-8 max-w-7xl mx-auto space-y-6", children: [_jsx("div", { className: "bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-2xl text-white shadow-xl flex items-center justify-between", children: _jsxs("div", { children: [_jsx("span", { className: "px-3 py-1 bg-purple-500/20 text-purple-200 border border-purple-500/30 rounded-full text-xs font-semibold uppercase tracking-wide", children: "Multi-Warehouse Network Operations" }), _jsx("h1", { className: "text-2xl font-black mt-2", children: "Warehouse & Inventory Management" }), _jsx("p", { className: "text-sm text-purple-200 mt-1", children: "Configure warehouse nodes, monitor real-time stock levels, and set stock reorder thresholds" })] }) }), isLoading ? (_jsx("div", { className: "p-12 text-center text-slate-400", children: "Loading multi-warehouse inventory matrix..." })) : (_jsx(WarehouseStockMatrix, { warehouses: data?.warehouses || [], inventory: data?.inventory || [] }))] }));
};
//# sourceMappingURL=InventoryPage.js.map