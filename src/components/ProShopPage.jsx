import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, Star, Heart, User, ChevronDown, 
  Truck, RefreshCw, Lock, Headset, ArrowRight, Play
} from 'lucide-react';
import StrategyLogo from './StrategyLogo';

const MOCK_PRODUCTS = [
  {
    id: 'prod_1',
    category: 'Running',
    title: 'Nike Air Zoom Pegasus 40',
    price: 129.99,
    rating: 5,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'prod_2',
    category: 'Basketball',
    title: 'Wilson Evolution Pro Ball',
    price: 89.99,
    rating: 5,
    reviews: 96,
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'prod_3',
    category: 'Fitness',
    title: 'Elite Adjustable Dumbbell System',
    price: 299.99,
    rating: 5,
    reviews: 83,
    image: 'https://images.unsplash.com/photo-1638202375968-3e4b7863e46c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'prod_4',
    category: 'Football',
    title: 'Adidas Predator Elite Cleats',
    price: 249.99,
    rating: 5,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1611311545624-9bbf1ff9b744?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'prod_5',
    category: 'Sportswear',
    title: 'Pro-Tech Performance Hoodie',
    price: 110.00,
    rating: 5,
    reviews: 110,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'prod_6',
    category: 'Tennis',
    title: 'Babolat Pure Aero Carbon',
    price: 219.99,
    rating: 5,
    reviews: 72,
    image: 'https://images.unsplash.com/photo-1622279457486-69d73ce18722?auto=format&fit=crop&q=80&w=600'
  }
];

const HERO_BANNERS = [
  {
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2000',
    subtitle: 'Season 2026 Collection',
    title: 'Push Your\nBoundaries',
    description: 'Engineered for the elite. Discover our most advanced performance gear designed to help you break every record.'
  },
  {
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=2000',
    subtitle: 'Pro Running Series',
    title: 'Defy\nGravity',
    description: 'Experience weightless performance with our new aerodynamic running collection.'
  },
  {
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=2000',
    subtitle: 'Elite Training',
    title: 'Unleash\nPower',
    description: 'Build absolute strength with precision-engineered training equipment and apparel.'
  },
  {
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&q=80&w=2000',
    subtitle: 'Hardwood Classics',
    title: 'Own The\nCourt',
    description: 'Dominate the game with our professional-grade basketball footwear and accessories.'
  },
  {
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=2000',
    subtitle: 'Footwear Innovation',
    title: 'Step Into\nThe Future',
    description: 'The next generation of athletic footwear is here. Unmatched comfort and speed.'
  }
];

