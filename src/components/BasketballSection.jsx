import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Target,
  Calendar,
  Award,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Play,
  Pause,
  Clock,
  ChevronRight,
  ChevronDown,
  Flame,
  Gift,
  Star,
  Users,
  Film,
  Zap,
  Tag,
  Shield,
  ShieldCheck,
  MessageSquare,
  Check,
  MapPin
} from 'lucide-react';
import BasketballScratchModal from './BasketballScratchModal';
import BasketballTrialModal from './BasketballTrialModal';

// ─── Scroll Reveal Wrapper ────────────────────────────────────────────────────
function ScrollReveal({ children, delay = 0, direction = 'up', className = '' }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const base = {
    transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible
      ? 'none'
      : direction === 'up' ? 'translateY(52px)'
        : direction === 'down' ? 'translateY(-52px)'
          : direction === 'left' ? 'translateX(52px)'
            : direction === 'right' ? 'translateX(140px)'
              : 'translateX(-52px)',
    willChange: 'transform, opacity',
  };

  return (
    <div ref={ref} style={base} className={className}>
      {children}
    </div>
  );
}
// ──────────────────────────────────────────────────────────────────────────────

export default function BasketballSection({ navigateTo, openTrialModal }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLocalTrialModalOpen, setIsLocalTrialModalOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState('arena-tour');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReviewCategory, setSelectedReviewCategory] = useState('all');
  const [isScratchModalOpen, setIsScratchModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Heading pops up automatically on page open.
  // When user scrolls, description appears in pure text only.
  const [showDescription, setShowDescription] = useState(false);

  // Typewriter animation for "STRATEGY BASKETBALL" (Line 1) and "ACADEMY" (Line 2)
  const heroLine1 = 'STRATEGY BASKETBALL';
  const heroLine2 = 'ACADEMY';
  const [line1Text, setLine1Text] = useState('');
  const [line2Text, setLine2Text] = useState('');

  useEffect(() => {
    let char1Index = 0;
    let char2Index = 0;
    setLine1Text('');
    setLine2Text('');

    let timerId = null;

    const typeLine1 = () => {
      char1Index++;
      setLine1Text(heroLine1.slice(0, char1Index));

      if (char1Index >= heroLine1.length) {
        timerId = setTimeout(typeLine2, 60);
        return;
      }

      const nextChar = heroLine1[char1Index];
      const delay = nextChar === ' ' ? 80 : 35;
      timerId = setTimeout(typeLine1, delay);
    };

    const typeLine2 = () => {
      char2Index++;
      setLine2Text(heroLine2.slice(0, char2Index));

      if (char2Index >= heroLine2.length) {
        return;
      }

      const nextChar = heroLine2[char2Index];
      const delay = nextChar === ' ' ? 80 : 35;
      timerId = setTimeout(typeLine2, delay);
    };

    timerId = setTimeout(typeLine1, 100);

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setShowDescription(true);
      } else if (window.scrollY === 0) {
        setShowDescription(false);
      }
    };

    const handleWheel = (e) => {
      if (e.deltaY > 10) {
        setShowDescription(true);
      } else if (e.deltaY < -10 && window.scrollY <= 10) {
        setShowDescription(false);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        const diff = touchStartY - e.changedTouches[0].clientY;
        if (diff > 15) {
          setShowDescription(true);
        } else if (diff < -15 && window.scrollY <= 10) {
          setShowDescription(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Auto-prompt first-time visitor scratch card popup once per session
  useEffect(() => {
    const hasSeenScratch = sessionStorage.getItem('strategy_seen_scratch_pass');
    if (!hasSeenScratch) {
      const timer = setTimeout(() => {
        setIsScratchModalOpen(true);
        sessionStorage.setItem('strategy_seen_scratch_pass', 'true');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const videoReels = [
    {
      id: 'arena-tour',
      title: 'Strategy 4K Arena Tour',
      duration: '02:18',
      quality: '4K Ultra HD',
      poster: '/images/basketball_academy.jpg',
      category: 'Facility Tour',
      views: '14.2k views',
      desc: 'Take an insider walkthrough of our Canadian maple sprung timber courts, digital scoreboard system, and climate-controlled training arena.'
    },
    {
      id: 'slam-dunks',
      title: 'High-Action In-Game Highlights',
      duration: '03:45',
      quality: '4K 60FPS',
      poster: '/images/basketball_video_poster.jpg',
      category: 'Highlights',
      views: '28.9k views',
      desc: 'Watch our varsity athletes and adult league all-stars execute pick-and-roll set pieces, fast break dunks, and clutch buzzer beaters.'
    },
    {
      id: 'dr-dish-demo',
      title: 'Dr. Dish All-Star Rapid Shooting Lab in Full Action',
      duration: '01:52',
      quality: '1080p HD',
      poster: '/images/basketball_banner_clinic.jpg',
      category: 'Shooting Lab',
      views: '19.4k views',
      desc: 'See how our automated rapid-pass machines and computer vision tracking calibrate shooting release speed and arc consistency.'
    }
  ];

  const currentVideo = videoReels.find(v => v.id === activeVideoId) || videoReels[0];

  const promoBanners = [
    {
      id: 'coach-alex',
      title: 'Coach Alex - Elite Shooting & Skills Clinic',
      tag: '🔥 Head Skills Coach',
      subtitle: 'Personalized shooting mechanics, ball-handling mastery, and IQ game development.',
      cta: 'Train With Coach Alex',
      badge: 'FIBA Certified',
      img: '/images/coaches/coach_1.jpg',
      objectPosition: 'center 32%'
    },
    {
      id: 'coach-david',
      title: 'Coach David - Defense & Tactical Play Lab',
      tag: '⚡ High Performance',
      subtitle: 'Agility conditioning, defensive stance, pick-and-roll reads, and competitive sparring.',
      cta: 'Book Coach David',
      badge: 'All Skill Levels',
      img: '/images/coaches/coach_2.jpg',
      objectPosition: 'center 32%'
    },
    {
      id: 'coach-marcus',
      title: 'Coach Marcus - 1-on-1 Mentorship & League Prep',
      tag: '⭐ Performance Trainer',
      subtitle: 'Strength, explosiveness, fast-break execution, and tournament readiness coaching.',
      cta: 'Join Coach Marcus',
      badge: 'Ages 6–18 & Adults',
      img: '/images/coaches/coach_3.jpg',
      objectPosition: 'center 18%'
    }
  ];

  const programs = [
    {
      id: 'rookie-ballers',
      category: 'kids',
      title: 'Rookie Ballers (Ages 4–8)',
      ageBadge: 'Ages 4–8 • Beginner',
      duration: '45 mins • 2x/week',
      description: 'The ultimate fun introduction to basketball! Focuses on hand-eye coordination, two-handed dribbling, mini-hoop shooting mechanics, and teamwork.',
      features: ['Mini-Basketballs & Low Rim', 'Balance & Footwork Drills', 'Fun Shooting Games', '1:5 Coach-to-Player Ratio'],
      level: 'Beginner'
    },
    {
      id: 'junior-hoops',
      category: 'youth',
      title: 'Junior Pro & Shooting Lab (Ages 9–14)',
      ageBadge: 'Ages 9–14 • Intermediate',
      duration: '60 mins • 3x/week',
      description: 'Comprehensive skill development covering crossover dribbling, jump shot arc analysis, defensive spacing, and 3v3 half-court tactical play.',
      features: ['Noah Shooting Arc Analytics', 'Pick & Roll Mechanics', 'Defensive Slide Agility', 'Weekly 3v3 Scrimmages'],
      level: 'Intermediate'
    },
    {
      id: 'elite-academy',
      category: 'youth',
      title: 'Elite High-Performance Prep (Ages 15–18)',
      ageBadge: 'Ages 15–18 • Advanced',
      duration: '90 mins • 4x/week',
      description: 'Intense tournament and varsity-level training. Includes athletic vertical conditioning, full-court set plays, video breakdown, and college recruitment profiles.',
      features: ['Video Game Tape Analysis', 'Explosive Vertical Jump Training', 'Full-Court 5v5 Tactical Execution', 'Scouting & Highlight Reels'],
      level: 'Advanced / Competitive'
    },
    {
      id: 'adult-leagues',
      category: 'adult',
      title: 'Adult 5v5 League & Open Runs (18+)',
      ageBadge: 'Adults 18+ • All Levels',
      duration: '75 mins • Evenings & Weekends',
      description: 'High-energy competitive and recreational adult basketball. Officiated 5v5 matches, certified referees, live scoreboard stats, and weekly pick-up runs.',
      features: ['FIBA Certified Referees', 'Live Digital Stat Tracking', 'Season Championship Trophy', 'Air-Conditioned Indoor Arena'],
      level: 'All Adult Levels'
    }
  ];

  const filteredPrograms = selectedCategory === 'all'
    ? programs
    : programs.filter(p => p.category === selectedCategory);

  const amenities = [
    {
      icon: <Trophy className="w-5 h-5 text-blue-400" />,
      title: 'FIBA Hardwood Court',
      desc: 'Shock-absorbing sprung Canadian maple timber court protecting joints and knees.'
    },
    {
      icon: <Target className="w-5 h-5 text-blue-400" />,
      title: 'Dr. Dish Shooting Lab',
      desc: 'Automated rapid-fire passing machines and shot trajectory tracking system.'
    },
    {
      icon: <Award className="w-5 h-5 text-blue-400" />,
      title: 'FIBA & USAB Coaches',
      desc: 'Coached by former international pros and certified youth athletic developers.'
    },
    {
      icon: <Zap className="w-5 h-5 text-blue-400" />,
      title: 'Indoor Climate Control',
      desc: 'Full chilled air-conditioning so players perform at peak stamina year-round during training.'
    }
  ];

  const studentReviews = [
    {
      id: 1,
      name: 'Tariq Al-Mansoor',
      ageGroup: 'Junior Pro Academy (Age 12)',
      category: 'youth',
      avatarColor: 'from-blue-500 to-indigo-600',
      rating: 5,
      date: 'February 2026',
      badge: 'Verified Athlete',
      highlightMetric: '+28% Shot Accuracy',
      review: 'The Dr. Dish shooting machine combined with coach Marcus breaking down my release on the iPad completely changed my shot arc. Made the school varsity team last month!'
    },
    {
      id: 2,
      name: 'Elena Rostova',
      ageGroup: 'Adult Friday 5v5 League',
      category: 'adult',
      avatarColor: 'from-cyan-400 to-blue-600',
      rating: 5,
      date: 'January 2026',
      badge: 'League MVP 2025',
      highlightMetric: '18.4 PPG Average',
      review: 'Best hardwood court in town hands down. Sprung Canadian maple floor means zero knee pain after intense 5v5 runs. Referees are professional and scoreboard tracking is top tier.'
    },
    {
      id: 3,
      name: 'Zaid & Sara (Parents)',
      ageGroup: 'Rookie Ballers (Son Leo, Age 6)',
      category: 'kids',
      avatarColor: 'from-amber-400 to-orange-500',
      rating: 5,
      date: 'February 2026',
      badge: 'Parent of Rookie',
      highlightMetric: '100% Attendance',
      review: 'Our 6-year-old was shy and uncoordinated with ball sports. Within 4 weeks he was bouncing two basketballs simultaneously with a smile. The coaches make every drill fun and engaging.'
    },
    {
      id: 4,
      name: 'Kareem O’Connor',
      ageGroup: 'Elite Prep High-School (Age 16)',
      category: 'youth',
      avatarColor: 'from-purple-500 to-blue-600',
      rating: 5,
      date: 'December 2025',
      badge: 'D1 Prospect Squad',
      highlightMetric: '+4.5 inch Vertical',
      review: 'The plyometric conditioning and full-court tactical game tape analysis here is on par with European professional club academies. If you are serious about basketball, this is where you train.'
    },
    {
      id: 5,
      name: 'David Chen',
      ageGroup: 'Weekend Cardio & Open Runs',
      category: 'adult',
      avatarColor: 'from-sky-400 to-blue-700',
      rating: 5,
      date: 'January 2026',
      badge: 'Adult Member',
      highlightMetric: '750+ Cal Burn/Game',
      review: 'Super clean, chilled climate-controlled stadium, excellent locker rooms, and great community. Much better than dusty outdoor courts in the heat.'
    },
    {
      id: 6,
      name: 'Fatima Al-Nuaimi',
      ageGroup: 'Junior Hoops Parent (Daughter Maya, Age 10)',
      category: 'youth',
      avatarColor: 'from-emerald-400 to-teal-600',
      rating: 5,
      date: 'March 2026',
      badge: '2 Years with Strategy',
      highlightMetric: 'Skills Badge Level 3',
      review: 'The attention to safety and fundamental discipline is world class. The coaches teach real teamwork and sportsmanship alongside advanced dribbling skills. We will be re-enrolling every term.'
    }
  ];

  const filteredReviews = selectedReviewCategory === 'all'
    ? studentReviews
    : studentReviews.filter(r => r.category === selectedReviewCategory);

  return (
    <div className="bb-page-wrapper">

      {/* Darkened User Gradient Background Pattern */}
      <div className="bb-bg-texture" />

      {/* Deep Midnight Blue Atmospheric Gradient Overlays */}
      <div className="bb-bg-overlay" />

      {/* =========================================================================
          HERO SECTION (Heading pops up on open -> Description in text only on scroll)
          ========================================================================= */}
      <section className="bb-scroll-hero-section" style={{ backgroundImage: 'url("/images/basketball_hero_kids.jpg")', backgroundSize: 'cover', backgroundPosition: 'center 20%' }}>
        {/* Subtle Vignette Gradient Overlay */}
        <div className="bb-scroll-hero-overlay" />

        {/* Center Content: Heading pops up immediately on open, description text pops up on scroll */}
        <div
          className="bb-scroll-hero-content"
          style={{ paddingTop: 'clamp(20px, 5vh, 50px)' }}
          onClick={() => setShowDescription(prev => !prev)}
        >
          {/* HEADING POPS UP FIRST WITH TYPEWRITER ANIMATION */}
          <div className="bb-hero-title-pop" style={{ textAlign: 'center', maxWidth: '100%', width: '100%', padding: '0 12px', margin: '0 auto', boxSizing: 'border-box' }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(24px, 5.5vw, 64px)',
              fontWeight: 900,
              letterSpacing: '0.02em',
              lineHeight: 1.15,
              textTransform: 'uppercase',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #BAE6FD 55%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 25px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 35px rgba(56, 189, 248, 0.6))',
              margin: '0 auto',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              maxWidth: '100%',
              overflowWrap: 'break-word',
              wordBreak: 'break-word'
            }}>
              <span style={{ display: 'inline-block', maxWidth: '100%', wordBreak: 'break-word', minHeight: '1.15em' }}>
                {line1Text}
              </span>
              <span style={{
                display: 'inline-block',
                maxWidth: '100%',
                wordBreak: 'break-word',
                minHeight: '1.15em',
                visibility: line2Text ? 'visible' : 'hidden'
              }}>
                {line2Text}
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PREMIUM BASKETBALL ACADEMY SECTION: EXPERIENCE THAT BUILDS CHAMPIONS
          ========================================================================= */}
      <section className="bb-champions-section relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">

        <ScrollReveal direction="up" delay={0} className="w-full relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* LEFT COLUMN: Headline with Electric Script CHAMPIONS & Subtitle */}
            <div className="lg:col-span-6 flex flex-col justify-center items-start text-left">
              <div>
                {/* Main Headline */}
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.05] font-['Oswald',sans-serif]">
                  EXPERIENCE <br />
                  THAT BUILDS <br />
                  <span className="inline-block text-cyan-400 font-['Permanent_Marker','Caveat',cursive] text-4xl sm:text-6xl lg:text-7xl capitalize tracking-wide font-normal italic transform -rotate-1 mt-1 drop-shadow-[0_0_25px_rgba(56,189,248,0.8)]">
                    Champions
                  </span>
                </h2>

                {/* Subtle Divider Line */}
                <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent my-6" />

                {/* Subtitle */}
                <p className="text-slate-300 text-xs sm:text-sm md:text-base font-medium leading-relaxed max-w-md">
                  Building skills. Building character. <br className="hidden sm:inline" />
                  Building the champions of tomorrow.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Vertical Timeline Connecting Line + 3 Glowing Cards */}
            <div className="lg:col-span-6 relative flex flex-col justify-center">

              {/* Vertical Timeline Bar with 3 Colored Glowing Dots */}
              <div className="absolute left-3.5 sm:left-4 top-8 bottom-8 w-[2px] bg-gradient-to-b from-cyan-400 via-yellow-400 to-emerald-400 opacity-70 z-0 pointer-events-none" />

              <div className="space-y-6 sm:space-y-8 relative z-10 pl-10 sm:pl-12">

                {/* Card 1: 10+ Years Experience (Cyan) */}
                <div className="relative group">
                  {/* Timeline Dot 1 */}
                  <div className="absolute -left-[37px] sm:-left-[43px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(56,189,248,1)] border-2 border-slate-950 z-20" />

                  <div
                    className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-950/90 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(56,189,248,0.15)] flex items-center gap-4 sm:gap-6 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
                      <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Oswald',sans-serif]">
                        10+
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-white tracking-widest uppercase mt-0.5">
                        YEARS EXPERIENCE
                      </div>
                      <div className="text-[11px] sm:text-xs font-bold text-cyan-300 mt-1 flex items-center gap-1.5">
                        <span className="text-cyan-400">▪</span> Proven Elite Legacy
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: 4 Certified Coaches (Gold/Yellow) */}
                <div className="relative group">
                  {/* Timeline Dot 2 */}
                  <div className="absolute -left-[37px] sm:-left-[43px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_14px_rgba(250,204,21,1)] border-2 border-slate-950 z-20" />

                  <div
                    className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-yellow-500/40 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-950/90 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(250,204,21,0.15)] flex items-center gap-4 sm:gap-6 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-yellow-500/10 border border-yellow-400/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(250,204,21,0.25)]">
                      <Award className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Oswald',sans-serif]">
                        4
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-white tracking-widest uppercase mt-0.5">
                        CERTIFIED COACHES
                      </div>
                      <div className="text-[11px] sm:text-xs font-bold text-yellow-300 mt-1 flex items-center gap-1.5">
                        <span className="text-yellow-400">▪</span> 100% FIBA Accredited
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: 2,000+ Students Taught (Emerald/Green) */}
                <div className="relative group">
                  {/* Timeline Dot 3 */}
                  <div className="absolute -left-[37px] sm:-left-[43px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,1)] border-2 border-slate-950 z-20" />

                  <div
                    className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-950/90 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(52,211,153,0.15)] flex items-center gap-4 sm:gap-6 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(52,211,153,0.25)]">
                      <Users className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Oswald',sans-serif]">
                        2,000+
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-white tracking-widest uppercase mt-0.5">
                        STUDENTS TAUGHT
                      </div>
                      <div className="text-[11px] sm:text-xs font-bold text-emerald-300 mt-1 flex items-center gap-1.5">
                        <span className="text-emerald-400">✦</span> Champions in Progress!
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* =========================================================================
          FULL ACADEMY CONTENT (VIDEO SECTION FILLS SCREEN HEIGHT)
          ========================================================================= */}
      <section id="bb-programs-section" className="bb-video-section-wrapper">

        {/* =========================================================================
            FEATURED VIDEO & INTERACTIVE REEL SECTION
            ========================================================================= */}
        <ScrollReveal delay={0} direction="up" className="w-full">
          {/* Section Header outside the box — identical to others */}
          <div className="bb-section-header">
            <div>
              <h2 className="bb-section-title">
                <span>{currentVideo.title.toUpperCase()}</span>
              </h2>
              <p className="bb-section-desc">Experience our world-class facilities and high-intensity training courts in ultra HD</p>
            </div>
          </div>

          <div className="bb-video-card">
            {/* 1. Pure Clean Video Screen */}
            <div className="bb-video-screen">
              <img
                src={currentVideo.poster}
                alt={currentVideo.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: isPlaying ? 'brightness(0.95)' : 'brightness(0.8)'
                }}
              />

              {/* Play Button Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}
              >
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(37, 99, 235, 0.6)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <Play style={{ width: '28px', height: '28px', fill: 'currentColor', marginLeft: '3px' }} />
                </button>

                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#ffffff',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  Click to Watch 4K Arena Feed
                </div>
              </div>

              {/* Top Video Metadata Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  right: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  pointerEvents: 'none'
                }}
              >
                <div
                  style={{
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#67e8f9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Film style={{ width: '13px', height: '13px' }} />
                  <span>{currentVideo.quality}</span>
                </div>

                <div
                  style={{
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#bfdbfe'
                  }}
                >
                  {currentVideo.views}
                </div>
              </div>
            </div>

            {/* 2. Video Info Card Bar */}
            <div className="bb-video-info-bar">
              {currentVideo.desc && (
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(191, 219, 254, 0.85)',
                  maxWidth: '680px',
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  {currentVideo.desc}
                </p>
              )}

              <button
                onClick={() => setIsLocalTrialModalOpen(true)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '9999px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: '1px solid rgba(147, 197, 253, 0.3)',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>Book Hardwood Pass</span>
                <ChevronRight style={{ width: '15px', height: '15px' }} />
              </button>
            </div>

            {/* 3. Video Selector Channels / Tabs */}
            <div className="bb-video-tabs-grid">
              {videoReels.map((vid) => {
                const isActive = vid.id === activeVideoId;
                return (
                  <button
                    key={vid.id}
                    onClick={() => {
                      setActiveVideoId(vid.id);
                      setIsPlaying(true);
                    }}
                    className={`bb-video-tab-btn ${isActive ? 'active' : ''}`}
                  >
                    <div style={{
                      width: '56px',
                      height: '42px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      position: 'relative',
                      background: '#000'
                    }}>
                      <img src={vid.poster} alt={vid.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Play style={{ width: '12px', height: '12px', fill: '#fff', color: '#fff' }} />
                      </div>
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#ffffff',
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {vid.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#67e8f9', fontWeight: 600, marginTop: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>{vid.duration}</span>
                        <span>•</span>
                        <span>{vid.category}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* =====================================================================
          CONTENT SECTIONS CONTAINER — floats cards with side padding
          ===================================================================== */}
      <div style={{
        width: '100%',
        maxWidth: '1140px',
        margin: '0 auto',
        padding: '0 clamp(20px, 5vw, 40px)',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10
      }}>

        {/* =========================================================================
            PROMOTIONAL BANNERS SHOWCASE (PERFECT CARD CONTAINMENT & ALIGNMENT)
            ========================================================================= */}
        <ScrollReveal delay={0} direction="up">
          <div style={{ marginTop: 'clamp(64px, 8vw, 96px)', marginBottom: '60px' }}>
            <div className="bb-section-header">
              <div>
                <h2 className="bb-section-title">
                  <Tag style={{ width: '22px', height: '22px', color: '#38bdf8', flexShrink: 0 }} />
                  <span>OUR COACHES &amp; FEATURED PROGRAMS</span>
                </h2>
                <p className="bb-section-desc">Certified FIBA coaches, specialized clinics &amp; elite player development</p>
              </div>
            </div>

            <div className="bb-banners-grid">
              {promoBanners.map((banner, idx) => (
                <ScrollReveal key={banner.id} delay={idx * 120} direction="up">
                  <div className="bb-banner-card">

                    {/* Banner Header Image with badges */}
                    <div className="bb-banner-media" style={{ height: '310px' }}>
                      <img
                        src={banner.img}
                        alt={banner.title}
                        style={{
                          objectPosition: banner.objectPosition || 'center 25%',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      <div className="bb-banner-media-overlay" />

                      <div className="bb-banner-badges">
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(37, 99, 235, 0.9)',
                          color: '#ffffff',
                          fontSize: '10px',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {banner.tag}
                        </span>

                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(0, 0, 0, 0.75)',
                          color: '#67e8f9',
                          fontSize: '10px',
                          fontWeight: 700,
                          border: '1px solid rgba(255, 255, 255, 0.15)'
                        }}>
                          {banner.badge}
                        </span>
                      </div>
                    </div>

                    {/* Banner Content Body (Contained and cleanly padded) */}
                    <div className="bb-banner-body">
                      <div>
                        <h3 className="bb-banner-title">
                          {banner.title}
                        </h3>
                        <p className="bb-banner-subtitle">
                          {banner.subtitle}
                        </p>
                      </div>

                      <button
                        onClick={() => setIsLocalTrialModalOpen(true)}
                        className="bb-banner-btn"
                      >
                        <span>{banner.cta}</span>
                        <ChevronRight style={{ width: '15px', height: '15px' }} />
                      </button>
                    </div>

                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* =========================================================================
            FACILITY AMENITIES (CLEAN 4-COLUMN RESPONSIVE GRID)
            ========================================================================= */}
        <ScrollReveal delay={0} direction="up">
          <div style={{ marginTop: 'clamp(64px, 8vw, 96px)', marginBottom: '60px' }}>
            <div className="bb-section-header">
              <div>
                <h2 className="bb-section-title">
                  <Zap style={{ width: '22px', height: '22px', color: '#38bdf8', flexShrink: 0 }} />
                  <span>ARENA FACILITIES &amp; TECHNOLOGY</span>
                </h2>
                <p className="bb-section-desc">Professional-grade amenities engineered for athletic safety and peak training</p>
              </div>
            </div>
            <div className="bb-amenities-grid">
              {amenities.map((item, idx) => (
                <ScrollReveal key={idx} delay={idx * 80} direction="up" className="h-full flex flex-col">
                  <div className="bb-amenity-card">
                    <div className="bb-amenity-icon">
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 className="bb-amenity-title">
                        {item.title}
                      </h3>
                      <p className="bb-amenity-desc" style={{ margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Fullscreen Video Modal if opened */}
        {isVideoModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '850px',
              backgroundColor: '#070f2b',
              borderRadius: '24px',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
            }}>
              <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Film style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
                  <span style={{ fontWeight: 800, fontSize: '14px', fontFamily: 'var(--font-heading)' }}>
                    {currentVideo.title}
                  </span>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  style={{
                    padding: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <ArrowLeft style={{ width: '16px', height: '16px' }} />
                </button>
              </div>

              <div style={{ position: 'relative', aspectRatio: '16/9', width: '100%', background: '#000' }}>
                <img src={currentVideo.poster} alt={currentVideo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Play style={{ width: '24px', height: '24px', fill: 'currentColor', marginLeft: '3px' }} />
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#ffffff',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    4K Ultra HD Broadcast Feed Active
                  </div>
                </div>
              </div>

              <div style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                backgroundColor: '#0a1640'
              }}>
                <p style={{ fontSize: '12px', color: '#bfdbfe', maxWidth: '580px', margin: 0, lineHeight: 1.5 }}>
                  {currentVideo.desc}
                </p>
                <button
                  onClick={() => {
                    setIsVideoModalOpen(false);
                    setIsLocalTrialModalOpen(true);
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '9999px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '12px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Book 30 AED Pass
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TRIAL CLASS INTRODUCTION SECTION (WITH USER ATHLETE PHOTO)
            ========================================================================= */}
        <ScrollReveal delay={0} direction="up">
          <div style={{ marginTop: 'clamp(64px, 8vw, 96px)', marginBottom: '60px' }}>
            <div className="bb-section-header">
              <div>
                <h2 className="bb-section-title">
                  <Sparkles style={{ width: '22px', height: '22px', color: '#38bdf8', flexShrink: 0 }} />
                  <span>TRY YOUR FIRST CLASS FOR FREE</span>
                </h2>
                <p className="bb-section-desc">Experience our world-class coaching, maple court, and team energy before you enroll</p>
              </div>
            </div>

            <div className="bb-trial-intro-card">
              {/* Left Column: Image with Floating Badges */}
              <div className="bb-trial-img-col">
                <img
                  src="/images/basketball_trial_athletes.jpg"
                  alt="Strategy Basketball Academy Trial Class Athletes"
                  className="bb-trial-img"
                />

                {/* Badge: 100% Free Trial */}
                <div className="bb-trial-img-badge">
                  <Flame style={{ width: '13px', height: '13px', color: '#f97316' }} />
                  <span>100% FREE TRIAL</span>
                </div>
              </div>

              {/* Right Column: Introduction, Highlights & Booking CTAs */}
              <div className="bb-trial-content-col">
                <div className="bb-trial-top-pill">
                  <Sparkles style={{ width: '13px', height: '13px' }} />
                  <span>NO COMMITMENT REQUIRED</span>
                </div>

                <h3 className="bb-trial-headline">
                  Step Onto The Court.<br />
                  <span style={{
                    background: 'linear-gradient(90deg, #38bdf8 0%, #60a5fa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Feel The Energy.
                  </span>
                </h3>

                <p className="bb-trial-desc">
                  Experience our 60-min coaching session at Al Nahyan Arena completely free. Meet the coaches and feel the STRATEGY team energy before you enroll.
                </p>

                {/* Compact 4-Item Highlights Grid */}
                <div className="bb-trial-perks-list">
                  <div className="bb-trial-perk-item">
                    <div className="bb-trial-perk-check">
                      <Check style={{ width: '11px', height: '11px', color: '#38bdf8', strokeWidth: 3 }} />
                    </div>
                    <span>60-Min Pro Coaching</span>
                  </div>

                  <div className="bb-trial-perk-item">
                    <div className="bb-trial-perk-check">
                      <Check style={{ width: '11px', height: '11px', color: '#38bdf8', strokeWidth: 3 }} />
                    </div>
                    <span>Free Skill Assessment</span>
                  </div>

                  <div className="bb-trial-perk-item">
                    <div className="bb-trial-perk-check">
                      <Check style={{ width: '11px', height: '11px', color: '#38bdf8', strokeWidth: 3 }} />
                    </div>
                    <span>Gear &amp; Ball Provided</span>
                  </div>

                  <div className="bb-trial-perk-item">
                    <div className="bb-trial-perk-check">
                      <Check style={{ width: '11px', height: '11px', color: '#38bdf8', strokeWidth: 3 }} />
                    </div>
                    <span>All Ages (5–18+ &amp; Adults)</span>
                  </div>
                </div>

                {/* Single Bold CTA Button */}
                <div className="bb-trial-cta-group">
                  <button
                    type="button"
                    onClick={() => {
                      if (navigateTo) {
                        navigateTo('trial-basketball');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        setIsLocalTrialModalOpen(true);
                      }
                    }}
                    className="bb-trial-primary-btn"
                  >
                    <span>BOOK 1-DAY FREE TRIAL</span>
                    <ChevronRight style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>

                {/* Assurance note */}
                <div className="bb-trial-guarantee-note">
                  <ShieldCheck style={{ width: '13px', height: '13px', color: '#10b981' }} />
                  <span>Zero obligation • Instant SMS &amp; WhatsApp confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* =========================================================================
            PROGRAM CATEGORIES & COURSES
            ========================================================================= */}
        <ScrollReveal delay={0} direction="up">
          <div style={{ marginTop: 'clamp(64px, 8vw, 96px)', marginBottom: '60px' }}>

            <div className="bb-section-header">
              <div>
                <h2 className="bb-section-title">
                  <span>OFFICIAL BASKETBALL PACKAGE</span>
                </h2>
                <p className="bb-section-desc">Join our premier coaching program at Al Nahyan Arena</p>
              </div>
            </div>

            {/* =========================================================================
              EXACT BASKETBALL PACKAGE CARD (2 MONTHS • 16 CLASSES • AED 500)
              ========================================================================= */}
            <div className="bb-exact-package-card">
              {/* Ceiling light slits fixture at top right */}
              <div className="bb-exact-ceiling-light">
                <span className="bb-exact-light-slit" />
                <span className="bb-exact-light-slit" />
                <span className="bb-exact-light-slit" />
                <span className="bb-exact-light-slit" />
              </div>

              {/* Horizontal box container on laptop/desktop; stacked on mobile */}
              <div className="bb-exact-horizontal-wrap">
                {/* LEFT COLUMN: BADGES, TITLE, ARENA DETAILS, & STATS */}
                <div className="bb-exact-details-col">
                  {/* Top Section: Badges, Title, Subtitle & Spotlight Basketball */}
                  <div className="bb-exact-card-top">
                    <div className="bb-exact-card-header-left">
                      {/* Badge 1: Limited Offer */}
                      <div className="bb-exact-badge-limited">
                        <span className="bb-exact-flame-icon">🔥</span>
                        <span>LIMITED OFFER</span>
                      </div>

                      {/* Badge 2: 2 Months Access */}
                      <div className="bb-exact-badge-access">
                        <Clock style={{ width: '13px', height: '13px', strokeWidth: 2.5 }} />
                        <span>2 MONTHS ACCESS</span>
                      </div>

                      {/* Heading */}
                      <h3 className="bb-exact-title">
                        2 Months<br />Basketball Coaching
                      </h3>
                      <p className="bb-exact-subtitle">Train. Improve. Dominate.</p>
                    </div>

                    {/* Top Right: Spotlight & 3D Basketball */}
                    <div className="bb-exact-ball-container">
                      <div className="bb-exact-spotlight-beam" />
                      <img
                        src="/images/package_basketball.jpg"
                        alt="Basketball"
                        className="bb-exact-ball-img"
                      />
                    </div>
                  </div>

                  {/* Location & Time Box */}
                  <div className="bb-exact-venue-card">
                    <div className="bb-exact-venue-pin-circle">
                      <MapPin style={{ width: '20px', height: '20px', color: '#ffffff', fill: '#ffffff' }} />
                    </div>
                    <div className="bb-exact-venue-info">
                      <h4 className="bb-exact-venue-name">Al Nahyan Arena</h4>
                      <div className="bb-exact-venue-details">
                        <span className="bb-exact-venue-item">
                          <Calendar style={{ width: '13px', height: '13px', color: '#38bdf8' }} />
                          <span>Sat, Sun & Wed</span>
                        </span>
                        <span className="bb-exact-venue-divider">|</span>
                        <span className="bb-exact-venue-item">
                          <Clock style={{ width: '13px', height: '13px', color: '#38bdf8' }} />
                          <span>6:00 PM</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 5-Column Stats Row */}
                  <div className="bb-exact-stats-row">
                    {/* 1: 16 Classes */}
                    <div className="bb-exact-stat-col">
                      <div className="bb-exact-stat-icon">
                        <Users style={{ width: '22px', height: '22px', color: '#0ea5e9' }} />
                      </div>
                      <div className="bb-exact-stat-val">16</div>
                      <div className="bb-exact-stat-label">Classes</div>
                    </div>

                    {/* 2: Maple Court */}
                    <div className="bb-exact-stat-col">
                      <div className="bb-exact-stat-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="18" rx="2" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <circle cx="12" cy="12" r="3" />
                          <path d="M7 3v4a3 3 0 0 0 6 0V3" />
                          <path d="M7 21v-4a3 3 0 0 1 6 0v4" />
                        </svg>
                      </div>
                      <div className="bb-exact-stat-val">Maple</div>
                      <div className="bb-exact-stat-label">Court</div>
                    </div>

                    {/* 3: 1:5 Ratio */}
                    <div className="bb-exact-stat-col">
                      <div className="bb-exact-stat-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="7" r="4" />
                          <path d="M5.5 21v-2a4.5 4.5 0 0 1 9 0v2" />
                          <circle cx="18" cy="11" r="2" />
                          <path d="M17 19v-1a2.5 2.5 0 0 0-2-2.45" />
                        </svg>
                      </div>
                      <div className="bb-exact-stat-val">1:5</div>
                      <div className="bb-exact-stat-label">Ratio</div>
                    </div>

                    {/* 4: Jersey & Ball */}
                    <div className="bb-exact-stat-col">
                      <div className="bb-exact-stat-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#0ea5e9" stroke="#0ea5e9" strokeWidth="1">
                          <path d="M8 2h8l2.5 4.5L16 8v13H8V8L5.5 6.5 8 2z" />
                          <path d="M10 2a2 2 0 0 0 4 0" fill="#040e29" />
                          <circle cx="12" cy="13" r="2" fill="#040e29" />
                        </svg>
                      </div>
                      <div className="bb-exact-stat-val">Jersey</div>
                      <div className="bb-exact-stat-label">& Ball</div>
                    </div>

                    {/* 5: Skills Analytics */}
                    <div className="bb-exact-stat-col">
                      <div className="bb-exact-stat-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 20V10" />
                          <path d="M12 20V4" />
                          <path d="M6 20v-6" />
                          <path d="M3 13l4-4 4 4 8-8" />
                          <path d="M15 5h4v4" />
                        </svg>
                      </div>
                      <div className="bb-exact-stat-val">Skills</div>
                      <div className="bb-exact-stat-label">Analytics</div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: PRICING & ACTIONS */}
                <div className="bb-exact-pricing-col">
                  {/* Bottom Card: Pricing & Actions */}
                  <div className="bb-exact-price-container">
                    {/* Regular Price */}
                    <div className="bb-exact-reg-price">
                      <span className="bb-exact-strikethrough">AED 750</span>
                      <span className="bb-exact-reg-label">Regular Price</span>
                    </div>

                    {/* Main Price */}
                    <div className="bb-exact-main-price-row">
                      <span className="bb-exact-currency">AED</span>
                      <span className="bb-exact-amount">500</span>
                      <span className="bb-exact-period">/ 2 Months</span>
                    </div>

                    {/* Save Badge */}
                    <div className="bb-exact-save-pill">
                      <Tag style={{ width: '13px', height: '13px', color: '#10b981' }} />
                      <span>SAVE AED 250 (33% OFF)</span>
                    </div>

                    {/* Per Class Pill */}
                    <div className="bb-exact-per-class-pill">
                      <span className="bb-exact-bolt">⚡</span>
                      <span>Just <strong className="bb-exact-gold-text">AED 31.25</strong> per class (16 Classes)</span>
                    </div>

                    {/* Claim Package Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (navigateTo) {
                          navigateTo('basketball-checkout');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          setIsLocalTrialModalOpen(true);
                        }
                      }}
                      className="bb-exact-claim-btn"
                    >
                      <span>CLAIM PACKAGE</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>

                    {/* Or Book Free Trial Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (navigateTo) {
                          navigateTo('trial-basketball');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          setIsLocalTrialModalOpen(true);
                        }
                      }}
                      className="bb-exact-trial-btn"
                    >
                      <span style={{ opacity: 0.7, marginRight: '4px' }}>OR</span>
                      <span>BOOK FREE TRIAL (1 CLASS)</span>
                    </button>

                    {/* Footnote */}
                    <div className="bb-exact-footnote">
                      <Shield style={{ width: '13px', height: '13px', color: '#64748b' }} />
                      <span>Instant confirmation • No hidden fees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>{/* end upper content sections container */}

      {/* =========================================================================
          STRATEGY TEAM HUDDLE BANNER (FULL SCREEN WIDTH EDGE-TO-EDGE FILL)
          ========================================================================= */}
      <section className="bb-quote-fullscreen-banner relative w-full overflow-hidden bg-[#030718] flex items-center justify-center py-0 my-0 border-none min-h-[380px] sm:min-h-[480px] md:min-h-[580px] lg:min-h-[680px] xl:min-h-[750px]">
        {/* Ambient Blurred Background Fill to seamlessly extend banner edge-to-edge */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center filter blur-2xl opacity-35 scale-125 pointer-events-none transition-all duration-700"
          style={{ backgroundImage: `url('/images/basketball_team_huddle_banner.jpg')` }}
        />

        {/* Ambient cyan & blue court radial glow matching basketball theme */}
        <div className="absolute bottom-0 left-0 right-0 h-[450px] bg-[radial-gradient(ellipse_85%_75%_at_50%_100%,rgba(14,165,233,0.25)_0%,rgba(3,105,161,0.1)_50%,transparent_85%)] pointer-events-none z-[1]" />

        {/* Top and Bottom Seamless Blending Gradients */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#030718] via-[#030718]/80 to-transparent pointer-events-none z-[2]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030718] via-[#030718]/80 to-transparent pointer-events-none z-[2]" />

        {/* Main Banner Image Container - Full Width & Height Fill on both Mobile and Laptop */}
        <div className="relative z-10 w-full h-full flex items-center justify-center min-h-[380px] sm:min-h-[480px] md:min-h-[580px] lg:min-h-[680px] xl:min-h-[750px]">
          <img
            src="/images/basketball_team_huddle_banner.jpg"
            alt="Strategy Basketball Academy Team Huddle"
            className="w-full h-full min-h-[380px] sm:min-h-[480px] md:min-h-[580px] lg:min-h-[680px] xl:min-h-[750px] object-cover object-center block transform scale-100 transition-transform duration-700"
          />
        </div>
      </section>

      {/* =========================================================================
          SLEEK BLACK & DEEP BLUE GRADIENT REVIEWS SECTION
          ========================================================================= */}
      <section className="bb-reviews-orange-gradient-section" style={{
        width: '100%',
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#030718',
        background: 'linear-gradient(180deg, #030718 0%, #071337 40%, #030718 80%, #020617 100%)',
        padding: '52px 0 96px 0',
        margin: 0,
        overflow: 'hidden',
        borderTop: 'none'
      }}>
        {/* Subtle Ambient Glows */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          height: '420px',
          background: 'radial-gradient(ellipse at center top, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* Inner Content Container */}
        <div style={{
          width: '100%',
          maxWidth: '1140px',
          margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 40px)',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 2
        }}>

          {/* =========================================================================
              STUDENT & ATHLETE REVIEWS SECTION
              ========================================================================= */}
          <ScrollReveal delay={0} direction="up">
            <div style={{ marginBottom: '20px' }}>

              {/* Reviews Summary Card */}
              <div className="bb-reviews-summary-card" style={{
                background: 'linear-gradient(145deg, rgba(8, 20, 56, 0.9) 0%, rgba(3, 10, 30, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(56, 189, 248, 0.15)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Top Accent Line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '20px',
                  right: '20px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)',
                  opacity: 0.9
                }} />

                {/* Overall Score Badge & Title */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  width: '100%'
                }}>
                  <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(28px, 4.8vw, 48px)',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #BAE6FD 55%, #38BDF8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 4px 25px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 35px rgba(56, 189, 248, 0.5))',
                    margin: '0 auto 10px auto',
                    textAlign: 'center'
                  }}>
                    WHAT OUR BALLERS &amp; PARENTS SAY
                  </h2>

                  <p style={{ fontSize: '14px', color: '#cbd5e1', opacity: 0.92, maxWidth: '560px', lineHeight: 1.55, margin: '0 auto', textAlign: 'center' }}>
                    Real feedback from junior ballers, high-school varsity athletes, and adult league champions training at Strategy Arena.
                  </p>
                </div>

                {/* Rating Metrics Card */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  backgroundColor: 'rgba(7, 19, 55, 0.85)',
                  padding: '16px 22px',
                  borderRadius: '18px',
                  border: '1.5px solid rgba(56, 189, 248, 0.3)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
                  flexShrink: 0
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '34px',
                      fontWeight: 900,
                      color: '#ffffff',
                      fontFamily: 'var(--font-heading)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      lineHeight: 1
                    }}>
                      <span>4.9</span>
                      <Star style={{ width: '24px', height: '24px', color: '#f59e0b', fill: '#f59e0b' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginTop: '6px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} style={{ width: '13px', height: '13px', color: '#f59e0b', fill: '#f59e0b' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', color: '#7dd3fc', fontWeight: 700, marginTop: '5px', display: 'block' }}>
                      180+ Reviews
                    </span>
                  </div>

                  <div style={{ width: '1px', height: '52px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <Check style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
                      <span><strong style={{ color: '#ffffff' }}>100%</strong> Certified FIBA Coaches</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <Check style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
                      <span><strong style={{ color: '#ffffff' }}>Canadian Maple</strong> Hardwood</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <Check style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
                      <span><strong style={{ color: '#ffffff' }}>Free Trial Pass</strong> Included</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Category Filter Tabs */}
              <div className="bb-filter-bar bb-reviews-filter-bar" style={{ marginBottom: '24px' }}>
                {[
                  { id: 'all', label: 'All Reviews (6)' },
                  { id: 'youth', label: 'Youth Academy (3)' },
                  { id: 'kids', label: 'Kids & Parents (1)' },
                  { id: 'adult', label: 'Adult League (2)' }
                ].map(pill => {
                  const isActive = selectedReviewCategory === pill.id;
                  return (
                    <button
                      key={pill.id}
                      onClick={() => setSelectedReviewCategory(pill.id)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: isActive ? '1px solid #93c5fd' : '1px solid rgba(56, 189, 248, 0.25)',
                        background: isActive
                          ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                          : 'rgba(8, 20, 56, 0.8)',
                        color: isActive ? '#ffffff' : '#cbd5e1',
                        boxShadow: isActive ? '0 0 22px rgba(37, 99, 235, 0.6)' : 'none'
                      }}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              {/* Reviews 3-Card Grid */}
              <div className="bb-reviews-grid">
                {filteredReviews.map((rev, idx) => (
                  <ScrollReveal key={rev.id} delay={idx * 120} direction="up">
                    <div className="bb-review-card bb-orange-review-card" style={{
                      background: 'linear-gradient(145deg, rgba(8, 20, 56, 0.9) 0%, rgba(3, 10, 30, 0.95) 100%)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1.5px solid rgba(56, 189, 248, 0.3)',
                      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(56, 189, 248, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Top Glowing Accent Line */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.6), transparent)'
                      }} />

                      <div>
                        {/* Reviewer Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 900,
                              fontSize: '13px',
                              color: '#ffffff',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
                            }}>
                              {rev.name.charAt(0)}
                            </div>
                            <div>
                              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                                {rev.name}
                              </h4>
                              <div style={{ fontSize: '10px', color: '#94a3b8', opacity: 0.9 }}>
                                {rev.ageGroup}
                              </div>
                            </div>
                          </div>

                          <span style={{
                            padding: '3px 9px',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(56, 189, 248, 0.15)',
                            color: '#7dd3fc',
                            fontSize: '9px',
                            fontWeight: 800,
                            border: '1px solid rgba(56, 189, 248, 0.35)'
                          }}>
                            {rev.badge}
                          </span>
                        </div>

                        {/* Stars & Metric Pill */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[...Array(rev.rating)].map((_, s) => (
                              <Star key={s} style={{ width: '13px', height: '13px', color: '#f59e0b', fill: '#f59e0b' }} />
                            ))}
                          </div>

                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(56, 189, 248, 0.18)',
                            color: '#7dd3fc',
                            fontSize: '10px',
                            fontWeight: 800,
                            border: '1px solid rgba(56, 189, 248, 0.35)'
                          }}>
                            {rev.highlightMetric}
                          </span>
                        </div>

                        {/* Quote */}
                        <p style={{
                          fontSize: '12px',
                          color: '#e2e8f0',
                          lineHeight: 1.55,
                          fontStyle: 'italic',
                          margin: 0,
                          opacity: 0.92
                        }}>
                          "{rev.review}"
                        </p>
                      </div>

                      <div style={{
                        paddingTop: '10px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '10px',
                        color: '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span>{rev.date}</span>
                        <span style={{ color: '#38bdf8', fontWeight: 800 }}>✓ Verified Enrollment</span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

            </div>
          </ScrollReveal>

        </div>{/* end inner reviews content container */}

      </section>{/* end orange gradient reviews section */}

      {/* Floating Bottom-Right Scratch Card Launcher */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 40 }}>
        <button
          onClick={() => setIsScratchModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            color: '#ffffff',
            fontSize: '32px',
            border: '3px solid #ffedd5',
            boxShadow: '0 10px 30px rgba(234, 88, 12, 0.5)',
            cursor: 'pointer',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          title="Save AED 250 Pass"
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15) rotate(15deg)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
        >
          🏀
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '14px',
            height: '14px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            border: '2px solid #ffedd5'
          }} />
        </button>
      </div>

      {/* Scratch Card Modal */}
      <BasketballScratchModal
        isOpen={isScratchModalOpen}
        onClose={() => setIsScratchModalOpen(false)}
        onRegister={() => {
          setIsScratchModalOpen(false);
          if (navigateTo) {
            navigateTo('basketball-checkout');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setIsLocalTrialModalOpen(true);
          }
        }}
      />

      <BasketballTrialModal
        isOpen={isLocalTrialModalOpen}
        onClose={() => setIsLocalTrialModalOpen(false)}
      />

    </div>
  );
}
