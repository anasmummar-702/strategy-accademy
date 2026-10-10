import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight,
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Check, 
  Star, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  Sparkles, 
  ShoppingBag,
  Award,
  Footprints,
  AlertCircle
} from 'lucide-react';
import { format10DigitPhone, validate10DigitPhone } from '../utils/validation';
import { getSkatingGallery } from '../utils/academyGalleriesData';
import { getSkatingPackages } from '../utils/academyPackagesData';

export default function AboutSection({ navigateTo, openTrialModal }) {
  // Dynamic Packages State from Admin
  const [skatingPackages, setSkatingPackages] = useState(getSkatingPackages);

  useEffect(() => {
    const handlePackagesUpdate = () => {
      setSkatingPackages(getSkatingPackages());
    };
    window.addEventListener('strategy_packages_updated', handlePackagesUpdate);
    return () => window.removeEventListener('strategy_packages_updated', handlePackagesUpdate);
  }, []);

  const pkg1 = skatingPackages[0] || {
    priceAED: 550,
    originalPriceAED: 600,
    classesCount: 8,
    classesLabel: '8 Sessions',
    validityLabel: '1 Month',
    uniformFeeAED: 50,
    badgeText: 'Starter',
    subtitle: 'Perfect for beginners & trial commitment'
  };
  const pkg2 = skatingPackages[1] || {
    priceAED: 750,
    originalPriceAED: 900,
    classesCount: 16,
    classesLabel: '16 Sessions',
    validityLabel: '2 Months',
    uniformFeeAED: 50,
    badgeText: 'Most Popular',
    subtitle: 'Ideal for building real skating skills'
  };
  const pkg3 = skatingPackages[2] || {
    priceAED: 1000,
    originalPriceAED: 1300,
    classesCount: 999,
    classesLabel: 'Unlimited',
    validityLabel: '3 Months',
    uniformFeeAED: 50,
    badgeText: 'VIP Unlimited',
    subtitle: 'Unlimited access — maximum progress'
  };

  // Gallery carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [galleryImages, setGalleryImages] = useState(getSkatingGallery);


  // Reactive gallery synchronization
  useEffect(() => {
    const handleUpdate = (e) => {
      if (!e.detail || e.detail.sport === 'skating' || e.detail.sport === 'all') {
        setGalleryImages(getSkatingGallery());
      }
    };
    window.addEventListener('strategy_gallery_updated', handleUpdate);
    return () => window.removeEventListener('strategy_gallery_updated', handleUpdate);
  }, []);

  // Appointment Modal State
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentName, setAppointmentName] = useState('');
  const [appointmentPhone, setAppointmentPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('2026-10-10');
  const [appointmentService, setAppointmentService] = useState('Skating Training Program (10-Level)');
  const [appointmentSubmitted, setAppointmentSubmitted] = useState(false);

  // Lightbox Image Preview
  const [selectedImage, setSelectedImage] = useState(null);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlay, galleryImages.length]);

  const handlePrevSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNextSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!appointmentName.trim()) return;
    
    const phoneVal = validate10DigitPhone(appointmentPhone);
    if (!phoneVal.isValid) {
      setPhoneError(phoneVal.error);
      return;
    }
    setPhoneError('');

    setAppointmentSubmitted(true);
    setTimeout(() => {
      setAppointmentSubmitted(false);
      setIsAppointmentModalOpen(false);
      setAppointmentName('');
      setAppointmentPhone('');
    }, 2500);
  };

  return (
    <div className="jam-skate-bg-wrapper font-['Poppins',sans-serif] selection:bg-[#2563eb] selection:text-white">
      
      {/* =========================================================================
          JAM SPORTS INSPIRED BACKGROUND GRADIENT DESIGN (WHITE & BLUE)
          ========================================================================= */}
      <div className="jam-bg-shape-top-right" />
      <div className="jam-bg-aura-top" />
      <div className="jam-bg-shape-mid-left" />
      <div className="jam-bg-shape-bottom-right" />
      <div className="jam-bg-mesh-texture" />

      {/* Floating Back to Home Button */}
      <div className="fixed top-5 left-5 z-50">
        <button
          onClick={() => {
            if (navigateTo) navigateTo('home');
            else window.location.hash = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-slate-800 text-xs font-bold shadow-lg border border-slate-200/80 backdrop-blur-md hover:scale-105 active:scale-95 transition-all group"
          title="Return to Strategy Home"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Portal Home</span>
        </button>
      </div>

      {/* =========================================================================
          3. HERO SECTION (TITLE & HERO IMAGE BOX WITH 2,500+ STATS BADGE)
          ========================================================================= */}
      <section id="home" className="relative z-10 pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Main Giant Headline */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="font-['Unbounded',sans-serif] text-3xl sm:text-5xl lg:text-[62px] font-black text-slate-950 tracking-tight leading-[1.1] uppercase">
            SKATE BOLDLY. GLIDE FREELY.
          </h1>
        </div>

        {/* Hero Banner Box with 28px border-radius and Floating Satisfied Customers Badge */}
        <div className="relative rounded-[28px] overflow-hidden shadow-2xl bg-slate-900 border border-slate-200 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] max-h-[620px] w-full group">
          <img 
            src="/images/skating_angels/children_skating_group.png" 
            alt="UAE Skating Angels - Kids Roller Skating Academy" 
            className="w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Floating Glassmorphic Stats Badge (Top-Left per authentic UI) */}
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10 flex flex-col items-start gap-2.5">
            {/* Teal diagonal arrow circle */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#20b2aa] text-white flex items-center justify-center shadow-lg shadow-teal-900/30 transform hover:rotate-45 transition-transform duration-300">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 19L5 5m14 0v14H5" />
              </svg>
            </div>

            {/* Star of life / Snowflake icon */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 backdrop-blur-md text-[#20b2aa] flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold leading-none select-none">✱</span>
            </div>

            {/* 2,500+ Customers Satisfied Card */}
            <div className="bg-slate-950/80 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-white shadow-xl">
              <div className="font-['Unbounded',sans-serif] text-xl sm:text-2xl font-black text-white flex items-baseline gap-0.5">
                <span>2,500</span><sup className="text-[#20b2aa] text-base">+</sup>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-300 tracking-wide">
                Customers Satisfied
              </p>
            </div>
          </div>

          {/* Bottom Right Quick Booking Overlay */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10">
            <button
              onClick={() => {
                if (navigateTo) navigateTo('trial-skating');
                else window.location.hash = 'trial-skating';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-full bg-white/95 hover:bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#20b2aa]" />
              <span>Book 30 AED Trial</span>
            </button>
          </div>

        </div>

      </section>

      {/* =========================================================================
          4. "BEST ROLLER SKATING RINK" BANNER SECTION
          ========================================================================= */}
      <section className="relative z-10 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-['Unbounded',sans-serif] text-2xl sm:text-4xl font-black text-slate-950 tracking-tight uppercase">
            BEST ROLLER SKATING RINK
          </h2>
        </div>

        {/* Wide High-Resolution Rink Picture */}
        <div className="relative rounded-[24px] overflow-hidden shadow-xl border border-slate-200 max-h-[520px] w-full group">
          <img 
            src="/images/skating_angels/best_rink.jpg" 
            alt="Best Roller Skating Rink in Abu Dhabi" 
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 text-white max-w-lg">
            <span className="text-xs font-bold uppercase tracking-widest text-[#20b2aa] bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
              Al Nahiyan
            </span>
            <p className="mt-2 text-sm sm:text-base font-semibold text-slate-100">
              State-of-the-art indoor climate control, smooth timber & polyurethane flooring, and certified safety equipment.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. "SERVICE WE OFFER" SECTION (QUOTE & 3 GOLDEN ICON CARDS)
          ========================================================================= */}
      <section id="services" className="relative z-10 py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Section Eyebrow */}
        <div className="text-center mb-4">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#20b2aa]">
            SERVICE WE OFFER
          </span>
        </div>

        {/* Main Inspirational Quote */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-18">
          <h2 className="font-['Unbounded',sans-serif] text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 tracking-tight leading-snug uppercase">
            "HELPING SKATERS OF ALL LEVELS SHARPEN THEIR SKILLS AND BREAK MENTAL BARRIERS THROUGH EXPERT MENTORING AND TRAINING."
          </h2>
        </div>

        {/* Golden Icon Service Cards (Skating Programs & Pro Accessories) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 max-w-5xl mx-auto">
          
          {/* Service 1: Skating Trainings Programs */}
          <div className="flex flex-col items-center text-center p-8 sm:p-10 rounded-3xl bg-white/90 backdrop-blur-md border border-blue-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
            {/* Golden Inline Skater Icon */}
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Footprints className="w-8 h-8 text-[#eab308]" />
            </div>
            <h3 className="font-['Unbounded',sans-serif] text-lg sm:text-xl font-bold text-[#eab308] mb-3">
              Skating Trainings Programs
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Skating Training program: Our 10-level training program, featuring 8 sessions per level, will take you from beginner to champion. Includes dedicated championship preparation.
            </p>
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-[#20b2aa] transition-colors"
            >
              <span>View Training Levels</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Service 2: Buy Skating Accessories */}
          <div 
            onClick={() => {
              if (navigateTo) navigateTo('shop-home');
              else window.location.hash = 'shop-home';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center text-center p-8 sm:p-10 rounded-3xl bg-white/90 backdrop-blur-md border border-blue-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer"
          >
            {/* Golden Shopping Cart Icon */}
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-8 h-8 text-[#eab308]" />
            </div>
            <h3 className="font-['Unbounded',sans-serif] text-lg sm:text-xl font-bold text-[#eab308] mb-3">
              Buy Skating Accessories
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your one-stop shop for all your skating needs! Find the perfect roller skates, protective gear, and helpful accessories to enhance your skating experience.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (navigateTo) navigateTo('shop-home');
                else window.location.hash = 'shop-home';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-[#20b2aa] transition-colors"
            >
              <span>Explore Skating Gear</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </section>

      {/* =========================================================================
          6. DYNAMIC IMAGE GALLERY & CAROUSEL SLIDER (REAL RINK PHOTOS)
          ========================================================================= */}
      <section className="relative z-10 py-12 bg-white/40 backdrop-blur-md border-y border-blue-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#20b2aa]">
                GALLERY & COMMUNITY
              </span>
              <h2 className="font-['Unbounded',sans-serif] text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                EXPERIENCE THE RINK IN ACTION
              </h2>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSlide}
                className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm active:scale-95 transition-all"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextSlide}
                className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm active:scale-95 transition-all"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Carousel Dual Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slide A */}
            <div 
              onClick={() => setSelectedImage(galleryImages[currentSlide].src)}
              className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-[4/3] bg-slate-900 group cursor-pointer"
            >
              <img 
                src={galleryImages[currentSlide].src} 
                alt={galleryImages[currentSlide].title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#20b2aa] px-2.5 py-1 rounded-full">
                  UAE Skating Angels
                </span>
                <h4 className="font-['Unbounded',sans-serif] text-base sm:text-lg font-bold mt-2">
                  {galleryImages[currentSlide].title}
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  {galleryImages[currentSlide].desc}
                </p>
              </div>
            </div>

            {/* Slide B */}
            <div 
              onClick={() => setSelectedImage(galleryImages[(currentSlide + 1) % galleryImages.length].src)}
              className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-[4/3] bg-slate-900 group cursor-pointer hidden md:block"
            >
              <img 
                src={galleryImages[(currentSlide + 1) % galleryImages.length].src} 
                alt={galleryImages[(currentSlide + 1) % galleryImages.length].title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#20b2aa] px-2.5 py-1 rounded-full">
                  UAE Skating Angels
                </span>
                <h4 className="font-['Unbounded',sans-serif] text-base sm:text-lg font-bold mt-2">
                  {galleryImages[(currentSlide + 1) % galleryImages.length].title}
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  {galleryImages[(currentSlide + 1) % galleryImages.length].desc}
                </p>
              </div>
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mt-4">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlay(false);
                  setCurrentSlide(idx);
                }}
                className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                  currentSlide === idx ? 'border-[#20b2aa] ring-2 ring-[#20b2aa]/30 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. TWO INTERACTIVE ACTION BANNERS ("SKATING LESSONS" & "ROLLER SKATING RINK")
          ========================================================================= */}
      <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Banner 1: Skating Lessons by Experienced Teachers */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[16/10] sm:aspect-[16/9] group bg-slate-900">
            <img 
              src="/images/skating_angels/gallery_1.jpg" 
              alt="Skating Lessons by Experienced Teachers" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-[#20b2aa] text-white px-3 py-1 rounded-full inline-block mb-2">
                Certified Teachers
              </span>
              <h3 className="font-['Unbounded',sans-serif] text-xl sm:text-2xl font-black text-white leading-snug">
                Skating Lessons by Experienced Teachers
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-2 line-clamp-2">
                Structured progressive curriculum covering balance, crossovers, forward/backward glide, and competitive speed.
              </p>
              <button
                onClick={() => setIsAppointmentModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-[#20b2aa] hover:text-white transition-all"
              >
                Book Your Lesson
              </button>
            </div>
          </div>

          {/* Banner 2: Roller Skating Rink */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[16/10] sm:aspect-[16/9] group bg-slate-900">
            <img 
              src="/images/skating_angels/gallery_7.jpg" 
              alt="Roller Skating Rink" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-amber-500 text-white px-3 py-1 rounded-full inline-block mb-2">
                Air-Conditioned Arena
              </span>
              <h3 className="font-['Unbounded',sans-serif] text-xl sm:text-2xl font-black text-white leading-snug">
                Roller Skating Rink
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-2 line-clamp-2">
                Full-size chilled stadium, sound system, cafe lounge, and welcoming staff located in Al Nahiyan, Abu Dhabi.
              </p>
              <button
                onClick={() => setIsAppointmentModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-amber-500 hover:text-white transition-all"
              >
                Visit The Rink
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          8. "AFFORDABLE SKATE COACHING RATES" SECTION
          ========================================================================= */}
      <section id="coaching" className="relative z-10 py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-blue-200/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Title & Starburst Graphic */}
          <div className="lg:col-span-6 relative">
            <h2 className="font-['Unbounded',sans-serif] text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-[1.1] uppercase">
              AFFORDABLE SKATE COACHING RATES
            </h2>

            {/* Light Starburst Glyph from authentic site */}
            <div className="mt-8 text-blue-300/40 text-7xl sm:text-9xl font-black select-none pointer-events-none">
              ✱
            </div>
          </div>

          {/* Right Text Description & "NEW" stamp */}
          <div className="lg:col-span-6 relative">
            {/* Rotated NEW Badge from authentic site */}
            <div className="absolute -top-10 right-0 sm:right-6 w-20 sm:w-24 rotate-12 pointer-events-none select-none">
              <img 
                src="/images/skating_angels/new_badge.png" 
                alt="New Coaching Program" 
                className="w-full h-auto drop-shadow-md"
              />
            </div>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed pr-6">
              <p>
                <strong className="text-slate-900">UAE Skating Angels</strong> offers affordable skate coaching rates, ensuring that quality training is accessible to all aspiring skaters. Their programs are designed to provide expert guidance and personalized instruction, helping skaters of all levels enhance their skills and confidence.
              </p>
              <p>
                With flexible scheduling and a commitment to excellence, UAE Skating Angels makes it easier than ever to pursue your passion for skating without breaking the bank. Whether you’re a beginner or looking to refine advanced techniques, their experienced coaches are dedicated to helping you achieve your skating goals.
              </p>
            </div>

            {/* Quick Packages Overview */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm hover:border-[#20b2aa] transition-colors">
                <div className="text-xs font-bold text-[#20b2aa] uppercase">10-Level Championship</div>
                <div className="font-['Unbounded',sans-serif] text-lg font-bold text-slate-900 mt-1">8 Sessions / Level</div>
                <p className="text-xs text-slate-500 mt-1">Dedicated championship prep, badges & medal certificates.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm hover:border-amber-500 transition-colors">
                <div className="text-xs font-bold text-amber-500 uppercase">Weekend Fun Glide</div>
                <div className="font-['Unbounded',sans-serif] text-lg font-bold text-slate-900 mt-1">Open Rink Entry</div>
                <p className="text-xs text-slate-500 mt-1">All skates included, music, lights, and open session access.</p>
              </div>
            </div>


          </div>

        </div>
      </section>

      {/* =========================================================================
          TRIAL CLASS INTRODUCTION SECTION
          ========================================================================= */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Vivid teal-to-navy gradient background card */}
        <div className="max-w-7xl mx-auto relative">
          <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#004d45] via-[#006b61] to-[#00857a] shadow-2xl shadow-emerald-900/40">
            
            {/* Decorative glowing orbs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#20b2aa]/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-teal-300/20 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

            {/* Halftone dot pattern overlay */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '28px 28px'}} 
            />

            <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-14 max-w-3xl mx-auto text-center flex flex-col items-center justify-center">
              
              {/* Trial Indication Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-[#7fffd4] animate-pulse" />
                <span className="text-[#7fffd4] text-xs font-extrabold uppercase tracking-widest">
                  45-MIN TRIAL SESSION • 30 AED SPECIAL
                </span>
              </div>

              {/* Trial Indication Heading */}
              <h2 className="font-['Unbounded',sans-serif] text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
                Book Your <span className="text-[#7fffd4]">30 AED Skating Trial Class</span>
              </h2>

              {/* Trial Indication Description */}
              <p className="text-teal-100 text-xs sm:text-sm max-w-lg mb-6 font-medium leading-relaxed">
                Experience your first 45-minute guided glide with 1:1 certified coaching. Complimented with sanitized rental skates & protective armor kit included.
              </p>

              {/* Prominent Booking Button */}
              <button
                onClick={() => {
                  if (navigateTo) navigateTo('trial-skating');
                  else window.location.hash = 'trial-skating';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white hover:bg-[#7fffd4] text-[#004d45] font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 group-hover:rotate-12 transition-transform" />
                <span>Book 30 AED Trial Class</span>
                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PACKAGE DETAILS SECTION
          ========================================================================= */}
      <section id="packages" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-14 sm:mb-20">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#20b2aa]">
              TRANSPARENT PRICING
            </span>
            <h2 className="font-['Unbounded',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.1] uppercase mt-2 mb-4">
              Choose Your<br />Skating Package
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
              Flexible training plans designed for every schedule and commitment level. All packages include <strong className="text-slate-700">free registration</strong> and certified coaching.
            </p>
          </div>

          {/* Package Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">

            {/* Package 1: 1 Month */}
            <div className="relative flex flex-col bg-white rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group">
              {/* Top color bar */}
              <div className="h-2 bg-gradient-to-r from-[#20b2aa] to-[#008080]" />
              
              <div className="flex-1 p-7 sm:p-8">
                {/* Package label */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#20b2aa]" />
                  <span className="text-[#008080] text-[11px] font-extrabold uppercase tracking-widest">{pkg1.badgeText || 'Starter'}</span>
                </div>
                <h3 className="font-['Unbounded',sans-serif] text-xl font-black text-slate-900 mb-1">{pkg1.shortTitle || '1 Month'}</h3>
                <p className="text-slate-400 text-xs mb-6">{pkg1.subtitle || 'Perfect for beginners & trial commitment'}</p>

                {/* Price display */}
                <div className="mb-6">
                  <div className="flex items-end gap-2">
                    <span className="font-['Unbounded',sans-serif] text-5xl font-black text-slate-900 leading-none">{pkg1.priceAED}</span>
                    <div className="mb-1">
                      <span className="text-slate-500 text-sm font-bold">AED</span>
                      <p className="text-slate-400 text-[11px]">/ package</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-2">
                    Total with uniform: <strong className="text-slate-700">AED {Number(pkg1.priceAED) + (Number(pkg1.uniformFeeAED) || 50)}</strong>
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {[
                    { label: 'Classes', value: pkg1.classesLabel || `${pkg1.classesCount || 8} Sessions` },
                    { label: 'Validity', value: pkg1.validityLabel || `${pkg1.validityDays || 30} Days` },
                    { label: 'Package Price', value: `AED ${pkg1.priceAED}` },
                    { label: 'Uniform', value: `AED ${pkg1.uniformFeeAED || 50}` },
                    { label: 'Registration', value: 'FREE' },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500 text-xs">{f.label}</span>
                      <span className={`text-xs font-bold ${f.value === 'FREE' ? 'text-emerald-600' : 'text-slate-800'}`}>{f.value}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="bg-teal-50 rounded-2xl p-4 mb-6 flex items-center justify-between">
                  <span className="text-[#008080] text-sm font-bold uppercase tracking-wide">Total</span>
                  <span className="font-['Unbounded',sans-serif] text-2xl font-black text-[#004d45]">
                    AED {Number(pkg1.priceAED) + (Number(pkg1.uniformFeeAED) || 50)}
                  </span>
                </div>

                <button
                  onClick={() => setIsAppointmentModalOpen(true)}
                  className="w-full py-3.5 rounded-full border-2 border-[#20b2aa] text-[#008080] font-bold text-sm hover:bg-[#20b2aa] hover:text-white transition-all active:scale-95"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Package 2: 2 Months (FEATURED / MOST POPULAR) */}
            <div className="relative flex flex-col bg-gradient-to-br from-[#004d45] via-[#006b61] to-[#00857a] rounded-3xl shadow-2xl shadow-emerald-900/30 hover:-translate-y-2 transition-all duration-300 overflow-hidden scale-100 md:scale-105">
              
              {/* MOST POPULAR badge */}
              <div className="absolute top-5 right-5 bg-[#7fffd4] text-[#004d45] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                {pkg2.badgeText || 'Most Popular'}
              </div>

              {/* Decorative orb */}
              <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

              <div className="flex-1 p-7 sm:p-8 relative z-10">
                {/* Package label */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7fffd4]" />
                  <span className="text-[#7fffd4] text-[11px] font-extrabold uppercase tracking-widest">Best Value</span>
                </div>
                <h3 className="font-['Unbounded',sans-serif] text-xl font-black text-white mb-1">{pkg2.shortTitle || '2 Months'}</h3>
                <p className="text-teal-200 text-xs mb-6">{pkg2.subtitle || 'Ideal for building real skating skills'}</p>

                {/* Price display */}
                <div className="mb-6">
                  <div className="flex items-end gap-2">
                    <span className="font-['Unbounded',sans-serif] text-5xl font-black text-white leading-none">{pkg2.priceAED}</span>
                    <div className="mb-1">
                      <span className="text-teal-200 text-sm font-bold">AED</span>
                      <p className="text-teal-300 text-[11px]">/ package</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {pkg2.originalPriceAED && pkg2.originalPriceAED > pkg2.priceAED && (
                      <span className="text-teal-300 text-xs line-through">AED {pkg2.originalPriceAED}</span>
                    )}
                    {pkg2.originalPriceAED && pkg2.originalPriceAED > pkg2.priceAED && (
                      <span className="bg-[#7fffd4] text-[#004d45] text-[10px] font-black px-2 py-0.5 rounded-full">
                        SAVE AED {pkg2.originalPriceAED - pkg2.priceAED}
                      </span>
                    )}
                  </div>
                  <p className="text-teal-200 text-xs mt-1">
                    Total with uniform: <strong className="text-white">AED {Number(pkg2.priceAED) + (Number(pkg2.uniformFeeAED) || 50)}</strong>
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {[
                    { label: 'Classes', value: pkg2.classesLabel || `${pkg2.classesCount || 16} Sessions` },
                    { label: 'Validity', value: pkg2.validityLabel || `${pkg2.validityDays || 60} Days` },
                    { label: 'Current Price', value: `AED ${pkg2.priceAED}` },
                    { label: 'Regular Price', value: `AED ${pkg2.originalPriceAED || (Number(pkg2.priceAED) + 150)}`, strike: true },
                    { label: 'You Save', value: `AED ${Math.max(0, (pkg2.originalPriceAED || (Number(pkg2.priceAED) + 150)) - Number(pkg2.priceAED))}`, highlight: true },
                    { label: 'Uniform', value: `AED ${pkg2.uniformFeeAED || 50}` },
                    { label: 'Registration', value: 'FREE', green: true },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-teal-200 text-xs">{f.label}</span>
                      <span className={`text-xs font-bold ${f.green ? 'text-[#7fffd4]' : f.highlight ? 'text-[#7fffd4]' : f.strike ? 'text-white/40 line-through' : 'text-white'}`}>{f.value}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="bg-white/10 rounded-2xl p-4 mb-6 flex items-center justify-between border border-white/20">
                  <span className="text-teal-200 text-sm font-bold uppercase tracking-wide">Total</span>
                  <span className="font-['Unbounded',sans-serif] text-2xl font-black text-white">
                    AED {Number(pkg2.priceAED) + (Number(pkg2.uniformFeeAED) || 50)}
                  </span>
                </div>

                <button
                  onClick={() => setIsAppointmentModalOpen(true)}
                  className="w-full py-3.5 rounded-full bg-white text-[#004d45] font-black text-sm hover:bg-[#7fffd4] transition-all active:scale-95 shadow-lg"
                >
                  Book This Package
                </button>
              </div>
            </div>

            {/* Package 3: 3 Months Unlimited */}
            <div className="relative flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group">
              {/* Top color bar */}
              <div className="h-2 bg-gradient-to-r from-amber-400 to-amber-500" />
              
              {/* Decorative orb */}
              <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

              <div className="flex-1 p-7 sm:p-8 relative z-10">
                {/* Package label */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-amber-400 text-[11px] font-extrabold uppercase tracking-widest">{pkg3.badgeText || 'Premium'}</span>
                </div>
                <h3 className="font-['Unbounded',sans-serif] text-xl font-black text-white mb-1">{pkg3.shortTitle || '3 Months'}</h3>
                <p className="text-slate-400 text-xs mb-6">{pkg3.subtitle || 'Unlimited access — maximum progress'}</p>

                {/* Price display */}
                <div className="mb-6">
                  <div className="flex items-end gap-2">
                    <span className="font-['Unbounded',sans-serif] text-5xl font-black text-white leading-none">{pkg3.priceAED}</span>
                    <div className="mb-1">
                      <span className="text-slate-400 text-sm font-bold">AED</span>
                      <p className="text-slate-500 text-[11px]">/ package</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {pkg3.originalPriceAED && pkg3.originalPriceAED > pkg3.priceAED && (
                      <span className="text-slate-500 text-xs line-through">AED {pkg3.originalPriceAED}</span>
                    )}
                    {pkg3.originalPriceAED && pkg3.originalPriceAED > pkg3.priceAED && (
                      <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        SAVE AED {pkg3.originalPriceAED - pkg3.priceAED}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    Total with uniform: <strong className="text-white">AED {Number(pkg3.priceAED) + (Number(pkg3.uniformFeeAED) || 50)}</strong>
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {[
                    { label: 'Classes', value: pkg3.classesLabel || (pkg3.classesCount === 999 ? 'Unlimited' : `${pkg3.classesCount || 24} Sessions`) },
                    { label: 'Validity', value: pkg3.validityLabel || `${pkg3.validityDays || 90} Days` },
                    { label: 'Current Price', value: `AED ${pkg3.priceAED}` },
                    { label: 'Regular Price', value: `AED ${pkg3.originalPriceAED || (Number(pkg3.priceAED) + 300)}`, strike: true },
                    { label: 'You Save', value: `AED ${Math.max(0, (pkg3.originalPriceAED || (Number(pkg3.priceAED) + 300)) - Number(pkg3.priceAED))}`, highlight: true },
                    { label: 'Uniform', value: `AED ${pkg3.uniformFeeAED || 50}` },
                    { label: 'Registration', value: 'FREE', green: true },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-slate-400 text-xs">{f.label}</span>
                      <span className={`text-xs font-bold ${f.green ? 'text-emerald-400' : f.highlight ? 'text-amber-400' : f.strike ? 'text-white/30 line-through' : 'text-white'}`}>{f.value}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="bg-amber-500/15 rounded-2xl p-4 mb-6 flex items-center justify-between border border-amber-500/30">
                  <span className="text-amber-400 text-sm font-bold uppercase tracking-wide">Total</span>
                  <span className="font-['Unbounded',sans-serif] text-2xl font-black text-white">
                    AED {Number(pkg3.priceAED) + (Number(pkg3.uniformFeeAED) || 50)}
                  </span>
                </div>

                <button
                  onClick={() => setIsAppointmentModalOpen(true)}
                  className="w-full py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-black text-sm transition-all active:scale-95 shadow-lg"
                >
                  Go Premium
                </button>
              </div>
            </div>

          </div>

          {/* Package Rules Note */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-blue-100 shadow-sm max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#20b2aa] text-lg font-black">ℹ</span>
              </div>
              <div>
                <h4 className="font-['Unbounded',sans-serif] text-sm font-black text-slate-900 mb-3 uppercase tracking-wide">Package Rules</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#20b2aa] font-bold mt-0.5">•</span>
                    <span>Each package has a <strong className="text-slate-800">limited validity period</strong> from the date of purchase.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#20b2aa] font-bold mt-0.5">•</span>
                    <span>Parents may schedule classes <strong className="text-slate-800">flexibly</strong> based on their availability, but all sessions must be used before the package expires.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#20b2aa] font-bold mt-0.5">•</span>
                    <span><strong className="text-slate-800">Example:</strong> The 1-Month Package includes 8 classes — these can be booked on any day within the month that suits your child's schedule.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#20b2aa] font-bold mt-0.5">•</span>
                    <span>Uniform fee of <strong className="text-slate-800">AED 50</strong> is a one-time cost. Registration is always <strong className="text-emerald-600">FREE</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          9. "TESTIMONIALS - WHAT CLIENT SAY" SECTION
          ========================================================================= */}
      <section className="relative z-10 py-14 sm:py-20 bg-white/40 backdrop-blur-md border-t border-blue-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Pill Badge */}
          <div className="inline-block px-4 py-1 rounded-full border border-[#20b2aa] text-[#20b2aa] text-xs font-bold uppercase tracking-wider mb-3">
            TESTIMONIALS
          </div>

          <h2 className="font-['Unbounded',sans-serif] text-2xl sm:text-4xl font-black text-slate-950 tracking-tight uppercase mb-12 sm:mb-16">
            WHAT CLIENT SAY
          </h2>

          {/* 6 Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Review 1: Sarah Khan */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full ring-4 ring-lime-400 p-0.5 overflow-hidden mb-6 shadow-md">
                <img 
                  src="/images/skating_angels/avatar_sarah.jpg" 
                  alt="Sarah Khan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed mb-6">
                "The coaches at UAE Skating Angels are incredibly patient and skilled. My daughter has improved so much in just a few weeks!"
              </p>
              <div className="mt-auto">
                <h4 className="font-['Unbounded',sans-serif] text-base font-bold text-slate-900">
                  Sarah Khan
                </h4>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Skateboarder & Parent
                </p>
              </div>
            </div>

            {/* Review 2: Fatima Al Suwaidi */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full ring-4 ring-lime-400 p-0.5 overflow-hidden mb-6 shadow-md">
                <img 
                  src="/images/skating_angels/avatar_fatima.jpg" 
                  alt="Fatima Al Suwaidi" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed mb-6">
                "UAE Skating Angels made learning to skate fun and easy. The trainers are amazing with kids!"
              </p>
              <div className="mt-auto">
                <h4 className="font-['Unbounded',sans-serif] text-base font-bold text-slate-900">
                  Fatima Al Suwaidi
                </h4>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Skateboarder & Adult Skater
                </p>
              </div>
            </div>

            {/* Review 3: Ahmed Raza */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full ring-4 ring-lime-400 p-0.5 overflow-hidden mb-6 shadow-md">
                <img 
                  src="/images/skating_angels/avatar_ahmed.jpg" 
                  alt="Ahmed Raza" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed mb-6">
                "Affordable rates and professional coaching — couldn’t ask for better! My son looks forward to every session."
              </p>
              <div className="mt-auto">
                <h4 className="font-['Unbounded',sans-serif] text-base font-bold text-slate-900">
                  Ahmed Raza
                </h4>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Skateboarder & Junior Pro Parent
                </p>
              </div>
            </div>

            {/* Review 4: Mariam Hassan */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full ring-4 ring-lime-400 p-0.5 overflow-hidden mb-6 shadow-md">
                <img 
                  src="/images/skating_angels/avatar_mariam.jpg" 
                  alt="Mariam Hassan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed mb-6">
                "The 30 AED trial class was the best decision! My twin boys gained so much balance and confidence on the rink in just one session."
              </p>
              <div className="mt-auto">
                <h4 className="font-['Unbounded',sans-serif] text-base font-bold text-slate-900">
                  Mariam Hassan
                </h4>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Parent & Fitness Enthusiast
                </p>
              </div>
            </div>

            {/* Review 5: David Miller */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full ring-4 ring-lime-400 p-0.5 overflow-hidden mb-6 shadow-md">
                <img 
                  src="/images/skating_angels/avatar_david.jpg" 
                  alt="David Miller" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed mb-6">
                "Top-tier equipment, pristine facilities, and world-class safety protocols. The 1:1 coaching made learning smooth and rewarding."
              </p>
              <div className="mt-auto">
                <h4 className="font-['Unbounded',sans-serif] text-base font-bold text-slate-900">
                  David Miller
                </h4>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Adult Beginner Skater
                </p>
              </div>
            </div>

            {/* Review 6: Zayed Al Mansoori */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full ring-4 ring-lime-400 p-0.5 overflow-hidden mb-6 shadow-md">
                <img 
                  src="/images/skating_angels/avatar_zayed.jpg" 
                  alt="Zayed Al Mansoori" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed mb-6">
                "Outstanding atmosphere in Al Nahiyan! The step-by-step 10-level program keeps my kids motivated every single week."
              </p>
              <div className="mt-auto">
                <h4 className="font-['Unbounded',sans-serif] text-base font-bold text-slate-900">
                  Zayed Al Mansoori
                </h4>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Academy Parent & Member
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          10. INTERACTIVE BOOKING APPOINTMENT MODAL
          ========================================================================= */}
      {isAppointmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 animate-scaleUp">
            
            <button 
              onClick={() => setIsAppointmentModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {appointmentSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-['Unbounded',sans-serif] text-xl font-bold text-slate-900 mb-2">
                  Appointment Confirmed!
                </h3>
                <p className="text-sm text-slate-600">
                  Thank you, <strong>{appointmentName}</strong>. Our team at Al Nahiyan will contact you shortly on <strong>{appointmentPhone}</strong>.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center p-2 shadow-sm">
                    <Calendar className="w-5 h-5 text-[#20b2aa]" />
                  </div>
                  <div>
                    <h3 className="font-['Unbounded',sans-serif] text-lg font-bold text-slate-900">
                      Book Your Skating Appointment
                    </h3>
                    <p className="text-xs text-slate-500">
                      Skating Academy • Al Nahiyan, Abu Dhabi
                    </p>
                  </div>
                </div>

                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      required
                      value={appointmentName}
                      onChange={(e) => setAppointmentName(e.target.value)}
                      placeholder="e.g. Maya Al-Nuaimi"
                      style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#20b2aa] focus:ring-1 focus:ring-[#20b2aa]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">
                        Phone Number (9 Digits) *
                      </label>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {appointmentPhone.length}/9
                      </span>
                    </div>
                    <div className={`flex items-center rounded-xl border overflow-hidden bg-white ${phoneError ? 'border-rose-500' : 'border-slate-300 focus-within:border-[#20b2aa] focus-within:ring-1 focus-within:ring-[#20b2aa]'}`}>
                      <div className="flex items-center gap-1 px-3 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs border-r border-slate-300 shrink-0">
                        <Phone className="w-3.5 h-3.5 text-[#20b2aa]" />
                        <span>+971</span>
                      </div>
                      <input 
                        type="tel" 
                        required 
                        maxLength={9}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={appointmentPhone}
                        onChange={(e) => {
                          const digits = format10DigitPhone(e.target.value);
                          setAppointmentPhone(digits);
                          if (phoneError) setPhoneError('');
                        }}
                        placeholder="50 123 4567"
                        style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                        className="w-full px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none"
                      />
                    </div>
                    {phoneError && (
                      <div className="flex items-center gap-1 text-rose-500 text-xs mt-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{phoneError}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Service
                    </label>
                    <select 
                      value={appointmentService}
                      onChange={(e) => setAppointmentService(e.target.value)}
                      style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#20b2aa] focus:ring-1 focus:ring-[#20b2aa]"
                    >
                      <option>Skating Training Program (10-Level)</option>
                      <option>Weekend Fun Glide Admission</option>
                      <option>1-on-1 Private Coaching</option>
                      <option>Skate Gear & Equipment Fitting</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    📍 <strong>Location:</strong> Al Nahiyan, Abu Dhabi.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#00473e] hover:bg-[#003831] text-white text-xs font-bold uppercase tracking-wider shadow-lg active:scale-95 transition-all mt-4"
                  >
                    Confirm &amp; Book Appointment
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          13. LIGHTBOX MODAL FOR GALLERY PREVIEW
          ========================================================================= */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-fadeIn"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            <img src={selectedImage} alt="Preview" className="w-full h-full object-contain" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
