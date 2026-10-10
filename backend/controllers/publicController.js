import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { productsStore, createProduct } from './productController.js';
import { categoriesStore, collectionsStore } from './categoryController.js';
import { homepageSectionsStore } from './homepageController.js';
import { bannersStore } from './bannerController.js';
import { programsStore, coachesStore, bookingsStore } from './academyController.js';
import { reviewsStore, settingsStore } from './settingsController.js';
import { ordersStore } from './orderController.js';

export const getPublicStorefrontInit = async (req, res, next) => {
  try {
    const activeBanners = bannersStore.filter((b) => b.status === 'published');
    const publishedCategories = categoriesStore.filter((c) => c.status === 'published');

    return sendSuccess(res, {
      settings: settingsStore,
      categories: publishedCategories,
      banners: activeBanners,
    });
  } catch (err) {
    next(err);
  }
};

export const getPublicHomepage = async (req, res, next) => {
  try {
    const visibleSections = homepageSectionsStore
      .filter((s) => s.isVisible)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return sendSuccess(res, { sections: visibleSections });
  } catch (err) {
    next(err);
  }
};

const formatPublicProduct = (p) => {
  const price = typeof p.price === 'number' ? p.price : (p.priceFils ? p.priceFils / 100 : 49.99);
  const oldPrice = typeof p.oldPrice === 'number' ? p.oldPrice : (p.oldPriceFils ? p.oldPriceFils / 100 : null);
  const image = p.image || (p.images && p.images[0]) || '/images/strategy_basketball_ball.jpg';
  
  return {
    ...p,
    price,
    oldPrice,
    image,
    rating: p.rating || 4.9,
    reviewsCount: p.reviewsCount || 35,
  };
};

export const getPublicProducts = async (req, res, next) => {
  try {
    const { category, sport, gender, special, search, sort } = req.query;

    let items = productsStore.filter((p) => p.status === 'published');

    if (category && category !== 'all') {
      items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (sport && sport !== 'all') {
      items = items.filter((p) => p.sport.toLowerCase() === sport.toLowerCase());
    }

    if (gender && gender !== 'all') {
      items = items.filter((p) => p.gender.toLowerCase() === gender.toLowerCase() || p.gender === 'unisex');
    }

    if (special === 'true') {
      items = items.filter((p) => p.isSpecialEdition);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    const formattedItems = items.map(formatPublicProduct);
    return sendSuccess(res, { products: formattedItems, total: formattedItems.length });
  } catch (err) {
    next(err);
  }
};

export const getPublicProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const item = productsStore.find(
      (p) => (p.slug === slug || p.id === slug) && p.status === 'published'
    );

    if (!item) {
      return sendError(res, 'Product not found', 404);
    }

    return sendSuccess(res, formatPublicProduct(item));
  } catch (err) {
    next(err);
  }
};

export const getPublicCategories = async (req, res, next) => {
  try {
    const published = categoriesStore.filter((c) => c.status === 'published');
    return sendSuccess(res, { categories: published });
  } catch (err) {
    next(err);
  }
};

export const getPublicCollections = async (req, res, next) => {
  try {
    const published = collectionsStore.filter((c) => c.status === 'published');
    return sendSuccess(res, { collections: published });
  } catch (err) {
    next(err);
  }
};

export const getPublicPrograms = async (req, res, next) => {
  try {
    const active = programsStore.filter((p) => p.status === 'active');
    return sendSuccess(res, { programs: active });
  } catch (err) {
    next(err);
  }
};

export const getPublicCoaches = async (req, res, next) => {
  try {
    const active = coachesStore.filter((c) => c.status === 'active');
    return sendSuccess(res, { coaches: active });
  } catch (err) {
    next(err);
  }
};

export const submitPublicOrder = async (req, res, next) => {
  try {
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customerName: req.body.customerName || 'Store Guest',
      customerEmail: req.body.customerEmail || 'guest@strategy.ae',
      customerPhone: req.body.customerPhone || '+971 50 000 0000',
      status: 'pending',
      paymentMethod: req.body.paymentMethod || 'COD',
      paymentStatus: 'pending',
      subtotalFils: req.body.subtotalFils || 0,
      vatFils: req.body.vatFils || 0,
      shippingFils: req.body.shippingFils || 0,
      totalFils: req.body.totalFils || 0,
      shippingAddress: req.body.shippingAddress || {},
      courierName: 'Emirates Post',
      trackingNumber: '',
      createdAt: new Date().toISOString(),
      items: req.body.items || [],
    };

    ordersStore.unshift(newOrder);
    return sendSuccess(res, newOrder, 'Order placed successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const submitPublicEnquiry = async (req, res, next) => {
  try {
    const bookingNumber = `BKG-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newBooking = {
      id: `bkg_${Date.now()}`,
      bookingNumber,
      participantName: req.body.participantName || 'Trial Participant',
      participantAge: req.body.participantAge || 12,
      programTitle: req.body.programTitle || 'Pro Basketball Intensive Academy',
      coachName: req.body.coachName || 'Coach Marcus Vance',
      preferredDay: req.body.preferredDay || 'Saturday',
      preferredTime: req.body.preferredTime || '10:00 AM',
      customerName: req.body.customerName || req.body.participantName || 'Parent',
      customerEmail: req.body.customerEmail || 'parent@gmail.com',
      customerPhone: req.body.customerPhone || '+971 50 123 4567',
      feePaidFils: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    bookingsStore.unshift(newBooking);
    return sendSuccess(res, newBooking, 'Trial registration submitted successfully', 201);
  } catch (err) {
    next(err);
  }
};
