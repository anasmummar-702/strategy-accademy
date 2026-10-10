import React from 'react';
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';

export default function ProductCard({
  product,
  onAddToCart,
  onSelectProduct,
  onQuickView,
  onToggleWishlist,
  isWishlisted = false
}) {
  if (!product) return null;

  const {
    id,
    name,
    price,
    oldPrice,
    discount,
    images = [],
    category,
    sport,
    rating = 4.9,
    reviewsCount = 30,
    isNew,
    isSpecialEdition,
    isBestSeller
  } = product;

  const displayImage = images && images.length > 0 ? images[0] : '/images/strategy_basketball_ball.jpg';

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onQuickView) {
      onQuickView(product);
    }
  };

  const numPrice = typeof price === 'number' ? price : (parseFloat(price) || (product.priceFils ? product.priceFils / 100 : 0));
  const numOldPrice = oldPrice ? (typeof oldPrice === 'number' ? oldPrice : (parseFloat(oldPrice) || 0)) : null;

  return (
    <div 
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-400/40 transition-all duration-300 overflow-hidden transform hover:-translate-y-1.5 cursor-pointer"
    >
      {/* Media Container */}
      <div className="relative aspect-square w-full bg-[#f8fafc] overflow-hidden flex items-center justify-center p-4">
        {/* Badges Stack */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {isSpecialEdition && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-blue-900 to-indigo-950 text-amber-300 border border-amber-400/30 shadow-md">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              SPECIAL EDITION
            </span>
          )}
          {isBestSeller && !isSpecialEdition && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-blue-600 text-white shadow-sm">
              BEST SELLER
            </span>
          )}
          {isNew && !isSpecialEdition && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-emerald-600 text-white shadow-sm">
              NEW DROP
            </span>
          )}
          {discount && discount > 0 && (
            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleWishlist) onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105' 
              : 'bg-white/90 backdrop-blur-md text-slate-500 hover:text-rose-500 hover:bg-white hover:scale-105'
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 stroke-rose-500' : ''}`} />
        </button>

        {/* Product Image with Zoom */}
        <img
          src={displayImage}
          alt={name}
          loading="lazy"
          className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-108 select-none"
        />
      </div>

      {/* Product Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between">
        <div>
          {/* Category & Sport Tag */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              {sport} • {category}
            </span>
            <div className="flex items-center gap-1 text-slate-700 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{rating}</span>
              <span className="text-slate-400 text-[10px]">({reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 
            className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2 leading-snug"
          >
            {name}
          </h3>
        </div>

        {/* Price & Quick Add Button */}
        <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              ${numPrice.toFixed(2)}
            </span>
            {numOldPrice && numOldPrice > 0 ? (
              <span className="text-xs text-slate-400 line-through font-medium">
                ${numOldPrice.toFixed(2)}
              </span>
            ) : null}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onAddToCart) onAddToCart(product);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md"
            title="Quick Add to Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
