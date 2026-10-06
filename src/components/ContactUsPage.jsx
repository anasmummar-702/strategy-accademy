import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Send, MessageSquare, 
  CheckCircle, ChevronRight, ShieldCheck, Sparkles, AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ContactUsPage({ 
  navigateTo, 
  cartCount = 0, 
  wishlistCount = 0, 
  onOpenCart, 
  onOpenWishlist, 
  onOpenSearch 
}) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    subject: 'Order Tracking & Delivery',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {}
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      
      {/* Sticky Navbar */}
      <Navbar
        activeTab="contact"
        navigateTo={navigateTo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={onOpenCart}
        onOpenWishlist={onOpenWishlist}
        onOpenSearch={onOpenSearch}
      />

      <main className="pt-24 sm:pt-28 pb-16 flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
          <button 
            onClick={() => navigateTo && navigateTo('shop-home')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            STRATEGY STORE
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-blue-600 font-black">CONTACT CUSTOMER SUPPORT</span>
        </div>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Dedicated Athlete Concierge</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">
            Contact STRATEGY Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
            Have questions about equipment specifications, order dispatch status, or our strict 3-day return guidelines? Reach out directly to our UAE concierge team.
          </p>
        </div>

        {/* 2-Column Grid: Contact Information & Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Channels & Hubs (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* WhatsApp Quick Action Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  ⚡ Fastest Response
                </span>
                <span className="text-xs font-bold text-emerald-100">Avg &lt; 15 mins</span>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">
                WhatsApp Live Concierge
              </h3>
              <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                Chat directly with our athletic specialists for instant sizing recommendations and parcel delivery status.
              </p>
              <a
                href="https://wa.me/971501234567?text=Hello%20STRATEGY%20Support,%20I%20have%20an%20inquiry%20regarding%20my%20sports%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Message +971 50 123 4567</span>
              </a>
            </div>

            {/* Support Details Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 text-xs">
              <h4 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                Support Channels
              </h4>

              <div className="flex items-start gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-bold block uppercase">Phone Hotline</span>
                  <strong className="text-slate-900 text-xs sm:text-sm font-bold">+971 50 123 4567</strong>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-bold block uppercase">Email Support</span>
                  <strong className="text-slate-900 text-xs sm:text-sm font-bold">support@strategy.com</strong>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Response within 2 hours</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-bold block uppercase">Operating Hours</span>
                  <strong className="text-slate-900 text-xs font-bold">Monday – Saturday: 8:00 AM – 10:00 PM GST</strong>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Sunday: 10:00 AM – 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Warehouse Locations Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 text-xs">
              <h4 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                UAE Fulfillment Facilities
              </h4>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-slate-900 block">Al Nahiyan Sports Hub</strong>
                  <span className="text-slate-500 text-[11px]">14th Street, Al Nahiyan District, Abu Dhabi, UAE</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-slate-900 block">Dubai Marina Logistics Center</strong>
                  <span className="text-slate-500 text-[11px]">Marina Promenade, Dubai Marina, Dubai, UAE</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              
              {submitted ? (
                <div className="py-12 px-4 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-100">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black uppercase text-slate-900">
                    Inquiry Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-bold text-slate-900">{form.name}</span>. A customer care representative has been assigned to ticket <span className="font-mono text-blue-600 font-bold">#STR-{Math.floor(10000 + Math.random() * 90000)}</span> and will reply within 2 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: '',
                        email: '',
                        phone: '',
                        orderNumber: '',
                        subject: 'Order Tracking & Delivery',
                        message: ''
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight mb-1">
                      Send an Inquiry
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Fill out the form below and our team will get back to you promptly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Marcus Vance"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="marcus@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+971 50 123 4567"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Order Reference # (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="STR-123456"
                        value={form.orderNumber}
                        onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Inquiry Category *
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all cursor-pointer font-medium"
                    >
                      <option value="Order Tracking & Delivery">Order Tracking & Delivery</option>
                      <option value="3-Day Return & Refund Request">3-Day Return & Refund Request</option>
                      <option value="Footwear & Sizing Consultation">Footwear & Sizing Consultation</option>
                      <option value="Wholesale & Club Bulk Equipment">Wholesale & Club Bulk Equipment</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please provide details about your inquiry..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Message</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </main>

      <Footer onNavigate={navigateTo} />
      
    </div>
  );
}
