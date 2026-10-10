import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Layers,
  Plus,
  Trash2,
  AlertCircle,
  GripVertical,
  RefreshCw,
  Tag,
  Shield,
  Image as ImageIcon
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import StockControl from '../../components/StockControl';
import MultiImageUploader from '../../components/MultiImageUploader';

const QUICK_PRESETS = {
  apparel: [
    { size: 'S', price: '', stock: 15 },
    { size: 'M', price: '', stock: 25 },
    { size: 'L', price: '', stock: 25 },
    { size: 'XL', price: '', stock: 15 },
    { size: '2XL', price: '', stock: 8 },
  ],
  shoes: [
    { size: 'EU 39', price: '', stock: 6 },
    { size: 'EU 40', price: '', stock: 12 },
    { size: 'EU 41', price: '', stock: 18 },
    { size: 'EU 42', price: '', stock: 20 },
    { size: 'EU 43', price: '', stock: 15 },
    { size: 'EU 44', price: '', stock: 10 },
  ],
  balls: [
    { size: 'Size 5 (Youth)', price: '', stock: 15 },
    { size: 'Size 6 (Intermediate)', price: '', stock: 20 },
    { size: 'Size 7 (Official Regulation)', price: '', stock: 35 },
  ],
  skates: [
    { size: 'EU 36', price: '', stock: 8 },
    { size: 'EU 38', price: '', stock: 14 },
    { size: 'EU 40', price: '', stock: 18 },
    { size: 'EU 42', price: '', stock: 14 },
    { size: 'EU 44', price: '', stock: 8 },
  ],
};

