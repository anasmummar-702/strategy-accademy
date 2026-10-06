import React, { useState } from 'react';
import { productsData } from '../data/products';
import { ShoppingBag, Search, Star, Filter, Check, X, Shield, Eye, Plus, ArrowRight } from 'lucide-react';

export default function ProShopSection({ onAddToCart, openCart }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'skates', label: 'Inline & Quad Skates' },
    { id: 'gear', label: 'Protective Gear (Helmets, Pads)' },
    { id: 'accessories', label: 'Accessories & Spare Parts' },
  ];

  // Filtering
  let filtered = productsData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="pt-28 pb-20 space-y-10 container mx-auto px-4">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="badge badge-orange inline-flex items-center gap-1">
          <ShoppingBag className="w-3.5 h-3.5" /> Official Strategy Pro Shop
        </span>
        <h1 className="text-4xl md:text-5xl font-black font-['Outfit']">
          Professional Skates, <span className="gradient-text">Gear & Accessories</span>
        </h1>
        <p className="text-gray-300 text-base">
          Curated by certified skate coaches. Free express shipping on orders over $150 and complimentary 30-day sizing exchange.
        </p>
      </div>

      {/* Controls Bar: Search & Filters & Sort */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-400/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search skates, helmets, wheels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="featured" className="bg-[#0b1021]">Sort: Featured</option>
            <option value="price-low" className="bg-[#0b1021]">Price: Low to High</option>
            <option value="price-high" className="bg-[#0b1021]">Price: High to Low</option>
            <option value="rating" className="bg-[#0b1021]">Top Rated</option>
          </select>
        </div>

      </div>

      {/* Product Grid */}
      <div className="cards-grid-3">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className="glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Product Image & Badges */}
              <div className="relative h-60 overflow-hidden bg-gray-900/50">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="badge badge-pink">{prod.badge}</span>
                </div>

                <button
                  onClick={() => setSelectedProduct(prod)}
                  className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-cyan-400 hover:border-cyan-400 transition-all"
                  title="Quick View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                    {prod.subcategory}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{prod.rating}</span>
                    <span className="text-gray-400 text-[10px]">({prod.reviewsCount})</span>
                  </div>
                </div>

                <h3
                  onClick={() => setSelectedProduct(prod)}
                  className="text-lg font-bold font-['Outfit'] text-white group-hover:text-cyan-400 cursor-pointer transition-colors line-clamp-1"
                >
                  {prod.title}
                </h3>

                <p className="text-gray-300 text-xs line-clamp-2">
                  {prod.description}
                </p>

                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-2xl font-extrabold font-['Outfit'] text-white">
                    ${prod.price.toFixed(2)}
                  </span>
                  {prod.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      ${prod.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-0 flex gap-2">
              <button
                onClick={() => onAddToCart(prod)}
                className="btn-primary flex-1 py-3 text-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={() => setSelectedProduct(prod)}
                className="btn-secondary p-3"
                title="View Specs"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Product Quick Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="relative w-full max-w-2xl bg-[#090e1c] border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-2xl text-white overflow-hidden">
            
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-64 object-cover rounded-2xl border border-white/10"
                />
              </div>

              <div className="space-y-3">
                <span className="badge badge-pink">{selectedProduct.badge}</span>
                <h3 className="text-xl font-extrabold font-['Outfit'] text-white">
                  {selectedProduct.title}
                </h3>
                <div className="text-2xl font-extrabold font-['Outfit'] text-cyan-400">
                  ${selectedProduct.price.toFixed(2)}
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="space-y-1 pt-2 border-t border-white/10">
                  <div className="text-xs font-bold text-cyan-400 uppercase">Technical Specs:</div>
                  {selectedProduct.specs.map((sp, i) => (
                    <div key={i} className="text-xs text-gray-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                      <span>{sp}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => {
                      onAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="btn-primary w-full py-3 text-xs"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart & Checkout</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
