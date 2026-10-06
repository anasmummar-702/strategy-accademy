import React from 'react';
import { History, Eye, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function RecentlyViewed({
  viewedProducts = [],
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlistedIds = [],
  onExploreProducts
}) {
  return (
    <section className="w-full bg-[#f8fafc] py-16 sm:py-20 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                RECENTLY VIEWED
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Products you have recently inspected during your session.
              </p>
            </div>
          </div>

          {viewedProducts.length > 0 && (
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {viewedProducts.length} ITEMS
            </span>
          )}
        </div>

        {/* Dynamic Products Display or Useful Empty State */}
        {viewedProducts && viewedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {viewedProducts.map((product) => (
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
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl bg-white border border-dashed border-slate-300 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase mb-1">
              Your recently viewed products will appear here.
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Explore our performance collection to see your browsing history and compare athletic gear.
            </p>
            <button
              onClick={onExploreProducts}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
