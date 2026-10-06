import React from 'react';
import { Search, Heart, ShoppingBag, ShieldCheck, Truck, Zap, Sparkles } from 'lucide-react';

export default function KineticHeader({
  activeTab,
  navigateTo,
  cartCount = 3,
  wishlistCount = 2,
  onOpenSearch
}) {
  return (
    <header className="w-full bg-[#050711]/92 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 shadow-2xl font-['Inter',sans-serif]">
      {/* Top Luxury Atelier Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-slate-950 via-[#070d24] to-slate-950 text-white text-[11px] font-['Oswald',sans-serif] tracking-widest py-2 px-4 sm:px-8 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            KINETIC ATELIER PRO SERIES
          </span>
          <span className="hidden md:inline text-slate-700">•</span>
          <span className="hidden md:flex items-center gap-1.5 text-blue-300 font-medium uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            COMPLIMENTARY CONCIERGE SHIPPING OVER $75
          </span>
          <span className="hidden lg:inline text-slate-700">•</span>
          <span className="hidden lg:flex items-center gap-1.5 text-slate-300 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            30-DAY REAL GAME COVERAGE
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 text-[10px] tracking-wider uppercase">
          <button 
            onClick={() => {
              navigateTo('trial');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-amber-400 hover:text-amber-300 font-bold hidden sm:inline transition-colors"
          >
            ★ SKATE TRIAL (30 AED)
          </button>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-300 hover:text-white cursor-pointer transition-colors">CONCIERGE: +1 (800) 849-HOOP</span>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Luxury Logo */}
        <div 
          onClick={() => {
            navigateTo('kinetic-main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 text-white flex items-center justify-center font-['Oswald',sans-serif] font-bold text-2xl tracking-tighter shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/60 group-hover:scale-105 transition-all border border-white/20">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-['Oswald',sans-serif] text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight leading-none group-hover:text-blue-400 transition-colors drop-shadow-sm">
              KINETIC HOOPS
            </span>
            <span className="text-[10px] font-['Oswald',sans-serif] font-bold tracking-[0.25em] uppercase text-amber-300 mt-1 flex items-center gap-1">
              <span>HAUTE ATELIER</span>
              <span className="w-1 h-1 rounded-full bg-amber-400"></span>
              <span className="text-slate-400">EST. 2025</span>
            </span>
          </div>
        </div>

        {/* Categories Navigation Links */}
        <nav className="hidden xl:flex items-center gap-7 text-[13px] font-['Oswald',sans-serif] font-bold uppercase tracking-wider text-slate-300">
          <button
            onClick={() => {
              navigateTo('kinetic-main');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-all hover:text-white relative py-1 ${
              activeTab === 'kinetic-main' 
                ? 'text-white font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-400 after:shadow-[0_0_8px_#38bdf8]' 
                : 'text-slate-400'
            }`}
          >
            Accessories Home
          </button>
          <button
            onClick={() => {
              navigateTo('trial');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-all hover:text-white relative py-1 ${
              activeTab === 'trial' 
                ? 'text-white font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400 after:shadow-[0_0_8px_#10b981]' 
                : 'text-emerald-400'
            }`}
          >
            Skating Trial (30 AED)
          </button>
          <button
            onClick={() => {
              navigateTo('kinetic-product');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-all hover:text-white relative py-1 ${
              activeTab === 'kinetic-product' 
                ? 'text-white font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-400 after:shadow-[0_0_8px_#38bdf8]' 
                : 'text-slate-400'
            }`}
          >
            Basketballs & Grips
          </button>
          <button
            onClick={() => {
              navigateTo('kinetic-product');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Compression & Sleeves
          </button>
          <button
            onClick={() => {
              navigateTo('kinetic-product');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Recovery & Resistance
          </button>
          <button
            onClick={() => {
              navigateTo('kinetic-product');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Bags & Hydration
          </button>
          <button
            onClick={() => {
              navigateTo('kinetic-product');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Training Gear
          </button>
        </nav>

        {/* Right Search, Wishlist & Cart Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Quick Search Input */}
          <div className="relative hidden md:flex items-center">
            <input 
              type="text"
              placeholder="Search gear, specs, SKU..."
              className="w-48 lg:w-60 pl-8 pr-12 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all font-['Inter',sans-serif] backdrop-blur-md"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <kbd className="absolute right-2 px-1.5 py-0.5 text-[9px] font-mono bg-white/10 text-slate-300 border border-white/10 rounded">
              ⌘K
            </kbd>
          </div>

          {/* Currency Toggle */}
          <div className="hidden sm:flex items-center text-xs font-['Oswald',sans-serif] font-bold text-slate-300 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
            <span>$ USD</span>
          </div>

          {/* Wishlist Button */}
          <button 
            className="relative p-2.5 text-slate-300 hover:text-white transition-colors rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10"
            title="Wishlist (2 items saved)"
          >
            <Heart className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center font-mono shadow-sm">
              {wishlistCount}
            </span>
          </button>

          {/* Luxury Cart Stage Capsule */}
          <button
            onClick={() => {
              navigateTo('kinetic-cart');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all font-['Oswald',sans-serif] ${
              activeTab === 'kinetic-cart'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/40 ring-1 ring-white/30'
                : 'bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-transparent hover:from-blue-600/35 hover:to-blue-500/20 text-blue-300 border border-blue-400/30'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-blue-300" />
              <span className="absolute -top-1.5 -right-2 min-w-4.5 h-4.5 px-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center font-mono border-2 border-slate-950 shadow-md">
                {cartCount}
              </span>
            </div>
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-white">
              {cartCount > 0 ? `${cartCount} In Locker` : 'Locker Empty'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
