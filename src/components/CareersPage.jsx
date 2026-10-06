import React from 'react';
import { 
  Briefcase, Award, ChevronRight, Mail, 
  MapPin, Clock, ArrowRight, ShieldCheck 
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function CareersPage({ 
  navigateTo, 
  cartCount = 0, 
  wishlistCount = 0, 
  onOpenCart, 
  onOpenWishlist, 
  onOpenSearch 
}) {
  const openings = [
    {
      role: 'Athletic Footwear & Equipment Product Specialist',
      dept: 'Product Engineering & Design',
      loc: 'Dubai Marina & Abu Dhabi',
      type: 'Full-time'
    },
    {
      role: 'E-Commerce Logistics & Fulfillment Coordinator',
      dept: 'Supply Chain & Warehousing',
      loc: 'Al Nahiyan Hub, Abu Dhabi',
      type: 'Full-time'
    },
    {
      role: 'Digital Sports Marketing & Athlete Ambassador Manager',
      dept: 'Brand & Community Growth',
      loc: 'Dubai Marina HQ',
      type: 'Full-time'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      
      {/* Sticky Navbar */}
      <Navbar
        activeTab="careers"
        navigateTo={navigateTo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={onOpenCart}
        onOpenWishlist={onOpenWishlist}
        onOpenSearch={onOpenSearch}
      />

      <main className="pt-24 sm:pt-28 pb-16 flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
          <button 
            onClick={() => navigateTo && navigateTo('shop-home')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            STRATEGY STORE
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-blue-600 font-black">CAREERS</span>
        </div>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider mb-4">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            <span>Join Our Athletic Mission</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">
            Build the Future of Sport at STRATEGY
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">
            Over the past decade, STRATEGY has grown into a premier sports equipment and apparel brand across the UAE and GCC. We are always looking for passionate athletes, engineers, and e-commerce leaders.
          </p>
        </div>

        {/* Current Openings */}
        <div className="space-y-4 mb-8">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mb-2">
            Current Opportunities in the UAE
          </h2>
          {openings.map((job, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-400 transition-all"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {job.dept}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {job.role}
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.loc}
                  </span>
                  <span>•</span>
                  <span>{job.type}</span>
                </div>
              </div>

              <a
                href={`mailto:careers@strategy.com?subject=Application%20for%20${encodeURIComponent(job.role)}`}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>

      </main>

      <Footer onNavigate={navigateTo} />
      
    </div>
  );
}
