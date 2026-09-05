import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { LogIn, Shield, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('alex.rep@dealflow360.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    { role: 'Sales Rep', email: 'alex.rep@dealflow360.com', desc: 'Create quotes & live governance' },
    { role: 'Sales Manager', email: 'sarah.manager@dealflow360.com', desc: 'Approve & review deal risks' },
    { role: 'Finance / Ops', email: 'marcus.finance@dealflow360.com', desc: 'Level 2 approvals & billing' },
    { role: 'Admin', email: 'admin@dealflow360.com', desc: 'Configure governance & catalog' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const auth = await AuthService.login(email, password);
      if (auth.user.role === 'ADMIN') {
        navigate('/app/admin');
      } else if (auth.user.role === 'SALES_MANAGER' || auth.user.role === 'FINANCE') {
        navigate('/app/approvals');
      } else {
        navigate('/app/quotations');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#6344e7] text-white font-black text-xl shadow-lg shadow-purple-200 mb-3">
          D
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">DealFlow360</h2>
        <p className="mt-1 text-sm text-slate-500">Intelligent, Self-Governing Sales Operations Platform</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/90 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#6344e7] transition-all"
                placeholder="name@dealflow360.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <span className="text-[11px] text-slate-400">Default: password123</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#6344e7] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#6344e7] hover:bg-[#5233d4] text-white font-semibold rounded-xl text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quick Demo Login</span>
              <span className="text-[11px] text-purple-600 font-medium">Click to select role</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoAccounts.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleSelectDemo(demo.email)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    email === demo.email
                      ? 'border-purple-300 bg-purple-50/50 ring-1 ring-[#6344e7]'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-slate-800">{demo.role}</span>
                    {email === demo.email && <CheckCircle2 className="w-3.5 h-3.5 text-[#6344e7]" />}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{demo.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Portal Link */}
          <div className="mt-6 text-center pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link to="/signup" className="text-slate-600 hover:text-slate-900 font-medium">
              Create Sales Account
            </Link>
            <Link to="/customer/login" className="text-[#6344e7] hover:underline font-semibold flex items-center gap-1">
              Customer Portal Login <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
