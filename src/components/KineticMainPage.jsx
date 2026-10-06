import React, { useState } from 'react';
import KineticHeader from './KineticHeader';
import BasketballScratchModal from './BasketballScratchModal';
import { 
  ArrowRight, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  ShoppingCart, 
  CheckCircle, 
  Plus, 
  Heart,
  RotateCcw,
  Droplet,
  Sparkles,
  Crown,
  Award,
  Shield,
  Gift,
  Zap,
  Tag
} from 'lucide-react';

export default function KineticMainPage({
  navigateTo,
  cartItems = [],
  onAddToCart,
  totalCartCount = 3
}) {
  const [toastInfo, setToastInfo] = useState(null);
  const [isScratchOpen, setIsScratchOpen] = useState(false);
  const [wishlistedIds, setWishlistedIds] = useState([]);

  const triggerToast = (title, desc) => {
    setToastInfo({ title, desc });
    setTimeout(() => {
      setToastInfo(null);
    }, 3200);
  };

  const toggleWishlist = (id, name) => {
    if (wishlistedIds.includes(id)) {
      setWishlistedIds(wishlistedIds.filter((item) => item !== id));
      triggerToast('VAULT WISHLIST', `Removed "${name}"`);
    } else {
      setWishlistedIds([...wishlistedIds, id]);
      triggerToast('★ PRIVATE VAULT SAVED', `Added "${name}" to your wishlist`);
    }
  };

  const handleQuickAdd = (title, price, image, sku, spec, size = 'STANDARD') => {
    if (onAddToCart) {
      onAddToCart({
        id: `knt-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        title,
        price,
        image,
        sku,
        spec,
        size,
        quantity: 1
      });
    }
    triggerToast(title.toUpperCase(), `$${price.toFixed(2)} staged in courier locker`);
  };

  return (
    <div className="w-full bg-[#04060f] min-h-screen text-slate-100 font-['Inter',sans-serif] selection:bg-blue-600 selection:text-white luxury-ambient-mesh relative overflow-hidden">
      {/* Top Header */}
      <KineticHeader 
        activeTab="kinetic-main"
        navigateTo={navigateTo}
        cartCount={totalCartCount}
      />

      {/* Floating Ambient Glow Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

      <main className="w-full relative z-10">
        
        {/* =========================================================================
            1. IMMERSIVE HERO SECTION (HAUTE ATELIER COURT EDITION)
            ========================================================================= */}
        <section className="relative w-full overflow-hidden pt-8 sm:pt-16 pb-16 lg:pb-28">
          <div className="absolute inset-0 z-0">
            <div 
              className="w-full h-full bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transform duration-1000 ease-out hover:scale-100" 
              style={{ 
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDwweTWBGhngTI89HOtAcgDTjdA1FOTeJa8vru1OKO1MQSfvAfXA12_igU0cCOZOHjVVqO87U0-Ae5dTw-iIIVznJCvq88iZcl7KXg_bUPl6iYjxjyzOlWDz-1FOCJl4ED8R84ZtqAEfB79z-f5PleFqnv3g8erigEgagFEAvvFsNB8O_wbs9_GC821jfEM_cUKR88imuLYfvP-PhnlZHNamc8A2yI3ryOFX9_PCpNh7FfLVRoNYgGjMQ')` 
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04060f] via-[#04060f]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#04060f] via-[#04060f]/85 to-blue-950/20" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end min-h-[540px] lg:min-h-[640px]">
            <div className="max-w-4xl flex flex-col gap-4">
              
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 font-['Oswald',sans-serif] text-xs font-semibold tracking-wider rounded-lg uppercase shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  HAUTE ATELIER DROP 2025
                </span>
                
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/15 text-amber-300 border border-amber-300/30 font-['Oswald',sans-serif] text-xs font-semibold tracking-wider rounded-lg uppercase">
                  <Crown className="w-3.5 h-3.5" />
                  ★ LIMITED RUN: 042 / 500 PRIVATE RESERVE
                </span>

                <button
                  onClick={() => setIsScratchOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-300 border border-amber-400/40 hover:border-amber-300 font-['Oswald',sans-serif] text-xs font-bold tracking-wider rounded-lg uppercase transition-all shadow-sm group cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
                  <span>SCRATCH SECRET VIP VOUCHER</span>
                </button>
              </div>

              <h1 className="font-['Oswald',sans-serif] text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-none drop-shadow-md font-bold">
                ENGINEERED <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                  FOR THE GRIND.
                </span><br />
                HAUTE ATELIER ACCESSORIES.
              </h1>

              <p className="font-['Inter',sans-serif] text-base sm:text-lg text-slate-300 max-w-2xl mt-1 leading-relaxed">
                Proprietary grip composites, kinetic compression bands, and high-cadence training essentials built for relentless performance. Hand-inspected and sealed in our complimentary hardwood presentation vault.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => {
                    navigateTo('kinetic-product');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-['Oswald',sans-serif] text-base uppercase px-8 py-4 rounded-xl transition-all flex items-center gap-2 shadow-xl shadow-blue-600/30 group font-bold tracking-wider"
                >
                  <span>SHOP NEW RELEASES</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <a 
                  href="#bundles"
                  className="luxury-glass-card text-white border border-white/20 hover:border-cyan-400/40 font-['Oswald',sans-serif] text-base uppercase px-7 py-4 rounded-xl transition-all flex items-center gap-2 backdrop-blur font-bold tracking-wider"
                >
                  <span>EXPLORE BUNDLES</span>
                  <Layers className="w-4 h-4 text-cyan-400" />
                </a>

                <button
                  onClick={() => setIsScratchOpen(true)}
                  className="luxury-glass-card text-amber-300 border border-amber-400/30 hover:border-amber-400 hover:bg-amber-400/10 font-['Oswald',sans-serif] text-base uppercase px-6 py-4 rounded-xl transition-all flex items-center gap-2 font-bold tracking-wider"
                >
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>CLAIM PERK CARD</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. QUICK STATS / CORE VALUE PROPS BAR (LUXURY FROSTED TITANIUM CAPSULES)
            ========================================================================= */}
        <section className="w-full py-5 border-y border-white/10 relative z-20 font-['Inter',sans-serif] bg-slate-950/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 py-1">
            
            <div className="luxury-glass-card rounded-2xl p-4 border border-white/10 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[26px]">sports_basketball</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Oswald',sans-serif] text-base font-bold uppercase text-white leading-none">FIBA STANDARD</span>
                <span className="text-xs text-slate-400 leading-snug mt-1">Elite composite materials</span>
              </div>
            </div>

            <div className="luxury-glass-card rounded-2xl p-4 border border-white/10 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[26px]">bolt</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Oswald',sans-serif] text-base font-bold uppercase text-white leading-none">48-HR DISPATCH</span>
                <span className="text-xs text-slate-400 leading-snug mt-1">Armored courier delivery</span>
              </div>
            </div>

            <div className="luxury-glass-card rounded-2xl p-4 border border-white/10 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[26px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Oswald',sans-serif] text-base font-bold uppercase text-white leading-none">30-DAY TRIAL</span>
                <span className="text-xs text-slate-400 leading-snug mt-1">100% on-court test return</span>
              </div>
            </div>

            <div className="luxury-glass-card rounded-2xl p-4 border border-white/10 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-400/30 text-purple-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[26px]">groups</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Oswald',sans-serif] text-base font-bold uppercase text-white leading-none">500+ PRO TEAMS</span>
                <span className="text-xs text-slate-400 leading-snug mt-1">Collegiate & academy trusted</span>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            3. MARQUEE VELOCITY BANNER (OBSIDIAN VELVET RIBBON)
            ========================================================================= */}
        <div className="w-full bg-gradient-to-r from-blue-900/60 via-indigo-900/70 to-blue-950/60 border-y border-cyan-500/20 text-cyan-300 py-3 overflow-hidden whitespace-nowrap shadow-inner font-['Oswald',sans-serif]">
          <div className="flex items-center gap-8 text-xs font-bold tracking-widest uppercase animate-[marquee_28s_linear_infinite]">
            <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> ATELIER RESTOCK: PRO COMPOSITE GRIP V3 LIVE</span>
            <span className="text-cyan-500">•</span>
            <span>FREE DOMESTIC SPEED CARRIER DELIVERY OVER $75</span>
            <span className="text-cyan-500">•</span>
            <span className="text-amber-300">★ FREE HARDWOOD VAULT PRESENTATION CASE WITH EVERY ORDER</span>
            <span className="text-cyan-500">•</span>
            <span>KINETIC LAB LAB-GRADE COURT FRICTION RATING 9.8/10</span>
            <span className="text-cyan-500">•</span>
            <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> ATELIER RESTOCK: PRO COMPOSITE GRIP V3 LIVE</span>
            <span className="text-cyan-500">•</span>
            <span>FREE DOMESTIC SPEED CARRIER DELIVERY OVER $75</span>
            <span className="text-cyan-500">•</span>
            <span className="text-amber-300">★ FREE HARDWOOD VAULT PRESENTATION CASE WITH EVERY ORDER</span>
          </div>
        </div>

        {/* =========================================================================
            4. FEATURED ACCESSORY CATEGORIES STRIP
            ========================================================================= */}
        <section className="w-full py-14 lg:py-20" id="categories">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div className="flex flex-col gap-1">
                <span className="font-['Oswald',sans-serif] text-xs tracking-widest text-cyan-400 uppercase font-bold">
                  DEPLOYMENT CLASSIFICATIONS
                </span>
                <h2 className="font-['Oswald',sans-serif] text-3xl sm:text-4xl uppercase text-white leading-none font-bold">
                  FEATURED ACCESSORY STRIP
                </h2>
              </div>
              <button 
                onClick={() => {
                  navigateTo('kinetic-product');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="font-['Oswald',sans-serif] text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors font-bold uppercase tracking-wider"
              >
                <span>VIEW ALL 18 SUB-CATEGORIES</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category 1: Balls & Tack (Directly leads to PDP!) */}
              <div 
                onClick={() => {
                  navigateTo('kinetic-product');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative rounded-2xl overflow-hidden bg-slate-900/90 h-96 flex flex-col justify-end p-6 transition-all hover:-translate-y-1.5 shadow-xl hover:shadow-2xl border border-white/10 hover:border-cyan-400/50 cursor-pointer"
              >
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-108" 
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC9IGdYT7akik3GaT55O6PDpEyRg3kinreMosF2JEqPHJ3kiufGmv0dtLZ4zpuqGC_wz1QxZLM9ewMxi2oA9tXx_YdsOtUE1fGo6mKbxV84WcBNRPtnUmUimBT65uGLGlgG9My7QSj8_7RT3AIoihoOh6TyLVzSDvJnOtEz-BreA_B46MONwt1aHRgGQ1Z-F9YxheCdd4_hFRuilBVaCu8jA7BkJB7gNdMjIt1f7gHYgyPDbp1wPVyySA')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04060f] via-[#04060f]/75 to-transparent z-10" />
                <div className="relative z-20 flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-xs text-amber-300 tracking-wider mb-1 font-bold">01 / BALLS & TACK</span>
                  <h3 className="font-['Oswald',sans-serif] text-2xl uppercase text-white group-hover:text-cyan-300 transition-colors leading-tight font-bold">
                    ELITE GRIP BALLS
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">Game & heavy practice models engineered with sweat-dispersion channels.</p>
                  <div className="mt-4 flex items-center gap-1.5 text-cyan-400 font-['Oswald',sans-serif] text-xs tracking-wider group-hover:text-white font-bold uppercase">
                    <span>EXPLORE ATELIER HARDWARE</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Category 2 */}
              <div 
                onClick={() => {
                  navigateTo('kinetic-product');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative rounded-2xl overflow-hidden bg-slate-900/90 h-96 flex flex-col justify-end p-6 transition-all hover:-translate-y-1.5 shadow-xl hover:shadow-2xl border border-white/10 hover:border-cyan-400/50 cursor-pointer"
              >
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-108" 
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCbH6hmaYfSlNgGXler1L77gox_VyksG0pSSE1n4sZL47SBBrpvY6eZkBmzTONBN6VAmUf29-93_xzNHqiBq269u_BnfImAVsgAM5ydFPy_C_tvTVs6MLoGCfVQ_BW-VR-nVB-du0z8ALT1f2qTiGAtOdv51gFdUBFNDtKwQ7cp6-gMfGZUMTnbY_RTERxuHXwHxXywGalG1il4ShnFxhIRNMeq1vXo4QKap1wiTZEVOi4wHUQL6aEIng')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04060f] via-[#04060f]/75 to-transparent z-10" />
                <div className="relative z-20 flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-xs text-amber-300 tracking-wider mb-1 font-bold">02 / MUSCLE TELEMETRY</span>
                  <h3 className="font-['Oswald',sans-serif] text-2xl uppercase text-white group-hover:text-cyan-300 transition-colors leading-tight font-bold">
                    COMPRESSION & SLEEVES
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">Targeted joint stabilization, impact foam padding, and lactic acid reduction.</p>
                  <div className="mt-4 flex items-center gap-1.5 text-cyan-400 font-['Oswald',sans-serif] text-xs tracking-wider group-hover:text-white font-bold uppercase">
                    <span>EXPLORE ATELIER HARDWARE</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Category 3 */}
              <div 
                onClick={() => {
                  navigateTo('kinetic-product');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative rounded-2xl overflow-hidden bg-slate-900/90 h-96 flex flex-col justify-end p-6 transition-all hover:-translate-y-1.5 shadow-xl hover:shadow-2xl border border-white/10 hover:border-cyan-400/50 cursor-pointer"
              >
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-108" 
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAgfB-9N9l8CmOzozKayNAs4i2N38ZUiVk20xRHUxUB95DGDUTkWLbdpK9RZpAY3-76iqhZYr8Pjsf2gnhxaW-LEfDStA7lr5yte6TDCj-3vU-QrrTskhryVAwfD4U4A8jMWL0VizgOldX8lVpaLJYeB4u8zalFSO9Od8V-ZXHXYfRg43d9UkLWTK6PnvkDRQbYYuvQLtgE2yWgjJEDwjiWFqyvBioL7h6NWoSVSHq8OC6M1JTPn-7RTQ')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04060f] via-[#04060f]/75 to-transparent z-10" />
                <div className="relative z-20 flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-xs text-amber-300 tracking-wider mb-1 font-bold">03 / VELOCITY & AGILITY</span>
                  <h3 className="font-['Oswald',sans-serif] text-2xl uppercase text-white group-hover:text-cyan-300 transition-colors leading-tight font-bold">
                    RESISTANCE & AGILITY
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">First-step explosive bands, weighted jump ropes, and cone marker kits.</p>
                  <div className="mt-4 flex items-center gap-1.5 text-cyan-400 font-['Oswald',sans-serif] text-xs tracking-wider group-hover:text-white font-bold uppercase">
                    <span>EXPLORE ATELIER HARDWARE</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Category 4 */}
              <div 
                onClick={() => {
                  navigateTo('kinetic-product');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative rounded-2xl overflow-hidden bg-slate-900/90 h-96 flex flex-col justify-end p-6 transition-all hover:-translate-y-1.5 shadow-xl hover:shadow-2xl border border-white/10 hover:border-cyan-400/50 cursor-pointer"
              >
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-108" 
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZUXZb6LJGdWQBG3DL3nmXSxL6CrH50U3oOdmyLmdNwbN_L6BYzF7LaT11PJ7soMqQb-hA5e6mAqlYQKfrLgxXrfglUGXSkW9l0ZDcsAeHIXw-hQmSob_rl_A-k8my4Vwg1RD4COIQ8rzjt8ty1o85EiE1slqbe9rZ-CJbEkC6YprVivg80CSjNks__ZQv87Er-em9hUQFI-LjwqfCb9Of-JUJLB-kRF3D86UGwlrWpKHS_AWWuUgaIg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04060f] via-[#04060f]/75 to-transparent z-10" />
                <div className="relative z-20 flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-xs text-amber-300 tracking-wider mb-1 font-bold">04 / REFUEL & TRANSIT</span>
                  <h3 className="font-['Oswald',sans-serif] text-2xl uppercase text-white group-hover:text-cyan-300 transition-colors leading-tight font-bold">
                    HYDRATION & COURT GEAR
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">Thermal vacuum water flasks, ball-carry backpacks, and court grip towels.</p>
                  <div className="mt-4 flex items-center gap-1.5 text-cyan-400 font-['Oswald',sans-serif] text-xs tracking-wider group-hover:text-white font-bold uppercase">
                    <span>EXPLORE ATELIER HARDWARE</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. CURATED BESTSELLERS GRID (LUXURY ATELIER GLASS CARDS)
            ========================================================================= */}
        <section className="w-full py-14 lg:py-20 border-y border-white/10" id="bestsellers">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-['Oswald',sans-serif] text-xs tracking-widest uppercase mb-1 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>VERIFIED HARDWOOD PROVEN • ATELIER DROP</span>
                </div>
                <h2 className="font-['Oswald',sans-serif] text-3xl sm:text-4xl uppercase text-white leading-none font-bold">
                  CURATED BESTSELLERS
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button aria-label="Previous" className="w-10 h-10 rounded-xl luxury-glass-card hover:bg-white/15 text-slate-200 flex items-center justify-center border border-white/10 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button aria-label="Next" className="w-10 h-10 rounded-xl luxury-glass-card hover:bg-white/15 text-slate-200 flex items-center justify-center border border-white/10 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Product 1: Kinetic Pro Grip Composite Basketball (CLICK OPENS PDP) */}
              <div className="luxury-glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/10 hover:border-cyan-400/40 transition-all shadow-xl">
                <div 
                  onClick={() => {
                    navigateTo('kinetic-product');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="relative bg-slate-950/70 p-6 aspect-square flex items-center justify-center overflow-hidden border-b border-white/10 cursor-pointer"
                >
                  <span className="absolute top-3 left-3 z-10 bg-amber-400/20 border border-amber-300/40 text-amber-300 font-['Oswald',sans-serif] text-[11px] px-2.5 py-1 rounded-lg uppercase tracking-wider font-bold shadow-sm">
                    ★ ATELIER BESTSELLER
                  </span>
                  
                  <button 
                    aria-label="Add to wishlist" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist('knt-ball-07', 'Pro Grip Composite Basketball');
                    }}
                    className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                      wishlistedIds.includes('knt-ball-07') 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                        : 'bg-slate-900/80 text-slate-300 hover:text-rose-400 border border-white/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlistedIds.includes('knt-ball-07') ? 'fill-white' : ''}`} />
                  </button>

                  <img 
                    alt="Pro Grip Composite Basketball" 
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9L3ZmYQp96vADB7mYPf0-f-gpaq32R1oRtdNiCQ-iIwnoH_TcLkdUdTgu4QzmFEAxn4FI5Wm1_8l-HnOQkHUPP6bLWguNabWObFyZJxyPIC7tcKzH90-nmM-AXC2aUpsOB6De7m7q6uBd7cFJX7CQ-cDoPEikzjYRocC2A3IcKhS6AUQY_NT4862tIU3XXjvN5NNuDcUw9DpbTd2ZF0MTvIY9ZDzNINoo97R2NLTYMxeCCz8OEAy2xA"
                  />
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="ml-1 text-white">4.9</span>
                        <span className="text-slate-400 font-normal ml-1">(312 reviews)</span>
                      </div>
                      <span className="font-['Oswald',sans-serif] text-[11px] text-cyan-400 font-bold uppercase">OFFICIAL SIZE 7</span>
                    </div>

                    <h3 
                      onClick={() => {
                        navigateTo('kinetic-product');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="font-['Oswald',sans-serif] text-lg uppercase text-white group-hover:text-cyan-300 transition-colors leading-snug font-bold cursor-pointer"
                    >
                      Pro Grip Composite Basketball
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Deep channel pebble tech with moisture barrier.</p>
                  </div>

                  <div className="pt-4 mt-4 flex items-center justify-between border-t border-white/10">
                    <div className="flex flex-col">
                      <span className="font-['Oswald',sans-serif] text-2xl font-bold text-white leading-none">$74.00</span>
                      <span className="text-[11px] text-emerald-400 font-medium">In Vault • Ready</span>
                    </div>
                    <button 
                      onClick={() => handleQuickAdd(
                        'Pro Grip Composite Basketball', 
                        74.00, 
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuD9L3ZmYQp96vADB7mYPf0-f-gpaq32R1oRtdNiCQ-iIwnoH_TcLkdUdTgu4QzmFEAxn4FI5Wm1_8l-HnOQkHUPP6bLWguNabWObFyZJxyPIC7tcKzH90-nmM-AXC2aUpsOB6De7m7q6uBd7cFJX7CQ-cDoPEikzjYRocC2A3IcKhS6AUQY_NT4862tIU3XXjvN5NNuDcUw9DpbTd2ZF0MTvIY9ZDzNINoo97R2NLTYMxeCCz8OEAy2xA',
                        'KNT-BALL-07',
                        'Deep-Channel Pebbled'
                      )}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-['Oswald',sans-serif] text-xs uppercase px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 font-bold shadow-md shadow-blue-600/30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>QUICK ADD</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product 2: Kinetic Compression Knee Sleeve */}
              <div className="luxury-glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/10 hover:border-cyan-400/40 transition-all shadow-xl">
                <div 
                  onClick={() => {
                    navigateTo('kinetic-product');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="relative bg-slate-950/70 p-6 aspect-square flex items-center justify-center overflow-hidden border-b border-white/10 cursor-pointer"
                >
                  <span className="absolute top-3 left-3 z-10 bg-blue-500/20 border border-blue-400/40 text-blue-300 font-['Oswald',sans-serif] text-[11px] px-2.5 py-1 rounded-lg uppercase tracking-wider font-bold shadow-sm">
                    POPULAR
                  </span>
                  
                  <button 
                    aria-label="Add to wishlist" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist('knt-slv-02', 'Compression Knee Sleeve');
                    }}
                    className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                      wishlistedIds.includes('knt-slv-02') 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                        : 'bg-slate-900/80 text-slate-300 hover:text-rose-400 border border-white/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlistedIds.includes('knt-slv-02') ? 'fill-white' : ''}`} />
                  </button>

                  <img 
                    alt="Kinetic Compression Knee Sleeve" 
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMCD0ioJesMTlcwECiCDSSIjhQKQt8SQggX83W0iabABuDP8DTBtWexCSiv9VjvGHEeMcUi9Atjo2xUMWY275y5ON61v-Bt3NUNFnn5o_v6tSr1njMf6i3g3Z-T4x6IJWQBvgoNZlAMtZu18llr6XEvn1zUcZMJtpUhkb_Kg9vn05vyNDBrmH7psXx5QB9Qe6sNDsM17HzRMveHxIw2h5_EfiAhwW3KBILz5pGX8g0CwL-pFVK8Xfqcw"
                  />
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="ml-1 text-white">4.8</span>
                        <span className="text-slate-400 font-normal ml-1">(189 reviews)</span>
                      </div>
                      <span className="font-['Oswald',sans-serif] text-[11px] text-cyan-400 font-bold uppercase">LATERAL STABILITY</span>
                    </div>

                    <h3 
                      onClick={() => {
                        navigateTo('kinetic-product');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="font-['Oswald',sans-serif] text-lg uppercase text-white group-hover:text-cyan-300 transition-colors leading-snug font-bold cursor-pointer"
                    >
                      Kinetic Compression Knee Sleeve
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Medical-grade targeted ring support for explosive cuts.</p>
                  </div>

                  <div className="pt-4 mt-4 flex items-center justify-between border-t border-white/10">
                    <div className="flex flex-col">
                      <span className="font-['Oswald',sans-serif] text-2xl font-bold text-white leading-none">$48.00</span>
                      <span className="text-[11px] text-slate-400">Pair Pack (L/R)</span>
                    </div>
                    <button 
                      onClick={() => handleQuickAdd(
                        'Kinetic Compression Knee Sleeve', 
                        48.00, 
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuAMCD0ioJesMTlcwECiCDSSIjhQKQt8SQggX83W0iabABuDP8DTBtWexCSiv9VjvGHEeMcUi9Atjo2xUMWY275y5ON61v-Bt3NUNFnn5o_v6tSr1njMf6i3g3Z-T4x6IJWQBvgoNZlAMtZu18llr6XEvn1zUcZMJtpUhkb_Kg9vn05vyNDBrmH7psXx5QB9Qe6sNDsM17HzRMveHxIw2h5_EfiAhwW3KBILz5pGX8g0CwL-pFVK8Xfqcw',
                        'KNT-SLV-02',
                        'Pitch Black / High-Vis Orange',
                        'SIZE L'
                      )}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-['Oswald',sans-serif] text-xs uppercase px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 font-bold shadow-md shadow-blue-600/30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>QUICK ADD</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product 3: Hex-Padded Dual Arm Sleeves */}
              <div className="luxury-glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/10 hover:border-cyan-400/40 transition-all shadow-xl">
                <div 
                  onClick={() => {
                    navigateTo('kinetic-product');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="relative bg-slate-950/70 p-6 aspect-square flex items-center justify-center overflow-hidden border-b border-white/10 cursor-pointer"
                >
                  <span className="absolute top-3 left-3 z-10 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-['Oswald',sans-serif] text-[11px] px-2.5 py-1 rounded-lg uppercase tracking-wider font-bold shadow-sm">
                    NEW RELEASE
                  </span>
                  
                  <button 
                    aria-label="Add to wishlist" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist('knt-slv-04', 'Hex-Padded Arm Sleeves');
                    }}
                    className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                      wishlistedIds.includes('knt-slv-04') 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                        : 'bg-slate-900/80 text-slate-300 hover:text-rose-400 border border-white/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlistedIds.includes('knt-slv-04') ? 'fill-white' : ''}`} />
                  </button>

                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-108 transition-transform duration-300 rounded-lg filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]" 
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-D1n8FojkCn-fmy2uT4OtSYyvHm1v55_RXSpjJXsId_wj26EqraRzvTyEzfgXKES-iN9-OdebCEcjD6sR_TuElzue-YJN0vAh0dQMgdYmoi4NpY6SJYvnc5nCv_3MMJMrs_4-r15_6OxIFTbppws1HvAha7SHfvmijDaJpl7myZCsLAO6Bz5367f5UN2JaO5_b5WhBfBN4lN0KmWQEJxKq4B4f4edZ8Thw8d3yTzHOaJUbCFM2XXspg')` }}
                  />
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="ml-1 text-white">4.9</span>
                        <span className="text-slate-400 font-normal ml-1">(94 reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-cyan-400" title="Obsidian Black" />
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" title="Royal Blue" />
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400" title="Slate Grey" />
                      </div>
                    </div>

                    <h3 
                      onClick={() => {
                        navigateTo('kinetic-product');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="font-['Oswald',sans-serif] text-lg uppercase text-white group-hover:text-cyan-300 transition-colors leading-snug font-bold cursor-pointer"
                    >
                      Hex-Padded Dual Arm Sleeves
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Elbow impact protection with thermocool thread matrix.</p>
                  </div>

                  <div className="pt-4 mt-4 flex items-center justify-between border-t border-white/10">
                    <div className="flex flex-col">
                      <span className="font-['Oswald',sans-serif] text-2xl font-bold text-white leading-none">$36.00</span>
                      <span className="text-[11px] text-slate-400">3 Tones Available</span>
                    </div>
                    <button 
                      onClick={() => handleQuickAdd(
                        'Hex-Padded Dual Arm Sleeves', 
                        36.00, 
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuA-D1n8FojkCn-fmy2uT4OtSYyvHm1v55_RXSpjJXsId_wj26EqraRzvTyEzfgXKES-iN9-OdebCEcjD6sR_TuElzue-YJN0vAh0dQMgdYmoi4NpY6SJYvnc5nCv_3MMJMrs_4-r15_6OxIFTbppws1HvAha7SHfvmijDaJpl7myZCsLAO6Bz5367f5UN2JaO5_b5WhBfBN4lN0KmWQEJxKq4B4f4edZ8Thw8d3yTzHOaJUbCFM2XXspg',
                        'KNT-SLV-04',
                        'Thermocool Matrix Hex Padding'
                      )}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-['Oswald',sans-serif] text-xs uppercase px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 font-bold shadow-md shadow-blue-600/30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>QUICK ADD</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product 4: Velocity Jump Rope & Band Set */}
              <div className="luxury-glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/10 hover:border-cyan-400/40 transition-all shadow-xl">
                <div 
                  onClick={() => {
                    navigateTo('kinetic-product');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="relative bg-slate-950/70 p-6 aspect-square flex items-center justify-center overflow-hidden border-b border-white/10 cursor-pointer"
                >
                  <span className="absolute top-3 left-3 z-10 bg-purple-500/20 border border-purple-400/40 text-purple-300 font-['Oswald',sans-serif] text-[11px] px-2.5 py-1 rounded-lg uppercase tracking-wider font-bold shadow-sm">
                    EQUIPMENT SET
                  </span>
                  
                  <button 
                    aria-label="Add to wishlist" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist('knt-bnd-05', 'Jump Rope & Band Set');
                    }}
                    className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                      wishlistedIds.includes('knt-bnd-05') 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                        : 'bg-slate-900/80 text-slate-300 hover:text-rose-400 border border-white/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlistedIds.includes('knt-bnd-05') ? 'fill-white' : ''}`} />
                  </button>

                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-108 transition-transform duration-300 rounded-lg filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]" 
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCTRmxivhzkzTtL23uDHgWgneTQRX_zUhLNYqI-IY_4NQmkjbpuxlaFF_IluXfe5WgYmKeNOuhzVFR27U9T-p-XL_-JFyyg45QU3OUC1NOFVi9756RBzyEqQgy2eaUyMAKmxAXtJ3LjX3zym7JFxLTPR7YefzliHZ05kIBXxLA-jbsXXNbt4-vxxBoIU_x5WUejq3pbLihbvyAhRR4wdaBHr8HEE-UbZAbfIghsLMZwnfCeRKbYSiJ-1Q')` }}
                  />
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="ml-1 text-white">4.7</span>
                        <span className="text-slate-400 font-normal ml-1">(120 reviews)</span>
                      </div>
                      <span className="font-['Oswald',sans-serif] text-[11px] text-cyan-400 font-bold uppercase">HEAVY SPEED SYSTEM</span>
                    </div>

                    <h3 
                      onClick={() => {
                        navigateTo('kinetic-product');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="font-['Oswald',sans-serif] text-lg uppercase text-white group-hover:text-cyan-300 transition-colors leading-snug font-bold cursor-pointer"
                    >
                      Velocity Jump Rope & Band Set
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">High-bearing dual cable rope with 3 latex tension loops.</p>
                  </div>

                  <div className="pt-4 mt-4 flex items-center justify-between border-t border-white/10">
                    <div className="flex flex-col">
                      <span className="font-['Oswald',sans-serif] text-2xl font-bold text-white leading-none">$42.00</span>
                      <span className="text-[11px] text-slate-400">Complete Kit</span>
                    </div>
                    <button 
                      onClick={() => handleQuickAdd(
                        'Velocity Jump Rope & Band Set', 
                        42.00, 
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuCTRmxivhzkzTtL23uDHgWgneTQRX_zUhLNYqI-IY_4NQmkjbpuxlaFF_IluXfe5WgYmKeNOuhzVFR27U9T-p-XL_-JFyyg45QU3OUC1NOFVi9756RBzyEqQgy2eaUyMAKmxAXtJ3LjX3zym7JFxLTPR7YefzliHZ05kIBXxLA-jbsXXNbt4-vxxBoIU_x5WUejq3pbLihbvyAhRR4wdaBHr8HEE-UbZAbfIghsLMZwnfCeRKbYSiJ-1Q',
                        'KNT-BND-05',
                        'Dual High-Bearing Speed Cable'
                      )}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-['Oswald',sans-serif] text-xs uppercase px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 font-bold shadow-md shadow-blue-600/30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>QUICK ADD</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            6. EQUIPMENT INNOVATION HIGHLIGHT / EXPLODED BLUEPRINT SECTION
            ========================================================================= */}
        <section className="w-full py-14 lg:py-20 font-['Inter',sans-serif]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="luxury-glass-card rounded-3xl p-6 sm:p-10 lg:p-14 overflow-hidden relative shadow-2xl border border-white/10">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-cyan-400 font-['Oswald',sans-serif] text-xs tracking-wider font-bold uppercase">
                    <span className="material-symbols-outlined text-[20px]">science</span>
                    <span>KINETIC LAB TELEMETRY • HAUTE SPEC</span>
                  </div>

                  <h2 className="font-['Oswald',sans-serif] text-3xl sm:text-4xl uppercase text-white leading-tight font-bold">
                    RE-ENGINEERED COMPOSITE GRIP ARCHITECTURE
                  </h2>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    Standard balls lose up to 34% of friction coefficient under high game sweat conditions. Our proprietary compound uses moisture-activated polymers that pull dampness into capillary channels while locking the palm skin to the grain.
                  </p>
                  
                  <div className="flex flex-col gap-3.5 pt-2">
                    {/* Spec item 1 */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">texture</span>
                      </div>
                      <div>
                        <h4 className="font-['Oswald',sans-serif] text-base font-bold uppercase text-white">Micro-Pore Composite Leather</h4>
                        <p className="text-xs text-slate-400">0.8mm deep pebble depth ensures instant palm suction on catch-and-shoot motion.</p>
                      </div>
                    </div>

                    {/* Spec item 2 */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">rebase_edit</span>
                      </div>
                      <div>
                        <h4 className="font-['Oswald',sans-serif] text-base font-bold uppercase text-white">Kinetic Seam Reinforcement</h4>
                        <p className="text-xs text-slate-400">Double-vulcanized recessed channels provide rapid rotation feedback to fingers.</p>
                      </div>
                    </div>

                    {/* Spec item 3 */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">water_drop</span>
                      </div>
                      <div>
                        <h4 className="font-['Oswald',sans-serif] text-base font-bold uppercase text-white">Moisture Wicking Sub-Membrane</h4>
                        <p className="text-xs text-slate-400">Absorbs court-sweat droplet layers instantly without compromising air retention core.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Telemetry Data Visualization & Ball Visual */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center">
                  <div className="relative w-full max-w-md aspect-square flex items-center justify-center bg-slate-950/80 rounded-full border border-cyan-500/30 p-8 shadow-inner">
                    {/* Circular Radar Background */}
                    <svg className="absolute inset-0 w-full h-full text-cyan-500/20 animate-[spin_60s_linear_infinite]" fill="none" viewBox="0 0 400 400">
                      <circle cx="200" cy="200" r="190" stroke="currentColor" strokeDasharray="4 6" strokeWidth="1.5" />
                      <circle cx="200" cy="200" opacity="0.4" r="140" stroke="currentColor" strokeWidth="1" />
                      <circle cx="200" cy="200" r="85" stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" />
                      <line opacity="0.3" stroke="currentColor" strokeWidth="1" x1="200" x2="200" y1="0" y2="400" />
                      <line opacity="0.3" stroke="currentColor" strokeWidth="1" x1="0" x2="400" y1="200" y2="200" />
                    </svg>
                    
                    <img 
                      alt="Exploded view laboratory analysis" 
                      className="w-4/5 h-4/5 object-contain relative z-10 drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] cursor-pointer hover:scale-108 transition-transform duration-500" 
                      onClick={() => {
                        navigateTo('kinetic-product');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9L3ZmYQp96vADB7mYPf0-f-gpaq32R1oRtdNiCQ-iIwnoH_TcLkdUdTgu4QzmFEAxn4FI5Wm1_8l-HnOQkHUPP6bLWguNabWObFyZJxyPIC7tcKzH90-nmM-AXC2aUpsOB6De7m7q6uBd7cFJX7CQ-cDoPEikzjYRocC2A3IcKhS6AUQY_NT4862tIU3XXjvN5NNuDcUw9DpbTd2ZF0MTvIY9ZDzNINoo97R2NLTYMxeCCz8OEAy2xA"
                    />

                    {/* Floating Data Badges */}
                    <div className="absolute top-4 right-2 sm:right-6 z-20 luxury-glass-card border border-cyan-400/40 p-3 sm:p-4 rounded-2xl shadow-xl">
                      <span className="font-['Oswald',sans-serif] text-[10px] text-cyan-300 block font-bold uppercase tracking-wider">COEFFICIENT OF FRICTION</span>
                      <span className="font-['Oswald',sans-serif] text-2xl text-white font-bold">0.92 μ</span>
                      <span className="text-[11px] text-emerald-400 block font-medium">+28% over FIBA minimum</span>
                    </div>

                    <div className="absolute bottom-4 left-2 sm:left-6 z-20 luxury-glass-card border border-white/15 p-3 sm:p-4 rounded-2xl shadow-xl">
                      <span className="font-['Oswald',sans-serif] text-[10px] text-slate-400 block font-bold uppercase tracking-wider">DAMP GRIP RETENTION</span>
                      <span className="font-['Oswald',sans-serif] text-2xl text-amber-300 font-bold">94.6%</span>
                      <span className="text-[11px] text-slate-400 block">Sweat chamber test #804</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. ATHLETE FIELD REVIEW BANNER
            ========================================================================= */}
        <section className="w-full py-14 lg:py-20 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="luxury-glass-card rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden flex flex-col lg:flex-row items-center gap-8 lg:gap-14 text-white shadow-2xl border border-white/15">
              
              <div className="w-full lg:w-1/3 aspect-[4/5] rounded-2xl overflow-hidden relative shrink-0 border border-white/10">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7LHRyqL1k3_hAYZ_axtaM_SGWDSgCuh4apqi9CXCy7TqKvb0ec1hmoUgMThnNbg2ULeR5A63bPm_i_IDRFYZKLurZ5QMMin4AB--dSk4iEG60ItjV8cHyYfYHSbcR7lPm-K7ZSREiIH-z4Sxa0hMAySMbnvidDnM7D3byZO_Z0VRmB-b8ybw2SiYhXTB_LNhVbinq114zX6duSPLz2N4Oq_myO9grJinyoWQVDQ6Zl3QOSrZ9ziOhrw')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="font-['Oswald',sans-serif] text-lg font-bold text-white uppercase block">MARCUS VANCE</span>
                  <span className="font-['Oswald',sans-serif] text-xs text-cyan-400 uppercase font-bold tracking-wider">
                    HEAD OF PLAYER RECOVERY • PACIFIC PRO LAB
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="font-['Oswald',sans-serif] text-xs text-amber-300 ml-2 tracking-wider font-bold uppercase">
                    VERIFIED ATELIER COURT TEST REPORT
                  </span>
                </div>

                <blockquote className="font-['Oswald',sans-serif] text-2xl sm:text-3xl lg:text-4xl uppercase text-white leading-tight font-bold">
                  “WHEN OUR GUYS ARE RUNNING FOURTH-QUARTER TWO-A-DAYS IN 85% ARENA HUMIDITY, BALL CONTROL COMES DOWN TO MOLECULAR TACK. KINETIC GEAR IS THE ONLY EQUIPMENT WE DON’T HAVE TO WIPE DOWN BETWEEN TIMEOUTS.”
                </blockquote>

                <div className="grid grid-cols-3 gap-6 pt-2 max-w-lg">
                  <div>
                    <span className="font-['Oswald',sans-serif] text-3xl sm:text-4xl text-cyan-400 leading-none block font-bold">250+</span>
                    <span className="font-['Oswald',sans-serif] text-[11px] text-slate-400 uppercase mt-1 block font-semibold tracking-wider">HOURS COURT LOGGED</span>
                  </div>
                  <div>
                    <span className="font-['Oswald',sans-serif] text-3xl sm:text-4xl text-white leading-none block font-bold">0%</span>
                    <span className="font-['Oswald',sans-serif] text-[11px] text-slate-400 uppercase mt-1 block font-semibold tracking-wider">SEAM DELAMINATION</span>
                  </div>
                  <div>
                    <span className="font-['Oswald',sans-serif] text-3xl sm:text-4xl text-amber-300 leading-none block font-bold">4.9/5</span>
                    <span className="font-['Oswald',sans-serif] text-[11px] text-slate-400 uppercase mt-1 block font-semibold tracking-wider">PLAYER TACK SCORE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. COMPLETE COURT BUNDLE BUILDER STRIP
            ========================================================================= */}
        <section className="w-full py-14 lg:py-20" id="bundles">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="luxury-glass-card text-white rounded-3xl p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-cyan-400/30 bg-gradient-to-r from-blue-950/70 via-slate-900/90 to-blue-900/70">
              <div className="flex flex-col gap-2 max-w-2xl">
                <span className="font-['Oswald',sans-serif] text-xs text-amber-300 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  SAVE 20% WITH PRE-PACKAGED COMBOS • FREE VAULT BOX
                </span>
                <h3 className="font-['Oswald',sans-serif] text-3xl sm:text-4xl uppercase text-white leading-none font-bold">
                  THE PRO BAG LOADOUT
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Includes Pro Grip Composite Game Ball + Dual Arm Sleeves + Knee Support Pair + 32oz Insulated Stainless Steel Flask in one coordinated kit. Hand-inspected and sealed.
                </p>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="flex flex-col text-right">
                  <span className="text-xs text-slate-400 line-through font-mono">$178.00 REGULAR</span>
                  <span className="font-['Oswald',sans-serif] text-3xl sm:text-4xl text-amber-300 leading-none font-bold">$139.00</span>
                </div>
                <button 
                  onClick={() => {
                    handleQuickAdd(
                      'The Pro Bag Loadout', 
                      139.00, 
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZUXZb6LJGdWQBG3DL3nmXSxL6CrH50U3oOdmyLmdNwbN_L6BYzF7LaT11PJ7soMqQb-hA5e6mAqlYQKfrLgxXrfglUGXSkW9l0ZDcsAeHIXw-hQmSob_rl_A-k8my4Vwg1RD4COIQ8rzjt8ty1o85EiE1slqbe9rZ-CJbEkC6YprVivg80CSjNks__ZQv87Er-em9hUQFI-LjwqfCb9Of-JUJLB-kRF3D86UGwlrWpKHS_AWWuUgaIg',
                      'KNT-BND-PRO',
                      'Complete 4-Piece Equipment Kit'
                    );
                    navigateTo('kinetic-cart');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-['Oswald',sans-serif] text-base uppercase px-7 py-4 rounded-xl transition-all flex items-center gap-2 shadow-2xl font-bold tracking-wider"
                >
                  <span>CLAIM BUNDLE</span>
                  <span className="material-symbols-outlined text-[20px]">shopping_cart_checkout</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Golden VIP Scratch Card Modal with Realistic Scratching & Fanfare Sounds */}
      <BasketballScratchModal
        isOpen={isScratchOpen}
        onClose={() => setIsScratchOpen(false)}
        onRegister={() => {
          setIsScratchOpen(false);
          navigateTo('kinetic-cart');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Interactive Toast Notification Element */}
      {toastInfo && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 flex items-center gap-3 bg-slate-900/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-cyan-400/40 backdrop-blur-md animate-slide-up">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="flex flex-col">
            <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase tracking-wider text-white">
              {toastInfo.title}
            </span>
            <span className="text-xs text-slate-300 font-['Inter',sans-serif]">
              {toastInfo.desc}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
