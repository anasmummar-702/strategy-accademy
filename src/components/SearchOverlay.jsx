import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, TrendingUp, Clock, Tag } from 'lucide-react';
import { productsData, categoriesData } from '../data/products';

export default function SearchOverlay({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectCategory
}) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Carbon Speed Runner',
    'Composite Basketball',
    'Windrunner Jacket'
  ]);
  const inputRef = useRef(null);

  const popularSearches = [
    'Basketball',
    'Carbon Plated Shoes',
    'Football Cleats',
    'Compression Tights',
    'Special Edition',
    'Quad Skates',
    'Grade 1 Cricket'
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Real-time suggestions
  const filteredProducts = query.trim()
    ? productsData.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sport.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const filteredCategories = query.trim()
    ? categoriesData.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectProduct = (product) => {
    // Add to recent searches
    if (!recentSearches.includes(product.name)) {
      setRecentSearches([product.name, ...recentSearches.slice(0, 4)]);
    }
    onClose();
    if (onSelectProduct) onSelectProduct(product);
  };

  const handleChipClick = (searchTerm) => {
    setQuery(searchTerm);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/85 backdrop-blur-xl animate-fade-in">
      {/* Header Container */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <span className="text-xs font-black tracking-widest uppercase text-blue-400">
            STRATEGY SEARCH CATALOG
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Big Search Input Field */}
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sports, footwear, equipment, or apparel..."
            className="w-full pl-14 pr-12 py-4 sm:py-5 rounded-2xl bg-slate-900 border border-slate-700/80 text-white text-base sm:text-xl font-bold placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-2xl transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Results / Suggestion Body */}
      <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto px-4 sm:px-6 py-6">
        {query.trim() ? (
          <div>
            {/* Matching Categories */}
            {filteredCategories.length > 0 && (
              <div className="mb-8">
                <span className="text-xs font-black tracking-wider uppercase text-slate-400 mb-3 block">
                  CATEGORIES
                </span>
                <div className="flex flex-wrap gap-2">
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onClose();
                        if (onSelectCategory) onSelectCategory(cat.name.toLowerCase());
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-950/60 border border-blue-600/40 text-blue-300 text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                    >
                      {cat.name} ({cat.itemCount}) →
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Products */}
            {filteredProducts.length > 0 ? (
              <div>
                <span className="text-xs font-black tracking-wider uppercase text-slate-400 mb-3 block">
                  PRODUCTS ({filteredProducts.length})
                </span>
                <div className="space-y-2.5">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p)}
                      className="flex items-center gap-4 p-3 sm:p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-contain bg-slate-950 p-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-blue-400 uppercase">
                          {p.sport} • {p.category}
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                          {p.name}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-black text-white">
                          ${p.price.toFixed(2)}
                        </div>
                        {p.oldPrice && (
                          <div className="text-xs text-slate-500 line-through">
                            ${p.oldPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-1 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-base text-slate-400 font-medium">
                  No products found for "<span className="text-white font-bold">{query}</span>"
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for "Basketball", "Running", "Cleats", or "Jacket".
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recent Searches */}
            <div>
              <div className="flex items-center gap-2 text-xs font-black tracking-wider uppercase text-slate-400 mb-4">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>RECENT SEARCHES</span>
              </div>
              <div className="space-y-2">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChipClick(item)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-850 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer text-left"
                  >
                    <span>{item}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Searches */}
            <div>
              <div className="flex items-center gap-2 text-xs font-black tracking-wider uppercase text-slate-400 mb-4">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span>POPULAR TRENDS</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChipClick(term)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 border border-slate-800 hover:border-blue-500 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
