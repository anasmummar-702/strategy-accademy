import React from 'react';
import { 
  ShieldCheck, Lock, Eye, Database, 
  UserCheck, ChevronRight, Mail 
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PrivacyPolicyPage({ 
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
        activeTab="privacy"
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
          <span className="text-blue-600 font-black">PRIVACY POLICY</span>
        </div>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Data Protection Standards</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">
            Your trust is our top priority. We respect your confidentiality and ensure that your personal information, delivery addresses, and payment data are safeguarded with bank-grade encryption.
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>1. Information We Collect</span>
            </h2>
            <p className="mb-2">
              We collect information necessary to fulfill your sports orders, including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Contact Details: Full name, delivery address, phone/WhatsApp number for courier updates.</li>
              <li>Order History: Purchased athletic footwear sizes, equipment choices, and order references.</li>
              <li>Technical Telemetry: IP address, browser type, and cookie identifiers for shopping cart persistence.</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span>2. No Sale of Customer Data</span>
            </h2>
            <p>
              <strong>We never sell, rent, or trade your personal data to third-party advertisers.</strong> Your information is strictly shared with certified logistics partners (e.g., UAE delivery couriers) solely for parcel delivery purposes.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>3. Payment Card Security</span>
            </h2>
            <p>
              STRATEGY does not store full credit card numbers or CVVs on our servers. All credit/debit card transactions are tokenized and processed through certified PCI-DSS Level 1 compliant financial payment gateways.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mb-2 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>4. Your Data Rights</span>
            </h2>
            <p className="mb-3">
              You retain the right to request access to, update, or permanently delete your customer account information from our systems at any time.
            </p>
            <p className="text-slate-800 font-bold">
              For privacy requests, email our data officer at: <span className="text-blue-600 font-mono">privacy@strategy.com</span>
            </p>
          </div>

        </div>

      </main>

      <Footer onNavigate={navigateTo} />
      
    </div>
  );
}
