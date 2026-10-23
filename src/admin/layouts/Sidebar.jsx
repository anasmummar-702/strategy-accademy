import React, { useEffect, useState } from 'react';
import {
  Home,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Settings as SettingsIcon,
  GraduationCap,
  Image as ImageIcon,
  Inbox,
  ChevronLeft,
  ExternalLink,
  LogOut,
  Plus,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { StrategyIcon } from '../../components/StrategyLogo';
import { getAllTrialLeads } from '../../utils/trialLeadsData';

// Short, plain-language menus. Each login only sees what it needs.
export const STORE_MENU = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'settings', label: 'Shop settings', icon: SettingsIcon },
];

export const ACADEMY_MENU = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'trial-leads', label: 'Trial requests', icon: Inbox, badgeKey: 'newLeads' },
  { id: 'academy', label: 'Packages & prices', icon: GraduationCap },
  { id: 'galleries', label: 'Photo gallery', icon: ImageIcon },
];

function useNewLeadsCount() {
  const count = () => getAllTrialLeads().filter((l) => l.status === 'new').length;
  const [n, setN] = useState(count);
  useEffect(() => {
    const refresh = () => setN(count());
    window.addEventListener('strategy_trial_lead_added', refresh);
    window.addEventListener('strategy_trial_leads_changed', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('strategy_trial_lead_added', refresh);
      window.removeEventListener('strategy_trial_leads_changed', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return n;
}

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, onAddNewProduct }) {
  const { admin, logout } = useAdminAuth();
  const isStoreAdmin = admin?.role === 'store_admin';
  const newLeads = useNewLeadsCount();

  const menu = isStoreAdmin ? STORE_MENU : ACADEMY_MENU;
  const badges = { newLeads };
  const websiteHref = isStoreAdmin ? '/#shop' : '/#home';

  const itemBase =
    'w-full flex items-center gap-3 rounded-xl text-sm transition-colors relative group cursor-pointer';
  const itemPad = collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5';

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-zinc-950 border-r border-zinc-800/80 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand */}
      <div className="h-16 px-3 border-b border-zinc-800/80 flex items-center justify-between flex-shrink-0">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2.5 min-w-0 pl-1">
              <StrategyIcon className="w-7 h-7 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold tracking-wider text-white text-sm block">STRATEGY</span>
                <span className="text-xs text-zinc-400 block -mt-0.5">
                  {isStoreAdmin ? 'Shop admin' : 'Academy admin'}
                </span>
              </div>
            </div>
            <button
              id="sidebar-collapse-button"
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors cursor-pointer"
              title="Hide menu labels"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            id="sidebar-expand-button"
            onClick={() => setCollapsed(false)}
            className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center mx-auto transition cursor-pointer border border-zinc-800"
            title="Show menu"
          >
            <StrategyIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1">
        {isStoreAdmin && (
          <button
            id="sidebar-add-product-btn"
            type="button"
            onClick={onAddNewProduct}
            title="Add a product"
            className={`${itemBase} ${itemPad} mb-3 font-semibold bg-white text-zinc-950 hover:bg-zinc-200`}
          >
            <Plus className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>Add a product</span>}
          </button>
        )}

        {menu.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'products' && activeTab === 'product-add');
          const Icon = item.icon;
          const badge = item.badgeKey ? badges[item.badgeKey] : 0;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`${itemBase} ${itemPad} ${
                isActive
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
              {badge > 0 && (
                <span
                  className={
                    collapsed
                      ? 'absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-500'
                      : 'min-w-[22px] px-1.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500 text-white text-center'
                  }
                >
                  {collapsed ? '' : badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2.5 border-t border-zinc-800/80 space-y-1 flex-shrink-0">
        <a
          href={websiteHref}
          target="_blank"
          rel="noopener noreferrer"
          title="Open your website"
          className={`${itemBase} ${itemPad} text-zinc-400 hover:text-white hover:bg-zinc-900`}
        >
          <ExternalLink className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>View website</span>}
        </a>
        <button
          id="sidebar-sign-out-btn"
          onClick={logout}
          title="Sign out"
          className={`${itemBase} ${itemPad} text-zinc-400 hover:text-rose-300 hover:bg-zinc-900`}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
