import React, { useState } from 'react';
import { programsData } from '../data/programs';
import { Calendar, CheckCircle2, Clock, Users, Trophy, Sparkles, Filter, ChevronRight } from 'lucide-react';

export default function ProgramsSection({ openTrialModal }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Programs' },
    { id: 'kids', label: 'Kids (Beginners / Intermediate)' },
    { id: 'adults', label: 'Adults & Fitness' },
    { id: 'advanced', label: 'Advanced / Competitive Coaching' },
  ];

  const filteredPrograms = activeCategory === 'all'
    ? programsData
    : programsData.filter(p => p.category === activeCategory);

  return (
    <div className="pt-28 pb-20 space-y-12 container mx-auto px-4">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="badge badge-cyan inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Programs & Classes
        </span>
        <h1 className="text-4xl md:text-5xl font-black font-['Outfit']">
          Skating Programs Designed For <span className="gradient-text">Every Age & Goal</span>
        </h1>
        <p className="text-gray-300 text-base">
          From tiny gliders learning balance to competitive sprint champions and adult fitness enthusiasts. All classes led by certified instructors in our state-of-the-art indoor rink.
        </p>
      </div>

      {/* Free Trial Highlight Box */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-blue-950/40 to-pink-950/40 border border-cyan-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="badge badge-pink">First Time Special</span>
            <span className="text-xs text-cyan-300 font-bold">100% FREE TRIAL CLASS</span>
          </div>
          <h3 className="text-2xl font-extrabold font-['Outfit'] text-white">
            Not Sure Which Program Suits You Best?
          </h3>
          <p className="text-gray-300 text-sm">
            Book a complimentary 45-minute trial session. Equipment & skates rental included free!
          </p>
        </div>
        <button onClick={openTrialModal} className="btn-primary whitespace-nowrap py-3.5 px-6">
          <Calendar className="w-5 h-5" />
          <span>Book a Trial</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/10 pb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-300 text-black shadow-lg shadow-cyan-400/30 font-bold'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Programs Grid */}
      <div className="cards-grid-3">
        {filteredPrograms.map((prog) => (
          <div
            key={prog.id}
            className="glass-panel rounded-3xl overflow-hidden flex flex-col justify-between border border-white/10 hover:border-cyan-400/50 transition-all duration-300 group"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-transparent to-transparent opacity-90" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="badge badge-cyan">{prog.level}</span>
                  <span className="badge badge-pink">{prog.ageGroup}</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-xl font-extrabold font-['Outfit'] text-cyan-400">
                    {prog.price}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold font-['Outfit'] text-white group-hover:text-cyan-400 transition-colors">
                  {prog.title}
                </h3>
                
                <p className="text-gray-300 text-xs leading-relaxed">
                  {prog.description}
                </p>

                {/* Info Pills */}
                <div className="space-y-1.5 text-xs text-gray-300 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{prog.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    <span>{prog.schedule}</span>
                  </div>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Includes:</div>
                  {prog.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer Button */}
            <div className="p-6 pt-0">
              <button
                onClick={openTrialModal}
                className="btn-primary w-full py-3 text-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Trial Session</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
