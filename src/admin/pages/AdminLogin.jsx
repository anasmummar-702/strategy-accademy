import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ShoppingBag, GraduationCap } from 'lucide-react';
import { StrategyIcon } from '../../components/StrategyLogo';

const ACCOUNTS = [
  { email: 'admin@strategy.ae', label: 'Academy', hint: 'Trials, packages, photos', icon: GraduationCap },
  { email: 'store@strategy.ae', label: 'Shop', hint: 'Products and orders', icon: ShoppingBag },
];

export default function AdminLogin() {
  const { login, error: authError } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) setErrorMessage('That email or password is not right. Please try again.');
  };

  const inputCls =
    'w-full pl-10 pr-3.5 py-3 bg-white border border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-xl text-base text-zinc-900 placeholder-zinc-400 focus:outline-none transition';

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <StrategyIcon className="w-12 h-12 mx-auto" />
          <h1 className="text-2xl font-semibold text-zinc-900">Sign in</h1>
          <p className="text-base text-zinc-500">to manage your STRATEGY website</p>
        </div>

        {/* Which part do you manage? */}
        <div className="grid grid-cols-2 gap-3">
          {ACCOUNTS.map((acc) => {
            const Icon = acc.icon;
            const selected = email.trim().toLowerCase() === acc.email;
            return (
              <button
                key={acc.email}
                type="button"
                id={`login-pick-${acc.label.toLowerCase()}`}
                onClick={() => setEmail(acc.email)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  selected ? 'border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <Icon className="w-5 h-5 text-zinc-700" />
                <p className="text-base font-semibold text-zinc-900 mt-2">{acc.label}</p>
                <p className="text-sm text-zinc-500">{acc.hint}</p>
              </button>
            );
          })}
        </div>

        {(errorMessage || authError) && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-sm font-medium text-zinc-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@strategy.ae"
                autoComplete="username"
                required
                className={inputCls}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="block text-sm font-medium text-zinc-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className={`${inputCls} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-900 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-zinc-950 hover:bg-black text-white font-medium rounded-xl text-base flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in…</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </form>

        <div className="text-center">
          <a href="/#home" className="text-sm text-zinc-500 hover:text-zinc-900 underline underline-offset-2">
            ← Back to the website
          </a>
        </div>
      </div>
    </div>
  );
}