export default function ProductFormView({
  product = null,
  onCancel,
  onSaveSuccess
}) {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category: 'Basketball',
    sport: 'Basketball',
    gender: 'unisex',
    priceAed: 49.99,
    salePriceAed: 49.99,
    costPriceAed: 24.00,
    stockQuantity: 45,
    lowStockThreshold: 5,
    description: '',
    image: '/images/strategy_basketball_ball.jpg',
    images: ['/images/strategy_basketball_ball.jpg'],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isSpecialEdition: false,
    status: 'published',
  });

  const [variants, setVariants] = useState([
    {
      id: 'v_1',
      name: 'Triple Black / Gold',
      colorHex: '#18181b',
      images: ['/images/strategy_basketball_ball.jpg'],
      sizes: [
        { size: 'Standard Size 7', price: 49.99, stock: 25 },
        { size: 'Size 6 Intermediate', price: 49.99, stock: 20 },
      ]
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Populate data when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        sku: product.sku || '',
        category: product.category || 'Basketball',
        sport: product.sport || 'Basketball',
        gender: product.gender || 'unisex',
        priceAed: product.priceFils ? (product.priceFils / 100).toFixed(2) : (product.price || 49.99),
        salePriceAed: product.salePriceFils ? (product.salePriceFils / 100).toFixed(2) : (product.price || 49.99),
        costPriceAed: product.costPriceFils ? (product.costPriceFils / 100).toFixed(2) : 24.00,
        stockQuantity: product.stockQuantity ?? product.stock ?? 45,
        lowStockThreshold: product.lowStockThreshold || 5,
        description: product.description || '',
        image: product.image || (product.images && product.images[0]) || '/images/strategy_basketball_ball.jpg',
        images: product.images?.length ? product.images : ['/images/strategy_basketball_ball.jpg'],
        isFeatured: !!product.isFeatured,
        isBestSeller: !!product.isBestSeller,
        isNewArrival: !!product.isNewArrival,
        isSpecialEdition: !!product.isSpecialEdition,
        status: product.status || 'published',
      });

      if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
        setVariants(product.variants.map((v, i) => ({
          id: v.id || `v_${i + 1}`,
          name: v.color || v.name || 'Default Variant',
          colorHex: v.colorHex || '#18181b',
          images: v.images || [product.image || '/images/strategy_basketball_ball.jpg'],
          sizes: v.sizes || [{ size: v.size || 'M', price: product.price || 49.99, stock: v.stockQuantity || 10 }]
        })));
      }
    }
  }, [product]);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'name' && !isEditing) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (!prev.sku) {
          next.sku = `STR-${value.substring(0, 4).toUpperCase() || 'PRO'}-${Math.floor(100 + Math.random() * 900)}`;
        }
      }
      return next;
    });
  };

  // Add a new variant block
  const handleAddVariant = () => {
    const newId = `v_${Date.now()}`;
    const basePrice = parseFloat(formData.priceAed) || 49.99;
    setVariants((prev) => [
      ...prev,
      {
        id: newId,
        name: 'New Colorway',
        colorHex: '#065184',
        images: [formData.image],
        sizes: [
          { size: 'M', price: basePrice, stock: 15 },
          { size: 'L', price: basePrice, stock: 15 },
        ]
      }
    ]);
  };

  // Delete variant block
  const handleDeleteVariant = (id) => {
    if (variants.length <= 1) {
      alert('A product must maintain at least one variant configuration.');
      return;
    }
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  // Update variant field
  const handleUpdateVariant = (id, key, val) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [key]: val } : v))
    );
  };

  // Quick preset apply
  const handleApplyPreset = (variantId, presetKey) => {
    if (!presetKey || !QUICK_PRESETS[presetKey]) return;
    const basePrice = parseFloat(formData.priceAed) || 49.99;
    const newSizes = QUICK_PRESETS[presetKey].map((item) => ({
      size: item.size,
      price: basePrice,
      stock: item.stock
    }));

    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, sizes: newSizes } : v))
    );
  };

  // Add single size row
  const handleAddSizeRow = (variantId) => {
    const basePrice = parseFloat(formData.priceAed) || 49.99;
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          return {
            ...v,
            sizes: [...v.sizes, { size: 'XL', price: basePrice, stock: 10 }]
          };
        }
        return v;
      })
    );
  };

  // Update single size row
  const handleUpdateSizeRow = (variantId, sizeIdx, field, val) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          const nextSizes = [...v.sizes];
          nextSizes[sizeIdx] = {
            ...nextSizes[sizeIdx],
            [field]: field === 'stock' ? parseInt(val) || 0 : val
          };
          return { ...v, sizes: nextSizes };
        }
        return v;
      })
    );
  };

  // Delete single size row
  const handleDeleteSizeRow = (variantId, sizeIdx) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          if (v.sizes.length <= 1) return v;
          return {
            ...v,
            sizes: v.sizes.filter((_, idx) => idx !== sizeIdx)
          };
        }
        return v;
      })
    );
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Product name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const primaryImage = formData.images?.[0] || formData.image || variants?.[0]?.images?.[0] || '/images/strategy_basketball_ball.jpg';
      const productImages = formData.images?.length > 0 ? formData.images : [primaryImage];
      const payload = {
        ...formData,
        image: primaryImage,
        images: productImages,
        id: product?.id || `prod_${Date.now()}`,
        price: parseFloat(formData.priceAed),
        priceFils: Math.round(parseFloat(formData.priceAed) * 100),
        salePriceFils: Math.round(parseFloat(formData.salePriceAed) * 100),
        costPriceFils: Math.round(parseFloat(formData.costPriceAed) * 100),
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        variants,
      };

      // Call API helper or seed update
      await adminApi.saveProduct(payload);

      if (onSaveSuccess) {
        onSaveSuccess(payload);
      }
    } catch (err) {
      console.error('Error saving product:', err);
      // Fallback optimistic resolution
      if (onSaveSuccess) {
        const primaryImage = formData.images?.[0] || formData.image || variants?.[0]?.images?.[0] || '/images/strategy_basketball_ball.jpg';
        const productImages = formData.images?.length > 0 ? formData.images : [primaryImage];
        onSaveSuccess({
          ...formData,
          image: primaryImage,
          images: productImages,
          id: product?.id || `prod_${Date.now()}`,
          price: parseFloat(formData.priceAed),
          variants,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Breadcrumb & Page Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition cursor-pointer"
            title="Return to Product Inventory"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
              {isEditing ? `Edit Product: ${formData.name || 'Untitled'}` : 'Add New Product'}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Specify catalog details, inventory variants, size pricing matrices, and storefront publishing status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 bg-zinc-950 hover:bg-black text-white font-semibold text-xs rounded-lg transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isEditing ? 'Save Changes' : 'Save Product'}</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: General Product Information */}
        <div className="bg-white border border-zinc-200/90 rounded-xl p-6 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Tag className="w-4 h-4 text-zinc-600" />
            <span>1. General Information & Catalog Details</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. STRATEGY Carbon Elite Speed Shoe"
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-lg text-xs font-normal text-zinc-900 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 admin-input-control"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Storefront Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-lg text-xs font-normal text-zinc-900 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 cursor-pointer admin-input-control"
              >
                <option value="Basketball">Basketball Gear</option>
                <option value="Running">Running & Footwear</option>
                <option value="Skating">Inline Skating & Protective</option>
                <option value="Football">Match Footballs & Cleats</option>
                <option value="Fitness">Fitness & Conditioning</option>
                <option value="Apparel">Technical Apparel</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Sport Discipline
              </label>
              <select
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-normal text-zinc-900 focus:outline-none focus:border-zinc-950 cursor-pointer admin-input-control"
              >
                <option value="Basketball">Basketball</option>
                <option value="Running">Speed Running</option>
                <option value="Skating">Inline Skating</option>
                <option value="Football">Football / Soccer</option>
                <option value="Training">Gym & Cross-Training</option>
                <option value="Multi-Sport">Multi-Discipline Sports</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Athlete Fit / Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-normal text-zinc-900 focus:outline-none focus:border-zinc-950 cursor-pointer admin-input-control"
              >
                <option value="unisex">Unisex Adult</option>
                <option value="men">Men's Athletic</option>
                <option value="women">Women's Athletic</option>
                <option value="junior">Junior / Youth</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                SKU / Barcode Model
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="STR-SKU-900"
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-mono text-zinc-900 focus:outline-none focus:border-zinc-950 admin-input-control"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
              Product Specifications & Details
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="High performance athletic gear built with premium materials for maximum durability and athlete safety..."
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-lg text-xs font-normal text-zinc-900 focus:outline-none focus:border-zinc-950 resize-y admin-input-control"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2 border-t border-zinc-100">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Retail Price (AED) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="priceAed"
                required
                value={formData.priceAed}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-950 admin-input-control"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Sale Price (AED)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="salePriceAed"
                value={formData.salePriceAed}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-950 admin-input-control"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Cost Price (AED)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="costPriceAed"
                value={formData.costPriceAed}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-950 admin-input-control"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Total Stock Units
              </label>
              <div className="pt-0.5">
                <StockControl
                  value={formData.stockQuantity}
                  onChange={(newQty) => setFormData((prev) => ({ ...prev, stockQuantity: newQty }))}
                  showQuickPills={true}
                  showBadge={true}
                  badgePosition="right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Product Media & Gallery (Up to 6 Images) */}
        <div className="bg-white border border-zinc-200/90 rounded-xl p-6 shadow-xs space-y-4">
          <MultiImageUploader
            images={formData.images || []}
            onChange={(newImages) => {
              setFormData((prev) => ({
                ...prev,
                images: newImages,
                image: newImages[0] || ''
              }));
            }}
            maxImages={6}
            label="2. Product Media & Gallery (Up to 6 Images)"
            hint="Upload or paste up to 6 high-resolution product photos. The first image (#1) will be used as the primary storefront catalog cover."
          />
        </div>

        {/* Card 3: Variants & Inventory Matrices */}
        <div className="bg-white border border-zinc-200/90 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-700" />
                <span>3. Variants & Inventory Matrices</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Add options like Color, Finish, or Edition. Each option maintains its own image preview and per-size stock matrix.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-full">
              {variants.length} {variants.length === 1 ? 'Variant' : 'Variants'}
            </span>
          </div>

          {/* Variant Blocks List */}
          <div className="space-y-4">
            {variants.map((v, vIdx) => (
              <div
                key={v.id}
                className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:border-zinc-300 transition-all"
              >
                {/* Variant Header */}
                <div className="bg-zinc-50 px-4 py-3 flex items-center justify-between gap-3 border-b border-zinc-200">
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    {/* Color Swatch */}
                    <div className="relative flex items-center">
                      <input
                        type="color"
                        value={v.colorHex || '#18181b'}
                        onChange={(e) => handleUpdateVariant(v.id, 'colorHex', e.target.value)}
                        className="w-7 h-7 rounded-full border border-zinc-300 p-0 cursor-pointer overflow-hidden bg-transparent"
                        title="Pick Color Tone"
                      />
                    </div>

                    <div className="flex-1 max-w-sm">
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleUpdateVariant(v.id, 'name', e.target.value)}
                        placeholder="Variant Name (e.g. Stealth Black / Electric Volt)"
                        className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-950 admin-input-control"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteVariant(v.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Delete Variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Variant Body */}
                <div className="p-4 space-y-4">
                  {/* Variant Image URL input */}
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Variant Thumbnail Image
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img
                          src={v.images?.[0] || formData.image}
                          alt={v.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/images/strategy_basketball_ball.jpg';
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        value={v.images?.[0] || ''}
                        onChange={(e) => handleUpdateVariant(v.id, 'images', [e.target.value])}
                        placeholder="/images/strategy_basketball_ball.jpg"
                        className="flex-1 px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 admin-input-control"
                      />
                    </div>
                  </div>

                  {/* Size & Stock Manager */}
                  <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-3.5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                        Sizes & Inventory Matrix
                      </span>

                      <div className="flex items-center gap-2">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            handleApplyPreset(v.id, e.target.value);
                            e.target.value = '';
                          }}
                          className="px-2.5 py-1 bg-white border border-zinc-300 rounded-md text-xs font-medium text-zinc-800 focus:outline-none focus:border-zinc-950 cursor-pointer admin-input-control"
                        >
                          <option value="">+ Quick Fill Preset...</option>
                          <option value="apparel">Apparel (S - 2XL)</option>
                          <option value="shoes">Footwear (EU 39 - 44)</option>
                          <option value="balls">Sports Balls (Size 5 - 7)</option>
                          <option value="skates">Skates (EU 36 - 44)</option>
                        </select>
                      </div>
                    </div>

                    {/* Size Rows Table */}
                    <div className="overflow-x-auto bg-white rounded-lg border border-zinc-200">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-zinc-100/70 border-b border-zinc-200 text-zinc-600 font-semibold">
                            <th className="py-2 px-3 text-left">Size / Fit</th>
                            <th className="py-2 px-3 text-left">Price (AED)</th>
                            <th className="py-2 px-3 text-left">Stock Units</th>
                            <th className="py-2 px-2 text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {v.sizes.map((s, sIdx) => (
                            <tr key={sIdx} className="hover:bg-zinc-50/50">
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={s.size}
                                  onChange={(e) => handleUpdateSizeRow(v.id, sIdx, 'size', e.target.value)}
                                  className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-950 admin-input-control"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={s.price}
                                  onChange={(e) => handleUpdateSizeRow(v.id, sIdx, 'price', e.target.value)}
                                  className="w-24 px-2 py-1 bg-white border border-zinc-200 rounded text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-950 admin-input-control"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <StockControl
                                  value={s.stock}
                                  compact={true}
                                  onChange={(newQty) => handleUpdateSizeRow(v.id, sIdx, 'stock', newQty)}
                                />
                              </td>
                              <td className="py-2 px-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSizeRow(v.id, sIdx)}
                                  className="p-1 text-zinc-400 hover:text-rose-600 transition cursor-pointer"
                                  title="Delete Size"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddSizeRow(v.id)}
                      className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Single Size Row</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Another Variant Button */}
          <button
            type="button"
            onClick={handleAddVariant}
            className="w-full py-3.5 border-2 border-dashed border-zinc-300 hover:border-zinc-950 bg-zinc-50/50 hover:bg-zinc-100 text-zinc-800 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>+ Add Another Variant (Color / Style)</span>
          </button>
        </div>

        {/* Card 4: Marketing & Publishing Flags */}
        <div className="bg-white border border-zinc-200/90 rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Shield className="w-4 h-4 text-zinc-700" />
            <span>4. Marketing Badges & Publishing Status</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <label className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl cursor-pointer hover:bg-zinc-100/70 transition">
              <div>
                <span className="text-xs font-bold text-zinc-900 block">Featured Product</span>
                <span className="text-[11px] text-zinc-500 block">Display in homepage hero carousel</span>
              </div>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 accent-zinc-950 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl cursor-pointer hover:bg-zinc-100/70 transition">
              <div>
                <span className="text-xs font-bold text-zinc-900 block">Best Seller Badge</span>
                <span className="text-[11px] text-zinc-500 block">Highlight with Gold Best Seller tag</span>
              </div>
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleChange}
                className="w-4 h-4 accent-zinc-950 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl cursor-pointer hover:bg-zinc-100/70 transition">
              <div>
                <span className="text-xs font-bold text-zinc-900 block">New Arrival Tag</span>
                <span className="text-[11px] text-zinc-500 block">Mark as new seasonal equipment release</span>
              </div>
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleChange}
                className="w-4 h-4 accent-zinc-950 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl cursor-pointer hover:bg-zinc-100/70 transition">
              <div>
                <span className="text-xs font-bold text-zinc-900 block">Special Edition Vault</span>
                <span className="text-[11px] text-zinc-500 block">Collector piece with numbered certificate</span>
              </div>
              <input
                type="checkbox"
                name="isSpecialEdition"
                checked={formData.isSpecialEdition}
                onChange={handleChange}
                className="w-4 h-4 accent-zinc-950 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
              Publishing Visibility
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full max-w-xs px-3.5 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-950 cursor-pointer admin-input-control"
            >
              <option value="published">Published (Live on storefront)</option>
              <option value="draft">Draft (Hidden in backoffice)</option>
              <option value="archived">Archived (Discontinued)</option>
            </select>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="sticky bottom-4 bg-white/95 backdrop-blur-md border border-zinc-200/90 rounded-xl py-3.5 px-6 z-30 flex items-center justify-between shadow-md mt-6">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-zinc-700">
              {isEditing ? `Editing "${formData.name}"` : 'Creating New Product Draft'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-zinc-950 hover:bg-black text-white font-semibold text-xs rounded-lg transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isEditing ? 'Save Product Changes' : 'Publish Product'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
