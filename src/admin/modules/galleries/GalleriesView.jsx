import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { compressImageFile } from '../../components/ImageUploader';
import { adminApi } from '../../services/adminApi';
import {
  getSkatingGallery,
  saveSkatingGallery,
  getBasketballGallery,
  saveBasketballGallery,
  resetGallery
} from '../../../utils/academyGalleriesData';
import {
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  ChevronRight,
  Upload,
  Loader2,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

const SKATING_PRESETS = [
  '/images/skating_angels/gallery_1.jpg',
  '/images/skating_angels/gallery_2.jpg',
  '/images/skating_angels/gallery_3.jpg',
  '/images/skating_angels/gallery_4.jpg',
  '/images/skating_angels/gallery_5.jpg',
  '/images/skating_angels/gallery_6.jpg',
  '/images/skating_angels/gallery_7.jpg',
  '/images/skating_angels/gallery_8.jpg',
  '/images/skating_angels/children_skating_group.png',
  '/images/skating_angels/best_rink.jpg',
  '/images/hero_skater.jpg',
  '/images/inline_skates.jpg'
];

const BASKETBALL_PRESETS = [
  '/images/basketball_team_huddle_banner.jpg',
  '/images/basketball_hero_court.jpg',
  '/images/basketball_hero_kids.jpg',
  '/images/basketball_trial_athletes.jpg',
  '/images/basketball_banner_clinic.jpg',
  '/images/basketball_academy.jpg',
  '/images/package_basketball.jpg',
  '/images/strategy_athlete_banner.jpg',
  '/images/basketball_video_poster.jpg',
  '/images/strategy_basketball_ball.jpg'
];

export default function GalleriesView({ initialSport = 'skating' }) {
  const [activeSport, setActiveSport] = useState(initialSport); // 'skating' | 'basketball'
  const [skatingItems, setSkatingItems] = useState(getSkatingGallery);
  const [basketballItems, setBasketballItems] = useState(getBasketballGallery);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    src: '',
    title: '',
    desc: '',
    badge: ''
  });

  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef(null);

  // Listen to external updates
  useEffect(() => {
    const handleSync = () => {
      setSkatingItems(getSkatingGallery());
      setBasketballItems(getBasketballGallery());
    };
    window.addEventListener('strategy_gallery_updated', handleSync);
    return () => window.removeEventListener('strategy_gallery_updated', handleSync);
  }, []);

  const currentItems = activeSport === 'skating' ? skatingItems : basketballItems;
  const presets = activeSport === 'skating' ? SKATING_PRESETS : BASKETBALL_PRESETS;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    setUploadError('');
    setIsUploading(true);
    setUploadedFileName(file.name);

    try {
      // 1. Try server-side file upload if backend is active
      const uploadRes = await adminApi.uploadFile(file);
      if (uploadRes && uploadRes.url) {
        setFormData((prev) => ({ ...prev, src: uploadRes.url }));
        setIsUploading(false);
        showToast('Image uploaded successfully to server!');
        return;
      }
    } catch (err) {
      console.warn('Backend file upload fallback to compressed image:', err.message);
    }

    try {
      // 2. Client-side canvas compression fallback (zero-latency, offline safe, high quality)
      const compressedDataUrl = await compressImageFile(file, 1600, 1000, 0.85);
      if (compressedDataUrl) {
        setFormData((prev) => ({ ...prev, src: compressedDataUrl }));
        showToast('Image processed and loaded successfully!');
      } else {
        throw new Error('Unable to process the selected image file.');
      }
    } catch (err) {
      setUploadError(err.message || 'Failed to process image file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsUploading(false);
    setIsDragOver(false);
    setUploadError('');
    setUploadedFileName('');
    setFormData({
      src: presets[0] || '',
      title: '',
      desc: '',
      badge: activeSport === 'skating' ? 'UAE Skating Angels' : 'Strategy Basketball Academy'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsUploading(false);
    setIsDragOver(false);
    setUploadError('');
    setUploadedFileName('');
    setFormData({
      src: item.src || '',
      title: item.title || '',
      desc: item.desc || '',
      badge: item.badge || (activeSport === 'skating' ? 'UAE Skating Angels' : 'Strategy Basketball Academy')
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.src.trim() || !formData.title.trim()) {
      alert('Please provide an image and title');
      return;
    }

    if (activeSport === 'skating') {
      let updated;
      if (editingItem) {
        updated = skatingItems.map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item
        );
      } else {
        const newItem = {
          ...formData,
          id: `sk_${Date.now()}`
        };
        updated = [...skatingItems, newItem];
      }
      setSkatingItems(updated);
      saveSkatingGallery(updated);
      showToast('Skating Academy gallery updated successfully!');
    } else {
      let updated;
      if (editingItem) {
        updated = basketballItems.map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item
        );
      } else {
        const newItem = {
          ...formData,
          id: `bb_${Date.now()}`
        };
        updated = [...basketballItems, newItem];
      }
      setBasketballItems(updated);
      saveBasketballGallery(updated);
      showToast('Basketball Academy gallery updated successfully!');
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (activeSport === 'skating') {
      const updated = skatingItems.filter((i) => i.id !== deleteTarget.id);
      setSkatingItems(updated);
      saveSkatingGallery(updated);
      showToast('Photo removed from Skating gallery');
    } else {
      const updated = basketballItems.filter((i) => i.id !== deleteTarget.id);
      setBasketballItems(updated);
      saveBasketballGallery(updated);
      showToast('Photo removed from Basketball gallery');
    }
    setDeleteTarget(null);
  };

  const handleResetDefaults = () => {
    if (window.confirm(`Reset ${activeSport === 'skating' ? 'Skating' : 'Basketball'} gallery to original default photos?`)) {
      resetGallery(activeSport);
      if (activeSport === 'skating') setSkatingItems(getSkatingGallery());
      else setBasketballItems(getBasketballGallery());
      showToast('Gallery restored to original defaults');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-emerald-700 hover:text-emerald-900 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
              <span>Academy Galleries</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Live Storefront Sync
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage photos for the Skating Academy ("Experience the Rink in Action") and Basketball Academy ("Photo &amp; Training Gallery") sections.
          </p>
        </div>

        {/* Gallery Sport Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 border border-zinc-200 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSport('skating')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSport === 'skating'
                ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/80'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span>⛸️ Skating Page Gallery</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-zinc-100 rounded text-zinc-600">
              {skatingItems.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSport('basketball')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSport === 'basketball'
                ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/80'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span>🏀 Basketball Page Gallery</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-zinc-100 rounded text-zinc-600">
              {basketballItems.length}
            </span>
          </button>
        </div>
      </div>

      {/* Control Bar: Actions & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 border border-zinc-200/80 p-3.5 rounded-xl">
        <div className="text-xs text-zinc-600">
          Managing <strong>{currentItems.length} photos</strong> for{' '}
          <strong className="text-zinc-900">
            {activeSport === 'skating' ? 'Skating Academy ("Experience the Rink in Action")' : 'Basketball Academy ("Photo & Training Gallery")'}
          </strong>.
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-300 rounded-lg bg-white hover:bg-zinc-50 transition flex items-center gap-1.5 cursor-pointer"
            title="Reset to default original images"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>Add Photo</span>
          </button>
        </div>
      </div>

      {/* Gallery Photos Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentItems.map((item, index) => (
          <div
            key={item.id || index}
            className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
          >
            {/* Image Preview Box */}
            <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden">
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = '/images/strategy_athlete_banner.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

              {/* Position Badge */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white font-mono text-[10px] font-bold border border-white/20">
                #{index + 1}
              </div>

              {/* Tag Badge */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-sm inline-block">
                  {item.badge || (activeSport === 'skating' ? 'UAE Skating Angels' : 'Strategy Basketball Academy')}
                </span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-xs text-zinc-900 line-clamp-1" title={item.title}>
                  {item.title}
                </h3>
                <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2" title={item.desc}>
                  {item.desc || 'No description provided'}
                </p>
                <div className="mt-2 text-[10px] font-mono text-zinc-400 truncate" title={item.src}>
                  {item.src}
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Remove from gallery"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {/* Live Preview Box with Drag & Drop Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Photo Preview
              </label>
              <span className="text-[10px] text-zinc-500">
                Drag &amp; drop an image or use the upload button below
              </span>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`relative aspect-[16/9] max-h-48 rounded-xl overflow-hidden bg-zinc-900 border transition-all flex items-center justify-center group ${
                isDragOver
                  ? 'border-indigo-500 ring-4 ring-indigo-500/20 scale-[1.01]'
                  : 'border-zinc-200'
              }`}
            >
              {formData.src ? (
                <img
                  src={formData.src}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/strategy_athlete_banner.jpg';
                  }}
                />
              ) : (
                <div className="text-zinc-500 text-xs flex flex-col items-center gap-1.5 p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <span>No image selected yet</span>
                </div>
              )}

              {/* Drag & Drop Overlay */}
              {isDragOver && (
                <div className="absolute inset-0 bg-indigo-950/85 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 pointer-events-none">
                  <Upload className="w-8 h-8 animate-bounce mb-1 text-indigo-400" />
                  <p className="text-xs font-bold">Drop photo here to upload</p>
                </div>
              )}

              {/* Uploading Spinner Overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
                  <Loader2 className="w-7 h-7 text-indigo-400 animate-spin mb-1.5" />
                  <p className="text-xs font-semibold">Processing &amp; optimizing picture...</p>
                </div>
              )}

              {/* Hover Overlay Controls */}
              {!isUploading && !isDragOver && (
                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10 p-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white text-zinc-900 hover:bg-zinc-100 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Upload New Photo</span>
                  </button>
                  {formData.src && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, src: '' }));
                        setUploadedFileName('');
                      }}
                      className="px-2.5 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md cursor-pointer transition"
                      title="Clear photo"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              )}

              {/* Badge Overlay */}
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold border border-white/10 z-10 pointer-events-none">
                {formData.badge || 'Academy Tag'}
              </div>
            </div>
          </div>

          {/* Direct File Upload Option Box */}
          <div className="p-3 bg-gradient-to-r from-indigo-50/90 via-blue-50/50 to-zinc-50 border border-indigo-200/90 rounded-xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  <span>Upload Photo From Computer / Device</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Select any photo from your PC/phone or drag &amp; drop onto preview
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Picture From PC</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Uploaded Feedback Badge */}
            {uploadedFileName && !uploadError && (
              <div className="flex items-center justify-between text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md">
                <div className="flex items-center gap-1.5 truncate">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Loaded: {uploadedFileName}</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold shrink-0 uppercase tracking-wider">Ready to Save</span>
              </div>
            )}

            {/* Upload Error Alert */}
            {uploadError && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Quick Preset Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Quick Pick Existing Picture (Click to Select)
            </label>
            <div className="grid grid-cols-6 gap-2 p-2 bg-zinc-50 border border-zinc-200 rounded-xl max-h-36 overflow-y-auto">
              {presets.map((presetPath, pIdx) => (
                <button
                  type="button"
                  key={pIdx}
                  onClick={() => {
                    setUploadedFileName('');
                    setFormData({ ...formData, src: presetPath });
                  }}
                  className={`relative rounded-lg overflow-hidden aspect-square border-2 transition cursor-pointer ${
                    formData.src === presetPath
                      ? 'border-indigo-600 ring-2 ring-indigo-600/30 scale-95'
                      : 'border-transparent opacity-70 hover:opacity-100 hover:border-zinc-400'
                  }`}
                  title={presetPath}
                >
                  <img src={presetPath} alt={`Preset ${pIdx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Image URL path */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Image URL / Path *
              </label>
              {formData.src?.startsWith('data:') && (
                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  Custom Uploaded File
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.src?.startsWith('data:') ? 'Custom Uploaded Picture (Ready to Save)' : formData.src}
                onChange={(e) => {
                  setUploadedFileName('');
                  setFormData({ ...formData, src: e.target.value });
                }}
                placeholder="/images/skating_angels/gallery_1.jpg or external HTTPS url"
                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
              {formData.src?.startsWith('data:') && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, src: '' }));
                    setUploadedFileName('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-zinc-500 hover:text-rose-600 px-2 py-1 rounded bg-zinc-100 hover:bg-rose-50 border border-zinc-200 cursor-pointer"
                >
                  Clear / Paste URL
                </button>
              )}
            </div>
          </div>

          {/* Badge Tag */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Badge Tag *
            </label>
            <input
              type="text"
              required
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder={activeSport === 'skating' ? 'UAE Skating Angels' : 'Strategy Basketball Academy'}
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Title / Caption *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 1:1 Certified Coach Training"
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              placeholder="e.g. Patient pro instructor guiding beginner balance & confidence"
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 border border-zinc-300 rounded-lg bg-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
            >
              {editingItem ? 'Save Changes' : 'Add to Gallery'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Remove Photo from Gallery"
        message={`Are you sure you want to remove "${deleteTarget?.title || 'this photo'}" from the gallery?`}
        confirmText="Remove Photo"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
