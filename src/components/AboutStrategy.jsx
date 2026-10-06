import React from 'react';

export default function AboutStrategy() {
  const stats = [
    { value: '10+', label: 'Years of Experience', sub: 'Serving the market since 2016' },
    { value: '1,000+', label: 'Products Engineered', sub: 'Footwear, gear & apparel' },
    { value: '8+', label: 'Sports Disciplines', sub: 'From courts to tracks' },
    { value: '50,000+', label: 'Athletes Equipped', sub: 'From grassroots to champions' }
  ];

  return (
    <section className="w-full bg-white py-16 sm:py-24 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout: IMAGE | TEXT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Premium Sports Photography (6 Cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src="/images/strategy_athlete_banner.jpg"
                alt="10 Years of STRATEGY Athletics"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              {/* Bottom Badge Over Photo */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xl shrink-0">
                  10
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase">
                    A DECADE OF ATHLETIC EXCELLENCE
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Abu Dhabi & Dubai • Certified International Standards
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text Storytelling & Statistics (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <span className="text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-blue-600 mb-2">
              HERITAGE & INNOVATION
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase leading-[1.1] mb-5">
              10 YEARS OF <br />
              <span className="text-blue-600">STRATEGY</span>
            </h2>

            <blockquote className="text-base sm:text-xl font-bold text-slate-800 italic border-l-4 border-blue-600 pl-4 mb-5">
              “Built through a decade of passion for sport, performance, and innovation.”
            </blockquote>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-8">
              Founded on the belief that championship-grade performance belongs to every athlete, STRATEGY has spent more than 10 years perfecting high-durability equipment, carbon-plate athletic footwear, and technical sportswear tailored for peak competition.
            </p>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
              {stats.map((stat, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-colors"
                >
                  <div className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 uppercase mt-0.5">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
