import React, { useState } from 'react';
import { Flame, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function BestRecentProducts({
  products = [],
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlistedIds = [],
  onViewAll
}) {
  const [activeTab, setActiveTab] = useState('best-sellers');

  const tabs = [
    { id: 'best-sellers', label: 'BEST SELLERS', icon: Flame },
    { id: 'new-arrivals', label: 'NEW ARRIVALS', icon: Sparkles },
    { id: 'trending', label: 'TRENDING', icon: TrendingUp }
  ];

  let filtered = [];
  if (activeTab === 'best-sellers') {
    filtered = products.filter((p) => p.isBestSeller).slice(0, 8);
  } else if (activeTab === 'new-arrivals') {
    filtered = products.filter((p) => p.isNew).slice(0, 8);
  } else {
    // Trending: high rating or special drops
    filtered = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  }

  return (
    <section className="w-full bg-white py-16 sm:py-24 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <span className="text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-blue-600">
              STRATEGY FAVORITES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase mt-1">
              BEST SELLERS & NEW DROPS
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
              Athletic staples tried, tested, and approved across arenas worldwide.
            </p>
          </div>

          {/* Interactive Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid: 4 per row desktop, 2-3 tablet, 2 mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistedIds.includes(product.id)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
