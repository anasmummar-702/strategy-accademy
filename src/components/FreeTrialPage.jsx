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
import SkateTrialChatbot from './SkateTrialChatbot';
import { publicApi } from '../services/api';
import { format10DigitPhone, validate10DigitPhone, validateGmail } from '../utils/validation';

export default function FreeTrialPage({ navigateTo }) {
  const [vipPerk, setVipPerk] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleBotConfirmBooking = (botBooking) => {
    const ticketId = 'APX-' + Math.floor(100000 + Math.random() * 900000);
    const pass = {
      id: ticketId,
      name: botBooking.childName || 'Registered Skater',
      email: 'client@gmail.com',
      phone: '+971 50 123 4567',
      ageGroup: botBooking.age || 'Ages 8-15',
      skateStyle: 'Pro Inline & Quad Skates',
      skateSize: botBooking.shoeSize || 'EU 38 (UK 5 / US 6)',
      price: '30.00 AED',
      date: `${botBooking.day || 'Saturday'}, October 2026`,
      timeSlot: botBooking.time || '10:00 AM',
      time: `${botBooking.time || '10:00 AM'} (45-Min Session)`,
      coach: 'Coach Leo • Certified World Skate Coach',
      rink: `${botBooking.location || 'Dubai Marina Rink'} Floor 1`,
      paymentMethod: 'Trial Fee On-Rink (AED 30)',
      paymentInfo: 'Cash / Card at check-in desk'
    };
    setTicketData(pass);
  };

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

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'bank'
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardError, setCardError] = useState('');

  const [bankSenderName, setBankSenderName] = useState('');
  const [bankSenderBank, setBankSenderBank] = useState('');
  const [bankTxRef, setBankTxRef] = useState('');
  const [bankError, setBankError] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

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
    setCardError('');
    setBankError('');

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

  const handleNextToPayment = (e) => {
    if (e) e.preventDefault();
    setBookingStep(3);
  };

  const handleFinalPayment = (e) => {
    if (e) e.preventDefault();

    if (paymentMethod === 'card') {
      if (!cardHolder.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        setCardError('Please fill in all card details to complete payment');
        return;
      }
      setCardError('');
    } else {
      setBankError('');
    }

    setIsProcessing(true);

    setTimeout(async () => {
      const nameToUse = candidateName.trim() || 'Registered Skater';
      const emailToUse = clientEmail.trim() || 'skater@gmail.com';
      let phoneToUse = clientPhone.trim();
      if (phoneToUse && !phoneToUse.startsWith('+971')) {
        phoneToUse = `+971 ${phoneToUse}`;
      } else if (!phoneToUse) {
        phoneToUse = '+971 50 123 4567';
      }

      const ticketId = 'APX-' + Math.floor(100000 + Math.random() * 900000);
      const activeLoc = LOCATION_CONFIGS[selectedLocation] || LOCATION_CONFIGS['Al Nahyan'];
      const dateObj = new Date(2026, currentMonthIndex === 0 ? 9 : 10, selectedDay);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

      try {
        await publicApi.submitEnquiry({
          participantName: nameToUse,
          customerEmail: emailToUse,
          customerPhone: phoneToUse,
          programTitle: 'Inline & Quad Skating Trial Academy',
          preferredDay: dayName,
          preferredTime: selectedTimeSlot,
        });
      } catch (err) {
        console.warn('Backend enquiry submission fallback:', err.message);
      }

      const pass = {
        id: ticketId,
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
        date: `${dayName}, ${months[currentMonthIndex].split(' ')[0]} ${selectedDay}, 2026`,
        timeSlot: selectedTimeSlot,
        time: `${selectedTimeSlot} (45-Min Session)`,
        coach: 'Certified World Skate Coach',
        rink: `${activeLoc.name} Arena • ${activeLoc.rink}`,
        paymentMethod: paymentMethod === 'card' ? 'Credit / Debit Card' : 'UAE Direct Bank Transfer',
        paymentInfo: paymentMethod === 'card' 
          ? `Card •••• ${cardNumber.replace(/\s/g, '').slice(-4) || '4242'}`
          : 'UAE Direct Bank Transfer (Emirates NBD)'
      };

      setTicketData(pass);
      setIsProcessing(false);
      setBookingStep(null);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
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
        {isSubmitted && ticketData ? (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-fadeIn py-4">
            
            {/* Success Celebration Header */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex p-3.5 rounded-full bg-blue-50 text-blue-600 mb-1 border border-blue-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold font-['Outfit'] text-gray-900">
                TRIAL SESSION PASS CONFIRMED!
              </h2>
              <p className="text-sm text-gray-600">
                Your 45-minute trial pass (30 AED) is active for <strong>{ticketData.name}</strong>. Skates and full protective armor will be sanitized and waiting at rink check-in.
              </p>
            </div>

            {/* Visual Digital Ticket / Scanner Card */}
            <div className="trial-card" style={{ border: '2px solid #2563eb', background: '#ffffff' }}>
              
              {/* Ticket Top Ribbon */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <div>
                  <span className="trial-badge-blue">
                    OFFICIAL 30 AED PASS
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
                    <span>Selected Date & Time</span>
                  </div>
                  <div className="font-extrabold text-blue-700 text-sm">{ticketData.date}</div>
                  <div className="font-bold text-blue-600 text-xs mt-0.5">{ticketData.timeSlot}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-gray-500 mb-1 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Fee Paid • Status</span>
                  </div>
                  <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                    <span>30.00 AED</span>
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200">PAID ✓</span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium mt-0.5">{ticketData.paymentInfo || ticketData.paymentMethod}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-gray-500 mb-1 flex items-center gap-1 text-[11px]">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    <span>Age Group</span>
                  </div>
                  <div className="font-bold text-gray-900 text-sm">{ticketData.ageGroup}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-gray-500 mb-1 flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Skate Style & Size</span>
                  </div>
                  <div className="font-bold text-gray-900 text-sm">{ticketData.skateSize}</div>
                </div>
              </div>

              {/* Rink Address */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-slate-700 mb-5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">{ticketData.rink}</div>
                  <div className="text-[11px] text-gray-600">Please arrive 15 minutes before the session for personalized check-in and fitting.</div>
                </div>
              </div>

              {/* QR Code Barcode Area */}
              <div className="border-t border-dashed border-gray-200 pt-5 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-3 rounded-2xl border border-blue-200 shadow-sm mb-2">
                  <QrCode className="w-28 h-28 text-blue-900" />
                </div>
                <div className="text-[11px] text-gray-500 font-mono tracking-widest uppercase">
                  Scan at Rink Gate Front Desk
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3.5 px-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 font-bold text-xs text-gray-800 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4 text-gray-600" />
                <span>Print Pass</span>
              </button>

              <button
                onClick={() => {
                  navigateTo('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 py-3.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Return to Home</span>
              </button>

              <button
                onClick={() => {
                  navigateTo('programs');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 trial-btn-primary py-3.5 px-3 text-xs"
              >
                <span>Explore Courses</span>
                <ChevronRight className="w-4 h-4" />
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
                    <span className="booking-step-pill">
                      Question {preCheckStep} of 2
                    </span>
                    <span className="font-extrabold text-sm font-['Outfit'] text-gray-900">
                      {preCheckStep === 1 ? 'Skater Experience' : 'Skates & Equipment'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="booking-step-pill">
                      Step {bookingStep} of 3
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

            {/* STEP 0: ONE QUESTION AT A TIME (CLICK YES/NO TO AUTO-ADVANCE) */}
            {bookingStep === 0 && (
              <div className="py-1">
                {preCheckStep === 1 ? (
                  /* QUESTION 1: Does your child have skating experience? */
                  <div 
                    key="question-1"
                    className={`text-center py-2 sm:py-3 ${questionSlideDir === 'left' ? 'question-slide-in-left' : 'question-slide-in-right'}`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100 shadow-xs">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-700 mb-2">
                      <span>Question 1 of 2</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] leading-snug max-w-sm mx-auto mb-2">
                      Does your child have any skating experience?
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
                      Helps our certified coach tailor 1:1 drills to their comfort & balance level.
                    </p>

                    {/* YES / NO BUTTONS -> CLICKING ADVANCES TO QUESTION 2 */}
                    <div className="grid grid-cols-2 gap-3.5 max-w-xs mx-auto">
                      <button
                        type="button"
                        disabled={isAnswering}
                        onClick={() => handleAnswerQuestion1('yes')}
                        className={`group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer ${
                          selectedAnswer === 'yes'
                            ? 'bg-blue-50 border-2 border-blue-600 shadow-md ring-2 ring-blue-400/40 scale-[1.02]'
                            : 'bg-white border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 hover:shadow-lg active:scale-95'
                        }`}
                      >
                        {selectedAnswer === 'yes' && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs animate-scaleIn">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <span className={`text-2xl font-black font-['Outfit'] transition-colors ${
                          selectedAnswer === 'yes' ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'
                        }`}>
                          Yes
                        </span>
                        <span className={`text-[11px] font-semibold mt-1 transition-colors ${
                          selectedAnswer === 'yes' ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
                        }`}>
                          Has skated before
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={isAnswering}
                        onClick={() => handleAnswerQuestion1('no')}
                        className={`group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer ${
                          selectedAnswer === 'no'
                            ? 'bg-blue-50 border-2 border-blue-600 shadow-md ring-2 ring-blue-400/40 scale-[1.02]'
                            : 'bg-white border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 hover:shadow-lg active:scale-95'
                        }`}
                      >
                        {selectedAnswer === 'no' && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs animate-scaleIn">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <span className={`text-2xl font-black font-['Outfit'] transition-colors ${
                          selectedAnswer === 'no' ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'
                        }`}>
                          No
                        </span>
                        <span className={`text-[11px] font-semibold mt-1 transition-colors ${
                          selectedAnswer === 'no' ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
                        }`}>
                          First timer / beginner
                        </span>
                      </button>
                    </div>

                    {/* Feedback when answering vs preview banner */}
                    {isAnswering && selectedAnswer ? (
                      <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-blue-600 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                        <span>Saving answer... Loading Question 2 (Skates & Equipment)</span>
                      </div>
                    ) : (
                      <div className="mt-6 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50/80 border border-amber-200/80 text-[11px] font-medium text-amber-900 shadow-2xs">
                        <span className="font-bold text-amber-600">Up next:</span>
                        <span>Question 2 will ask if your child has skates</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                    )}
                  </div>
                ) : (
                  /* QUESTION 2: Does your child have skates? (YELLOW THEME) */
                  <div 
                    key="question-2"
                    className={`text-center py-2 sm:py-3 ${questionSlideDir === 'left' ? 'question-slide-in-left' : 'question-slide-in-right'}`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-300 shadow-xs">
                      <ShieldCheck className="w-6 h-6 text-amber-600" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-[11px] font-bold text-amber-900 mb-2">
                      <Check className="w-3.5 h-3.5 text-amber-700" />
                      <span>Question 2 of 2 • Final Pre-Check</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-amber-500 font-['Outfit'] leading-snug max-w-sm mx-auto mb-2">
                      Does your child have their own skates?
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
                      Free sanitized rental skates & protective pad kits are provided exclusively at Al Nahyan.
                    </p>

                    {/* YES / NO BUTTONS -> CLICKING AUTO-ADVANCES TO CONTACT & SESSION DATE */}
                    <div className="grid grid-cols-2 gap-3.5 max-w-xs mx-auto">
                      <button
                        type="button"
                        disabled={isAnswering}
                        onClick={() => handleAnswerQuestion2('yes')}
                        className={`group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer ${
                          selectedAnswer === 'yes'
                            ? 'bg-amber-50 border-2 border-amber-500 shadow-md ring-2 ring-amber-400/40 scale-[1.02]'
                            : 'bg-white border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 hover:shadow-lg active:scale-95'
                        }`}
                      >
                        {selectedAnswer === 'yes' && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs animate-scaleIn">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <span className={`text-2xl font-black font-['Outfit'] transition-colors ${
                          selectedAnswer === 'yes' ? 'text-amber-600' : 'text-slate-900 group-hover:text-amber-600'
                        }`}>
                          Yes
                        </span>
                        <span className={`text-[11px] font-semibold mt-1 transition-colors ${
                          selectedAnswer === 'yes' ? 'text-amber-600' : 'text-slate-400 group-hover:text-amber-600'
                        }`}>
                          Will bring own skates
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={isAnswering}
                        onClick={() => handleAnswerQuestion2('no')}
                        className={`group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer ${
                          selectedAnswer === 'no'
                            ? 'bg-amber-50 border-2 border-amber-500 shadow-md ring-2 ring-amber-400/40 scale-[1.02]'
                            : 'bg-white border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 hover:shadow-lg active:scale-95'
                        }`}
                      >
                        {selectedAnswer === 'no' && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs animate-scaleIn">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <span className={`text-2xl font-black font-['Outfit'] transition-colors ${
                          selectedAnswer === 'no' ? 'text-amber-600' : 'text-slate-900 group-hover:text-amber-600'
                        }`}>
                          No
                        </span>
                        <span className={`text-[11px] font-semibold mt-1 transition-colors ${
                          selectedAnswer === 'no' ? 'text-amber-600' : 'text-slate-400 group-hover:text-amber-600'
                        }`}>
                          Need rental skates
                        </span>
                      </button>
                    </div>

                    {isAnswering && selectedAnswer ? (
                      <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-amber-600 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        <span>Ready! Opening Session Schedule & Branch Selection...</span>
                      </div>
                    ) : (
                      /* Back to Question 1 button */
                      <div className="mt-6 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={handleBackToQuestion1}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors py-1.5 px-3.5 rounded-lg hover:bg-amber-50 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Back to Question 1</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

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
                    className="flex-1 trial-btn-primary"
                  >
                    <span>Proceed to Payment (30 AED)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            )}

            {/* STEP 3 FORM: Payment Method (Card or Bank Transfer) */}
            {bookingStep === 3 && (
              <form onSubmit={handleFinalPayment} className="space-y-4">
                
                {/* Payment Amount Summary Banner */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/80 border border-blue-200">
                  <div>
                    <div className="text-[11px] font-bold text-blue-900 uppercase">Trial Session Pass</div>
                    <div className="text-xs text-blue-700">{selectedTimeSlot} • {months[currentMonthIndex].split(' ')[0]} {selectedDay}, 2026</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-blue-900">30.00 <span className="text-xs">AED</span></div>
                    <div className="text-[10px] font-bold text-blue-600">30 Dirhams only</div>
                  </div>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="booking-input-group">
                  <label className="booking-label">
                    Select Payment Method *
                  </label>
                  <div className="payment-tabs">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('card');
                        setCardError('');
                        setBankError('');
                      }}
                      className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Card Payment</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('bank');
                        setCardError('');
                        setBankError('');
                      }}
                      className={`payment-tab-btn ${paymentMethod === 'bank' ? 'active' : ''}`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Bank Transfer</span>
                    </button>
                  </div>
                </div>

                {/* Option 1: Credit / Debit Card Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="booking-input-group">
                      <label className="booking-label">Cardholder Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={cardHolder}
                        onChange={(e) => {
                          setCardHolder(e.target.value);
                          if (cardError) setCardError('');
                        }}
                        className="booking-input"
                      />
                    </div>

                    <div className="booking-input-group">
                      <label className="booking-label">Card Number *</label>
                      <div className="booking-input-wrapper">
                        <CreditCard className="booking-input-icon" />
                        <input
                          type="text"
                          required
                          maxLength={19}
                          placeholder="4000 1234 5678 9010"
                          value={cardNumber}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '').slice(0, 16);
                            let formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                            setCardNumber(formatted);
                            if (cardError) setCardError('');
                          }}
                          className="booking-input-with-icon"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="booking-input-group">
                        <label className="booking-label">Expiry (MM/YY) *</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (val.length >= 3) {
                              val = `${val.slice(0, 2)}/${val.slice(2)}`;
                            }
                            setCardExpiry(val);
                            if (cardError) setCardError('');
                          }}
                          className="booking-input"
                        />
                      </div>

                      <div className="booking-input-group">
                        <label className="booking-label">CVV / CVC *</label>
                        <div className="booking-input-wrapper">
                          <Lock className="booking-input-icon" />
                          <input
                            type="password"
                            required
                            maxLength={4}
                            placeholder="123"
                            value={cardCvv}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                              setCardCvv(val);
                              if (cardError) setCardError('');
                            }}
                            className="booking-input-with-icon"
                          />
                        </div>
                      </div>
                    </div>

                    {cardError && (
                      <div className="text-xs text-red-600 font-bold p-2 rounded-lg bg-red-50 border border-red-200">
                        ⚠️ {cardError}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1">
                      <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>256-Bit SSL Encrypted & Bank-Grade Security</span>
                    </div>
                  </div>
                )}

                {/* Option 2: Bank Transfer Details Form */}
                {paymentMethod === 'bank' && (
                  <div className="space-y-3 animate-fadeIn">
                    {/* Bank Details Card */}
                    <div className="bank-info-box">
                      <div className="bank-info-title">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span>Strategy Official Bank Account (UAE)</span>
                      </div>
                      <div className="bank-info-grid">
                        <div className="bank-info-item">
                          <div className="bank-info-label">Bank</div>
                          <div className="bank-info-val">Emirates NBD</div>
                        </div>
                        <div className="bank-info-item">
                          <div className="bank-info-label">Account Name</div>
                          <div className="bank-info-val truncate">Strategy Skate LLC</div>
                        </div>
                        <div className="bank-info-item col-span-2">
                          <div className="bank-info-label">IBAN Number</div>
                          <div className="bank-info-val font-mono text-[11px] tracking-wide">AE24 0260 0012 3456 7890 01</div>
                        </div>
                      </div>
                      <div className="text-[11px] text-blue-800 mt-2 font-medium">
                        Transfer <strong>30.00 AED</strong> using the official bank details above for pass activation.
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons: Back + Confirm Payment */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="booking-back-btn"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 trial-btn-primary"
                  >
                    <span>{isProcessing ? 'Processing Payment...' : 'Pay 30.00 AED & Get Pass'}</span>
                    <Zap className="w-4 h-4 fill-white" />
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          WHATSAPP TRIAL CHATBOT POPUP (ON ICON CLICK)
          ========================================================================= */}
      {isChatbotOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col sm:items-center sm:justify-center sm:p-4 bg-[#efeae2] sm:bg-black/60">
          <div className="w-full h-full sm:max-w-md sm:h-[85vh] sm:max-h-[800px] shadow-[0_10px_50px_rgba(0,0,0,0.45)] sm:rounded-3xl overflow-hidden">
            <SkateTrialChatbot 
              isFloating={true}
            onClose={() => setIsChatbotOpen(false)}
            onMinimize={() => setIsChatbotOpen(false)}
            onConfirmBooking={handleBotConfirmBooking}
          />
          </div>
        </div>
      )}

      {/* Floating Chatbot Icon on Bottom Right Corner */}
      {!isChatbotOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 border-2 border-white shadow-emerald-600/50 group cursor-pointer relative"
            title="Chat with Coach Leo on WhatsApp"
            aria-label="Open Chatbot"
          >
            <span className="material-symbols-outlined text-[30px] sm:text-[34px] text-white">chat</span>
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 absolute top-0.5 right-0.5 border-2 border-white animate-pulse" />
          </button>
        </div>
      )}

    </div>
  );
}
