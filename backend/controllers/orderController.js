import { sendSuccess, sendError } from '../utils/responseHelper.js';

export let ordersStore = [
  {
    id: 'ord_1048',
    orderNumber: 'ORD-2026-1048',
    customerName: 'Zayed Al Mansoori',
    customerEmail: 'zayed.mansoori@gmail.com',
    customerPhone: '+971 50 112 2334',
    status: 'processing',
    paymentMethod: 'COD',
    paymentStatus: 'pending',
    subtotalFils: 80857, // AED 808.57
    discountFils: 0,
    vatFils: 4043, // AED 40.43 (5% VAT)
    shippingFils: 0, // Free shipping
    totalFils: 84900, // AED 849.00
    shippingAddress: {
      fullName: 'Zayed Al Mansoori',
      street: 'Villa 14, Al Wasl Road',
      city: 'Dubai',
      emirate: 'Dubai',
      country: 'United Arab Emirates',
      zip: '00000',
    },
    courierName: 'Emirates Post',
    trackingNumber: 'TRK-AE-99201',
    createdAt: '2026-10-07T12:30:00Z',
    items: [
      {
        id: 'item_1',
        productId: 'prod-bb-01',
        productName: 'STRATEGY Official Grip Composite Basketball',
        sku: 'STR-BKB-001',
        variant: 'Size 7 (Official) / Deep Navy',
        unitPriceFils: 6999, // AED 69.99
        quantity: 2,
        totalPriceFils: 13998,
        image: '/images/strategy_basketball_ball.jpg',
      },
      {
        id: 'item_2',
        productId: 'prod-run-01',
        productName: 'STRATEGY SF-Elite Carbon Speed Runner',
        sku: 'STR-FTW-001',
        variant: 'US 10 / Neon Volt',
        unitPriceFils: 19999, // AED 199.99
        quantity: 1,
        totalPriceFils: 19999,
        image: '/images/strategy_running_shoe.jpg',
      }
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
    subtotalFils: 33238, // AED 332.38
    discountFils: 0,
    vatFils: 1662, // AED 16.62
    shippingFils: 0,
    totalFils: 34900, // AED 349.00
    shippingAddress: {
      fullName: 'David Miller',
      street: 'Apt 2204, Marina Crown Tower',
      city: 'Dubai',
      emirate: 'Dubai',
      country: 'United Arab Emirates',
      zip: '00000',
    },
    courierName: 'Aramex Express',
    trackingNumber: 'ARX-982104-AE',
    createdAt: '2026-10-06T15:15:00Z',
    items: [
      {
        id: 'item_3',
        productId: 'prod-spc-01',
        productName: 'STRATEGY Special Edition Gold Vault Jersey',
        sku: 'STR-SPC-001',
        variant: 'XL / Black Gold',
        unitPriceFils: 14999,
        quantity: 2,
        totalPriceFils: 29998,
        image: '/images/pro_jersey_black.jpg',
      }
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
    discountFils: 0,
    vatFils: 6186,
    shippingFils: 0,
    totalFils: 129900, // AED 1,299.00
    shippingAddress: {
      fullName: 'Mariam Al Shehhi',
      street: 'House 88, Corniche Street',
      city: 'Abu Dhabi',
      emirate: 'Abu Dhabi',
      country: 'United Arab Emirates',
      zip: '00000',
    },
    courierName: 'DHL Express',
    trackingNumber: 'DHL-AE-448201',
    createdAt: '2026-10-06T09:40:00Z',
    items: [
      {
        id: 'item_4',
        productId: 'prod-skt-01',
        productName: 'STRATEGY Speed Carbon inline Skates',
        sku: 'STR-SKT-001',
        variant: 'EU 41 / Stealth Black',
        unitPriceFils: 12999,
        quantity: 1,
        totalPriceFils: 12999,
        image: '/images/speed_inline_skates.jpg',
      }
    ]
  }
];

export const getOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let result = [...ordersStore];

    if (status && status !== 'all') {
      result = result.filter((o) => o.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      );
    }

    return sendSuccess(res, { orders: result, total: result.length }, 'Orders fetched successfully');
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = ordersStore.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return sendError(res, 'Order not found', 404);
    return sendSuccess(res, order);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, courierName, trackingNumber, paymentStatus } = req.body;

    const order = ordersStore.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return sendError(res, 'Order not found', 404);

    if (status) order.status = status;
    if (courierName) order.courierName = courierName;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    return sendSuccess(res, order, 'Order fulfillment status updated successfully');
  } catch (err) {
    next(err);
  }
};
