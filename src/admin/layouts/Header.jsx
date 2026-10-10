import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ExternalLink,
  Bell,
  User,
  LogOut,
  Key,
  ShieldCheck,
  ChevronDown,
  Globe,
  Radio,
  Store,
  Crown,
  RefreshCw,
  Menu
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function Header({
  activeTab,
  setActiveTab,
  onOpenPasswordReset,
  collapsed,
  setCollapsed,
  workspace,
  setWorkspace,
}) {
  const { admin, logout, switchDemoRole } = useAdminAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isStoreAdmin = admin?.role === 'store_admin';
  const isSuperAdmin = admin?.role === 'super_admin';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800/80 sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 text-white">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-2 flex-1 max-w-sm sm:max-w-md">
        {setCollapsed && (
          <button
            id="header-sidebar-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer flex-shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder={
              isStoreAdmin
                ? "Search products, inventory, orders..."
                : "Search packages, trials, coaches..."
            }
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 focus:bg-zinc-900 focus:border-zinc-600 rounded-lg text-xs text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">

        {/* Store Admin Static Badge */}
        {isStoreAdmin && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/70 border border-emerald-800/60 rounded-full text-[11px] font-semibold text-emerald-400">
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>Store Admin</span>
          </div>
        )}

        {/* Royal Collections Style Storefront Direct Button */}
        <a
          href="#shop"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/70 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition cursor-pointer shadow-xs"
          title="Open live storefront"
        >
          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          <span>Storefront</span>
        </a>

        {/* User Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            id="admin-profile-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-1.5 p-1 pr-2 hover:bg-zinc-900/80 rounded-lg transition-colors text-left cursor-pointer"
          >
            {admin?.avatarUrl ? (
              <img
                src={admin.avatarUrl}
                alt={admin.fullName}
                className="w-7 h-7 rounded-full object-cover border border-zinc-700"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-medium text-xs">
                {admin?.fullName?.charAt(0) || 'A'}
              </div>
            )}
            <div className="hidden md:block">
              <span className="text-xs font-semibold text-white block leading-tight truncate max-w-[110px]">
                {admin?.fullName || 'Admin User'}
              </span>
              <span className="text-[10px] text-zinc-400 block leading-tight font-mono">
                {admin?.role === 'super_admin' ? 'Administrator' : (admin?.roleName || admin?.role)}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-zinc-400 ml-0.5" />
          </button>

          {/* User Dropdown Menu */}
          {userMenuOpen && (
            <div
              id="admin-profile-dropdown-menu"
              className="absolute right-0 mt-1.5 w-60 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 py-1 text-xs text-zinc-300 animate-in fade-in duration-100"
            >
              <div className="px-3.5 py-2.5 border-b border-zinc-800 bg-zinc-950/60">
                <p className="font-semibold text-white">{admin?.fullName}</p>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">{admin?.email}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-semibold rounded">
                  {admin?.role === 'super_admin' ? 'Administrator' : admin?.roleName}
                </span>
              </div>

              {/* Demo Role Switcher Quick Action */}
              <div className="p-2 border-b border-zinc-800 bg-zinc-950/30">
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1 px-1">
                  Quick Switch Role (Demo):
                </p>
                {isStoreAdmin ? (
                  <button
                    id="switch-to-super-admin-btn"
                    onClick={() => {
                      setUserMenuOpen(false);
                      switchDemoRole('super_admin');
                    }}
                    className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-800 text-indigo-400 text-xs font-medium transition cursor-pointer text-left"
                  >
                    <Crown className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Switch to Admin</span>
                  </button>
                ) : (
                  <button
                    id="switch-to-store-admin-btn"
                    onClick={() => {
                      setUserMenuOpen(false);
                      switchDemoRole('store_admin');
                    }}
                    className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-800 text-emerald-400 text-xs font-medium transition cursor-pointer text-left"
                  >
                    <Store className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Switch to Store Admin</span>
                  </button>
                )}
              </div>

              <div className="py-1">
                <button
                  id="change-password-btn"
                  onClick={() => {
                    setUserMenuOpen(false);
                    onOpenPasswordReset();
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Change Password</span>
                </button>

                <button
                  id="account-settings-btn"
                  onClick={() => {
                    setUserMenuOpen(false);
                    setActiveTab('settings');
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Account & Settings</span>
                </button>
              </div>

              <div className="border-t border-zinc-800 py-1">
                <button
                  id="sign-out-btn"
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-400 hover:bg-rose-950/40 transition-colors font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
