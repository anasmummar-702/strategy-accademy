import React from 'react';
import { 
  X, Heart, Trash2, ShoppingBag, ArrowRight, Eye, 
  Sparkles, Star, ShieldCheck, Check, ChevronRight, Flame 
} from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems = [],
  onRemoveFromWishlist,
  onMoveToCart,
  onSelectProduct,
  onQuickView,
  navigateTo
}) {
  if (!isOpen) return null;

  const totalValue = wishlistItems.reduce((sum, item) => {
    const p = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    return sum + p;
  }, 0);

  const handleBrowseCollection = (category) => {
    onClose();
    if (navigateTo) {
      if (category) navigateTo(category);
      else navigateTo('shop');
    }
  };

  const handleClearAll = () => {
    wishlistItems.forEach((item) => {
      if (onRemoveFromWishlist) onRemoveFromWishlist(item);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in" 
      />

      {/* Drawer Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white text-slate-900 h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-blue-100"
      >
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200/80 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shadow-xs">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide uppercase text-slate-900 font-sans">
                  Saved Wishlist
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white">
                  {wishlistItems.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Your personal curated STRATEGY locker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {wishlistItems.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer mr-1"
                title="Clear all saved items"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 1. WISHLIST VALUE SUMMARY BANNER (When Items Exist) */}
        {wishlistItems.length > 0 && (
          <div className="px-6 py-3 bg-gradient-to-r from-blue-50/80 via-slate-50 to-blue-50/80 border-b border-blue-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 font-medium">Estimated Value:</span>
              <span className="ml-1.5 font-black text-slate-900">${totalValue.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-700 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>In-stock alerts active</span>
            </div>
          </div>
        )}

        {/* 2. MAIN SCROLLABLE LIST */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3.5">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => {
              const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
              const oldPrice = typeof item.oldPrice === 'number' ? item.oldPrice : parseFloat(item.oldPrice) || 0;
              const itemImg = item.image || (item.images && item.images[0]) || '/images/strategy_basketball_ball.jpg';

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all flex gap-3.5 items-center group"
                >
                  {/* Thumbnail */}
                  <div 
                    onClick={() => {
                      onClose();
                      if (onQuickView) onQuickView(item);
                    }}
                    className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 p-1.5 shrink-0 flex items-center justify-center overflow-hidden cursor-pointer"
                  >
                    <img
                      src={itemImg}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                        {item.sport || 'STRATEGY'} • {item.category || 'Gear'}
                      </span>
                      {item.isSpecialEdition && (
                        <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-blue-900 text-amber-300">
                          LIMITED
                        </span>
                      )}
                    </div>

                    <h4 
                      onClick={() => {
                        onClose();
                        if (onSelectProduct) onSelectProduct(item);
                        else if (onQuickView) onQuickView(item);
                        else if (navigateTo) navigateTo(`product-${item.id}`);
                      }}
                      className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-snug hover:text-blue-600 transition-colors cursor-pointer"
                      title={item.name}
                    >
                      {item.name}
                    </h4>

                    {/* Rating & Stock */}
                    <div className="flex items-center gap-2 mt-1 text-[11px]">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{item.rating || '4.9'}</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> In Stock
                      </span>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-slate-900">
                          ${itemPrice.toFixed(2)}
                        </span>
                        {oldPrice > itemPrice && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ${oldPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Action buttons: Move to Cart, Trash */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (onMoveToCart) onMoveToCart(item);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          title="Move item to Cart"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add</span>
                        </button>

                        <button
                          onClick={() => {
                            if (onRemoveFromWishlist) onRemoveFromWishlist(item);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* 3. RICH EMPTY STATE (Well Organised, White & Blue) */
            <div className="text-center py-10 px-4 flex flex-col items-center">
              
              {/* Floating Heart Graphic */}
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-500 flex items-center justify-center shadow-md shadow-rose-100">
                  <Heart className="w-8 h-8 fill-rose-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-sm">
                  <Sparkles className="w-3 h-3" />
                </div>
              </div>

              <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight mb-1">
                Your Saved Locker is Empty
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
                Tap the heart on any STRATEGY performance product to save it here. We will track price drops and size availability for you.
              </p>

              <button
                onClick={() => handleBrowseCollection('shop')}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer mb-8"
              >
                <span>Browse All Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Jump Category Cards */}
              <div className="w-full pt-6 border-t border-slate-100 text-left">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                    Trending Categories
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '🏀 Basketball Gear', tab: 'basketball' },
                    { label: '🛼 Precision Skates', tab: 'skating' },
                    { label: '👟 Men’s Pro Gear', tab: 'men' },
                    { label: '✨ Special Edition', tab: 'special-edition' }
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => handleBrowseCollection(cat.tab)}
                      className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 text-left text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>{cat.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Value Reassurance */}
              <div className="w-full mt-6 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-left flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-900 leading-snug">
                  <strong className="font-bold">STRATEGY Promise:</strong> Free 30-day exchange on all saved gear if the size isn't a perfect fit.
                </p>
              </div>

            </div>
          )}
        </div>

        {/* 4. FOOTER ACTIONS (When Items Exist) */}
        {wishlistItems.length > 0 && (
          <div className="p-6 bg-slate-50/80 border-t border-slate-200/80 space-y-3">
            <button
              onClick={() => {
                wishlistItems.forEach((it) => onMoveToCart && onMoveToCart(it));
                onClose();
              }}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Cart (${totalValue.toFixed(2)})</span>
            </button>

            <button
              onClick={() => handleBrowseCollection('shop')}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
