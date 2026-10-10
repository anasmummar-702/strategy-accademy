import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import StrategyLogo, { StrategyIcon } from '../../components/StrategyLogo';

export default function AdminLogin() {
  const { login, error: authError } = useAdminAuth();
  const [email, setEmail] = useState('admin@strategy.ae');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setErrorMessage(result.error || 'Authentication failed');
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 flex items-center justify-center p-4 relative font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Login Card */}
      <div className="w-full max-w-sm bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 shadow-xs relative z-10 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <StrategyIcon className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-lg font-black italic tracking-wider text-zinc-900 font-['Oswald',sans-serif]">STRATEGY</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Control Center — Admin Login</p>
          </div>
        </div>

        {/* Error Alert */}
        {(errorMessage || authError) && (
          <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-lg text-xs text-rose-700 font-medium flex items-center gap-2 animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMessage || authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-700">Admin Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@strategy.ae"
                required
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-lg text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none transition font-normal"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-9 pr-9 py-2.5 bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-lg text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none transition font-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 pt-0.5 font-normal">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-zinc-300 bg-white text-zinc-950 focus:ring-zinc-900"
              />
              <span>Remember email</span>
            </label>
            <span className="text-zinc-400 text-[11px]">256-bit SSL</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-zinc-950 hover:bg-black text-white font-medium rounded-lg text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 mt-1 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Control Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Credentials Assistant */}
        <div className="pt-3.5 border-t border-zinc-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
              Select Workspace Account:
            </p>
            <span className="text-[10px] text-zinc-400">Click to fill</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Store Admin */}
            <button
              type="button"
              onClick={() => handleDemoFill('store@strategy.ae', 'admin123')}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                email === 'store@strategy.ae'
                  ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400'
                  : 'bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Store Admin
                </span>
                <span className="text-[9px] font-mono px-1 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                  E-Commerce
                </span>
              </div>
              <p className="text-zinc-500 text-[10px] mt-1 line-clamp-1">
                Products, Orders & Inventory
              </p>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">store@strategy.ae</span>
            </button>

            {/* Admin */}
            <button
              type="button"
              onClick={() => handleDemoFill('admin@strategy.ae', 'admin123')}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                email === 'admin@strategy.ae'
                  ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-400'
                  : 'bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                  Admin
                </span>
                <span className="text-[9px] font-mono px-1 py-0.2 bg-indigo-100 text-indigo-800 rounded">
                  Master
                </span>
              </div>
              <p className="text-zinc-500 text-[10px] mt-1 line-clamp-1">
                Packages, Academy & CMS
              </p>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">admin@strategy.ae</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-1">
          <a
            href="https://strategyaccademy.netlify.app"
            className="text-xs text-zinc-500 hover:text-zinc-900 transition underline underline-offset-2"
          >
            ← Back to STRATEGY Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
