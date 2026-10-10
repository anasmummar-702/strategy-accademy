import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, Heart, ShoppingBag, ShoppingCart, 
  ShieldCheck, Truck, RotateCcw, Check, Share2, 
  Zap, ChevronRight, Ruler, Award, Sparkles, 
  Plus, Minus, Lock, CheckCircle2, X
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import ProductCard from './ProductCard';
import WishlistDrawer from './WishlistDrawer';
import SearchOverlay from './SearchOverlay';
import { productsData } from '../data/products';

export default function ProductDetailPage({
  productId,
  product: initialProduct,
  navigateTo,
  onAddToCart,
  totalCartCount = 0,
  onOpenCart,
  wishlistItems = [],
  onToggleWishlist,
  onOpenWishlist
}) {
  // Resolve product
  const product = initialProduct || productsData.find(p => p.id === productId || p.slug === productId) || productsData[0];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs' | 'shipping' | 'reviews'
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);

  // Reset states when product changes
  useEffect(() => {
    if (product) {
      setActiveImageIdx(0);
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : null);
      setQuantity(1);
      setActiveTab('overview');
      setShowSizeGuide(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product?.id]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || '/images/strategy_basketball_ball.jpg'];

  const price = typeof product?.price === 'number' ? product.price : (parseFloat(product?.price) || (product?.priceFils ? product.priceFils / 100 : 0));
  const oldPrice = typeof product?.oldPrice === 'number' ? product.oldPrice : (parseFloat(product?.oldPrice) || 0);
  const savings = oldPrice > price ? oldPrice - price : 0;
  const installment = (price / 4).toFixed(2);
  const isWishlisted = wishlistItems.some(i => i.id === product?.id);

  // Related products from same sport or category
  const relatedProducts = productsData
    .filter(p => p.id !== product.id && (p.sport === product.sport || p.category === product.category))
    .slice(0, 4);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToCart = (openCart = false) => {
    if (onAddToCart) {
      onAddToCart({
        ...product,
        price,
        quantity,
        selectedSize,
        selectedColor
      });
    }
    showToast(`Added ${quantity}x "${product.name}" to cart!`);
    if (openCart && onOpenCart) {
      onOpenCart();
    }
  };

  const handleBuyNow = () => {
    handleAddToCart(true);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSelectRelated = (p) => {
    if (navigateTo) {
      navigateTo(`product-${p.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      
      {/* Sticky Top Navbar */}
      <Navbar
        activeTab="shop-product"
        navigateTo={navigateTo}
        cartCount={totalCartCount}
        wishlistCount={wishlistItems.length}
        onOpenCart={onOpenCart}
        onOpenWishlist={() => (onOpenWishlist ? onOpenWishlist() : setIsWishlistDrawerOpen(true))}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Product Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 sm:pb-16">
        
        {/* Navigation Breadcrumb & Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                if (navigateTo) navigateTo('shop-home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-400 transition-all shadow-2xs font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Shop</span>
            </button>
            <span className="text-slate-300">/</span>
            <button 
              onClick={() => navigateTo && navigateTo(`category-${product.sport.toLowerCase()}`)}
              className="hover:text-blue-600 uppercase transition-colors"
            >
              {product.sport}
            </button>
            <span className="text-slate-300">/</span>
            <span className="uppercase">{product.category}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-blue-600 transition-all text-xs font-bold shadow-2xs cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            PRODUCT CORE SECTION: 2-COLUMN DESKTOP (GALLERY + SPECS & PURCHASE)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-200/80 shadow-sm">
          
          {/* LEFT COLUMN: PRODUCT MEDIA GALLERY (7 COLUMNS ON DESKTOP) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Main Stage Display */}
            <div className="relative aspect-square w-full rounded-2xl bg-[#f8fafc] border border-slate-200/60 overflow-hidden flex items-center justify-center p-6 group">
              
              {/* Badges Stack */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isSpecialEdition && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r from-blue-900 to-indigo-950 text-amber-300 border border-amber-400/40 shadow-md">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    SPECIAL EDITION
                  </span>
                )}
                {product.isBestSeller && !product.isSpecialEdition && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-blue-600 text-white shadow-sm">
                    BEST SELLER
                  </span>
                )}
                {product.isNew && !product.isSpecialEdition && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-600 text-white shadow-sm">
                    NEW DROP
                  </span>
                )}
                {savings > 0 && (
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    SAVE ${savings.toFixed(2)} (-{product.discount}%)
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => onToggleWishlist && onToggleWishlist(product)}
                className={`absolute top-4 right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105'
                    : 'bg-white/95 backdrop-blur-md text-slate-500 hover:text-rose-500 hover:bg-white hover:scale-105 border border-slate-200/80'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 stroke-rose-500' : ''}`} />
              </button>

              {/* Main Product Image */}
              <img
                src={images[activeImageIdx] || images[0]}
                alt={product.name}
                className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105 select-none"
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#f8fafc] border-2 transition-all shrink-0 cursor-pointer p-1.5 ${
                      activeImageIdx === idx 
                        ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md scale-102' 
                        : 'border-slate-200/80 hover:border-blue-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Confidence Guarantees Bar Under Image */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[11px] font-bold text-slate-700">Free Express Delivery</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[11px] font-bold text-slate-700">30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[11px] font-bold text-slate-700">100% Authentic</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <Award className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[11px] font-bold text-slate-700">1-Year Warranty</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: PRODUCT SPECIFICATIONS & PURCHASE FLOW (5 COLUMNS) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Category, Sport & Ratings */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200">
                  {product.sport} • {product.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span>{product.rating || 4.9}</span>
                  <span className="text-slate-400 font-normal">({product.reviewsCount || 120} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  ${price.toFixed(2)}
                </span>
                {oldPrice > price && (
                  <span className="text-base sm:text-lg text-slate-400 line-through font-medium">
                    ${oldPrice.toFixed(2)}
                  </span>
                )}
                {savings > 0 && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                    Save ${savings.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Installment Payment Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
                <span>Or 4 interest-free payments of <strong>${installment}</strong></span>
                <span className="font-extrabold text-[10px] uppercase text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded">
                  Tabby / Tamara
                </span>
              </div>

              {/* Description Snippet */}
              <p className="text-sm text-slate-600 leading-relaxed pt-1">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>In Stock — Ships within 24 Hours from UAE Fulfillment Center</span>
              </div>

              {/* Color Selection (if available) */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>SELECT COLOR:</span>
                    <span className="text-blue-600">{selectedColor || product.colors[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          selectedColor === color
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-400/30'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection (if available) */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>SELECT SIZE:</span>
                    <button
                      type="button"
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-bold cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer border text-center ${
                          selectedSize === size
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-400/30'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Size Guide Drawer/Modal */}
              {showSizeGuide && (
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between font-bold text-blue-950">
                    <span className="flex items-center gap-1.5">
                      <Ruler className="w-4 h-4 text-blue-600" />
                      STRATEGY Official Size Calibration
                    </span>
                    <button onClick={() => setShowSizeGuide(false)} className="text-slate-400 hover:text-slate-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-600">
                    All apparel and footwear conform to official international athletics specs. If you are between sizes, we recommend ordering half a size up for training comfort.
                  </p>
                </div>
              )}

              {/* Quantity Counter */}
              <div className="pt-2">
                <span className="block text-xs font-bold text-slate-800 mb-2">QUANTITY:</span>
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center font-bold transition-colors shadow-2xs cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-black text-slate-900 font-['Outfit']">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center font-bold transition-colors shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* CTAs: Add to Cart + Buy Now */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  className="flex-1 py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-sm uppercase tracking-wider font-['Outfit'] shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart • ${(price * quantity).toFixed(2)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleWishlist && onToggleWishlist(product)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200'
                  }`}
                  title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-black active:scale-98 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Instant Checkout (Buy Now)</span>
              </button>
            </div>

          </div>

        </div>

        {/* =========================================================================
            DETAILED TABS: OVERVIEW, SPECS, SHIPPING, REVIEWS
            ========================================================================= */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Overview & Technology' },
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'shipping', label: 'Shipping & UAE Returns' },
              { id: 'reviews', label: `Customer Reviews (${product.reviewsCount || 120})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="pt-6">
            {activeTab === 'overview' && (
              <div className="space-y-4 max-w-3xl leading-relaxed text-slate-700 text-sm">
                <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                  Engineered For Elite Athletes & Demanding Sessions
                </h3>
                <p>
                  The {product.name} is constructed under the STRATEGY Athletic Standards blueprint. Combining precision materials with aerodynamic balance, it is optimized for rapid agility and long session comfort.
                </p>
                <ul className="space-y-2.5 pt-2">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Pro Performance Standard:</strong> Tested in competitive match scenarios and high-impact training drills.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Moisture-Wicking & Thermal Comfort:</strong> Dissipates sweat and maintains grip stability even in UAE climate conditions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Ergonomic Anatomical Fit:</strong> Contoured to minimize friction and prevent blisters or fatigue during intense play.</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider">Sport Discipline</span>
                  <p className="font-black text-slate-900 text-sm">{product.sport}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider">Product Category</span>
                  <p className="font-black text-slate-900 text-sm">{product.category}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider">Target Athlete</span>
                  <p className="font-black text-slate-900 text-sm capitalize">{product.gender || 'Unisex Adult & Youth'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider">Official SKU</span>
                  <p className="font-black text-slate-900 text-sm font-mono">{product.id.toUpperCase()}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider">Quality Standard</span>
                  <p className="font-black text-slate-900 text-sm">FIBA / World Skate Calibrated</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider">Warranty</span>
                  <p className="font-black text-slate-900 text-sm">12 Months Full Coverage</p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 max-w-3xl text-sm text-slate-700">
                <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                  Fast Fulfillment Across Abu Dhabi, Dubai & Worldwide
                </h3>
                <p>
                  Orders placed before 2:00 PM are processed same-day. All shipments feature real-time live SMS tracking and secure tamper-proof packaging.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70">
                    <h4 className="font-black text-blue-950 mb-1">UAE Express Delivery</h4>
                    <p className="text-xs text-slate-600">Next-day delivery anywhere in Abu Dhabi & Dubai. Same-day pickup available at Al Nahyan Arena.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <h4 className="font-black text-slate-900 mb-1">Easy 30-Day Exchange</h4>
                    <p className="text-xs text-slate-600">Wrong shoe size? Contact our concierge to swap sizes free of charge within 30 days.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-3xl">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 flex-wrap">
                  <div className="text-center sm:text-left">
                    <div className="text-4xl font-black text-slate-900 font-['Outfit']">{product.rating || 4.9}</div>
                    <div className="flex items-center text-amber-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 font-semibold mt-1 block">Based on {product.reviewsCount || 120} reviews</span>
                  </div>
                  <div className="h-12 w-px bg-slate-200 hidden sm:block mx-4" />
                  <p className="text-xs text-slate-600 max-w-md">
                    98% of verified athletes recommend this item for league play and intensive weekly sessions.
                  </p>
                </div>

                {/* Sample Verified Reviews */}
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900">Tariq M. — Verified Buyer</span>
                      <span className="text-[10px] text-slate-400">2 days ago</span>
                    </div>
                    <div className="flex items-center text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600">
                      "Unbelievable quality and build. Grip is top-tier and the fit was true to size straight out of the box."
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900">Coach David R. — Strategy Instructor</span>
                      <span className="text-[10px] text-slate-400">1 week ago</span>
                    </div>
                    <div className="flex items-center text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600">
                      "We use these gear setups across our weekly clinics. Highly durable, great materials and looks awesome."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* =========================================================================
            RELATED PRODUCTS SECTION (CLICKING ANY PRODUCT REDIRECTS DIRECTLY)
            ========================================================================= */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-blue-600">RECOMMENDED GEAR</span>
                <h2 className="text-2xl font-black font-['Outfit'] text-slate-900 tracking-tight">
                  You May Also Like
                </h2>
              </div>
              <button
                onClick={() => navigateTo && navigateTo(`category-${product.sport.toLowerCase()}`)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All {product.sport}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onAddToCart={onAddToCart}
                  onSelectProduct={handleSelectRelated}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlistItems.some(i => i.id === rel.id)}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => {
          setIsSearchOpen(false);
          handleSelectRelated(p);
        }}
        onSelectCategory={(c) => {
          setIsSearchOpen(false);
          if (navigateTo) navigateTo(`category-${c}`);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistDrawerOpen}
        onClose={() => setIsWishlistDrawerOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={onToggleWishlist}
        onMoveToCart={(item) => {
          if (onAddToCart) onAddToCart(item);
          if (onToggleWishlist) onToggleWishlist(item);
        }}
        onSelectProduct={(item) => {
          setIsWishlistDrawerOpen(false);
          handleSelectRelated(item);
        }}
      />

    </div>
  );
}
