/**
 * Shared shop data loaders used by Home, Products and Orders,
 * so every page shows the same numbers.
 * Tries the backend first and falls back to the built-in sample data.
 */
import { productsData } from '../../data/products';

const API = 'http://localhost:5000/api/v1/admin';

export const LOW_STOCK_LIMIT = 5;

// Is the shop server reachable? Checked once and remembered for this visit.
let serverCheck = null;
export function checkShopServer() {
  if (!serverCheck) {
    serverCheck = (async () => {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 2500);
      try {
        const res = await fetch(`${API}/products`, { signal: ctrl.signal });
        return res.ok;
      } catch {
        return false;
      } finally {
        clearTimeout(t);
      }
    })();
  }
  return serverCheck;
}

export async function loadProducts() {
  try {
    const res = await fetch(`${API}/products`);
    const result = await res.json();
    if (result.success && result.data?.products?.length) return result.data.products;
    throw new Error('fallback');
  } catch {
    const mapped = productsData.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku || `STR-${p.id.toUpperCase()}`,
      category: p.category || 'General',
      sport: p.sport || 'General',
      gender: p.gender || 'unisex',
      priceFils: Math.round((p.price || 49.99) * 100),
      salePriceFils: Math.round((p.price || 49.99) * 100),
      costPriceFils: Math.round((p.price || 49.99) * 50),
      images: p.images || ['/images/strategy_basketball_ball.jpg'],
      image: p.images?.[0] || '/images/strategy_basketball_ball.jpg',
      description: p.description || '',
      stockQuantity: p.stock ?? 25,
      lowStockThreshold: 5,
      isFeatured: !!p.isFeatured,
      isBestSeller: !!p.isBestSeller,
      isNewArrival: !!p.isNew,
      isSpecialEdition: !!p.isSpecialEdition,
      status: 'published',
      variants: [],
    }));
    return mapped;
  }
}

export async function loadOrders() {
  try {
    const res = await fetch(`${API}/orders`);
    const result = await res.json();
    if (result.success && result.data?.orders) return result.data.orders;
    throw new Error('fallback');
  } catch {
    return [
      {
        id: 'ord_1048',
        orderNumber: 'ORD-2026-1048',
        customerName: 'Zayed Al Mansoori',
        customerEmail: 'zayed.mansoori@gmail.com',
        customerPhone: '+971 50 112 2334',
        status: 'processing',
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        subtotalFils: 80857,
        vatFils: 4043,
        totalFils: 84900,
        shippingAddress: { street: 'Villa 14, Al Wasl Road', city: 'Dubai', emirate: 'Dubai' },
        courierName: 'Emirates Post',
        trackingNumber: 'TRK-AE-99201',
        createdAt: '2026-10-07T12:30:00Z',
        items: [
          { id: 'i1', productName: 'STRATEGY Official Grip Composite Basketball', sku: 'STR-BKB-001', variant: 'Size 7 / Navy', unitPriceFils: 6999, quantity: 2 },
          { id: 'i2', productName: 'STRATEGY SF-Elite Carbon Speed Runner', sku: 'STR-FTW-001', variant: 'US 10 / Volt', unitPriceFils: 19999, quantity: 1 }
        ]
      },
      {
        id: 'ord_1047',
        orderNumber: 'ORD-2026-1047',
        customerName: 'David Miller',
        customerEmail: 'david.miller@eim.ae',
        customerPhone: '+971 52 887 9900',
        status: 'shipped',
        paymentMethod: 'Credit Card (Stripe)',
        paymentStatus: 'paid',
        subtotalFils: 33238,
        vatFils: 1662,
        totalFils: 34900,
        shippingAddress: { street: 'Apt 2204, Marina Crown', city: 'Dubai', emirate: 'Dubai' },
        courierName: 'Aramex Express',
        trackingNumber: 'ARX-982104-AE',
        createdAt: '2026-10-06T15:15:00Z',
        items: [
          { id: 'i3', productName: 'STRATEGY Special Edition Gold Vault Jersey', sku: 'STR-SPC-001', variant: 'XL / Gold', unitPriceFils: 14999, quantity: 2 }
        ]
      },
      {
        id: 'ord_1046',
        orderNumber: 'ORD-2026-1046',
        customerName: 'Mariam Al Shehhi',
        customerEmail: 'mariam.shehhi@yahoo.com',
        customerPhone: '+971 56 334 5566',
        status: 'delivered',
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid',
        subtotalFils: 123714,
        vatFils: 6186,
        totalFils: 129900,
        shippingAddress: { street: 'House 88, Corniche St', city: 'Abu Dhabi', emirate: 'Abu Dhabi' },
        courierName: 'DHL Express',
        trackingNumber: 'DHL-AE-448201',
        createdAt: '2026-10-06T09:40:00Z',
        items: [
          { id: 'i4', productName: 'STRATEGY Speed Carbon inline Skates', sku: 'STR-SKT-001', variant: 'EU 41 / Black', unitPriceFils: 12999, quantity: 1 }
        ]
      },
      {
        id: 'ord_1045',
        orderNumber: 'ORD-2026-1045',
        customerName: 'Rashid Al Nuaimi',
        customerEmail: 'rashid.n@gmail.com',
        customerPhone: '+971 50 998 7766',
        status: 'paid',
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid',
        subtotalFils: 57048,
        vatFils: 2852,
        totalFils: 59900,
        shippingAddress: { street: 'Villa 5, Al Jurf', city: 'Ajman', emirate: 'Ajman' },
        courierName: 'Emirates Post',
        trackingNumber: 'TRK-AE-88120',
        createdAt: '2026-10-05T18:20:00Z',
        items: []
      },
      {
        id: 'ord_1044',
        orderNumber: 'ORD-2026-1044',
        customerName: 'Sarah Jenkins',
        customerEmail: 'sarah.j@outlook.com',
        customerPhone: '+971 55 123 9988',
        status: 'pending',
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        subtotalFils: 23714,
        vatFils: 1186,
        totalFils: 24900,
        shippingAddress: { street: 'Apt 401, JLT Cluster T', city: 'Dubai', emirate: 'Dubai' },
        courierName: 'Emirates Post',
        trackingNumber: '',
        createdAt: '2026-10-05T14:10:00Z',
        items: []
      }
    ];
  }
}
