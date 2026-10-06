import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { categoriesData } from '../data/products';

export default function CategoryGrid({ onSelectCategory }) {
  return (
    <section className="w-full bg-[#f8fafc] py-16 sm:py-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <span className="text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-blue-600">
              EXPLORE DISCIPLINES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase mt-1">
              SHOP BY CATEGORY
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
              Engineered sports equipment and apparel by athletic category.
            </p>
          </div>

          <span className="hidden sm:inline-block text-xs font-bold text-slate-400 uppercase tracking-widest">
            {categoriesData.length} MAJOR DISCIPLINES
          </span>
        </div>

        {/* Categories: Desktop 4x2 Grid, Mobile Horizontal Smooth Scroll Carousel */}
        <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-none snap-x snap-mandatory">
          {categoriesData.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.name.toLowerCase())}
              className="group relative flex-none w-[70vw] sm:w-auto aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer snap-start bg-slate-900 border border-slate-200/60"
            >
              {/* Category Image */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Contrast Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent group-hover:bg-slate-950/70 transition-colors" />

              {/* Content Bottom */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1 line-clamp-1">
                  {cat.tagline}
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-2">
                  {cat.name}
                </h3>

                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
