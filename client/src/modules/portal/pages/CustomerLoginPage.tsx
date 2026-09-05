import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PortalService } from '../services/portal.service';
import { LogIn, Building, ArrowRight, ShieldCheck } from 'lucide-react';

export const CustomerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('procurement@acmeglobal.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoCustomers = [
    { name: 'Acme Global Dynamics', email: 'procurement@acmeglobal.com', tier: 'PLATINUM' },
    { name: 'NovaTech Systems Inc.', email: 'orders@novatech.io', tier: 'GOLD' },
    { name: 'Vertex BioHealth Labs', email: 'it@vertexbiohealth.org', tier: 'SILVER' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await PortalService.customerLogin(email);
      navigate('/customer/quotes');
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err?.message || 'Customer authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#6344e7] text-white font-black text-xl shadow-lg shadow-purple-200 mb-3">
          D
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Customer Portal</h2>
        <p className="mt-1 text-sm text-slate-500">Secure access to commercial proposals & negotiations</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/90 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#6344e7]"
                placeholder="procurement@company.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#6344e7] hover:bg-[#5233d4] text-white font-semibold rounded-xl text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Verifying Account...' : 'Enter Customer Portal'}</span>
            </button>
          </form>

          {/* Demo Customer Picker */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Demo Customer
            </span>
            <div className="space-y-2">
              {demoCustomers.map((cust) => (
                <button
                  key={cust.email}
                  type="button"
                  onClick={() => setEmail(cust.email)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    email === cust.email
                      ? 'border-purple-300 bg-purple-50 text-[#6344e7] ring-1 ring-[#6344e7]'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800">{cust.name}</div>
                    <div className="text-[11px] text-slate-500">{cust.email}</div>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    {cust.tier}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center pt-4 border-t border-slate-100 text-xs">
            <Link to="/login" className="text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center gap-1">
              Internal RevOps Workspace Login <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
