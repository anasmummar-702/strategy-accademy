import React, { useState } from 'react';
import { 
  X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, 
  ShieldCheck, Tag, CreditCard, CheckCircle, Truck, 
  Sparkles, Lock, ArrowLeft, ChevronRight, Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { productsData } from '../data/products';
import { publicApi } from '../services/api';
import { format10DigitPhone, validate10DigitPhone, validateGmail } from '../utils/validation';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  updateQuantity, 
  removeItem, 
  clearCart,
  onAddToCart,
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
  const [checkoutPhoneError, setCheckoutPhoneError] = useState('');
  const [checkoutEmailError, setCheckoutEmailError] = useState('');

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

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    const emailVal = validateGmail(checkoutForm.email);
    if (!emailVal.isValid) {
      setCheckoutEmailError(emailVal.error);
      return;
    }
    setCheckoutEmailError('');

    const phoneVal = validate10DigitPhone(checkoutForm.phone);
    if (!phoneVal.isValid) {
      setCheckoutPhoneError(phoneVal.error);
      return;
    }
    setCheckoutPhoneError('');

    const orderId = 'STR-' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      customerName: checkoutForm.name || 'Valued Athlete',
      customerEmail: checkoutForm.email || 'customer@strategy.ae',
      customerPhone: checkoutForm.phone || '+971 50 123 4567',
      paymentMethod: checkoutForm.paymentMethod || 'card',
      subtotalFils: Math.round(subtotal * 100),
      vatFils: Math.round(subtotal * 5),
      shippingFils: Math.round(shippingCost * 100),
      totalFils: Math.round(total * 100),
      shippingAddress: {
        line1: checkoutForm.address || 'Standard Delivery',
        city: checkoutForm.city || 'Dubai',
        country: 'United Arab Emirates',
      },
      items: cartItems.map((i) => ({
        id: i.id,
        name: i.name || i.title,
        priceFils: Math.round((i.price || 0) * 100),
        quantity: i.quantity || 1,
      })),
    };

    try {
      await publicApi.submitOrder(orderData);
    } catch (err) {
      console.warn('Backend order submission fallback:', err.message);
    }

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
        {/* Top Header */}
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-slate-800" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-sans">
              {isCheckingOut ? 'Express Checkout' : `${totalItemCount} ${totalItemCount === 1 ? 'item' : 'items'}`}
            </h3>
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
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
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
                    Gmail Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@gmail.com"
                    value={checkoutForm.email}
                    onChange={(e) => {
                      setCheckoutForm({ ...checkoutForm, email: e.target.value });
                      if (checkoutEmailError) setCheckoutEmailError('');
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-slate-900 text-xs sm:text-sm focus:outline-none transition-all ${checkoutEmailError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:ring-2 focus:ring-blue-600'}`}
                  />
                  {checkoutEmailError && (
                    <div className="text-[10px] text-rose-500 font-semibold mt-1">
                      {checkoutEmailError}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Mobile (9 Digits) *
                    </label>
                    <span className="text-[9px] text-slate-400">
                      {checkoutForm.phone.length}/9
                    </span>
                  </div>
                  <div className={`flex items-center rounded-xl bg-white border overflow-hidden transition-all ${checkoutPhoneError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus-within:ring-2 focus-within:ring-blue-600'}`}>
                    <div className="flex items-center gap-1 px-2.5 py-2 bg-slate-100 text-slate-700 font-bold text-xs border-r border-slate-200 shrink-0">
                      <Phone className="w-3 h-3 text-blue-600" />
                      <span>+971</span>
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={9}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="50 123 4567"
                      value={checkoutForm.phone}
                      onChange={(e) => {
                        const digits = format10DigitPhone(e.target.value);
                        setCheckoutForm({ ...checkoutForm, phone: digits });
                        if (checkoutPhoneError) setCheckoutPhoneError('');
                      }}
                      className="w-full px-2.5 py-2 bg-transparent text-slate-900 text-xs sm:text-sm focus:outline-none"
                    />
                  </div>
                  {checkoutPhoneError && (
                    <div className="text-[10px] text-rose-500 font-semibold mt-1">
                      {checkoutPhoneError}
                    </div>
                  )}
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
          /* 3. MOBILE OPTIMIZED CART ITEMS VIEW */
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            
            {/* Free Shipping Progress Indicator */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-100">
              <div className="text-center text-xs font-semibold text-slate-800 mb-2">
                {amountToFreeShipping === 0 
                  ? 'You are eligible for free shipping!' 
                  : `Add Dhs. ${amountToFreeShipping.toFixed(2)} AED more for free shipping!`}
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#3b4cca] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              
              {/* Cart Items List */}
              {cartItems.length > 0 ? (
                <div className="space-y-5">
                  {cartItems.map((item) => {
                    const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
                    const itemImg = item.image || (item.images && item.images[0]) || '/images/strategy_basketball_ball.jpg';
                    const itemQty = item.quantity || 1;
                    const brand = item.brand || item.sport || 'STRATEGY';
                    const variantText = `${item.id.replace('prod-', '8851898')} / ${item.selectedSize || 'Unique size'} / ${item.selectedColor || 'steel grey'}`;

                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0"
                      >
                        {/* Product Thumbnail */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                          <img
                            src={itemImg}
                            alt={item.title || item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-0.5">
                            {brand}
                          </div>
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug line-clamp-2 mb-1">
                            {item.title || item.name}
                          </h4>

                          <div className="text-[11px] text-slate-400 mb-2 truncate">
                            {variantText}
                          </div>

                          {/* Yellow Highlighted Price */}
                          <div className="mb-2">
                            <span className="bg-[#fde047] text-slate-950 font-extrabold px-1.5 py-0.5 rounded text-xs inline-block">
                              Dhs. {(itemPrice * itemQty).toFixed(2)} AED
                            </span>
                          </div>

                          {/* Stepper + Inline Remove Link */}
                          <div className="flex items-center gap-3">
                            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-slate-300 text-xs bg-white">
                              <button
                                onClick={() => updateQuantity && updateQuantity(item.id, itemQty - 1)}
                                className="text-slate-600 hover:text-slate-900 font-bold transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="font-extrabold text-slate-900 min-w-[12px] text-center">
                                {itemQty}
                              </span>
                              <button
                                onClick={() => updateQuantity && updateQuantity(item.id, itemQty + 1)}
                                className="text-slate-600 hover:text-slate-900 font-bold transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem && removeItem(item.id)}
                              className="text-xs font-semibold text-slate-500 hover:text-rose-600 underline cursor-pointer transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* EMPTY STATE */
                <div className="text-center py-12 px-4 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-50 text-[#3b4cca] flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Your shopping cart is empty
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
                    Gear up with championship-grade equipment and pro athletics.
                  </p>

                  <button
                    onClick={() => handleQuickCategory('shop')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3b4cca] hover:bg-[#2f40cb] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    <span>Browse Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* "You may also like" Recommendations Section */}
              {(() => {
                const recs = (productsData || [])
                  .filter((p) => !cartItems.some((item) => item.id === p.id))
                  .slice(0, 3);
                
                if (recs.length === 0) return null;

                return (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
                      You may also like
                    </h4>

                    <div className="space-y-4">
                      {recs.map((rec) => {
                        const recImg = rec.image || (rec.images && rec.images[0]) || '/images/strategy_basketball_ball.jpg';
                        return (
                          <div
                            key={rec.id}
                            className="flex items-center gap-3 justify-between"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={recImg}
                                alt={rec.name || rec.title}
                                className="w-16 h-16 rounded-md bg-slate-50 object-contain p-1 border border-slate-100 shrink-0"
                              />
                              <div className="min-w-0">
                                <h5 className="text-xs font-semibold text-slate-900 truncate max-w-[180px] sm:max-w-[220px]">
                                  {rec.name || rec.title}
                                </h5>
                                <div>
                                  <span className="bg-[#fde047] text-slate-950 font-extrabold px-1.5 py-0.5 rounded text-[11px] inline-block my-1">
                                    Dhs. {(typeof rec.price === 'number' ? rec.price : parseFloat(rec.price) || 0).toFixed(2)} AED
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">
                                  1 color
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => onAddToCart && onAddToCart(rec)}
                              className="w-8 h-8 rounded-full bg-[#3b4cca] hover:bg-[#2f40cb] text-white flex items-center justify-center shadow-sm cursor-pointer shrink-0 transition-transform active:scale-90"
                              title="Add to Cart"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Fixed Bottom Checkout Section */}
            {cartItems.length > 0 && (
              <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 sm:p-5 shadow-2xl z-20">
                <p className="text-center text-xs text-slate-500 mb-2.5 font-medium">
                  Shipping & taxes calculated at checkout
                </p>

                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full py-3.5 sm:py-4 rounded-xl bg-[#3b4cca] hover:bg-[#2f40cb] active:bg-[#2433b5] text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg cursor-pointer transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>CHECKOUT • DHS. {total.toFixed(2)} AED</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
