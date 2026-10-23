import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { RotateCw, ZoomIn, ZoomOut, Loader2, X } from 'lucide-react';
import { adminApi } from '../services/adminApi';

/**
 * Crop window used for every picture added in the admin.
 * The frame stays still; drag the photo to move it, zoom with the slider or mouse wheel.
 * Calls onDone(dataUrl) with the cropped JPEG (max 1600px wide).
 */

export const CROP_SHAPES = {
  original: { label: 'Original', ratio: null },
  square: { label: 'Square', ratio: 1 },
  landscape: { label: 'Wide 4:3', ratio: 4 / 3 },
  portrait: { label: 'Tall 3:4', ratio: 3 / 4 },
  wide: { label: 'Wide 16:9', ratio: 16 / 9 },
  banner: { label: 'Banner', ratio: 21 / 9 },
};

const MAX_OUTPUT_WIDTH = 1280; // big enough for the website, small enough to store many photos

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Could not read this file.'));
    reader.readAsDataURL(file);
  });
}

export function dataUrlToFile(dataUrl, name = 'photo.jpg') {
  const [head, body] = dataUrl.split(',');
  const mime = head.match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bin = atob(body);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new File([bytes], name.replace(/\.[^.]+$/, '') + '.jpg', { type: mime });
}

// Send a cropped picture to the server; if the server isn't running, keep it inside the page data instead.
export async function storeCroppedImage(dataUrl, name = 'photo.jpg') {
  try {
    const res = await adminApi.uploadFile(dataUrlToFile(dataUrl, name));
    if (res?.url) return res.url;
  } catch {
    // server offline – fall through
  }
  return dataUrl;
}

