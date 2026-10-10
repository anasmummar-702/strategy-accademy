import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
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
  ChevronRight
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

  const handleOpenCreate = () => {
    setEditingItem(null);
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
              <span>Academy Galleries &amp; Media</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Interactive Lightboxes
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage the interactive photo galleries on the public Skating and Basketball Academy pages.
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
            <span>⛸️ Skating Academy</span>
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
            <span>🏀 Basketball Academy</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-zinc-100 rounded text-zinc-600">
              {basketballItems.length}
            </span>
          </button>
        </div>
      </div>

      {/* Control Bar: Actions & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 border border-zinc-200/80 p-3.5 rounded-xl">
        <div className="text-xs text-zinc-600">
          Viewing <strong>{currentItems.length} photos</strong> for{' '}
          <strong className="text-zinc-900">
            {activeSport === 'skating' ? 'Skating Academy (About Section)' : 'Basketball Academy (Al Nahyan Court)'}
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
          {/* Live Preview Box */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Photo Preview
            </label>
            <div className="relative aspect-[16/9] max-h-48 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-200 flex items-center justify-center">
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
                <div className="text-zinc-500 text-xs flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>No image selected</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 text-white text-[10px] font-bold">
                {formData.badge || 'Academy Tag'}
              </div>
            </div>
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
                  onClick={() => setFormData({ ...formData, src: presetPath })}
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
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Image URL / Path *
            </label>
            <input
              type="text"
              required
              value={formData.src}
              onChange={(e) => setFormData({ ...formData, src: e.target.value })}
              placeholder="/images/skating_angels/gallery_1.jpg or external HTTPS url"
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
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
