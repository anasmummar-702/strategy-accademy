import React from 'react';
import { 
  Truck, ShieldCheck, Clock, MapPin, 
  Package, ChevronRight, CheckCircle2 
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ShippingPolicyPage({ 
  navigateTo, 
  cartCount = 0, 
  wishlistCount = 0, 
  onOpenCart, 
  onOpenWishlist, 
  onOpenSearch 
}) {
  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      
      {/* Sticky Navbar */}
      <Navbar
        activeTab="shipping"
        navigateTo={navigateTo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={onOpenCart}
        onOpenWishlist={onOpenWishlist}
        onOpenSearch={onOpenSearch}
      />

      <main className="pt-24 sm:pt-28 pb-16 flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
          <button 
            onClick={() => navigateTo && navigateTo('shop-home')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            STRATEGY STORE
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-blue-600 font-black">SHIPPING & DELIVERY</span>
        </div>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider mb-4">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Fast GCC Fulfillment</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">
            We operate automated fulfillment hubs in Abu Dhabi and Dubai, ensuring rapid delivery of your basketball equipment, carbon footwear, and pro athletics across the UAE and GCC.
          </p>
        </div>

        {/* Delivery Rates & Timelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                UAE Express Delivery
              </span>
              <strong className="text-emerald-600 font-black text-xs">FREE Over $150</strong>
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase">24 to 48 Hours</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Standard delivery across all seven Emirates (Dubai, Abu Dhabi, Sharjah, Ajman, RAK, Fujairah, UAQ). Orders below $150 incur a flat $15 delivery fee.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                GCC Regional Air Freight
              </span>
              <strong className="text-blue-600 font-black text-xs">DHL / Aramex</strong>
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase">3 to 5 Business Days</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Direct express air shipping to Saudi Arabia, Qatar, Kuwait, Bahrain, and Oman. Duties and tracking number sent via SMS and WhatsApp upon courier handoff.
            </p>
          </div>

        </div>

      </main>

      <Footer onNavigate={navigateTo} />
      
    </div>
  );
}