const SPORTS_CATEGORIES = [
  { name: 'Basketball', image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&q=80&w=150' },
  { name: 'Football', image: 'https://images.unsplash.com/photo-1611311545624-9bbf1ff9b744?auto=format&fit=crop&q=80&w=150' },
  { name: 'Running', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=150' },
  { name: 'Training', image: 'https://images.unsplash.com/photo-1638202375968-3e4b7863e46c?auto=format&fit=crop&q=80&w=150' },
  { name: 'Tennis', image: 'https://images.unsplash.com/photo-1622279457486-69d73ce18722?auto=format&fit=crop&q=80&w=150' },
  { name: 'Cycling', image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=150' },
  { name: 'Apparel', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=150' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?auto=format&fit=crop&q=80&w=150' }
];

export default function ProShopPage({ onAddToCart }) {
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#fafafa] text-black font-['Plus_Jakarta_Sans'] min-h-screen relative z-[100] pb-20">
      
      {/* 1. Ultra-Premium Top Announcement Banner */}
      <div className="bg-black text-white py-2.5 px-4 text-[11px] font-bold tracking-widest uppercase flex justify-center items-center w-full relative z-20">
        <div className="max-w-7xl mx-auto w-full flex justify-between px-4 md:px-8">
          <div className="flex items-center gap-2 opacity-80"><Truck size={14}/> Complimentary Shipping Over $150</div>
          <div className="hidden md:flex items-center gap-2 opacity-80"><RefreshCw size={14}/> 30-Day Elite Returns</div>
          <div className="hidden sm:flex items-center gap-2 opacity-80"><Lock size={14}/> Secure Checkout</div>
        </div>
      </div>

      {/* 2. Premium Minimalist Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Logo */}
          <div className="flex items-center shrink-0 cursor-pointer">
            <StrategyLogo variant="full" theme="light" size="lg" />
          </div>

          {/* Search (Sleek & Minimal) */}
          <div className="flex-1 max-w-xl w-full mx-8 flex items-center border-b-2 border-gray-200 focus-within:border-black transition-colors pb-2">
            <Search size={18} className="text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search premium collections..." 
              className="flex-1 bg-transparent text-sm font-medium outline-none text-black placeholder-gray-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-8 shrink-0">
            <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors">
              <User size={20} strokeWidth={2.5} /> <span className="hidden lg:inline">Sign In</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors">
              <Heart size={20} strokeWidth={2.5} /> <span className="hidden lg:inline">Wishlist</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors relative group">
              <div className="relative">
                <ShoppingCart size={20} strokeWidth={2.5} className="group-hover:text-black" />
                <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  1
                </span>
              </div>
              <span className="hidden lg:inline">Cart</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation (Editorial Style) */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center gap-10 text-[13px] font-extrabold uppercase tracking-widest text-gray-400 overflow-x-auto">
          <a href="#" className="text-black border-b-2 border-black pb-1 whitespace-nowrap">New Arrivals</a>
          <a href="#" className="hover:text-black transition-colors whitespace-nowrap">Footwear</a>
          <a href="#" className="hover:text-black transition-colors whitespace-nowrap">Apparel</a>
          <a href="#" className="hover:text-black transition-colors whitespace-nowrap">Equipment</a>
          <a href="#" className="hover:text-black transition-colors whitespace-nowrap">Collections</a>
          <a href="#" className="hover:text-black transition-colors whitespace-nowrap text-red-500">Sale</a>
        </div>
      </div>

      {/* 3. Massive Immersive Hero Banner Carousel */}
      <div className="w-full relative h-[70vh] min-h-[600px] bg-black overflow-hidden flex items-center">
        {HERO_BANNERS.map((banner, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Cinematic Background Image */}
            <div className="absolute inset-0">
              <img 
                src={banner.image} 
                alt={`Hero Banner ${index + 1}`} 
                className={`w-full h-full object-cover object-center opacity-60 transform transition-transform duration-[10s] ease-out ${index === activeBanner ? 'scale-100' : 'scale-110'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            </div>
            
            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center">
              <div className={`max-w-2xl transform transition-all duration-700 delay-300 ${index === activeBanner ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-black text-[10px] font-black tracking-widest uppercase mb-6">
                  <span>{banner.subtitle}</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6 uppercase whitespace-pre-line">
                  {banner.title}
                </h1>
                <p className="text-lg text-gray-300 font-medium mb-10 max-w-md leading-relaxed">
                  {banner.description}
                </p>
                <div className="flex items-center gap-4">
                  <button className="bg-white text-black px-10 py-4 text-sm font-black uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-3 group">
                    Shop Collection
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-transparent border border-white/30 text-white px-8 py-4 text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-3">
                    <Play size={16} /> Watch Film
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
          {HERO_BANNERS.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveBanner(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeBanner ? 'w-10 bg-white' : 'w-4 bg-white/40 hover:bg-white/70'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 4. Sleek Category Nav */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex items-center justify-between mb-10 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-black tracking-tighter uppercase">Explore By Sport</h2>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
          {SPORTS_CATEGORIES.map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-4 cursor-pointer group">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gray-100 relative shadow-sm">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </div>
              <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-black transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Premium Product Grid */}
      <div className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black tracking-tighter uppercase">Trending Now</h2>
            <a href="#" className="text-sm font-bold border-b-2 border-black pb-1 hover:text-gray-500 transition-colors uppercase tracking-widest">
              View All Gear
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-8 gap-y-16">
            {MOCK_PRODUCTS.map((prod) => (
              <div key={prod.id} className="group relative flex flex-col cursor-pointer">
                
                {/* Premium Image Container */}
                <div className="aspect-[4/5] bg-[#f4f4f4] rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center p-8">
                  <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10 transition-colors">
                    <Heart size={24} strokeWidth={2} />
                  </button>
                  <img 
                    src={prod.image} 
                    alt={prod.title} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-xl" 
                  />
                  
                  {/* Hover Add to Cart Button */}
                  <div className="absolute bottom-4 left-4 right-4 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart && onAddToCart({...prod, price: prod.price, title: prod.title});
                      }}
                      className="w-full bg-black text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 shadow-xl"
                    >
                      Quick Add <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col px-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{prod.category}</span>
                    <div className="flex items-center gap-1">
                      <Star size={12} fill="black" className="text-black" />
                      <span className="text-[11px] font-bold text-gray-900">{prod.rating}.0</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-black leading-tight mb-2 group-hover:underline">{prod.title}</h3>
                  <div className="text-lg font-black text-gray-600">${prod.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Editorial Promo Banners */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto md:h-[500px]">
          
          {/* Main Large Promo */}
          <div className="bg-black rounded-3xl overflow-hidden relative group">
            <img 
              src="https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&q=80&w=1000" 
              alt="Summer Collection" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-10 text-white">
              <span className="text-[10px] font-black tracking-widest uppercase mb-2 text-gray-300">New Arrival</span>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-none">The Summer <br/> Advantage</h3>
              <p className="text-sm text-gray-300 font-medium max-w-sm mb-6 leading-relaxed">Experience unparalleled breathability and lightweight design in our new apparel line.</p>
              <button className="self-start bg-white text-black px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-colors">
                Shop Collection
              </button>
            </div>
          </div>

          {/* Side Promos Stacked */}
          <div className="flex flex-col gap-8 h-full">
            <div className="flex-1 bg-[#f4f4f4] rounded-3xl p-8 relative overflow-hidden group flex items-center">
              <div className="relative z-10 w-1/2">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2 leading-tight">Elite <br/> Footwear</h3>
                <a href="#" className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-0.5 hover:text-gray-500 transition-colors">Shop Shoes</a>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-2/3">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600" alt="Shoe" className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 translate-x-12" />
              </div>
            </div>

            <div className="flex-1 bg-[#1a1a1a] rounded-3xl p-8 relative overflow-hidden group flex items-center text-white">
              <div className="relative z-10 w-1/2">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2 leading-tight">Pro <br/> Accessories</h3>
                <a href="#" className="text-xs font-black uppercase tracking-widest border-b-2 border-white pb-0.5 hover:text-gray-300 transition-colors">Shop Gear</a>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-2/3">
                <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600" alt="Bag" className="w-full h-full object-contain mix-blend-luminosity brightness-150 group-hover:scale-110 transition-transform duration-500 translate-x-12" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 7. Value Props (Minimalist) */}
      <div className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Truck size={20} className="text-black" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest mb-1">Free Delivery</h4>
                <p className="text-[12px] text-gray-500 font-medium">On all orders over $150</p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <RefreshCw size={20} className="text-black" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest mb-1">Easy Returns</h4>
                <p className="text-[12px] text-gray-500 font-medium">30 days seamless return</p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Lock size={20} className="text-black" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest mb-1">Secure Payment</h4>
                <p className="text-[12px] text-gray-500 font-medium">Encrypted checkout</p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Headset size={20} className="text-black" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest mb-1">24/7 Concierge</h4>
                <p className="text-[12px] text-gray-500 font-medium">Premium support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
