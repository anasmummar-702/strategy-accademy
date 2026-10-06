import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, Footprints, Sparkles, CheckCircle, Ticket, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FreeTrialModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    programType: 'Kids (Beginners)',
    experience: 'Absolute Beginner',
    preferredDate: '',
    timeSlot: '4:00 PM - 5:00 PM',
    skateSize: 'EU 34 (UK 2)',
    needsEquipment: true,
  });

  const [bookingTicket, setBookingTicket] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const ticketId = 'SKT-' + Math.floor(100000 + Math.random() * 900000);
    setBookingTicket({
      ...formData,
      ticketId,
      bookedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    setStep(2);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti triggered');
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setBookingTicket(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="relative w-full max-w-2xl bg-[#0b1021] border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-cyan-950/80 overflow-hidden text-white">
        
        {/* Glow orb */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 ? (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="badge badge-cyan flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 100% Free • No Credit Card Required
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-['Outfit'] mb-2">
              Book Your <span className="gradient-text">Free Trial Session</span>
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Experience the excitement of skating with top coaches. Complimentary skates & protective gear provided!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    Select Program Category
                  </label>
                  <select
                    value={formData.programType}
                    onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Kids (Beginners)" className="bg-[#0b1021]">Kids (Beginners / Intermediate)</option>
                    <option value="Adults & Fitness" className="bg-[#0b1021]">Adults & Fitness</option>
                    <option value="Advanced / Competitive" className="bg-[#0b1021]">Advanced / Competitive Coaching</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    Current Experience Level
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Absolute Beginner" className="bg-[#0b1021]">Absolute Beginner (Never Skated)</option>
                    <option value="Basic Balance" className="bg-[#0b1021]">Basic Balance (Can glide & stop)</option>
                    <option value="Intermediate / Advanced" className="bg-[#0b1021]">Intermediate / Advanced Skater</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="sarah@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="4:00 PM - 5:00 PM" className="bg-[#0b1021]">4:00 PM - 5:00 PM (Kids)</option>
                    <option value="5:30 PM - 6:30 PM" className="bg-[#0b1021]">5:30 PM - 6:30 PM (Juniors)</option>
                    <option value="7:00 PM - 8:00 PM" className="bg-[#0b1021]">7:00 PM - 8:00 PM (Adults)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    Rental Skate Size
                  </label>
                  <div className="relative">
                    <Footprints className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. EU 36 / US 5"
                      value={formData.skateSize}
                      onChange={(e) => setFormData({ ...formData, skateSize: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <input
                  type="checkbox"
                  id="needsEquip"
                  checked={formData.needsEquipment}
                  onChange={(e) => setFormData({ ...formData, needsEquipment: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
                <label htmlFor="needsEquip" className="text-xs text-cyan-200 cursor-pointer">
                  Include complimentary rental skates, helmet, knee & wrist pads for this session
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Generate Free VIP Pass</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Step 2: Instant Ticket Pass Generator */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center mx-auto mb-4 text-black shadow-lg shadow-cyan-400/30 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold font-['Outfit'] text-white">
              Trial Session Reserved!
            </h3>
            <p className="text-gray-300 text-sm mt-1 mb-6">
              We look forward to seeing you at Strategy Skate Academy. Present this VIP pass at the reception counter.
            </p>

            {/* Ticket Card Component */}
            <div className="max-w-md mx-auto bg-gradient-to-b from-gray-900 to-[#12192f] border-2 border-dashed border-cyan-400/60 rounded-2xl p-6 text-left shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <div className="text-xs text-cyan-400 font-extrabold uppercase tracking-widest">
                    STRATEGY SKATE ACADEMY
                  </div>
                  <div className="font-extrabold text-lg text-white font-['Outfit']">
                    VIP FREE TRIAL PASS
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-400">PASS ID</div>
                  <div className="font-mono text-cyan-300 font-bold text-sm">
                    {bookingTicket?.ticketId}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 text-xs mb-4">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">GUEST NAME</span>
                  <span className="font-bold text-white text-sm">{bookingTicket?.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">PROGRAM</span>
                  <span className="font-semibold text-cyan-300">{bookingTicket?.programType}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">TIME SLOT</span>
                  <span className="font-semibold text-white">{bookingTicket?.timeSlot}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">RENTAL GEAR</span>
                  <span className="font-semibold text-pink-400">
                    {bookingTicket?.needsEquipment ? `Size: ${bookingTicket?.skateSize} (Reserved)` : 'Own Skates'}
                  </span>
                </div>
              </div>

              <div className="bg-cyan-500/10 rounded-lg p-2.5 text-[11px] text-cyan-200 border border-cyan-500/20 text-center">
                📍 Location: 450 Arena Boulevard, Indoor Speed Track Hub
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={resetAndClose}
                className="btn-primary"
              >
                <span>Done & Return to Site</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
