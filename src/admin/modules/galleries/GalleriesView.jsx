import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { compressImageFile } from '../../components/ImageUploader';
import ImageCropper, { readFileAsDataUrl, storeCroppedImage } from '../../components/ImageCropper';
import { adminApi } from '../../services/adminApi';
import {
  getBasketballGallery,
  getSkatingGallery,
  saveBasketballGallery,
  saveSkatingGallery
} from '../../../utils/academyGalleriesData';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Edit,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
  Crop
} from 'lucide-react';

const STORAGE_FULL_MSG =
  "Not saved: this browser's storage is full. Remove a few uploaded photos (or crop them smaller) and try again.";

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
  const [showPresets, setShowPresets] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [formError, setFormError] = useState('');

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

  const [toastTone, setToastTone] = useState('ok');
  const showToast = (msg, tone = 'ok') => {
    setToastMessage(msg);
    setToastTone(tone);
    setTimeout(() => setToastMessage(''), tone === 'error' ? 6000 : 3500);
  };

  // New photos open the crop window first
  const [crop, setCrop] = useState(null); // { src, file }
  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      setUploadError('Please choose a picture file (JPG, PNG or WEBP).');
      return;
    }
    setUploadError('');
    setFormError('');
    try {
      setCrop({ src: await readFileAsDataUrl(file), file });
    } catch (err) {
      setUploadError(err.message);
    }
  };

  const handleCropped = async (dataUrl) => {
    const name = crop?.file?.name || 'gallery.jpg';
    setCrop(null);
    setIsUploading(true);
    const url = await storeCroppedImage(dataUrl, name);
    setFormData((prev) => ({ ...prev, src: url }));
    setIsUploading(false);
  };

  // "Use the full photo": the original upload path
  const uploadOriginal = async (file) => {
    setCrop(null);
    if (!file) return;
    setUploadError('');
    setFormError('');
    setIsUploading(true);
    setUploadedFileName(file.name);

    try {
      // 1. Try server-side file upload if backend is active
      const uploadRes = await adminApi.uploadFile(file);
      if (uploadRes && uploadRes.url) {
        setFormData((prev) => ({ ...prev, src: uploadRes.url }));
        setIsUploading(false);
        
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
    setShowPresets(false);
    setShowMore(false);
    setFormError('');
    setFormData({
      src: '',
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
    setShowPresets(false);
    setShowMore(false);
    setFormError('');
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
    if (!formData.src.trim()) return setFormError('Please choose a photo first.');
    if (!formData.title.trim()) return setFormError('Please give the photo a title.');
    setFormError('');

    const isSkating = activeSport === 'skating';
    const items = isSkating ? skatingItems : basketballItems;
    const updated = editingItem
      ? items.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item))
      : [...items, { ...formData, id: `${isSkating ? 'sk' : 'bb'}_${Date.now()}` }];

    // Only update the screen if it was really saved
    const ok = isSkating ? saveSkatingGallery(updated) : saveBasketballGallery(updated);
    if (!ok) {
      setFormError(STORAGE_FULL_MSG);
      return;
    }
    if (isSkating) setSkatingItems(updated);
    else setBasketballItems(updated);
    showToast(editingItem ? 'Photo updated' : `Photo added to the ${isSkating ? 'Skating' : 'Basketball'} page`);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const isSkating = activeSport === 'skating';
    const items = isSkating ? skatingItems : basketballItems;
    const updated = items.filter((i) => i.id !== deleteTarget.id);
    const ok = isSkating ? saveSkatingGallery(updated) : saveBasketballGallery(updated);
    if (ok) {
      if (isSkating) setSkatingItems(updated);
      else setBasketballItems(updated);
      showToast('Photo removed');
    } else {
      showToast(STORAGE_FULL_MSG, 'error');
    }
    setDeleteTarget(null);
  };

  // The website brings back its original photos if a gallery is empty, so always keep one
  const askDelete = (item) => {
    if (currentItems.length <= 1) {
      showToast('Keep at least one photo here. To swap it, click Edit and change the photo.', 'error');
      return;
    }
    setDeleteTarget(item);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-xl text-sm font-medium flex items-center justify-between ${
            toastTone === 'error' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastTone === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-emerald-700 hover:text-emerald-900 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Pick which page's gallery to edit */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-base text-zinc-500">Photos shown on your Skating and Basketball pages. Changes show on the website straight away.</p>

        {/* Gallery Sport Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 border border-zinc-200 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSport('skating')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSport === 'skating'
                ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/80'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span>⛸️ Skating page</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-zinc-100 rounded text-zinc-600">
              {skatingItems.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSport('basketball')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSport === 'basketball'
                ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/80'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span>🏀 Basketball page</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-zinc-100 rounded text-zinc-600">
              {basketballItems.length}
            </span>
          </button>
        </div>
      </div>

      {/* Add photo */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-600">
          <strong className="text-zinc-900">{currentItems.length} photos</strong> on the {activeSport === 'skating' ? 'Skating' : 'Basketball'} page
        </p>
        <button
          id="add-photo-btn"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-zinc-900 hover:bg-black text-white text-sm font-medium rounded-xl transition flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add a photo</span>
        </button>
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
                <h3 className="font-semibold text-sm text-zinc-900 line-clamp-1" title={item.title}>
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2" title={item.desc}>
                  {item.desc || 'No description provided'}
                </p>
              </div>

              {/* Card Actions */}
              <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 rounded-lg transition cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => askDelete(item)}
                  className="px-2 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Remove from gallery"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / edit photo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit photo' : `Add a photo to the ${activeSport === 'skating' ? 'Skating' : 'Basketball'} page`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);
              e.target.value = '';
            }}
            className="hidden"
          />

          {/* 1. The photo */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]);
            }}
            className={`relative rounded-2xl overflow-hidden transition ${
              formData.src ? 'bg-zinc-900' : `border-2 border-dashed ${isDragOver ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-300'}`
            }`}
          >
            {formData.src ? (
              <>
                <img
                  src={formData.src}
                  alt="Preview"
                  className="w-full aspect-[16/9] object-cover"
                  onError={(e) => {
                    e.target.src = '/images/strategy_athlete_banner.jpg';
                  }}
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    type="button"
                    id="crop-existing-photo-btn"
                    onClick={() => setCrop({ src: formData.src, file: null })}
                    className="px-3.5 py-2 bg-white text-zinc-900 rounded-xl text-sm font-medium shadow cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Crop className="w-4 h-4" /> Crop
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-white text-zinc-900 rounded-xl text-sm font-medium shadow cursor-pointer"
                  >
                    Change photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, src: '' }))}
                    className="p-2 bg-white/90 text-rose-600 rounded-xl shadow cursor-pointer"
                    title="Remove photo"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="py-10 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-base font-medium text-zinc-900 mt-3">Drag a photo here</p>
                <p className="text-sm text-zinc-500">or</p>
                <button
                  type="button"
                  id="choose-photo-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 px-4 py-2.5 bg-zinc-900 hover:bg-black text-white rounded-xl text-sm font-medium cursor-pointer"
                >
                  Choose from your computer
                </button>
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="block mx-auto mt-3 text-sm text-zinc-600 underline underline-offset-2 cursor-pointer"
                >
                  {showPresets ? 'Hide' : 'Or pick a photo already on your website'}
                </button>
              </div>
            )}

            {(isUploading || isDragOver) && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white gap-2">
                {isUploading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Upload className="w-7 h-7" />}
                <p className="text-sm font-medium">{isUploading ? 'Getting your photo ready…' : 'Drop to add'}</p>
              </div>
            )}
          </div>

          {uploadError && (
            <p className="text-sm text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {uploadError}
            </p>
          )}

          {!formData.src && showPresets && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
              {presets.map((presetPath, pIdx) => (
                <button
                  type="button"
                  key={pIdx}
                  onClick={() => {
                    setFormError('');
                    setFormData((prev) => ({ ...prev, src: presetPath }));
                  }}
                  className="rounded-lg overflow-hidden aspect-square hover:ring-2 hover:ring-zinc-900 cursor-pointer"
                >
                  <img src={presetPath} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* 2. Words */}
          <label className="block">
            <span className="block text-sm font-medium text-zinc-800 mb-1.5">
              Title <span className="text-rose-500">*</span>
            </span>
            <input
              type="text"
              id="photo-title"
              value={formData.title}
              onChange={(e) => {
                setFormError('');
                setFormData({ ...formData, title: e.target.value });
              }}
              placeholder="e.g. Saturday beginners class"
              className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-zinc-800 mb-1.5">Short description (optional)</span>
            <textarea
              rows={2}
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </label>

          {/* 3. Rarely needed */}
          <div>
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
            >
              <ChevronDown className={`w-4 h-4 transition ${showMore ? 'rotate-180' : ''}`} /> More options
            </button>
            {showMore && (
              <div className="mt-3 grid grid-cols-1 gap-3">
                <label className="block">
                  <span className="block text-sm font-medium text-zinc-800 mb-1.5">Label shown on the photo</span>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-xl"
                  />
                </label>
                {!formData.src?.startsWith('data:') && (
                  <label className="block">
                    <span className="block text-sm font-medium text-zinc-800 mb-1.5">Photo web address</span>
                    <input
                      type="text"
                      value={formData.src}
                      onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                      placeholder="https://…"
                      className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-xl font-mono"
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {formError && (
            <p className="text-sm text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {formError}
            </p>
          )}

          <div className="pt-4 border-t border-zinc-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 text-sm font-medium ring-1 ring-zinc-200 rounded-xl hover:bg-zinc-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-photo-btn"
              className="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white text-sm font-medium rounded-xl cursor-pointer"
            >
              {editingItem ? 'Save changes' : 'Add photo'}
            </button>
          </div>
        </form>
      </Modal>

      {crop && (
        <ImageCropper
          src={crop.src}
          shape="landscape"
          shapes={['landscape', 'wide', 'square', 'portrait', 'original']}
          onDone={handleCropped}
          onCancel={() => setCrop(null)}
          onSkip={crop.file ? () => uploadOriginal(crop.file) : undefined}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Remove this photo?"
        description={`"${deleteTarget?.title || 'This photo'}" will be removed from the ${activeSport === 'skating' ? 'Skating' : 'Basketball'} page.`}
        confirmLabel="Remove photo"
        isDangerous
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
