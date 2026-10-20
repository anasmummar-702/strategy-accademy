import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { X, Check } from 'lucide-react';

const TAPS_TO_OPEN = 2;

export default function SkatingScratchModal({ isOpen, onClose, onRegister }) {
  // phase: 'idle' → (tap) → 'charging' → 'blast' → 'cards'
  const [tapCount, setTapCount] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [isTapping, setIsTapping] = useState(false);
  const [snapReady, setSnapReady] = useState(false);
  const audioCtxRef = useRef(null);
  const giftRef = useRef(null);
  const showcaseRef = useRef(null);
  const timersRef = useRef([]);

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
  };

  useEffect(() => {
    if (isOpen) {
      setTapCount(0);
      setPhase('idle');
      setIsTapping(false);
      setSnapReady(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [isOpen]);

  // On phones the cards are a swipe row – start on the "Most Popular" card
  useEffect(() => {
    if (phase !== 'cards' || !showcaseRef.current) return;
    const row = showcaseRef.current;
    const centre = () => {
      if (row.scrollWidth <= row.clientWidth + 4) return;
      const mid = row.children[1];
      if (mid) row.scrollLeft = mid.offsetLeft - row.offsetLeft - (row.clientWidth - mid.clientWidth) / 2;
    };
    centre();
    // Enable swipe-snapping only after the fly-in animation has finished
    const id = setTimeout(() => { centre(); setSnapReady(true); }, 1450);
    return () => clearTimeout(id);
  }, [phase]);

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

  // Confetti blast from the centre of the gift box
  const blastConfetti = () => {
    try {
      const rect = giftRef.current?.getBoundingClientRect();
      const origin = rect
        ? { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }
        : { x: 0.5, y: 0.45 };
      const colors = ['#20b2aa', '#7fffd4', '#2dd4bf', '#fbbf24', '#f59e0b', '#ffffff'];
      const base = { origin, colors, zIndex: 10000000, disableForReducedMotion: true };

      confetti({ ...base, particleCount: 150, spread: 360, startVelocity: 48, scalar: 1.05, ticks: 260, gravity: 0.9 });
      confetti({ ...base, particleCount: 40, spread: 360, startVelocity: 34, shapes: ['star'], colors: ['#fbbf24', '#fde68a', '#ffffff'], scalar: 1.3, ticks: 240 });
      later(() => {
        confetti({ ...base, particleCount: 70, angle: 60, spread: 70, origin: { x: 0, y: 0.75 }, startVelocity: 55, ticks: 260 });
        confetti({ ...base, particleCount: 70, angle: 120, spread: 70, origin: { x: 1, y: 0.75 }, startVelocity: 55, ticks: 260 });
      }, 260);
    } catch {}
  };

  const handleGiftTap = () => {
    if (phase !== 'idle' || isTapping) return;
    const next = tapCount + 1;
    playAttractiveTapSound(next === TAPS_TO_OPEN ? 3 : next);
    setTapCount(next);

    if (next < TAPS_TO_OPEN) {
      setIsTapping(true);
      later(() => setIsTapping(false), 480);
      return;
    }

    // Final tap: charge up → BLAST → cards fly out
    setPhase('charging');
    later(() => {
      setPhase('blast');
      playCelebrationRevealSound();
      blastConfetti();
    }, 650);
    later(() => setPhase('cards'), 650 + 420);
  };

  const tierStyle = {
    starter: { band: 'linear-gradient(135deg, #2cc5bc 0%, #128c84 100%)', medal: '⛸️' },
    popular: { band: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 55%, #0b5d57 100%)', medal: '⭐' },
    vip:     { band: 'linear-gradient(135deg, #0f172a 0%, #134e4a 100%)', medal: '👑' },
  };

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

  const showGift = phase !== 'cards';
  const hint = phase === 'charging' || phase === 'blast'
    ? 'Opening…'
    : tapCount === 0
      ? 'Tap the gift twice to open it'
      : 'One more tap! 🔥';

  // Fan layout: left card tilts left, centre card lifted, right card tilts right
  const fan = [
    { fx: '300px', r: '-5deg', ly: '0px' },
    { fx: '0px', r: '0deg', ly: '-18px' },
    { fx: '-300px', r: '5deg', ly: '0px' },
  ];

  return createPortal(
    <>
      <style>{`
        .sg-stage {
          position: fixed; inset: 0; z-index: 9999999;
          display: flex; flex-direction: column;
          padding: 20px 16px;
          overflow-y: auto; overflow-x: hidden;
          background: radial-gradient(circle at 50% 42%, #0e5c55 0%, #073a35 32%, #032320 62%, #010d0c 100%);
          font-family: 'Plus Jakarta Sans', 'Outfit', sans-serif;
          color: #ffffff;
          animation: sg-fade 0.4s ease-out both;
        }
        @keyframes sg-fade { from { opacity: 0; } to { opacity: 1; } }

        .sg-rays {
          position: fixed; left: 50%; top: 42%; width: 170vmax; height: 170vmax;
          transform: translate(-50%, -50%);
          background: repeating-conic-gradient(from 0deg, rgba(127, 255, 212, 0.07) 0deg 7deg, transparent 7deg 20deg);
          -webkit-mask-image: radial-gradient(circle, #000 0%, transparent 55%);
          mask-image: radial-gradient(circle, #000 0%, transparent 55%);
          animation: sg-spin 40s linear infinite;
          pointer-events: none;
        }
        @keyframes sg-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }

        .sg-x {
          position: fixed; top: 18px; right: 18px; z-index: 5;
          width: 42px; height: 42px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255, 255, 255, 0.1); color: #ffffff; cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          transition: background 0.2s ease, transform 0.25s ease;
        }
        .sg-x:hover { background: rgba(255, 255, 255, 0.22); transform: rotate(90deg); }

        /* ---------------- Gift scene ---------------- */
        .sg-scene {
          margin: auto; position: relative; z-index: 2;
          display: flex; flex-direction: column; align-items: center; text-align: center;
          max-width: 420px; width: 100%;
        }
        .sg-copy { transition: opacity 0.35s ease, transform 0.35s ease; }
        .sg-scene.going .sg-copy { opacity: 0; transform: translateY(-10px); }
        .sg-scene.going .sg-foot { opacity: 0; }
        .sg-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 9999px;
          font-size: 10.5px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase;
          color: #7fffd4; background: rgba(127, 255, 212, 0.1); border: 1px solid rgba(127, 255, 212, 0.3);
        }
        .sg-h {
          margin: 14px 0 6px; font-family: 'Outfit', sans-serif;
          font-size: clamp(26px, 6vw, 34px); font-weight: 800; letter-spacing: -0.02em; line-height: 1.1;
        }
        .sg-p { margin: 0; font-size: 14px; color: rgba(220, 255, 248, 0.75); }

        .sg-gift-zone { position: relative; width: 280px; height: 280px; margin: 14px 0 6px; display: flex; align-items: center; justify-content: center; }
        .sg-gift-glow {
          position: absolute; inset: 8%; border-radius: 50%;
          background: radial-gradient(circle, rgba(45, 212, 191, 0.55) 0%, rgba(45, 212, 191, 0) 70%);
          filter: blur(10px); animation: sg-pulse 2.2s ease-in-out infinite;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }
        .sg-gift-glow.lvl-1 { transform: scale(1.25); }
        .sg-gift-glow.lvl-2 { transform: scale(1.6); background: radial-gradient(circle, rgba(253, 230, 138, 0.7) 0%, rgba(45, 212, 191, 0) 70%); }
        @keyframes sg-pulse { 0%, 100% { opacity: 0.75; } 50% { opacity: 1; } }

        .sg-gift {
          position: relative; width: 250px; height: 250px; cursor: pointer;
          -webkit-tap-highlight-color: transparent; user-select: none; -webkit-user-select: none;
        }
        .sg-gift img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        .sg-gift.idle { animation: sg-float 3s ease-in-out infinite; }
        .sg-gift.idle:hover { filter: brightness(1.12); }
        .sg-gift.tap { animation: sg-wobble 0.48s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .sg-gift.charging { animation: sg-charge 0.65s linear forwards; }
        .sg-gift.blast { animation: sg-burst 0.45s cubic-bezier(0.2, 0.9, 0.3, 1) forwards; }
        @keyframes sg-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes sg-wobble {
          0% { transform: scale(1); }
          30% { transform: scale(0.86, 1.1) rotate(-6deg); }
          60% { transform: scale(1.12, 0.92) rotate(6deg); }
          100% { transform: scale(1.05) rotate(0); }
        }
        @keyframes sg-charge {
          0%   { transform: scale(1.05) rotate(0); filter: brightness(1); }
          10%  { transform: scale(1.06) rotate(-7deg) translateX(-4px); }
          20%  { transform: scale(1.08) rotate(7deg) translateX(4px); }
          30%  { transform: scale(1.09) rotate(-9deg) translateX(-6px); }
          40%  { transform: scale(1.11) rotate(9deg) translateX(6px); }
          50%  { transform: scale(1.12) rotate(-11deg) translateX(-7px); }
          60%  { transform: scale(1.14) rotate(11deg) translateX(7px); filter: brightness(1.4); }
          70%  { transform: scale(1.16) rotate(-12deg) translateX(-8px); }
          80%  { transform: scale(1.18) rotate(12deg) translateX(8px); filter: brightness(1.8); }
          90%  { transform: scale(1.2) rotate(-8deg); }
          100% { transform: scale(1.22) rotate(0); filter: brightness(2.2); }
        }
        @keyframes sg-burst {
          0%   { transform: scale(1.22); opacity: 1; filter: brightness(2.2); }
          100% { transform: scale(2.2); opacity: 0; filter: brightness(3) blur(6px); }
        }

        /* Blast effects */
        .sg-ring {
          position: absolute; left: 50%; top: 50%; width: 120px; height: 120px; margin: -60px 0 0 -60px;
          border-radius: 50%; border: 6px solid rgba(253, 230, 138, 0.95);
          box-shadow: 0 0 30px rgba(253, 230, 138, 0.9), inset 0 0 20px rgba(127, 255, 212, 0.8);
          animation: sg-ring 0.85s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; pointer-events: none;
        }
        .sg-ring.r2 { border-color: rgba(127, 255, 212, 0.9); animation-delay: 0.12s; opacity: 0; }
        @keyframes sg-ring { 0% { transform: scale(0.2); opacity: 1; } 100% { transform: scale(7); opacity: 0; border-width: 1px; } }
        .sg-beam {
          position: absolute; left: 50%; bottom: 40%; width: 160px; height: 120vh; margin-left: -80px;
          background: linear-gradient(0deg, rgba(253, 230, 138, 0.85) 0%, rgba(127, 255, 212, 0.35) 35%, transparent 80%);
          filter: blur(14px); transform-origin: bottom;
          animation: sg-beam 0.9s ease-out forwards; pointer-events: none;
        }
        @keyframes sg-beam { 0% { transform: scaleY(0) scaleX(0.3); opacity: 1; } 40% { transform: scaleY(1) scaleX(1); opacity: 1; } 100% { transform: scaleY(1) scaleX(1.6); opacity: 0; } }
        .sg-flash {
          position: fixed; inset: 0; pointer-events: none; z-index: 4;
          background: radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.95) 0%, rgba(253, 230, 138, 0.6) 25%, rgba(255, 255, 255, 0) 65%);
          animation: sg-flash 0.7s ease-out forwards;
        }
        @keyframes sg-flash { 0% { opacity: 0; } 20% { opacity: 1; } 100% { opacity: 0; } }

        .sg-foot { display: flex; flex-direction: column; align-items: center; transition: opacity 0.3s ease; }
        .sg-dots { display: flex; gap: 10px; margin: 8px 0 10px; }
        .sg-dots span {
          width: 12px; height: 12px; border-radius: 50%;
          border: 2px solid rgba(127, 255, 212, 0.5); transition: all 0.3s ease;
        }
        .sg-dots span.on { background: #fde68a; border-color: #fde68a; box-shadow: 0 0 12px #fbbf24; transform: scale(1.15); }
        .sg-hint { font-size: 14px; font-weight: 700; color: #fde68a; min-height: 20px; }
        .sg-later {
          margin-top: 14px; background: none; border: none; cursor: pointer;
          font-size: 12.5px; font-weight: 600; color: rgba(220, 255, 248, 0.55);
          text-decoration: underline; text-underline-offset: 3px;
        }
        .sg-later:hover { color: #ffffff; }

        /* ---------------- Card showcase ---------------- */
        .sg-reveal {
          margin: auto; position: relative; z-index: 2; width: 100%; max-width: 1060px;
          display: flex; flex-direction: column; align-items: center; text-align: center;
        }
        .sg-reveal-head { animation: sg-head 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; padding: 0 44px; }
        @keyframes sg-head { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: none; } }

        .sg-showcase {
          display: flex; align-items: center; justify-content: center; gap: 26px;
          padding: 40px 10px 16px; width: 100%;
        }
        .sg-slot {
          position: relative; flex: 0 0 auto;
          animation: sg-fly 0.95s cubic-bezier(0.2, 1.15, 0.35, 1) both;
          animation-delay: calc(0.05s + var(--i) * 0.13s);
        }
        @keyframes sg-fly {
          0%   { opacity: 0; transform: translate(var(--fx), 34vh) scale(0.15) rotate(calc(var(--r) * -8)); }
          45%  { opacity: 1; }
          100% { opacity: 1; transform: translate(0, var(--ly)) scale(1) rotate(var(--r)); }
        }

        .sg-card {
          position: relative; width: 272px; border-radius: 22px; overflow: hidden;
          background: #ffffff; color: #0f172a; text-align: left;
          box-shadow: 0 34px 70px -24px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
        }
        .sg-slot:hover .sg-card { transform: translateY(-10px) rotate(calc(var(--r) * -1)); box-shadow: 0 44px 80px -24px rgba(0, 0, 0, 0.85), 0 0 40px rgba(45, 212, 191, 0.35); }
        .sg-card::after {
          content: ''; position: absolute; top: 0; bottom: 0; left: -80%; width: 50%;
          background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          transform: skewX(-20deg); pointer-events: none;
          animation: sg-shine 1.1s ease-in-out both; animation-delay: calc(1s + var(--i) * 0.13s);
        }
        @keyframes sg-shine { from { left: -80%; } to { left: 150%; } }

        /* Glowing animated border for the popular card */
        .sg-hot {
          position: relative; padding: 3px; border-radius: 25px; overflow: hidden;
          box-shadow: 0 0 50px rgba(45, 212, 191, 0.45);
        }
        .sg-hot::before {
          content: ''; position: absolute; inset: -60%;
          background: conic-gradient(from 0deg, #2dd4bf, #fde68a, #f59e0b, #7fffd4, #20b2aa, #2dd4bf);
          animation: sg-spin-plain 3.5s linear infinite;
        }
        @keyframes sg-spin-plain { to { transform: rotate(360deg); } }
        .sg-hot .sg-card { width: 296px; }
        .sg-ribbon {
          position: absolute; top: -15px; left: 50%; transform: translateX(-50%); z-index: 3;
          padding: 6px 14px; border-radius: 9999px; white-space: nowrap;
          font-size: 10.5px; font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase;
          color: #422006; background: linear-gradient(135deg, #fde68a 0%, #fbbf24 55%, #f59e0b 100%);
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.5);
        }

        .sg-band {
          position: relative; padding: 20px 20px 26px; color: #ffffff;
          background-blend-mode: overlay;
        }
        .sg-band::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.07) 0 10px, transparent 10px 22px);
        }
        .sg-tier { position: relative; font-size: 10.5px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.9; }
        .sg-tier.gold { color: #fde68a; opacity: 1; }
        .sg-name { position: relative; margin-top: 4px; font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 800; line-height: 1.05; }
        .sg-sess { position: relative; margin-top: 4px; font-size: 13px; font-weight: 600; opacity: 0.9; }
        .sg-medal {
          position: absolute; right: 18px; bottom: -24px; z-index: 2;
          width: 52px; height: 52px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 25px;
          background: #ffffff; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25), 0 0 0 4px rgba(255, 255, 255, 0.35);
        }

        .sg-body { padding: 20px 20px 20px; }
        .sg-price { display: flex; align-items: baseline; gap: 6px; }
        .sg-now { font-family: 'Outfit', sans-serif; font-size: 38px; font-weight: 800; line-height: 1; color: #0f172a; }
        .sg-cur { font-size: 13px; font-weight: 700; color: #64748b; }
        .sg-was { margin-top: 6px; display: flex; align-items: center; gap: 8px; font-size: 12.5px; }
        .sg-was s { color: #94a3b8; font-weight: 600; }
        .sg-save { padding: 3px 8px; border-radius: 6px; font-weight: 800; color: #92400e; background: #fef3c7; }
        .sg-feats { list-style: none; margin: 16px 0 18px; padding: 14px 0 0; border-top: 1px dashed #e2e8f0; }
        .sg-feats li { display: flex; align-items: center; gap: 9px; font-size: 13px; font-weight: 500; color: #334155; margin-bottom: 9px; }
        .sg-check { width: 18px; height: 18px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #ccfbf1; color: #0f766e; }
        .sg-cta {
          width: 100%; padding: 13px 16px; border-radius: 12px; cursor: pointer;
          font-size: 14px; font-weight: 800; letter-spacing: 0.01em;
          border: 1.5px solid #20b2aa; background: #ffffff; color: #0f766e;
          transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
        }
        .sg-cta:hover { background: #f0fdfa; }
        .sg-cta:active { transform: scale(0.97); }
        .sg-cta.solid { border: none; color: #ffffff; background: linear-gradient(135deg, #20b2aa 0%, #0f766e 100%); box-shadow: 0 12px 24px -10px rgba(15, 118, 110, 0.8); }
        .sg-cta.solid:hover { filter: brightness(1.08); }
        .sg-cta.dark { border: none; color: #fde68a; background: linear-gradient(135deg, #0f172a 0%, #134e4a 100%); }
        .sg-cta.dark:hover { filter: brightness(1.15); }

        .sg-swipe { display: none; font-size: 12.5px; font-weight: 600; color: rgba(220, 255, 248, 0.65); margin-top: 4px; }

        @media (max-width: 860px) {
          .sg-showcase {
            justify-content: flex-start; gap: 16px;
            overflow-x: auto; -webkit-overflow-scrolling: touch;
            padding: 36px 11vw 18px; scrollbar-width: none;
          }
          .sg-showcase::-webkit-scrollbar { display: none; }
          .sg-showcase.snap { scroll-snap-type: x mandatory; }
          .sg-slot { scroll-snap-align: center; --fx: 0px !important; --r: 0deg !important; --ly: 0px !important; }
          .sg-card, .sg-hot .sg-card { width: 76vw; max-width: 300px; }
          .sg-swipe { display: block; }
          .sg-gift-zone { width: 240px; height: 240px; }
          .sg-gift { width: 215px; height: 215px; }
          .sg-reveal-head { padding: 0 40px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sg-rays, .sg-gift.idle, .sg-hot::before, .sg-card::after { animation: none; }
        }
      `}</style>

      <div className="sg-stage" onClick={phase === 'idle' || phase === 'cards' ? onClose : undefined}>
        <div className="sg-rays" aria-hidden="true" />

        <button className="sg-x" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Close">
          <X style={{ width: 20, height: 20, strokeWidth: 2.5 }} />
        </button>

        {phase === 'blast' && <div className="sg-flash" aria-hidden="true" />}

        {showGift ? (
          /* ───────────── GIFT ───────────── */
          <div className={`sg-scene ${phase !== 'idle' ? 'going' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="sg-copy">
              <span className="sg-pill">🎁 Skating Academy Surprise</span>
              <h3 className="sg-h">A gift is waiting for you!</h3>
              <p className="sg-p">Open it to unlock exclusive skating offers.</p>
            </div>

            <div className="sg-gift-zone">
              <div className={`sg-gift-glow lvl-${tapCount}`} aria-hidden="true" />
              {phase === 'blast' && (
                <>
                  <div className="sg-beam" aria-hidden="true" />
                  <div className="sg-ring" aria-hidden="true" />
                  <div className="sg-ring r2" aria-hidden="true" />
                </>
              )}
              <div
                ref={giftRef}
                className={`sg-gift ${phase === 'charging' ? 'charging' : phase === 'blast' ? 'blast' : isTapping ? 'tap' : 'idle'}`}
                onClick={handleGiftTap}
                role="button"
                aria-label="Tap to open the gift"
              >
                <img src="/images/skating_gift_box.webp" alt="" />
              </div>
            </div>

            <div className="sg-foot">
              <div className="sg-dots" aria-hidden="true">
                {Array.from({ length: TAPS_TO_OPEN }).map((_, i) => (
                  <span key={i} className={tapCount > i ? 'on' : ''} />
                ))}
              </div>
              <div className="sg-hint">{hint}</div>
              {phase === 'idle' && <button className="sg-later" onClick={onClose}>Maybe later</button>}
            </div>
          </div>
        ) : (
          /* ───────────── PACKAGE SHOWCASE ───────────── */
          <div className="sg-reveal" onClick={e => e.stopPropagation()}>
            <div className="sg-reveal-head">
              <span className="sg-pill">🎉 Gift Unlocked</span>
              <h3 className="sg-h">3 exclusive skating offers</h3>
              <p className="sg-p">Special prices for today only — choose your plan.</p>
            </div>

            <div className={`sg-showcase ${snapReady ? 'snap' : ''}`} ref={showcaseRef}>
              {packages.map((pkg, idx) => {
                const t = tierStyle[pkg.id] || tierStyle.starter;
                const card = (
                  <div className="sg-card">
                    <div className="sg-band" style={{ background: t.band }}>
                      <div className={`sg-tier ${pkg.id === 'vip' ? 'gold' : ''}`}>{pkg.highlight ? 'Best value' : pkg.badge}</div>
                      <div className="sg-name">{pkg.title}</div>
                      <div className="sg-sess">{pkg.sessions}</div>
                      <div className="sg-medal">{t.medal}</div>
                    </div>
                    <div className="sg-body">
                      <div className="sg-price">
                        <span className="sg-now">{pkg.price}</span>
                        <span className="sg-cur">AED</span>
                      </div>
                      <div className="sg-was">
                        <s>{pkg.original} AED</s>
                        <span className="sg-save">Save {pkg.save} AED</span>
                      </div>
                      <ul className="sg-feats">
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx}>
                            <span className="sg-check"><Check style={{ width: 11, height: 11, strokeWidth: 3.5 }} /></span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        className={`sg-cta ${pkg.highlight ? 'solid' : pkg.id === 'vip' ? 'dark' : ''}`}
                        onClick={() => { onClose(); onRegister(); }}
                      >
                        {pkg.btnText}
                      </button>
                    </div>
                  </div>
                );
                const f = fan[idx] || fan[1];
                return (
                  <div
                    key={pkg.id}
                    className="sg-slot"
                    style={{ '--i': idx, '--fx': f.fx, '--r': f.r, '--ly': f.ly }}
                  >
                    {pkg.highlight ? (
                      <>
                        <span className="sg-ribbon">★ Most Popular</span>
                        <div className="sg-hot">{card}</div>
                      </>
                    ) : card}
                  </div>
                );
              })}
            </div>

            <div className="sg-swipe">Swipe to see all offers →</div>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
