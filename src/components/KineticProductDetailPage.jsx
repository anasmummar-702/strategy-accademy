import React, { useState } from 'react';
import KineticHeader from './KineticHeader';
import { 
  Star, 
  Check, 
  ShieldCheck, 
  Truck, 
  Gauge, 
  Heart, 
  ShoppingBag, 
  Plus, 
  Minus, 
  ChevronRight, 
  Maximize2, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Info,
  Gift,
  Award,
  Crown,
  Lock,
  X
} from 'lucide-react';

export default function KineticProductDetailPage({
  navigateTo,
  onAddToCart,
  totalCartCount = 3
}) {
  // Gallery state
  const galleryImages = [
    {
      id: 'studio',
      label: 'Studio Front',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9L3ZmYQp96vADB7mYPf0-f-gpaq32R1oRtdNiCQ-iIwnoH_TcLkdUdTgu4QzmFEAxn4FI5Wm1_8l-HnOQkHUPP6bLWguNabWObFyZJxyPIC7tcKzH90-nmM-AXC2aUpsOB6De7m7q6uBd7cFJX7CQ-cDoPEikzjYRocC2A3IcKhS6AUQY_NT4862tIU3XXjvN5NNuDcUw9DpbTd2ZF0MTvIY9ZDzNINoo97R2NLTYMxeCCz8OEAy2xA'
    },
    {
      id: 'pebble',
      label: 'Pebble Close',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9IGdYT7akik3GaT55O6PDpEyRg3kinreMosF2JEqPHJ3kiufGmv0dtLZ4zpuqGC_wz1QxZLM9ewMxi2oA9tXx_YdsOtUE1fGo6mKbxV84WcBNRPtnUmUimBT65uGLGlgG9My7QSj8_7RT3AIoihoOh6TyLVzSDvJnOtEz-BreA_B46MONwt1aHRgGQ1Z-F9YxheCdd4_hFRuilBVaCu8jA7BkJB7gNdMjIt1f7gHYgyPDbp1wPVyySA'
    },
    {
      id: 'inhand',
      label: 'In Hand Feel',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbH6hmaYfSlNgGXler1L77gox_VyksG0pSSE1n4sZL47SBBrpvY6eZkBmzTONBN6VAmUf29-93_xzNHqiBq269u_BnfImAVsgAM5ydFPy_C_tvTVs6MLoGCfVQ_BW-VR-nVB-du0z8ALT1f2qTiGAtOdv51gFdUBFNDtKwQ7cp6-gMfGZUMTnbY_RTERxuHXwHxXywGalG1il4ShnFxhIRNMeq1vXo4QKap1wiTZEVOi4wHUQL6aEIng'
    },
    {
      id: 'court',
      label: 'Court Action',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwweTWBGhngTI89HOtAcgDTjdA1FOTeJa8vru1OKO1MQSfvAfXA12_igU0cCOZOHjVVqO87U0-Ae5dTw-iIIVznJCvq88iZcl7KXg_bUPl6iYjxjyzOlWDz-1FOCJl4ED8R84ZtqAEfB79z-f5PleFqnv3g8erigEgagFEAvvFsNB8O_wbs9_GC821jfEM_cUKR88imuLYfvP-PhnlZHNamc8A2yI3ryOFX9_PCpNh7FfLVRoNYgGjMQ'
    }
  ];

  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [selectedSize, setSelectedSize] = useState('SIZE 7');
  const [selectedColor, setSelectedColor] = useState('royal');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [includeGiftBox, setIncludeGiftBox] = useState(true);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [reviewTab, setReviewTab] = useState('all');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        id: `knt-ball-07-${selectedSize.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        title: 'KINETIC PRO GRIP COMPOSITE BASKETBALL',
        price: 74.00,
        image: activeImage.url,
        sku: 'KNT-BALL-07',
        size: selectedSize,
        color: selectedColor === 'royal' ? 'Stealth Black + Royal Court Blue' : 'Matte Stealth Black',
        spec: includeGiftBox ? 'Deep-Channel Pebbled + Velvet Vault Box' : 'Deep-Channel Pebbled',
        quantity: quantity
      });
    }
    showToast(`Added ${quantity}x Kinetic Pro Grip Ball to your locker!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigateTo('kinetic-cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddBundle = () => {
    if (onAddToCart) {
      onAddToCart({
        id: 'knt-bundle-fbt',
        title: 'Pro Calibration 3-Piece Court Kit',
        price: 115.00,
        image: galleryImages[0].url,
        sku: 'KNT-BND-3PC',
        size: 'PRO BUNDLE',
        spec: 'Ball + Pump + Grip Sleeve',
        quantity: 1
      });
    }
    showToast('Added 3-Piece Calibration Bundle to Locker ($115.00)');
  };

  return (
    <div className="w-full bg-[#04060f] min-h-screen text-slate-100 font-['Inter',sans-serif] selection:bg-cyan-500 selection:text-slate-950 luxury-ambient-mesh pb-20">
      {/* Top Luxury Header */}
      <KineticHeader 
        activeTab="kinetic-product"
        navigateTo={navigateTo}
        cartCount={totalCartCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* =========================================================================
            BREADCRUMBS & LUXURY SERIALIZATION BADGES
            ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5 text-xs font-['Oswald',sans-serif] tracking-widest uppercase">
            <span 
              onClick={() => navigateTo('kinetic-main')}
              className="text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              ATELIER HOME
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">BALLS & GRIPS</span>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
              KINETIC PRO GRIP
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-400/40 text-amber-300 font-['Oswald',sans-serif] text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>LIMITED ATELIER BATCH: 042/500</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-950/60 border border-blue-400/30 text-blue-300 font-['Oswald',sans-serif] text-[11px] font-bold tracking-widest uppercase">
              FIBA MASTER SPEC
            </span>
          </div>
        </div>

        {/* =========================================================================
            PRIMARY PRODUCT HERO: 2-COLUMN GRID (GALLERY + LUXURY SPECS)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          
          {/* LEFT COLUMN: INTERACTIVE LUXURY GALLERY (7 COLS ON DESKTOP) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Big Main Stage Display with Ambient Aura */}
            <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-gradient-to-b from-slate-900 to-[#070b1e] flex items-center justify-center group luxury-glass-card">
              <img 
                src={activeImage.url} 
                alt="Kinetic Pro Grip Composite Basketball" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Watermark / Technical HUD Overlays */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                <span className="bg-slate-950/85 backdrop-blur-md text-white border border-white/20 font-['Oswald',sans-serif] text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg">
                  ★ FIBA OFFICIAL SIZE
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 backdrop-blur-md text-white font-['Oswald',sans-serif] text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg shadow-blue-500/30">
                  INDOOR / OUTDOOR PRO
                </span>
              </div>

              <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                <span className="bg-slate-950/85 backdrop-blur-md text-slate-200 border border-white/10 font-['Oswald',sans-serif] text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  TAP TO INSPECT COMPOSITE GRAIN
                </span>
              </div>

              <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
                <span className="bg-blue-950/90 backdrop-blur-md text-blue-300 border border-blue-400/40 font-['Oswald',sans-serif] text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg">
                  PSI RATED: 7.5 - 8.5 OPTIMAL
                </span>
              </div>
            </div>

            {/* 4 Gallery Thumbnails with Luxury Hover Bevels */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {galleryImages.map((thumb) => {
                const isSelected = activeImage.id === thumb.id;
                return (
                  <button
                    key={thumb.id}
                    onClick={() => setActiveImage(thumb)}
                    className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all p-1 bg-slate-950 group ${
                      isSelected 
                        ? 'border-blue-500 shadow-lg shadow-blue-500/40 ring-2 ring-cyan-400/40 scale-102' 
                        : 'border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={thumb.url} 
                      alt={thumb.label} 
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform" 
                    />
                    <span className="absolute bottom-1.5 inset-x-1.5 bg-slate-950/85 backdrop-blur-md text-white font-['Oswald',sans-serif] text-[9px] font-bold py-0.5 rounded-lg text-center truncate uppercase tracking-wider border border-white/10">
                      {thumb.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 3 Luxury Value Pillars below Thumbnails */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="luxury-glass-card rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">water_drop</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase text-white leading-none">Micro-Pores</span>
                  <span className="text-[11px] text-slate-400 mt-1">Instant Sweat Tack</span>
                </div>
              </div>

              <div className="luxury-glass-card rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">layers</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase text-white leading-none">Cushion Core</span>
                  <span className="text-[11px] text-slate-400 mt-1">Sponge Tack Backing</span>
                </div>
              </div>

              <div className="luxury-glass-card rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase text-white leading-none">Honored Spec</span>
                  <span className="text-[11px] text-slate-400 mt-1">100% Wound Butyl</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LUXURY PRODUCT PANEL & PURCHASE CONTROLS (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col gap-6 luxury-glass-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/15">
            <div>
              <span className="font-['Oswald',sans-serif] text-xs font-bold text-amber-400 tracking-[0.2em] uppercase block mb-1.5 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                HAUTE ATELIER HARDWOOD SERIES
              </span>
              <h1 className="font-['Oswald',sans-serif] text-3xl sm:text-4xl uppercase text-white font-extrabold leading-tight tracking-tight drop-shadow-sm">
                KINETIC PRO GRIP COMPOSITE BASKETBALL
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Micro-Porous Moisture-Channeling Grip Architecture engineered for maximum fingertip leverage and true spherical trajectory.
              </p>
            </div>

            {/* Ratings & Social Proof */}
            <div className="flex items-center gap-3 py-3 border-y border-white/10">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-['Oswald',sans-serif] text-sm font-bold text-white">4.9</span>
              <span className="text-xs text-slate-400">(312 verified reviews)</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-cyan-400 font-semibold font-['Oswald',sans-serif] uppercase tracking-wider">
                98% Recommend for leagues
              </span>
            </div>

            {/* Price & Financing Block with Gold/Cyan Accents */}
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-3">
                <span className="font-['Oswald',sans-serif] text-4xl sm:text-5xl font-extrabold text-white leading-none">
                  $74.00
                </span>
                <span className="text-lg text-slate-500 line-through font-mono">
                  $88.00
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-['Oswald',sans-serif] text-xs font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider shadow-sm">
                  SAVE $14
                </span>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400 font-semibold font-['Oswald',sans-serif] tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>IN STOCK - 14 LEFT</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                or 4 interest-free payments of <strong className="text-white">$18.50</strong> with <span className="font-bold text-slate-200">Klarna</span>.
              </p>
            </div>

            {/* Official Size Selector */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-200">
                  Select Official Ball Size
                </span>
                <button 
                  onClick={() => setShowSizeModal(true)}
                  className="font-['Oswald',sans-serif] text-xs text-cyan-400 hover:text-cyan-300 font-bold uppercase underline tracking-wider"
                >
                  Size & Age Guide
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'SIZE 7', title: 'SIZE 7', sub: 'Men / Pro (29.5")' },
                  { id: 'SIZE 6', title: 'SIZE 6', sub: 'Women / Inter (28.5")' },
                  { id: 'SIZE 5', title: 'SIZE 5', sub: 'Junior (27.5")' }
                ].map((s) => {
                  const isSel = selectedSize === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSize(s.id)}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                        isSel
                          ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white border-cyan-400 shadow-lg shadow-blue-500/40 ring-1 ring-cyan-300/40 scale-102'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      <span className="font-['Oswald',sans-serif] text-base font-bold uppercase leading-none">
                        {s.title}
                      </span>
                      <span className={`text-[10px] mt-1 ${isSel ? 'text-blue-100 font-medium' : 'text-slate-400'}`}>
                        {s.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Channel Accent & Finish Swatches */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-['Oswald',sans-serif] uppercase font-bold">
                <span className="text-slate-300">Channel Accent & Finish</span>
                <span className="text-cyan-400">
                  {selectedColor === 'royal' ? 'Stealth Black + Royal Court Blue' : 'Matte Stealth Black'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedColor('royal')}
                  className={`w-9 h-9 rounded-full bg-gradient-to-tr from-slate-950 via-blue-600 to-slate-950 p-0.5 border-2 transition-all ${
                    selectedColor === 'royal' ? 'border-cyan-400 ring-2 ring-blue-500/50 scale-110 shadow-lg shadow-blue-500/40' : 'border-white/20'
                  }`}
                  title="Royal Court Blue Accent"
                />
                <button
                  onClick={() => setSelectedColor('stealth')}
                  className={`w-9 h-9 rounded-full bg-slate-950 p-0.5 border-2 transition-all ${
                    selectedColor === 'stealth' ? 'border-cyan-400 ring-2 ring-blue-500/50 scale-110 shadow-lg shadow-blue-500/40' : 'border-white/20'
                  }`}
                  title="Matte Stealth Black"
                />
                <button
                  onClick={() => setSelectedColor('slate')}
                  className={`w-9 h-9 rounded-full bg-slate-500 p-0.5 border-2 transition-all ${
                    selectedColor === 'slate' ? 'border-cyan-400 ring-2 ring-blue-500/50 scale-110 shadow-lg shadow-blue-500/40' : 'border-white/20'
                  }`}
                  title="Graphite Grey"
                />
              </div>
            </div>

            {/* ADORABLE & LUXURY FEATURE: COMPLIMENTARY HARDWOOD VAULT PRESENTATION BOX */}
            <div 
              onClick={() => setIncludeGiftBox(!includeGiftBox)}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-blue-500/5 to-transparent border border-amber-400/30 flex items-center justify-between gap-3 cursor-pointer hover:border-amber-400/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase text-white flex items-center gap-1.5">
                    <span>Complimentary Hardwood Vault Case</span>
                    <span className="text-[10px] text-amber-400 font-mono">(FREE $35 VALUE)</span>
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Includes matte black magnetic presentation box & velvet ball sack
                  </span>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                includeGiftBox ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-white/30'
              }`}>
                {includeGiftBox && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Quantity Selector + Big Luxury CTA Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Box */}
                <div className="flex items-center border border-white/15 rounded-2xl bg-white/5 p-1 shrink-0">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-['Oswald',sans-serif] font-bold text-sm text-white">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-['Oswald',sans-serif] text-base font-extrabold uppercase py-4 px-6 rounded-2xl transition-all shadow-xl shadow-blue-500/35 hover:shadow-cyan-500/50 flex items-center justify-center gap-2 group tracking-wider border border-white/20"
                >
                  <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>ADD TO CART — ${(74.00 * quantity).toFixed(2)}</span>
                </button>

                {/* Wishlist Heart */}
                <button
                  onClick={() => {
                    setIsWishlisted(!isWishlisted);
                    showToast(isWishlisted ? 'Removed from wishlist' : 'Saved to locker wishlist');
                  }}
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors shrink-0 ${
                    isWishlisted 
                      ? 'bg-rose-500/20 border-rose-400/50 text-rose-400 shadow-lg shadow-rose-500/20' 
                      : 'bg-white/5 border-white/15 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* 1-Click Fast Checkout Button */}
              <button
                onClick={handleBuyNow}
                className="w-full bg-slate-950 hover:bg-slate-900 text-white font-['Oswald',sans-serif] text-sm font-bold uppercase py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 tracking-wider border border-white/15 hover:border-amber-400/40 shadow-lg"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-400">bolt</span>
                <span>BUY NOW WITH 1-CLICK INSTANT DISPATCH</span>
              </button>
            </div>

            {/* Logistics & Court Trial Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center font-['Inter',sans-serif]">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-cyan-400 mb-1" />
                <span className="text-[11px] font-bold text-white leading-tight">Free Express</span>
                <span className="text-[10px] text-slate-400">on orders {'>'}$75</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-[11px] font-bold text-white leading-tight">30-Day Court Trial</span>
                <span className="text-[10px] text-slate-400">Real game play</span>
              </div>
              <div className="flex flex-col items-center">
                <Gauge className="w-4 h-4 text-indigo-400 mb-1" />
                <span className="text-[11px] font-bold text-white leading-tight">Pre-Calibrated</span>
                <span className="text-[10px] text-slate-400">8.0 PSI ready</span>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
            PRO SLIP CALIBRATION: FREQUENTLY BOUGHT TOGETHER BUNDLE CARD
            ========================================================================= */}
        <section className="w-full luxury-glass-card rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl mb-16">
          <div className="mb-4">
            <span className="font-['Oswald',sans-serif] text-xs font-bold text-cyan-400 tracking-wider uppercase block">
              PRO SLIP CALIBRATION
            </span>
            <h3 className="font-['Oswald',sans-serif] text-2xl font-bold uppercase text-white leading-none">
              FREQUENTLY BOUGHT TOGETHER
            </h3>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-2">
            {/* 3 Items with plus signs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-1">
              {/* Item 1 */}
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl flex-1 min-w-[160px]">
                <img 
                  src={galleryImages[0].url} 
                  alt="Pro Grip Ball" 
                  className="w-14 h-14 object-contain bg-slate-950 rounded-xl p-1 border border-white/10"
                />
                <div className="flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-[10px] text-cyan-400 font-bold uppercase">THIS ITEM</span>
                  <span className="font-['Oswald',sans-serif] text-xs font-bold text-white uppercase">Pro Grip Ball</span>
                  <span className="font-['Oswald',sans-serif] text-sm font-bold text-white mt-0.5">$74.00</span>
                </div>
              </div>

              <span className="text-slate-500 font-bold text-xl">+</span>

              {/* Item 2 */}
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl flex-1 min-w-[160px]">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTRmxivhzkzTtL23uDHgWgneTQRX_zUhLNYqI-IY_4NQmkjbpuxlaFF_IluXfe5WgYmKeNOuhzVFR27U9T-p-XL_-JFyyg45QU3OUC1NOFVi9756RBzyEqQgy2eaUyMAKmxAXtJ3LjX3zym7JFxLTPR7YefzliHZ05kIBXxLA-jbsXXNbt4-vxxBoIU_x5WUejq3pbLihbvyAhRR4wdaBHr8HEE-UbZAbfIghsLMZwnfCeRKbYSiJ-1Q" 
                  alt="Dual Action Pump" 
                  className="w-14 h-14 object-cover bg-slate-950 rounded-xl border border-white/10"
                />
                <div className="flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-[10px] text-slate-400 font-bold uppercase">ACCESSORY</span>
                  <span className="font-['Oswald',sans-serif] text-xs font-bold text-white uppercase">Dual Action Gauge Pump</span>
                  <span className="font-['Oswald',sans-serif] text-sm font-bold text-white mt-0.5">$18.00</span>
                </div>
              </div>

              <span className="text-slate-500 font-bold text-xl">+</span>

              {/* Item 3 */}
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl flex-1 min-w-[160px]">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-D1n8FojkCn-fmy2uT4OtSYyvHm1v55_RXSpjJXsId_wj26EqraRzvTyEzfgXKES-iN9-OdebCEcjD6sR_TuElzue-YJN0vAh0dQMgdYmoi4NpY6SJYvnc5nCv_3MMJMrs_4-r15_6OxIFTbppws1HvAha7SHfvmijDaJpl7myZCsLAO6Bz5367f5UN2JaO5_b5WhBfBN4lN0KmWQEJxKq4B4f4edZ8Thw8d3yTzHOaJUbCFM2XXspg" 
                  alt="Kinetic Grip Sleeve" 
                  className="w-14 h-14 object-cover bg-slate-950 rounded-xl border border-white/10"
                />
                <div className="flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-[10px] text-slate-400 font-bold uppercase">ARM GEAR</span>
                  <span className="font-['Oswald',sans-serif] text-xs font-bold text-white uppercase">Kinetic Grip Sleeve</span>
                  <span className="font-['Oswald',sans-serif] text-sm font-bold text-white mt-0.5">$36.00</span>
                </div>
              </div>
            </div>

            {/* Total Price & Add All Button */}
            <div className="flex flex-col items-center lg:items-end gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
              <div className="flex items-baseline gap-2">
                <span className="font-['Oswald',sans-serif] text-3xl font-extrabold text-white">$115.00</span>
                <span className="text-sm text-slate-500 line-through font-mono">$128.00</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">Bundle saves you $13.00 instantly</span>
              <button
                onClick={handleAddBundle}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-['Oswald',sans-serif] text-sm font-bold uppercase px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 tracking-wider mt-1 border border-white/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD 3-ITEM BUNDLE TO CART</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            RELATED COURT GEAR & ACCESSORIES (4 COMPLEMENTARY HARDWARE CARDS)
            ========================================================================= */}
        <section className="mb-16">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <span className="font-['Oswald',sans-serif] text-xs font-bold text-cyan-400 tracking-wider uppercase block">
                COMPLEMENTARY HARDWARE
              </span>
              <h3 className="font-['Oswald',sans-serif] text-2xl sm:text-3xl font-bold uppercase text-white leading-none">
                RELATED COURT GEAR & ACCESSORIES
              </h3>
            </div>
            <button 
              onClick={() => {
                navigateTo('kinetic-main');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-['Oswald',sans-serif] text-xs text-cyan-400 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <span>VIEW FULL EQUIPMENT LOCKER</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'knt-spray-200',
                tag: 'TRACTION ENHANCER',
                title: 'Kinetic Court Grip Spray (200ml)',
                desc: 'Eliminates dust and restores court traction for shoes and ball palms.',
                rating: '4.9',
                reviews: '(142)',
                price: 24.00,
                status: 'IN STOCK',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9L3ZmYQp96vADB7mYPf0-f-gpaq32R1oRtdNiCQ-iIwnoH_TcLkdUdTgu4QzmFEAxn4FI5Wm1_8l-HnOQkHUPP6bLWguNabWObFyZJxyPIC7tcKzH90-nmM-AXC2aUpsOB6De7m7q6uBd7cFJX7CQ-cDoPEikzjYRocC2A3IcKhS6AUQY_NT4862tIU3XXjvN5NNuDcUw9DpbTd2ZF0MTvIY9ZDzNINoo97R2NLTYMxeCCz8OEAy2xA'
              },
              {
                id: 'knt-gauge-01',
                tag: 'PSI CALIBRATION',
                title: 'Kinetic Dual Action Digital Pressure Gauge',
                desc: 'Pressure LED readout with quick air bleed release valve.',
                rating: '4.8',
                reviews: '(98)',
                price: 32.00,
                status: 'IN STOCK',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMCD0ioJesMTlcwECiCDSSIjhQKQt8SQggX83W0iabABuDP8DTBtWexCSiv9VjvGHEeMcUi9Atjo2xUMWY275y5ON61v-Bt3NUNFnn5o_v6tSr1njMf6i3g3Z-T4x6IJWQBvgoNZlAMtZu18llr6XEvn1zUcZMJtpUhkb_Kg9vn05vyNDBrmH7psXx5QB9Qe6sNDsM17HzRMveHxIw2h5_EfiAhwW3KBILz5pGX8g0CwL-pFVK8Xfqcw'
              },
              {
                id: 'knt-arm-slv',
                tag: 'RECOVERY',
                title: 'Pro Performance Compression Arm Sleeve',
                desc: 'Muscle warming display and anti-chafing compression.',
                rating: '4.9',
                reviews: '(194)',
                price: 28.00,
                status: '11 LEFT',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-D1n8FojkCn-fmy2uT4OtSYyvHm1v55_RXSpjJXsId_wj26EqraRzvTyEzfgXKES-iN9-OdebCEcjD6sR_TuElzue-YJN0vAh0dQMgdYmoi4NpY6SJYvnc5nCv_3MMJMrs_4-r15_6OxIFTbppws1HvAha7SHfvmijDaJpl7myZCsLAO6Bz5367f5UN2JaO5_b5WhBfBN4lN0KmWQEJxKq4B4f4edZ8Thw8d3yTzHOaJUbCFM2XXspg'
              },
              {
                id: 'knt-target-net',
                tag: 'SHOOTING ACCURACY',
                title: 'Precision Rim Target Net & Training Marker',
                desc: 'Visual arc calibrator and swish-feedback chain net.',
                rating: '4.7',
                reviews: '(85)',
                price: 19.00,
                status: 'IN STOCK',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTRmxivhzkzTtL23uDHgWgneTQRX_zUhLNYqI-IY_4NQmkjbpuxlaFF_IluXfe5WgYmKeNOuhzVFR27U9T-p-XL_-JFyyg45QU3OUC1NOFVi9756RBzyEqQgy2eaUyMAKmxAXtJ3LjX3zym7JFxLTPR7YefzliHZ05kIBXxLA-jbsXXNbt4-vxxBoIU_x5WUejq3pbLihbvyAhRR4wdaBHr8HEE-UbZAbfIghsLMZwnfCeRKbYSiJ-1Q'
              }
            ].map((prod) => (
              <div key={prod.id} className="luxury-glass-card luxury-glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group shadow-xl">
                <div className="relative aspect-square bg-slate-950 p-4 flex items-center justify-center overflow-hidden border-b border-white/10">
                  <span className="absolute top-3 left-3 z-10 bg-slate-950/90 backdrop-blur-md text-white font-['Oswald',sans-serif] text-[9px] font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider border border-white/15">
                    {prod.tag}
                  </span>
                  <img 
                    src={prod.img} 
                    alt={prod.title} 
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform" 
                  />
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-bold mb-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-white">{prod.rating}</span>
                      <span className="text-slate-400 font-normal">{prod.reviews}</span>
                    </div>
                    <h4 className="font-['Oswald',sans-serif] text-base uppercase text-white font-bold group-hover:text-cyan-400 transition-colors leading-snug">
                      {prod.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {prod.desc}
                    </p>
                  </div>

                  <div className="pt-3.5 mt-3.5 flex items-center justify-between border-t border-white/10">
                    <div className="flex flex-col">
                      <span className="font-['Oswald',sans-serif] text-xl font-extrabold text-white">
                        ${prod.price.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-emerald-400 font-bold uppercase">{prod.status}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (onAddToCart) {
                          onAddToCart({
                            id: prod.id,
                            title: prod.title,
                            price: prod.price,
                            image: prod.img,
                            sku: prod.id.toUpperCase(),
                            spec: prod.tag,
                            size: 'STANDARD',
                            quantity: 1
                          });
                        }
                        showToast(`Added ${prod.title} to locker!`);
                      }}
                      className="bg-blue-600 hover:bg-cyan-500 text-white font-['Oswald',sans-serif] text-[11px] uppercase font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1 shadow-md shadow-blue-500/25 border border-white/15"
                    >
                      <Plus className="w-3 h-3" />
                      <span>QUICK ADD</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            VERIFIED GAME TELEMETRY: ATHLETE FIELD REPORTS
            ========================================================================= */}
        <section className="luxury-glass-card rounded-3xl border border-white/15 p-6 sm:p-10 shadow-2xl mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="font-['Oswald',sans-serif] text-xs font-bold text-cyan-400 tracking-wider uppercase block">
                VERIFIED GAME TELEMETRY
              </span>
              <h3 className="font-['Oswald',sans-serif] text-2xl sm:text-3xl font-bold uppercase text-white leading-none">
                ATHLETE FIELD REPORTS
              </h3>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 font-['Oswald',sans-serif] text-xs uppercase font-bold">
              {[
                { id: 'all', label: 'All Reviews (312)' },
                { id: 'hardwood', label: 'Hardwood Regs (218)' },
                { id: 'outdoor', label: 'Outdoor Tarmac (94)' },
                { id: 'ncaa', label: 'NCAA Verified (46)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setReviewTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl border transition-all ${
                    reviewTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-cyan-400 shadow-md shadow-blue-500/30'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Review Cards with Luxury Quote Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Review 1 */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">3 DAYS AGO</span>
                </div>
                <h4 className="font-['Oswald',sans-serif] text-sm font-bold uppercase text-white mb-2 tracking-wide">
                  BEST RELEASE CONSISTENCY I HAVE EXPERIENCED
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  “We run intense 5v5 runs where normal game balls get slippery by the third quarter. This composite pebble never let go, literally drinks up sweat. Never felt such a clean release arc.”
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 text-cyan-300 font-bold flex items-center justify-center text-xs">
                  MJ
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    Marcus Jenkins
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  </span>
                  <span className="text-[10px] text-slate-400">Varsity Point Guard • Austin, TX</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">1 WEEK AGO</span>
                </div>
                <h4 className="font-['Oswald',sans-serif] text-sm font-bold uppercase text-white mb-2 tracking-wide">
                  HELD UP BEAUTIFULLY ON ROUGH NYC CONCRETE
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  “Most composite balls get shredded within a week at Rucker Park city courts. This exterior skin has zero peeling zero scuffing after 10 outdoor games. The deep seam channel is top tier.”
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 text-cyan-300 font-bold flex items-center justify-center text-xs">
                  TR
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    Tyrese Roy
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  </span>
                  <span className="text-[10px] text-slate-400">Streetball Comp Player • Brooklyn, NY</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">2 WEEKS AGO</span>
                </div>
                <h4 className="font-['Oswald',sans-serif] text-sm font-bold uppercase text-white mb-2 tracking-wide">
                  PERFECT WEIGHT AND ROTATION FEEDBACK
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  “The high-contrast orange channels make analyzing ball rotation on shooting reps effortlessly effortless. In addition, perfectly inflated at 8.0 PSI ready out of the box.”
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 text-cyan-300 font-bold flex items-center justify-center text-xs">
                  SS
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    Coach Sarah Stein
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  </span>
                  <span className="text-[10px] text-slate-400">Academy Head Coach • Chicago, IL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <span className="text-xs text-slate-400">Displaying 3 of 312 verified customer ratings</span>
            <button 
              onClick={() => showToast('Loaded all 312 verified player reviews')}
              className="px-6 py-2.5 rounded-xl border border-white/15 hover:border-cyan-400 font-['Oswald',sans-serif] text-xs font-bold uppercase text-white transition-colors tracking-wider"
            >
              READ ALL 312 REVIEWS
            </button>
          </div>
        </section>

      </main>

      {/* =========================================================================
          COMPREHENSIVE LUXURY HAUTE ATELIER FOOTER
          ========================================================================= */}
      <footer className="w-full bg-[#03040a] border-t border-white/10 pt-16 pb-12 font-['Inter',sans-serif]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-cyan-400 text-white flex items-center justify-center font-['Oswald',sans-serif] font-bold text-xl border border-white/20">
                  K
                </div>
                <span className="font-['Oswald',sans-serif] text-2xl font-extrabold uppercase text-white tracking-tight">
                  KINETIC HOOPS ATELIER
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Precision-engineered basketball and court accessories tested by elite athletes. Built for raw momentum, structural durability, and ruthless performance.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-['Oswald',sans-serif] text-[10px] font-bold uppercase">
                  FIBA SPEC VERIFIED
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-['Oswald',sans-serif] text-[10px] font-bold uppercase">
                  24-HOUR DISPATCH
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-['Oswald',sans-serif] text-[10px] font-bold uppercase">
                  100% SECURE
                </span>
              </div>
            </div>

            {/* Col 2: Categories */}
            <div className="flex flex-col gap-3">
              <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase text-white tracking-wider">
                SHOP CATEGORIES
              </span>
              <ul className="flex flex-col gap-2 text-xs text-slate-400">
                <li className="hover:text-cyan-400 cursor-pointer transition-colors">Game Balls & Tack Grips</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors">Arm & Leg Sleeves</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors">Knee Stability Braces</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors">Shooting Targets & Cones</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors">Ventilated Court Duffles</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors">Electrolyte Flasks</li>
              </ul>
            </div>

            {/* Col 3: Support */}
            <div className="flex flex-col gap-3">
              <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase text-white tracking-wider">
                ATHLETE SUPPORT
              </span>
              <ul className="flex flex-col gap-2 text-xs text-slate-400">
                <li className="hover:text-cyan-400 cursor-pointer transition-colors">Order Tracking</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors">30-Day Court Trial</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors">Warranty & Replacements</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors">Size & Fit Telemetry</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors">Bulk Academy Orders</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors">Contact Gear Support</li>
              </ul>
            </div>

            {/* Col 4: VIP Newsletter with Gold Shimmer */}
            <div className="flex flex-col gap-3">
              <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                KINETIC VIP VAULT
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive 15% off first equipment order and reserved early-access drop alerts.
              </p>
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="email" 
                  placeholder="Enter athlete email" 
                  className="w-full px-3.5 py-2 text-xs bg-white/5 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button 
                  onClick={() => showToast('Subscribed to VIP court alerts!')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-['Oswald',sans-serif] text-xs font-bold uppercase px-4 py-2 rounded-xl hover:from-blue-500 hover:to-cyan-400 transition-all shrink-0 shadow-md shadow-blue-500/25 border border-white/20"
                >
                  JOIN
                </button>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">Strictly zero spam. Unsubscribe anytime.</span>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span>© 2025 Kinetic Hoops Haute Atelier. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-300 cursor-pointer">Privacy Protocol</span>
              <span>•</span>
              <span className="hover:text-slate-300 cursor-pointer">Terms of Play</span>
              <span>•</span>
              <span className="hover:text-slate-300 cursor-pointer">Compliance</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Size & Age Guide Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1026] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/15 relative">
            <button 
              onClick={() => setShowSizeModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Info className="w-5 h-5" />
              <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase tracking-wider">OFFICIAL TELEMETRY</span>
            </div>
            <h3 className="font-['Oswald',sans-serif] text-2xl font-bold uppercase text-white mb-4">
              BALL SIZING & AGE BRACKETS
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-2xl">
                <div className="flex justify-between items-center font-['Oswald',sans-serif] font-bold text-white">
                  <span>SIZE 7 (29.5" CIRCUMFERENCE)</span>
                  <span className="text-cyan-400">MEN / PRO / AGES 15+</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">Official regulation size for NBA, FIBA, NCAA, and high school varsity.</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex justify-between items-center font-['Oswald',sans-serif] font-bold text-white">
                  <span>SIZE 6 (28.5" CIRCUMFERENCE)</span>
                  <span className="text-slate-300">WOMEN / AGES 12–14</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Official regulation size for WNBA, FIBA Women, and middle school boys.</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex justify-between items-center font-['Oswald',sans-serif] font-bold text-white">
                  <span>SIZE 5 (27.5" CIRCUMFERENCE)</span>
                  <span className="text-slate-300">JUNIOR / AGES 9–11</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Standard youth training ball for proper shooting form mechanics.</p>
              </div>
            </div>
            <button
              onClick={() => setShowSizeModal(false)}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-['Oswald',sans-serif] text-sm font-bold uppercase py-3.5 rounded-2xl hover:from-blue-500 hover:to-cyan-400 transition-colors shadow-lg shadow-blue-500/30 border border-white/20"
            >
              GOT IT • RETURN TO GEAR
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase tracking-wider">
            {toastMessage}
          </span>
        </div>
      )}
    </div>
  );
}
