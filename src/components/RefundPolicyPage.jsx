import React from 'react';
import { 
  RotateCcw, AlertTriangle, CheckCircle, Clock, 
  Package, ShieldCheck, ArrowRight, MessageSquare, 
  HelpCircle, ChevronRight, Truck, FileText
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function RefundPolicyPage({ 
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
        activeTab="returns"
        navigateTo={navigateTo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={onOpenCart}
        onOpenWishlist={onOpenWishlist}
        onOpenSearch={onOpenSearch}
      />

      <main className="pt-24 sm:pt-28 pb-16 flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
          <button 
            onClick={() => navigateTo && navigateTo('shop-home')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            STRATEGY STORE
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-blue-600 font-black">REFUND & RETURN POLICY</span>
        </div>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider mb-4">
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
            <span>Official Store Policy</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">
            Refund & Return Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">
            At STRATEGY, we engineer championship-grade athletics, carbon footwear, and tournament equipment. To preserve hygiene, structural safety, and high-performance standards, please review our strict return terms below.
          </p>
        </div>

        {/* ⚠️ CRITICAL NOTICE BOX - 3 DAYS & NO USED PRODUCTS */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/50 rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-md mb-8 space-y-4">
          <div className="flex items-center gap-3 text-amber-800">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-amber-900">
                Mandatory Return Requirements
              </h2>
              <p className="text-xs text-amber-700 font-semibold">
                Please read before initiating any return or exchange request.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Condition 1: 3-Day Rule */}
            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-black text-sm shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black uppercase text-slate-900 mb-1">
                  1. Strictly Within 3 Days (72 Hours)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  The product <strong>MUST be returned within three (3) days</strong> from the exact date and time the courier delivered the parcel to your address. Requests submitted after 72 hours are automatically ineligible.
                </p>
              </div>
            </div>

            {/* Condition 2: No Used Products */}
            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-black text-sm shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black uppercase text-slate-900 mb-1">
                  2. Used Products Won't Be Accepted
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <strong>Used products are strictly NOT acceptable for return or refund.</strong> Items must be 100% brand new, unworn, unwashed, in original packaging with all factory tags, seals, and barcodes completely intact.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6">
          
          {/* Section 1: Ineligible Condition Checklist */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Inspection & Condition Criteria</span>
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-4">
              All returned packages are routed to our <strong>STRATEGY Quality Inspection Center</strong> in Al Nahiyan / Dubai. Your return will be rejected and sent back if any of the following are detected:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { title: 'Court & Surface Marks', desc: 'Any scuffs, dust, or floor wear on soles, wheels, or ball composite.' },
                { title: 'Removed or Cut Tags', desc: 'Any item without the original STRATEGY factory security tags attached.' },
                { title: 'Missing Original Box', desc: 'Footwear or skates returned without the branded product box.' },
                { title: 'Signs of Washing / Odor', desc: 'Perfume, detergent, sweat, or washed sportswear fabrics.' },
                { title: 'Creased Leather / Carbon', desc: 'Upper leather or carbon plates deformed from trial play.' },
                { title: 'Hygiene & Custom Items', desc: 'Mouthguards, athletic socks, and customized name-printed jerseys.' }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✕
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-[11px] mb-0.5">{item.title}</h4>
                    <p className="text-slate-500 font-medium text-[11px] leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: How to Return Step-by-Step */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>How to Initiate a Return Within 3 Days</span>
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-0.5">Contact Our Support Team</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Within 72 hours of delivery, message us on WhatsApp at <strong>+971 50 123 4567</strong> or email <strong>support@strategy.com</strong> with your Order Number (e.g. STR-123456) and photos showing the unremoved tags and unused condition.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-0.5">Courier Collection Booking</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Once pre-approved, our courier partner will pick up the parcel from your UAE address within 24 to 48 hours. Please pack items safely in the original shipping carton.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-0.5">Inspection & Refund Disbursement</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Upon passing physical inspection at our facility, refunds are processed within <strong>3 to 5 business days</strong> back to your original payment card, or issued immediately as a STRATEGY Store Credit Voucher.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="https://wa.me/971501234567?text=Hello%20STRATEGY%20Support,%20I%20would%20like%20to%20request%20a%20return%20within%20my%203-day%20delivery%20window."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Initiate Return via WhatsApp</span>
              </a>

              <button
                onClick={() => navigateTo && navigateTo('contact')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Go to Contact Us Form
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
      
    </div>
  );
}
