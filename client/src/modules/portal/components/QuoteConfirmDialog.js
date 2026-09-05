import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
export const QuoteConfirmDialog = ({ isOpen, onClose, onConfirm, quotationNumber, totalAmount, currency, isSubmitting, }) => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [customerNotes, setCustomerNotes] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!termsAccepted) {
            setError('You must accept the terms and conditions to confirm this quotation.');
            return;
        }
        setError(null);
        try {
            await onConfirm({ termsAccepted, customerNotes: customerNotes.trim() || undefined });
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 2000);
        }
        catch (err) {
            setError(err.message || 'Failed to confirm quotation');
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs", children: _jsx("div", { className: "bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200", children: isSuccess ? (_jsxs("div", { className: "py-8 text-center animate-in zoom-in-90 duration-300", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-100", children: _jsx(CheckCircle2, { className: "w-10 h-10" }) }), _jsx("h3", { className: "text-xl font-extrabold text-slate-900 mb-1", children: "Quotation Confirmed!" }), _jsxs("p", { className: "text-xs text-slate-600 max-w-xs mx-auto", children: ["Thank you! Quotation ", _jsx("span", { className: "font-bold text-slate-900", children: quotationNumber }), " has been officially confirmed and binding order processing has commenced."] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between pb-4 border-b border-slate-100 mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center", children: _jsx(ShieldCheck, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-base font-bold text-slate-900", children: "Confirm Quotation" }), _jsx("p", { className: "text-xs text-slate-500", children: "Official Acceptance & Order Authorization" })] })] }), _jsx("button", { onClick: onClose, className: "p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [error && (_jsx("div", { className: "p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium", children: error })), _jsxs("div", { className: "bg-slate-50 border border-slate-200 rounded-xl p-4 text-center", children: [_jsx("div", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "Quotation Reference" }), _jsx("div", { className: "text-sm font-extrabold text-slate-900 mt-0.5", children: quotationNumber }), _jsxs("div", { className: "text-xl font-black text-emerald-600 mt-1", children: ["$", totalAmount.toLocaleString(), " ", _jsx("span", { className: "text-xs font-semibold text-slate-500", children: currency })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-700 mb-1", children: "PO Number or Purchase Notes (Optional)" }), _jsx("input", { type: "text", value: customerNotes, onChange: (e) => setCustomerNotes(e.target.value), placeholder: "e.g. PO-884920 / Billing contact: finance@techcorp.com", className: "w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" })] }), _jsxs("div", { className: "flex items-start space-x-2 pt-2", children: [_jsx("input", { type: "checkbox", id: "accept-terms", checked: termsAccepted, onChange: (e) => setTermsAccepted(e.target.checked), className: "mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300" }), _jsx("label", { htmlFor: "accept-terms", className: "text-xs text-slate-600 cursor-pointer select-none leading-tight", children: "I confirm that I am authorized to accept this quotation on behalf of my organization and agree to the specified commercial terms." })] }), _jsxs("div", { className: "flex items-center justify-end space-x-3 pt-4 border-t border-slate-100", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting || !termsAccepted, className: "flex items-center space-x-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-200 disabled:opacity-50 transition-all", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), _jsx("span", { children: "Confirming Order..." })] })) : (_jsxs(_Fragment, { children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Confirm Quotation Now" })] })) })] })] })] })) }) }));
};
//# sourceMappingURL=QuoteConfirmDialog.js.map