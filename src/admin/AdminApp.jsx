import React, { useState, useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import StoreHome from './modules/dashboard/StoreHome';
import AcademyHome from './modules/dashboard/AcademyHome';
import ProductsView from './modules/products/ProductsView';
import ProductFormView from './modules/products/ProductFormView';
import CategoriesView from './modules/categories/CategoriesView';
import OrdersView from './modules/orders/OrdersView';
import CustomersView from './modules/customers/CustomersView';
import SettingsView from './modules/settings/SettingsView';
import AcademyView from './modules/academy/AcademyView';
import GalleriesView from './modules/galleries/GalleriesView';
import TrialLeadsView from './modules/leads/TrialLeadsView';

// Pages each login is allowed to open
const STORE_PAGES = ['dashboard', 'products', 'product-add', 'categories', 'orders', 'customers', 'settings'];
const ACADEMY_PAGES = ['dashboard', 'trial-leads', 'academy', 'galleries'];

function AdminMainContent() {
  const { admin, isAuthenticated, loading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState(null);

  const isStoreAdmin = admin?.role === 'store_admin';
  const allowedPages = isStoreAdmin ? STORE_PAGES : ACADEMY_PAGES;

  const goTo = (tabId) => {
    setActiveTab(allowedPages.includes(tabId) ? tabId : 'dashboard');
    window.scrollTo({ top: 0 });
  };

  const handleAddNewProduct = () => {
    if (!isStoreAdmin) return;
    setEditingProduct(null);
    goTo('product-add');
  };

  // Go back to Home whenever a different login signs in
  useEffect(() => {
    setActiveTab('dashboard');
  }, [admin?.role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const page = allowedPages.includes(activeTab) ? activeTab : 'dashboard';

  return (
    <AdminLayout activeTab={page} setActiveTab={goTo} onAddNewProduct={handleAddNewProduct}>
      {page === 'dashboard' &&
        (isStoreAdmin ? (
          <StoreHome onNavigate={goTo} onAddNewProduct={handleAddNewProduct} />
        ) : (
          <AcademyHome onNavigate={goTo} />
        ))}

      {/* Shop pages */}
      {page === 'products' && (
        <ProductsView
          onAddNewProduct={handleAddNewProduct}
          onEditProduct={(prod) => {
            setEditingProduct(prod);
            goTo('product-add');
          }}
        />
      )}
      {page === 'product-add' && (
        <ProductFormView
          product={editingProduct}
          onCancel={() => {
            setEditingProduct(null);
            goTo('products');
          }}
          onSaveSuccess={() => {
            setEditingProduct(null);
            goTo('products');
          }}
        />
      )}
      {page === 'categories' && <CategoriesView />}
      {page === 'orders' && <OrdersView />}
      {page === 'customers' && <CustomersView />}
      {page === 'settings' && <SettingsView />}

      {/* Academy pages */}
      {page === 'trial-leads' && <TrialLeadsView />}
      {page === 'academy' && <AcademyView />}
      {page === 'galleries' && <GalleriesView />}
    </AdminLayout>
  );
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <div className="admin-root">
        <AdminMainContent />
      </div>
    </AdminAuthProvider>
  );
}