export default function ImageCropper({
  src,
  shape = 'original',
  shapes = ['original', 'square', 'landscape', 'portrait', 'wide'],
  title = 'Crop photo',
  subtitle = 'Drag the photo to move it. Use the slider to zoom.',
  doneLabel = 'Use this crop',
  onDone,
  onCancel,
  onSkip,
}) {
  const boxRef = useRef(null);
  const imgRef = useRef(null);
  const drag = useRef(null);

  const [box, setBox] = useState({ w: 600, h: 380 });
  const [nat, setNat] = useState(null); // natural image size
  const [loadError, setLoadError] = useState('');
  const [shapeKey, setShapeKey] = useState(shape);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [zoom, setZoom] = useState(1); // 1 = just covers the frame
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Measure the work area
  useLayoutEffect(() => {
    const measure = () => {
      const w = boxRef.current?.clientWidth || 600;
      setBox({ w, h: Math.round(Math.min(420, Math.max(260, w * 0.62))) });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Load the photo
  useEffect(() => {
    setNat(null);
    setLoadError('');
    const img = new Image();
    if (!src.startsWith('data:') && !src.startsWith('blob:')) img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      setNat({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => setLoadError('This picture could not be opened.');
    img.src = src;
  }, [src]);

  const rotated = rotation % 180 !== 0;
  const imgW = nat ? (rotated ? nat.h : nat.w) : 1; // size after rotation
  const imgH = nat ? (rotated ? nat.w : nat.h) : 1;
  const ratio = CROP_SHAPES[shapeKey]?.ratio || imgW / imgH;

  // Crop frame: as big as possible inside the work area, with a margin
  const pad = 24;
  let frameW = box.w - pad * 2;
  let frameH = frameW / ratio;
  if (frameH > box.h - pad * 2) {
    frameH = box.h - pad * 2;
    frameW = frameH * ratio;
  }

  const baseScale = Math.max(frameW / imgW, frameH / imgH); // photo exactly covers the frame
  const scale = baseScale * zoom;

  const clamp = useCallback(
    (o, s = scale) => {
      const maxX = Math.max(0, (imgW * s - frameW) / 2);
      const maxY = Math.max(0, (imgH * s - frameH) / 2);
      return { x: Math.min(maxX, Math.max(-maxX, o.x)), y: Math.min(maxY, Math.max(-maxY, o.y)) };
    },
    [imgW, imgH, frameW, frameH, scale]
  );

  // Re-centre when the shape or rotation changes
  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [shapeKey, rotation]);

  // Keep the photo covering the frame after zoom / resize
  useEffect(() => {
    setOffset((o) => {
      const c = clamp(o);
      return c.x === o.x && c.y === o.y ? o : c;
    });
  }, [clamp]);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, start: offset };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const d = drag.current;
    setOffset(clamp({ x: d.start.x + (e.clientX - d.x), y: d.start.y + (e.clientY - d.y) }));
  };
  const onPointerUp = () => {
    drag.current = null;
  };
  const onWheel = (e) => {
    setZoom((z) => Math.min(4, Math.max(1, z * (e.deltaY < 0 ? 1.08 : 1 / 1.08))));
  };

  const finish = () => {
    if (!nat || !imgRef.current) return;
    setBusy(true);
    setError('');
    try {
      const naturalFrameW = frameW / scale; // how many photo pixels fit across the frame
      const outW = Math.round(Math.min(MAX_OUTPUT_WIDTH, naturalFrameW));
      const outH = Math.round(outW / (frameW / frameH));
      const k = outW / frameW;
      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outW, outH);
      ctx.imageSmoothingQuality = 'high';
      ctx.translate(outW / 2 + offset.x * k, outH / 2 + offset.y * k);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale * k, scale * k);
      ctx.drawImage(imgRef.current, -nat.w / 2, -nat.h / 2);
      onDone(canvas.toDataURL('image/jpeg', 0.82));
    } catch {
      setError("This picture comes from another website, so it can't be cropped here. Save it to your computer and upload it instead.");
      setBusy(false);
    }
  };

  const btn = 'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium cursor-pointer transition';

  // Rendered at the top of the page so it always sits above other pop-ups
  return createPortal(
    <div className="admin-root !m-0 fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative w-full max-w-2xl bg-white text-zinc-900 rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden">
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
            <p className="text-sm text-zinc-500">{subtitle}</p>
          </div>
          <button onClick={onCancel} className="p-2 -mr-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer" title="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-4">
          {/* Work area */}
          <div
            ref={boxRef}
            className="relative w-full rounded-xl bg-zinc-900 overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing"
            style={{ height: box.h }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={onWheel}
          >
            {!nat && !loadError && (
              <div className="absolute inset-0 flex items-center justify-center text-white/70">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}
            {loadError && <div className="absolute inset-0 flex items-center justify-center text-white/80 text-sm p-6 text-center">{loadError}</div>}

            {nat && (
              <img
                src={src}
                alt=""
                draggable={false}
                className="absolute max-w-none pointer-events-none"
                style={{
                  width: nat.w,
                  height: nat.h,
                  left: box.w / 2 - nat.w / 2,
                  top: box.h / 2 - nat.h / 2,
                  transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${scale})`,
                  transformOrigin: 'center center',
                }}
              />
            )}

            {/* Frame with darkened outside and a 3×3 guide */}
            {nat && (
              <div
                className="absolute pointer-events-none rounded-sm"
                style={{
                  width: frameW,
                  height: frameH,
                  left: (box.w - frameW) / 2,
                  top: (box.h - frameH) / 2,
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                  outline: '2px solid white',
                }}
              >
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-white/25" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Zoom + rotate */}
          <div className="flex items-center gap-3">
            <ZoomOut className="w-5 h-5 text-zinc-400 flex-shrink-0" />
            <input
              type="range"
              min="1"
              max="4"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-zinc-900 cursor-pointer"
              aria-label="Zoom"
            />
            <ZoomIn className="w-5 h-5 text-zinc-400 flex-shrink-0" />
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className={`${btn} px-3 py-2 ring-1 ring-zinc-200 hover:bg-zinc-50 text-zinc-800`}
              title="Turn 90°"
            >
              <RotateCw className="w-4 h-4" />
              <span className="hidden sm:inline">Turn</span>
            </button>
          </div>

          {/* Shape */}
          {shapes.length > 1 && (
            <div>
              <p className="text-sm font-medium text-zinc-800 mb-2">Shape</p>
              <div className="flex flex-wrap gap-2">
                {shapes.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setShapeKey(key)}
                    className={`${btn} px-3.5 py-2 ${shapeKey === key ? 'bg-zinc-900 text-white' : 'ring-1 ring-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
                  >
                    {CROP_SHAPES[key].label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-rose-700">{error}</p>}
        </div>

        <div className="px-5 py-4 border-t border-zinc-100 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2">
          {onSkip ? (
            <button type="button" onClick={onSkip} className="text-sm text-zinc-600 hover:text-zinc-900 underline underline-offset-2 cursor-pointer self-center sm:self-auto">
              Use the full photo
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onCancel} className={`${btn} px-4 py-2.5 ring-1 ring-zinc-200 hover:bg-zinc-50`}>
              Cancel
            </button>
            <button
              type="button"
              id="crop-done-btn"
              disabled={!nat || busy}
              onClick={finish}
              className={`${btn} px-5 py-2.5 bg-zinc-900 hover:bg-black text-white disabled:opacity-50`}
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {doneLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
