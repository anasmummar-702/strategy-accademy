import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronRight, 
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function Navbar({
  activeTab = 'home',
  navigateTo,
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onAboutClick
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'SHOP', tab: 'shop', badge: null },
    { label: 'SPORTS', tab: 'sports', badge: null },
    { label: 'MEN', tab: 'men', badge: null },
    { label: 'WOMEN', tab: 'women', badge: null },
    { label: 'KIDS', tab: 'kids', badge: null },
    { label: 'SPECIAL EDITION', tab: 'special-edition', badge: 'LIMITED' },
    { label: 'ABOUT', tab: 'about', badge: null }
  ];

  const handleNavClick = (tab) => {
    setMobileMenuOpen(false);
    if (tab === 'about') {
      if (onAboutClick) {
        onAboutClick();
        return;
      }
      const el = document.getElementById('sec-about-strategy');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (navigateTo) {
        navigateTo('about-strategy');
      }
      return;
    }
    if (navigateTo) {
      navigateTo(tab);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 text-slate-900 shadow-md backdrop-blur-md py-3 border-b border-slate-200/80'
            : 'bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent text-white py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${
                  isScrolled ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                }`}
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <button
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg tracking-tighter transition-all duration-300 shadow-md ${
                  isScrolled 
                    ? 'bg-blue-600 text-white group-hover:bg-blue-700' 
                    : 'bg-white text-blue-900 group-hover:scale-105'
                }`}>
                  S
                </div>
                <div>
                  <span className={`text-xl sm:text-2xl font-black tracking-wider transition-colors ${
                    isScrolled ? 'text-slate-950' : 'text-white'
                  }`}>
                    STRATEGY
                  </span>
                  <span className="hidden sm:block text-[9px] uppercase tracking-widest font-extrabold text-blue-500 -mt-1">
                    Athletics & Gear
                  </span>
                </div>
              </button>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.tab)}
                  className={`text-xs xl:text-sm font-extrabold tracking-wider transition-all duration-200 relative py-1 cursor-pointer flex items-center gap-1.5 ${
                    activeTab === item.tab 
                      ? 'text-blue-600 font-black' 
                      : isScrolled
                        ? 'text-slate-700 hover:text-blue-600'
                        : 'text-slate-200 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-blue-600 text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  {activeTab === item.tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Right: Actions (Search, Account, Wishlist, Cart) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  isScrolled 
                    ? 'text-slate-700 hover:bg-slate-100 hover:text-blue-600' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
                title="Search products"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
                <span className="hidden xl:inline">Search</span>
              </button>

              {/* Account Shortcut */}
              <button
                onClick={() => handleNavClick('about')}
                className={`hidden md:flex p-2 rounded-xl items-center text-xs font-bold transition-all cursor-pointer ${
                  isScrolled 
                    ? 'text-slate-700 hover:bg-slate-100 hover:text-blue-600' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
                title="Account & Profile"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Wishlist Button */}
              <button
                onClick={onOpenWishlist}
                className={`relative p-2 rounded-xl transition-all cursor-pointer ${
                  isScrolled 
                    ? 'text-slate-700 hover:bg-slate-100 hover:text-blue-600' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
                title="Saved Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-bold text-xs cursor-pointer shadow-sm ${
                  isScrolled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-white hover:bg-blue-50 text-blue-950'
                }`}
                title="Shopping Cart"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-black ${
                  isScrolled ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                }`}>
                  {cartCount}
                </span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" 
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-sm bg-white text-slate-900 h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-base">
                  S
                </div>
                <span className="text-xl font-black tracking-wider text-slate-900">
                  STRATEGY
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="py-6 flex flex-col gap-2">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.tab)}
                  className="flex items-center justify-between px-3 py-3 rounded-xl text-left font-bold text-sm text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {item.label}
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>

            {/* Drawer Footer Promo */}
            <div className="mt-auto pt-6 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-950 text-white">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-black mb-1">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>10 YEARS CELEBRATION</span>
                </div>
                <p className="text-xs text-blue-100 mb-3">
                  Discover our exclusive collector Gold Edition basketball & carbon speed shoes.
                </p>
                <button
                  onClick={() => handleNavClick('special-edition')}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Explore Special Drops
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
