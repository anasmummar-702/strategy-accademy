import React from 'react';
import { ArrowRight, Sparkles, Crown, Zap, ShieldCheck } from 'lucide-react';
import ProductCard from './ProductCard';

export default function SpecialEdition({
  products = [],
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlistedIds = [],
  onExploreSpecialEdition,
  navigateTo
}) {
  const specialEditionProducts = products.filter((p) => p.isSpecialEdition).slice(0, 4);

  const handleExplore = () => {
    if (navigateTo) {
      navigateTo('special-edition');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onExploreSpecialEdition) {
      onExploreSpecialEdition();
    } else {
      window.location.hash = 'special-edition';
    }
  };

  return (
    <section className="w-full bg-[#050d24] py-12 sm:py-16 md:py-20 relative overflow-hidden border-y border-blue-900/40">
      
      {/* Background Luxury Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="special-edition-header flex flex-col sm:flex-row sm:items-end justify-between items-start gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black tracking-widest uppercase mb-2.5 shadow-sm">
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>LIMITED QUANTITY • COLLECTORS VAULT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
              SPECIAL EDITION
            </h2>
            <p className="text-sm sm:text-base text-blue-200/80 font-medium mt-1">
              Limited pieces. Made to stand out.
            </p>
          </div>

          <button
            onClick={handleExplore}
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-blue-900/30 hover:scale-105 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <span>EXPLORE SPECIAL EDITION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Special Edition Exclusive Cards Grid: 4 columns on laptop/desktop, 2 columns on mobile */}
        <div className="special-edition-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {specialEditionProducts.map((product) => (
            <div key={product.id} className="relative w-full">
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistedIds.includes(product.id)}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
