import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useShipFulfillment } from '../hooks/useFulfillment';
export const ShipmentTracker = ({ fulfillments }) => {
    const shipMutation = useShipFulfillment();
    const handleMarkShipped = (id) => {
        shipMutation.mutate(id);
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'ALLOCATED':
                return _jsx("span", { className: "px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200", children: "Allocated" });
            case 'PARTIALLY_FULFILLED':
                return _jsx("span", { className: "px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200", children: "Partially Fulfilled" });
            case 'SHIPPED':
                return _jsx("span", { className: "px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200", children: "Shipped" });
            case 'DELIVERED':
                return _jsx("span", { className: "px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200", children: "Delivered" });
            case 'BACKORDERED':
                return _jsx("span", { className: "px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200", children: "Backordered" });
            default:
                return _jsx("span", { className: "px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700", children: "Pending" });
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6", children: [_jsx("div", { className: "flex items-center justify-between mb-6", children: _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-slate-900", children: "Active Fulfillment Orders" }), _jsx("p", { className: "text-sm text-slate-500", children: "Track multi-warehouse shipments, tracking numbers & dispatch status" })] }) }), _jsx("div", { className: "space-y-4", children: fulfillments.length === 0 ? (_jsx("div", { className: "p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg", children: "No active fulfillment records found." })) : (fulfillments.map((record) => {
                    const quotationNum = typeof record.quotationId === 'object' ? record.quotationId.quotationNumber : record.quotationId;
                    const customerName = typeof record.customerId === 'object' ? record.customerId.name : 'Customer';
                    return (_jsxs("div", { className: "border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3 mb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "font-bold text-slate-900 text-base", children: record.fulfillmentNumber }), getStatusBadge(record.status), record.isManualOverride && (_jsx("span", { className: "px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded", children: "Manual Override" }))] }), _jsxs("div", { className: "text-xs text-slate-500 mt-1", children: ["Quotation: ", _jsx("strong", { className: "text-slate-700", children: quotationNum || 'N/A' }), " | Customer: ", _jsx("strong", { className: "text-slate-700", children: customerName })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-sm font-bold text-slate-900", children: ["$", record.totalShippingCost.toFixed(2)] }), _jsxs("div", { className: "text-xs text-slate-400", children: [record.totalShipments, " Shipment(s)"] })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 mb-4", children: record.allocations.map((alloc, idx) => {
                                    const whName = typeof alloc.warehouseId === 'object' ? alloc.warehouseId.name : 'Warehouse';
                                    const prodName = typeof alloc.productId === 'object' ? alloc.productId.name : 'Product';
                                    return (_jsxs("div", { className: "p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs", children: [_jsxs("div", { className: "flex justify-between font-semibold text-slate-800 mb-1", children: [_jsx("span", { children: prodName }), _jsxs("span", { className: "text-blue-600", children: [alloc.quantityAllocated, " units"] })] }), _jsxs("div", { className: "text-slate-500 flex justify-between", children: [_jsxs("span", { children: ["Warehouse: ", whName] }), alloc.trackingNumber && _jsx("span", { className: "font-mono text-purple-700", children: alloc.trackingNumber })] })] }, idx));
                                }) }), record.status === 'ALLOCATED' && (_jsx("div", { className: "flex justify-end pt-2 border-t border-slate-100", children: _jsx("button", { onClick: () => handleMarkShipped(record._id), disabled: shipMutation.isPending, className: "px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm", children: shipMutation.isPending ? 'Processing...' : 'Mark All Shipments Shipped' }) }))] }, record._id));
                })) })] }));
};
//# sourceMappingURL=ShipmentTracker.js.map