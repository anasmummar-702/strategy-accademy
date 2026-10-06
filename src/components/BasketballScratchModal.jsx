import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  X, 
  Flame, 
  Check, 
  Copy, 
  Clock, 
  ArrowRight, 
  Zap, 
  CheckCircle2,
  Volume2,
  VolumeX,
  Tag,
  Trophy,
  Crown,
  Gift,
  Star
} from 'lucide-react';

export default function BasketballScratchModal({ isOpen, onClose, onRegister }) {
  const canvasRef = useRef(null);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(13 * 60 + 46); // 13:46 as in reference
  const [particles, setParticles] = useState([]);
  const audioCtxRef = useRef(null);
  const lastSoundTimeRef = useRef(0);

  // Web Audio API Scratch & Reveal Sounds
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playScratchSound = () => {
    if (!soundEnabled) return;
    const now = Date.now();
    if (now - lastSoundTimeRef.current < 45) return;
    lastSoundTimeRef.current = now;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      // Realistic tactile metallic coin & latex foil scrape
      const dur = 0.045;
      const bufferSize = Math.floor(ctx.sampleRate * dur);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Resonant scraping filter that subtly pitches up with scratch progress
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      const baseFreq = 2600 + (scratchedPercent || 0) * 22;
      filter.frequency.setValueAtTime(baseFreq + Math.random() * 350, t);
      filter.Q.setValueAtTime(4.0, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(t);
    } catch {
      // Audio fallback
    }
  };

  const playRevealSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t0 = ctx.currentTime;

      // 1. MYSTERY SUSPENSE RISING GLISSANDO (Magical Stardust Ascending Arpeggio)
      const risingScale = [
        392.00, 440.00, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50, 1174.66, 1318.51, 1567.98
      ];
      risingScale.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteTime = t0 + i * 0.024;

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.12, noteTime + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.14);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.16);
      });

      // 2. THE GRAND SURPRISE FANFARE (TADA / JACKPOT DROP at t0 + 0.32s)
      const dropTime = t0 + 0.32;

      // 2a. Sub-Bass Chest Impact Thump (Gives physical weight to the surprise)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(110, dropTime);
      subOsc.frequency.exponentialRampToValueAtTime(45, dropTime + 0.35);

      subGain.gain.setValueAtTime(0.35, dropTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, dropTime + 0.4);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(dropTime);
      subOsc.stop(dropTime + 0.45);

      // 2b. Warm Triumphant Brass/Synth Major Harmony (C-Major 9th: C4, G4, C5, E5, G5, B5, D6, G6)
      const fanfareTones = [
        { freq: 261.63, type: 'sawtooth', vol: 0.10, duration: 1.2 }, // C4
        { freq: 392.00, type: 'triangle', vol: 0.12, duration: 1.3 }, // G4
        { freq: 523.25, type: 'sine',     vol: 0.18, duration: 1.5 }, // C5
        { freq: 659.25, type: 'triangle', vol: 0.16, duration: 1.5 }, // E5
        { freq: 783.99, type: 'sine',     vol: 0.18, duration: 1.6 }, // G5
        { freq: 987.77, type: 'triangle', vol: 0.12, duration: 1.4 }, // B5
        { freq: 1046.50, type: 'sine',    vol: 0.16, duration: 1.8 }, // C6
        { freq: 1174.66, type: 'triangle', vol: 0.10, duration: 1.5 }, // D6
        { freq: 1567.98, type: 'sine',    vol: 0.14, duration: 2.0 }, // G6
      ];

      fanfareTones.forEach((tone) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = tone.type;
        osc.frequency.setValueAtTime(tone.freq, dropTime);

        // Lowpass sweep filter to give a lush analog horn/brass swell
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, dropTime);
        filter.frequency.exponentialRampToValueAtTime(4500, dropTime + 0.15);
        filter.frequency.exponentialRampToValueAtTime(1200, dropTime + tone.duration);

        gain.gain.setValueAtTime(0.001, dropTime);
        gain.gain.exponentialRampToValueAtTime(tone.vol, dropTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(tone.vol * 0.7, dropTime + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, dropTime + tone.duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(dropTime);
        osc.stop(dropTime + tone.duration + 0.1);
      });

      // 3. GLITTERING CELEBRATORY BELLS & COIN TWINKLES (Cascade like falling gold coins)
      const bellPings = [
        { delay: 0.02, freq: 2093.00, vol: 0.12 }, // C7
        { delay: 0.08, freq: 2637.02, vol: 0.11 }, // E7
        { delay: 0.16, freq: 3135.96, vol: 0.14 }, // G7
        { delay: 0.26, freq: 3520.00, vol: 0.10 }, // A7
        { delay: 0.38, freq: 4186.01, vol: 0.15 }, // C8
        { delay: 0.52, freq: 3135.96, vol: 0.09 }, // G7
        { delay: 0.68, freq: 2637.02, vol: 0.08 }, // E7
        { delay: 0.85, freq: 4186.01, vol: 0.12 }  // Final high sparkle
      ];

      bellPings.forEach((bell) => {
        const bellTime = dropTime + bell.delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(bell.freq, bellTime);

        gain.gain.setValueAtTime(0.001, bellTime);
        gain.gain.exponentialRampToValueAtTime(bell.vol, bellTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, bellTime + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(bellTime);
        osc.stop(bellTime + 0.7);
      });

    } catch (e) {
      console.warn('Audio reveal error:', e);
    }
  };

  // Sparkle particle spawner on scratch
  const spawnParticles = (x, y) => {
    const newP = Array.from({ length: 4 }).map(() => ({
      id: Math.random(),
      x: x + (Math.random() * 28 - 14),
      y: y + (Math.random() * 28 - 14),
      size: Math.random() * 5 + 3,
      color: ['#38bdf8', '#67e8f9', '#fde047', '#ffffff'][Math.floor(Math.random() * 4)]
    }));
    setParticles(prev => [...prev.slice(-16), ...newP]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newP.some(np => np.id === p.id)));
    }, 450);
  };

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Exact Canvas Rendering matching the Reference Image
  useEffect(() => {
    if (!isOpen || isRevealed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    const renderCover = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      // Draw Base Background
      const img = new Image();
      img.src = '/images/ice_blue_scratch_card.jpg';

      const drawDetails = () => {
        // Top 3 Stars
        ctx.fillStyle = '#0284c7';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★   ★   ★', w / 2, 46);

        // Header Text: SUPER SCRATCH CARD
        ctx.fillStyle = '#0369a1';
        ctx.font = '900 13px Outfit, sans-serif';
        ctx.letterSpacing = '1.5px';
        ctx.fillText('SUPER SCRATCH CARD', w / 2, 68);

        // Giant Center Text: SCRATCH HERE
        ctx.fillStyle = '#081a44';
        ctx.font = '900 38px Outfit, Impact, sans-serif';
        ctx.fillText('SCRATCH', w / 2, h / 2 - 4);
        ctx.fillText('HERE', w / 2, h / 2 + 34);

        // Subtitle: ⚡ Rub to reveal VIP voucher ⚡
        ctx.fillStyle = '#0284c7';
        ctx.font = '700 13px Plus Jakarta Sans, sans-serif';
        ctx.fillText('⚡  Rub to reveal VIP voucher  ⚡', w / 2, h / 2 + 68);
      };

      img.onload = () => {
        if (cancelled) return;
        ctx.drawImage(img, 0, 0, w, h);
        drawDetails();
      };

      img.onerror = () => {
        if (cancelled) return;
        // Fallback procedural clean ice-blue background
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#f0f9ff');
        grad.addColorStop(0.5, '#e0f2fe');
        grad.addColorStop(1, '#bae6fd');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Draw Basketball Seams
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, w * 0.4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(w * 0.1, h / 2);
        ctx.lineTo(w * 0.9, h / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(w / 2, h * 0.1);
        ctx.lineTo(w / 2, h * 0.9);
        ctx.stroke();

        drawDetails();
      };
    };

    const timeout = setTimeout(renderCover, 40);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [isOpen, isRevealed]);

  // Scratch Action Handler
  const handleScratchMove = (clientX, clientY) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 32 * dpr, 0, Math.PI * 2);
    ctx.fill();

    playScratchSound();
    spawnParticles(clientX - rect.left, clientY - rect.top);
    checkProgress();
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    try {
      const { width, height } = canvas;
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      let transparentCount = 0;
      const step = 20;
      const totalSampled = data.length / (4 * step);

      for (let i = 3; i < data.length; i += 4 * step) {
        if (data[i] === 0) {
          transparentCount++;
        }
      }

      const percent = Math.min(100, Math.round((transparentCount / totalSampled) * 100));
      setScratchedPercent(percent);

      if (percent >= 28) {
        triggerReveal();
      }
    } catch {
      // Fallback
    }
  };

  const triggerReveal = () => {
    setIsRevealed(true);
    setScratchedPercent(100);
    playRevealSound();
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#38bdf8', '#fbbf24', '#ffffff', '#60a5fa', '#f59e0b'],
        zIndex: 10000000
      });
    } catch {
      // Confetti fallback
    }
  };

  // Touch and mouse scratch listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    let isDrawing = false;

    const onTouchStart = (e) => {
      isDrawing = true;
      if (e.touches[0]) {
        handleScratchMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchMove = (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      if (e.touches[0]) {
        handleScratchMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      isDrawing = false;
    };

    const onMouseDown = (e) => {
      isDrawing = true;
      handleScratchMove(e.clientX, e.clientY);
    };

    const onMouseMove = (e) => {
      if (!isDrawing) return;
      handleScratchMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      isDrawing = false;
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isOpen, isRevealed]);

  const copyPromoCode = () => {
    navigator.clipboard.writeText('HOOPS450');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="scratch-modal-overlay"
      onClick={onClose}
    >
      
      {/* Realtime Scratch Sparkle Points */}
      {particles.map(p => (
        <div 
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            pointerEvents: 'none',
            zIndex: 10000000
          }}
        />
      ))}

      {/* Super Scratch Card (Exact match - only the card itself) */}
      <div 
        className="ice-scratch-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          minHeight: isRevealed ? 'auto' : '280px',
          borderRadius: '24px',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.4), 0 0 35px rgba(56, 189, 248, 0.15)'
        }}
      >
        {/* Subtle Floating Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: 'rgba(15, 23, 42, 0.08)',
            color: '#0f172a',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 30,
            backdropFilter: 'blur(4px)'
          }}
          title="Close"
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>

        {/* Revealed Content Underneath (Revealed when card is scratched) */}
        <div style={{
          width: '100%',
          minHeight: '280px',
          padding: '24px 20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
          borderRadius: '24px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '9999px',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            fontSize: '11px',
            fontWeight: 900,
            textTransform: 'uppercase',
            border: '1px solid #a7f3d0'
          }}>
            <Trophy style={{ width: '14px', height: '14px', color: '#eab308' }} />
            <span>VIP OFFER UNLOCKED!</span>
          </div>

          <h4 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '20px',
            fontWeight: 900,
            color: '#0f172a',
            lineHeight: 1.2,
            margin: 0
          }}>
            2 MONTH BASKETBALL COACHING
          </h4>

          {/* Price display - Clean white card style */}
          <div style={{
            padding: '8px 16px',
            borderRadius: '14px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            width: '100%',
            maxWidth: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}>
            <div>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Regular</span>
              <span style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 700 }}>750 AED</span>
            </div>

            <div style={{ fontSize: '18px', color: '#0284c7', fontWeight: 900 }}>➔</div>

            <div>
              <span style={{ fontSize: '10px', color: '#0284c7', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>VIP Deal</span>
              <span style={{ fontSize: '28px', color: '#0284c7', fontWeight: 900, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>500 AED</span>
            </div>
          </div>

          <div style={{
            padding: '4px 14px',
            borderRadius: '9999px',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 900,
            letterSpacing: '0.02em'
          }}>
            🎉 YOU SAVE 250 AED!
          </div>

          {/* Action elements shown when revealed */}
          {isRevealed && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1px dashed #cbd5e1'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tag style={{ width: '14px', height: '14px', color: '#0284c7' }} />
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Code:</span>
                  <span style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a', fontFamily: 'monospace' }}>HOOPS450</span>
                </div>

                <button
                  onClick={copyPromoCode}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#0284c7',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedCode ? <Check style={{ width: '12px', height: '12px', color: '#16a34a' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onRegister();
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'linear-gradient(90deg, #0284c7 0%, #2563eb 100%)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '13px',
                  letterSpacing: '0.02em',
                  border: 'none',
                  boxShadow: '0 8px 25px rgba(2, 132, 199, 0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>CLAIM VIP PASS (500 AED)</span>
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </button>
            </div>
          )}
        </div>

        {/* The Scratch Card Canvas (Completely covers the card before reveal) */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              zIndex: 10,
              touchAction: 'none',
              userSelect: 'none',
              borderRadius: '24px',
              opacity: scratchedPercent >= 28 ? 0 : 1,
              pointerEvents: scratchedPercent >= 28 ? 'none' : 'auto',
              transition: 'opacity 0.4s ease'
            }}
          />
        )}
      </div>
    </div>,
    document.body
  );
}
