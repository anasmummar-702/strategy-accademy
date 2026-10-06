import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import HeroVideo from './HeroVideo';
import QuoteSection from './QuoteSection';
import BrandBannerSlider from './BrandBannerSlider';
import FeaturedProducts from './FeaturedProducts';
import PromoVideo from './PromoVideo';
import CollectionBanner from './CollectionBanner';
import CategoryGrid from './CategoryGrid';
import SpecialEdition from './SpecialEdition';
import BestRecentProducts from './BestRecentProducts';
import GenderSection from './GenderSection';
import AboutStrategy from './AboutStrategy';
import RecentlyViewed from './RecentlyViewed';
import Footer from './Footer';
import SearchOverlay from './SearchOverlay';
import QuickViewModal from './QuickViewModal';
import WishlistDrawer from './WishlistDrawer';
import { productsData } from '../data/products';

export default function StrategySportsHome({
  navigateTo,
  activeTab = 'home',
  cartItems = [],
  onAddToCart,
  totalCartCount = 0,
  onOpenCart
}) {
  const [products] = useState(productsData);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Initialize wishlist & recently viewed from localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('strategy_wishlist_items');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
      const savedRecent = localStorage.getItem('strategy_recently_viewed');
      if (savedRecent) {
        setRecentlyViewed(JSON.parse(savedRecent));
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }, []);

  // Save wishlist to localStorage
  const saveWishlist = (items) => {
    setWishlistItems(items);
    try {
      localStorage.setItem('strategy_wishlist_items', JSON.stringify(items));
    } catch (e) {}
  };

  // Toggle Wishlist
  const handleToggleWishlist = (product) => {
    if (!product) return;
    const exists = wishlistItems.some((item) => item.id === product.id);
    if (exists) {
      saveWishlist(wishlistItems.filter((item) => item.id !== product.id));
    } else {
      saveWishlist([...wishlistItems, product]);
    }
  };

  // Track product view in recently viewed
  const handleProductView = (product) => {
    setQuickViewProduct(product);
    if (!product) return;

    // Add to recently viewed without duplicate, limited to 6
    const updated = [product, ...recentlyViewed.filter((p) => p.id !== product.id)].slice(0, 8);
    setRecentlyViewed(updated);
    try {
      localStorage.setItem('strategy_recently_viewed', JSON.stringify(updated));
    } catch (e) {}
  };

  const wishlistedIds = wishlistItems.map((item) => item.id);

  // Navigation handlers
  const handleCategorySelect = (categoryName) => {
    if (navigateTo) {
      navigateTo(`category-${categoryName}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGenderSelect = (gender) => {
    if (navigateTo) {
      navigateTo(`gender-${gender}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white antialiased">
      
      {/* 0. STICKY NAVIGATION BAR */}
      <Navbar
        activeTab={activeTab}
        navigateTo={navigateTo}
        cartCount={totalCartCount}
        wishlistCount={wishlistItems.length}
        onOpenCart={onOpenCart}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onAboutClick={() => scrollToSection('sec-about-strategy')}
      />

      {/* 1. HERO VIDEO BANNER */}
      <HeroVideo
        onShopNow={() => scrollToSection('sec-featured-products')}
        onExploreCollection={() => scrollToSection('sec-brand-banners')}
      />

      {/* 2. INSPIRATIONAL QUOTE */}
      <QuoteSection />

      {/* 3. STRATEGY BRAND BANNER / IMAGE SLIDER */}
      <div id="sec-brand-banners">
        <BrandBannerSlider
          onBannerClick={(link) => {
            if (link === 'special-edition') {
              scrollToSection('sec-special-edition');
            } else if (link === 'about') {
              scrollToSection('sec-about-strategy');
            } else {
              scrollToSection('sec-featured-products');
            }
          }}
        />
      </div>

      {/* 4. FEATURED PRODUCTS */}
      <div id="sec-featured-products">
        <FeaturedProducts
          products={products}
          onAddToCart={onAddToCart}
          onQuickView={handleProductView}
          onToggleWishlist={handleToggleWishlist}
          wishlistedIds={wishlistedIds}
          onViewAll={() => scrollToSection('sec-best-sellers')}
        />
      </div>

      {/* 5. PROMOTIONAL VIDEO SECTION */}
      <PromoVideo
        onExplorePerformance={() => scrollToSection('sec-special-edition')}
      />

      {/* 6. BRAND / COLLECTION BANNERS */}
      <CollectionBanner
        onSelectCollection={(col) => {
          scrollToSection('sec-categories');
        }}
      />

      {/* 7. SHOP BY CATEGORY */}
      <div id="sec-categories">
        <CategoryGrid
          onSelectCategory={(cat) => handleCategorySelect(cat)}
        />
      </div>

      {/* 8. SPECIAL EDITION PRODUCTS */}
      <div id="sec-special-edition">
        <SpecialEdition
          products={products}
          onAddToCart={onAddToCart}
          onQuickView={handleProductView}
          onToggleWishlist={handleToggleWishlist}
          wishlistedIds={wishlistedIds}
          onExploreSpecialEdition={() => scrollToSection('sec-featured-products')}
        />
      </div>

      {/* 9. BEST / RECENT PRODUCTS */}
      <div id="sec-best-sellers">
        <BestRecentProducts
          products={products}
          onAddToCart={onAddToCart}
          onQuickView={handleProductView}
          onToggleWishlist={handleToggleWishlist}
          wishlistedIds={wishlistedIds}
          onViewAll={() => scrollToSection('sec-categories')}
        />
      </div>

      {/* 10. SHOP BY GENDER */}
      <GenderSection
        onSelectGender={(gender) => handleGenderSelect(gender)}
      />

      {/* 11. ABOUT STRATEGY */}
      <div id="sec-about-strategy" className="scroll-mt-20 sm:scroll-mt-24">
        <AboutStrategy />
      </div>

      {/* 12. RECENTLY VIEWED PRODUCTS */}
      <RecentlyViewed
        viewedProducts={recentlyViewed}
        onAddToCart={onAddToCart}
        onQuickView={handleProductView}
        onToggleWishlist={handleToggleWishlist}
        wishlistedIds={wishlistedIds}
        onExploreProducts={() => scrollToSection('sec-featured-products')}
      />

      {/* 13. FOOTER */}
      <Footer
        onNavigate={(tab) => {
          if (tab === 'about') {
            scrollToSection('sec-about-strategy');
            return;
          }
          if (navigateTo) {
            navigateTo(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Interactive Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => handleProductView(p)}
        onSelectCategory={(c) => handleCategorySelect(c)}
      />

      {/* Interactive Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={onAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistedIds.includes(quickViewProduct.id) : false}
        onOpenCart={onOpenCart}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={(item) => handleToggleWishlist(item)}
        onMoveToCart={(item) => {
          if (onAddToCart) onAddToCart(item);
          handleToggleWishlist(item);
        }}
        onQuickView={handleProductView}
        navigateTo={navigateTo}
      />

    </div>
  );
}
