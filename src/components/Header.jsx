import React, { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, Menu, X, Sparkles, ChevronRight } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, cartCount, openCart, openTrialModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'trial', label: 'Trial Class (30 AED)' },
    { id: 'programs', label: 'Skating Programs' },
    { id: 'basketball', label: 'Basketball 🏀' },
    { id: 'skating', label: 'Skating Academy' },
    { id: 'contact', label: 'Contact & FAQs' },
  ];

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : 'default'}`}>
      <div className="container">
        <div className="header-row">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="brand-link"
          >
            <div className="brand-logo-icon">
              <div className="brand-logo-inner">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-wider text-white font-['Outfit'] flex items-center gap-1">
                STRATEGY<span className="gradient-text">SKATE</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-only nav-pill-list">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`nav-link-btn ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="desktop-only header-actions">
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-pink-500 text-white font-bold text-xs flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={openTrialModal}
              className="btn-primary"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Trial Class</span>
            </button>
          </div>

          {/* Mobile Toggle & Mobile Cart */}
          <div className="mobile-only flex items-center gap-2">
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full bg-white/5 text-cyan-400 border border-white/10"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white font-bold text-[10px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full bg-white/5 text-white border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full text-left py-3 px-4 rounded-xl text-base font-semibold flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          ))}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openTrialModal();
              }}
              className="btn-primary w-full py-3"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Trial Class</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
