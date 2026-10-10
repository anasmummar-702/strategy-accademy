import React, { useState, useEffect } from 'react';
import KineticHeader from './KineticHeader';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Bookmark, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  HelpCircle, 
  Lock, 
  RefreshCw, 
  Headphones, 
  AlertCircle,
  X,
  Send,
  Sparkles,
  Gift,
  Heart,
  Crown,
  Award,
  Info
} from 'lucide-react';

export default function KineticCartPage({
  navigateTo,
  cartItems = [],
  updateQuantity,
  removeItem,
  clearCart,
  onAddToCart,
  totalCartCount
}) {
  // Fallback items matching screenshot 2 if cart is initially standard
  const defaultFallbackItems = [
    {
      id: 'knt-ball-07',
      badge: 'SIZE 7',
      tag: 'FIBA SPEC • SKU: KNT-BALL-07',
      title: 'KINETIC PRO GRIP COMPOSITE BASKETBALL',
      color: 'Color: Stealth Black / Kinetic Orange',
      spec: 'Spec: Deep-Channel Pebbled',
      price: 74.00,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9L3ZmYQp96vADB7mYPf0-f-gpaq32R1oRtdNiCQ-iIwnoH_TcLkdUdTgu4QzmFEAxn4FI5Wm1_8l-HnOQkHUPP6bLWguNabWObFyZJxyPIC7tcKzH90-nmM-AXC2aUpsOB6De7m7q6uBd7cFJX7CQ-cDoPEikzjYRocC2A3IcKhS6AUQY_NT4862tIU3XXjvN5NNuDcUw9DpbTd2ZF0MTvIY9ZDzNINoo97R2NLTYMxeCCz8OEAy2xA'
    },
    {
      id: 'knt-slv-02',
      badge: 'SIZE L',
      tag: 'GRADUATED COMPRESSION • SKU: KNT-SLV-02',
      title: 'KINETIC COMPRESSION KNEE SLEEVE',
      color: 'Color: Pitch Black / High-Vis Orange',
      spec: 'Size: Large (15"-17" Patella)',
      price: 48.00,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMCD0ioJesMTlcwECiCDSSIjhQKQt8SQggX83W0iabABuDP8DTBtWexCSiv9VjvGHEeMcUi9Atjo2xUMWY275y5ON61v-Bt3NUNFnn5o_v6tSr1njMf6i3g3Z-T4x6IJWQBvgoNZlAMtZu18llr6XEvn1zUcZMJtpUhkb_Kg9vn05vyNDBrmH7psXx5QB9Qe6sNDsM17HzRMveHxIw2h5_EfiAhwW3KBILz5pGX8g0CwL-pFVK8Xfqcw'
    },
    {
      id: 'knt-bnd-3p',
      badge: '3-PACK',
      tag: 'LATEX REINFORCED • SKU: KNT-BND-3P',
      title: 'HEAVY RESISTANCE LOOP BANDS 3-PACK',
      color: 'Tension: Light, Medium, Heavy',
      spec: 'Profile: Non-Slip Textured Grip',
      price: 32.00,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTRmxivhzkzTtL23uDHgWgneTQRX_zUhLNYqI-IY_4NQmkjbpuxlaFF_IluXfe5WgYmKeNOuhzVFR27U9T-p-XL_-JFyyg45QU3OUC1NOFVi9756RBzyEqQgy2eaUyMAKmxAXtJ3LjX3zym7JFxLTPR7YefzliHZ05kIBXxLA-jbsXXNbt4-vxxBoIU_x5WUejq3pbLihbvyAhRR4wdaBHr8HEE-UbZAbfIghsLMZwnfCeRKbYSiJ-1Q'
    }
  ];

  const currentCart = (cartItems && cartItems.length > 0) ? cartItems : defaultFallbackItems;
  const [items, setItems] = useState(currentCart);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setItems(cartItems);
    }
  }, [cartItems]);

  const [promoCode, setPromoCode] = useState('COURT10');
  const [isPromoApplied, setIsPromoApplied] = useState(true);
  const [promoError, setPromoError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [includeGiftWrap, setIncludeGiftWrap] = useState(true);
  const [savedItems, setSavedItems] = useState([]);
  
  const [chatMessages, setChatMessages] = useState([
    { 
      sender: 'scout', 
      text: '✨ Welcome to Kinetic Atelier Concierge! I am Coach Dave. Need guidance on ball circumference, compression sleeve sizing, or custom gift embossing?' 
    }
  ]);
  const [inputChat, setInputChat] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Quantity controllers
  const handleQtyChange = (id, delta) => {
    const targetItem = items.find((i) => i.id === id);
    if (!targetItem) return;
    const nextQty = Math.max(1, (targetItem.quantity || 1) + delta);
    
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: nextQty } : item))
    );

    if (updateQuantity) {
      updateQuantity(id, nextQty);
    }
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (removeItem) {
      removeItem(id);
    }
    triggerToast('Item removed from courier staging');
  };

  const handleClearAll = () => {
    setItems([]);
    if (clearCart) clearCart();
    triggerToast('Cleared all locker items');
  };

  const handleSaveForLater = (item) => {
    if (!savedItems.includes(item.id)) {
      setSavedItems([...savedItems, item.id]);
    }
    triggerToast(`★ Saved "${item.title}" to your Private Atelier Vault!`);
  };

  // Add quick upsell
  const handleAddUpsell = (upsell) => {
    const exists = items.find((i) => i.id === upsell.id);
    if (exists) {
      handleQtyChange(upsell.id, 1);
    } else {
      setItems((prev) => [...prev, { ...upsell, quantity: 1 }]);
      if (onAddToCart) {
        onAddToCart(upsell);
      }
    }
    triggerToast(`Added ${upsell.title} to order`);
  };

  // Totals calculations
  const totalUnits = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);
  const discountRate = isPromoApplied ? 0.10 : 0;
  const discountAmount = subtotal * discountRate;
  const taxRate = 0.08;
  const estimatedTax = (subtotal - discountAmount) * taxRate;
  const grandTotal = subtotal - discountAmount + estimatedTax;

  const handleApplyPromo = () => {
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'COURT10' || clean === 'STRATEGY10' || clean === 'ATELIER10' || clean === 'HOOPSVIP') {
      setIsPromoApplied(true);
      setPromoError('');
      triggerToast('★ Atelier VIP Promo code applied (10% OFF)');
    } else {
      setIsPromoApplied(false);
      setPromoError('Invalid voucher code. Try "COURT10"');
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputChat.trim()) return;
    const userMsg = inputChat.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputChat('');
    setTimeout(() => {
      let reply = "I've logged your spec request! All Size 7 balls are FIBA 29.5-inch competition weight. Would you like our master craftsman to pre-condition the grip tack before courier sealing?";
      if (userMsg.toLowerCase().includes('gift') || userMsg.toLowerCase().includes('box')) {
        reply = "🎁 Absolutely! The complimentary Hardwood Vault Case and velvet dust bag are included at $0 with every order today.";
      } else if (userMsg.toLowerCase().includes('sleeve') || userMsg.toLowerCase().includes('size')) {
        reply = "📏 For our Graduated Compression Sleeve: Measure around your patella. Size M fits 13-15 inches, Size L fits 15-17 inches. It provides 20-30 mmHg targeted support!";
      } else if (userMsg.toLowerCase().includes('ship') || userMsg.toLowerCase().includes('time')) {
        reply = "⚡ Orders placed before 3:00 PM MT are staged immediately for same-day climate-controlled courier pickup!";
      }
      setChatMessages((prev) => [...prev, { sender: 'scout', text: reply }]);
    }, 750);
  };

  return (
    <div className="w-full bg-[#04060f] min-h-screen text-slate-100 font-['Inter',sans-serif] selection:bg-blue-600 selection:text-white luxury-ambient-mesh relative overflow-hidden pb-24">
      {/* Top Header */}
      <KineticHeader 
        activeTab="kinetic-cart"
        navigateTo={navigateTo}
        cartCount={totalUnits}
      />

      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 relative z-10">
        
        {/* =========================================================================
            LUXURY ATELIER PROGRESS PIPELINE (ADORABLE & HIGH-END)
            ========================================================================= */}
        <div className="luxury-glass-card rounded-2xl p-4 mb-8 border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-300">
              ATELIER DISPATCH PIPELINE:
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs font-['Oswald',sans-serif] tracking-wider uppercase">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-[11px]">1</span>
              <span>Vault Staged</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <span className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-[11px]">2</span>
              <span>Velvet Sealed</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-[11px]">3</span>
              <span>Armored Courier</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EST. FLIGHT DISPATCH: WITHIN 24H</span>
          </div>
        </div>

        {/* =========================================================================
            CART PAGE HEADER (MATCHES SCREENSHOT 2 + ATELIER ELEVATION)
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <h1 className="font-['Oswald',sans-serif] text-3xl sm:text-4xl lg:text-5xl uppercase font-bold text-white tracking-tight">
              GEAR STAGED FOR COURIER
            </h1>
            <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-['Oswald',sans-serif] text-xs font-bold uppercase tracking-wider shadow-sm">
              {totalUnits} UNITS
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                navigateTo('kinetic-product');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-cyan-400 hover:text-cyan-300 text-xs font-['Oswald',sans-serif] uppercase font-bold tracking-wider flex items-center gap-1 transition-colors"
            >
              <span>+ Add More Gear</span>
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={handleClearAll}
              className="text-slate-400 hover:text-rose-400 text-xs font-['Oswald',sans-serif] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            MAIN 2-COLUMN CHECKOUT STAGING (LEFT ITEMS + RIGHT ORDER SUMMARY)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: CART ITEMS LIST + UPSELLS (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {items.length === 0 ? (
              <div className="luxury-glass-card rounded-3xl border border-white/10 p-12 text-center flex flex-col items-center justify-center shadow-2xl">
                <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-4xl text-cyan-400">inventory_2</span>
                </div>
                <h3 className="font-['Oswald',sans-serif] text-2xl font-bold uppercase text-white tracking-wide">
                  YOUR COURIER STAGING IS EMPTY
                </h3>
                <p className="text-sm text-slate-400 max-w-sm mt-2 mb-6 leading-relaxed">
                  Add FIBA-standard game balls, kinetic compression sleeves, or loop bands to stage your atelier equipment.
                </p>
                <button
                  onClick={() => {
                    navigateTo('kinetic-product');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-['Oswald',sans-serif] text-sm font-bold uppercase px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 tracking-wider flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>BROWSE PRO ATELIER GEAR</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id}
                    className="luxury-glass-card rounded-3xl border border-white/10 p-5 sm:p-6 shadow-xl hover:border-cyan-400/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group"
                  >
                    {/* Item Thumbnail with Badge */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-950/80 border border-white/10 shrink-0 flex items-center justify-center p-2.5 shadow-inner">
                      <span className="absolute top-2 left-2 z-10 bg-slate-900/90 border border-white/15 backdrop-blur-md text-amber-300 font-['Oswald',sans-serif] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {item.badge || item.size || 'PRO'}
                      </span>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Item Info Specs */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-['Oswald',sans-serif] text-[11px] font-bold text-cyan-400 uppercase tracking-widest block">
                          {item.tag || `SKU: ${item.sku || 'KNT-01'}`}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-['Oswald',sans-serif] font-bold bg-amber-400/10 text-amber-300 border border-amber-300/30 uppercase tracking-wider">
                          ★ ATELIER SPEC
                        </span>
                      </div>

                      <h3 className="font-['Oswald',sans-serif] text-lg sm:text-xl font-bold uppercase text-white leading-snug truncate group-hover:text-cyan-200 transition-colors">
                        {item.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-300">
                        {item.color && <span>{item.color}</span>}
                        {item.spec && <span className="text-slate-400">• {item.spec}</span>}
                      </div>

                      {/* Adorable Complimentary Packaging Stamp */}
                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-300/90 font-medium">
                        <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Includes Velvet Dust Pouch & Atelier Wax Seal Certificate</span>
                      </div>

                      {/* Action Links: Save & Remove */}
                      <div className="flex items-center gap-4 mt-3 pt-2 text-xs font-['Oswald',sans-serif] font-bold uppercase text-slate-400 border-t border-white/5">
                        <button 
                          onClick={() => handleSaveForLater(item)}
                          className={`flex items-center gap-1.5 transition-colors ${savedItems.includes(item.id) ? 'text-amber-300 font-bold' : 'hover:text-cyan-300'}`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>{savedItems.includes(item.id) ? 'Saved in Vault' : 'Save'}</span>
                        </button>
                        <span className="text-white/20">|</span>
                        <button 
                          onClick={() => handleRemove(item.id)}
                          className="hover:text-rose-400 flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Quantity Stepper & Price Calculation */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                      <div className="text-right">
                        <div className="font-['Oswald',sans-serif] text-2xl font-bold text-white leading-none">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ${item.price.toFixed(2)} each
                        </span>
                      </div>

                      {/* Stepper with luxury titanium finish */}
                      <div className="flex items-center border border-white/15 rounded-xl bg-slate-900/80 p-1 shadow-inner">
                        <button
                          onClick={() => handleQtyChange(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-['Oswald',sans-serif] font-bold text-sm text-cyan-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 flex items-center justify-center transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* =========================================================================
                ADORABLE COMPLIMENTARY VAULT PACKAGING CARD
                ========================================================================= */}
            <div className="luxury-glass-card rounded-3xl border border-amber-400/30 p-5 sm:p-6 bg-gradient-to-r from-amber-500/10 via-slate-900/40 to-cyan-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Oswald',sans-serif] text-base font-bold uppercase text-white tracking-wider">
                      COMPLIMENTARY ATELIER VAULT BOX & DUST BAG
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-['Oswald',sans-serif] font-bold bg-amber-400/20 text-amber-300 border border-amber-300/40 uppercase">
                      FREE $35 VALUE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Every ball & accessory is hand-wrapped in black velvet with gold foil inspection seal.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-900/90 border border-white/20 hover:border-amber-400 px-4 py-2 rounded-xl transition-all shrink-0">
                <input 
                  type="checkbox" 
                  checked={includeGiftWrap} 
                  onChange={(e) => {
                    setIncludeGiftWrap(e.target.checked);
                    triggerToast(e.target.checked ? 'Added Complimentary Atelier Vault Case!' : 'Removed Vault Case');
                  }} 
                  className="rounded accent-amber-400 w-4 h-4 cursor-pointer"
                />
                <span className="font-['Oswald',sans-serif] text-xs font-bold text-amber-300 uppercase tracking-wider">
                  {includeGiftWrap ? 'APPLIED (FREE)' : 'ADD COMPLIMENTARY'}
                </span>
              </label>
            </div>

            {/* =========================================================================
                FREQUENTLY ADDED COURT GEAR (BUNDLE & ACCELERATE)
                ========================================================================= */}
            <div className="luxury-glass-card rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                  <h3 className="font-['Oswald',sans-serif] text-base font-bold uppercase text-white tracking-wider">
                    FREQUENTLY ADDED COURT GEAR
                  </h3>
                </div>
                <button
                  onClick={() => {
                    handleAddUpsell({
                      id: 'knt-flask-32',
                      badge: '32OZ',
                      tag: 'HYDRATION • SKU: KNT-FLS-32',
                      title: '32OZ INSULATED FLASK',
                      color: 'Color: Matte Black Steel',
                      spec: 'Double-Wall Vacuum 24hr Cold',
                      price: 24.00,
                      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZUXZb6LJGdWQBG3DL3nmXSxL6CrH50U3oOdmyLmdNwbN_L6BYzF7LaT11PJ7soMqQb-hA5e6mAqlYQKfrLgxXrfglUGXSkW9l0ZDcsAeHIXw-hQmSob_rl_A-k8my4Vwg1RD4COIQ8rzjt8ty1o85EiE1slqbe9rZ-CJbEkC6YprVivg80CSjNks__ZQv87Er-em9hUQFI-LjwqfCb9Of-JUJLB-kRF3D86UGwlrWpKHS_AWWuUgaIg'
                    });
                    handleAddUpsell({
                      id: 'knt-spray-slip',
                      badge: '150ML',
                      tag: 'TRACTION • SKU: KNT-SPY-15',
                      title: 'COURT GRIP TRACTION SPRAY',
                      color: 'Formula: Polymer Resin Non-Sticky',
                      spec: 'Restores instant sole grip',
                      price: 14.00,
                      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwweTWBGhngTI89HOtAcgDTjdA1FOTeJa8vru1OKO1MQSfvAfXA12_igU0cCOZOHjVVqO87U0-Ae5dTw-iIIVznJCvq88iZcl7KXg_bUPl6iYjxjyzOlWDz-1FOCJl4ED8R84ZtqAEfB79z-f5PleFqnv3g8erigEgagFEAvvFsNB8O_wbs9_GC821jfEM_cUKR88imuLYfvP-PhnlZHNamc8A2yI3ryOFX9_PCpNh7FfLVRoNYgGjMQ'
                    });
                    triggerToast('★ Added both accelerator items to your cart!');
                  }}
                  className="font-['Oswald',sans-serif] text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>BUNDLE & ACCELERATE</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Upsell 1 */}
                <div className="p-3.5 bg-slate-900/60 border border-white/10 hover:border-cyan-400/30 rounded-2xl flex items-center justify-between gap-3 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZUXZb6LJGdWQBG3DL3nmXSxL6CrH50U3oOdmyLmdNwbN_L6BYzF7LaT11PJ7soMqQb-hA5e6mAqlYQKfrLgxXrfglUGXSkW9l0ZDcsAeHIXw-hQmSob_rl_A-k8my4Vwg1RD4COIQ8rzjt8ty1o85EiE1slqbe9rZ-CJbEkC6YprVivg80CSjNks__ZQv87Er-em9hUQFI-LjwqfCb9Of-JUJLB-kRF3D86UGwlrWpKHS_AWWuUgaIg" 
                      alt="32oz Insulated Flask" 
                      className="w-14 h-14 object-cover rounded-xl bg-slate-950 shrink-0 border border-white/10"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase text-white truncate">
                        32OZ INSULATED FLASK
                      </span>
                      <span className="text-[11px] text-slate-400">Matte Black Steel</span>
                      <span className="font-['Oswald',sans-serif] text-sm font-bold text-cyan-300 mt-0.5">$24.00</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddUpsell({
                      id: 'knt-flask-32',
                      badge: '32OZ',
                      tag: 'HYDRATION • SKU: KNT-FLS-32',
                      title: '32OZ INSULATED FLASK',
                      color: 'Color: Matte Black Steel',
                      spec: 'Double-Wall Vacuum 24hr Cold',
                      price: 24.00,
                      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZUXZb6LJGdWQBG3DL3nmXSxL6CrH50U3oOdmyLmdNwbN_L6BYzF7LaT11PJ7soMqQb-hA5e6mAqlYQKfrLgxXrfglUGXSkW9l0ZDcsAeHIXw-hQmSob_rl_A-k8my4Vwg1RD4COIQ8rzjt8ty1o85EiE1slqbe9rZ-CJbEkC6YprVivg80CSjNks__ZQv87Er-em9hUQFI-LjwqfCb9Of-JUJLB-kRF3D86UGwlrWpKHS_AWWuUgaIg'
                    })}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 font-['Oswald',sans-serif] text-xs font-bold uppercase px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm shrink-0"
                  >
                    <Plus className="w-3 h-3" />
                    <span>ADD</span>
                  </button>
                </div>

                {/* Upsell 2 */}
                <div className="p-3.5 bg-slate-900/60 border border-white/10 hover:border-cyan-400/30 rounded-2xl flex items-center justify-between gap-3 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwweTWBGhngTI89HOtAcgDTjdA1FOTeJa8vru1OKO1MQSfvAfXA12_igU0cCOZOHjVVqO87U0-Ae5dTw-iIIVznJCvq88iZcl7KXg_bUPl6iYjxjyzOlWDz-1FOCJl4ED8R84ZtqAEfB79z-f5PleFqnv3g8erigEgagFEAvvFsNB8O_wbs9_GC821jfEM_cUKR88imuLYfvP-PhnlZHNamc8A2yI3ryOFX9_PCpNh7FfLVRoNYgGjMQ" 
                      alt="Court Grip Traction Spray" 
                      className="w-14 h-14 object-cover rounded-xl bg-slate-950 shrink-0 border border-white/10"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase text-white truncate">
                        COURT GRIP TRACTION SPRAY
                      </span>
                      <span className="text-[11px] text-slate-400">Dust & Slip Repel</span>
                      <span className="font-['Oswald',sans-serif] text-sm font-bold text-cyan-300 mt-0.5">$14.00</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddUpsell({
                      id: 'knt-spray-slip',
                      badge: '150ML',
                      tag: 'TRACTION • SKU: KNT-SPY-15',
                      title: 'COURT GRIP TRACTION SPRAY',
                      color: 'Formula: Polymer Resin Non-Sticky',
                      spec: 'Restores instant sole grip',
                      price: 14.00,
                      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwweTWBGhngTI89HOtAcgDTjdA1FOTeJa8vru1OKO1MQSfvAfXA12_igU0cCOZOHjVVqO87U0-Ae5dTw-iIIVznJCvq88iZcl7KXg_bUPl6iYjxjyzOlWDz-1FOCJl4ED8R84ZtqAEfB79z-f5PleFqnv3g8erigEgagFEAvvFsNB8O_wbs9_GC821jfEM_cUKR88imuLYfvP-PhnlZHNamc8A2yI3ryOFX9_PCpNh7FfLVRoNYgGjMQ'
                    })}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 font-['Oswald',sans-serif] text-xs font-bold uppercase px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm shrink-0"
                  >
                    <Plus className="w-3 h-3" />
                    <span>ADD</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom 3 Trust Pillars with luxury titanium cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="luxury-glass-card border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">sports_basketball</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase text-white leading-none">FIBA CALIBRATED</span>
                  <span className="text-[11px] text-slate-400 mt-1">Laboratory tested specs</span>
                </div>
              </div>

              <div className="luxury-glass-card border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase text-white leading-none">30-DAY COURT TRIAL</span>
                  <span className="text-[11px] text-slate-400 mt-1">Play hard, 100% covered</span>
                </div>
              </div>

              <div className="luxury-glass-card border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase text-white leading-none">SAME-DAY PICK</span>
                  <span className="text-[11px] text-slate-400 mt-1">Orders before 3PM MT</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY CARD (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col gap-5 sticky top-24">
            <div className="luxury-glass-card rounded-3xl border border-white/15 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
              
              {/* Shimmer top border line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-amber-300" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <h3 className="font-['Oswald',sans-serif] text-xl font-bold uppercase text-white tracking-tight">
                    ORDER SUMMARY
                  </h3>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[20px]">receipt_long</span>
              </div>

              {/* Free Courier Perk Progress Bar */}
              <div className="mb-5 p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/25">
                <div className="flex items-center justify-between text-xs font-['Oswald',sans-serif] font-bold uppercase text-cyan-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>FREE CONCIERGE AIR DISPATCH</span>
                  </span>
                  <span>UNLOCKED</span>
                </div>
                <div className="w-full bg-slate-900/80 rounded-full h-2 overflow-hidden border border-white/10">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-full rounded-full animate-pulse" />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Equipment Subtotal</span>
                  <span className="font-['Oswald',sans-serif] text-base font-bold text-white">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-400">
                    <span>Shipping & Courier Handling</span>
                    <HelpCircle className="w-3.5 h-3.5 text-slate-500 cursor-pointer" title="Free on all orders over $75" />
                  </div>
                  <span className="font-['Oswald',sans-serif] text-sm font-bold text-cyan-400">
                    FREE ($0.00)
                  </span>
                </div>

                {isPromoApplied && (
                  <div className="flex items-center justify-between text-amber-300 font-medium">
                    <span className="flex items-center gap-1 font-['Oswald',sans-serif] font-bold uppercase">
                      <span className="material-symbols-outlined text-[14px]">sell</span>
                      Promo Code ( COURT10 )
                    </span>
                    <span className="font-['Oswald',sans-serif] text-sm font-bold">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Estimated Sales Tax (8%)</span>
                  <span className="font-['Oswald',sans-serif] text-sm font-bold text-white">
                    ${estimatedTax.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Highlighted Total Box (Obsidian & Cyan Gold Trim) */}
              <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900/90 border border-cyan-500/40 flex items-center justify-between shadow-lg">
                <div>
                  <span className="font-['Oswald',sans-serif] text-xs font-bold text-cyan-300 uppercase block tracking-wider">
                    TOTAL DUE
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">
                    INCLUDES REGIONAL VAT & DUTY
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-['Oswald',sans-serif] text-3xl font-bold text-white leading-none block drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]">
                    ${grandTotal.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono">USD CURRENCY</span>
                </div>
              </div>

              {/* Promo Code Input Field */}
              <div className="space-y-1.5 mb-5">
                <label className="font-['Oswald',sans-serif] text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  ATHLETE PROMO / ATELIER VOUCHER
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. COURT10"
                      className="w-full pl-3 pr-8 py-2 text-xs font-mono uppercase bg-slate-900/80 border border-white/15 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-900 placeholder:text-slate-500"
                    />
                    {isPromoApplied && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-2.5 top-2.5" />
                    )}
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-['Oswald',sans-serif] text-xs font-bold uppercase px-4 py-2 rounded-xl transition-colors shrink-0"
                  >
                    APPLY
                  </button>
                </div>
                {isPromoApplied && (
                  <p className="text-[11px] text-cyan-400 flex items-center gap-1 font-medium pt-1">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    Court10 applied 10% seasonal equipment markdown.
                  </p>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {promoError}
                  </p>
                )}
              </div>

              {/* PROCEED TO CHECKOUT BUTTON */}
              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-['Oswald',sans-serif] text-base font-bold uppercase py-4 px-6 rounded-2xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 tracking-wider group relative overflow-hidden"
              >
                <span className="relative z-10">PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>

              {/* EXPRESS COURT PAY DIVIDER */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <span className="font-['Oswald',sans-serif] text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center block mb-3">
                  EXPRESS COURT PAY
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {/* Apple Pay */}
                  <button 
                    onClick={() => triggerToast('Connecting to Apple Pay biometric authorization...')}
                    className="bg-black hover:bg-slate-900 text-white border border-white/20 py-2 px-3 rounded-xl flex items-center justify-center font-bold text-xs tracking-tight transition-all hover:border-white/40 shadow-sm"
                  >
                    Pay
                  </button>
                  {/* Google Pay */}
                  <button 
                    onClick={() => triggerToast('Connecting to Google Pay secure terminal...')}
                    className="bg-white/10 hover:bg-white/15 text-white border border-white/20 py-2 px-3 rounded-xl flex items-center justify-center font-bold text-xs tracking-tight transition-all hover:border-cyan-400/40 shadow-sm"
                  >
                    <span className="font-bold text-cyan-400">G</span>&nbsp;Pay
                  </button>
                  {/* PayPal */}
                  <button 
                    onClick={() => triggerToast('Connecting to PayPal Express...')}
                    className="bg-[#0070ba]/80 hover:bg-[#0070ba] text-white border border-blue-400/30 py-2 px-3 rounded-xl flex items-center justify-center font-bold text-xs tracking-tight transition-all italic shadow-sm"
                  >
                    PayPal
                  </button>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-semibold text-white">256-BIT ENCRYPTED HARDENED CHECKOUT</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% Athlete Satisfaction Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Free Instant Returns with Prepaid QR Label</span>
                </div>
              </div>
            </div>

            {/* NEED SIZING TELEMETRY CHAT CALLOUT WIDGET (ADORABLE SCOUT) */}
            <div className="luxury-glass-card rounded-3xl border border-white/10 p-5 flex items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 absolute -bottom-0.5 -right-0.5 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase text-white">
                    NEED SIZING TELEMETRY?
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Live with Coach Dave • Equipment Scout
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsChatModalOpen(true)}
                className="bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 font-['Oswald',sans-serif] text-xs font-bold uppercase px-3.5 py-2 rounded-xl transition-all tracking-wider shrink-0"
              >
                CHAT NOW
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Sizing Telemetry Live Scout Chat Modal (Luxury Atelier Dark Glass) */}
      {isChatModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="luxury-glass-card rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-white/15 flex flex-col h-[540px] animate-scale-in">
            {/* Chat Header */}
            <div className="bg-slate-900/90 border-b border-white/10 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-['Oswald',sans-serif] font-bold text-sm text-white shadow-md">
                    CD
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-slate-900" />
                </div>
                <div>
                  <span className="font-['Oswald',sans-serif] text-sm font-bold uppercase block leading-none text-white">
                    Coach Dave • Equipment Scout
                  </span>
                  <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Kinetic Telemetry Lab • Online
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsChatModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompt Chips (Adorable & helpful) */}
            <div className="px-4 py-2 bg-slate-900/60 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-[11px] whitespace-nowrap">
              <button 
                onClick={() => {
                  setInputChat("What size ball for 14 year old?");
                  setTimeout(() => handleSendMessage(), 100);
                }}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition-colors"
              >
                🏀 Ball Sizing Guide
              </button>
              <button 
                onClick={() => {
                  setInputChat("How does patella sleeve fit?");
                  setTimeout(() => handleSendMessage(), 100);
                }}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition-colors"
              >
                🦵 Knee Sleeve Fit
              </button>
              <button 
                onClick={() => {
                  setInputChat("Is the vault gift box included free?");
                  setTimeout(() => handleSendMessage(), 100);
                }}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition-colors"
              >
                🎁 Gift Box Details
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#060914] text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-900/90 border border-white/10 text-slate-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center gap-2">
              <input 
                type="text"
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                placeholder="Ask about ball sizes, grip tack, patella sleeves..."
                className="flex-1 px-3.5 py-2.5 text-xs bg-black/60 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-2.5 rounded-xl hover:from-blue-500 hover:to-cyan-400 transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Finalize Modal (Luxury Haute Atelier Manifest) */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="luxury-glass-card rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/20 text-center animate-scale-in relative overflow-hidden">
            
            {/* Top gold seal bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-amber-300 to-cyan-400" />

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="font-['Oswald',sans-serif] text-xs font-bold text-amber-300 uppercase tracking-widest">
                HAUTE ATELIER DISPATCH MANIFEST #ATELIER-{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>

            <h3 className="font-['Oswald',sans-serif] text-2xl sm:text-3xl font-bold uppercase text-white mb-2 tracking-tight">
              COURIER MANIFEST AUTHORIZED
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              Your {totalUnits} calibrated tactical items totaling <strong className="text-cyan-300">${grandTotal.toFixed(2)}</strong> are now securely sealed in complimentary velvet vault casing and prepped for armored flight courier pickup.
            </p>

            <div className="p-4 bg-black/40 rounded-2xl border border-white/10 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Dispatch Speed:</span>
                <span className="font-bold text-white">48-Hour Priority Express Courier</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Packaging:</span>
                <span className="font-bold text-amber-300">Hardwood Vault Case & Velvet Dust Bag</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Court Coverage:</span>
                <span className="font-bold text-emerald-400">30-Day Complete On-Court Guarantee</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Telemetry Tracking:</span>
                <span className="font-mono text-cyan-300 font-bold">KNT-TRK-{Math.floor(10000000 + Math.random() * 90000000)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCheckoutModalOpen(false);
                navigateTo('kinetic-main');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-['Oswald',sans-serif] text-sm font-bold uppercase py-4 rounded-xl transition-all shadow-xl shadow-blue-600/30 tracking-wider flex items-center justify-center gap-2"
            >
              <span>RETURN TO COURT HEADQUARTERS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-cyan-400/40 backdrop-blur-md animate-slide-up">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="font-['Oswald',sans-serif] text-xs font-bold uppercase tracking-wider">
            {toastMsg}
          </span>
        </div>
      )}
    </div>
  );
}
