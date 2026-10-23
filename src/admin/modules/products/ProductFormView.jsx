import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import StockControl from '../../components/StockControl';
import MultiImageUploader from '../../components/MultiImageUploader';

// One-click size lists
const SIZE_PRESETS = {
  Clothes: ['S', 'M', 'L', 'XL', '2XL'],
  Shoes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
  Skates: ['EU 36', 'EU 38', 'EU 40', 'EU 42', 'EU 44'],
  Balls: ['Size 5', 'Size 6', 'Size 7'],
};

const CATEGORIES = [
  ['Basketball', 'Basketball'],
  ['Running', 'Running & shoes'],
  ['Skating', 'Skating'],
  ['Football', 'Football'],
  ['Fitness', 'Fitness'],
  ['Apparel', 'Clothing'],
];

const BADGES = [
  ['isNewArrival', 'New arrival'],
  ['isBestSeller', 'Best seller'],
  ['isFeatured', 'Featured on home page'],
  ['isSpecialEdition', 'Special edition'],
];

const inputCls =
  'w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900';

function Card({ title, hint, children, right }) {
  return (
    <section className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
          {hint && <p className="text-sm text-zinc-500 mt-0.5">{hint}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-zinc-800 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-zinc-500 mt-1">{hint}</span>}
    </label>
  );
}

const newVariant = (name = '') => ({ id: `v_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name, colorHex: '#18181b', images: [], sizes: [] });

export default function ProductFormView({ product = null, onCancel, onSaveSuccess }) {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category: 'Basketball',
    sport: 'Basketball',
    gender: 'unisex',
    priceAed: '',
    salePriceAed: '',
    costPriceAed: '',
    stockQuantity: 10,
    lowStockThreshold: 5,
    description: '',
    image: '',
    images: [],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isSpecialEdition: false,
    status: 'published',
  });
  const [hasSizes, setHasSizes] = useState(false);
  const [variants, setVariants] = useState([newVariant()]);
  const [showMore, setShowMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fill the form when editing
  useEffect(() => {
    if (!product) return;
    const price = product.priceFils ? product.priceFils / 100 : product.price || '';
    const sale = product.salePriceFils ? product.salePriceFils / 100 : '';
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      sku: product.sku || '',
      category: product.category || 'Basketball',
      sport: product.sport || 'Basketball',
      gender: product.gender || 'unisex',
      priceAed: price,
      // Only show a sale price when it is actually lower than the normal price
      salePriceAed: sale && sale < price ? sale : '',
      costPriceAed: product.costPriceFils ? product.costPriceFils / 100 : '',
      stockQuantity: product.stockQuantity ?? product.stock ?? 0,
      lowStockThreshold: product.lowStockThreshold || 5,
      description: product.description || '',
      image: product.image || product.images?.[0] || '',
      images: product.images?.length ? product.images : product.image ? [product.image] : [],
      isFeatured: !!product.isFeatured,
      isBestSeller: !!product.isBestSeller,
      isNewArrival: !!product.isNewArrival,
      isSpecialEdition: !!product.isSpecialEdition,
      status: product.status || 'published',
    });
    if (Array.isArray(product.variants) && product.variants.some((v) => v.sizes?.length)) {
      setHasSizes(true);
      setVariants(
        product.variants.map((v, i) => ({
          id: v.id || `v_${i + 1}`,
          name: v.color || v.name || '',
          colorHex: v.colorHex || '#18181b',
          images: v.images || [],
          sizes: (v.sizes || []).map((s) => ({ size: s.size, price: s.price, stock: Number(s.stock) || 0 })),
        }))
      );
    }
  }, [product]);

  const set = (name, value) =>
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'name' && !isEditing) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      return next;
    });
  const onField = (e) => set(e.target.name, e.target.value);

  // ---- sizes ----
  const updateVariant = (id, patch) => setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  const addSize = (id, size = '') =>
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, sizes: [...v.sizes, { size, price: '', stock: 0 }] } : v)));
  const applyPreset = (id, key) =>
    updateVariant(id, { sizes: SIZE_PRESETS[key].map((size) => ({ size, price: '', stock: 0 })) });
  const updateSize = (id, idx, patch) =>
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, sizes: v.sizes.map((s, i) => (i === idx ? { ...s, ...patch } : s)) } : v))
    );
  const removeSize = (id, idx) =>
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, sizes: v.sizes.filter((_, i) => i !== idx) } : v)));

  const sizesTotal = variants.reduce((sum, v) => sum + v.sizes.reduce((s, x) => s + (Number(x.stock) || 0), 0), 0);
  const totalStock = hasSizes ? sizesTotal : Number(formData.stockQuantity) || 0;

  // ---- save ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const price = parseFloat(formData.priceAed);
    const sale = parseFloat(formData.salePriceAed);
    if (!formData.name.trim()) return setErrorMsg('Please give the product a name.');
    if (!(price > 0)) return setErrorMsg('Please enter a price.');
    if (sale && sale >= price) return setErrorMsg('The sale price should be lower than the normal price.');
    if (hasSizes && !variants.some((v) => v.sizes.some((s) => s.size.trim())))
      return setErrorMsg('Add at least one size, or switch off “Comes in sizes”.');

    const images = formData.images?.length ? formData.images : ['/images/strategy_basketball_ball.jpg'];
    const cleanVariants = hasSizes
      ? variants.map((v) => ({
          ...v,
          name: v.name.trim() || 'Standard',
          images: v.images?.length ? v.images : [images[0]],
          sizes: v.sizes.filter((s) => s.size.trim()).map((s) => ({ ...s, price: s.price || price })),
        }))
      : [];
    const sku = formData.sku || `STR-${formData.name.substring(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, '') || 'PRO'}-${Math.floor(100 + Math.random() * 900)}`;

    const payload = {
      ...formData,
      sku,
      image: images[0],
      images,
      id: product?.id,
      price,
      priceFils: Math.round(price * 100),
      salePriceFils: Math.round((sale || price) * 100),
      costPriceFils: Math.round((parseFloat(formData.costPriceAed) || 0) * 100),
      stockQuantity: totalStock,
      lowStockThreshold: Number(formData.lowStockThreshold) || 5,
      variants: cleanVariants,
    };

    setIsSubmitting(true);
    try {
      const saved = await adminApi.saveProduct(payload);
      onSaveSuccess?.(saved || payload);
    } catch (err) {
      setErrorMsg(
        err?.details?.isNetworkError
          ? 'Could not save: the shop server is not running, so changes cannot be stored right now.'
          : err?.status === 401
            ? 'Could not save: your sign-in has expired. Please sign out and sign in again.'
            : `Could not save: ${err.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const price = parseFloat(formData.priceAed) || 0;
  const sale = parseFloat(formData.salePriceAed) || 0;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-5 pb-28">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 -ml-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl cursor-pointer"
          title="Back to products"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">
            {isEditing ? formData.name || 'Edit product' : 'New product'}
          </h2>
          <p className="text-sm text-zinc-500">Fill in the basics. Everything else is optional.</p>
        </div>
      </div>

      <Card title="Photos" hint="The first photo is the one customers see first.">
        <MultiImageUploader
          images={formData.images || []}
          onChange={(imgs) => setFormData((prev) => ({ ...prev, images: imgs, image: imgs[0] || '' }))}
          maxImages={6}
          label="Product photos (up to 6)"
          hint="Drag photos here or click to choose from your computer."
        />
      </Card>

      <Card title="Basic details">
        <Field label="Product name" required>
          <input name="name" value={formData.name} onChange={onField} placeholder="e.g. Pro Grip Basketball" className={inputCls} />
        </Field>
        <Field label="Category">
          <select name="category" value={formData.category} onChange={onField} className={`${inputCls} cursor-pointer`}>
            {CATEGORIES.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </Field>
        <Field label="Description" hint="A few sentences about the product.">
          <textarea name="description" rows={4} value={formData.description} onChange={onField} className={`${inputCls} resize-y`} />
        </Field>
      </Card>

      <Card title="Price">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Price (AED)" required hint="Including VAT">
            <input name="priceAed" type="number" min="0" step="0.01" value={formData.priceAed} onChange={onField} placeholder="0.00" className={inputCls} />
          </Field>
          <Field label="Sale price (AED)" hint="Leave empty if it's not on sale">
            <input name="salePriceAed" type="number" min="0" step="0.01" value={formData.salePriceAed} onChange={onField} placeholder="—" className={inputCls} />
          </Field>
        </div>
        {sale > 0 && sale < price && (
          <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl px-3.5 py-2.5">
            Customers will see <s className="text-zinc-400">AED {price.toFixed(2)}</s> <strong>AED {sale.toFixed(2)}</strong> ({Math.round((1 - sale / price) * 100)}% off)
          </p>
        )}
      </Card>

      <Card
        title="Stock"
        hint={hasSizes ? `${totalStock} in stock across all sizes` : 'How many do you have?'}
        right={
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <span className="text-sm text-zinc-700">Comes in sizes</span>
            <button
              type="button"
              role="switch"
              aria-checked={hasSizes}
              id="toggle-sizes"
              onClick={() => setHasSizes(!hasSizes)}
              className={`relative w-11 h-6 rounded-full transition ${hasSizes ? 'bg-zinc-900' : 'bg-zinc-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${hasSizes ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </label>
        }
      >
        {!hasSizes ? (
          <StockControl
            value={formData.stockQuantity}
            onChange={(q) => set('stockQuantity', q)}
            showQuickPills
            showBadge
            badgePosition="right"
          />
        ) : (
          <div className="space-y-4">
            {variants.map((v) => (
              <div key={v.id} className={variants.length > 1 ? 'border border-zinc-200 rounded-xl p-4 space-y-3' : 'space-y-3'}>
                {variants.length > 1 && (
                  <div className="flex items-center gap-2">
                    <input
                      value={v.name}
                      onChange={(e) => updateVariant(v.id, { name: e.target.value })}
                      placeholder="Colour, e.g. Black"
                      className={`${inputCls} max-w-xs`}
                    />
                    <button
                      type="button"
                      onClick={() => setVariants((prev) => prev.filter((x) => x.id !== v.id))}
                      className="p-2 text-zinc-400 hover:text-rose-600 cursor-pointer"
                      title="Remove this colour"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-zinc-500">Quick fill:</span>
                  {Object.keys(SIZE_PRESETS).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => applyPreset(v.id, k)}
                      className="px-3 py-1.5 rounded-lg text-sm ring-1 ring-zinc-200 hover:bg-zinc-50 text-zinc-700 cursor-pointer"
                    >
                      {k}
                    </button>
                  ))}
                </div>

                {v.sizes.length > 0 && (
                  <ul className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl">
                    {v.sizes.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-3 px-3 py-2">
                        <input
                          value={s.size}
                          onChange={(e) => updateSize(v.id, idx, { size: e.target.value })}
                          placeholder="Size"
                          className="flex-1 min-w-0 px-2.5 py-1.5 text-sm border border-transparent hover:border-zinc-200 focus:border-zinc-900 rounded-lg focus:outline-none"
                        />
                        <StockControl value={s.stock} onChange={(q) => updateSize(v.id, idx, { stock: q })} compact />
                        <button
                          type="button"
                          onClick={() => removeSize(v.id, idx)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 cursor-pointer"
                          title="Remove size"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="button"
                  onClick={() => addSize(v.id)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-800 hover:text-black cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add a size
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setVariants((prev) => [...prev, newVariant('')])}
              className="text-sm text-zinc-500 hover:text-zinc-900 underline underline-offset-2 cursor-pointer"
            >
              {variants.length > 1 ? 'Add another colour' : 'Sell this in more than one colour?'}
            </button>
          </div>
        )}
      </Card>

      <Card title="On the website">
        <label className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-zinc-50 cursor-pointer">
          <span>
            <span className="block text-sm font-medium text-zinc-900">Show this product in the shop</span>
            <span className="block text-sm text-zinc-500">Turn off to hide it without deleting it.</span>
          </span>
          <input
            type="checkbox"
            checked={formData.status === 'published'}
            onChange={(e) => set('status', e.target.checked ? 'published' : 'draft')}
            className="w-5 h-5 accent-zinc-900 cursor-pointer"
          />
        </label>
        <div>
          <p className="text-sm font-medium text-zinc-800 mb-2">Labels</p>
          <div className="flex flex-wrap gap-2">
            {BADGES.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => set(key, !formData[key])}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                  formData[key] ? 'bg-zinc-900 text-white' : 'ring-1 ring-zinc-200 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                {formData[key] ? '✓ ' : '+ '}
                {label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Optional extras, hidden by default */}
      <section className="bg-white border border-zinc-200 rounded-2xl">
        <button
          type="button"
          onClick={() => setShowMore(!showMore)}
          className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left cursor-pointer"
        >
          <span>
            <span className="block text-base font-semibold text-zinc-900">More options</span>
            <span className="block text-sm text-zinc-500">Product code, sport, who it's for, cost price</span>
          </span>
          <ChevronDown className={`w-5 h-5 text-zinc-400 transition ${showMore ? 'rotate-180' : ''}`} />
        </button>
        {showMore && (
          <div className="px-5 sm:px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Product code (SKU)" hint="Made automatically if left empty">
              <input name="sku" value={formData.sku} onChange={onField} className={`${inputCls} font-mono`} />
            </Field>
            <Field label="Sport">
              <select name="sport" value={formData.sport} onChange={onField} className={`${inputCls} cursor-pointer`}>
                <option value="Basketball">Basketball</option>
                <option value="Running">Running</option>
                <option value="Skating">Skating</option>
                <option value="Football">Football</option>
                <option value="Training">Gym & training</option>
                <option value="Multi-Sport">Several sports</option>
              </select>
            </Field>
            <Field label="Who it's for">
              <select name="gender" value={formData.gender} onChange={onField} className={`${inputCls} cursor-pointer`}>
                <option value="unisex">Everyone</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="junior">Kids</option>
              </select>
            </Field>
            <Field label="Cost price (AED)" hint="Only you see this">
              <input name="costPriceAed" type="number" min="0" step="0.01" value={formData.costPriceAed} onChange={onField} className={inputCls} />
            </Field>
            <Field label="Warn me when stock is at or below">
              <input name="lowStockThreshold" type="number" min="0" value={formData.lowStockThreshold} onChange={onField} className={inputCls} />
            </Field>
          </div>
        )}
      </section>

      {/* Save bar */}
      <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur border border-zinc-200 rounded-2xl shadow-lg px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          {errorMsg ? (
            <p className="text-sm text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {errorMsg}
            </p>
          ) : (
            <p className="text-sm text-zinc-500 truncate">
              {formData.status === 'published' ? 'Will be visible in the shop' : 'Hidden from the shop'}
              {price > 0 && ` · AED ${(sale && sale < price ? sale : price).toFixed(2)}`} · {totalStock} in stock
            </p>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm font-medium ring-1 ring-zinc-200 hover:bg-zinc-50 cursor-pointer">
            Cancel
          </button>
          <button
            type="submit"
            id="save-product-btn"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white text-sm font-medium rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </div>
    </form>
  );
}
