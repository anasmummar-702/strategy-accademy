import React, { useState, useRef } from 'react';
import { Upload, X, Link as LinkIcon, Loader2, Check, Crop } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import ImageCropper, { readFileAsDataUrl, storeCroppedImage } from './ImageCropper';

/**
 * Client-side canvas image compression helper:
 * Resizes large photos to a max dimension of 1920px and 0.85 quality JPEG,
 * producing crisp, responsive banner images under 250KB to preserve localStorage quota.
 */
export const compressImageFile = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.85) => {
  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result || null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } else {
          resolve(event.target?.result || null);
        }
      };
      img.onerror = () => resolve(event.target?.result || null);
      img.src = event.target?.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

export default function ImageUploader({
  value = '',
  onChange,
  label = 'Image Asset',
  hint = 'PNG, JPG, WEBP, SVG — Click or drag to upload from your computer',
  aspectRatio = 'aspect-video',
  cropShape = 'original',
  cropShapes = ['original', 'square', 'landscape', 'portrait', 'wide', 'banner'],
}) {
  const [crop, setCrop] = useState(null); // { src, file } while the crop window is open
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  // Every new picture goes through the crop window first
  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      setError('Please choose a picture file (JPG, PNG or WEBP).');
      return;
    }
    setError('');
    try {
      setCrop({ src: await readFileAsDataUrl(file), file });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCropped = async (dataUrl) => {
    const name = crop?.file?.name || 'banner.jpg';
    setCrop(null);
    setLoading(true);
    onChange(await storeCroppedImage(dataUrl, name));
    setLoading(false);
  };

  // "Use the full photo": the original upload path, unchanged
  const uploadOriginal = async (file) => {
    setCrop(null);
    if (!file) return;
    setError('');
    setLoading(true);

    try {
      // 1. Try backend API file upload first if server is reachable
      const uploadRes = await adminApi.uploadFile(file);
      if (uploadRes && uploadRes.url) {
        onChange(uploadRes.url);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Backend file upload fallback to local compressed preview:', err.message);
    }

    try {
      // 2. Client-side compressed data URL fallback (ensures instant zero-latency preview and reliable storage)
      const compressedDataUrl = await compressImageFile(file);
      if (compressedDataUrl) {
        onChange(compressedDataUrl);
      } else {
        throw new Error('Unable to process the selected image file.');
      }
    } catch (err) {
      setError(err.message || 'Failed to process image file.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setShowUrlInput(false);
      setUrlInput('');
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-slate-800">{label}</label>}

      {value ? (
        <div className="space-y-2">
          {/* Active Image Preview Container with Drag and Drop Support */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`relative rounded-xl overflow-hidden border bg-zinc-950 transition group ${
              isDragOver ? 'border-blue-500 ring-2 ring-blue-500' : 'border-zinc-300'
            } ${aspectRatio}`}
          >
            <img
              src={value}
              alt="Uploaded Banner Preview"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = '/images/strategy_athlete_banner.jpg';
              }}
            />

            {/* Drag & Drop Overlay */}
            {isDragOver && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-20 pointer-events-none">
                <Upload className="w-8 h-8 animate-bounce mb-1 text-blue-400" />
                <p className="text-xs font-bold">Drop your image here to replace</p>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-20">
                <Loader2 className="w-8 h-8 text-white animate-spin mb-1" />
                <p className="text-xs font-semibold">Processing new picture...</p>
              </div>
            )}

            {/* Hover Actions Bar */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 z-10 p-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-white text-zinc-900 rounded-lg hover:bg-zinc-100 text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-zinc-900" />
                <span>Upload New Picture</span>
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-3 py-2 bg-zinc-900/90 text-white rounded-lg hover:bg-black text-xs font-semibold flex items-center gap-1.5 transition shadow-sm border border-zinc-700 cursor-pointer"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Enter URL</span>
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-2 bg-rose-600/90 text-white rounded-lg hover:bg-rose-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Visible Controls Below Preview (No hover required) */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-0.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 bg-zinc-950 hover:bg-black text-white rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Choose Picture From PC</span>
              </button>

              <button
                type="button"
                onClick={() => setCrop({ src: value, file: null })}
                className="px-2.5 py-1.5 bg-white hover:bg-zinc-50 text-zinc-800 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer border border-zinc-300"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Crop</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer border border-zinc-200"
              >
                <LinkIcon className="w-3 h-3 text-zinc-500" />
                <span>{showUrlInput ? 'Hide URL Box' : 'Paste Image URL'}</span>
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md text-[11px] font-medium transition cursor-pointer"
              >
                Clear
              </button>
            </div>

            <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[220px]" title={value}>
              {value.startsWith('data:') ? 'Custom Uploaded Picture' : value}
            </span>
          </div>

          {/* Collapsible URL Box */}
          {showUrlInput && (
            <form onSubmit={handleUrlSubmit} className="flex gap-2 pt-1">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/banner.jpg or /images/..."
                className="flex-1 px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 placeholder:text-zinc-400 font-mono"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-zinc-950 text-white font-semibold rounded-lg text-xs hover:bg-black transition flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply</span>
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="px-3 py-1.5 bg-zinc-200 text-zinc-700 font-semibold rounded-lg text-xs hover:bg-zinc-300 transition cursor-pointer"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !showUrlInput && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
            isDragOver
              ? 'border-blue-600 bg-blue-50/60'
              : 'border-zinc-300 hover:border-zinc-950 bg-zinc-50/80 hover:bg-zinc-100/70'
          }`}
        >
          {loading ? (
            <div className="space-y-2 py-4">
              <Loader2 className="w-8 h-8 text-zinc-950 animate-spin mx-auto" />
              <p className="text-xs text-zinc-700 font-semibold">Processing image file...</p>
            </div>
          ) : showUrlInput ? (
            <form onSubmit={handleUrlSubmit} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm space-y-3 py-2">
              <p className="text-xs font-bold text-zinc-900">Paste Image URL</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/banner.jpg or /images/..."
                  className="flex-1 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 placeholder:text-zinc-400 font-mono"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-zinc-950 text-white font-semibold rounded-lg text-xs hover:bg-black transition flex items-center cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(false)}
                  className="px-3 py-2 bg-zinc-200 text-zinc-800 font-semibold rounded-lg text-xs hover:bg-zinc-300 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2 py-2">
              <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center mx-auto text-zinc-700 shadow-2xs">
                <Upload className="w-6 h-6 text-zinc-800" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900">
                  Click to upload your picture <span className="font-normal text-zinc-500">or drag and drop</span>
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{hint}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUrlInput(true);
                }}
                className="inline-flex items-center gap-1 text-[11px] text-zinc-800 hover:text-black font-semibold hover:underline pt-1 cursor-pointer"
              >
                <LinkIcon className="w-3 h-3" /> Or enter image URL
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
          e.target.value = '';
        }}
        className="hidden"
      />

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

      {crop && (
        <ImageCropper
          src={crop.src}
          shape={cropShape}
          shapes={cropShapes}
          onDone={handleCropped}
          onCancel={() => setCrop(null)}
          onSkip={crop.file ? () => uploadOriginal(crop.file) : undefined}
        />
      )}
    </div>
  );
}
