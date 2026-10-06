import React, { useState } from 'react';
import { faqsData } from '../data/faqs';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactSection() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const categories = ['All', 'General & Trial', 'Programs & Equipment', 'Pro Shop & Shipping', 'Facility & Safety'];

  const filteredFaqs = selectedCategory === 'All'
    ? faqsData
    : faqsData.filter(f => f.category === selectedCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {}
  };

  return (
    <div className="pt-28 pb-20 space-y-16 container mx-auto px-4">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="badge badge-cyan inline-flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5" /> Contact & FAQs
        </span>
        <h1 className="text-4xl md:text-5xl font-black font-['Outfit']">
          We are Here To <span className="gradient-text">Help You Roll</span>
        </h1>
        <p className="text-gray-300 text-base">
          Have questions about class schedules, skate sizing, or birthday party facility rentals? Drop us a message or browse our frequently asked questions.
        </p>
      </div>

      {/* Grid: Contact Form & Info Card */}
      <div className="contact-grid">
        
        {/* Left: Contact Form */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-2xl font-bold font-['Outfit'] text-white">
            Send Us a Message
          </h3>

          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-cyan-400 text-black flex items-center justify-center mx-auto font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white font-['Outfit']">Message Received!</h4>
              <p className="text-xs text-cyan-200">
                Thank you for reaching out, {form.name}. Our academy team will respond to <span className="underline">{form.email}</span> within 24 hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' }); }}
                className="btn-secondary text-xs mt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 234-5678"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="General Inquiry" className="bg-[#0b1021]">General Inquiry</option>
                    <option value="Class Enrollment & Schedules" className="bg-[#0b1021]">Class Enrollment & Schedules</option>
                    <option value="Pro Shop Product Order" className="bg-[#0b1021]">Pro Shop Product Order</option>
                    <option value="Private Event / Party Rental" className="bg-[#0b1021]">Private Event / Party Rental</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help you..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3.5 text-sm">
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}

        </div>

        {/* Right: Info Card & Location */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
            <h3 className="text-xl font-bold font-['Outfit'] text-white">
              Academy Location & Contact
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-white">Strategy Skate Arena & Fitting Hub</div>
                  <div className="text-xs text-gray-400">450 Arena Boulevard, Sports Complex Plaza</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-white">Direct Line</div>
                  <div className="text-xs text-gray-400">+1 (800) 555-SKATE / (555) 482-9012</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-white">Support Email</div>
                  <div className="text-xs text-gray-400">support@strategyskateacademy.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-white">Operating Hours</div>
                  <div className="text-xs text-gray-400">Mon - Fri: 8:00 AM - 9:30 PM</div>
                  <div className="text-xs text-gray-400">Sat - Sun: 9:00 AM - 8:00 PM</div>
                </div>
              </div>
            </div>

            {/* Interactive Map Visual Placeholder Card */}
            <div className="rounded-2xl overflow-hidden border border-white/10 relative h-40 bg-slate-900 flex items-center justify-center text-center p-4">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/40 to-purple-900/40" />
              <div className="relative z-10 space-y-1">
                <MapPin className="w-8 h-8 text-cyan-400 mx-auto animate-bounce" />
                <div className="text-xs font-bold text-white">Strategy Indoor Rink Complex</div>
                <div className="text-[10px] text-cyan-300">Free On-site Parking & Metro Access</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Accordion FAQs */}
      <div className="space-y-6 pt-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold font-['Outfit'] text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-gray-400">
            Quick answers to common questions about our trial classes, equipment, and rink rules.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-400 text-black font-bold'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 font-bold text-sm md:text-base text-white hover:text-cyan-400"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 md:px-5 pb-5 text-xs md:text-sm text-gray-300 border-t border-white/5 pt-3 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
