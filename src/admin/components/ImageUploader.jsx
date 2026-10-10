import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2, Check } from 'lucide-react';
import { adminApi } from '../services/adminApi';

export default function ImageUploader({
  value = '',
  onChange,
  label = 'Image Asset',
  hint = 'PNG, JPG, WEBP up to 5MB',
  aspectRatio = 'aspect-video',
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setError('');
    setLoading(true);

    try {
      // 1. If backend file upload available
      const uploadRes = await adminApi.uploadFile(file);
      if (uploadRes && uploadRes.url) {
        onChange(uploadRes.url);
      } else {
        throw new Error('No image URL returned from upload server');
      }
    } catch (err) {
      console.warn('Backend file upload failed, using local FileReader preview fallback:', err.message);
      // Local preview fallback
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target.result);
      };
      reader.readAsDataURL(file);
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
        <div className={`relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 group ${aspectRatio}`}>
          <img src={value} alt="Uploaded Preview" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 bg-black border border-zinc-700 text-white rounded-xl hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Upload className="w-4 h-4" /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2.5 bg-rose-600 border border-rose-600 text-white rounded-xl hover:bg-rose-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <X className="w-4 h-4" /> Remove
            </button>
          </div>
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
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
            isDragOver
              ? 'border-black bg-slate-100'
              : 'border-slate-300 hover:border-black bg-slate-50'
          }`}
        >
          {loading ? (
            <div className="space-y-2">
              <Loader2 className="w-8 h-8 text-black animate-spin mx-auto" />
              <p className="text-xs text-slate-600 font-semibold">Uploading asset...</p>
            </div>
          ) : showUrlInput ? (
            <form onSubmit={handleUrlSubmit} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm space-y-3">
              <p className="text-xs font-bold text-slate-800">Paste Image URL</p>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-black placeholder:text-slate-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-black text-white font-semibold rounded-xl text-xs hover:bg-zinc-800 transition flex items-center"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(false)}
                  className="px-3 py-2 bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-300 flex items-center justify-center mx-auto text-slate-700 shadow-xs">
                <ImageIcon className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{hint}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUrlInput(true);
                }}
                className="inline-flex items-center gap-1 text-[11px] text-slate-800 hover:text-black font-semibold hover:underline pt-1"
              >
                <LinkIcon className="w-3 h-3" /> Or enter image URL
              </button>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        className="hidden"
      />

      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
