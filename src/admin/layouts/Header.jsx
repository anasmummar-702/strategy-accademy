import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, LogOut, Key, ChevronDown, Menu } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function Header({ title, onOpenPasswordReset, collapsed, setCollapsed }) {
  const { admin, logout } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const isStoreAdmin = admin?.role === 'store_admin';

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-zinc-200 sticky top-0 z-30 flex items-center justify-between gap-3 px-4 sm:px-8">
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="header-sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 -ml-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition cursor-pointer"
          title={collapsed ? 'Show menu' : 'Hide menu labels'}
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-semibold text-zinc-900 truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <a
          href={isStoreAdmin ? '/#shop' : '/#home'}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-sm font-medium text-zinc-700 transition"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View website</span>
        </a>

        <div className="relative" ref={menuRef}>
          <button
            id="admin-profile-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1 pr-2 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center text-white font-semibold text-sm">
              {admin?.fullName?.charAt(0) || 'A'}
            </div>
            <span className="hidden md:block text-sm font-medium text-zinc-800 max-w-[140px] truncate">
              {admin?.fullName || 'Admin'}
            </span>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </button>

          {menuOpen && (
            <div
              id="admin-profile-dropdown-menu"
              className="absolute right-0 mt-2 w-60 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden z-50 text-sm"
            >
              <div className="px-4 py-3 border-b border-zinc-100">
                <p className="font-semibold text-zinc-900 truncate">{admin?.fullName}</p>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{admin?.email}</p>
              </div>
              <button
                id="change-password-btn"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenPasswordReset();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                <Key className="w-4 h-4 text-zinc-400" />
                <span>Change password</span>
              </button>
              <button
                id="sign-out-btn"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-600 hover:bg-rose-50 border-t border-zinc-100 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
