import React, { useState } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronRight, MessageSquare, 
  RotateCcw, Truck, ShieldCheck 
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function FaqsPage({ 
  navigateTo, 
  cartCount = 0, 
  wishlistCount = 0, 
  onOpenCart, 
  onOpenWishlist, 
  onOpenSearch 
}) {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "What is your return policy? Can I return a used product?",
      a: "Our return window is strictly 3 days (72 hours) from the delivery timestamp. Used products are strictly NOT acceptable for return or refund. All items must be completely brand new, uncreased, unworn on courts/rinks, and with all original tags attached in original packaging."
    },
    {
      q: "How long does shipping take within the United Arab Emirates?",
      a: "Orders placed before 2:00 PM GST are dispatched same-day. Delivery across Dubai, Abu Dhabi, Sharjah, and northern Emirates takes 24 to 48 hours. Orders over $150 receive complimentary free delivery."
    },
    {
      q: "Can I pay in installments with Tabby or Tamara?",
      a: "Yes! During checkout, you can split your total purchase into 4 equal, interest-free monthly installments using Tabby or Tamara with zero hidden fees."
    },
    {
      q: "How do I choose the correct basketball or footwear size?",
      a: "Every product card and Quick View modal features an interactive 'Size Guide' with direct conversions between US, UK, EU, and CM measurements. If you are unsure, message our WhatsApp concierge at +971 50 123 4567 for recommendations."
    },
    {
      q: "Are STRATEGY balls and equipment tournament certified?",
      a: "Yes. Our composite basketballs and carbon footwear adhere to strict FIBA and international athletic specifications for grip friction, bounce rebound, and durability."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      
      {/* Sticky Navbar */}
      <Navbar
        activeTab="faqs"
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
          <span className="text-blue-600 font-black">FREQUENTLY ASKED QUESTIONS</span>
        </div>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Store Help & Assistance</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">
            Quick answers regarding order fulfillment, our strict 3-day returns policy, sizing metrics, and courier deliveries.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 mb-8">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-xs sm:text-sm hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions card */}
        <div className="p-6 rounded-3xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black uppercase text-blue-950 mb-1">
              Still have a question?
            </h3>
            <p className="text-xs text-blue-800">
              Our UAE athlete support team is online on WhatsApp to answer sizing and order inquiries.
            </p>
          </div>
          <button
            onClick={() => navigateTo && navigateTo('contact')}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-colors shrink-0 shadow-sm cursor-pointer"
          >
            Contact Support
          </button>
        </div>

      </main>

      <Footer onNavigate={navigateTo} />
      
    </div>
  );
}
