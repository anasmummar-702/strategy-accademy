import React, { useEffect, useState } from 'react';
import { ShoppingBag, AlertTriangle, Package, Plus, FolderTree, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import StatusBadge from '../../components/StatusBadge';
import { loadProducts, loadOrders, LOW_STOCK_LIMIT } from '../../services/storeData';
import { Welcome, SummaryCard, QuickAction, Panel, EmptyRow } from './HomeParts';

const OPEN_STATUSES = ['pending', 'paid', 'processing'];

const aed = (fils) =>
  `AED ${((fils || 0) / 100).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function StoreHome({ onNavigate, onAddNewProduct }) {
  const { admin } = useAdminAuth();
  const [products, setProducts] = useState(null);
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    loadProducts().then(setProducts);
    loadOrders().then(setOrders);
  }, []);

  const loading = !products || !orders;
  const openOrders = (orders || []).filter((o) => OPEN_STATUSES.includes(o.status));
  const lowStock = (products || [])
    .filter((p) => (p.stockQuantity ?? 0) <= (p.lowStockThreshold ?? LOW_STOCK_LIMIT))
    .sort((a, b) => a.stockQuantity - b.stockQuantity);
  const liveProducts = (products || []).filter((p) => p.status === 'published');

  if (loading) {
    return <p className="text-base text-zinc-500">Loading your shop…</p>;
  }

  return (
    <div className="space-y-8">
      <Welcome name={admin?.fullName}>
        {openOrders.length > 0
          ? `${openOrders.length} order${openOrders.length === 1 ? ' needs' : 's need'} to be packed and sent.`
          : 'No orders waiting. Here is a quick look at your shop.'}
      </Welcome>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          id="home-card-orders"
          icon={ShoppingBag}
          tone={openOrders.length ? 'blue' : 'zinc'}
          value={openOrders.length}
          label="Orders to send out"
          hint={`${orders.length} orders in total`}
          action="Open orders"
          onClick={() => onNavigate('orders')}
        />
        <SummaryCard
          id="home-card-stock"
          icon={AlertTriangle}
          tone={lowStock.length ? 'rose' : 'emerald'}
          value={lowStock.length}
          label="Products running low"
          hint={`${LOW_STOCK_LIMIT} or fewer left`}
          action="Update stock"
          onClick={() => onNavigate('products')}
        />
        <SummaryCard
          id="home-card-products"
          icon={Package}
          tone="zinc"
          value={liveProducts.length}
          label="Products in the shop"
          hint="Visible on your website"
          action="See products"
          onClick={() => onNavigate('products')}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-500 mb-3">Quick actions</h3>
        <div className="flex flex-wrap gap-3">
          <QuickAction primary icon={Plus} label="Add a product" onClick={onAddNewProduct} />
          <QuickAction icon={ShoppingBag} label="Pack & send orders" onClick={() => onNavigate('orders')} />
          <QuickAction icon={FolderTree} label="Edit categories" onClick={() => onNavigate('categories')} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Panel title="Latest orders" linkLabel="See all" onLink={() => onNavigate('orders')}>
            {orders.length === 0 ? (
              <EmptyRow icon={ShoppingBag} title="No orders yet" text="New orders from your website will appear here." />
            ) : (
              <ul className="divide-y divide-zinc-100">
                {orders.slice(0, 5).map((o) => (
                  <li key={o.id} className="px-5 py-3.5 flex items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-medium text-zinc-900 truncate">{o.customerName}</p>
                      <p className="text-sm text-zinc-500 whitespace-nowrap">{o.orderNumber}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-4 flex-shrink-0">
                      <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">{aed(o.totalFils)}</span>
                      <StatusBadge status={o.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <Panel title="Running low on stock" linkLabel="Products" onLink={() => onNavigate('products')}>
            {lowStock.length === 0 ? (
              <EmptyRow icon={CheckCircle2} title="All stocked up" text="No product is running low right now." />
            ) : (
              <ul className="divide-y divide-zinc-100">
                {lowStock.slice(0, 5).map((p) => (
                  <li key={p.id} className="px-5 py-3.5 flex items-center gap-3">
                    <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-zinc-100 flex-shrink-0" />
                    <p className="text-sm font-medium text-zinc-900 flex-1 min-w-0 truncate">{p.name}</p>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 whitespace-nowrap">
                      {p.stockQuantity} left
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
