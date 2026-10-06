import React, { useState } from 'react';
import { 
  X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, 
  ShieldCheck, Tag, CreditCard, CheckCircle, Truck, 
  Sparkles, Lock, ArrowLeft, ChevronRight, Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  updateQuantity, 
  removeItem, 
  clearCart,
  navigateTo 
}) {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Dubai',
    emirate: 'Dubai',
    paymentMethod: 'card',
    cardNumber: '•••• •••• •••• 4242'
  });

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    return sum + itemPrice * (item.quantity || 1);
  }, 0);

  const totalItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const freeShippingThreshold = 150;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15;
  const discountAmount = (subtotal * discount) / 100;
  const total = Math.max(0, subtotal - discountAmount + (subtotal > 0 ? shippingCost : 0));

  const applyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'STRATEGY10' || code === 'SKATE10' || code === 'APEX10') {
      setDiscount(10);
      setPromoApplied(true);
      setPromoError('');
    } else if (code === 'VIP20' || code === 'STRATEGY20') {
      setDiscount(20);
      setPromoApplied(true);
      setPromoError('');
    } else if (code === 'FREESHIP') {
      setDiscount(5);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try STRATEGY10 or VIP20');
    }
  };

  const removePromo = () => {
    setDiscount(0);
    setPromoApplied(false);
    setPromoCode('');
    setPromoError('');
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    const orderId = 'STR-' + Math.floor(100000 + Math.random() * 900000);
    setOrderComplete({
      orderId,
      items: [...cartItems],
      total,
      discountAmount,
      shippingCost,
      customerName: checkoutForm.name || 'Valued Athlete',
      shippingAddress: `${checkoutForm.address || 'Standard Delivery'}, ${checkoutForm.city || 'UAE'}`,
      paymentMethod: checkoutForm.paymentMethod
    });
    if (clearCart) clearCart();
    setIsCheckingOut(false);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}
  };

  const closeAll = () => {
    setOrderComplete(null);
    setIsCheckingOut(false);
    onClose();
  };

  const handleQuickCategory = (cat) => {
    closeAll();
    if (navigateTo) {
      if (cat === 'basketball') navigateTo('category-basketball');
      else if (cat === 'skating') navigateTo('category-skating');
      else if (cat === 'men') navigateTo('men');
      else if (cat === 'women') navigateTo('women');
      else navigateTo('shop');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed Backdrop */}
      <div 
        onClick={closeAll}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in" 
      />

      {/* Slide-over White and Blue Drawer Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white text-slate-900 h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-blue-100"
      >
        
        {/* Top Header - White with STRATEGY Blue Accents */}
        <div className="px-6 py-4 bg-white border-b border-slate-200/80 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-wide uppercase text-slate-900 font-sans">
                  {isCheckingOut ? 'Express Checkout' : 'Shopping Cart'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-blue-600 text-white">
                  {totalItemCount}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                STRATEGY Official Athletics Store
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isCheckingOut && (
              <button
                onClick={() => setIsCheckingOut(false)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cart</span>
              </button>
            )}
            <button
              onClick={closeAll}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 1. ORDER COMPLETE CONFIRMATION SCREEN */}
        {orderComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-8 space-y-5 overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Payment Authorized
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2 uppercase tracking-tight">
                Order Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                Thank you, <span className="font-bold text-slate-900">{orderComplete.customerName}</span>. Your equipment is being prepared for dispatch.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Order Reference:</span>
                <span className="font-black text-blue-600 tracking-wider">{orderComplete.orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]">{orderComplete.shippingAddress}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Estimated Delivery:</span>
                <span className="font-bold text-emerald-700">24 – 48 Hours (UAE Express)</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-black text-sm text-slate-900">
                <span>Total Paid:</span>
                <span className="text-blue-600">${orderComplete.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="w-full pt-2 flex flex-col gap-2">
              <button
                onClick={closeAll}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : isCheckingOut ? (
          /* 2. CHECKOUT FORM VIEW */
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wide">Amount Due</span>
                <div className="text-xl font-black text-blue-600">${total.toFixed(2)}</div>
              </div>
              <div className="text-right text-[11px] text-slate-600">
                <span>{totalItemCount} Items</span> • <span className="font-bold text-emerald-600">{shippingCost === 0 ? 'FREE Shipping' : '$15 Shipping'}</span>
              </div>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+971 50 123 4567"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Villa / Apt, Street Name, Community"
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Emirate / City *
                  </label>
                  <select
                    value={checkoutForm.city}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value, emirate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent cursor-pointer"
                  >
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
                    <option value="Ajman">Ajman</option>
                    <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                    <option value="Fujairah">Fujairah</option>
                    <option value="Umm Al Quwain">Umm Al Quwain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value="United Arab Emirates"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs sm:text-sm font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'apple', label: 'Apple Pay', icon: Lock },
                    { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                  ].map((method) => {
                    const Icon = method.icon;
                    const active = checkoutForm.paymentMethod === method.id;
                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: method.id })}
                        className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          active
                            ? 'border-blue-600 bg-blue-50/80 text-blue-700 ring-2 ring-blue-600/20'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px] font-black">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {checkoutForm.paymentMethod === 'card' && (
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                    <span>Card Information</span>
                    <span className="text-[10px] text-blue-600 font-black">256-BIT ENCRYPTED</span>
                  </div>
                  <input
                    type="text"
                    placeholder="4242 •••• •••• 4242"
                    defaultValue="4242 •••• •••• 4242"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      defaultValue="12/28"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono"
                    />
                    <input
                      type="password"
                      placeholder="CVC"
                      defaultValue="888"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Pay ${total.toFixed(2)}</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Guaranteed Safe & Secure STRATEGY Checkout</span>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* 3. NORMAL CART ITEMS VIEW */
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            
            {/* Free Shipping Progress Indicator */}
            <div className="px-6 py-3 bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-blue-50/90 border-b border-blue-100">
              <div className="flex items-center justify-between text-xs font-black mb-1.5">
                <div className="flex items-center gap-1.5 text-slate-800">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>
                    {amountToFreeShipping === 0 
                      ? '🎉 FREE Express UAE Delivery Unlocked!' 
                      : `Add $${amountToFreeShipping.toFixed(2)} more for FREE UAE Shipping`}
                  </span>
                </div>
                <span className="text-blue-700">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3.5">
              {cartItems.length > 0 ? (
                cartItems.map((item) => {
                  const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
                  const itemImg = item.image || (item.images && item.images[0]) || '/images/strategy_basketball_ball.jpg';
                  const itemQty = item.quantity || 1;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all flex gap-3.5 items-center group"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={itemImg}
                          alt={item.title || item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      {/* Product Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-black uppercase tracking-wider text-blue-600 mb-0.5">
                          {item.sport || 'STRATEGY'} • {item.category || 'Athletics'}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-snug">
                          {item.title || item.name}
                        </h4>

                        {/* Variants if any */}
                        {(item.selectedSize || item.selectedColor) && (
                          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 font-medium">
                            {item.selectedSize && (
                              <span className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-700 font-semibold">
                                Size: {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-700 font-semibold">
                                {item.selectedColor}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Price and Quantity Stepper Row */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-black text-slate-900">
                              ${(itemPrice * itemQty).toFixed(2)}
                            </span>
                            {itemQty > 1 && (
                              <span className="text-[11px] text-slate-400">
                                (${itemPrice.toFixed(2)} ea)
                              </span>
                            )}
                          </div>

                          {/* Stepper + Delete */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                              <button
                                onClick={() => updateQuantity && updateQuantity(item.id, itemQty - 1)}
                                className="p-1 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer rounded-l-lg"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-black text-slate-800">
                                {itemQty}
                              </span>
                              <button
                                onClick={() => updateQuantity && updateQuantity(item.id, itemQty + 1)}
                                className="p-1 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer rounded-r-lg"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem && removeItem(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* EMPTY STATE (High-End White and Blue) */
                <div className="text-center py-12 px-4 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 border-2 border-blue-200 text-blue-600 flex items-center justify-center mb-4 shadow-sm">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight mb-1">
                    Your Shopping Cart is Empty
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
                    Gear up with championship-grade basketballs, carbon-plate athletic shoes, and pro sportswear.
                  </p>

                  <button
                    onClick={() => handleQuickCategory('shop')}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer mb-8"
                  >
                    <span>Browse All Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Quick-Jump Categories */}
                  <div className="w-full pt-6 border-t border-slate-100 text-left">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2.5">
                      Explore Categories
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: '🏀 Basketballs', cat: 'basketball' },
                        { name: '🛼 Skates & Gear', cat: 'skating' },
                        { name: '👟 Men’s Apparel', cat: 'men' },
                        { name: '⚡ Women’s Gear', cat: 'women' },
                      ].map((c) => (
                        <button
                          key={c.name}
                          onClick={() => handleQuickCategory(c.cat)}
                          className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 text-left text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <span>{c.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Section: Promo Code + Financial Breakdown + CTAs */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-slate-50/80 border-t border-slate-200/80 space-y-4">
                
                {/* Promo Code Strip */}
                {promoApplied ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Coupon Active: {discount}% OFF (${discountAmount.toFixed(2)} saved)</span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-[11px] font-black text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={applyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Discount code (e.g. STRATEGY10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-600 font-semibold">{promoError}</p>
                )}

                {/* Subtotal, Shipping & Total breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({discount}%):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated Shipping:</span>
                    {shippingCost === 0 ? (
                      <span className="font-black text-emerald-600">FREE</span>
                    ) : (
                      <span className="font-bold text-slate-900">$15.00</span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                    <span className="text-sm font-black uppercase">Estimated Total:</span>
                    <span className="text-xl font-black text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Main Action Button */}
                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Trust Badges Footer Strip */}
                <div className="pt-1 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Authentic Guarantee
                  </span>
                  <span>•</span>
                  <span>Fast GCC Delivery</span>
                  <span>•</span>
                  <span>30-Day Returns</span>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
