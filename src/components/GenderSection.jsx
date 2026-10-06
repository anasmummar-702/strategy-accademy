import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function GenderSection({ onSelectGender }) {
  const genderCards = [
    {
      id: 'men',
      title: 'MEN',
      subtitle: 'Engineered speed, power & compression training gear.',
      image: '/images/strategy_athlete_banner.jpg',
      cta: 'SHOP MEN'
    },
    {
      id: 'women',
      title: 'WOMEN',
      subtitle: 'Dynamic support, breathable singlets & tailored fits.',
      image: '/images/banner_3.jpg',
      cta: 'SHOP WOMEN'
    },
    {
      id: 'kids',
      title: 'KIDS',
      subtitle: 'Junior athletic tracksuits, adjustable skates & safety gear.',
      image: '/images/kids_class.jpg',
      cta: 'SHOP KIDS'
    }
  ];

  return (
    <section className="w-full bg-[#f8fafc] py-16 sm:py-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-blue-600">
            TAILORED PERFORMANCE
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase mt-2">
            SHOP YOUR WAY
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-2">
            Explore dedicated footwear, apparel, and hardware engineered for every athlete.
          </p>
        </div>

        {/* 3 Large Cards: Desktop 3 side-by-side, Mobile stacked vertically */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {genderCards.map((card) => (
            <div
              key={card.id}
              onClick={() => onSelectGender && onSelectGender(card.id)}
              className="group relative h-96 sm:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer bg-slate-900 border border-slate-200/60"
            >
              {/* Large Photography */}
              <img
                src={card.image}
                alt={card.title}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Contrast Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent group-hover:bg-slate-950/80 transition-colors duration-300" />

              {/* Content Panel at Bottom */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 font-medium mb-5 line-clamp-2 max-w-xs">
                  {card.subtitle}
                </p>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                  <span>{card.cta}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
