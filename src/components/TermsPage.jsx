import React from 'react';
import { 
  FileText, ShieldCheck, Scale, AlertCircle, 
  CreditCard, Truck, RotateCcw, ChevronRight 
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function TermsPage({ 
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
        activeTab="terms"
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
          <span className="text-blue-600 font-black">TERMS & CONDITIONS</span>
        </div>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Commercial Agreement</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">
            Welcome to STRATEGY Athletics Online Store. These terms govern the purchase of all athletic footwear, balls, protective gear, and sportswear through our official website and mobile portal.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          
          {/* 1. Legal Entity */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mb-2">
              1. Commercial Entity & Acceptance
            </h2>
            <p className="mb-2">
              This website is operated by <strong>STRATEGY Athletics Trading L.L.C.</strong>, registered in the United Arab Emirates. By placing an order or browsing our catalog, you represent that you are at least 18 years of age or possess legal parental consent.
            </p>
          </div>

          {/* 2. Pricing & Currency */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mb-2">
              2. Product Pricing & Availability
            </h2>
            <p className="mb-2">
              All prices displayed are in USD ($) or AED equivalent as converted. We reserve the right to modify prices or discontinue items without prior notice. In the event of a pricing or typographical error, STRATEGY reserves the right to cancel unfulfilled orders with a full refund.
            </p>
          </div>

          {/* 3. Mandatory 3-Day Return & Condition Term */}
          <div className="bg-amber-50/60 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xs">
            <h2 className="text-base font-black text-amber-950 uppercase tracking-tight mb-2 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>3. Return & Refund Window: Strictly 3 Days</span>
            </h2>
            <p className="text-amber-900 font-semibold mb-2">
              In accordance with our strict product integrity guidelines, all returns and exchange requests MUST be submitted within <strong>three (3) calendar days (72 hours)</strong> following courier delivery confirmation.
            </p>
            <p className="text-amber-900 font-semibold">
              <strong>USED PRODUCTS WILL NOT BE ACCEPTED UNDER ANY CIRCUMSTANCES.</strong> Any product showing signs of court use, dust, floor friction, creased carbon/leather, or removed tags is deemed non-refundable.
            </p>
          </div>

          {/* 4. Payment Security */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mb-2">
              4. Payment Authorization & Fraud Prevention
            </h2>
            <p className="mb-2">
              Payments via credit card, Apple Pay, or Cash on Delivery are subject to automated fraud screening. All digital transactions are processed through PCI-DSS Level 1 certified gateways with 256-bit SSL encryption.
            </p>
          </div>

          {/* 5. Governing Law */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mb-2">
              5. Governing Law & Jurisdiction
            </h2>
            <p className="mb-2">
              These Terms & Conditions shall be construed and governed in accordance with the applicable <strong>Federal Laws of the United Arab Emirates</strong> and the local courts of Abu Dhabi & Dubai.
            </p>
          </div>

        </div>

      </main>

      <Footer onNavigate={navigateTo} />
      
    </div>
  );
}
