import React, { useState } from 'react';
import StrategySportsHome from './components/StrategySportsHome';
import CategoryShopView from './components/CategoryShopView';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeSection from './components/HomeSection';
import ProgramsSection from './components/ProgramsSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import FreeTrialPage from './components/FreeTrialPage';
import TrialSelectionPage from './components/TrialSelectionPage';
import BasketballTrialPage from './components/BasketballTrialPage';
import BasketballSection from './components/BasketballSection';
import BasketballCheckoutPage from './components/BasketballCheckoutPage';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import ProShopPage from './components/ProShopPage';
import RefundPolicyPage from './components/RefundPolicyPage';
import TermsPage from './components/TermsPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import ContactUsPage from './components/ContactUsPage';
import ShippingPolicyPage from './components/ShippingPolicyPage';
import FaqsPage from './components/FaqsPage';
import CareersPage from './components/CareersPage';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const cleanHash = window.location.hash.replace('#', '').trim();
      if (cleanHash === 'sec-about-strategy' || cleanHash === 'about-strategy') return 'shop-home';
      return cleanHash || 'home';
    }
    return 'home';
  });

  const navigateTo = (tab) => {
    if (tab === 'about-strategy' || tab === 'sec-about-strategy') {
      setActiveTab('shop-home');
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '#shop-home');
      }
      setTimeout(() => {
        const el = document.getElementById('sec-about-strategy');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') {
      if (tab === 'home') {
        if (window.location.hash) {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        if (window.location.hash !== `#${tab}`) {
          window.location.hash = tab;
        }
      }
    }
  };

  React.useEffect(() => {
    const handleNavigation = () => {
      const hash = window.location.hash ? window.location.hash.replace('#', '').trim() : '';
      if (hash === 'sec-about-strategy' || hash === 'about-strategy') {
        setActiveTab('shop-home');
        setTimeout(() => {
          const el = document.getElementById('sec-about-strategy');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        return;
      }
      setActiveTab(hash || 'home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // If initial load has #about-strategy or #sec-about-strategy, scroll to it
    const initialHash = window.location.hash ? window.location.hash.replace('#', '').trim() : '';
    if (initialHash === 'sec-about-strategy' || initialHash === 'about-strategy') {
      setTimeout(() => {
        const el = document.getElementById('sec-about-strategy');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    }

    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('strategy_wishlist_items');
      if (saved) setWishlistItems(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const handleToggleWishlist = (product) => {
    if (!product) return;
    const exists = wishlistItems.some((i) => i.id === product.id);
    const updated = exists
      ? wishlistItems.filter((i) => i.id !== product.id)
      : [...wishlistItems, product];
    setWishlistItems(updated);
    try {
      localStorage.setItem('strategy_wishlist_items', JSON.stringify(updated));
    } catch (e) {}
  };

  const goToTrial = () => {
    navigateTo('trial');
  };

  // Cart Handlers
  const addToCart = (product) => {
    const itemTitle = product.title || product.name || 'STRATEGY Gear';
    const itemImage = product.image || (product.images && product.images[0]) || '/images/strategy_basketball_ball.jpg';
    const itemPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 49.99;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          title: itemTitle,
          name: itemTitle,
          image: itemImage,
          price: itemPrice,
          quantity: 1
        }
      ];
    });

    setToastMessage(`Added "${itemTitle}" to cart!`);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Helper to test if activeTab is a shop/catalog view
  const isShopView = 
    activeTab === 'shop' ||
    activeTab === 'shop-new' ||
    activeTab === 'shop-best' ||
    activeTab === 'sports' ||
    activeTab === 'men' ||
    activeTab === 'women' ||
    activeTab === 'kids' ||
    activeTab === 'special-edition' ||
    activeTab.startsWith('category-') ||
    activeTab.startsWith('gender-');

  // Helper to test if activeTab is the new sports shop homepage
  const isShopHome = activeTab === 'shop-home';

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white selection:bg-blue-600 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Navigation Header (Shown only on legacy skate academy pages) */}
      {activeTab !== 'home' && 
       !isShopView &&
       !isShopHome &&
       activeTab !== 'trial' && 
       activeTab !== 'trial-skating' && 
       activeTab !== 'trial-basketball' && 
       activeTab !== 'basketball' && 
       activeTab !== 'basketball-checkout' && 
       activeTab !== 'about' && 
       activeTab !== 'skating' && 
       activeTab !== 'proshop' && 
       activeTab !== 'contact' && 
       activeTab !== 'returns' && 
       activeTab !== 'refund-policy' && 
       activeTab !== 'terms' && 
       activeTab !== 'privacy' && 
       activeTab !== 'shipping' && 
       activeTab !== 'faqs' && 
       activeTab !== 'careers' && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cartCount={totalCartCount}
          openCart={() => setIsCartOpen(true)}
          openTrialModal={goToTrial}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {/* 1. ORIGINAL ACADEMY HOME */}
        {activeTab === 'home' && (
          <HomeSection
            navigateTo={navigateTo}
            openTrialModal={goToTrial}
          />
        )}

        {/* 2. NEW STRATEGY SPORTS E-COMMERCE HOMEPAGE */}
        {isShopHome && (
          <StrategySportsHome
            navigateTo={navigateTo}
            activeTab={activeTab}
            cartItems={cartItems}
            onAddToCart={addToCart}
            totalCartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {/* 3. DEDICATED CATEGORY / SHOP / GENDER CATALOG */}
        {isShopView && (
          <CategoryShopView
            filterType={activeTab}
            navigateTo={navigateTo}
            onAddToCart={addToCart}
            totalCartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {/* 4. PRESERVED ACADEMY & CHECKOUT ROUTES */}
        {activeTab === 'trial' && (
          <TrialSelectionPage
            navigateTo={navigateTo}
            onSelectSkating={() => {
              navigateTo('trial-skating');
            }}
          />
        )}

        {activeTab === 'trial-skating' && (
          <FreeTrialPage
            navigateTo={navigateTo}
          />
        )}

        {activeTab === 'trial-basketball' && (
          <BasketballTrialPage
            navigateTo={navigateTo}
          />
        )}

        {activeTab === 'programs' && (
          <ProgramsSection
            openTrialModal={goToTrial}
          />
        )}

        {(activeTab === 'about' || activeTab === 'skating') && (
          <AboutSection
            navigateTo={navigateTo}
            openTrialModal={goToTrial}
          />
        )}

        {activeTab === 'basketball' && (
          <BasketballSection
            navigateTo={navigateTo}
            openTrialModal={goToTrial}
          />
        )}

        {activeTab === 'basketball-checkout' && (
          <BasketballCheckoutPage
            navigateTo={navigateTo}
          />
        )}

        {activeTab === 'contact' && (
          <ContactUsPage
            navigateTo={navigateTo}
            cartCount={totalCartCount}
            wishlistCount={wishlistItems.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            onOpenSearch={() => {}}
          />
        )}

        {(activeTab === 'returns' || activeTab === 'refund-policy') && (
          <RefundPolicyPage
            navigateTo={navigateTo}
            cartCount={totalCartCount}
            wishlistCount={wishlistItems.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            onOpenSearch={() => {}}
          />
        )}

        {activeTab === 'terms' && (
          <TermsPage
            navigateTo={navigateTo}
            cartCount={totalCartCount}
            wishlistCount={wishlistItems.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            onOpenSearch={() => {}}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyPolicyPage
            navigateTo={navigateTo}
            cartCount={totalCartCount}
            wishlistCount={wishlistItems.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            onOpenSearch={() => {}}
          />
        )}

        {activeTab === 'shipping' && (
          <ShippingPolicyPage
            navigateTo={navigateTo}
            cartCount={totalCartCount}
            wishlistCount={wishlistItems.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            onOpenSearch={() => {}}
          />
        )}

        {activeTab === 'faqs' && (
          <FaqsPage
            navigateTo={navigateTo}
            cartCount={totalCartCount}
            wishlistCount={wishlistItems.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            onOpenSearch={() => {}}
          />
        )}

        {activeTab === 'careers' && (
          <CareersPage
            navigateTo={navigateTo}
            cartCount={totalCartCount}
            wishlistCount={wishlistItems.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            onOpenSearch={() => {}}
          />
        )}

        {activeTab === 'proshop' && (
          <ProShopPage onAddToCart={addToCart} />
        )}
      </main>

      {/* Footer (Shown only on standard inner pages) */}
      {activeTab !== 'home' && 
       !isShopHome &&
       !isShopView &&
       activeTab !== 'trial' && 
       activeTab !== 'trial-skating' && 
       activeTab !== 'trial-basketball' && 
       activeTab !== 'basketball' && 
       activeTab !== 'basketball-checkout' && 
       activeTab !== 'about' && 
       activeTab !== 'skating' && 
       activeTab !== 'proshop' && 
       activeTab !== 'contact' && 
       activeTab !== 'returns' && 
       activeTab !== 'refund-policy' && 
       activeTab !== 'terms' && 
       activeTab !== 'privacy' && 
       activeTab !== 'shipping' && 
       activeTab !== 'faqs' && 
       activeTab !== 'careers' && (
        <Footer
          setActiveTab={setActiveTab}
          openTrialModal={goToTrial}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        clearCart={clearCart}
        navigateTo={navigateTo}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={(item) => {
          addToCart(item);
          handleToggleWishlist(item);
        }}
        navigateTo={navigateTo}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
