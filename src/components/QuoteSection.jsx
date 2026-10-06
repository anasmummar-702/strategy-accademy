import React from 'react';

export default function QuoteSection() {
  return (
    <section className="w-full bg-white py-20 sm:py-28 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-slate-100 flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl mx-auto">
        {/* Subtle Brand Watermark Accent */}
        <span className="block text-xs sm:text-sm font-black tracking-[0.3em] uppercase text-blue-600 mb-6">
          THE STRATEGY PHILOSOPHY
        </span>

        {/* Large Typography Quote */}
        <blockquote className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.2] uppercase text-balance">
          “Champions are built when nobody is watching.”
        </blockquote>

        {/* Brand Attribution */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="w-12 h-0.5 bg-blue-600" />
          <cite className="not-italic text-sm sm:text-base font-black tracking-widest text-slate-800 uppercase">
            STRATEGY
          </cite>
          <div className="w-12 h-0.5 bg-blue-600" />
        </div>
      </div>
    </section>
  );
}
