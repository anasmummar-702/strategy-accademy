import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { X, Heart, Check } from 'lucide-react';

export default function SkatingScratchModal({ isOpen, onClose, onRegister }) {
  const [tapCount, setTapCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTapCount(0);
      setIsAnimating(false);
      setIsRevealed(false);
      setShowPackages(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Ultra-satisfying tactile pop + cheerful crystal chime
  const playAttractiveTapSound = (tapNumber) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      // 1. Tactile click/pop transient
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      const clickFilter = ctx.createBiquadFilter();

      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime(1800, t);
      clickFilter.Q.setValueAtTime(3, t);

      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(800 + tapNumber * 220, t);
      clickOsc.frequency.exponentialRampToValueAtTime(120, t + 0.04);

      clickGain.gain.setValueAtTime(0.32, t);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      clickOsc.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(t);
      clickOsc.stop(t + 0.05);

      // 2. Harmonic Celesta / Glockenspiel Chime
      const chimeChords = [
        [523.25, 783.99],           // C5 + G5 (Warm, pleasant welcome chime)
        [659.25, 987.77],           // E5 + B5 (Ascending anticipation chime)
        [783.99, 1174.66, 1567.98]  // G5 + D6 + G6 (Joyous celebration chord)
      ];
      const chord = chimeChords[tapNumber - 1] || chimeChords[0];

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3200, t);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        const noteStart = t + idx * 0.012;
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.linearRampToValueAtTime(0.22 / chord.length, noteStart + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.55);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.6);
      });
    } catch {}
  };

  // Grand Magical Reward Reveal Sound (Harp sweep + warm major celebratory chord)
  const playCelebrationRevealSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      // 1. Soft punchy sub boom
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(160, t);
      sub.frequency.exponentialRampToValueAtTime(42, t + 0.35);
      subGain.gain.setValueAtTime(0.35, t);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(t);
      sub.stop(t + 0.45);

      // 2. Fast upward magical harp glissando
      const sweepNotes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98, 2093.0];
      sweepNotes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const f = ctx.createBiquadFilter();
        const noteTime = t + i * 0.032;

        f.type = 'lowpass';
        f.frequency.setValueAtTime(3600, noteTime);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        g.gain.setValueAtTime(0.0001, noteTime);
        g.gain.linearRampToValueAtTime(0.14, noteTime + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.45);

        osc.connect(f);
        f.connect(g);
        g.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.5);
      });

      // 3. Celebratory warm chord at the peak
      const chordTime = t + 0.34;
      const grandChord = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      grandChord.forEach(freq => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const f = ctx.createBiquadFilter();

        f.type = 'lowpass';
        f.frequency.setValueAtTime(2800, chordTime);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chordTime);

        g.gain.setValueAtTime(0.0001, chordTime);
        g.gain.linearRampToValueAtTime(0.12, chordTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, chordTime + 0.95);

        osc.connect(f);
        f.connect(g);
        g.connect(ctx.destination);

        osc.start(chordTime);
        osc.stop(chordTime + 1.0);
      });
    } catch {}
  };

  // Dense multi-wave celebration papers shower (>1,000 particles)
  const triggerMassiveCelebrationConfetti = () => {
    try {
      const colors = ['#a855f7', '#c084fc', '#f59e0b', '#fbbf24', '#ffffff', '#ec4899', '#38bdf8', '#34d399', '#f43f5e'];

      // Wave 1: Central mega explosion
      confetti({
        particleCount: 260,
        spread: 130,
        origin: { y: 0.35, x: 0.5 },
        zIndex: 10000000,
        colors,
        scalar: 1.15,
        ticks: 360
      });

      // Wave 2: Left confetti cannon
      setTimeout(() => {
        confetti({
          particleCount: 180,
          angle: 60,
          spread: 90,
          origin: { x: 0.05, y: 0.7 },
          zIndex: 10000000,
          colors,
          scalar: 1.1,
          ticks: 330
        });
      }, 180);

      // Wave 3: Right confetti cannon
      setTimeout(() => {
        confetti({
          particleCount: 180,
          angle: 120,
          spread: 90,
          origin: { x: 0.95, y: 0.7 },
          zIndex: 10000000,
          colors,
          scalar: 1.1,
          ticks: 330
        });
      }, 320);

      // Wave 4: Massive falling sky shower
      setTimeout(() => {
        confetti({
          particleCount: 240,
          spread: 160,
          origin: { x: 0.5, y: 0.08 },
          zIndex: 10000000,
          colors,
          scalar: 1.25,
          ticks: 420
        });
      }, 550);

      // Wave 5: Final sparkle burst
      setTimeout(() => {
        confetti({
          particleCount: 160,
          spread: 120,
          origin: { x: 0.5, y: 0.4 },
          zIndex: 10000000,
          colors,
          scalar: 1.05,
          ticks: 320
        });
      }, 850);
    } catch {}
  };

  const handleGiftTap = () => {
    if (isAnimating || isRevealed) return;
    const next = tapCount + 1;
    setIsAnimating(true);
    playAttractiveTapSound(next);

    setTimeout(() => {
      setTapCount(next);
      setIsAnimating(false);
      if (next >= 3) {
        setIsRevealed(true);
        playCelebrationRevealSound();
        triggerMassiveCelebrationConfetti();
        setTimeout(() => {
          setShowPackages(true);
        }, 550);
      }
    }, 240);
  };

  const getBoxScale = () => {
    if (isRevealed) return 2.15;
    const scales = [1, 1.30, 1.62];
    return scales[tapCount] ?? 1;
  };

  const remainingTaps = 3 - tapCount;

  const packages = [
    {
      id: 'starter',
      emoji: '⛸️',
      badge: 'STARTER PACK',
      title: '1 Month',
      sessions: '8 Sessions',
      original: 600,
      price: 550,
      save: 50,
      highlight: false,
      btnText: 'Choose Starter',
      features: [
        '2x per week',
        'Beginner friendly',
        'Safety gear included',
        'Certified coaching'
      ]
    },
    {
      id: 'popular',
      emoji: '⭐',
      badge: 'MOST POPULAR',
      title: '2 Months',
      sessions: '16 Sessions',
      original: 900,
      price: 750,
      save: 150,
      highlight: true,
      btnText: 'Get This Plan',
      features: [
        '3x per week',
        'Progress tracking',
        'Official team jersey',
        'Medal grading'
      ]
    },
    {
      id: 'vip',
      emoji: '👑',
      badge: 'VIP UNLIMITED',
      title: '3 Months',
      sessions: 'Unlimited',
      original: 1300,
      price: 1000,
      save: 300,
      highlight: false,
      btnText: 'Go Unlimited',
      features: [
        'Unlimited sessions',
        '1-on-1 coaching',
        'Advanced medals',
        'Priority scheduling'
      ]
    }
  ];

  if (!isOpen) return null;

  return createPortal(
    <>
      <style>{`
        @keyframes gift-float-idle {
          0%, 100% { transform: scale(var(--gscale, 1)) translateY(0px); }
          50% { transform: scale(var(--gscale, 1)) translateY(-8px); }
        }
        @keyframes gift-tap-pop {
          0% { transform: scale(var(--gscale, 1)); }
          35% { transform: scale(calc(var(--gscale, 1) * 0.88)) rotate(-5deg); }
          65% { transform: scale(calc(var(--gscale, 1) * 1.18)) rotate(5deg); }
          85% { transform: scale(calc(var(--gscale, 1) * 0.96)) rotate(-2deg); }
          100% { transform: scale(var(--gscale, 1)) rotate(0deg); }
        }
        @keyframes gift-explode-out {
          0% { transform: scale(1.62); opacity: 1; }
          40% { transform: scale(2.3) rotate(6deg); opacity: 0.9; }
          100% { transform: scale(3.2) rotate(-6deg); opacity: 0; }
        }
        @keyframes cards-reveal-pop {
          0% { opacity: 0; transform: scale(0.85) translateY(30px); }
          70% { transform: scale(1.02) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .skeuo-btn-press {
          transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .skeuo-btn-press:hover {
          filter: brightness(1.05);
        }
        .skeuo-btn-press:active {
          transform: translateY(3px) !important;
          border-bottom-width: 1.5px !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
        }
        .skeuo-card-hover {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        }
        .skeuo-card-hover:hover {
          transform: translateY(-5px) !important;
        }
      `}</style>

      {/* Atmospheric Seamless Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999999,
          backgroundColor: '#000000',
          background: showPackages 
            ? 'radial-gradient(circle at 50% 25%, #18092e 0%, #080314 60%, #000000 100%)'
            : 'radial-gradient(circle at 50% 38%, #1c0638 0%, #0b0121 55%, #000000 90%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
        onClick={showPackages ? undefined : onClose}
      >
        {/* Floating Top-Right Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10000002,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            transition: 'transform 0.2s ease, background 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <X style={{ width: '20px', height: '20px', strokeWidth: 2.5 }} />
        </button>

        {/* ───────────────── STATE 1: EXACT USER GIFT BOX (SEAMLESS - NO BORDER BOX) ───────────────── */}
        {!showPackages ? (
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '380px',
              minHeight: '520px',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
          >
            {/* EXACT 3D PURPLE GIFT BOX WITH GOLDEN BOW & GLOW (FEATHERED SEAMLESS EDGES - ZERO BORDER BOX) */}
            <div
              onClick={handleGiftTap}
              style={{
                position: 'relative',
                width: 'clamp(260px, 68vw, 320px)',
                height: 'clamp(260px, 68vw, 320px)',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                '--gscale': getBoxScale(),
                animation: isRevealed
                  ? 'gift-explode-out 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards'
                  : isAnimating
                    ? 'gift-tap-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                    : 'gift-float-idle 3.5s ease-in-out infinite',
                transform: !isAnimating && !isRevealed
                  ? `scale(${getBoxScale()})`
                  : undefined,
                transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <img
                src="/images/exact_gift_box.png"
                alt="Exact Purple 3D Gift Box"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  background: 'transparent',
                  border: 'none'
                }}
              />
            </div>

            {/* Bottom 4 Heart Indicators */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                marginTop: '16px'
              }}
            >
              {[1, 2, 3, 4].map(idx => {
                const isLit = tapCount >= idx;
                return (
                  <div
                    key={idx}
                    style={{
                      transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: isLit ? 'scale(1.3)' : 'scale(1)'
                    }}
                  >
                    <Heart
                      style={{
                        width: '22px',
                        height: '22px',
                        fill: isLit ? '#ffffff' : '#1e0c38',
                        color: isLit ? '#c084fc' : '#4c1d95',
                        filter: isLit ? 'drop-shadow(0 0 10px #c084fc)' : 'none'
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ───────────────── STATE 2: REVEALED VIP PACKAGES ───────────────── */
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '860px',
              maxHeight: '92vh',
              borderRadius: '32px',
              background: 'linear-gradient(155deg, #ffffff 0%, #fbf9fe 40%, #f1eaf8 100%)',
              border: '2px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 40px 95px -20px rgba(15, 3, 30, 0.75), 0 16px 36px -10px rgba(147, 51, 234, 0.35), inset 0 2px 1px #ffffff, inset 0 -4px 10px rgba(126, 34, 206, 0.12), inset 0 0 0 1px rgba(216, 180, 254, 0.5)',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '24px 20px 22px',
              animation: 'cards-reveal-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
            }}
          >
            {/* Skeuomorphic Concave Close Button */}
            <button
              onClick={onClose}
              className="skeuo-btn-press"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(145deg, #ffffff 0%, #ede0fc 100%)',
                color: '#6b21a8',
                border: '1.5px solid #d8b4fe',
                borderBottom: '3px solid #a855f7',
                boxShadow: '0 4px 10px rgba(126, 34, 206, 0.22), inset 0 1px 1px #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
              title="Close"
            >
              <X style={{ width: '18px', height: '18px', strokeWidth: 2.5 }} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'inline-block', position: 'relative' }}>
                <h2
                  style={{
                    fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                    fontSize: 'clamp(20px, 4.5vw, 25px)',
                    fontWeight: 900,
                    color: '#1e1b4b',
                    margin: '0 0 4px',
                    letterSpacing: '-0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    textShadow: '0 1px 0 #ffffff, 0 2px 4px rgba(30, 27, 75, 0.15)'
                  }}
                >
                  VIP PACKAGES UNLOCKED! 🛼
                </h2>
              </div>
              <div style={{ marginTop: '2px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    color: '#6b21a8',
                    padding: '4px 14px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(180deg, #ffffff 0%, #f3e8ff 100%)',
                    border: '1px solid #d8b4fe',
                    borderBottom: '2.5px solid #c084fc',
                    boxShadow: '0 2px 6px rgba(126, 34, 206, 0.15), inset 0 1px 1px #ffffff',
                    letterSpacing: '0.02em'
                  }}
                >
                  ✨ Skating Academy Exclusive Offers — Today Only! ✨
                </span>
              </div>
            </div>

            {/* 3 Skeuomorphic Package Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))',
                gap: '16px',
                alignItems: 'stretch'
              }}
            >
              {packages.map(pkg => (
                <div
                  key={pkg.id}
                  className="skeuo-card-hover"
                  style={{
                    position: 'relative',
                    borderRadius: '24px',
                    background: pkg.highlight
                      ? 'linear-gradient(165deg, #ffffff 0%, #faf3ff 35%, #eedeff 100%)'
                      : 'linear-gradient(165deg, #ffffff 0%, #fdfcff 40%, #f4effa 100%)',
                    border: pkg.highlight
                      ? '2px solid #a855f7'
                      : '1.5px solid #e9d5ff',
                    borderBottom: pkg.highlight
                      ? '5px solid #7e22ce'
                      : '4px solid #c084fc',
                    boxShadow: pkg.highlight
                      ? '0 16px 38px -8px rgba(147, 51, 234, 0.35), 0 6px 14px rgba(0, 0, 0, 0.08), inset 0 2px 2px #ffffff, inset 0 -2px 5px rgba(126, 34, 206, 0.15)'
                      : '0 10px 22px -6px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04), inset 0 2px 2px #ffffff, inset 0 -2px 4px rgba(147, 51, 234, 0.1)',
                    padding: '18px 14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    overflow: 'visible'
                  }}
                >
                  {/* Top 3D Folded "MOST POPULAR" Ribbon Badge */}
                  {pkg.highlight && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-13px',
                        padding: '4px 18px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(180deg, #b05bf8 0%, #8b28dd 55%, #6e18b8 100%)',
                        border: '1.2px solid rgba(255, 255, 255, 0.45)',
                        borderBottom: '2.5px solid #4a1575',
                        color: '#ffffff',
                        fontSize: '9px',
                        fontWeight: 900,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        boxShadow: '0 5px 14px rgba(107, 33, 168, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.7)',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                        zIndex: 5
                      }}
                    >
                      ★ MOST POPULAR ★
                    </div>
                  )}

                  {/* 3D Skeuomorphic Medallion Coin / Icon Holder */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: pkg.highlight
                        ? 'linear-gradient(145deg, #ffffff 0%, #ecdcfc 100%)'
                        : 'linear-gradient(145deg, #ffffff 0%, #f4ebfa 100%)',
                      border: `1.5px solid ${pkg.highlight ? '#d8b4fe' : '#e9d5ff'}`,
                      borderBottom: `2.5px solid ${pkg.highlight ? '#a855f7' : '#d8b4fe'}`,
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(126, 34, 206, 0.12), inset 0 1px 1px #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      marginBottom: '6px'
                    }}
                  >
                    {pkg.emoji}
                  </div>

                  {/* Badge Label */}
                  <div
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 900,
                      color: pkg.highlight ? '#7e22ce' : '#64748b',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: '2px',
                      textShadow: '0 1px 0 #ffffff'
                    }}
                  >
                    {pkg.badge}
                  </div>

                  {/* Title / Duration */}
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 900,
                      color: '#0f172a',
                      fontFamily: "'Outfit', sans-serif",
                      letterSpacing: '-0.02em',
                      marginBottom: '3px',
                      textShadow: '0 1px 0 #ffffff'
                    }}
                  >
                    {pkg.title}
                  </div>

                  {/* Sessions Tactile Pill */}
                  <div
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: pkg.highlight ? '#6b21a8' : '#7c3aed',
                      background: pkg.highlight ? '#ebd7fc' : '#f5edff',
                      border: '1px solid #d8b4fe',
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      marginBottom: '8px',
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 1px 2px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    {pkg.sessions}
                  </div>

                  {/* Original Strikethrough Price */}
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#94a3b8',
                      textDecoration: 'line-through',
                      lineHeight: 1,
                      textShadow: '0 1px 0 #ffffff'
                    }}
                  >
                    {pkg.original} AED
                  </div>

                  {/* Current Big 3D Engraved Price */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'center',
                      gap: '4px',
                      margin: '2px 0 8px'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '30px',
                        fontWeight: 900,
                        color: '#0f172a',
                        fontFamily: "'Outfit', sans-serif",
                        lineHeight: 1,
                        textShadow: '0 1px 0 #ffffff, 0 2px 4px rgba(0, 0, 0, 0.08)'
                      }}
                    >
                      {pkg.price}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 900,
                        color: '#64748b',
                        textShadow: '0 1px 0 #ffffff'
                      }}
                    >
                      AED
                    </span>
                  </div>

                  {/* 3D Skeuomorphic Save Ribbon */}
                  <div
                    style={{
                      padding: '4px 14px',
                      borderRadius: '9999px',
                      background: 'linear-gradient(180deg, #c084fc 0%, #9333ea 55%, #7e22ce 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.45)',
                      borderBottom: '2.5px solid #4a1575',
                      color: '#ffffff',
                      fontSize: '10.5px',
                      fontWeight: 900,
                      marginBottom: '14px',
                      boxShadow: '0 4px 10px rgba(126, 34, 206, 0.35), inset 0 1.5px 1px rgba(255, 255, 255, 0.75)',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
                      letterSpacing: '0.02em'
                    }}
                  >
                    Save {pkg.save} AED 🎁
                  </div>

                  {/* Feature Checklist with 3D Enamel Badges */}
                  <div
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      marginBottom: '16px',
                      flex: 1
                    }}
                  >
                    {pkg.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#334155',
                          marginBottom: '6px',
                          textShadow: '0 1px 0 #ffffff'
                        }}
                      >
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: pkg.highlight
                              ? 'linear-gradient(145deg, #a855f7 0%, #7e22ce 100%)'
                              : 'linear-gradient(145deg, #c084fc 0%, #9333ea 100%)',
                            boxShadow: '0 2px 4px rgba(126, 34, 206, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Check
                            style={{
                              width: '10px',
                              height: '10px',
                              strokeWidth: 3.5,
                              color: '#ffffff'
                            }}
                          />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* 3D Skeuomorphic Mechanical Push Button */}
                  <button
                    onClick={() => { onClose(); onRegister(); }}
                    className="skeuo-btn-press"
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '9999px',
                      border: pkg.highlight
                        ? '1px solid rgba(255, 255, 255, 0.3)'
                        : '1.5px solid #d8b4fe',
                      borderBottom: pkg.highlight
                        ? '4px solid #4a1575'
                        : '3.5px solid #b886eb',
                      background: pkg.highlight
                        ? 'linear-gradient(180deg, #a855f7 0%, #8b28dd 55%, #6b21a8 100%)'
                        : 'linear-gradient(180deg, #ffffff 0%, #f7f1fd 100%)',
                      color: pkg.highlight ? '#ffffff' : '#6b21a8',
                      fontSize: '12.5px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      letterSpacing: '0.03em',
                      boxShadow: pkg.highlight
                        ? '0 6px 16px rgba(107, 33, 168, 0.38), inset 0 1.5px 1px rgba(255, 255, 255, 0.7), inset 0 -1.5px 2px rgba(0, 0, 0, 0.2)'
                        : '0 4px 10px rgba(126, 34, 206, 0.16), inset 0 1.5px 1px #ffffff',
                      textShadow: pkg.highlight ? '0 1px 2px rgba(0, 0, 0, 0.4)' : 'none'
                    }}
                  >
                    {pkg.btnText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
