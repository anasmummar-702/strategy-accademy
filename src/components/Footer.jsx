import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles,
  Award
} from 'lucide-react';

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
}

function TwitterIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon>
    </svg>
  );
}

export default function Footer({ onNavigate }) {
  const shopLinks = [
    { label: 'All Products', tab: 'shop' },
    { label: 'New Arrivals', tab: 'shop-new' },
    { label: 'Best Sellers', tab: 'shop-best' },
    { label: 'Special Edition', tab: 'special-edition' }
  ];

  const sportsLinks = [
    { label: 'Basketball', tab: 'category-basketball' },
    { label: 'Football', tab: 'category-football' },
    { label: 'Cricket', tab: 'category-cricket' },
    { label: 'Running', tab: 'category-running' },
    { label: 'Fitness', tab: 'category-fitness' },
    { label: 'Skating', tab: 'category-skating' },
    { label: 'Tennis', tab: 'category-tennis' }
  ];

  const companyLinks = [
    { label: 'About Strategy', tab: 'about-strategy' },
    { label: 'Our Story', tab: 'about-strategy' },
    { label: 'Contact Support', tab: 'contact' },
    { label: 'Careers', tab: 'careers' }
  ];

  const serviceLinks = [
    { label: 'Returns & Refunds (3-Day)', tab: 'returns' },
    { label: 'Shipping Policy', tab: 'shipping' },
    { label: 'FAQs', tab: 'faqs' },
    { label: 'Privacy Policy', tab: 'privacy' },
    { label: 'Terms & Conditions', tab: 'terms' }
  ];

  return (
    <footer className="w-full bg-[#030717] text-slate-300 pt-16 sm:pt-20 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10 pb-16 border-b border-slate-800/80">
          
          {/* Brand Column (Spans 2 cols on lg) */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-lg shadow-md">
                S
              </div>
              <span className="text-2xl font-black tracking-wider text-white">
                STRATEGY
              </span>
            </div>

            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm mb-6">
              A sports-focused company with 10+ years of proven market experience. Equipping athletes with elite sportswear, tournament-grade equipment, and championship mindset.
            </p>

            <div className="flex items-center gap-3 text-slate-400">
              <a 
                href="#instagram" 
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a 
                href="#facebook" 
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a 
                href="#twitter" 
                aria-label="Twitter"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a 
                href="#youtube" 
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* SHOP Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate && onNavigate(link.tab)}
                    className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* SPORTS Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">
              SPORTS
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              {sportsLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate && onNavigate(link.tab)}
                    className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY & CUSTOMER SERVICE Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium mb-6">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate && onNavigate(link.tab)}
                    className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-3">
              HELP & POLICIES
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate && onNavigate(link.tab)}
                    className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">
              CONTACT
            </h4>
            <div className="space-y-3 text-xs sm:text-sm font-medium text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Al Nahyan & Marina Arenas, Abu Dhabi / Dubai, UAE</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>+971 50 123 4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>support@strategy.com</span>
              </div>

              <div className="pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-[10px] font-bold text-blue-300">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  <span>Verified 10+ Yr Operation</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 STRATEGY. All Rights Reserved. Engineered for champions.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button onClick={() => onNavigate && onNavigate('returns')} className="hover:text-slate-300 transition-colors cursor-pointer font-bold text-blue-400">
              3-Day Return Policy
            </button>
            <button onClick={() => onNavigate && onNavigate('privacy')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate && onNavigate('terms')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Terms & Conditions
            </button>
            <button onClick={() => onNavigate && onNavigate('shipping')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Shipping & Delivery
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
