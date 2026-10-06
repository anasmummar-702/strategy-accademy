import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { brandBannersData } from '../data/products';

export default function BrandBannerSlider({ onBannerClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const banners = brandBannersData;

  // Auto sliding every 4.5 seconds with pause on hover
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 40) {
      handleNext();
    }
    if (touchStartX.current - touchEndX.current < -40) {
      handlePrev();
    }
  };

  return (
    <section 
      className="relative w-full bg-slate-950 py-4 sm:py-6 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Slider Frame */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] min-h-[380px] sm:min-h-[460px] md:min-h-[500px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
          
          {/* Slides Loop */}
          {banners.map((banner, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background Image */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  className={`w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />

                {/* Gradient Contrast Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Banner Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl">
                  {/* Tag Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/30 text-blue-300 text-xs font-black tracking-widest uppercase mb-4 backdrop-blur-md w-fit">
                    <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                    <span>{banner.tag}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight mb-3">
                    {banner.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-base text-slate-200 font-medium mb-6 line-clamp-2 max-w-xl">
                    {banner.subtitle}
                  </p>

                  {/* CTA Button */}
                  <div>
                    <button
                      onClick={() => onBannerClick && onBannerClick(banner.ctaLink)}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-blue-600/30 hover:scale-105 transition-all cursor-pointer"
                    >
                      <span>{banner.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}

          {/* Previous / Next Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/70 hover:bg-blue-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/70 hover:bg-blue-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Dots Pagination Indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {banners.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  dotIdx === currentIndex
                    ? 'w-7 h-2 bg-blue-500 shadow-md'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
