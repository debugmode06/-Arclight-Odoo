import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Clock, MessageSquare, Send, Award } from 'lucide-react';
export const NegotiationTimeline = ({ events, currentStatus }) => {
    const getEventIcon = (eventTitle) => {
        if (eventTitle.includes('Confirmed') || eventTitle.includes('Accepted')) {
            return _jsx(Award, { className: "w-4 h-4 text-emerald-600" });
        }
        if (eventTitle.includes('Counter') || eventTitle.includes('Discount')) {
            return _jsx(Send, { className: "w-4 h-4 text-purple-600" });
        }
        if (eventTitle.includes('Comment') || eventTitle.includes('Request')) {
            return _jsx(MessageSquare, { className: "w-4 h-4 text-indigo-600" });
        }
        return _jsx(Clock, { className: "w-4 h-4 text-slate-500" });
    };
    const getActorBadge = (actor) => {
        switch (actor) {
            case 'CUSTOMER':
                return _jsx("span", { className: "px-2 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700 rounded", children: "Customer" });
            case 'SALES_REP':
                return _jsx("span", { className: "px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded", children: "Sales Team" });
            case 'MANAGER':
                return _jsx("span", { className: "px-2 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded", children: "Reviewer" });
            default:
                return _jsx("span", { className: "px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded", children: "System" });
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-6 pb-4 border-b border-slate-100", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-base font-bold text-slate-900 flex items-center gap-2", children: [_jsx("span", { children: "Negotiation & Quote Timeline" }), _jsx("span", { className: "px-2.5 py-0.5 text-xs font-semibold bg-purple-50 text-purple-700 rounded-full border border-purple-200", children: "Customer Journey" })] }), _jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Transparent event history of proposal creation, comments, change requests, and confirmation." })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "Current Status" }), _jsx("div", { className: "text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 inline-block mt-0.5", children: currentStatus })] })] }), _jsxs("div", { className: "grid grid-cols-4 gap-2 mb-8 relative", children: [_jsxs("div", { className: `p-2.5 rounded-xl border text-center transition-all ${events.length >= 1 ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`, children: [_jsx("div", { className: "text-xs font-bold mb-0.5", children: "1. Proposal Shared" }), _jsx("div", { className: "text-[10px] opacity-75", children: "Quotation Issued" })] }), _jsxs("div", { className: `p-2.5 rounded-xl border text-center transition-all ${events.some(e => e.event.includes('Comment') || e.event.includes('Request'))
                            ? 'bg-purple-50 border-purple-200 text-purple-800'
                            : 'bg-slate-50 border-slate-200 text-slate-400'}`, children: [_jsx("div", { className: "text-xs font-bold mb-0.5", children: "2. Collaboration" }), _jsx("div", { className: "text-[10px] opacity-75", children: "Comments & Requests" })] }), _jsxs("div", { className: `p-2.5 rounded-xl border text-center transition-all ${events.some(e => e.event.includes('Counter') || e.event.includes('Discount'))
                            ? 'bg-purple-50 border-purple-200 text-purple-800'
                            : 'bg-slate-50 border-slate-200 text-slate-400'}`, children: [_jsx("div", { className: "text-xs font-bold mb-0.5", children: "3. Counter Proposal" }), _jsx("div", { className: "text-[10px] opacity-75", children: "Commercial Alignment" })] }), _jsxs("div", { className: `p-2.5 rounded-xl border text-center transition-all ${currentStatus === 'CONFIRMED'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-400'}`, children: [_jsx("div", { className: "text-xs font-bold mb-0.5", children: "4. Confirmation" }), _jsx("div", { className: "text-[10px] opacity-75", children: "Final Order Binding" })] })] }), _jsx("div", { className: "relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200", children: events.map((evt, idx) => (_jsxs("div", { className: "relative flex items-start space-x-3 group", children: [_jsx("div", { className: "absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-purple-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform", children: _jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-purple-600" }) }), _jsxs("div", { className: "flex-1 bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "p-1 rounded bg-white shadow-xs border border-slate-100", children: getEventIcon(evt.event) }), _jsx("span", { className: "text-xs font-bold text-slate-900", children: evt.event }), getActorBadge(evt.actor)] }), _jsx("time", { className: "text-[11px] font-medium text-slate-400", children: new Date(evt.timestamp).toLocaleString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }) })] }), _jsx("p", { className: "text-xs text-slate-600 leading-relaxed font-normal", children: evt.description })] })] }, evt.id || idx))) })] }));
};
//# sourceMappingURL=NegotiationTimeline.js.map