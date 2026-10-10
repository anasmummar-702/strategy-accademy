import React from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  Home,
  Image as ImageIcon,
  ShoppingBag,
  Users,
  Ticket,
  GraduationCap,
  Star,
  Menu,
  Settings as SettingsIcon,
  ShieldCheck,
  FileText,
  ChevronLeft,
  ExternalLink,
  HelpCircle,
  Plus
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { StrategyIcon } from '../../components/StrategyLogo';

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  workspace,
  setWorkspace,
  onAddNewProduct
}) {
  const { admin } = useAdminAuth();
  const isSuperAdmin = admin?.role === 'super_admin';
  const isStoreAdmin = admin?.role === 'store_admin';

  // E-Commerce Navigation Groups for Store Admin
  const storeNavigationGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Store Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'CATALOG & INVENTORY',
      items: [
        { id: 'products', label: 'Products & Stock', icon: Package, badge: '24' },
        { id: 'categories', label: 'Categories Tree', icon: FolderTree },
        { id: 'collections', label: 'Collections & Rules', icon: Layers },
      ]
    },
    {
      title: 'SALES & LOGISTICS',
      items: [
        { id: 'orders', label: 'Orders & Shipping', icon: ShoppingBag, badge: '5' },
        { id: 'customers', label: 'Customer Directory', icon: Users },
        { id: 'coupons', label: 'Coupons & Offers', icon: Ticket },
      ]
    },
    {
      title: 'CUSTOMER REPUTATION',
      items: [
        { id: 'reviews', label: 'Product Reviews', icon: Star, badge: '6' },
      ]
    },
    {
      title: 'STORE CONFIGURATION',
      items: [
        { id: 'settings', label: 'Shipping & Tax Settings', icon: SettingsIcon },
      ]
    }
  ];

  // Platform & Academy Navigation Groups for Admin
  const platformNavigationGroups = [
    {
      title: 'EXECUTIVE OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Platform Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'ACADEMY & PACKAGES',
      items: [
        { id: 'academy', label: 'Packages & Bookings', icon: GraduationCap, badge: '3' },
      ]
    },
    {
      title: 'CONTENT & MARKETING',
      items: [
        { id: 'homepage', label: 'Homepage Builder', icon: Home },
        { id: 'banners', label: 'Banners & Campaigns', icon: ImageIcon },
        { id: 'galleries', label: 'Academy Galleries', icon: Layers, badge: '8' },
        { id: 'navigation', label: 'Navbar & Footer', icon: Menu },
        { id: 'faqs', label: 'FAQs & Content', icon: HelpCircle },
      ]
    },
    {
      title: 'SECURITY & GOVERNANCE',
      items: [
        { id: 'users', label: 'Admin RBAC Users', icon: ShieldCheck },
        { id: 'audit', label: 'System Audit Logs', icon: FileText },
        { id: 'settings', label: 'Platform Settings', icon: SettingsIcon },
      ]
    }
  ];

  // Determine active navigation groups
  const navigationGroups = isStoreAdmin
    ? storeNavigationGroups
    : platformNavigationGroups;

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-zinc-950 border-r border-zinc-800/80 transition-all duration-300 flex flex-col overflow-hidden ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 px-3 border-b border-zinc-800/80 flex items-center justify-between flex-shrink-0">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <StrategyIcon className="w-6 h-6 flex-shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold tracking-wider text-white text-xs block truncate">STRATEGY</span>
                  {isStoreAdmin && (
                    <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-1 py-0.2 rounded">
                      STORE
                    </span>
                  )}
                  {isSuperAdmin && (
                    <span className="text-[9px] font-semibold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-1 py-0.2 rounded">
                      ADMIN
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-medium text-zinc-500 block -mt-0.5 truncate">
                  {isStoreAdmin ? 'E-Commerce Control' : 'Admin Control Center'}
                </span>
              </div>
            </div>

            <button
              id="sidebar-collapse-button"
              onClick={() => setCollapsed(true)}
              className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors flex-shrink-0 cursor-pointer"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <button
            id="sidebar-expand-button"
            onClick={() => setCollapsed(false)}
            className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center mx-auto transition cursor-pointer border border-zinc-800"
            title="Expand Sidebar"
          >
            <StrategyIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div 
        className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5 scrollbar-none no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Store Admin Action Button (+ Add New Product) - Hidden on Admin */}
        {isStoreAdmin && (
          <div className="mb-3">
            {!collapsed ? (
              <button
                id="sidebar-royal-add-product-btn"
                type="button"
                onClick={onAddNewProduct}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-dashed transition-all cursor-pointer shadow-xs group ${
                  activeTab === 'product-add'
                    ? 'border-emerald-400 bg-zinc-800 text-white ring-1 ring-emerald-400/50'
                    : 'border-zinc-700 hover:border-emerald-400 bg-zinc-900/70 hover:bg-zinc-800 text-zinc-200 hover:text-white'
                }`}
                title="Create New Product (Variants & Size Presets)"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>+ Add New Product</span>
              </button>
            ) : (
              <button
                id="sidebar-royal-add-product-btn-collapsed"
                type="button"
                onClick={onAddNewProduct}
                className={`w-8 h-8 mx-auto flex items-center justify-center rounded-lg border border-dashed transition cursor-pointer ${
                  activeTab === 'product-add'
                    ? 'border-emerald-400 bg-zinc-800 text-white'
                    : 'border-zinc-700 hover:border-emerald-400 bg-zinc-900 text-emerald-400 hover:text-white'
                }`}
                title="Add New Product"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {navigationGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-0.5">
            {!collapsed && (
              <p className="px-2.5 text-[10px] font-medium tracking-wider text-zinc-500 uppercase mb-1">
                {group.title}
              </p>
            )}

            {group.items.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors relative group cursor-pointer ${
                    isActive
                      ? 'bg-zinc-800 text-white font-medium'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 font-normal'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 stroke-[1.75] flex-shrink-0 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`} />

                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {!collapsed && item.badge && (
                    <span
                      className={`px-1.5 py-0.2 text-[9px] font-medium rounded ${
                        isActive ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-[11px] font-medium rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition z-50 border border-zinc-800">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-2 border-t border-zinc-800/80 bg-zinc-950 flex-shrink-0">
        <a
          href="https://strategyaccademy.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-normal text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/60 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Open Public Website"
        >
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
          {!collapsed && <span>Storefront</span>}
        </a>
      </div>
    </aside>
  );
}
