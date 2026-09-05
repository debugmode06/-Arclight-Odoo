import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { X, TrendingDown, Send, Loader2, Info } from 'lucide-react';
export const CounterOfferModal = ({ isOpen, onClose, onSubmit, currentSubtotal, currentDiscountAmount, isSubmitting, }) => {
    const currentDiscountPercent = currentSubtotal > 0
        ? Math.round((currentDiscountAmount / currentSubtotal) * 100)
        : 0;
    const [proposedDiscount, setProposedDiscount] = useState(currentDiscountPercent + 4);
    const [reason, setReason] = useState('');
    const [error, setError] = useState(null);
    if (!isOpen)
        return null;
    const newDiscountAmount = (currentSubtotal * proposedDiscount) / 100;
    const newEstimatedSubtotal = currentSubtotal - newDiscountAmount;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (proposedDiscount < 0 || proposedDiscount > 100) {
            setError('Proposed discount percentage must be between 0% and 100%.');
            return;
        }
        if (!reason.trim()) {
            setError('Please provide a business reason for your counter discount offer.');
            return;
        }
        setError(null);
        try {
            await onSubmit({
                proposedDiscount,
                reason: reason.trim(),
            });
            onClose();
        }
        catch (err) {
            setError(err.message || 'Failed to submit counter offer');
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs", children: _jsxs("div", { className: "bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200", children: [_jsxs("div", { className: "flex items-center justify-between pb-4 border-b border-slate-100 mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center", children: _jsx(TrendingDown, { className: "w-4 h-4" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-base font-bold text-slate-900", children: "Propose Counter-Discount" }), _jsx("p", { className: "text-xs text-slate-500", children: "Submit a Target Discount Proposal for Commercial Alignment" })] })] }), _jsx("button", { onClick: onClose, className: "p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [error && (_jsx("div", { className: "p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium", children: error })), _jsxs("div", { className: "bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[10px] font-bold text-slate-400 uppercase", children: "Current Discount" }), _jsxs("div", { className: "text-base font-extrabold text-slate-700 mt-0.5", children: [currentDiscountPercent, "%"] }), _jsxs("div", { className: "text-[11px] text-slate-500", children: ["$", currentDiscountAmount.toLocaleString()] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-[10px] font-bold text-purple-600 uppercase", children: "Proposed Target Discount" }), _jsxs("div", { className: "text-base font-extrabold text-purple-700 mt-0.5", children: [proposedDiscount, "%"] }), _jsxs("div", { className: "text-[11px] text-purple-600 font-medium", children: ["$", newDiscountAmount.toLocaleString(), " savings"] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-700 mb-1", children: "Proposed Discount (%)" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", min: "0", max: "100", step: "1", value: proposedDiscount, onChange: (e) => setProposedDiscount(Number(e.target.value)), className: "w-full text-sm font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" }), _jsx("span", { className: "absolute right-3 top-2.5 text-xs font-bold text-slate-400", children: "%" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-700 mb-1", children: "Commercial Justification / Reason" }), _jsx("textarea", { rows: 3, value: reason, onChange: (e) => setReason(e.target.value), placeholder: "e.g. We are ready to sign before quarter-end and commit to annual upfront payment if discount is set to 14%.", className: "w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" })] }), _jsxs("div", { className: "p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2 text-amber-800 text-[11px]", children: [_jsx(Info, { className: "w-4 h-4 text-amber-600 shrink-0 mt-0.5" }), _jsx("span", { children: "Counter discount proposals enter the structured approval workflow. The sales operations team will review your proposal and respond promptly." })] }), _jsxs("div", { className: "flex items-center justify-end space-x-3 pt-4 border-t border-slate-100", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-xl shadow-xs shadow-purple-200 disabled:opacity-50 transition-all", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), _jsx("span", { children: "Submitting Offer..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Send, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Submit Counter Proposal" })] })) })] })] })] }) }));
};
//# sourceMappingURL=CounterOfferModal.js.map