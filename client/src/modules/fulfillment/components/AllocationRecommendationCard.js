import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useConfirmAllocation } from '../hooks/useFulfillment';
export const AllocationRecommendationCard = ({ quotationId, customerId, recommendation, onSuccess, }) => {
    const confirmAllocationMutation = useConfirmAllocation();
    const [isOverrideMode, setIsOverrideMode] = useState(false);
    const [overrideNotes, setOverrideNotes] = useState('');
    const handleConfirm = () => {
        confirmAllocationMutation.mutate({
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
        }, {
            onSuccess: () => {
                if (onSuccess)
                    onSuccess();
            },
        });
    };
    return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-blue-600", children: "Smart Fulfillment Engine" }), _jsx("h3", { className: "text-xl font-bold text-slate-900 mt-0.5", children: "Warehouse Split Recommendation" })] }), _jsx("div", { className: "flex items-center gap-2", children: recommendation.isSplitRequired ? (_jsxs("span", { className: "px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold", children: ["Multi-Warehouse Split Needed (", recommendation.totalShipments, " Warehouses)"] })) : (_jsx("span", { className: "px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold", children: "Single Warehouse Fulfillment (1 Shipment)" })) })] }), _jsxs("div", { className: "space-y-3 mb-6", children: [recommendation.allocations.map((alloc, idx) => (_jsxs("div", { className: "flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs", children: alloc.warehouseCode || 'WH' }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-slate-900 text-sm", children: alloc.warehouseName }), _jsxs("div", { className: "text-xs text-slate-500", children: ["Allocation: ", _jsxs("strong", { className: "text-slate-800", children: [alloc.quantityAllocated, " units"] })] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-sm font-bold text-slate-900", children: ["$", alloc.shippingCost.toFixed(2)] }), _jsx("div", { className: "text-xs text-slate-400", children: "Est. Shipping Cost" })] })] }, idx))), recommendation.backorders.map((bo, idx) => (_jsxs("div", { className: "flex items-center justify-between p-3.5 bg-rose-50 border border-rose-200 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs", children: "BO" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-rose-900 text-sm", children: "Backordered Quantity" }), _jsx("div", { className: "text-xs text-rose-600", children: bo.reason })] })] }), _jsxs("div", { className: "text-right font-bold text-rose-700 text-sm", children: [bo.quantityBackordered, " units unfulfilled"] })] }, idx)))] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 p-4 bg-slate-900 text-white rounded-lg mb-6", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-slate-400", children: "Total Required Shipments" }), _jsxs("div", { className: "text-lg font-bold", children: [recommendation.totalShipments, " Shipment(s)"] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-xs text-slate-400", children: "Total Calculated Shipping Cost" }), _jsxs("div", { className: "text-lg font-bold text-emerald-400", children: ["$", recommendation.totalShippingCost.toFixed(2)] })] })] }), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-slate-200", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: isOverrideMode, onChange: (e) => setIsOverrideMode(e.target.checked), className: "w-4 h-4 text-blue-600 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-xs font-medium text-slate-700", children: "Manual Manager Override Mode" })] }), _jsx("button", { onClick: handleConfirm, disabled: confirmAllocationMutation.isPending, className: "px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors", children: confirmAllocationMutation.isPending ? 'Confirming...' : 'Confirm Stock Allocation & Lock Inventory' })] })] }));
};
//# sourceMappingURL=AllocationRecommendationCard.js.map