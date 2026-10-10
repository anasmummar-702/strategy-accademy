import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageUploader from '../../components/ImageUploader';
import { TextInput, SelectInput, TextareaInput } from '../../components/FormInputs';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Layers,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Check,
  Palette
} from 'lucide-react';
import {
  getStoredCategoryBanners,
  saveCategoryBanners,
  upsertCategoryBanner,
  BANNER_IMAGE_PRESETS,
  BANNER_GRADIENT_PRESETS,
  DEFAULT_CATEGORY_BANNERS
} from '../../../services/bannerConfigService';

export default function CategoriesView() {
  const [activeTab, setActiveTab] = useState('tree'); // 'tree' | 'banners'
  const [categories, setCategories] = useState([]);
  const [categoryBanners, setCategoryBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Category Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Category Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: '',
    image: '/images/strategy_basketball_ball.jpg',
    description: '',
    displayOrder: 1,
    status: 'published',
    bannerTitle: '',
    bannerBadge: '',
    bannerSubtitle: '',
    bannerGradient: BANNER_GRADIENT_PRESETS[0].value,
  });

  // Dedicated Banner Management State
  const [bannerSearch, setBannerSearch] = useState('');
  const [bannerFilterGroup, setBannerFilterGroup] = useState('all');
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerFormData, setBannerFormData] = useState({
    slug: '',
    categoryName: '',
    title: '',
    subtitle: '',
    badge: '',
    image: '/images/strategy_athlete_banner.jpg',
    gradient: BANNER_GRADIENT_PRESETS[0].value,
    glow: BANNER_GRADIENT_PRESETS[0].glow,
    badgeStyle: BANNER_GRADIENT_PRESETS[0].badgeStyle,
    status: 'published',
  });

  // Load initial categories and banners
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/admin/categories');
      const result = await res.json();
      if (result.success && result.data?.categories) {
        setCategories(result.data.categories);
      } else {
        throw new Error('API fallback');
      }
    } catch (e) {
      setCategories([
        {
          id: 'cat_bb',
          name: 'Basketball',
          slug: 'basketball',
          image: '/images/strategy_basketball_ball.jpg',
          description: 'Tournament-grade basketball balls, jerseys, footwear, and training gear.',
          displayOrder: 1,
          productCount: 4,
          status: 'published',
        },
        {
          id: 'cat_run',
          name: 'Running',
          slug: 'running',
          image: '/images/strategy_running_shoe.jpg',
          description: 'Carbon-plated running shoes, marathon apparel, and hydration packs.',
          displayOrder: 2,
          productCount: 3,
          status: 'published',
        },
        {
          id: 'cat_ftb',
          name: 'Football',
          slug: 'football',
          image: '/images/strategy_football_cleat.jpg',
          description: 'Match balls, goalkeeper gloves, shin guards, and boots.',
          displayOrder: 3,
          productCount: 3,
          status: 'published',
        },
        {
          id: 'cat_skt',
          name: 'Skating',
          slug: 'skating',
          image: '/images/inline_skates.jpg',
          description: 'Custom carbon speed inline skates, protective gear, and wheels.',
          displayOrder: 4,
          productCount: 2,
          status: 'published',
        },
        {
          id: 'cat_fit',
          name: 'Fitness',
          slug: 'fitness',
          image: '/images/strategy_running_shoe.jpg',
          description: 'Pro resistance bands, speed jump ropes, and recovery foam rollers.',
          displayOrder: 5,
          productCount: 2,
          status: 'published',
        },
        {
          id: 'cat_app',
          name: 'Apparel',
          slug: 'apparel',
          image: '/images/strategy_performance_jacket.jpg',
          description: 'Moisture-wicking athletic jerseys, jackets, shorts, and compression wear.',
          displayOrder: 6,
          productCount: 5,
          status: 'published',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadBanners = () => {
    setCategoryBanners(getStoredCategoryBanners());
  };

  useEffect(() => {
    fetchCategories();
    loadBanners();

    const handleUpdate = () => {
      loadBanners();
    };
    window.addEventListener('strategy-banners-updated', handleUpdate);
    return () => window.removeEventListener('strategy-banners-updated', handleUpdate);
  }, []);

  // Category Modal Handlers
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      parentId: '',
      image: '/images/strategy_basketball_ball.jpg',
      description: '',
      displayOrder: categories.length + 1,
      status: 'published',
      bannerTitle: '',
      bannerBadge: 'PRO ATHLETIC GEAR',
      bannerSubtitle: '',
      bannerGradient: BANNER_GRADIENT_PRESETS[0].value,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    const existingBanner = categoryBanners.find(
      (b) => b.slug.toLowerCase() === (cat.slug || '').toLowerCase()
    );
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      parentId: cat.parentId || '',
      image: cat.image || '/images/strategy_basketball_ball.jpg',
      description: cat.description || '',
      displayOrder: cat.displayOrder || 1,
      status: cat.status || 'published',
      bannerTitle: existingBanner?.title || `${(cat.name || '').toUpperCase()} GEAR`,
      bannerBadge: existingBanner?.badge || 'PRO PERFORMANCE GEAR',
      bannerSubtitle: existingBanner?.subtitle || cat.description || '',
      bannerGradient: existingBanner?.gradient || BANNER_GRADIENT_PRESETS[0].value,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const token = localStorage.getItem('strategy_admin_token');
      if (editingCategory) {
        await fetch(`http://localhost:5000/api/v1/admin/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(formData),
        });
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? { ...c, ...formData } : c))
        );
      } else {
        const newCat = {
          ...formData,
          id: `cat_${Date.now()}`,
          productCount: 0,
        };
        await fetch(`http://localhost:5000/api/v1/admin/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(formData),
        });
        setCategories((prev) => [...prev, newCat]);
      }

      // Automatically sync / upsert banner configuration
      upsertCategoryBanner(formData.slug, {
        categoryName: formData.name,
        title: formData.bannerTitle || `${formData.name.toUpperCase()} GEAR`,
        badge: formData.bannerBadge || 'PRO PERFORMANCE GEAR',
        subtitle: formData.bannerSubtitle || formData.description,
        image: formData.image,
        gradient: formData.bannerGradient || BANNER_GRADIENT_PRESETS[0].value,
        status: formData.status,
      });
      loadBanners();

      setToastMessage(`Category "${formData.name}" & storefront hero banner saved.`);
    } catch (e) {
      setToastMessage('Category & banner saved locally.');
    } finally {
      setIsModalOpen(false);
      setTimeout(() => setToastMessage(''), 3500);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem('strategy_admin_token');
      await fetch(`http://localhost:5000/api/v1/admin/categories/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setToastMessage(`Category "${deleteTarget.name}" deleted.`);
    } catch (e) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setToastMessage(`Category "${deleteTarget.name}" deleted.`);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleReorder = (idx, direction) => {
    const next = [...categories];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= next.length) return;

    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;

    next.forEach((item, i) => {
      item.displayOrder = i + 1;
    });

    setCategories(next);
    setToastMessage('Category display sequence updated.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Dedicated Banner Modal Handlers
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerFormData({
      slug: '',
      categoryName: '',
      title: 'NEW STOREFRONT HERO BANNER',
      subtitle: 'Tournament-tested equipment, carbon-plated footwear & technical athletic sportswear.',
      badge: 'PRO SERIES RELEASE',
      image: '/images/strategy_athlete_banner.jpg',
      gradient: BANNER_GRADIENT_PRESETS[0].value,
      glow: BANNER_GRADIENT_PRESETS[0].glow,
      badgeStyle: BANNER_GRADIENT_PRESETS[0].badgeStyle,
      status: 'published',
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (banner) => {
    setEditingBanner(banner);
    setBannerFormData({
      slug: banner.slug || '',
      categoryName: banner.categoryName || banner.title || '',
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      badge: banner.badge || '',
      image: banner.image || '/images/strategy_athlete_banner.jpg',
      gradient: banner.gradient || BANNER_GRADIENT_PRESETS[0].value,
      glow: banner.glow || BANNER_GRADIENT_PRESETS[0].glow,
      badgeStyle: banner.badgeStyle || BANNER_GRADIENT_PRESETS[0].badgeStyle,
      status: banner.status || 'published',
    });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (!bannerFormData.slug.trim()) return;

    const normalizedSlug = bannerFormData.slug.toLowerCase().replace(/[^a-z0-9-]+/g, '');
    upsertCategoryBanner(normalizedSlug, {
      ...bannerFormData,
      slug: normalizedSlug,
    });
    loadBanners();
    setIsBannerModalOpen(false);
    setToastMessage(`Banner for "/${normalizedSlug}" updated live on storefront.`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleQuickSwapImage = (banner, newImageUrl) => {
    upsertCategoryBanner(banner.slug, {
      ...banner,
      image: newImageUrl,
    });
    loadBanners();
    setToastMessage(`Updated photo for "${banner.title}" to ${newImageUrl.split('/').pop()}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filtered Banners list
  const filteredBanners = categoryBanners.filter((b) => {
    const q = bannerSearch.toLowerCase();
    const matchSearch =
      b.title.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      b.badge.toLowerCase().includes(q) ||
      (b.categoryName && b.categoryName.toLowerCase().includes(q));

    if (!matchSearch) return false;

    if (bannerFilterGroup === 'sports') {
      return ['basketball', 'running', 'football', 'skating', 'fitness', 'apparel', 'training'].includes(b.slug);
    }
    if (bannerFilterGroup === 'gender') {
      return ['men', 'women', 'kids'].includes(b.slug);
    }
    if (bannerFilterGroup === 'vault') {
      return ['special-edition', 'shop'].includes(b.slug);
    }
    return true;
  });

  const columns = [
    {
      header: 'Category Name',
      accessor: 'name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0">
            <img src={row.image} alt={val} className="w-full h-full object-cover" />
          </div>
          <div>
            <p
              className="font-medium text-zinc-900 hover:text-black transition-colors cursor-pointer text-xs"
              onClick={() => handleOpenEdit(row)}
            >
              {val}
            </p>
            <p className="text-[10px] text-zinc-400 font-mono">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (val) => <span className="text-zinc-500 text-xs truncate max-w-xs block">{val || '—'}</span>,
    },
    {
      header: 'Storefront Hero Banner',
      accessor: 'slug',
      align: 'center',
      render: (slug, row) => {
        const matchingBanner = categoryBanners.find((b) => b.slug.toLowerCase() === (slug || '').toLowerCase());
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                if (matchingBanner) {
                  handleOpenEditBanner(matchingBanner);
                } else {
                  handleOpenAddBanner();
                  setBannerFormData((prev) => ({
                    ...prev,
                    slug,
                    categoryName: row.name,
                    title: `${row.name.toUpperCase()} GEAR`,
                    image: row.image,
                  }));
                }
              }}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-semibold rounded-md border border-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Customize Full-Bleed Storefront Hero Banner"
            >
              <ImageIcon className="w-3 h-3 text-emerald-600" />
              <span>{matchingBanner ? 'Edit Banner' : '+ Add Banner'}</span>
            </button>
          </div>
        );
      },
    },
    {
      header: 'Products',
      accessor: 'productCount',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[11px] font-medium border border-zinc-200/60">
          {val} Products
        </span>
      ),
    },
    {
      header: 'Display Order',
      accessor: 'displayOrder',
      sortable: true,
      align: 'center',
      render: (val, row) => {
        const idx = categories.findIndex((c) => c.id === row.id);
        return (
          <div className="flex items-center justify-center gap-1">
            <span className="font-medium text-zinc-700 mr-1.5 text-xs">#{val}</span>
            <button
              onClick={() => handleReorder(idx, 'up')}
              disabled={idx === 0}
              className="p-1 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 rounded transition-colors disabled:opacity-20 cursor-pointer"
            >
              <MoveUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleReorder(idx, 'down')}
              disabled={idx === categories.length - 1}
              className="p-1 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 rounded transition-colors disabled:opacity-20 cursor-pointer"
            >
              <MoveDown className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      align: 'center',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleOpenEdit(row)}
            title="Edit Category & Banner"
            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            title="Delete Category"
            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {toastMessage && (
        <div className="fixed top-16 right-6 z-[100] bg-zinc-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 font-medium text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header & Dual Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-zinc-700" />
            <span>Category Tree & Storefront Banners</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage category structures, menu order, and access/change all full-bleed storefront hero banners across the site.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 bg-zinc-100 border border-zinc-200 rounded-xl">
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tree'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Category Tree</span>
            <span className="px-1.5 py-0.2 bg-zinc-200/80 text-zinc-800 rounded-full text-[10px]">
              {categories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Storefront Banners</span>
            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">
              {categoryBanners.length} Banners
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: CATEGORY TREE HIERARCHY TABLE VIEW
         ========================================================================= */}
      {activeTab === 'tree' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500 font-medium">
              Products are sorted into parent categories. Each category automatically drives its own storefront hero header.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-2 bg-zinc-950 hover:bg-black text-white font-semibold text-xs rounded-lg transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New Category</span>
            </button>
          </div>

          <DataTable
            columns={columns}
            data={categories}
            loading={loading}
            searchable={true}
            searchPlaceholder="Search category name or slug..."
            pageSize={10}
            onRefresh={fetchCategories}
          />
        </div>
      )}

      {/* =========================================================================
          TAB 2: STOREFRONT BANNERS MANAGER (ACCESS & CHANGE ALL BANNERS)
         ========================================================================= */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          {/* Banner Toolbar & Filters */}
          <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider mr-1">
                Filter Banners:
              </span>
              {[
                { id: 'all', label: 'All Banners' },
                { id: 'sports', label: 'Sports Disciplines' },
                { id: 'gender', label: 'Gender Collections' },
                { id: 'vault', label: 'Vault & Catalog' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setBannerFilterGroup(pill.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    bannerFilterGroup === pill.id
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bannerSearch}
                  onChange={(e) => setBannerSearch(e.target.value)}
                  placeholder="Search banner titles or slugs..."
                  className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white transition"
                />
              </div>

              <button
                onClick={handleOpenAddBanner}
                className="px-3.5 py-1.5 bg-zinc-950 hover:bg-black text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add New Banner</span>
              </button>
            </div>
          </div>

          {/* Banner Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredBanners.map((banner) => (
              <div
                key={banner.id || banner.slug}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between group"
              >
                {/* Visual Banner Preview Container */}
                <div className="relative w-full h-44 overflow-hidden bg-zinc-950 flex flex-col justify-between p-4">
                  {/* Background Image */}
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Dynamic Color Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/50 pointer-events-none" />

                  {/* Top Bar Preview */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black tracking-widest uppercase backdrop-blur-md ${banner.badgeStyle}`}>
                      {banner.badge}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[10px] border border-white/20">
                      /{banner.slug}
                    </span>
                  </div>

                  {/* Banner Title & Description */}
                  <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white drop-shadow-md leading-tight">
                      {banner.title}
                    </h3>
                    <p className="text-[11px] text-zinc-200 line-clamp-1 mt-0.5 font-medium drop-shadow-sm">
                      {banner.subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Management Controls & Quick Photo Selector */}
                <div className="p-4 space-y-3 bg-white">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                      Quick Select Photo Preset:
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {BANNER_IMAGE_PRESETS.slice(0, 6).map((imgPreset) => (
                        <button
                          key={imgPreset.label}
                          type="button"
                          onClick={() => handleQuickSwapImage(banner, imgPreset.url)}
                          className={`px-2 py-1 text-[10px] font-semibold rounded-md border transition-all cursor-pointer whitespace-nowrap ${
                            banner.image === imgPreset.url
                              ? 'bg-zinc-950 text-white border-zinc-950 shadow-2xs'
                              : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                          }`}
                          title={`Swap image to ${imgPreset.label}`}
                        >
                          {imgPreset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-800">
                        {banner.categoryName || banner.slug}
                      </span>
                      <StatusBadge status={banner.status || 'published'} size="sm" />
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`#${banner.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition"
                        title="Open live storefront page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleOpenEditBanner(banner)}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit Banner</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ADD / EDIT CATEGORY (WITH HERO BANNER SECTION)
         ========================================================================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
        subtitle="Specify category catalog hierarchy and configure its storefront hero banner."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <TextInput
              label="Category Name"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  name,
                  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                  bannerTitle: prev.bannerTitle || `${name.toUpperCase()} GEAR`,
                }));
              }}
              placeholder="e.g. Basketball"
              required
            />

            <TextInput
              label="URL Slug"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="basketball"
              required
            />
          </div>

          <TextareaInput
            label="Category Summary & Description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="High performance athletic category for tournament and training gear..."
            rows={2}
          />

          {/* Category Hero Banner Customization Box */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Storefront Hero Banner Setup</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-semibold">
                Appears full-bleed at top of /{formData.slug || 'category'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextInput
                label="Banner Title"
                value={formData.bannerTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, bannerTitle: e.target.value }))}
                placeholder="e.g. SKATING ANGELS RINK"
              />

              <TextInput
                label="Badge Chip Text"
                value={formData.bannerBadge}
                onChange={(e) => setFormData((prev) => ({ ...prev, bannerBadge: e.target.value }))}
                placeholder="e.g. PRECISION GLIDE & RINK GEAR"
              />
            </div>

            <ImageUploader
              label="Banner Cover Photo URL"
              value={formData.image}
              onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
            />

            <div>
              <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider block mb-1">
                Quick Select Photo:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {BANNER_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image: preset.url }))}
                    className={`px-2 py-1 text-[10px] font-medium rounded-md border cursor-pointer whitespace-nowrap ${
                      formData.image === preset.url
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SelectInput
            label="Publishing Status"
            value={formData.status}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            options={[
              { label: 'Published (Live on storefront & navigation)', value: 'published' },
              { label: 'Draft (Hidden in backoffice)', value: 'draft' },
            ]}
          />

          <div className="pt-2 flex justify-end gap-2.5 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-zinc-300 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-zinc-950 hover:bg-black text-white font-semibold rounded-lg text-xs transition cursor-pointer shadow-xs"
            >
              Save Category & Banner
            </button>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          MODAL 2: DEDICATED STOREFRONT BANNER EDITOR (WITH LIVE INTERACTIVE PREVIEW)
         ========================================================================= */}
      <Modal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        title={editingBanner ? `Edit Banner: ${bannerFormData.title}` : 'Add New Storefront Hero Banner'}
        subtitle="Change banner cover photos, titles, badges, and athletic color tones in real time."
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSaveBanner} className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
          {/* Live Interactive Preview Box */}
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-zinc-950 flex flex-col justify-between p-5 border border-zinc-300 shadow-sm">
            <img
              src={bannerFormData.image}
              alt={bannerFormData.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${bannerFormData.gradient}`} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/50 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black tracking-widest uppercase backdrop-blur-md ${bannerFormData.badgeStyle}`}>
                {bannerFormData.badge || 'PRO PERFORMANCE'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[10px] border border-white/20">
                /{bannerFormData.slug || 'slug'}
              </span>
            </div>

            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-md">
                {bannerFormData.title || 'BANNER TITLE'}
              </h3>
              <p className="text-xs text-zinc-200 line-clamp-1 mt-0.5 font-medium drop-shadow-sm max-w-xl">
                {bannerFormData.subtitle || 'Category and sport equipment subtitle...'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <TextInput
              label="Target Page / Category Slug"
              value={bannerFormData.slug}
              onChange={(e) => setBannerFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase() }))}
              placeholder="e.g. skating, running, basketball"
              required
            />

            <TextInput
              label="Category / Collection Label"
              value={bannerFormData.categoryName}
              onChange={(e) => setBannerFormData((prev) => ({ ...prev, categoryName: e.target.value }))}
              placeholder="e.g. Inline Skating"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <TextInput
              label="Banner Headline Title"
              value={bannerFormData.title}
              onChange={(e) => setBannerFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. SKATING ANGELS RINK"
              required
            />

            <TextInput
              label="Badge Tag Text"
              value={bannerFormData.badge}
              onChange={(e) => setBannerFormData((prev) => ({ ...prev, badge: e.target.value.toUpperCase() }))}
              placeholder="e.g. PRECISION GLIDE & RINK GEAR"
              required
            />
          </div>

          <TextareaInput
            label="Banner Subtitle / Description"
            value={bannerFormData.subtitle}
            onChange={(e) => setBannerFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
            placeholder="Inline quad skates, protective armor padding kits & precision bearings."
            rows={2}
          />

          {/* Image URL & Preset Pickers */}
          <div className="space-y-2">
            <TextInput
              label="Banner Cover Photo URL"
              value={bannerFormData.image}
              onChange={(e) => setBannerFormData((prev) => ({ ...prev, image: e.target.value }))}
              placeholder="/images/inline_skates.jpg"
              required
            />

            <div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block mb-1">
                Quick Select Photo Preset:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {BANNER_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setBannerFormData((prev) => ({ ...prev, image: preset.url }))}
                    className={`px-2 py-1 text-[10px] font-semibold rounded-md border cursor-pointer whitespace-nowrap ${
                      bannerFormData.image === preset.url
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-2xs'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gradient & Theme Tone Picker */}
          <div>
            <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-wider block mb-1.5">
              Theme Gradient Tone:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {BANNER_GRADIENT_PRESETS.map((grad) => (
                <button
                  key={grad.label}
                  type="button"
                  onClick={() =>
                    setBannerFormData((prev) => ({
                      ...prev,
                      gradient: grad.value,
                      glow: grad.glow,
                      badgeStyle: grad.badgeStyle,
                    }))
                  }
                  className={`p-2 rounded-lg border text-left cursor-pointer transition ${
                    bannerFormData.gradient === grad.value
                      ? 'border-zinc-950 bg-zinc-100 ring-1 ring-zinc-950 font-bold'
                      : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-medium'
                  }`}
                >
                  <div className={`w-full h-3 rounded-md bg-gradient-to-r ${grad.value} mb-1`} />
                  <span className="text-[10px] block truncate">{grad.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setIsBannerModalOpen(false)}
              className="px-4 py-2 border border-zinc-300 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-zinc-950 hover:bg-black text-white font-semibold rounded-lg text-xs transition cursor-pointer shadow-xs flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Banner Live</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete Category "${deleteTarget?.name}"?`}
        description="Are you sure? Any products assigned to this category will need to be reclassified."
        confirmLabel="Delete Category"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
