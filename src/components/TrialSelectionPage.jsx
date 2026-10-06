import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import BasketballTrialModal from './BasketballTrialModal';

export default function TrialSelectionPage({ navigateTo, onSelectSkating }) {
  const [isBasketballModalOpen, setIsBasketballModalOpen] = useState(false);

  const handleSelectSkating = () => {
    if (onSelectSkating) {
      onSelectSkating();
    } else if (navigateTo) {
      navigateTo('trial-skating');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBasketball = () => {
    if (navigateTo) {
      navigateTo('trial-basketball');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden">
      
      {/* Subtle Soft Blue Background Glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/70 via-blue-50/20 to-transparent pointer-events-none" />

      {/* Top Bar Navigation */}
      <div className="w-full max-w-2xl mb-6 sm:mb-8 flex items-center justify-start z-10 px-1">
        <button
          onClick={() => {
            if (navigateTo) navigateTo('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0035f5] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-2xl space-y-6 sm:space-y-8 z-10 text-center">
        
        {/* Simple Heading with Blue Text */}
        <h1 className="text-3xl sm:text-4xl font-black font-['Outfit'] tracking-tight">
          <span className="text-blue-600">Select Your </span>
          <span className="text-[#0035f5] bg-blue-50 px-3 py-1 rounded-2xl border border-blue-200 inline-block shadow-sm">
            Trial Class
          </span>
        </h1>

        {/* Two Picture Boxes: Strictly Vertical on mobile, Strictly Horizontal on laptop/desktop */}
        <div className="trial-sports-grid">
          
          {/* BOX 1: SKATING (KEPT FIRST) */}
          <button
            onClick={handleSelectSkating}
            type="button"
            className="trial-sport-card"
            title="Skating Trial Class"
          >
            <img 
              src="/images/user_skate_selection.jpg" 
              alt="Skating" 
            />
          </button>

          {/* BOX 2: BASKETBALL */}
          <button
            onClick={handleSelectBasketball}
            type="button"
            className="trial-sport-card"
            title="Basketball Trial Class"
          >
            <img 
              src="/images/user_basketball_selection.jpg" 
              alt="Basketball" 
            />
          </button>

        </div>

      </div>

      {/* Basketball Trial Modal for booking */}
      <BasketballTrialModal
        isOpen={isBasketballModalOpen}
        onClose={() => setIsBasketballModalOpen(false)}
      />

    </div>
  );
}
