import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { X, FileEdit, Send, Loader2 } from 'lucide-react';
export const ChangeRequestModal = ({ isOpen, onClose, onSubmit, lines, isSubmitting, }) => {
    const [selectedLineId, setSelectedLineId] = useState('');
    const [requestType, setRequestType] = useState('QUANTITY');
    const [description, setDescription] = useState('');
    const [requestedValue, setRequestedValue] = useState('');
    const [error, setError] = useState(null);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            setError('Please provide a description of your change request.');
            return;
        }
        setError(null);
        try {
            await onSubmit({
                lineId: selectedLineId || undefined,
                type: requestType,
                description: description.trim(),
                requestedValue: requestedValue.trim() || undefined,
            });
            setDescription('');
            setRequestedValue('');
            onClose();
        }
        catch (err) {
            setError(err.message || 'Failed to submit change request');
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs", children: _jsxs("div", { className: "bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200", children: [_jsxs("div", { className: "flex items-center justify-between pb-4 border-b border-slate-100 mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center", children: _jsx(FileEdit, { className: "w-4 h-4" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-base font-bold text-slate-900", children: "Request Quotation Change" }), _jsx("p", { className: "text-xs text-slate-500", children: "Propose Modifications to Quantities, Deliverables, or Terms" })] })] }), _jsx("button", { onClick: onClose, className: "p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [error && (_jsx("div", { className: "p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium", children: error })), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-700 mb-1", children: "Request Type" }), _jsxs("select", { value: requestType, onChange: (e) => setRequestType(e.target.value), className: "w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium", children: [_jsx("option", { value: "QUANTITY", children: "Quantity Change Request" }), _jsx("option", { value: "DELIVERY", children: "Delivery Schedule / Phasing Request" }), _jsx("option", { value: "COMMERCIAL", children: "Commercial Terms / Payment Schedule" }), _jsx("option", { value: "PRODUCT", children: "Product Specification / Addon Request" }), _jsx("option", { value: "OTHER", children: "Other Specific Request" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-700 mb-1", children: "Target Product Line (Optional)" }), _jsxs("select", { value: selectedLineId, onChange: (e) => setSelectedLineId(e.target.value), className: "w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500", children: [_jsx("option", { value: "", children: "Applies to Entire Quotation" }), lines.map((item) => (_jsxs("option", { value: item.lineId, children: [item.productName, " (Current Qty: ", item.quantity, ")"] }, item.lineId)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-700 mb-1", children: "Requested Target Value (Optional)" }), _jsx("input", { type: "text", value: requestedValue, onChange: (e) => setRequestedValue(e.target.value), placeholder: "e.g. 75 seats (or Phased Oct 1st rollout)", className: "w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-700 mb-1", children: "Detailed Description & Reason" }), _jsx("textarea", { rows: 3, value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Describe the change you are requesting and the business motivation...", className: "w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" })] }), _jsxs("div", { className: "flex items-center justify-end space-x-3 pt-4 border-t border-slate-100", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-xl shadow-xs shadow-purple-200 disabled:opacity-50 transition-all", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), _jsx("span", { children: "Submitting..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Send, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Submit Change Request" })] })) })] })] })] }) }));
};
//# sourceMappingURL=ChangeRequestModal.js.map