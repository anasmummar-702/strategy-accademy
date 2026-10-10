import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import PasswordResetModal from '../pages/PasswordResetModal';
import { ChevronRight, Home, Store, Crown } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLayout({
  activeTab,
  setActiveTab,
  workspace,
  setWorkspace,
  onAddNewProduct,
  children
}) {
  const { admin, switchDemoRole } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);

  const isStoreAdmin = admin?.role === 'store_admin';
  const isSuperAdmin = admin?.role === 'super_admin';

  // Map activeTab to readable breadcrumb trail
  const getBreadcrumbs = (tab) => {
    const map = {
      dashboard: [isStoreAdmin ? 'E-Commerce' : 'Executive', 'Dashboard'],
      products: ['Catalog', 'Products & Stock'],
      'product-add': ['Catalog', 'Add New Product'],
      categories: ['Catalog', 'Categories Tree'],
      collections: ['Catalog', 'Collections'],
      homepage: ['Content & CMS', 'Homepage Builder'],
      banners: ['Content & CMS', 'Banners & Campaigns'],
      galleries: ['Content & CMS', 'Academy Galleries'],
      navigation: ['Content & CMS', 'Navbar & Footer'],
      faqs: ['Content & CMS', 'FAQs & Content'],
      orders: ['Sales & Logistics', 'Orders & Shipping'],
      customers: ['Sales & Logistics', 'Customer Directory'],
      coupons: ['Sales & Logistics', 'Coupons & Discounts'],
      academy: ['Academy & Packages', 'Packages, Trials & Coaches'],
      reviews: ['Customer Experience', 'Product Reviews'],
      settings: [isStoreAdmin ? 'Store Settings' : 'Platform Governance', 'Settings & Compliance'],
      users: ['Platform Governance', 'Admin RBAC Users'],
      audit: ['Platform Governance', 'System Audit Logs'],
    };
    return map[tab] || ['Admin', tab];
  };

  const breadcrumbs = getBreadcrumbs(activeTab);

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-['Plus_Jakarta_Sans',sans-serif] flex antialiased selection:bg-zinc-900 selection:text-white">
      {/* Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        workspace={workspace}
        setWorkspace={setWorkspace}
        onAddNewProduct={onAddNewProduct}
      />

      {/* Main Wrapper */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'pl-16' : 'pl-60'}`}>
        {/* Header Topbar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenPasswordReset={() => setIsPasswordResetOpen(true)}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          workspace={workspace}
          setWorkspace={setWorkspace}
        />

        {/* Dynamic Breadcrumbs Bar */}
        <div className="px-6 py-2 bg-zinc-950 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium text-zinc-200">
              {isStoreAdmin ? (
                <Store className="w-3.5 h-3.5 text-emerald-400 stroke-[2]" />
              ) : (
                <Crown className="w-3.5 h-3.5 text-indigo-400 stroke-[2]" />
              )}
              {isStoreAdmin ? 'Store Admin' : 'Admin'}
            </span>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span className={idx === breadcrumbs.length - 1 ? 'font-medium text-white' : 'text-zinc-400'}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <button
              id="breadcrumb-switch-role-btn"
              onClick={() => switchDemoRole(isStoreAdmin ? 'super_admin' : 'store_admin')}
              className="px-2 py-0.5 rounded-md font-semibold border border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer flex items-center gap-1"
              title="Toggle between Store Admin and Admin accounts"
            >
              <span className="text-zinc-500">⇄</span>
              <span>Switch to {isStoreAdmin ? 'Admin' : 'Store Admin'}</span>
            </button>
          </div>
        </div>

        {/* Page Content View */}
        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={isPasswordResetOpen}
        onClose={() => setIsPasswordResetOpen(false)}
      />
    </div>
  );
}
