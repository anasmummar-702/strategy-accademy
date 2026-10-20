import React, { useState } from 'react';
import { X, Share2, ChevronRight, Calendar, GraduationCap, ShoppingBag, Trophy, MessageSquare, Check, Copy, ExternalLink, ChevronDown, ChevronUp, Sparkles, Info } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);

  const profileUrl = typeof window !== 'undefined' ? window.location.origin : 'https://linktr.ee/StrategyAcademy';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Strategy Academy & Pro Shop',
          text: 'Join Strategy Academy! Book a trial or browse pro skates & gear.',
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
      subtitle: 'Start your journey today',
      icon: <Calendar className="w-5 h-5" />,
      iconBg: 'linear-gradient(135deg, #0035f5 0%, #2f74ff 100%)',
      action: () => {
        navigateTo('trial');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'basketball',
      title: 'Basketball Academy',
      subtitle: 'Train. Compete. Evolve.',
      icon: <BasketballIcon className="w-5 h-5" />,
      iconBg: 'linear-gradient(135deg, #0035f5 0%, #2f74ff 100%)',
      action: () => {
        navigateTo('basketball');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'skating',
      title: 'Skating Academy',
      subtitle: 'Learn. Skate. Excel.',
      icon: <SkateIcon className="w-5 h-5" />,
      iconBg: 'linear-gradient(135deg, #0035f5 0%, #2f74ff 100%)',
      action: () => {
        navigateTo('skating');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'courses',
      title: 'Courses',
      subtitle: 'Level up your skills',
      icon: <GraduationCap className="w-5 h-5" />,
      iconBg: 'linear-gradient(135deg, #0035f5 0%, #2f74ff 100%)',
      action: () => {
        navigateTo('programs');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'proshop',
      title: 'Pro Shop & Sports Gear',
      subtitle: 'Top quality. Elite performance.',
      icon: <ShoppingBag className="w-5 h-5" />,
      iconBg: 'linear-gradient(135deg, #0035f5 0%, #2f74ff 100%)',
      action: () => {
        navigateTo('shop-home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  ];

  return (
    <div className="home-reference-bg">
      
      {/* Dark electric sports background: spotlight, angled light shards, halftone, grain */}
      <div className="home-bg-carousel" aria-hidden="true">
        <div className="home-bg-spotlight" />

        {/* Giant faded "S" emblem from the logo */}
        <div className="home-bg-emblem-wrap">
          <div className="home-bg-emblem-glow">
            <div className="home-bg-emblem home-bg-emblem--glow" />
          </div>
          <div className="home-bg-emblem home-bg-emblem--fill" />
          <div className="home-bg-emblem home-bg-emblem--edge" />
        </div>

        <div className="home-bg-shard home-bg-shard--r" />
        <div className="home-bg-shard home-bg-shard--r-line" />
        <div className="home-bg-shard home-bg-shard--r-thin" />
        <div className="home-bg-shard home-bg-shard--l" />
        <div className="home-bg-shard home-bg-shard--l-line" />

        <div className="home-bg-halftone home-bg-halftone--tl" />
        <div className="home-bg-halftone home-bg-halftone--br" />

        <div className="home-bg-stage" />

        <div className="home-bg-sparks">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} style={{ left: `${(i * 37 + 5) % 100}%`, animationDelay: `${(i * 0.9) % 8}s`, animationDuration: `${8 + (i % 5)}s` }} />
          ))}
        </div>

        <div className="home-bg-grain" />
        <div className="home-bg-overlay" />
      </div>

      {/* Main Content: logo + links animate in automatically */}
      <div className="home-main-center-wrapper">
        <div className="container max-w-xl mx-auto px-4 relative z-10 w-full">

          <div className="hero-profile-container">
            <h1 className="hero-logo-wrap">
              <span className="hero-logo-halo" aria-hidden="true" />
              <img
                src="/images/strategy_academy_logo_v2.webp"
                alt="Strategy Academy"
                className="hero-logo-img"
              />
            </h1>
          </div>

          <div className="reference-pill-list">
            {portalLinks.map((item, idx) => (
              <button
                key={item.id}
                onClick={item.action}
                className="reference-pill-card home-card-enter"
                style={{ animationDelay: `${0.9 + idx * 0.12}s` }}
              >
                <span className="pill-card-streak" aria-hidden="true" />
                <div className="pill-card-icon">
                  {item.icon}
                </div>
                <div className="pill-card-body">
                  <span className="pill-card-title">{item.title}</span>
                  {item.subtitle && (
                    <span className="pill-card-subtitle">{item.subtitle}</span>
                  )}
                </div>
                <div className="pill-card-arrow">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>
            ))}
          </div>

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
                <h3 className="text-lg font-bold font-['Outfit']">Share Strategy Academy</h3>
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
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out Strategy Academy & Pro Shop! Book free trials and explore speed skates: ' + profileUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="share-social-btn"
              >
                <span className="text-xl">💬</span>
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out Strategy Academy & Pro Shop! ' + profileUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="share-social-btn"
              >
                <span className="text-xl">🐦</span>
                <span>Twitter / X</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent('Join me at Strategy Academy!')}&body=${encodeURIComponent('Hey! Check out Strategy Academy: ' + profileUrl)}`}
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

    </div>
  );
}
