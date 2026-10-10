import React, { useState, useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import DashboardView from './modules/dashboard/DashboardView';
import ProductsView from './modules/products/ProductsView';
import ProductFormView from './modules/products/ProductFormView';
import CategoriesView from './modules/categories/CategoriesView';
import CollectionsView from './modules/categories/CollectionsView';
import HomepageBuilderView from './modules/homepage/HomepageBuilderView';
import BannersView from './modules/banners/BannersView';
import OrdersView from './modules/orders/OrdersView';
import AcademyView from './modules/academy/AcademyView';
import CustomersView from './modules/customers/CustomersView';
import CouponsView from './modules/coupons/CouponsView';
import ReviewsView from './modules/reviews/ReviewsView';
import NavigationView from './modules/navigation/NavigationView';
import FaqsView from './modules/faqs/FaqsView';
import SettingsView from './modules/settings/SettingsView';
import UsersView from './modules/users/UsersView';
import AuditView from './modules/audit/AuditView';
import GalleriesView from './modules/galleries/GalleriesView';
import { Package } from 'lucide-react';

function AdminMainContent() {
  const { admin, isAuthenticated, loading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workspace, setWorkspace] = useState('store');
  const [openNewProductTrigger, setOpenNewProductTrigger] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);

  const isStoreAdmin = admin?.role === 'store_admin';
  const isSuperAdmin = admin?.role === 'super_admin';

  const platformOnlyTabs = ['academy', 'homepage', 'banners', 'galleries', 'users', 'audit', 'navigation', 'faqs'];
  const storeOnlyTabs = ['products', 'product-add', 'categories', 'collections', 'orders', 'customers', 'coupons', 'reviews'];

  // Handle tab change with strict role authorization
  const handleTabChange = (tabId) => {
    if (isStoreAdmin && platformOnlyTabs.includes(tabId)) {
      setActiveTab('dashboard');
      return;
    }
    if (!isStoreAdmin && storeOnlyTabs.includes(tabId)) {
      setActiveTab('dashboard');
      return;
    }
    setActiveTab(tabId);
  };

  const handleAddNewProduct = () => {
    if (!isStoreAdmin) return;
    setEditingProduct(null);
    setActiveTab('product-add');
  };

  // Sync workspace if admin role changes (e.g. via demo switch role)
  useEffect(() => {
    setWorkspace(isStoreAdmin ? 'store' : 'platform');
    if (isStoreAdmin && platformOnlyTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
    if (!isStoreAdmin && storeOnlyTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [admin?.role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="space-y-3 text-center max-w-sm">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 mx-auto flex items-center justify-center font-medium text-white text-sm">
            S
          </div>
          <p className="text-xs text-zinc-500 font-normal">Loading Control Center...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={handleTabChange}
      workspace={workspace}
      setWorkspace={setWorkspace}
      onAddNewProduct={handleAddNewProduct}
    >
      {/* 1. Dashboard View (Tailored for Store Admin vs Admin) */}
      {activeTab === 'dashboard' && (
        <DashboardView
          onNavigate={handleTabChange}
          workspace={workspace}
          setWorkspace={setWorkspace}
        />
      )}

      {/* 2. Product & Inventory Management View (Store Admin Only) */}
      {activeTab === 'products' && isStoreAdmin && (
        <ProductsView
          onAddNewProduct={handleAddNewProduct}
          onEditProduct={(prod) => {
            setEditingProduct(prod);
            setActiveTab('product-add');
          }}
        />
      )}

      {/* 2b. Add / Edit Product Dedicated Full-Page View (Store Admin Only) */}
      {activeTab === 'product-add' && isStoreAdmin && (
        <ProductFormView
          product={editingProduct}
          onCancel={() => {
            setEditingProduct(null);
            setActiveTab('products');
          }}
          onSaveSuccess={(savedProd) => {
            setEditingProduct(null);
            setActiveTab('products');
          }}
        />
      )}

      {/* 3. Category Tree Builder View (Store Admin Only) */}
      {activeTab === 'categories' && isStoreAdmin && (
        <CategoriesView />
      )}

      {/* 4. Collections & Smart Rules View (Store Admin Only) */}
      {activeTab === 'collections' && isStoreAdmin && (
        <CollectionsView />
      )}

      {/* 5. Homepage Builder View (Admin Only) */}
      {activeTab === 'homepage' && !isStoreAdmin && (
        <HomepageBuilderView />
      )}

      {/* 6. Banners & Campaign Manager View (Admin Only) */}
      {activeTab === 'banners' && !isStoreAdmin && (
        <BannersView onNavigate={handleTabChange} />
      )}

      {/* 6b. Academy Galleries & Media Manager View (Admin Only) */}
      {activeTab === 'galleries' && !isStoreAdmin && (
        <GalleriesView />
      )}

      {/* 7. Order Fulfillment & Logistics View (Store Admin Only) */}
      {activeTab === 'orders' && isStoreAdmin && (
        <OrdersView />
      )}

      {/* 8. Academy & Packages Manager View (Admin Only) */}
      {activeTab === 'academy' && !isStoreAdmin && (
        <AcademyView />
      )}

      {/* 9. Customer Directory View (Store Admin Only) */}
      {activeTab === 'customers' && isStoreAdmin && (
        <CustomersView />
      )}

      {/* 10. Coupons & Discount Offers View (Store Admin Only) */}
      {activeTab === 'coupons' && isStoreAdmin && (
        <CouponsView />
      )}

      {/* 11. Product Reviews Moderation View (Store Admin Only) */}
      {activeTab === 'reviews' && isStoreAdmin && (
        <ReviewsView />
      )}

      {/* 12. Navbar & Footer Menu Builder View (Admin Only) */}
      {activeTab === 'navigation' && !isStoreAdmin && (
        <NavigationView />
      )}

      {/* 13. FAQs & Customer Knowledge Base View (Admin Only) */}
      {activeTab === 'faqs' && !isStoreAdmin && (
        <FaqsView />
      )}

      {/* 14. Storefront / Platform Settings View */}
      {activeTab === 'settings' && (
        <SettingsView />
      )}

      {/* 15. Admin Users & RBAC View (Admin Only) */}
      {activeTab === 'users' && !isStoreAdmin && (
        <UsersView />
      )}

      {/* 16. System Audit Logs View (Admin Only) */}
      {activeTab === 'audit' && !isStoreAdmin && (
        <AuditView />
      )}

      {/* 17. Fallback Stub (For any unmapped route) */}
      {activeTab !== 'dashboard' &&
        activeTab !== 'products' &&
        activeTab !== 'categories' &&
        activeTab !== 'collections' &&
        activeTab !== 'homepage' &&
        activeTab !== 'banners' &&
        activeTab !== 'orders' &&
        activeTab !== 'academy' &&
        activeTab !== 'customers' &&
        activeTab !== 'coupons' &&
        activeTab !== 'reviews' &&
        activeTab !== 'navigation' &&
        activeTab !== 'faqs' &&
        activeTab !== 'settings' &&
        activeTab !== 'users' &&
        activeTab !== 'audit' &&
        activeTab !== 'product-add' && (
        <div className="bg-white border border-zinc-200/90 rounded-xl p-8 space-y-4 text-center shadow-none">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200/80 text-zinc-700 flex items-center justify-center mx-auto">
            <Package className="w-5 h-5" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-semibold text-zinc-900 capitalize">
              STRATEGY Module: {activeTab}
            </h3>
            <p className="text-xs text-zinc-500">
              Module <code className="text-zinc-900 font-mono font-medium">[{activeTab}]</code> is ready for Phase feature integration.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium text-xs rounded-lg transition inline-block cursor-pointer"
          >
            ← Return to Dashboard
          </button>
        </div>
      )}
    </AdminLayout>
  );
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <AdminMainContent />
    </AdminAuthProvider>
  );
}
