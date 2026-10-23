import React, { useState, useEffect } from 'react';
import { CloudOff } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import PasswordResetModal from '../pages/PasswordResetModal';
import { useAdminAuth } from '../context/AdminAuthContext';
import { checkShopServer } from '../services/storeData';

const PAGE_TITLES = {
  dashboard: 'Home',
  products: 'Products',
  'product-add': 'Product details',
  categories: 'Categories',
  orders: 'Orders',
  customers: 'Customers',
  settings: 'Shop settings',
  'trial-leads': 'Trial requests',
  academy: 'Packages & prices',
  galleries: 'Photo gallery',
};

export default function AdminLayout({ activeTab, setActiveTab, onAddNewProduct, children }) {
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const { admin } = useAdminAuth();
  const isStoreAdmin = admin?.role === 'store_admin';
  const [shopOffline, setShopOffline] = useState(false);

  // Shop data (products, orders, categories, settings) is stored by the shop server.
  // When it can't be reached, say so instead of letting changes quietly disappear.
  useEffect(() => {
    if (!isStoreAdmin) return;
    let alive = true;
    checkShopServer().then((ok) => alive && setShopOffline(!ok));
    return () => {
      alive = false;
    };
  }, [isStoreAdmin]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-['Plus_Jakarta_Sans',sans-serif] flex antialiased">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onAddNewProduct={onAddNewProduct}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'pl-16' : 'pl-60'}`}>
        <Header
          title={PAGE_TITLES[activeTab] || 'Admin'}
          onOpenPasswordReset={() => setIsPasswordResetOpen(true)}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {isStoreAdmin && shopOffline && (
          <div id="shop-offline-notice" className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 sm:px-8 py-2.5 text-sm flex items-start gap-2">
            <CloudOff className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Shop server is offline.</strong> You can look around, but changes to products, orders, categories and shop
              settings won't be kept. (Category banners are kept in this browser.)
            </span>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-6xl w-full mx-auto">{children}</main>
      </div>

      <PasswordResetModal isOpen={isPasswordResetOpen} onClose={() => setIsPasswordResetOpen(false)} />
    </div>
  );
}
