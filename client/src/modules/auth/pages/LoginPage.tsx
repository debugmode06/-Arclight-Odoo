import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/services/api.client';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('alex.rep@dealflow360.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiClient.post<any>('/auth/login', { email, password });
      const { accessToken, refreshToken } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      navigate('/app/fulfillment', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0525 0%, #1e0a3c 40%, #2d1060 70%, #1a0535 100%)',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      }}
    >
      {/* Animated background blobs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6d28d9 0%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <div
        className="absolute top-[30%] right-[15%] w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)', filter: 'blur(50px)' }}
      />

      <div className="relative w-full max-w-md mx-4">
        {/* Glass card */}
        <div
          className="rounded-3xl p-8 shadow-2xl border"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(24px)',
            borderColor: 'rgba(167, 139, 250, 0.15)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(167,139,250,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Logo + Brand */}
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', boxShadow: '0 8px 24px rgba(124,58,237,0.5)' }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">DealFlow<span style={{ color: '#a78bfa' }}>360</span></h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(167,139,250,0.7)' }}>Enterprise Sales Intelligence Platform</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-black text-white">Welcome back</h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Sign in to your workspace</p>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
            >
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Work Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(167,139,250,0.6)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@dealflow360.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium text-white placeholder-white/25 focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(167,139,250,0.2)',
                    boxShadow: 'none',
                  }}
                  onFocus={e => { e.target.style.border = '1px solid rgba(167,139,250,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(167,139,250,0.2)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(167,139,250,0.6)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-2.5 rounded-xl text-sm font-medium text-white placeholder-white/25 focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(167,139,250,0.2)',
                    boxShadow: 'none',
                  }}
                  onFocus={e => { e.target.style.border = '1px solid rgba(167,139,250,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(167,139,250,0.2)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(167,139,250,0.5)' }}
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-black text-white transition-all mt-2 relative overflow-hidden"
              style={{
                background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(124,58,237,0.4)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In to DealFlow360
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>QUICK ACCESS</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Demo accounts */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Sales Rep', email: 'alex.rep@dealflow360.com', icon: '👤' },
              { label: 'Sales Manager', email: 'sarah.manager@dealflow360.com', icon: '👔' },
              { label: 'Finance', email: 'marcus.finance@dealflow360.com', icon: '💼' },
              { label: 'Admin', email: 'admin@dealflow360.com', icon: '🔑' },
            ].map(acc => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleDemoLogin(acc.email)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all text-xs font-bold"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(167,139,250,0.12)',
                  color: 'rgba(255,255,255,0.6)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.15)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(167,139,250,0.35)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(167,139,250,0.12)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
                }}
              >
                <span className="text-sm">{acc.icon}</span>
                <span className="truncate">{acc.label}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-[10px] mt-5" style={{ color: 'rgba(255,255,255,0.2)' }}>
            All demo accounts use password: <span style={{ color: 'rgba(167,139,250,0.6)', fontFamily: 'monospace' }}>password123</span>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] mt-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © 2026 DealFlow360 · Enterprise Sales Intelligence
        </p>
      </div>
    </div>
  );
};
