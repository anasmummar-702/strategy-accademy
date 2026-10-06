import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';

export default function FeaturedProducts({
  products = [],
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlistedIds = [],
  onViewAll
}) {
  const featured = products.filter((p) => p.isFeatured).slice(0, 8);

  return (
    <section className="w-full bg-[#f8fafc] py-16 sm:py-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black tracking-widest uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>HANDPICKED FOR ATHLETES</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
              FEATURED PRODUCTS
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
              Gear up for your next performance.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors group cursor-pointer w-fit"
          >
            <span>VIEW ALL PRODUCTS</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Product Grid: 4 per row desktop, 2-3 per row tablet, 2 per row mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
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
