import { useState, FormEvent, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Users, CreditCard, Shield, Check, Eye, EyeOff, Lock, AlertTriangle, Info, Lightbulb } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export type UserRoleType = 'SALES_REP' | 'MANAGER' | 'FINANCE' | 'ADMIN';

interface RoleOption {
  id: UserRoleType;
  label: string;
  icon: ReactNode;
  description: string;
  defaultEmail: string;
  contextText: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'SALES_REP',
    label: 'Sales Rep',
    icon: <Briefcase className="w-5 h-5" />,
    description: 'Manage deals and quotations',
    defaultEmail: 'sales@dealflow360.com',
    contextText: 'Your workspace for managing active deals, creating quotations, and tracking customer interactions.',
  },
  {
    id: 'MANAGER',
    label: 'Manager',
    icon: <Users className="w-5 h-5" />,
    description: 'Monitor teams and approvals',
    defaultEmail: 'manager@dealflow360.com',
    contextText: 'Your workspace for monitoring team performance, approvals, and deal progress.',
  },
  {
    id: 'FINANCE',
    label: 'Finance',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Manage billing and revenue',
    defaultEmail: 'finance@dealflow360.com',
    contextText: 'Your workspace for managing billing, payments, and revenue operations.',
  },
  {
    id: 'ADMIN',
    label: 'Admin',
    icon: <Shield className="w-5 h-5" />,
    description: 'Manage users and configuration',
    defaultEmail: 'admin@dealflow360.com',
    contextText: 'Your workspace for managing users, configuration, and system access.',
  },
];

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRoleType>('SALES_REP');
  const [email, setEmail] = useState('sales@dealflow360.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app/dashboard';

  // Restore remembered email if available
  useEffect(() => {
    const savedEmail = localStorage.getItem('dealflow_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleRoleSelect = (role: RoleOption) => {
    setSelectedRole(role.id);
    setEmail(role.defaultEmail);
    setPassword('Password123!');
    setFormError(null);
    setInfoNotice(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setInfoNotice(null);
    clearError();

    if (!email || !email.includes('@')) {
      setFormError('Please enter a valid work email address.');
      return;
    }
    if (!password) {
      setFormError('Password is required.');
      return;
    }

    try {
      if (rememberMe) {
        localStorage.setItem('dealflow_remembered_email', email);
      } else {
        localStorage.removeItem('dealflow_remembered_email');
      }

      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to connect to DealFlow360. Please try again.';
      if (msg.includes('401') || msg.toLowerCase().includes('invalid')) {
        setFormError('Email or password is incorrect.');
      } else {
        setFormError(msg);
      }
    }
  };

  const activeRoleConfig = ROLE_OPTIONS.find((r) => r.id === selectedRole) || ROLE_OPTIONS[0];

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-12 relative overflow-hidden font-sans">
      {/* Background Decorative Faint Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary-50/60 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-24 right-10 w-80 h-80 rounded-full bg-primary-100/30 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 left-10 w-80 h-80 rounded-full bg-primary-100/30 blur-2xl pointer-events-none" />

      {/* Main Centered Authentication Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-surface-200/80 shadow-2xl shadow-primary-900/5 p-6 sm:p-10 lg:p-12 relative z-10 space-y-8 animate-in">
        {/* Top Centered Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white font-extrabold text-xl shadow-md shadow-primary-600/20 mb-1">
            DF
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              DealFlow<span className="text-primary-600">360</span>
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
              Enterprise Sales Operations Platform
            </p>
          </div>
        </div>

        {/* Login Section Header */}
        <div className="text-center space-y-1 pt-2 border-t border-surface-100">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Sign in to your workspace
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Enter your credentials and select your role to continue
          </p>
        </div>

        {/* ─── ROLE SELECTION (Horizontal 4-Column Grid) ───────────────────── */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 text-center">
            Select Role Context
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ROLE_OPTIONS.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-24 relative ${
                    isSelected
                      ? 'bg-primary-50/70 border-primary-500 shadow-md ring-2 ring-primary-500/15'
                      : 'bg-white border-surface-200 hover:border-primary-300 hover:bg-surface-50/80 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl border transition-colors ${
                      isSelected
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-surface-100 text-gray-600 border-surface-200'
                    }`}>
                      {role.icon}
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${isSelected ? 'text-primary-950' : 'text-gray-900'}`}>
                      {role.label}
                    </p>
                  </div>
                </button>

              );
            })}
          </div>

          {/* Dynamic Role Context Info Area */}
          <div className="p-3.5 rounded-2xl bg-primary-50/50 border border-primary-100 text-xs text-primary-900 font-medium flex items-center gap-2.5">
            <Lightbulb className="w-4 h-4 text-primary-600 shrink-0" />
            <span>{activeRoleConfig.contextText}</span>
          </div>
        </div>

        {/* Error Alert Banner */}
        {(formError || error) && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2.5 animate-in">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{formError || error}</span>
          </div>
        )}

        {/* Informational Alert Banner */}
        {infoNotice && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2.5 animate-in">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{infoNotice}</span>
          </div>
        )}

        {/* ─── LOGIN FORM ─────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Work Email Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5" htmlFor="email">
                Work Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-white text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none shadow-xs"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setInfoNotice('Password reset must be requested through your workspace administrator.')}
                  className="text-xs text-primary-600 hover:text-primary-800 font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-surface-300 bg-white text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Form Options Row */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          {/* Submit Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 active:from-primary-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In →</span>
            )}
          </button>
        </form>

        {/* Security Indication Footer */}
        <div className="pt-6 border-t border-surface-100 text-center">
          <p className="text-xs text-gray-400 font-medium flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <span>Protected by DealFlow360 Enterprise Authentication</span>
          </p>
        </div>
      </div>
    </div>
  );
}

