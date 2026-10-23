import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight,
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
  ChevronLeft,
  ChevronDown,
  X,
  Mail,
  Phone,
  CreditCard,
  Building2,
  Lock, 
  Shield,
  MessageSquare,
  Bot
} from 'lucide-react';
import { publicApi } from '../services/api';
import { TRIAL_PAYMENT_LINK, buildTrialPaymentUrl, TEAM_WHATSAPP_NUMBER } from '../config/payments';
import { saveTrialLead, updateTrialLead } from '../utils/trialLeadsData';

// The booking is kept here while the visitor is on the payment page, so the thank-you page can show their pass.
const PENDING_BOOKING_KEY = 'strategy_pending_trial_booking';
import { format10DigitPhone, validate10DigitPhone, validateGmail } from '../utils/validation';

// WhatsApp link with the booking details already typed in, so the visitor only taps Send
function trialWhatsAppLink(t) {
  const lines = [
    'Hi STRATEGY team! 👋 I just booked a skating trial class.',
    t.name && `Name: ${t.name}`,
    (t.date || t.timeSlot) && `Date: ${[t.date, t.timeSlot].filter(Boolean).join(' · ')}`,
    (t.location || t.rink) && `Location: ${t.location || t.rink}`,
    t.ageGroup && `Age group: ${t.ageGroup}`,
    `Payment: ${t.paidOnline || !t.id ? '30 AED paid online' : t.paymentInfo || '30 AED'}`,
    t.id && `Booking no: ${t.id}`,
    '',
    'I would like to know more about:',
  ].filter((l) => l !== false && l !== undefined && l !== null);
  return `https://wa.me/${TEAM_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

function readPendingBooking() {
  try {
    const saved = JSON.parse(localStorage.getItem(PENDING_BOOKING_KEY) || 'null');
    return saved?.pass ? saved : null;
  } catch {
    return null;
  }
}

export default function FreeTrialPage({ navigateTo, paymentReturn = false }) {
  // On the thank-you page: the booking saved just before going to the payment page (if any)
  const [returnBooking] = useState(() => (paymentReturn ? readPendingBooking() : null));
  // Paid on another device/browser, or the page was opened again later: still say thank you
  const returnedWithoutBooking = paymentReturn && !returnBooking;

  const [vipPerk, setVipPerk] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(() => !!returnBooking);
  const [ticketData, setTicketData] = useState(() => (returnBooking ? { ...returnBooking.pass, paidOnline: true } : null));


  // Location schedule configurations
  const LOCATION_CONFIGS = {
    'Al Nahyan': {
      id: 'Al Nahyan',
      name: 'AL NAHYAN',
      rink: 'Al Nahyan Sports Arena Rink',
      allowedDays: [0, 6], // Sunday (0), Saturday (6)
      allowedDaysLabel: 'Saturday & Sunday',
      timeWindowBadge: '10:00 AM – 12:00 PM Window',
      slots: [
        { id: '10:00 AM - 11:00 AM', label: 'Slot 1', time: '10:00 AM - 11:00 AM', sub: 'Morning Session' },
        { id: '11:00 AM - 12:00 PM', label: 'Slot 2', time: '11:00 AM - 12:00 PM', sub: 'Midday Session' }
      ]
    },
    'Al Bateen': {
      id: 'Al Bateen',
      name: 'AL BATEEN',
      rink: 'Al Bateen Waterfront Arena',
      allowedDays: [3, 4, 5], // Wednesday (3), Thursday (4), Friday (5)
      allowedDaysLabel: 'Wednesday, Thursday & Friday',
      timeWindowBadge: '5:00 PM Evening Window',
      slots: [
        { id: '5:00 PM - 6:00 PM', label: 'Slot 1', time: '5:00 PM - 6:00 PM', sub: 'Evening Session' }
      ]
    },
    'Khalifa City': {
      id: 'Khalifa City',
      name: 'KHALIFA CITY',
      rink: 'Khalifa City Roller Rink',
      allowedDays: [3, 6], // Wednesday (3), Saturday (6)
      allowedDaysLabel: 'Wednesday & Saturday',
      timeWindowBadge: '5:00 PM Evening Window',
      slots: [
        { id: '5:00 PM - 6:00 PM', label: 'Slot 1', time: '5:00 PM - 6:00 PM', sub: 'Evening Session' }
      ]
    }
  };

  // Booking Modal State: 0 (Pre-Check Questions), 1 (Contact & Date), 2 (Candidate Details), 3 (Payment)
  const [bookingStep, setBookingStep] = useState(null); 

  // Initial Assessment Questions (When clicking Confirm Trial Pass)
  const [preCheckStep, setPreCheckStep] = useState(1); // 1 = Question 1 (Experience), 2 = Question 2 (Skates)
  const [hasSkatingExperience, setHasSkatingExperience] = useState('no'); // 'yes' | 'no'
  const [hasOwnSkates, setHasOwnSkates] = useState('no'); // 'yes' | 'no'
  const [questionSlideDir, setQuestionSlideDir] = useState('right'); // 'right' | 'left'
  const [isAnswering, setIsAnswering] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Step 1: Contact & Date & Location
  const [selectedLocation, setSelectedLocation] = useState('Al Nahyan');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [selectedDay, setSelectedDay] = useState(3);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM - 11:00 AM');

  // Step 2: Candidate Details
  const [candidateName, setCandidateName] = useState('');
  const [ageGroup, setAgeGroup] = useState('Ages 8-15');
  const [skateStyle, setSkateStyle] = useState('inline');
  const [skateSize, setSkateSize] = useState('EU 38 (UK 5 / US 6)');
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Back from the payment page (/thank-you): mark the booking as paid and forget the saved copy.
  // (Reading the booking happens once, below the component's first lines, so it's safe to run twice.)
  useEffect(() => {
    if (!paymentReturn) return;
    if (returnBooking?.leadId) {
      updateTrialLead(returnBooking.leadId, { paymentStatus: 'paid', paidAt: new Date().toISOString() });
    }
    try {
      localStorage.removeItem(PENDING_BOOKING_KEY);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0 });
  }, [paymentReturn, returnBooking]);

  const months = ['October 2026', 'November 2026'];
  const skateSizesList = [
    'EU 28-30 (Kids UK 10-12)',
    'EU 31-34 (Kids UK 13-2)',
    'EU 35-37 (UK 3-4 / US 4-5)',
    'EU 38 (UK 5 / US 6)',
    'EU 39 (UK 6 / US 7)',
    'EU 40-41 (UK 7-8 / US 8-9)',
    'EU 42-44 (UK 9-10 / US 10-11)',
    'EU 45+ (UK 11+ / US 12+)'
  ];

  const getCalendarDays = (monthIndex, locationKey) => {
    const year = 2026;
    const month = monthIndex === 0 ? 9 : 10; // 9=Oct, 10=Nov
    const totalDays = monthIndex === 0 ? 31 : 30;
    const locationConfig = LOCATION_CONFIGS[locationKey] || LOCATION_CONFIGS['Al Nahyan'];

    const firstDate = new Date(year, month, 1);
    const firstDayOfWeek = firstDate.getDay();
    const leadingPadding = (firstDayOfWeek + 6) % 7; // Convert to Monday-first (0=Mon...6=Sun)

    const prevMonthTotalDays = monthIndex === 0 ? 30 : 31;
    const days = [];

    for (let i = leadingPadding - 1; i >= 0; i--) {
      days.push({
        dayNumber: prevMonthTotalDays - i,
        isCurrentMonth: false,
        isAllowed: false,
      });
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      const dayOfWeek = dateObj.getDay();
      const isAllowed = locationConfig.allowedDays.includes(dayOfWeek);
      days.push({
        dayNumber: d,
        isCurrentMonth: true,
        isAllowed,
        dayOfWeek
      });
    }

    return days;
  };

  const handleLocationChange = (locKey) => {
    setSelectedLocation(locKey);
    const locConfig = LOCATION_CONFIGS[locKey] || LOCATION_CONFIGS['Al Nahyan'];
    
    // Auto-update time slot if current selected slot is not in new location's slots
    const validSlotIds = locConfig.slots.map((s) => s.id);
    if (!validSlotIds.includes(selectedTimeSlot)) {
      setSelectedTimeSlot(locConfig.slots[0].id);
    }

    // Auto-update day if current selectedDay is not allowed for the new location
    const days = getCalendarDays(currentMonthIndex, locKey);
    const currentDayObj = days.find((d) => d.isCurrentMonth && d.dayNumber === selectedDay);
    if (!currentDayObj || !currentDayObj.isAllowed) {
      const firstValid = days.find((d) => d.isCurrentMonth && d.isAllowed);
      if (firstValid) {
        setSelectedDay(firstValid.dayNumber);
      }
    }
  };

  const handleMonthChange = (newMonthIdx) => {
    setCurrentMonthIndex(newMonthIdx);
    const days = getCalendarDays(newMonthIdx, selectedLocation);
    const currentDayObj = days.find((d) => d.isCurrentMonth && d.dayNumber === selectedDay);
    if (!currentDayObj || !currentDayObj.isAllowed) {
      const firstValid = days.find((d) => d.isCurrentMonth && d.isAllowed);
      if (firstValid) {
        setSelectedDay(firstValid.dayNumber);
      }
    }
  };

  const handleOpenBooking = () => {
    setEmailError('');
    setPhoneError('');
    setPaymentError('');

    // If client does not have skates, ensure Al Nahyan is default
    if (hasOwnSkates === 'no') {
      setSelectedLocation('Al Nahyan');
    }

    // Ensure valid day and time slot for selected location
    const activeLoc = hasOwnSkates === 'no' ? 'Al Nahyan' : selectedLocation;
    const days = getCalendarDays(currentMonthIndex, activeLoc);
    const currentDayObj = days.find((d) => d.isCurrentMonth && d.dayNumber === selectedDay);
    if (!currentDayObj || !currentDayObj.isAllowed) {
      const firstValid = days.find((d) => d.isCurrentMonth && d.isAllowed);
      if (firstValid) {
        setSelectedDay(firstValid.dayNumber);
      }
    }
    const locConfig = LOCATION_CONFIGS[activeLoc] || LOCATION_CONFIGS['Al Nahyan'];
    if (!locConfig.slots.some((s) => s.id === selectedTimeSlot)) {
      setSelectedTimeSlot(locConfig.slots[0].id);
    }

    // Open directly to Question 1 of the assessment
    setPreCheckStep(1);
    setQuestionSlideDir('right');
    setIsAnswering(false);
    setSelectedAnswer(null);
    setBookingStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerQuestion1 = (answer) => {
    if (isAnswering) return;
    setIsAnswering(true);
    setSelectedAnswer(answer);
    setHasSkatingExperience(answer);
    setQuestionSlideDir('right');
    setTimeout(() => {
      setPreCheckStep(2);
      setIsAnswering(false);
      setSelectedAnswer(null);
    }, 380);
  };

  const handleBackToQuestion1 = () => {
    if (isAnswering) return;
    setQuestionSlideDir('left');
    setPreCheckStep(1);
    setSelectedAnswer(null);
    setIsAnswering(false);
  };

  const handleAnswerQuestion2 = (answer) => {
    if (isAnswering) return;
    setIsAnswering(true);
    setSelectedAnswer(answer);
    setHasOwnSkates(answer);
    if (answer === 'no') {
      setSelectedLocation('Al Nahyan');
      handleLocationChange('Al Nahyan');
    }
    setTimeout(() => {
      setBookingStep(1);
      setIsAnswering(false);
      setSelectedAnswer(null);
    }, 380);
  };

  const handleNextToCandidate = (e) => {
    if (e) e.preventDefault();
    
    // Strictly require @gmail.com email
    const emailVal = validateGmail(clientEmail);
    if (!emailVal.isValid) {
      setEmailError(emailVal.error);
      return;
    }
    setEmailError('');

    // Strictly require 9 digits UAE phone number
    const phoneVal = validate10DigitPhone(clientPhone);
    if (!phoneVal.isValid) {
      setPhoneError(phoneVal.error);
      return;
    }
    setPhoneError('');

    setBookingStep(2);
  };

  // Builds the visitor's trial pass from what they filled in
  const buildPass = () => {
    const nameToUse = candidateName.trim();
    const emailToUse = clientEmail.trim();
    let phoneToUse = clientPhone.trim();
    if (phoneToUse && !phoneToUse.startsWith('+971')) phoneToUse = `+971 ${phoneToUse}`;
    const activeLoc = LOCATION_CONFIGS[selectedLocation] || LOCATION_CONFIGS['Al Nahyan'];
    const dateObj = new Date(2026, currentMonthIndex === 0 ? 9 : 10, selectedDay);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    return {
      id: 'APX-' + Math.floor(100000 + Math.random() * 900000),
      name: nameToUse,
      email: emailToUse,
      phone: phoneToUse,
      ageGroup,
      skateStyle: 'Inline Speed Skates',
      skateSize: hasOwnSkates === 'yes' ? `${skateSize} (Own Skates Brought)` : `${skateSize} (Rental Skates)`,
      hasExperience: hasSkatingExperience === 'yes' ? 'Yes (Has Skating Experience)' : 'No (First Timer)',
      hasSkates: hasOwnSkates === 'yes' ? 'Yes (Own Skates)' : 'No (Rental Skates Provided)',
      price: '30.00 AED',
      location: activeLoc.name,
      dayName,
      date: `${dayName}, ${months[currentMonthIndex].split(' ')[0]} ${selectedDay}, 2026`,
      timeSlot: selectedTimeSlot,
      time: `${selectedTimeSlot} (45-Min Session)`,
      coach: 'Certified World Skate Coach',
      rink: `${activeLoc.name} Arena • ${activeLoc.rink}`,
      paymentMethod: 'Paid online',
      paymentInfo: 'Paid online • 30.00 AED',
    };
  };

  // "Proceed to payment": save the booking, then send the visitor to the payment link.
  const handleNextToPayment = async (e) => {
    if (e) e.preventDefault();
    setPaymentError('');

    if (!candidateName.trim()) {
      setPaymentError("Please enter the skater's name.");
      return;
    }
    if (!TRIAL_PAYMENT_LINK) {
      setPaymentError('Online payment is not set up yet. Please contact us on WhatsApp to book your trial.');
      return;
    }

    setIsProcessing(true);
    const pass = buildPass();

    // Save it for the admin's "Trial requests" (marked as payment not finished until they come back)
    const lead = saveTrialLead('skating', {
      name: pass.name,
      email: pass.email,
      phone: clientPhone.trim(),
      ageGroup,
      programType: 'Skating trial class (30 AED)',
      experience: hasSkatingExperience === 'yes' ? 'Has skated before' : 'First timer',
      timeSlot: `${pass.date} · ${pass.timeSlot}`,
      location: pass.location,
      skateSize,
      needsEquipment: hasOwnSkates !== 'yes',
      ticketId: pass.id,
      paymentStatus: 'pending',
    });

    try {
      localStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify({ pass, leadId: lead?.id, createdAt: Date.now() }));
    } catch {
      // storage unavailable: the thank-you page will show a general message instead
    }

    try {
      await publicApi.submitEnquiry({
        participantName: pass.name,
        customerEmail: pass.email,
        customerPhone: pass.phone,
        programTitle: 'Inline & Quad Skating Trial Academy',
        preferredDay: pass.dayName,
        preferredTime: pass.timeSlot,
      });
    } catch {
      // booking server offline: the payment and the saved booking are what matter
    }

    window.location.href = buildTrialPaymentUrl(TRIAL_PAYMENT_LINK, { bookingId: pass.id, email: pass.email });
  };

  return (
    <div className="trial-page-root">
      
      {/* Top Mobile/App Header Bar */}
      {/* Clean Top Navigation Bar */}
      <div className="trial-app-bar">
        <div className="trial-app-bar-inner">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isSubmitted) {
                  setIsSubmitted(false);
                  setTicketData(null);
                }
                navigateTo('trial');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              <span>Back to Selection</span>
            </button>

            <button
              onClick={() => {
                navigateTo('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <span>Home</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container - Responsive 2-Column on Desktop/Laptop, 1-Column on Mobile */}
      <div className="trial-container">

        {/* =========================================================================
           VIEW: TICKET PASS CONFIRMATION (When submitted)
           ========================================================================= */}
        {returnedWithoutBooking ? (
          <div className="max-w-xl mx-auto w-full py-10 text-center space-y-4 animate-fadeIn" id="trial-thank-you-generic">
            <div className="inline-flex p-3.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-['Outfit'] text-gray-900">THANK YOU!</h2>
            <p className="text-base text-gray-600">We&apos;re excited to see you on the court.</p>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Your payment for the skating trial class was received. Message our team on WhatsApp to confirm your date and time.
            </p>
            <a
              href={trialWhatsAppLink({})}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-sm shadow-sm"
            >
              <MessageSquare className="w-5 h-5" />
              Chat with our team on WhatsApp
            </a>
            <button
              onClick={() => {
                navigateTo('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-900 font-bold text-sm text-white"
            >
              Return to Home
            </button>
          </div>
        ) : isSubmitted && ticketData ? (
          <div className="max-w-md mx-auto w-full py-8 animate-fadeIn" id="trial-thank-you">
            <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-sm p-6 sm:p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-gray-900">
                Thank you{ticketData.name ? `, ${ticketData.name.split(' ')[0]}` : ''}!
              </h2>
              <p className="mt-1 text-base text-gray-600">We&apos;re excited to see you on the court.</p>

              <blockquote className="mt-5 px-4 py-3 rounded-2xl bg-blue-50/70 text-blue-900 text-sm italic">
                &ldquo;Every champion was once a beginner who refused to give up.&rdquo;
              </blockquote>

              {/* Booking summary */}
              <dl className="mt-6 text-left text-sm ring-1 ring-slate-200 rounded-2xl divide-y divide-slate-100">
                {[
                  ['Date', [ticketData.date, ticketData.timeSlot].filter(Boolean).join(' · ')],
                  ['Payment', ticketData.paidOnline ? '30 AED · Paid' : ticketData.paymentInfo || '30 AED'],
                  ['Age', ticketData.ageGroup],
                  ['Location', ticketData.location || ticketData.rink],
                ]
                  .filter(([, v]) => v)
                  .map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-4 px-4 py-3">
                      <dt className="text-gray-500">{label}</dt>
                      <dd className="font-bold text-gray-900 text-right">{value}</dd>
                    </div>
                  ))}
              </dl>

              {/* WhatsApp: message already written, the visitor only taps Send */}
              <a
                id="trial-whatsapp-team"
                href={trialWhatsAppLink(ticketData)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-sm shadow-sm"
              >
                <MessageSquare className="w-5 h-5" />
                Chat with our team on WhatsApp
              </a>
              <p className="mt-2 text-xs text-gray-500">
                Want to know more about anything? Your booking details are already in the message, just tap Send.
              </p>

              <button
                onClick={() => {
                  navigateTo('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-5 text-sm font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-2"
              >
                Back to home
              </button>
            </div>
          </div>
        ) : (
          /* =========================================================================
             VIEW: FULL TRIAL PAGE (2-Column Desktop Grid / 1-Column Mobile)
             ========================================================================= */
          <div className="trial-grid-layout animate-fadeIn">
            
            {/* LEFT COLUMN: Hero Overview & Curriculum */}
            <div className="flex flex-col gap-5">
              
              {/* Top Urgency Badge */}
              <div className="flex items-center justify-between">
                <span className="trial-badge-blue">
                  <Flame className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                  12 SPOTS LEFT THIS WEEK • 30 AED SPECIAL
                </span>
                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Certified World Skate
                </span>
              </div>

              {/* Main Header */}
              <div>
                <h1 className="trial-title-main">
                  EXPERIENCE THE MAGIC ON WHEELS
                </h1>
                <p className="trial-subtitle-main">
                  Your first 45-minute glide session with skates, pro-grade safety helmet, protective armor (wrist, elbow & knee pads), and 1:1 certified coaching for just <strong className="text-blue-600">30 Dirhams (30 AED)</strong>.
                </p>
              </div>

              {/* Video Hero Thumbnail Card */}
              <div className="trial-video-card">
                <img 
                  src="/images/banner_2.jpg" 
                  alt="Skating Session" 
                  className="trial-video-img"
                />
                <div className="trial-video-overlay">
                  <div className="flex items-center">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-blue-600 text-white flex items-center gap-1 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      Live Coach Demo
                    </span>
                  </div>

                  <button 
                    type="button"
                    onClick={handleOpenBooking}
                    className="trial-play-btn"
                    title="Watch Video / Book Trial"
                  >
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-white/95 font-medium">
                    <Clock className="w-3.5 h-3.5 text-cyan-300" />
                    <span>03:48 • Watch What Happens in Your 45-Min Trial</span>
                  </div>
                </div>
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
                      <p className="text-[11px] text-blue-600 font-semibold">4-Step Guided Rink Progress</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5 shadow-sm">
                    <Clock className="w-3 h-3 text-blue-600" /> 45-min Session
                  </span>
                </div>

                {/* Module 1 */}
                <div className="trial-module-row">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="trial-module-num">01</span>
                      <span className="font-bold text-sm text-slate-900">Stance & Balance Lock</span>
                    </div>
                    <span className="trial-module-duration">10 min</span>
                  </div>
                  <p className="trial-module-desc">
                    Zero-gravity 8-point foot plant and roll-resistance adjustment to ensure no slipping while first standing up.
                  </p>
                </div>

                {/* Module 2 */}
                <div className="trial-module-row">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="trial-module-num">02</span>
                      <span className="font-bold text-sm text-slate-900">Safe Fall & Pad Recovery</span>
                    </div>
                    <span className="trial-module-duration">10 min</span>
                  </div>
                  <p className="trial-module-desc">
                    How to safely drop onto pads without panic or impact shock to wrists, elbows, or tailbone.
                  </p>
                </div>

                {/* Module 3 */}
                <div className="trial-module-row">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="trial-module-num">03</span>
                      <span className="font-bold text-sm text-slate-900">Forward Stride & Braking</span>
                    </div>
                    <span className="trial-module-duration">15 min</span>
                  </div>
                  <p className="trial-module-desc">
                    45-degree power push glide, smooth transition to heel/toe stops with balance stability.
                  </p>
                </div>

                {/* Module 4 */}
                <div className="trial-module-row">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="trial-module-num">04</span>
                      <span className="font-bold text-sm text-slate-900">Rhythm Weave & Obstacles</span>
                    </div>
                    <span className="trial-module-duration">10 min</span>
                  </div>
                  <p className="trial-module-desc">
                    5-cone slalom drills to build agility, control, and muscle memory at cruising speed.
                  </p>
                </div>

                {/* Rental Gear Guarantee Callout */}
                <div className="trial-gear-box mt-3.5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs text-blue-950 leading-relaxed">
                    <strong className="text-blue-900 font-bold block mb-0.5">Rental Gear Guarantee Included:</strong>
                    Size-matched Quads or Inline Skates + full triple-pad safety kit thoroughly disinfected & safety-checked before every session.
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Sticky Pass & Reservation Card (Clean Blue & White UI) */}
            <div className="trial-sidebar-sticky">
              
              <div className="trial-card">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <h3 className="font-extrabold text-sm tracking-wide uppercase font-['Outfit'] text-gray-900">
                      TRIAL PASS & HOLD
                    </h3>
                  </div>
                  <span className="trial-badge-blue">
                    30 AED Promo
                  </span>
                </div>

                {/* VIP Perks Checkbox */}
                <div className="trial-vip-card mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="trial-vip-icon">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">VIP Fast-Track Arena Perks</div>
                      <div className="text-[11px] text-gray-500">Soundtrack request lounge & locker pass</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={vipPerk}
                    onChange={(e) => setVipPerk(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="trial-price-container">
                  <div className="trial-price-row">
                    <span className="trial-price-label">45-min Pro Coaching Fee</span>
                    <div className="trial-price-values">
                      <span className="trial-price-old">AED 120.00</span>
                      <span className="trial-price-current">30.00 AED</span>
                    </div>
                  </div>
                  
                  <div className="trial-price-row">
                    <span className="trial-price-label">Pro Skates & Safety Armor Pad Kit</span>
                    <div className="trial-price-values">
                      <span className="trial-price-old">AED 35.00</span>
                      <span className="trial-price-badge">INCLUDED</span>
                    </div>
                  </div>
                  
                  <div className="trial-price-row">
                    <span className="trial-price-label">Arena Rink Access & Lock Deposit</span>
                    <div className="trial-price-values">
                      <span className="trial-price-free">FREE</span>
                    </div>
                  </div>
                </div>

                {/* Total Due Box */}
                <div className="trial-total-box">
                  <div>
                    <div className="trial-total-label">Total Due Today</div>
                    <div className="trial-total-sub">30 Dirhams only</div>
                  </div>
                  <div className="trial-total-amount">
                    30.00 <span className="trial-total-currency">AED</span>
                  </div>
                </div>


                {/* Big Royal Blue Action Button */}
                <button
                  type="button"
                  onClick={handleOpenBooking}
                  className="trial-btn-primary"
                >
                  <span>CONFIRM TRIAL PASS • 30 AED</span>
                  <Zap className="w-4 h-4 fill-white" />
                </button>


              </div>

            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
         INTERACTIVE BOOKING MODAL: STEP 1 (Contact & Date) + STEP 2 (Candidate Details)
         ========================================================================= */}
      {bookingStep !== null && (
        <div className="booking-modal-overlay">
          <div className="booking-modal-card">
            
            {/* Modal Header */}
            <div className="booking-step-indicator">
              <div className="flex items-center gap-2">
                {bookingStep === 0 ? (
                  <>
                    <style>{`
                      .pq-steps { display: flex; gap: 4px; }
                      .pq-steps span { width: 22px; height: 5px; border-radius: 9999px; background: #e2e8f0; transition: background .3s ease; }
                      .pq-steps span.on { background: #2563eb; }
                      .pq-head-label { font-size: 13px; font-weight: 600; color: #64748b; }
                      .pq-head-label b { color: #0f172a; font-weight: 800; font-family: 'Outfit', sans-serif; }
                      .pq-body { text-align: center; padding: 6px 0 2px; }
                      .pq-icon { width: 56px; height: 56px; margin: 4px auto 14px; border-radius: 18px; display: flex; align-items: center; justify-content: center; color: #fff;
                        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); box-shadow: 0 12px 26px -10px rgba(37, 99, 235, .7); }
                      .pq-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: #2563eb; }
                      .pq-title { margin: 6px auto 8px; max-width: 360px; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: clamp(20px, 5vw, 24px); line-height: 1.2; color: #0f172a; }
                      .pq-sub { margin: 0 auto 22px; max-width: 340px; font-size: 13.5px; line-height: 1.55; color: #64748b; }
                      .pq-options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                      .pq-option { position: relative; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 22px 10px 18px; border-radius: 18px;
                        background: #fff; box-shadow: inset 0 0 0 1.5px #e2e8f0, 0 1px 2px rgba(15, 23, 42, .05); cursor: pointer;
                        transition: transform .18s ease, box-shadow .2s ease, background .2s ease, opacity .2s ease; }
                      @media (hover: hover) { .pq-option:hover:not(:disabled) { transform: translateY(-3px); box-shadow: inset 0 0 0 2px #2563eb, 0 16px 30px -16px rgba(37, 99, 235, .6); } .pq-option:hover:not(:disabled) .pq-emoji { transform: scale(1.08) rotate(-6deg); background: #dbeafe; } }
                      .pq-option:active:not(:disabled) { transform: scale(.97); }
                      .pq-option:focus-visible { outline: 3px solid rgba(37, 99, 235, .35); outline-offset: 2px; }
                      .pq-option.on { background: #eff6ff; box-shadow: inset 0 0 0 2px #2563eb, 0 16px 30px -16px rgba(37, 99, 235, .6); }
                      .pq-options.busy .pq-option:not(.on) { opacity: .45; }
                      .pq-option:disabled { cursor: default; }
                      .pq-emoji { width: 58px; height: 58px; margin-bottom: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
                        font-size: 28px; background: #f1f5f9; transition: transform .25s ease, background .25s ease; }
                      .pq-option.on .pq-emoji { transform: scale(1.08) rotate(-6deg); background: #dbeafe; }
                      .pq-label { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 20px; color: #0f172a; line-height: 1.1; }
                      .pq-option.on .pq-label { color: #1d4ed8; }
                      .pq-hint { font-size: 12px; font-weight: 600; color: #64748b; }
                      .pq-radio { position: absolute; top: 10px; right: 10px; width: 20px; height: 20px; border-radius: 50%; box-shadow: inset 0 0 0 2px #cbd5e1;
                        display: flex; align-items: center; justify-content: center; color: #fff; transition: all .2s ease; }
                      .pq-option.on .pq-radio { background: #2563eb; box-shadow: none; }
                      .pq-foot { margin-top: 18px; min-height: 34px; display: flex; align-items: center; justify-content: center; }
                      .pq-note { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #94a3b8; }
                      .pq-saving { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: #2563eb; }
                      .pq-back { display: inline-flex; align-items: center; gap: 4px; padding: 7px 12px; border-radius: 10px; font-size: 12.5px; font-weight: 700; color: #475569; cursor: pointer; transition: all .2s ease; }
                      .pq-back:hover { background: #f1f5f9; color: #1d4ed8; }
                    `}</style>
                    <div className="pq-steps" aria-hidden="true">
                      <span className="on" />
                      <span className={preCheckStep >= 2 ? 'on' : ''} />
                    </div>
                    <span className="pq-head-label">
                      Step {preCheckStep} of 2 · <b>{preCheckStep === 1 ? 'Skating experience' : 'Skates & equipment'}</b>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="booking-step-pill">
                      Step {bookingStep} of 2
                    </span>
                    <span className="font-extrabold text-sm font-['Outfit'] text-gray-900">
                      {bookingStep === 1 
                        ? 'Contact & Session Date' 
                        : bookingStep === 2 
                        ? 'Candidate Details' 
                        : 'Select Payment Method'}
                    </span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setBookingStep(null);
                  setIsAnswering(false);
                  setSelectedAnswer(null);
                }}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 0: TWO QUICK PRE-CHECK QUESTIONS (TAP AN ANSWER TO AUTO-ADVANCE) */}
            {bookingStep === 0 && (() => {
              const q = preCheckStep === 1
                ? {
                    key: 'question-1',
                    Icon: Sparkles,
                    eyebrow: 'Quick pre-check',
                    title: 'Does your child have any skating experience?',
                    sub: 'This helps our certified coach plan drills at the right comfort and balance level.',
                    onAnswer: handleAnswerQuestion1,
                    saving: 'Got it — next question…',
                    options: [
                      { value: 'yes', emoji: '🛼', label: 'Yes', hint: 'Has skated before' },
                      { value: 'no', emoji: '🌱', label: 'No', hint: 'First timer / beginner' },
                    ],
                  }
                : {
                    key: 'question-2',
                    Icon: ShieldCheck,
                    eyebrow: 'Last question',
                    title: 'Does your child have their own skates?',
                    sub: 'No skates? No problem — free sanitized rental skates and safety pads are provided at Al Nahyan.',
                    onAnswer: handleAnswerQuestion2,
                    saving: 'All set — opening the schedule…',
                    options: [
                      { value: 'yes', emoji: '⛸️', label: 'Yes', hint: "We'll bring our own" },
                      { value: 'no', emoji: '🎒', label: 'No', hint: 'Need rental skates' },
                    ],
                  };
              const { Icon } = q;
              return (
                <div
                  key={q.key}
                  className={`pq-body ${questionSlideDir === 'left' ? 'question-slide-in-left' : 'question-slide-in-right'}`}
                >
                  <div className="pq-icon"><Icon className="w-7 h-7" /></div>
                  <div className="pq-eyebrow">{q.eyebrow}</div>
                  <h2 className="pq-title">{q.title}</h2>
                  <p className="pq-sub">{q.sub}</p>

                  <div className={`pq-options ${isAnswering ? 'busy' : ''}`} role="radiogroup" aria-label={q.title}>
                    {q.options.map((o) => {
                      const on = selectedAnswer === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          disabled={isAnswering}
                          onClick={() => q.onAnswer(o.value)}
                          className={`pq-option ${on ? 'on' : ''}`}
                        >
                          <span className="pq-radio">{on && <Check className="w-3 h-3" />}</span>
                          <span className="pq-emoji" aria-hidden="true">{o.emoji}</span>
                          <span className="pq-label">{o.label}</span>
                          <span className="pq-hint">{o.hint}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pq-foot">
                    {isAnswering && selectedAnswer ? (
                      <span className="pq-saving"><CheckCircle2 className="w-4 h-4" /> {q.saving}</span>
                    ) : preCheckStep === 2 ? (
                      <button type="button" onClick={handleBackToQuestion1} className="pq-back">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                    ) : (
                      <span className="pq-note"><Lock className="w-3.5 h-3.5" /> Takes 10 seconds · tap an answer to continue</span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* STEP 1 FORM: Location, Email, Phone & Dynamic Location Calendar Date Picker */}
            {bookingStep === 1 && (
              <form onSubmit={handleNextToCandidate} className="space-y-4">


                
                {/* Select Location (Filtered by Question 2: hasOwnSkates) */}
                <div className="booking-input-group">
                  <div className="flex items-center justify-between mb-1">
                    <label className="booking-label" style={{ marginBottom: 0 }}>
                      Select Branch / Location *
                    </label>
                    {hasOwnSkates === 'no' ? (
                      <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Only Al Nahyan Available (Rental Skates)
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        All 3 Branches Available
                      </span>
                    )}
                  </div>

                  {hasOwnSkates === 'no' ? (
                    /* ONLY AL NAHYAN APPEARS WHEN CLIENT SAYS NO TO SKATES */
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => handleLocationChange('Al Nahyan')}
                        className="w-full p-3 rounded-xl border bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20 shadow-sm text-left flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black uppercase text-blue-700 tracking-wider">
                              AL NAHYAN
                            </div>
                            <div className="text-[11px] font-bold text-slate-700 mt-0.5">
                              Saturday & Sunday • 10:00 AM – 12:00 PM
                            </div>
                            <div className="text-[10px] text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
                              <span>✓ Free sanitized rental skates & protective kit provided here</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200">
                          SELECTED
                        </span>
                      </button>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
                        <span>Have your own skates?</span>
                        <button
                          type="button"
                          onClick={() => {
                            setHasOwnSkates('yes');
                          }}
                          className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                        >
                          Show Al Bateen & Khalifa City
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ALL 3 LOCATIONS APPEAR WHEN CLIENT SAYS YES TO SKATES */
                    <div className="grid grid-cols-3 gap-2">
                      {Object.keys(LOCATION_CONFIGS).map((locKey) => {
                        const loc = LOCATION_CONFIGS[locKey];
                        const isSelected = selectedLocation === locKey;
                        return (
                          <button
                            key={locKey}
                            type="button"
                            onClick={() => handleLocationChange(locKey)}
                            className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
                                : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className={`text-[11px] font-extrabold uppercase tracking-wide ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                                {loc.name}
                              </span>
                              <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                            </div>
                            <div className={`text-[10px] font-semibold leading-tight ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                              {loc.allowedDaysLabel}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* User Email */}
                <div className="booking-input-group">
                  <label className="booking-label">
                    Email Address *
                  </label>
                  <div className="booking-input-wrapper">
                    <Mail className="booking-input-icon" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. client@gmail.com"
                      value={clientEmail}
                      onChange={(e) => {
                        setClientEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      className="booking-input-with-icon"
                    />
                  </div>
                  {emailError && (
                    <div className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1.5 bg-red-50 p-2 rounded-lg border border-red-200">
                      <span>⚠️</span>
                      <span>{emailError}</span>
                    </div>
                  )}
                </div>

                {/* Contact Details / Phone with Fixed +971 Prefix (9 Digits Only) */}
                <div className="booking-input-group">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="booking-label" style={{ marginBottom: 0 }}>
                      UAE Mobile (9 Digits) *
                    </label>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {clientPhone.length}/9
                    </span>
                  </div>
                  <div className="booking-phone-wrapper">
                    <div className="booking-phone-prefix">
                      <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>+971</span>
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={9}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="50 123 4567"
                      value={clientPhone}
                      onChange={(e) => {
                        const digits = format10DigitPhone(e.target.value);
                        setClientPhone(digits);
                        if (phoneError) setPhoneError('');
                      }}
                      className="booking-phone-input"
                    />
                  </div>
                  {phoneError && (
                    <div className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1.5 bg-red-50 p-2 rounded-lg border border-red-200">
                      <span>⚠️</span>
                      <span>{phoneError}</span>
                    </div>
                  )}
                </div>

                {/* Small Calendar Box */}
                <div className="booking-input-group">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="booking-label" style={{ marginBottom: 0 }}>
                      Select Session Date *
                    </label>
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      {LOCATION_CONFIGS[selectedLocation].allowedDaysLabel}
                    </span>
                  </div>

                  <div className="small-calendar-box">
                    {/* Small Calendar Nav */}
                    <div className="small-calendar-nav">
                      <button
                        type="button"
                        onClick={() => handleMonthChange(0)}
                        disabled={currentMonthIndex === 0}
                        className={`p-1 rounded ${currentMonthIndex === 0 ? 'text-gray-300' : 'text-gray-700 hover:text-blue-600'}`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                        <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>{months[currentMonthIndex]}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleMonthChange(1)}
                        disabled={currentMonthIndex === 1}
                        className={`p-1 rounded ${currentMonthIndex === 1 ? 'text-gray-300' : 'text-gray-700 hover:text-blue-600'}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Small Calendar Grid */}
                    <div className="small-calendar-grid">
                      <div className="small-calendar-weekday">MO</div>
                      <div className="small-calendar-weekday">TU</div>
                      <div className="small-calendar-weekday">WE</div>
                      <div className="small-calendar-weekday">TH</div>
                      <div className="small-calendar-weekday">FR</div>
                      <div className="small-calendar-weekday">SA</div>
                      <div className="small-calendar-weekday">SU</div>

                      {getCalendarDays(currentMonthIndex, selectedLocation).map((day, idx) => {
                        if (!day.isCurrentMonth || !day.isAllowed) {
                          return (
                            <div
                              key={idx}
                              className="small-calendar-day muted"
                              title={!day.isCurrentMonth ? '' : `Not available at ${selectedLocation}`}
                            >
                              {day.dayNumber}
                            </div>
                          );
                        }
                        const isSelected = selectedDay === day.dayNumber;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedDay(day.dayNumber)}
                            className={`small-calendar-day ${isSelected ? 'active' : ''}`}
                          >
                            {day.dayNumber}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Dynamic Time Slot Selection Based on Selected Location */}
                <div className="booking-input-group">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="booking-label" style={{ marginBottom: 0 }}>
                      Select Time Slot *
                    </label>
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      {LOCATION_CONFIGS[selectedLocation].timeWindowBadge}
                    </span>
                  </div>

                  <div className={`grid ${LOCATION_CONFIGS[selectedLocation].slots.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2.5 mt-1.5`}>
                    {LOCATION_CONFIGS[selectedLocation].slots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot.id)}
                          className={`time-slot-card ${isSelected ? 'active' : ''}`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="time-slot-badge">{slot.label}</span>
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <div className="time-slot-time">{slot.time}</div>
                          <div className="time-slot-sub">{slot.sub}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button: Next to Candidate */}
                <button
                  type="submit"
                  className="trial-btn-primary mt-2"
                >
                  <span>Continue to Candidate Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2 FORM: Candidate Name, Age Group, Skate Style & Size */}
            {bookingStep === 2 && (
              <form onSubmit={handleNextToPayment} className="space-y-4">
                
                {/* Candidate Full Name */}
                <div className="booking-input-group">
                  <label className="booking-label">
                    Candidate / Skater Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Rodriguez"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="booking-input"
                  />
                </div>

                {/* Age Group */}
                <div className="booking-input-group">
                  <label className="booking-label">
                    Age Group *
                  </label>
                  <div className="booking-chip-group">
                    {['Ages 4-7', 'Ages 8-15', 'Adult 16+'].map((group) => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => setAgeGroup(group)}
                        className={`booking-chip-btn ${ageGroup === group ? 'active' : ''}`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>


                {/* Shoe / Skate Size Custom Dropdown */}
                <div className="booking-input-group" style={{ position: 'relative' }}>
                  <label className="booking-label">
                    Rental Skate Size (Included)
                  </label>
                  
                  <div
                    onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                    className={`custom-select-trigger ${isSizeDropdownOpen ? 'active' : ''}`}
                  >
                    <span className="font-bold text-slate-900 text-sm">{skateSize}</span>
                    <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform ${isSizeDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isSizeDropdownOpen && (
                    <div className="custom-select-dropdown">
                      {skateSizesList.map((size) => (
                        <div
                          key={size}
                          onClick={() => {
                            setSkateSize(size);
                            setIsSizeDropdownOpen(false);
                          }}
                          className={`custom-select-option ${skateSize === size ? 'selected' : ''}`}
                        >
                          <span className="text-sm font-semibold">{size}</span>
                          {skateSize === size && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {paymentError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">
                    {paymentError}
                  </div>
                )}

                {/* Action Buttons: Back + Proceed to Payment */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep(1)}
                    className="booking-back-btn"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    id="trial-proceed-to-payment"
                    disabled={isProcessing}
                    className="flex-1 trial-btn-primary disabled:opacity-70"
                  >
                    <span>{isProcessing ? 'Opening secure payment…' : 'Proceed to Payment (30 AED)'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-center text-[12px] font-semibold text-slate-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  You'll pay on our secure payment page, then come straight back here.
                </p>

              </form>
            )}


          </div>
        </div>
      )}

    </div>
  );
}
