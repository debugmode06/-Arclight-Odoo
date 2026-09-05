import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { useCustomerAuth } from '../hooks/useCustomerPortal';
export const CustomerLoginPage = () => {
    const [email, setEmail] = useState('customer@techcorp.com');
    const [password, setPassword] = useState('password123');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useCustomerAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please provide both email address and password');
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            await login({ email, password });
            navigate('/customer/quotes');
        }
        catch (err) {
            setError(err.message || 'Invalid email or password. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleQuickFill = (demoEmail) => {
        setEmail(demoEmail);
        setPassword('password123');
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans", children: [_jsx("div", { className: "absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" }), _jsx("div", { className: "absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" }), _jsxs("div", { className: "max-w-md w-full relative z-10", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-purple-900/50 mb-3", children: _jsx(ShieldCheck, { className: "w-8 h-8" }) }), _jsx("h1", { className: "text-2xl font-black text-white tracking-tight", children: "DealFlow360" }), _jsx("p", { className: "text-xs text-purple-300 font-medium mt-1", children: "Customer Commercial Portal" })] }), _jsxs("div", { className: "bg-white rounded-3xl p-8 shadow-2xl border border-slate-100", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-lg font-bold text-slate-900", children: "Secure Customer Sign In" }), _jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Access your corporate quotations, review commercial proposals, and submit counter offers." })] }), error && (_jsx("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-700 mb-1", children: "Corporate Email" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "w-4 h-4 text-slate-400 absolute left-3 top-3" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "e.g. customer@techcorp.com", className: "w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-700 mb-1", children: "Portal Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "w-4 h-4 text-slate-400 absolute left-3 top-3" }), _jsx("input", { type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-3 text-slate-400 hover:text-slate-600", children: showPassword ? _jsx(EyeOff, { className: "w-4 h-4" }) : _jsx(Eye, { className: "w-4 h-4" }) })] })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-2", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), _jsx("span", { children: "Authenticating..." })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { children: "Sign In to Portal" }), _jsx(ArrowRight, { className: "w-4 h-4" })] })) })] }), _jsxs("div", { className: "mt-8 pt-6 border-t border-slate-100", children: [_jsxs("div", { className: "flex items-center space-x-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2", children: [_jsx(KeyRound, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Demo Customer Login Accounts" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("button", { type: "button", onClick: () => handleQuickFill('customer@techcorp.com'), className: "p-2 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 rounded-xl text-left transition-colors", children: [_jsx("div", { className: "text-[11px] font-bold text-slate-800", children: "TechCorp Ltd" }), _jsx("div", { className: "text-[10px] text-slate-500", children: "customer@techcorp.com" })] }), _jsxs("button", { type: "button", onClick: () => handleQuickFill('buyer@acme.com'), className: "p-2 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 rounded-xl text-left transition-colors", children: [_jsx("div", { className: "text-[11px] font-bold text-slate-800", children: "Acme Industries" }), _jsx("div", { className: "text-[10px] text-slate-500", children: "buyer@acme.com" })] })] })] })] })] })] }));
};
//# sourceMappingURL=CustomerLoginPage.js.map