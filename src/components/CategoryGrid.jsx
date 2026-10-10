import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { categoriesData } from '../data/products';

export default function CategoryGrid({ onSelectCategory }) {
  return (
    <section className="w-full bg-[#f8fafc] py-8 sm:py-12 lg:py-14 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-black tracking-[0.2em] uppercase text-blue-600">
              EXPLORE DISCIPLINES
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase mt-0.5">
              SHOP BY CATEGORY
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Engineered sports equipment and apparel by athletic category.
            </p>
          </div>

          <span className="hidden sm:inline-block text-xs font-bold text-slate-400 uppercase tracking-widest">
            {categoriesData.length} MAJOR DISCIPLINES
          </span>
        </div>

        {/* Categories 4-Column Compact Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {categoriesData.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.name.toLowerCase())}
              className="group relative w-full h-36 sm:h-40 md:h-44 lg:h-48 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-slate-900 border border-slate-200/60"
            >
              {/* Category Image */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Contrast Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent group-hover:bg-slate-950/65 transition-colors" />

              {/* Content Bottom */}
              <div className="absolute inset-0 flex flex-col justify-end p-3.5 sm:p-4 lg:p-5">
                <span className="text-[10px] sm:text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-0.5 line-clamp-1">
                  {cat.tagline}
                </span>

                <h3 className="text-base sm:text-lg lg:text-xl font-black text-white uppercase tracking-tight mb-1">
                  {cat.name}
                </h3>

                <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
