import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  ShieldCheck, 
  Zap, 
  MapPin, 
  QrCode, 
  Printer, 
  Award, 
  Flame, 
  Check, 
  ChevronRight,
  X,
  Mail,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BasketballTrialPage({ navigateTo }) {
  const [vipPerk, setVipPerk] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  // Exclusive Basketball Location & Schedule per user specifications:
  // ONLY Al Nahyan Arena on Saturday, Sunday & Wednesday at 6:00 PM
  const BASKETBALL_LOCATION = {
    id: 'Al Nahyan',
    name: 'AL NAHYAN ARENA',
    arena: 'Al Nahyan Air-Conditioned Hardwood Court',
    days: ['Saturday', 'Sunday', 'Wednesday'],
    time: '6:00 PM',
    timeSlot: '6:00 PM - 7:00 PM (Evening Clinic)'
  };

  // Booking Modal States: null (closed), 1 (Direct Details & Day selection)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayName, setSelectedDayName] = useState('Saturday');

  // Candidate Info
  const [candidateName, setCandidateName] = useState('');
  const [ageGroup, setAgeGroup] = useState('Junior Hoops (Ages 5-9)');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenBooking = () => {
    setIsModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsModalOpen(false);
  };

  const handleCompleteBooking = (e) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsModalOpen(false);
      const ticketId = 'BBL-' + Math.floor(100000 + Math.random() * 900000);
      const pass = {
        id: ticketId,
        name: candidateName || 'Registered Athlete',
        email: clientEmail || 'client@gmail.com',
        phone: clientPhone || '+971 50 123 4567',
        ageGroup: ageGroup,
        ballPosition: '6:00 PM Evening Clinic',
        price: '100% FREE (0.00 AED)',
        date: `${selectedDayName} (October 2026)`,
        timeSlot: '6:00 PM - 7:00 PM',
        coach: 'Coach Marcus • FIBA Certified Lead Instructor',
        arena: 'Al Nahyan Basketball Arena (Air-Conditioned Hardwood Court)',
        paymentMethod: '100% Free Trial Pass (Zero Payment)'
      };
      setTicketData(pass);
      setIsSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  return (
    <div className="trial-page-root">
      
      {/* Top App Navigation Bar */}
      <div className="trial-app-bar">
        <div className="trial-app-bar-inner">
          <button
            onClick={() => {
              if (isSubmitted) {
                setIsSubmitted(false);
              } else {
                navigateTo('trial');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>{isSubmitted ? 'Book Another' : 'Back to Selection'}</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0035f5] flex items-center justify-center text-xs font-bold text-white shadow-sm">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="trial-container">

        {/* =========================================================================
           VIEW: TICKET PASS CONFIRMATION (When submitted)
           ========================================================================= */}
        {isSubmitted && ticketData ? (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-fadeIn py-4">
            
            {/* Success Celebration Header */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex p-3.5 rounded-full bg-blue-50 text-blue-600 mb-1 border border-blue-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold font-['Outfit'] text-gray-900">
                FREE TRIAL PASS CONFIRMED!
              </h2>
              <p className="text-sm text-gray-600">
                Your 60-minute trial session is confirmed for <strong>{ticketData.name}</strong> at Al Nahyan Arena. Molten match basketball and training jersey will be ready at court check-in.
              </p>
            </div>

            {/* Visual Digital Ticket Pass */}
            <div className="trial-card" style={{ border: '2px solid #2563eb', background: '#ffffff' }}>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <div>
                  <span className="trial-badge-blue" style={{ background: '#ecfdf5', color: '#059669', borderColor: '#a7f3d0' }}>
                    100% FREE PASS
                  </span>
                  <div className="text-xl font-extrabold font-['Outfit'] text-gray-900 mt-2">
                    {ticketData.name}
                  </div>
                  <div className="text-xs text-gray-500">{ticketData.email} • {ticketData.phone}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-gray-400">Pass Number</div>
                  <div className="font-mono font-bold text-sm text-blue-600">{ticketData.id}</div>
                </div>
              </div>

              {/* Pass Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                  <div className="text-gray-500 mb-1 flex items-center gap-1 text-[11px]">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Selected Day & Time</span>
                  </div>
                  <div className="font-extrabold text-blue-700 text-sm">{ticketData.date}</div>
                  <div className="font-bold text-blue-600 text-xs mt-0.5">{ticketData.timeSlot}</div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-gray-500 mb-1 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Trial Cost</span>
                  </div>
                  <div className="font-bold text-emerald-700 text-sm flex items-center gap-1.5">
                    <span>0.00 AED</span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">100% FREE ✓</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-0.5">No Payment Required</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-gray-500 mb-1 flex items-center gap-1 text-[11px]">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    <span>Division</span>
                  </div>
                  <div className="font-bold text-gray-900 text-sm">{ticketData.ageGroup}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-gray-500 mb-1 flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Location</span>
                  </div>
                  <div className="font-bold text-gray-900 text-sm">Al Nahyan Arena</div>
                </div>
              </div>

              {/* Arena Address */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-slate-700 mb-5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">{ticketData.arena}</div>
                  <div className="text-[11px] text-gray-600">Please arrive 15 minutes before 6:00 PM for court check-in and jersey fitting.</div>
                </div>
              </div>

              {/* QR Code Scan Area */}
              <div className="border-t border-dashed border-gray-200 pt-5 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-3 rounded-2xl border border-blue-200 shadow-sm mb-2">
                  <QrCode className="w-28 h-28 text-blue-900" />
                </div>
                <div className="text-[11px] text-gray-500 font-mono tracking-widest uppercase">
                  Scan at Al Nahyan Arena Front Desk
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 font-bold text-xs text-gray-800 flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4 text-gray-600" />
                <span>Print or Save Pass PDF</span>
              </button>

              <button
                onClick={() => {
                  navigateTo('basketball');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 trial-btn-primary"
              >
                <span>Explore Basketball Academy</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          /* =========================================================================
             VIEW: FULL BASKETBALL TRIAL PAGE
             ========================================================================= */
          <div className="trial-grid-layout animate-fadeIn">
            
            {/* LEFT COLUMN: Hero Overview & Curriculum */}
            <div className="flex flex-col gap-5">
              
              {/* Top Urgency Badge */}
              <div className="flex items-center justify-between">
                <span className="trial-badge-blue" style={{ background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>
                  <Flame className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  8 SPOTS LEFT THIS WEEK • 100% FREE PASS
                </span>
                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  FIBA Certified Coaching
                </span>
              </div>

              {/* Main Header */}
              <div>
                <h1 className="trial-title-main">
                  DOMINATE THE HARDWOOD COURT
                </h1>
                <p className="trial-subtitle-main">
                  Your first 60-minute intensive basketball clinic with FIBA-certified coaches, official Molten match basketballs, shooting mechanics, agility drills, and live court scrimmage for <strong className="text-emerald-600">100% FREE (0 AED)</strong>.
                </p>
              </div>

              {/* Video Hero Thumbnail Card */}
              <div className="trial-video-card">
                <img 
                  src="/images/basketball_video_poster.jpg" 
                  alt="Basketball Clinic" 
                  className="trial-video-img"
                />
                <div className="trial-video-overlay">
                  <div className="flex items-center">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-blue-600 text-white flex items-center gap-1 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      Live Coach Drill Demo
                    </span>
                  </div>

                  <button 
                    type="button"
                    onClick={handleOpenBooking}
                    className="trial-play-btn"
                    title="Watch Video / Claim Free Basketball Trial"
                  >
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-white/95 font-medium">
                    <Clock className="w-3.5 h-3.5 text-cyan-300" />
                    <span>04:15 • Watch What Happens in Your 60-Min Basketball Trial</span>
                  </div>
                </div>
              </div>

              {/* Feature Pills */}
              <div className="trial-feature-pills">
                <span className="trial-feature-pill">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> 1:1 & Team FIBA Coaching
                </span>
                <span className="trial-feature-pill">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Official Molten Pro Match Balls
                </span>
                <span className="trial-feature-pill">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Al Nahyan Arena • 6:00 PM
                </span>
              </div>

              {/* SECTION: WHAT YOU'LL MASTER */}
              <div className="trial-card trial-master-section">
                <div className="flex items-center justify-between border-b border-blue-100/80 pb-3.5 mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-700 to-blue-500 text-white font-black flex items-center justify-center text-xs shadow-sm">
                      <Sparkles className="w-4 h-4 text-cyan-200" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm tracking-wide uppercase font-['Outfit'] text-slate-900">
                        WHAT YOU'LL MASTER
                      </h3>
                      <p className="text-[11px] text-blue-600 font-semibold">4-Step Court Development Progress</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5 shadow-sm">
                    <Clock className="w-3 h-3 text-blue-600" /> 60-min Clinic
                  </span>
                </div>

                {/* Module 1 */}
                <div className="trial-module-row">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="trial-module-num">01</span>
                      <span className="font-bold text-sm text-slate-900">Footwork & Triple Threat Stance</span>
                    </div>
                    <span className="trial-module-duration">15 min</span>
                  </div>
                  <p className="trial-module-desc">
                    Elite baseline balance, low center of gravity, jab step reads, and ball protection fundamentals against high defensive pressure.
                  </p>
                </div>

                {/* Module 2 */}
                <div className="trial-module-row">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="trial-module-num">02</span>
                      <span className="font-bold text-sm text-slate-900">Dribble Agility & Crossovers</span>
                    </div>
                    <span className="trial-module-duration">15 min</span>
                  </div>
                  <p className="trial-module-desc">
                    High-low pound dribbles, change-of-pace hesitations, between-the-legs transitions, and fingertip ball control through cone ladders.
                  </p>
                </div>

                {/* Module 3 */}
                <div className="trial-module-row">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="trial-module-num">03</span>
                      <span className="font-bold text-sm text-slate-900">Shooting Form & Arc Mechanics</span>
                    </div>
                    <span className="trial-module-duration">15 min</span>
                  </div>
                  <p className="trial-module-desc">
                    B.E.E.F principles (Balance, Eyes, Elbow, Follow-through), set shot elevation, clean wrist flick, and catch-and-shoot rhythm.
                  </p>
                </div>

                {/* Module 4 */}
                <div className="trial-module-row">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="trial-module-num">04</span>
                      <span className="font-bold text-sm text-slate-900">Fast Break & Live 3v3 Scrimmage</span>
                    </div>
                    <span className="trial-module-duration">15 min</span>
                  </div>
                  <p className="trial-module-desc">
                    Transition passing, court spacing, pick-and-roll reads, and live game scrimmage guided with real-time coach feedback.
                  </p>
                </div>

                {/* Arena Gear Callout */}
                <div className="trial-gear-box mt-3.5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs text-blue-950 leading-relaxed">
                    <strong className="text-blue-900 font-bold block mb-0.5">Exclusive Location & Schedule:</strong>
                    Held strictly at <strong>Al Nahyan Arena</strong> on <strong>Saturday, Sunday & Wednesday at 6:00 PM</strong>.
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Sticky Pass & Reservation Card (100% Free Pass) */}
            <div className="trial-sidebar-sticky">
              
              <div className="trial-card">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <h3 className="font-extrabold text-sm tracking-wide uppercase font-['Outfit'] text-gray-900">
                      BASKETBALL TRIAL PASS & HOLD
                    </h3>
                  </div>
                  <span className="trial-badge-blue" style={{ background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>
                    100% FREE PASS
                  </span>
                </div>

                {/* Location & Days Callout Card */}
                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-950 mb-1">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Al Nahyan Arena Only</span>
                  </div>
                  <div className="text-[11px] text-blue-700 font-medium">
                    Every <strong>Saturday, Sunday & Wednesday</strong> at <strong>6:00 PM</strong>
                  </div>
                </div>

                {/* VIP Perks Checkbox */}
                <div className="trial-vip-card mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="trial-vip-icon">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">VIP Player Analytics Card</div>
                      <div className="text-[11px] text-gray-500">Shooting accuracy report & locker pass</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={vipPerk}
                    onChange={(e) => setVipPerk(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Price Breakdown (100% FREE) */}
                <div className="trial-price-container">
                  <div className="trial-price-row">
                    <span className="trial-price-label">60-min FIBA Clinic Fee</span>
                    <div className="trial-price-values">
                      <span className="trial-price-old">AED 120.00</span>
                      <span className="text-emerald-600 font-extrabold text-sm">FREE</span>
                    </div>
                  </div>
                  
                  <div className="trial-price-row">
                    <span className="trial-price-label">Official Match Ball & Training Jersey</span>
                    <div className="trial-price-values">
                      <span className="trial-price-old">AED 40.00</span>
                      <span className="trial-price-badge">INCLUDED</span>
                    </div>
                  </div>
                  
                  <div className="trial-price-row">
                    <span className="trial-price-label">Hardwood Court Arena Access</span>
                    <div className="trial-price-values">
                      <span className="trial-price-free">FREE</span>
                    </div>
                  </div>
                </div>

                {/* Total Due Box: 100% FREE */}
                <div className="trial-total-box" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
                  <div>
                    <div className="trial-total-label" style={{ color: '#065f46' }}>Total Due Today</div>
                    <div className="trial-total-sub" style={{ color: '#047857' }}>100% Free Pass • No Payment</div>
                  </div>
                  <div className="trial-total-amount" style={{ color: '#059669' }}>
                    0.00 <span className="trial-total-currency">AED</span>
                  </div>
                </div>

                {/* Big Action Button */}
                <button
                  type="button"
                  onClick={handleOpenBooking}
                  className="trial-btn-primary"
                  style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
                >
                  <span>CLAIM FREE BASKETBALL PASS</span>
                  <Zap className="w-4 h-4 fill-white" />
                </button>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* =========================================================================
         DIRECT BOOKING MODAL (NO QUESTIONS, 100% FREE, AL NAHYAN ONLY)
         ========================================================================= */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
            border: '2px solid #0035f5',
            position: 'relative',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>

            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              background: '#0035f5',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
                  100% FREE TRIAL PASS
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, margin: '2px 0 0 0', fontFamily: 'var(--font-heading)' }}>
                  Register Athlete Details
                </h3>
              </div>
              <button 
                onClick={handleCloseBooking}
                style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', padding: '6px', color: '#fff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <form onSubmit={handleCompleteBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Fixed Location Callout: AL NAHYAN ONLY */}
                <div style={{ padding: '14px', borderRadius: '14px', background: '#eff6ff', border: '1.5px solid #bfdbfe' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <MapPin size={16} color="#0035f5" />
                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>Location: Al Nahyan Arena Only</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    Al Nahyan Air-Conditioned Hardwood Court • Certified FIBA Training
                  </div>
                </div>

                {/* Day Selection: Saturday, Sunday, or Wednesday at 6:00 PM */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#0035f5', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Select Class Day (Held at 6:00 PM)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {BASKETBALL_LOCATION.days.map((day) => (
                      <div
                        key={day}
                        onClick={() => setSelectedDayName(day)}
                        style={{
                          padding: '12px 8px',
                          borderRadius: '12px',
                          border: selectedDayName === day ? '2px solid #0035f5' : '1px solid #e2e8f0',
                          background: selectedDayName === day ? '#eff6ff' : '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '13px', color: selectedDayName === day ? '#0035f5' : '#0f172a' }}>{day}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>6:00 PM</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Candidate Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                    Candidate Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. Rashid Al-Hameli"
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                {/* Age Division */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                    Age Division
                  </label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  >
                    <option value="Junior Hoops (Ages 5-9)">Junior Hoops (Ages 5-9)</option>
                    <option value="Youth Squad (Ages 10-14)">Youth Squad (Ages 10-14)</option>
                    <option value="High School & Adults (15+)">High School & Adults (15+)</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                    Parent / Athlete UAE Mobile
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                    Email Address (for Digital Pass PDF)
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="player@gmail.com"
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                {/* 100% Free Notice */}
                <div style={{ padding: '12px', borderRadius: '12px', background: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#065f46' }}>Total Fee Due:</span>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#059669' }}>0.00 AED (100% FREE)</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '14px',
                    background: '#0035f5',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0, 53, 245, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '6px'
                  }}
                >
                  <span>{isProcessing ? 'Generating Free Pass...' : 'Confirm Free Trial Pass (0 AED)'}</span>
                  <Zap size={16} fill="#fff" />
                </button>

              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
