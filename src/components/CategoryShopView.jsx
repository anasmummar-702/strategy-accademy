import React, { useState, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal, Search, Sparkles, Check } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import ProductCard from './ProductCard';
import WishlistDrawer from './WishlistDrawer';
import SearchOverlay from './SearchOverlay';
import { productsData } from '../data/products';
import { publicApi } from '../services/api';
import { getBannerForFilter } from '../services/bannerConfigService';

export default function CategoryShopView({
  filterType = 'all', // 'all' | 'basketball' | 'football' | 'running' | 'men' | 'women' | 'kids' | 'special-edition'
  navigateTo,
  onAddToCart,
  totalCartCount = 0,
  onOpenCart
}) {
  const [productsList, setProductsList] = useState(productsData);
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch live published products from backend API
  useEffect(() => {
    publicApi
      .getProducts()
      .then((res) => {
        if (res && res.products && res.products.length > 0) {
          setProductsList(res.products);
        }
      })
      .catch((err) => {
        console.warn('CategoryShopView static fallback:', err.message);
      });
  }, []);

  // Initialize wishlist from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('strategy_wishlist_items');
      if (saved) setWishlistItems(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const handleToggleWishlist = (product) => {
    if (!product) return;
    const exists = wishlistItems.some((i) => i.id === product.id);
    const updated = exists
      ? wishlistItems.filter((i) => i.id !== product.id)
      : [...wishlistItems, product];
    setWishlistItems(updated);
    try {
      localStorage.setItem('strategy_wishlist_items', JSON.stringify(updated));
    } catch (e) {}
  };

  const wishlistedIds = wishlistItems.map((i) => i.id);

  const handleSelectProduct = (product) => {
    if (!product) return;
    if (navigateTo) {
      navigateTo(`product-${product.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset active filter selections and scroll to top when category route changes
  useEffect(() => {
    setSelectedSport('all');
    setSelectedGender('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filterType]);

  // Compute filtered products
  const filteredProducts = useMemo(() => {
    return productsList.filter((item) => {
      // 1. Initial page filter
      if (filterType === 'special-edition' && !item.isSpecialEdition) return false;
      if (filterType === 'shop-new' && !item.isNew && !item.isNewArrival) return false;
      if (filterType === 'shop-best' && !item.isBestSeller) return false;
      if (filterType.startsWith('category-')) {
        const cat = filterType.replace('category-', '').toLowerCase();
        if (item.sport.toLowerCase() !== cat && item.category.toLowerCase() !== cat) return false;
      }
      if (filterType.startsWith('gender-')) {
        const gen = filterType.replace('gender-', '').toLowerCase();
        if (item.gender !== gen && item.gender !== 'unisex') return false;
      }
      if (filterType === 'men' && item.gender !== 'men' && item.gender !== 'unisex') return false;
      if (filterType === 'women' && item.gender !== 'women' && item.gender !== 'unisex') return false;
      if (filterType === 'kids' && item.gender !== 'kids') return false;

      // 2. Interactive Sport filter
      if (selectedSport !== 'all' && item.sport.toLowerCase() !== selectedSport.toLowerCase()) {
        return false;
      }

      // 3. Interactive Gender filter
      if (selectedGender !== 'all' && item.gender !== selectedGender) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default featured
    });
  }, [productsList, filterType, selectedSport, selectedGender, sortBy]);

  const [, setBannersVersion] = useState(0);

  useEffect(() => {
    const handleBannersUpdate = () => {
      setBannersVersion((v) => v + 1);
    };
    window.addEventListener('strategy-banners-updated', handleBannersUpdate);
    return () => window.removeEventListener('strategy-banners-updated', handleBannersUpdate);
  }, []);

  const getBannerDetails = () => {
    return getBannerForFilter(filterType);
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      
      {/* Sticky Navbar */}
      <Navbar
        activeTab={filterType}
        navigateTo={navigateTo}
        cartCount={totalCartCount}
        wishlistCount={wishlistItems.length}
        onOpenCart={onOpenCart}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Dynamic Full-Bleed Page Hero Banner (Fills Top Bar) */}
      {(() => {
        const banner = getBannerDetails();
        return (
          <div className="relative w-full overflow-hidden min-h-[300px] sm:min-h-[360px] flex items-end pt-28 sm:pt-36 pb-10 sm:pb-14 shadow-lg border-b border-slate-800/30">
            {/* Page Specific Background Image */}
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Dynamic Theme Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />

            {/* Top gradient shadow for Navbar readability & seamless blending */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

            {/* Halftone Dot Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px'}} 
            />

            {/* Ambient Glowing Orb */}
            <div className={`absolute -right-12 -bottom-12 w-96 h-96 rounded-full blur-3xl pointer-events-none ${banner.glow}`} />

            {/* Banner Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <span className={`inline-flex items-center px-3.5 py-1 rounded-full border text-xs font-black tracking-widest uppercase mb-3 backdrop-blur-md shadow-sm ${banner.badgeStyle}`}>
                  {banner.badge}
                </span>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white drop-shadow-md">
                  {banner.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-200 font-medium mt-2.5 leading-relaxed max-w-xl drop-shadow-sm">
                  {banner.subtitle}
                </p>
              </div>

              {/* Item Counter Badge on Banner */}
              <div className="sm:self-end">
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-sm">
                  Showing {filteredProducts.length} items
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="py-8 pb-16 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Filter & Sort Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          
          {/* Quick Sport Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['all', 'Basketball', 'Football', 'Running', 'Training', 'Skating', 'Fitness', 'Tennis', 'Cricket'].map((sp) => (
              <button
                key={sp}
                onClick={() => setSelectedSport(sp.toLowerCase())}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedSport.toLowerCase() === sp.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sp === 'all' ? 'All Sports' : sp}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-100 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onSelectProduct={handleSelectProduct}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlistedIds.includes(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-base font-bold text-slate-800">
              No products match your selected filters.
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Try resetting the sport filter to view more items.
            </p>
            <button
              onClick={() => {
                setSelectedSport('all');
                setSelectedGender('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      <Footer onNavigate={navigateTo} />

      {/* Modals & Overlays */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={(item) => {
          if (onAddToCart) onAddToCart(item);
          handleToggleWishlist(item);
        }}
        onSelectProduct={handleSelectProduct}
        navigateTo={navigateTo}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => handleSelectProduct(p)}
        onSelectCategory={(cat) => setSelectedSport(cat.toLowerCase())}
      />

    </div>
  );
}
