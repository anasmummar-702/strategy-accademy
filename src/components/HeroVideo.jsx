import React, { useState, useRef } from 'react';
import { ArrowRight, Play, Sparkles, ChevronDown } from 'lucide-react';

export default function HeroVideo({ onShopNow, onExploreCollection }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  return (
    <section className="relative w-full h-[90vh] min-h-[620px] max-h-[960px] overflow-hidden bg-slate-950 flex items-center justify-center">
      {/* High-Quality Sports Video Background with Poster Fallback */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
        poster="/images/strategy_athlete_banner.jpg"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-90' : 'opacity-70'
        }`}
      >
        <source 
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>

      {/* Cinematic Gradient Overlays for High Contrast & Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-blue-950/20 to-slate-950/80 pointer-events-none" />

      {/* Animated Subtle Floating Particle/Grid Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Content with Staggered Entrance */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-16">
        

        {/* Brand Name */}
        <h2 className="animate-slide-up text-xs sm:text-sm font-black tracking-[0.35em] uppercase text-blue-400 mb-2">
          STRATEGY
        </h2>

        {/* Main Punchy Heading */}
        <h1 className="animate-slide-up text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] uppercase max-w-4xl text-balance">
          PLAY HARD. <br />
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-white bg-clip-text text-transparent">
            MOVE SMART.
          </span>
        </h1>

        {/* Short Supporting Text */}
        <p className="animate-slide-up text-sm sm:text-lg md:text-xl text-slate-200 font-medium max-w-2xl mt-5 mb-8 leading-relaxed">
          Engineered for athletes who demand peak performance. Over a decade of championship-tested sportswear and professional equipment.
        </p>

        {/* Dual CTA Buttons */}
        <div className="animate-fade-in flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onShopNow}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>SHOP NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreCollection}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-extrabold text-sm tracking-wider uppercase backdrop-blur-md border border-white/25 hover:border-white/40 transition-all duration-200 cursor-pointer"
          >
            EXPLORE COLLECTION
          </button>
        </div>

      </div>

      {/* Gentle Scroll Indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1 text-slate-400 text-xs font-medium animate-bounce pointer-events-none">
        <span>SCROLL DOWN</span>
        <ChevronDown className="w-4 h-4 text-blue-400" />
      </div>
    </section>
  );
}
