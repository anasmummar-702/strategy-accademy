import React, { useState, useEffect } from 'react';
import { 
  X, Star, ShoppingCart, Heart, ShieldCheck, Check, 
  Truck, RotateCcw, Share2, Award, Zap, Ruler, 
  ChevronRight, ArrowRight, CheckCircle2, Sparkles, AlertCircle
} from 'lucide-react';

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  onOpenCart
}) {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('features'); // 'features' | 'specs' | 'shipping'
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Sync state when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : null);
      setActiveImageIdx(0);
      setQuantity(1);
      setActiveTab('features');
      setShowSizeGuide(false);
    }
  }, [product]);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || '/images/strategy_basketball_ball.jpg'];

  const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
  const oldPrice = typeof product.oldPrice === 'number' ? product.oldPrice : parseFloat(product.oldPrice) || 0;
  const savings = oldPrice > price ? oldPrice - price : 0;
  const installment = (price / 4).toFixed(2);

  const handleAdd = (openCartImmediately = false) => {
    if (onAddToCart) {
      onAddToCart({
        ...product,
        price,
        quantity,
        selectedSize,
        selectedColor
      });
    }

    if (openCartImmediately && onOpenCart) {
      onClose();
      onOpenCart();
    } else {
      setAddedToast(true);
      setTimeout(() => {
        setAddedToast(false);
        onClose();
      }, 900);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      
      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-900 my-auto flex flex-col lg:flex-row max-h-[92vh]"
      >
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/90 hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 shadow-md transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= LEFT COLUMN: MEDIA & TRUST PERKS ================= */}
        <div className="lg:w-1/2 bg-slate-50/70 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 overflow-y-auto">
          
          <div>
            {/* Top Badges Strip */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                  {product.sport || 'STRATEGY'} • {product.category || 'GEAR'}
                </span>
                {product.isSpecialEdition && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 text-amber-300">
                    SPECIAL EDITION
                  </span>
                )}
                {savings > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                    SAVE ${savings.toFixed(0)}
                  </span>
                )}
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer text-xs flex items-center gap-1 font-bold"
                title="Share product link"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            {/* Main Showcase Image Viewport */}
            <div className="relative aspect-square w-full rounded-2xl bg-white border border-slate-200/80 p-6 flex items-center justify-center shadow-xs overflow-hidden group">
              <img
                src={images[activeImageIdx] || images[0]}
                alt={product.name}
                className="max-h-[320px] w-full object-contain select-none transition-transform duration-300 group-hover:scale-105"
              />

              {/* In-Stock Floating Pill */}
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>In Stock • Ready to Dispatch</span>
              </div>
            </div>

            {/* Thumbnails strip */}
            {images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-xl p-1.5 bg-white border cursor-pointer transition-all shrink-0 ${
                      activeImageIdx === idx 
                        ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md' 
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Trust Guarantees Grid */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 grid grid-cols-2 gap-3 text-left">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Free UAE delivery over $150</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>1-Year Official Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
              <span>30-Day Easy Exchange</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <Award className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Tournament Certified</span>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: PRODUCT INTELLIGENCE & CTAs ================= */}
        <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          
          <div className="space-y-4">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>STRATEGY</span>
              <ChevronRight className="w-3 h-3" />
              <span>{product.sport || 'SPORTS'}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-blue-600 font-black truncate">{product.category || 'GEAR'}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Price & Rating Row */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
                  ${price.toFixed(2)}
                </span>
                {oldPrice > price && (
                  <span className="text-sm sm:text-base text-slate-400 line-through">
                    ${oldPrice.toFixed(2)}
                  </span>
                )}
                {savings > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Save {Math.round((savings / oldPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/80">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-black">{product.rating || '4.9'}</span>
                <span className="text-slate-400">({product.reviewsCount || 128})</span>
              </div>
            </div>

            {/* BNPL Installment Banner */}
            <div className="px-3.5 py-2 rounded-xl bg-blue-50/70 border border-blue-200/70 flex items-center justify-between text-xs text-blue-950 font-medium">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Or 4 interest-free payments of <strong>${installment}</strong>
              </span>
              <span className="text-[10px] font-black uppercase text-blue-700">Tabby / Tamara</span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {product.description || 'Championship-grade athletic equipment crafted with high-durability composites, precision aerodynamic balance, and maximum comfort.'}
            </p>

            {/* Size Selector with Size Guide Trigger */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Select Size: <strong className="text-blue-600">{selectedSize}</strong>
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-2 ring-blue-600/30'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Inline Size Guide Modal */}
                {showSizeGuide && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs animate-fade-in">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200 mb-2 font-bold text-slate-800">
                      <span>STRATEGY International Sizing Metric</span>
                      <button 
                        onClick={() => setShowSizeGuide(false)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                      <div className="p-1 rounded bg-white font-bold text-slate-700">US: 8 - 12</div>
                      <div className="p-1 rounded bg-white font-bold text-slate-700">UK: 7.5 - 11</div>
                      <div className="p-1 rounded bg-white font-bold text-slate-700">EU: 41 - 46</div>
                      <div className="p-1 rounded bg-white font-bold text-slate-700">CM: 26 - 30</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Colorway Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Colorway: <strong className="text-blue-600">{selectedColor}</strong>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedColor === color
                          ? 'border-2 border-blue-600 bg-blue-50 text-blue-700 font-black'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {selectedColor === color && <Check className="w-3 h-3 text-blue-600" />}
                      <span>{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Quantity:
              </span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer rounded-l-xl font-bold"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 text-xs font-black text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer rounded-r-xl font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-400">
                Total: <strong className="text-slate-900">${(price * quantity).toFixed(2)}</strong>
              </span>
            </div>

            {/* Interactive Tabs for Deep Specs */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex border-b border-slate-200 gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                <button
                  onClick={() => setActiveTab('features')}
                  className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'features' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'specs' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'
                  }`}
                >
                  Specs
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'shipping' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'
                  }`}
                >
                  Delivery
                </button>
              </div>

              <div className="py-2.5 text-xs text-slate-600 leading-relaxed">
                {activeTab === 'features' && (
                  <ul className="space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Biomechanical testing for optimal grip and explosive propulsion.</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Reinforced wear zones with tournament-certified durability.</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Moisture-wicking, anti-abrasion and breathable construction.</span>
                    </li>
                  </ul>
                )}
                {activeTab === 'specs' && (
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">Standard</span>
                      <strong className="text-slate-800">FIBA / ISO Athletic Compliant</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">Primary Material</span>
                      <strong className="text-slate-800">Premium MicroDry Composite</strong>
                    </div>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <p className="text-[11px] text-slate-600">
                    Dispatched from our Dubai Logistics Hub within 24 hours. Free delivery across UAE on orders exceeding $150. GCC express shipping 3-5 days.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Action CTAs (Sticky at bottom of right column) */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
            
            {/* Primary Add to Cart */}
            <button
              onClick={() => handleAdd(false)}
              className="w-full sm:flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{addedToast ? 'Added to Cart!' : 'Add to Cart'}</span>
            </button>

            {/* Buy Now Express */}
            <button
              onClick={() => handleAdd(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-colors cursor-pointer shrink-0"
            >
              Buy Now
            </button>

            {/* Wishlist Toggle Button */}
            <button
              onClick={() => onToggleWishlist && onToggleWishlist(product)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-rose-500 hover:bg-rose-50'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

          </div>

        </div>

      </div>

      {/* Instant Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Added to your STRATEGY cart!</span>
        </div>
      )}

    </div>
  );
}
