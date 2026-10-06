import React, { useState, useMemo } from 'react';
import { ArrowLeft, Filter, SlidersHorizontal, Search, Sparkles, Check } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import ProductCard from './ProductCard';
import WishlistDrawer from './WishlistDrawer';
import SearchOverlay from './SearchOverlay';
import { productsData } from '../data/products';

export default function CategoryShopView({
  filterType = 'all', // 'all' | 'basketball' | 'football' | 'running' | 'men' | 'women' | 'kids' | 'special-edition'
  navigateTo,
  onAddToCart,
  totalCartCount = 0,
  onOpenCart
}) {
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  // Compute filtered products
  const filteredProducts = useMemo(() => {
    return productsData.filter((item) => {
      // 1. Initial page filter
      if (filterType === 'special-edition' && !item.isSpecialEdition) return false;
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
  }, [filterType, selectedSport, selectedGender, sortBy]);

  const getPageTitle = () => {
    if (filterType === 'special-edition') return 'SPECIAL EDITION VAULT';
    if (filterType.startsWith('category-')) return `${filterType.replace('category-', '').toUpperCase()} COLLECTION`;
    if (filterType.startsWith('gender-')) return `${filterType.replace('gender-', '').toUpperCase()}'S ATHLETICS`;
    if (filterType === 'men') return "MEN'S PERFORMANCE";
    if (filterType === 'women') return "WOMEN'S PERFORMANCE";
    if (filterType === 'kids') return "JUNIOR & KIDS ATHLETICS";
    if (filterType === 'sports') return "ALL SPORTS DISCIPLINES";
    return "STRATEGY PRO CATALOG";
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

      <div className="pt-24 sm:pt-28 pb-16 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateTo && navigateTo('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Strategy Home</span>
          </button>

          <span className="text-xs font-bold text-slate-400">
            Showing {filteredProducts.length} items
          </span>
        </div>

        {/* Catalog Banner Header */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-950 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-black tracking-widest uppercase text-blue-400 mb-2 block">
              10+ YEARS OF ATHLETIC INNOVATION
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-2">
              Tournament-tested equipment, carbon-plated footwear & technical athletic sportswear.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

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
