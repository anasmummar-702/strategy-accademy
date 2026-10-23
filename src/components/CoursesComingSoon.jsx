import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const TITLE = 'Coming Soon';
const TYPE_START_MS = 600;
const TYPE_SPEED_MS = 150;

// Soft round glow sprite, drawn once and reused for every particle
function makeSprite() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.18, 'rgba(235,245,255,0.9)');
  grad.addColorStop(0.45, 'rgba(170,205,255,0.25)');
  grad.addColorStop(1, 'rgba(150,190,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

// Animated "Coming Soon" screen shown on the Courses page
export default function CoursesComingSoon({ navigateTo }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [typed, setTyped] = useState(0);
  const typingDone = typed >= TITLE.length;

  // Lock the page: no scrolling or rubber-band bounce while this screen is open
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow, bodyOverflow: body.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior, bodyOverscroll: body.style.overscrollBehavior,
    };
    window.scrollTo(0, 0);
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      html.style.overscrollBehavior = prev.htmlOverscroll;
      body.style.overscrollBehavior = prev.bodyOverscroll;
    };
  }, []);

  // Typewriter
  useEffect(() => {
    let timer;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        setTyped((n) => {
          if (n + 1 >= TITLE.length) clearInterval(timer);
          return Math.min(n + 1, TITLE.length);
        });
      }, TYPE_SPEED_MS);
    }, TYPE_START_MS);
    return () => { clearTimeout(start); clearInterval(timer); };
  }, []);

  // Starfield + shooting stars + star-dust cursor trail (canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    const sprite = makeSprite();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0, dpr = 1, raf = 0, last = performance.now();
    let stars = [];
    const dust = [];
    const meteors = [];
    let nextMeteor = 1.5;
    const pointer = { x: 0, y: 0, has: false, lastX: 0, lastY: 0 };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((W * H) / 7000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.1 + 0.25,
        p: Math.random() * Math.PI * 2,
        s: Math.random() * 1.8 + 0.4,
        b: Math.random() * 0.5 + 0.25,
      }));
    };

    const addDust = (x, y, burst = false) => {
      const ang = Math.random() * Math.PI * 2;
      const spd = burst ? Math.random() * 1.6 + 0.4 : Math.random() * 0.35;
      dust.push({
        x: x + (Math.random() - 0.5) * (burst ? 4 : 10),
        y: y + (Math.random() - 0.5) * (burst ? 4 : 10),
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd + (burst ? 0 : 0.06),
        life: 0,
        max: Math.random() * 1.1 + (burst ? 0.6 : 0.7),
        size: Math.random() * 2.2 + 0.6,
        tw: Math.random() * 14 + 6,
        tp: Math.random() * Math.PI * 2,
        star: Math.random() < (burst ? 0.35 : 0.12),
        blue: Math.random() < 0.35,
      });
      if (dust.length > 900) dust.splice(0, dust.length - 900);
    };

    const onMove = (cx, cy) => {
      const r = wrap.getBoundingClientRect();
      const x = cx - r.left, y = cy - r.top;
      if (!pointer.has) { pointer.lastX = x; pointer.lastY = y; }
      pointer.has = true;
      const dx = x - pointer.lastX, dy = y - pointer.lastY;
      const dist = Math.hypot(dx, dy);
      const steps = Math.min(Math.ceil(dist / 5), 40);
      for (let i = 0; i <= steps; i++) {
        const t = steps ? i / steps : 1;
        addDust(pointer.lastX + dx * t, pointer.lastY + dy * t);
        if (Math.random() < 0.5) addDust(pointer.lastX + dx * t, pointer.lastY + dy * t);
      }
      pointer.x = x; pointer.y = y; pointer.lastX = x; pointer.lastY = y;
    };

    const burstAt = (cx, cy, n = 36) => {
      const r = wrap.getBoundingClientRect();
      for (let i = 0; i < n; i++) addDust(cx - r.left, cy - r.top, true);
    };
    engineRef.current = { burstAt };

    const drawSparkle = (x, y, s, a) => {
      ctx.globalAlpha = a;
      ctx.strokeStyle = 'rgba(255,255,255,1)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - s * 3, y); ctx.lineTo(x + s * 3, y);
      ctx.moveTo(x, y - s * 3); ctx.lineTo(x, y + s * 3);
      ctx.stroke();
    };

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      // Twinkling background stars
      for (const s of stars) {
        const a = s.b * (0.45 + 0.55 * Math.abs(Math.sin(t * s.s + s.p)));
        const size = s.r * 6;
        ctx.globalAlpha = a;
        ctx.drawImage(sprite, s.x - size / 2, s.y - size / 2, size, size);
      }

      // Occasional shooting stars
      nextMeteor -= dt;
      if (nextMeteor <= 0 && !reduce) {
        const fromLeft = Math.random() < 0.5;
        meteors.push({
          x: fromLeft ? Math.random() * W * 0.5 : W * 0.5 + Math.random() * W * 0.5,
          y: Math.random() * H * 0.35,
          vx: (fromLeft ? 1 : -1) * (Math.random() * 380 + 520),
          vy: Math.random() * 180 + 200,
          life: 0, max: Math.random() * 0.5 + 0.8,
        });
        nextMeteor = Math.random() * 3.5 + 2.5;
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life += dt; m.x += m.vx * dt; m.y += m.vy * dt;
        const k = 1 - m.life / m.max;
        if (k <= 0) { meteors.splice(i, 1); continue; }
        const len = 0.16;
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * len, m.y - m.vy * len);
        grad.addColorStop(0, `rgba(255,255,255,${0.9 * k})`);
        grad.addColorStop(1, 'rgba(160,200,255,0)');
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * len, m.y - m.vy * len); ctx.stroke();
        ctx.globalAlpha = k;
        ctx.drawImage(sprite, m.x - 7, m.y - 7, 14, 14);
      }

      // Star-dust trail
      for (let i = dust.length - 1; i >= 0; i--) {
        const d = dust[i];
        d.life += dt;
        if (d.life >= d.max) { dust.splice(i, 1); continue; }
        d.x += d.vx; d.y += d.vy; d.vx *= 0.97; d.vy *= 0.97;
        const fade = 1 - d.life / d.max;
        const twinkle = 0.55 + 0.45 * Math.sin(d.life * d.tw + d.tp);
        const a = fade * twinkle;
        const size = d.size * 4 * (0.6 + fade * 0.4);
        ctx.globalAlpha = a;
        ctx.drawImage(sprite, d.x - size / 2, d.y - size / 2, size, size);
        if (d.blue) {
          ctx.globalAlpha = a * 0.5;
          ctx.drawImage(sprite, d.x - size, d.y - size, size * 2, size * 2);
        }
        if (d.star && twinkle > 0.8) drawSparkle(d.x, d.y, d.size * fade, a * 0.9);
      }

      // Bright head at the cursor
      if (pointer.has && dust.length) {
        const pulse = 0.8 + 0.2 * Math.sin(t * 8);
        ctx.globalAlpha = 0.9 * pulse;
        ctx.drawImage(sprite, pointer.x - 9, pointer.y - 9, 18, 18);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const pm = (e) => onMove(e.clientX, e.clientY);
    const tm = (e) => { const p = e.touches[0]; if (p) onMove(p.clientX, p.clientY); };
    const leave = () => { pointer.has = false; };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    wrap.addEventListener('mousemove', pm);
    const tmBlock = (e) => {
      if (e.target.closest && e.target.closest('button')) return;
      if (e.cancelable) e.preventDefault();
      tm(e);
    };
    wrap.addEventListener('touchmove', tmBlock, { passive: false });
    wrap.addEventListener('touchstart', tm, { passive: true });
    const wheelBlock = (e) => e.preventDefault();
    wrap.addEventListener('wheel', wheelBlock, { passive: false });
    wrap.addEventListener('mouseleave', leave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener('mousemove', pm);
      wrap.removeEventListener('touchmove', tmBlock);
      wrap.removeEventListener('wheel', wheelBlock);
      wrap.removeEventListener('touchstart', tm);
      wrap.removeEventListener('mouseleave', leave);
      engineRef.current = null;
    };
  }, []);

  const sparkleButton = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    engineRef.current?.burstAt(r.left + r.width / 2, r.top + r.height / 2, 40);
  };

  const goHome = () => {
    if (navigateTo) navigateTo('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section ref={wrapRef} className="cs-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap');

        .cs-wrap {
          position: fixed; inset: 0; z-index: 60; overflow: hidden;
          height: 100vh; height: 100dvh;
          touch-action: none; overscroll-behavior: none;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 20px; color: #ffffff; text-align: center;
          background: #000000;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: crosshair;
        }
        .cs-canvas { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .cs-inner { position: relative; z-index: 2; max-width: 900px; width: 100%; pointer-events: none; }
        .cs-inner button { pointer-events: auto; }

        .cs-label {
          display: inline-flex; align-items: center; gap: 14px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.45em; text-transform: uppercase;
          color: rgba(225, 235, 255, 0.6);
          animation: cs-fade 1.2s ease 0.2s both;
        }
        .cs-label::before, .cs-label::after { content: ''; width: 34px; height: 1px; background: linear-gradient(90deg, transparent, rgba(225, 235, 255, 0.6)); }
        .cs-label::after { background: linear-gradient(90deg, rgba(225, 235, 255, 0.6), transparent); }
        @keyframes cs-fade { from { opacity: 0; } to { opacity: 1; } }

        /* Typewriter headline */
        .cs-title {
          position: relative; margin: 26px 0 0;
          font-family: 'Cormorant Garamond', 'Times New Roman', serif; font-weight: 500;
          font-size: clamp(38px, 9vw, 96px); line-height: 1.1; letter-spacing: 0.16em;
          white-space: nowrap; color: #ffffff;
          text-shadow: 0 0 18px rgba(200, 225, 255, 0.45), 0 0 42px rgba(120, 170, 255, 0.25);
        }
        .cs-title-ghost { visibility: hidden; }
        .cs-title-live { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; }
        .cs-caret {
          display: inline-block; width: 2px; height: 0.85em; margin-left: 0.08em;
          background: #ffffff; box-shadow: 0 0 10px #ffffff, 0 0 22px rgba(150, 200, 255, 0.9);
          animation: cs-blink 1s steps(1) infinite;
        }
        .cs-typing .cs-caret { animation: none; }
        @keyframes cs-blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        .cs-done .cs-typed { animation: cs-glow 3.5s ease-in-out infinite; }
        @keyframes cs-glow {
          0%, 100% { text-shadow: 0 0 18px rgba(200, 225, 255, 0.45), 0 0 42px rgba(120, 170, 255, 0.25); }
          50% { text-shadow: 0 0 26px rgba(220, 235, 255, 0.75), 0 0 60px rgba(120, 170, 255, 0.45); }
        }

        /* Content that appears after typing finishes */
        .cs-after { opacity: 0; transform: translateY(14px); transition: opacity 0.9s ease, transform 0.9s ease; }
        .cs-done .cs-after { opacity: 1; transform: none; }
        .cs-done .cs-after.d2 { transition-delay: 0.25s; }
        .cs-done .cs-after.d3 { transition-delay: 0.5s; }

        .cs-sub { margin: 24px auto 0; max-width: 520px; font-size: clamp(14px, 2vw, 16.5px); line-height: 1.8; letter-spacing: 0.02em; color: rgba(215, 225, 245, 0.62); }

        .cs-load { margin: 34px auto 0; max-width: 240px; }
        .cs-bar { position: relative; height: 1px; overflow: hidden; background: rgba(255, 255, 255, 0.14); }
        .cs-bar::after {
          content: ''; position: absolute; top: -1px; bottom: -1px; left: -35%; width: 35%;
          background: linear-gradient(90deg, transparent, #ffffff, transparent);
          box-shadow: 0 0 10px #ffffff; animation: cs-slide 2.4s ease-in-out infinite;
        }
        @keyframes cs-slide { to { left: 100%; } }
        .cs-load-text { margin-top: 12px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(215, 225, 245, 0.45); }

        .cs-actions { margin-top: 44px; display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .cs-btn {
          display: inline-flex; align-items: center; gap: 10px; padding: 13px 26px; border-radius: 9999px;
          font-size: 13.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.3s ease, background 0.25s ease, color 0.25s ease;
        }
        .cs-btn.primary { border: 1px solid #ffffff; color: #000000; background: #ffffff; box-shadow: 0 0 24px rgba(255, 255, 255, 0.25); }
        .cs-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 0 36px rgba(255, 255, 255, 0.55), 0 0 70px rgba(140, 190, 255, 0.35); }
        .cs-btn.ghost { color: #ffffff; background: transparent; border: 1px solid rgba(255, 255, 255, 0.35); }
        .cs-btn.ghost:hover { transform: translateY(-2px); border-color: #ffffff; box-shadow: 0 0 26px rgba(255, 255, 255, 0.25); }

        .cs-hint { margin-top: 28px; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(215, 225, 245, 0.32); }
        .cs-hint .touch { display: none; }
        @media (hover: none) {
          .cs-wrap { cursor: auto; }
          .cs-hint .mouse { display: none; }
          .cs-hint .touch { display: inline; }
        }
        @media (max-width: 520px) {
          .cs-label { font-size: 10px; letter-spacing: 0.3em; gap: 10px; white-space: nowrap; }
          .cs-label::before, .cs-label::after { width: 18px; }
          .cs-btn { font-size: 12.5px; padding: 12px 22px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-wrap *, .cs-wrap *::before, .cs-wrap *::after { animation: none !important; transition: none !important; }
        }
      `}</style>

      <canvas ref={canvasRef} className="cs-canvas" aria-hidden="true" />

      <div className={`cs-inner ${typingDone ? 'cs-done' : 'cs-typing'}`}>
        <h1 className="cs-title" aria-label={TITLE}>
          {/* invisible full title keeps the layout steady while typing */}
          <span className="cs-title-ghost" aria-hidden="true">{TITLE}<span className="cs-caret" /></span>
          <span className="cs-title-live" aria-hidden="true">
            <span className="cs-typed">{TITLE.slice(0, typed)}</span>
            <span className="cs-caret" />
          </span>
        </h1>

        <div className="cs-actions cs-after">
          <button className="cs-btn ghost" onClick={goHome} onMouseEnter={sparkleButton}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> Back
          </button>
        </div>
      </div>
    </section>
  );
}
