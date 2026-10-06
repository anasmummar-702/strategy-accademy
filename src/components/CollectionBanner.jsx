import React from 'react';
import { ArrowRight } from 'lucide-react';
import { collectionsData } from '../data/products';

export default function CollectionBanner({ onSelectCollection }) {
  const training = collectionsData.find((c) => c.id === 'col-training') || collectionsData[0];
  const competition = collectionsData.find((c) => c.id === 'col-competition') || collectionsData[1];
  const sportswear = collectionsData.find((c) => c.id === 'col-sportswear') || collectionsData[2];
  const equipment = collectionsData.find((c) => c.id === 'col-equipment') || collectionsData[3];

  return (
    <section className="w-full bg-white py-16 sm:py-24 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-blue-600">
            STRATEGY CURATED TIERS
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase mt-2">
            BRAND COLLECTIONS
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-2">
            Targeted athletic gear designed specifically for your training discipline and game day.
          </p>
        </div>

        {/* Collections Custom Grid:
            Row 1: Full Width (TRAINING)
            Row 2: 2 Columns (COMPETITION | SPORTSWEAR)
            Row 3: Full Width (EQUIPMENT)
        */}
        <div className="flex flex-col gap-6 sm:gap-8">
          
          {/* 1. TRAINING (Full Width) */}
          <div 
            onClick={() => onSelectCollection && onSelectCollection('training')}
            className="group relative h-72 sm:h-96 w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
          >
            <img
              src={training.image}
              alt={training.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent group-hover:bg-slate-950/70 transition-colors duration-500" />
            
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-xl">
              <span className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2">
                {training.badge}
              </span>
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-3">
                {training.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-medium mb-5 max-w-md">
                {training.subtitle}
              </p>
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                <span>SHOP COLLECTION</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </div>

          {/* 2. COMPETITION & SPORTSWEAR (2 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* COMPETITION */}
            <div
              onClick={() => onSelectCollection && onSelectCollection('competition')}
              className="group relative h-80 sm:h-96 w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <img
                src={competition.image}
                alt={competition.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent group-hover:bg-slate-950/75 transition-colors duration-500" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
                <span className="text-xs font-black uppercase tracking-widest text-blue-400 mb-1">
                  {competition.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mb-2">
                  {competition.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 font-medium mb-4 line-clamp-2">
                  {competition.subtitle}
                </p>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                  <span>SHOP COLLECTION</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </div>

            {/* SPORTSWEAR */}
            <div
              onClick={() => onSelectCollection && onSelectCollection('sportswear')}
              className="group relative h-80 sm:h-96 w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <img
                src={sportswear.image}
                alt={sportswear.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent group-hover:bg-slate-950/75 transition-colors duration-500" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
                <span className="text-xs font-black uppercase tracking-widest text-blue-400 mb-1">
                  {sportswear.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mb-2">
                  {sportswear.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 font-medium mb-4 line-clamp-2">
                  {sportswear.subtitle}
                </p>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                  <span>SHOP COLLECTION</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </div>

          </div>

          {/* 3. EQUIPMENT (Full Width) */}
          <div
            onClick={() => onSelectCollection && onSelectCollection('equipment')}
            className="group relative h-72 sm:h-96 w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
          >
            <img
              src={equipment.image}
              alt={equipment.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent group-hover:bg-slate-950/70 transition-colors duration-500" />
            
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-xl">
              <span className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2">
                {equipment.badge}
              </span>
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-3">
                {equipment.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-medium mb-5 max-w-md">
                {equipment.subtitle}
              </p>
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                <span>SHOP COLLECTION</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
