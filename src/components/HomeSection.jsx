import React, { useState, useEffect } from 'react';
import { X, Share2, MoreVertical, Calendar, GraduationCap, ShoppingBag, Trophy, MessageSquare, Check, Copy, ExternalLink, ChevronDown, ChevronUp, Sparkles, Info } from 'lucide-react';

// White vector basketball icon
function BasketballIcon({ className = "w-6 h-6" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2v20" />
      <path d="M4.93 4.93c4.2 4.2 4.2 9.94 0 14.14" />
      <path d="M19.07 4.93c-4.2 4.2-4.2 9.94 0 14.14" />
    </svg>
  );
}

// White vector skate icon
function SkateIcon({ className = "w-6 h-6" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M7 3h5.5l1 7 4.5 1.5a2 2 0 0 1 1.3 1.9v2.6H6v-3.5C6 10 7 7 7 3z" />
      <path d="M5.5 16h13.5" />
      <circle cx="8" cy="20" r="1.8" />
      <circle cx="16" cy="20" r="1.8" />
      <path d="M8 16v2.2" />
      <path d="M16 16v2.2" />
      <path d="M19 16l1.2 1.8" />
    </svg>
  );
}

export default function HomeSection({ navigateTo, openTrialModal }) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cardMenuOpen, setCardMenuOpen] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Pops up immediately on first scroll down
  const [isPopped, setIsPopped] = useState(false);

  // 4 Uploaded skating images
  const bannerImages = [
    { id: 1, url: '/images/banner_1.jpg', label: 'Safety & Kids Coaching' },
    { id: 2, url: '/images/banner_2.jpg', label: 'Fun Group Skating' },
    { id: 3, url: '/images/banner_3.jpg', label: 'Slalom & Agility Skills' },
    { id: 4, url: '/images/banner_4.jpg', label: 'Certified Coach Guidance' },
  ];

  // Automatic 5-second background switch timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  // Track single scroll down (wheel, touch swipe, or page scroll) to pop up buttons on the first scroll
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY > 10) {
        setIsPopped(true);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsPopped(true);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchStartY - touchEndY > 20) {
        setIsPopped(true);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const profileUrl = typeof window !== 'undefined' ? window.location.origin : 'https://linktr.ee/StrategySkateAcademy';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Strategy Skate Academy & Pro Shop',
          text: 'Join Strategy Skate Academy! Book a trial or browse pro skates & gear.',
          url: profileUrl,
        });
        return;
      } catch (err) {
        // Fallback to modal
      }
    }
    setIsShareOpen(true);
  };

  const portalLinks = [
    {
      id: 'trial',
      title: 'Book Trial Classes',
      subtitle: '',
      icon: <Calendar className="w-6 h-6" />,
      iconBg: '#0035f5',
      action: () => {
        navigateTo('trial');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'basketball',
      title: 'Basketball Academy',
      subtitle: '',
      icon: <BasketballIcon className="w-6 h-6" />,
      iconBg: '#0035f5',
      action: () => {
        navigateTo('basketball');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'skating',
      title: 'Skating Academy',
      subtitle: '',
      icon: <SkateIcon className="w-6 h-6" />,
      iconBg: '#0035f5',
      action: () => {
        navigateTo('skating');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'courses',
      title: 'Courses',
      subtitle: '',
      icon: <GraduationCap className="w-6 h-6" />,
      iconBg: '#0035f5',
      action: () => {
        navigateTo('programs');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'proshop',
      title: 'Pro Shop & Sports Gear',
      subtitle: '',
      icon: <ShoppingBag className="w-6 h-6" />,
      iconBg: '#0035f5',
      action: () => {
        navigateTo('shop-home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  ];

  return (
    <div className="home-reference-bg">
      
      {/* Fullscreen Clear Background Slideshow (Switches Every 5 Seconds) */}
      <div className="home-bg-carousel">
        {bannerImages.map((b, idx) => (
          <img
            key={b.id}
            src={b.url}
            alt={b.label}
            className={`home-bg-slide ${idx === currentBanner ? 'active' : 'inactive'}`}
          />
        ))}
        {/* Transparent gradient allowing background images to stay crisp and clear */}
        <div className="home-bg-overlay" />
      </div>

      {/* Top App Header (Matching Reference Navigation Bar) */}
      <div className="reference-app-bar">
        {/* Reset / Scroll to Top */}
        <button 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsPopped(false);
          }} 
          className="app-bar-btn"
          title="Reset to Top"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Center link handle */}
        <div className="flex items-center gap-1 text-xs font-bold text-white/90">
          <span className="text-white/60">linktr.ee/</span>
          <span className="text-white">StrategySkateAcademy</span>
        </div>

        {/* Right Action Icons: Share & 3-Dots Options */}
        <div className="flex items-center gap-2">
          {/* Working Share Button */}
          <button 
            onClick={handleNativeShare}
            className="app-bar-btn" 
            title="Share Strategy Skate Academy"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Working Three-Dots Options Menu */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="app-bar-btn" 
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Container Centered Over Clear Background */}
      <div className="home-main-center-wrapper">
        <div className="container max-w-xl mx-auto px-4 relative z-10 w-full">
          
          {/* Profile Header Area */}
          <div className="hero-profile-container">
            <h1 className="hero-profile-handle">
              @StrategySkateAcademy
            </h1>
          </div>

          {/* Subtle Indicator / Prompt if not popped yet */}
          {!isPopped && (
            <div className="text-center mt-6 animate-pulse">
              <button
                onClick={() => setIsPopped(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold hover:bg-black/60 hover:border-cyan-400/50 transition-all shadow-lg"
              >
                <span>Scroll down or tap to view</span>
                <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
              </button>
            </div>
          )}

          {/* =========================================================================
             POPPED CONTENT: OUR COURSES & SKATE HUB WITH WHITE PILL BUTTONS (SLOW SLIDE-IN)
             ========================================================================= */}
          {isPopped && (
            <div className="portal-pop-active">
              
              <div className="flex items-center justify-end px-2 mb-3">
                {/* Minimize button to enjoy clear photo background again */}
                <button
                  onClick={() => {
                    setIsPopped(false);
                  }}
                  className="text-xs text-white/80 hover:text-cyan-300 flex items-center gap-1 font-semibold px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20"
                  title="Minimize Hub"
                >
                  <span>Minimize</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Stacked Pill Card Buttons (Exact Reference Composition) */}
              <div className="reference-pill-list">
                {portalLinks.map((item) => (
                  <div key={item.id} className="relative">
                    <button
                      onClick={item.action}
                      className="reference-pill-card group"
                    >
                      {/* Left Circle Icon */}
                      <div 
                        className="pill-card-icon"
                        style={{ backgroundColor: item.iconBg }}
                      >
                        {item.icon}
                      </div>

                      {/* Center Title & Subtitle */}
                      <div className="pill-card-body">
                        <span className="pill-card-title group-hover:text-cyan-600 transition-colors">
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="pill-card-subtitle">
                            {item.subtitle}
                          </span>
                        )}
                      </div>

                      {/* Right Action Menu Dots */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCardMenuOpen(cardMenuOpen === item.id ? null : item.id);
                        }}
                        className="pill-card-more hover:text-cyan-500 hover:scale-110 transition-all p-2 rounded-full"
                        title="Card Details"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </div>
                    </button>

                    {/* Quick Card Context Popup if 3-dots on card is clicked */}
                    {cardMenuOpen === item.id && (
                      <div className="absolute right-0 top-16 z-30 bg-[#0f172a] border border-cyan-400/40 rounded-2xl p-3 shadow-2xl text-xs space-y-2 min-w-[200px] animate-fadeIn">
                        <div className="font-bold text-white border-b border-white/10 pb-1.5 flex items-center justify-between">
                          <span>{item.title}</span>
                          <button onClick={() => setCardMenuOpen(null)} className="text-gray-400 hover:text-white">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setCardMenuOpen(null);
                            item.action();
                          }}
                          className="w-full text-left py-1.5 px-2 rounded-lg bg-cyan-500/10 text-cyan-300 font-semibold hover:bg-cyan-500/20 flex items-center justify-between"
                        >
                          <span>Open Section</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            handleCopyLink();
                            setCardMenuOpen(null);
                          }}
                          className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-white/5 text-gray-300 flex items-center justify-between"
                        >
                          <span>Copy Link</span>
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* =========================================================================
         WORKING SHARE MODAL
         ========================================================================= */}
      {isShareOpen && (
        <div className="modal-overlay">
          <div className="share-modal-sheet">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold font-['Outfit']">Share Strategy Skate Academy</h3>
              </div>
              <button 
                onClick={() => setIsShareOpen(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300 mb-4">
              Share our skating programs, free trial booking, and pro shop with friends and family!
            </p>

            {/* Direct Social Share Buttons */}
            <div className="share-social-grid">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out Strategy Skate Academy & Pro Shop! Book free trials and explore speed skates: ' + profileUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="share-social-btn"
              >
                <span className="text-xl">💬</span>
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out Strategy Skate Academy & Pro Shop! ' + profileUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="share-social-btn"
              >
                <span className="text-xl">🐦</span>
                <span>Twitter / X</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent('Join me at Strategy Skate Academy!')}&body=${encodeURIComponent('Hey! Check out Strategy Skate Academy: ' + profileUrl)}`}
                className="share-social-btn"
              >
                <span className="text-xl">✉️</span>
                <span>Email</span>
              </a>
            </div>

            {/* Copy Link Input Bar */}
            <div className="copy-input-row">
              <input
                type="text"
                readOnly
                value={profileUrl}
                className="bg-transparent text-xs text-gray-300 w-full outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="btn-primary py-2 px-4 text-xs whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-black" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         WORKING THREE-DOTS OPTIONS MENU MODAL
         ========================================================================= */}
      {isMenuOpen && (
        <div className="modal-overlay">
          <div className="options-menu-sheet">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold font-['Outfit']">Strategy Skate Hub</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openTrialModal();
                }}
                className="options-menu-item"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Book Trial Session</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigateTo('basketball');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="options-menu-item"
              >
                <BasketballIcon className="w-4 h-4 text-cyan-400" />
                <span>Basketball Academy</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigateTo('skating');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="options-menu-item"
              >
                <SkateIcon className="w-4 h-4 text-cyan-400" />
                <span>Skating Academy</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigateTo('programs');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="options-menu-item"
              >
                <GraduationCap className="w-4 h-4 text-pink-400" />
                <span>Courses & Classes</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigateTo('shop-home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="options-menu-item"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Browse Pro Shop & Sports Gear</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigateTo('skating');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="options-menu-item"
              >
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>Meet Certified Coaches</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleCopyLink();
                }}
                className="options-menu-item"
              >
                <Copy className="w-4 h-4 text-blue-400" />
                <span>{copied ? 'Copied Profile Link!' : 'Copy Profile Link'}</span>
              </button>
            </div>

            <div className="pt-3 border-t border-white/10 mt-2">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold text-gray-400 hover:text-white"
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
