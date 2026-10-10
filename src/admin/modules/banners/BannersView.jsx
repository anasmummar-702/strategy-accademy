import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageUploader from '../../components/ImageUploader';
import StatusBadge from '../../components/StatusBadge';
import { TextInput, SelectInput } from '../../components/FormInputs';
import {
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Sparkles,
  Loader2
} from 'lucide-react';

import GalleriesView from '../galleries/GalleriesView';

export default function BannersView({ onNavigate }) {
  const [activeSubTab, setActiveSubTab] = useState('banners'); // 'banners' | 'skating-gallery' | 'basketball-gallery'
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    desktopImageUrl: '/images/strategy_athlete_banner.jpg',
    mobileImageUrl: '/images/strategy_athlete_banner.jpg',
    targetUrl: '#shop',
    buttonText: 'SHOP THE COLLECTION',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    displayOrder: 1,
    status: 'published',
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/admin/banners');
      const result = await res.json();
      if (result.success && result.data?.banners) {
        setBanners(result.data.banners);
      } else {
        throw new Error('API fallback');
      }
    } catch (e) {
      setBanners([
        {
          id: 'ban_01',
          title: 'NEW SEASON STRATEGY ATHLETICS',
          subtitle: 'Carbon-Plated Speed Footwear & Pro Tournament Gear',
          desktopImageUrl: '/images/strategy_athlete_banner.jpg',
          mobileImageUrl: '/images/strategy_athlete_banner.jpg',
          targetUrl: '#shop',
          buttonText: 'SHOP THE COLLECTION',
          startDate: '2026-10-01',
          endDate: '2026-12-31',
          displayOrder: 1,
          status: 'published',
        },
        {
          id: 'ban_02',
          title: 'SPECIAL EDITION GOLD VAULT DROP',
          subtitle: 'Limited Run 10-Year Collector Collection',
          desktopImageUrl: '/images/banner_special_vault.jpg',
          mobileImageUrl: '/images/banner_special_vault.jpg',
          targetUrl: '#special-edition',
          buttonText: 'EXPLORE VAULT',
          startDate: '2026-10-05',
          endDate: '2026-10-31',
          displayOrder: 2,
          status: 'published',
        },
        {
          id: 'ban_03',
          title: 'STRATEGY SPORTS ACADEMIES',
          subtitle: 'Elite Basketball & Speed Skating Professional Coaching',
          desktopImageUrl: '/images/basketball_hero_court.jpg',
          mobileImageUrl: '/images/basketball_hero_court.jpg',
          targetUrl: '#trial',
          buttonText: 'BOOK FREE TRIAL',
          startDate: '2026-09-01',
          endDate: '2026-12-31',
          displayOrder: 3,
          status: 'published',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      desktopImageUrl: '/images/strategy_athlete_banner.jpg',
      mobileImageUrl: '/images/strategy_athlete_banner.jpg',
      targetUrl: '#shop',
      buttonText: 'SHOP THE COLLECTION',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      displayOrder: banners.length + 1,
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ban) => {
    setEditingBanner(ban);
    setFormData({
      title: ban.title || '',
      subtitle: ban.subtitle || '',
      desktopImageUrl: ban.desktopImageUrl || '/images/strategy_athlete_banner.jpg',
      mobileImageUrl: ban.mobileImageUrl || ban.desktopImageUrl || '/images/strategy_athlete_banner.jpg',
      targetUrl: ban.targetUrl || '#shop',
      buttonText: ban.buttonText || 'SHOP NOW',
      startDate: ban.startDate || '2026-10-01',
      endDate: ban.endDate || '2026-12-31',
      displayOrder: ban.displayOrder || 1,
      status: ban.status || 'published',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const token = localStorage.getItem('strategy_admin_token');
      if (editingBanner) {
        await fetch(`http://localhost:5000/api/v1/admin/banners/${editingBanner.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(formData),
        });
        setBanners((prev) =>
          prev.map((b) => (b.id === editingBanner.id ? { ...b, ...formData } : b))
        );
        setToastMessage(`Banner "${formData.title}" updated.`);
      } else {
        const newBan = {
          ...formData,
          id: `ban_${Date.now()}`,
        };
        await fetch(`http://localhost:5000/api/v1/admin/banners`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(formData),
        });
        setBanners((prev) => [...prev, newBan]);
        setToastMessage(`Banner "${formData.title}" created.`);
      }
    } catch (e) {
      setToastMessage('Banner saved.');
    } finally {
      setIsModalOpen(false);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem('strategy_admin_token');
      await fetch(`http://localhost:5000/api/v1/admin/banners/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setBanners((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setToastMessage(`Banner "${deleteTarget.title}" deleted.`);
    } catch (e) {
      setBanners((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setToastMessage(`Banner "${deleteTarget.title}" deleted.`);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-[100] bg-zinc-900 text-white px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-2 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-Tabs: Banners vs Skating Gallery vs Basketball Gallery */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-100 border border-zinc-200 rounded-xl w-fit">
        <button
          onClick={() => setActiveSubTab('banners')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'banners'
              ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/80'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Hero &amp; Campaign Banners</span>
        </button>
        <button
          onClick={() => setActiveSubTab('skating-gallery')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'skating-gallery'
              ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/80'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <span>⛸️ Skating Academy Gallery</span>
        </button>
        <button
          onClick={() => setActiveSubTab('basketball-gallery')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'basketball-gallery'
              ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/80'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <span>🏀 Basketball Academy Gallery</span>
        </button>
      </div>

      {/* Render GalleriesView when a gallery subtab is active */}
      {activeSubTab === 'skating-gallery' && (
        <GalleriesView initialSport="skating" />
      )}
      {activeSubTab === 'basketball-gallery' && (
        <GalleriesView initialSport="basketball" />
      )}

      {/* Render Banners view when banners subtab is active */}
      {activeSubTab === 'banners' && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-zinc-500" />
                <span>Banners &amp; Campaigns</span>
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Manage homepage hero carousels, campaign banners, scheduling, and target links.
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Hero Banner</span>
            </button>
          </div>

          {/* Campaign Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-zinc-400">
            <Loader2 className="w-7 h-7 animate-spin mx-auto text-zinc-700" />
            <p className="text-xs mt-2">Loading banners...</p>
          </div>
        ) : (
          banners.map((ban, idx) => (
            <div
              key={ban.id}
              className="bg-white border border-zinc-200/90 rounded-xl overflow-hidden flex flex-col hover:border-zinc-300 transition-colors"
            >
              {/* Image Preview */}
              <div className="relative h-40 bg-zinc-100 overflow-hidden">
                <img
                  src={ban.desktopImageUrl}
                  alt={ban.title}
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition duration-300"
                />
                <div className="absolute top-2.5 left-2.5 bg-zinc-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-medium text-white">
                  Position #{idx + 1}
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <StatusBadge status={ban.status} size="sm" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-0.5">
                  <h3 className="font-semibold text-zinc-900 text-sm line-clamp-1">{ban.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">{ban.subtitle}</p>
                </div>

                <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-[11px]">Target:</span>
                    <span className="font-mono text-zinc-800 text-[11px] font-medium">{ban.targetUrl}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-[11px]">Button:</span>
                    <span className="font-medium text-zinc-800 text-xs">{ban.buttonText}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      {ban.startDate} to {ban.endDate}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-1.5 border-t border-zinc-100">
                  <button
                    onClick={() => handleOpenEdit(ban)}
                    className="px-2.5 py-1 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-md text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3 h-3 text-zinc-500" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(ban)}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 rounded-md text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Banner Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? `Edit Banner: ${editingBanner.title}` : 'Create Hero Campaign Banner'}
        subtitle="Configure banner assets, call-to-action link, and launch dates."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Banner Campaign Title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. NEW SEASON STRATEGY ATHLETICS"
            required
          />

          <TextInput
            label="Subtitle / Supporting Text"
            value={formData.subtitle}
            onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
            placeholder="Carbon-Plated Speed Footwear & Pro Gear"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploader
              label="Desktop Banner Image (1920x600 recommended)"
              value={formData.desktopImageUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, desktopImageUrl: url, mobileImageUrl: prev.mobileImageUrl || url }))}
            />

            <ImageUploader
              label="Mobile Banner Image (800x800 recommended)"
              value={formData.mobileImageUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, mobileImageUrl: url }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="CTA Button Text"
              value={formData.buttonText}
              onChange={(e) => setFormData((prev) => ({ ...prev, buttonText: e.target.value }))}
              placeholder="SHOP THE COLLECTION"
            />

            <SelectInput
              label="CTA Target Link Destination"
              value={formData.targetUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, targetUrl: e.target.value }))}
              options={[
                { label: 'Shop Catalog (#shop)', value: '#shop' },
                { label: 'Special Edition Vault (#special-edition)', value: '#special-edition' },
                { label: 'Basketball Category (#category-basketball)', value: '#category-basketball' },
                { label: 'Running Category (#category-running)', value: '#category-running' },
                { label: 'Academy Trial Booking (#trial)', value: '#trial' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Schedule Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
            />

            <TextInput
              label="Schedule End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          <SelectInput
            label="Publishing Status"
            value={formData.status}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            options={[
              { label: 'Published (Active)', value: 'published' },
              { label: 'Draft (Paused)', value: 'draft' },
              { label: 'Archived', value: 'archived' },
            ]}
          />

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium rounded-lg text-xs transition cursor-pointer"
            >
              Save Campaign Banner
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete Banner "${deleteTarget?.title}"?`}
        description="Are you sure you wish to delete this campaign banner?"
        confirmLabel="Delete Banner"
        isDangerous={true}
        isLoading={isDeleting}
      />
        </>
      )}
    </div>
  );
}

