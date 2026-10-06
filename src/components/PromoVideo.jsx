import React, { useRef, useState } from 'react';
import { Play, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';

export default function PromoVideo({ onExplorePerformance }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section className="w-full bg-slate-950 py-16 sm:py-24 overflow-hidden border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout: Desktop Video Left | Text Right. Mobile Video First, Text Second */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Video Container (7 Cols on Desktop) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 group">
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                poster="/images/basketball_video_poster.jpg"
                className="w-full h-full object-cover object-center"
              >
                <source 
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" 
                  type="video/mp4" 
                />
              </video>

              {/* Contrast Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Play / Pause Toggle Button */}
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-all group-hover:scale-110 cursor-pointer"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                <Play className={`w-6 h-6 ml-0.5 ${isPlaying ? 'opacity-80' : 'opacity-100'}`} />
              </button>

              {/* Bottom Video Badge */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>STRATEGY R&D LAB • FOOTAGE 04</span>
              </div>
            </div>
          </div>

          {/* Text Content (5 Cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-black tracking-widest uppercase mb-4 w-fit">
              <Zap className="w-3.5 h-3.5 fill-blue-400" />
              <span>THE ATHLETIC STANDARD</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-[1.1] mb-5">
              MORE THAN GEAR. <br />
              <span className="text-blue-500">IT'S YOUR STRATEGY.</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed mb-6">
              Designed for athletes who refuse to settle. Every seam, carbon plate, and composite weave is engineered to withstand the relentless demands of high-level competition.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-black text-white">0.02s</div>
                <div className="text-xs text-slate-400 font-medium">Faster Energy Return</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-black text-white">100%</div>
                <div className="text-xs text-slate-400 font-medium">Tournament Grade</div>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <button
                onClick={onExplorePerformance}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-blue-600/30 hover:scale-105 transition-all cursor-pointer"
              >
                <span>EXPLORE PERFORMANCE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
