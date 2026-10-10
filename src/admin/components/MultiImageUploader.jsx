import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  Image as ImageIcon,
  Plus,
  Star,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  Loader2,
  Sparkles,
  Check
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

const PRODUCT_IMAGE_PRESETS = [
  { label: '🏀 Strategy Pro Basketball', url: '/images/strategy_basketball_ball.jpg' },
  { label: '🛼 Pro Inline Skates', url: '/images/inline_skates.jpg' },
  { label: '🏟️ Hardwood FIBA Arena', url: '/images/basketball_hero_court.jpg' },
  { label: '⚡ Speed Roller Skater', url: '/images/hero_skater.jpg' },
  { label: '🏆 Official Package Ball', url: '/images/package_basketball.jpg' },
  { label: '👟 Team Training Clinic', url: '/images/basketball_hero_kids.jpg' }
];

export default function MultiImageUploader({
  images = [],
  onChange,
  maxImages = 6,
  label = 'Product Media Gallery (Up to 6 Images)',
  hint = 'Upload or paste up to 6 high-resolution product photos. The first image will be used as the primary storefront catalog cover.'
}) {
  const [loading, setLoading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Normalise images array
  const currentImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const remainingSlots = Math.max(0, maxImages - currentImages.length);

  // File upload handler (supports multiple files at once)
  const handleFiles = async (files) => {
    if (!files || files.length === 0 || remainingSlots <= 0) return;

    setLoading(true);
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    const uploadedUrls = [];

    for (const file of filesToUpload) {
      try {
        // Try backend upload
        const res = await adminApi.uploadFile(file);
        if (res && res.url) {
          uploadedUrls.push(res.url);
          continue;
        }
      } catch (err) {
        console.warn('Backend file upload fallback to FileReader:', err.message);
      }

      // Local FileReader fallback for immediate client preview
      await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            uploadedUrls.push(e.target.result);
          }
          resolve();
        };
        reader.onerror = () => resolve();
        reader.readAsDataURL(file);
      });
    }

    setLoading(false);
    if (uploadedUrls.length > 0) {
      const updated = [...currentImages, ...uploadedUrls].slice(0, maxImages);
      onChange(updated);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed || remainingSlots <= 0) return;

    const updated = [...currentImages, trimmed].slice(0, maxImages);
    onChange(updated);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleAddPreset = (presetUrl) => {
    if (remainingSlots <= 0) return;
    const updated = [...currentImages, presetUrl].slice(0, maxImages);
    onChange(updated);
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = currentImages.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetPrimary = (indexToPrimary) => {
    if (indexToPrimary === 0) return;
    const selected = currentImages[indexToPrimary];
    const filtered = currentImages.filter((_, idx) => idx !== indexToPrimary);
    onChange([selected, ...filtered]);
  };

  const handleMove = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= currentImages.length) return;
    const updated = [...currentImages];
    const item = updated.splice(fromIndex, 1)[0];
    updated.splice(toIndex, 0, item);
    onChange(updated);
  };

  return (
    <div className="space-y-3.5">
      {/* Header with counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider">
              {label}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                currentImages.length >= maxImages
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : currentImages.length > 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-zinc-100 text-zinc-600 border-zinc-200'
              }`}
            >
              {currentImages.length} / {maxImages} Photos Added
            </span>
          </div>
          {hint && <p className="text-[11px] text-zinc-500 mt-0.5">{hint}</p>}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="px-2.5 py-1 text-[11px] font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Presets</span>
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="px-2.5 py-1 text-[11px] font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3 text-blue-500" />
            <span>Paste URL</span>
          </button>
        </div>
      </div>

      {/* Preset drawer */}
      {showPresets && (
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-700">Quick Image Presets (Click to add):</span>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-zinc-400 hover:text-zinc-700 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRODUCT_IMAGE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                disabled={remainingSlots <= 0}
                onClick={() => handleAddPreset(preset.url)}
                className="px-2.5 py-1 bg-white hover:bg-zinc-100 disabled:opacity-50 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800 transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Direct URL input */}
      {showUrlInput && (
        <form onSubmit={handleAddUrl} className="flex items-center gap-2 p-2 bg-zinc-50 border border-zinc-200 rounded-xl">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/... or /images/..."
            className="flex-1 px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
          />
          <button
            type="submit"
            disabled={!urlInput.trim() || remainingSlots <= 0}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-black disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Add Image
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-700"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* Images Grid (Up to 6 Slots) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {currentImages.map((imgUrl, idx) => {
          const isPrimary = idx === 0;
          return (
            <div
              key={idx}
              className={`relative rounded-xl overflow-hidden border-2 bg-zinc-100 group aspect-square flex flex-col justify-between transition-all ${
                isPrimary
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-zinc-200 hover:border-zinc-400'
              }`}
            >
              {/* Image Preview */}
              <img
                src={imgUrl}
                alt={`Product Image ${idx + 1}`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                onError={(e) => {
                  e.target.src = '/images/strategy_basketball_ball.jpg';
                }}
              />

              {/* Top Slot Badge */}
              <div className="absolute top-1.5 left-1.5 z-10">
                {isPrimary ? (
                  <span className="px-1.5 py-0.5 bg-indigo-600 text-white font-extrabold text-[9px] rounded-md shadow-xs flex items-center gap-0.5 uppercase tracking-wider">
                    <Star className="w-2.5 h-2.5 fill-current" /> Cover
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 bg-zinc-900/80 backdrop-blur-xs text-white font-semibold text-[9px] rounded-md">
                    #{idx + 1}
                  </span>
                )}
              </div>

              {/* Hover Overlay Controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 z-20">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1">
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      className="w-full py-1 bg-white hover:bg-zinc-100 text-zinc-900 text-[9px] font-bold rounded shadow-xs flex items-center justify-center gap-1 transition"
                    >
                      <Star className="w-2.5 h-2.5 text-amber-500" />
                      Set Cover
                    </button>
                  )}

                  <div className="flex items-center justify-between gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, idx - 1)}
                      className="flex-1 py-0.5 bg-black/70 hover:bg-black text-white text-[9px] rounded flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
                      title="Move Earlier"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === currentImages.length - 1}
                      onClick={() => handleMove(idx, idx + 1)}
                      className="flex-1 py-0.5 bg-black/70 hover:bg-black text-white text-[9px] rounded flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
                      title="Move Later"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Upload Button Slot (if less than maxImages) */}
        {remainingSlots > 0 && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-indigo-600 bg-indigo-50/50'
                : 'border-zinc-300 hover:border-zinc-900 bg-zinc-50/60 hover:bg-zinc-100/60'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center mb-1 text-zinc-700 shadow-2xs">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-zinc-900 block leading-tight">
                  Add Image
                </span>
                <span className="text-[9px] text-zinc-500 block mt-0.5">
                  Slot {currentImages.length + 1} of {maxImages}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {currentImages.length >= maxImages && (
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 font-medium">
          <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>Maximum limit of 6 product images reached. Remove an image to add a new one.</span>
        </p>
      )}
    </div>
  );
}
