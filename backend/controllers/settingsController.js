import { sendSuccess, sendError } from '../utils/responseHelper.js';

export let couponsStore = [
  {
    id: 'coup_01',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10, // 10% off
    minSpendFils: 10000, // AED 100
    usageLimit: 500,
    timesUsed: 142,
    expiryDate: '2026-12-31',
    status: 'active',
  },
  {
    id: 'coup_02',
    code: 'STRATEGY50',
    discountType: 'fixed',
    discountValueFils: 5000, // AED 50 off
    minSpendFils: 30000, // AED 300
    usageLimit: 100,
    timesUsed: 38,
    expiryDate: '2026-11-30',
    status: 'active',
  },
  {
    id: 'coup_03',
    code: 'VAULT20',
    discountType: 'percentage',
    discountValue: 20, // 20% off
    minSpendFils: 50000, // AED 500
    usageLimit: 50,
    timesUsed: 29,
    expiryDate: '2026-10-31',
    status: 'active',
  }
];

export let reviewsStore = [
  {
    id: 'rev_01',
    productName: 'STRATEGY Carbon Elite Speed Shoe',
    reviewerName: 'Zayed Al Mansoori',
    rating: 5,
    reviewText: 'The carbon plate propulsion on these shoes is insane! Lowered my 10k time by 90 seconds.',
    isVerifiedBuyer: true,
    status: 'approved',
    createdAt: '2026-10-06T14:20:00Z',
  },
  {
    id: 'rev_02',
    productName: 'STRATEGY Tournament Leather Basketball',
    reviewerName: 'Coach Marcus Vance',
    rating: 5,
    reviewText: 'Excellent moisture-wicking composite leather grip. We use these exclusively in our academy training sessions.',
    isVerifiedBuyer: true,
    status: 'approved',
    createdAt: '2026-10-05T10:15:00Z',
  },
  {
    id: 'rev_03',
    productName: 'STRATEGY Speed Carbon inline Skates',
    reviewerName: 'Mariam Al Shehhi',
    rating: 5,
    reviewText: 'Super rigid heat-moldable carbon boot. Top quality bearings!',
    isVerifiedBuyer: true,
    status: 'approved',
    createdAt: '2026-10-04T18:30:00Z',
  },
  {
    id: 'rev_04',
    productName: 'STRATEGY Matchmaster Pro Football',
    reviewerName: 'Rashid Al Nuaimi',
    rating: 4,
    reviewText: 'True flight trajectory on long passes. Highly recommended match ball.',
    isVerifiedBuyer: true,
    status: 'pending',
    createdAt: '2026-10-07T08:10:00Z',
  }
];

export let settingsStore = {
  storeName: 'STRATEGY Athletics & Gear',
  currency: 'AED',
  vatPercent: 5,
  trnNumber: '100293847500003',
  freeShippingThresholdFils: 30000, // AED 300
  shippingFeeFils: 2000, // AED 20
  contactEmail: 'support@strategy.ae',
  contactPhone: '+971 4 330 0000',
  address: 'STRATEGY Sports Tower, Al Wasl Road, Dubai, UAE',
};

export let adminUsersStore = [
  {
    id: 'usr_01',
    email: 'admin@strategy.ae',
    fullName: 'Executive Owner',
    role: 'super_admin',
    roleName: 'Administrator',
    status: 'active',
    lastLogin: 'Just now',
  },
  {
    id: 'usr_02',
    email: 'manager@strategy.ae',
    fullName: 'Store Operations Manager',
    role: 'store_manager',
    roleName: 'Store Manager',
    status: 'active',
    lastLogin: '2 hours ago',
  },
  {
    id: 'usr_03',
    email: 'editor@strategy.ae',
    fullName: 'Content & CMS Editor',
    role: 'content_editor',
    roleName: 'Content Editor',
    status: 'active',
    lastLogin: 'Yesterday',
  }
];

export let auditLogsStore = [
  {
    id: 'log_01',
    actorName: 'Executive Owner',
    actorRole: 'Super Admin',
    action: 'PRODUCT_UPDATE',
    target: 'STRATEGY Carbon Elite Speed Shoe',
    details: 'Updated sale price to AED 899.00 and stock to 18 units',
    timestamp: '2026-10-07T16:40:00Z',
  },
  {
    id: 'log_02',
    actorName: 'Store Operations Manager',
    actorRole: 'Store Manager',
    action: 'ORDER_FULFILLED',
    target: 'Order #ORD-2026-1047',
    details: 'Status updated to SHIPPED via Emirates Post (TRK-99201)',
    timestamp: '2026-10-07T15:10:00Z',
  },
  {
    id: 'log_03',
    actorName: 'Content & CMS Editor',
    actorRole: 'Content Editor',
    action: 'BANNER_PUBLISH',
    target: 'Special Vault Promotion Banner',
    details: 'Published homepage hero banner set to end Oct 31',
    timestamp: '2026-10-06T09:30:00Z',
  },
  {
    id: 'log_04',
    actorName: 'Executive Owner',
    actorRole: 'Super Admin',
    action: 'COUPON_CREATE',
    target: 'WELCOME10',
    details: 'Created 10% discount promo code for new subscribers',
    timestamp: '2026-10-05T12:00:00Z',
  }
];

// Handlers
export const getCoupons = async (req, res, next) => {
  try {
    return sendSuccess(res, { coupons: couponsStore });
  } catch (err) {
    next(err);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const newCoupon = {
      id: `coup_${Date.now()}`,
      code: req.body.code.toUpperCase(),
      discountType: req.body.discountType || 'percentage',
      discountValue: req.body.discountValue || 10,
      minSpendFils: req.body.minSpendFils || 0,
      usageLimit: req.body.usageLimit || 100,
      timesUsed: 0,
      expiryDate: req.body.expiryDate || '2026-12-31',
      status: 'active',
    };
    couponsStore.push(newCoupon);
    return sendSuccess(res, newCoupon, 'Coupon created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    return sendSuccess(res, { reviews: reviewsStore });
  } catch (err) {
    next(err);
  }
};

export const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const rev = reviewsStore.find((r) => r.id === id);
    if (!rev) return sendError(res, 'Review not found', 404);
    rev.status = status;
    return sendSuccess(res, rev, 'Review status updated');
  } catch (err) {
    next(err);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    return sendSuccess(res, { settings: settingsStore });
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    settingsStore = { ...settingsStore, ...req.body };
    return sendSuccess(res, settingsStore, 'Store settings updated successfully');
  } catch (err) {
    next(err);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    return sendSuccess(res, { users: adminUsersStore });
  } catch (err) {
    next(err);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    return sendSuccess(res, { auditLogs: auditLogsStore });
  } catch (err) {
    next(err);
  }
};
