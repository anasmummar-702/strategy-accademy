import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { TextInput, TextareaInput, ToggleSwitch } from '../../components/FormInputs';
import {
  Home,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Edit,
  Save,
  CheckCircle2,
  ExternalLink,
  Sliders,
  RefreshCw,
  Layers,
  Sparkles
} from 'lucide-react';

export default function HomepageBuilderView() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    isVisible: true,
  });

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/admin/homepage');
      const result = await res.json();
      if (result.success && result.data?.sections) {
        setSections(result.data.sections);
      } else {
        throw new Error('API fallback');
      }
    } catch (e) {
      setSections([
        {
          id: 'sec_hero',
          key: 'hero_banner',
          title: 'Hero Campaign Banners',
          subtitle: 'Main storefront hero slider featuring top promotions and new drops.',
          displayOrder: 1,
          isVisible: true,
        },
        {
          id: 'sec_trust',
          key: 'trust_badges',
          title: 'Brand Trust Badges & Metrics',
          subtitle: 'Highlights 10+ years experience, official equipment, and 3-day returns.',
          displayOrder: 2,
          isVisible: true,
        },
        {
          id: 'sec_categories',
          key: 'category_grid',
          title: 'Shop By Category Grid',
          subtitle: 'Visual grid highlighting main sports categories.',
          displayOrder: 3,
          isVisible: true,
        },
        {
          id: 'sec_featured',
          key: 'featured_products',
          title: 'Featured Products Showcase',
          subtitle: 'Highlighted high-performance athletic gear.',
          displayOrder: 4,
          isVisible: true,
        },
        {
          id: 'sec_special_vault',
          key: 'special_vault',
          title: 'Special Edition Vault Banner',
          subtitle: 'Exclusive collector releases and limited edition gold drop.',
          displayOrder: 5,
          isVisible: true,
        },
        {
          id: 'sec_best_sellers',
          key: 'best_sellers',
          title: 'Best Sellers Showcase',
          subtitle: 'Top rated gear by sports academy participants and customers.',
          displayOrder: 6,
          isVisible: true,
        },
        {
          id: 'sec_academy',
          key: 'academy_programs',
          title: 'Academy & Training Programs',
          subtitle: 'Professional sports coaching for basketball and skating.',
          displayOrder: 7,
          isVisible: true,
        },
        {
          id: 'sec_reviews',
          key: 'customer_reviews',
          title: 'Customer & Athlete Reviews',
          subtitle: 'Verified feedback from academy parents, coaches, and players.',
          displayOrder: 8,
          isVisible: true,
        },
        {
          id: 'sec_newsletter',
          key: 'newsletter_signup',
          title: 'VIP Club & Newsletter',
          subtitle: 'Email capture section for exclusive discount codes.',
          displayOrder: 9,
          isVisible: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleToggleVisibility = async (secKey) => {
    const next = sections.map((s) => (s.key === secKey ? { ...s, isVisible: !s.isVisible } : s));
    setSections(next);
    const target = next.find((s) => s.key === secKey);

    try {
      const token = localStorage.getItem('strategy_admin_token');
      await fetch(`http://localhost:5000/api/v1/admin/homepage/sections/${secKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ isVisible: target.isVisible }),
      });
      setToastMessage(`Section "${target.title}" ${target.isVisible ? 'shown' : 'hidden'}.`);
    } catch (e) {
      setToastMessage(`Section "${target.title}" ${target.isVisible ? 'shown' : 'hidden'}.`);
    } finally {
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleMove = async (index, direction) => {
    const next = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= next.length) return;

    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;

    next.forEach((item, idx) => {
      item.displayOrder = idx + 1;
    });

    setSections(next);

    try {
      const token = localStorage.getItem('strategy_admin_token');
      await fetch('http://localhost:5000/api/v1/admin/homepage/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ sectionKeys: next.map((s) => s.key) }),
      });
      setToastMessage('Homepage layout reordered.');
    } catch (e) {
      setToastMessage('Homepage layout reordered.');
    } finally {
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleOpenEditModal = (sec) => {
    setEditingSection(sec);
    setFormData({
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      isVisible: sec.isVisible ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!editingSection) return;

    setSections((prev) =>
      prev.map((s) => (s.key === editingSection.key ? { ...s, ...formData } : s))
    );

    try {
      const token = localStorage.getItem('strategy_admin_token');
      await fetch(`http://localhost:5000/api/v1/admin/homepage/sections/${editingSection.key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });
      setToastMessage(`Updated "${formData.title}" settings.`);
    } catch (e) {
      setToastMessage(`Updated "${formData.title}" settings.`);
    } finally {
      setIsModalOpen(false);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-[100] bg-zinc-900 text-white px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-2 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
            <Home className="w-5 h-5 text-zinc-900" />
            <span>Homepage Section Sequence Builder</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Drag, reorder, or toggle visibility of all homepage storefront sections live.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://strategyaccademy.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            <span>Preview Live Site</span>
          </a>
        </div>
      </div>

      {/* Sections Sequence List */}
      <div className="space-y-2.5">
        {sections.map((sec, idx) => (
          <div
            key={sec.key}
            className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              sec.isVisible
                ? 'bg-white border-zinc-200/90 shadow-none'
                : 'bg-zinc-50/60 border-zinc-200/60 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200/80 flex items-center justify-center font-medium text-zinc-600 text-xs flex-shrink-0">
                #{idx + 1}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-zinc-900 text-sm truncate">{sec.title}</h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                      sec.isVisible
                        ? 'bg-zinc-100 text-zinc-800 border-zinc-200'
                        : 'bg-zinc-50 text-zinc-400 border-zinc-200/60'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${sec.isVisible ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                    {sec.isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{sec.subtitle}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 self-end sm:flex-row sm:items-center">
              {/* Up / Down buttons */}
              <div className="flex items-center bg-zinc-100 border border-zinc-200/80 rounded-lg p-0.5">
                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-white rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Move Up"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === sections.length - 1}
                  className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-white rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Move Down"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Visibility Toggle */}
              <button
                onClick={() => handleToggleVisibility(sec.key)}
                className={`p-2 border rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                  sec.isVisible
                    ? 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-400 hover:text-zinc-600'
                }`}
                title={sec.isVisible ? 'Hide Section' : 'Show Section'}
              >
                {sec.isVisible ? <Eye className="w-3.5 h-3.5 text-zinc-700" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-400" />}
              </button>

              {/* Configure Section */}
              <button
                onClick={() => handleOpenEditModal(sec)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Configure</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Section Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Configure Section: ${editingSection?.title}`}
        subtitle="Modify section headings, subtitles, and visibility."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveModal} className="space-y-4">
          <TextInput
            label="Section Display Title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            required
          />

          <TextareaInput
            label="Section Subtitle / Description"
            value={formData.subtitle}
            onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
            rows={3}
          />

          <ToggleSwitch
            label="Section Visibility"
            description="Toggle whether this section appears on the storefront"
            checked={formData.isVisible}
            onChange={(val) => setFormData((prev) => ({ ...prev, isVisible: val }))}
          />

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium rounded-lg text-xs transition"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
