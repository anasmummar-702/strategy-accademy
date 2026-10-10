import { sendSuccess, sendError } from '../utils/responseHelper.js';

// In-memory products store populated with seed data (which would connect to PostgreSQL DB in production DDL)
export let productsStore = [
  {
    id: 'prod-bb-01',
    name: 'STRATEGY Official Grip Composite Basketball',
    slug: 'strategy-official-grip-composite-basketball',
    sku: 'STR-BKB-001',
    category: 'Basketball',
    sport: 'Basketball',
    gender: 'unisex',
    priceFils: 6999, // AED 69.99
    salePriceFils: 6999,
    costPriceFils: 3500,
    images: ['/images/strategy_basketball_ball.jpg', '/images/basketball_hero_court.jpg'],
    description: 'Engineered with deep-pebble moisture-wicking composite leather and precision nylon windings for optimal grip and true bounce consistency on indoor hardwood courts.',
    stockQuantity: 35,
    lowStockThreshold: 5,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isSpecialEdition: false,
    status: 'published',
    sizes: ['Size 7 (Official)', 'Size 6 (Youth/Women)', 'Size 5 (Junior)'],
    colors: ['Deep Navy / Gold', 'Classic Amber', 'Midnight Black'],
    variants: [
      { id: 'v1', size: 'Size 7 (Official)', color: 'Deep Navy / Gold', stockQuantity: 15, priceOverrideFils: null },
      { id: 'v2', size: 'Size 6 (Youth/Women)', color: 'Classic Amber', stockQuantity: 10, priceOverrideFils: null },
      { id: 'v3', size: 'Size 5 (Junior)', color: 'Midnight Black', stockQuantity: 10, priceOverrideFils: null },
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-bb-02',
    name: 'STRATEGY Court Commander Pro Jersey',
    slug: 'strategy-court-commander-pro-jersey',
    sku: 'STR-APP-001',
    category: 'Basketball',
    sport: 'Basketball',
    gender: 'men',
    priceFils: 5499, // AED 54.99
    salePriceFils: 5499,
    costPriceFils: 2200,
    images: ['/images/strategy_performance_jacket.jpg', '/images/strategy_athlete_banner.jpg'],
    description: 'Pro-grade breathable open-hole mesh jersey with ergonomic shoulder cuts for unrestricted shooting release.',
    stockQuantity: 50,
    lowStockThreshold: 5,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isSpecialEdition: false,
    status: 'published',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Royal Blue', 'Deep Navy', 'Polar White'],
    variants: [
      { id: 'v4', size: 'M', color: 'Royal Blue', stockQuantity: 20, priceOverrideFils: null },
      { id: 'v5', size: 'L', color: 'Deep Navy', stockQuantity: 30, priceOverrideFils: null },
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-run-01',
    name: 'STRATEGY SF-Elite Carbon Speed Runner',
    slug: 'strategy-sf-elite-carbon-speed-runner',
    sku: 'STR-FTW-001',
    category: 'Running',
    sport: 'Running',
    gender: 'men',
    priceFils: 19999, // AED 199.99
    salePriceFils: 19999,
    costPriceFils: 9500,
    images: ['/images/strategy_running_shoe.jpg', '/images/strategy_athlete_banner.jpg'],
    description: 'Propulsive full-length carbon plate combined with ultra-responsive dual-density foam for marathon racing speed.',
    stockQuantity: 18,
    lowStockThreshold: 5,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isSpecialEdition: false,
    status: 'published',
    sizes: ['US 8', 'US 9', 'US 10', 'US 11'],
    colors: ['Neon Volt', 'Carbon Black'],
    variants: [],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-skt-01',
    name: 'STRATEGY Speed Carbon inline Skates',
    slug: 'strategy-speed-carbon-inline-skates',
    sku: 'STR-SKT-001',
    category: 'Skating',
    sport: 'Skating',
    gender: 'unisex',
    priceFils: 12999, // AED 129.99
    salePriceFils: 12999,
    costPriceFils: 6000,
    images: ['/images/speed_inline_skates.jpg', '/images/skating_equipment.jpg'],
    description: 'Custom heat-moldable carbon fiber shell inline skates with 110mm CNC aluminum frame and ILQ-9 speed bearings.',
    stockQuantity: 4, // low stock
    lowStockThreshold: 5,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isSpecialEdition: false,
    status: 'published',
    sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43'],
    colors: ['Stealth Black', 'Racing Red'],
    variants: [],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-ftb-01',
    name: 'STRATEGY Matchmaster Pro Football',
    slug: 'strategy-matchmaster-pro-football',
    sku: 'STR-FTB-001',
    category: 'Football',
    sport: 'Football',
    gender: 'unisex',
    priceFils: 7499, // AED 74.99
    salePriceFils: 7499,
    costPriceFils: 3200,
    images: ['/images/strategy_football_ball.jpg', '/images/football_stadium_banner.jpg'],
    description: 'FIFA-quality certified thermally bonded match ball with aero-groove textured outer panel for pin-point flight accuracy.',
    stockQuantity: 40,
    lowStockThreshold: 5,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isSpecialEdition: false,
    status: 'published',
    sizes: ['Size 5 (Match)', 'Size 4 (Junior)'],
    colors: ['White / Electric Blue', 'Neon Yellow / Charcoal'],
    variants: [],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-ftb-02',
    name: 'STRATEGY Pro Grip goalkeeper Gloves',
    slug: 'strategy-pro-grip-goalkeeper-gloves',
    sku: 'STR-FTB-002',
    category: 'Football',
    sport: 'Football',
    gender: 'unisex',
    priceFils: 4999, // AED 49.99
    salePriceFils: 4999,
    costPriceFils: 2000,
    images: ['/images/pro_grip_gloves.jpg'],
    description: '4mm Contact Latex palm for all-weather stickiness with removable finger support spines.',
    stockQuantity: 2, // low stock
    lowStockThreshold: 5,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isSpecialEdition: false,
    status: 'published',
    sizes: ['Size 8', 'Size 9', 'Size 10'],
    colors: ['Black / Lime Green'],
    variants: [],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-fit-01',
    name: 'STRATEGY Heavy-Duty Speed Jump Rope',
    slug: 'strategy-heavy-duty-speed-jump-rope',
    sku: 'STR-FIT-001',
    category: 'Fitness',
    sport: 'Fitness',
    gender: 'unisex',
    priceFils: 2999, // AED 29.99
    salePriceFils: 2999,
    costPriceFils: 1000,
    images: ['/images/speed_jump_rope.jpg'],
    description: '360-degree dual ball bearing aluminum handle jump rope with kink-resistant coated steel cable.',
    stockQuantity: 65,
    lowStockThreshold: 10,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isSpecialEdition: false,
    status: 'published',
    sizes: ['Adjustable 3M Cable'],
    colors: ['Metallic Silver', 'Matte Black'],
    variants: [],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-spc-01',
    name: 'STRATEGY Special Edition Gold Vault Jersey',
    slug: 'strategy-special-edition-gold-vault-jersey',
    sku: 'STR-SPC-001',
    category: 'Apparel',
    sport: 'Basketball',
    gender: 'unisex',
    priceFils: 14999, // AED 149.99
    salePriceFils: 14999,
    costPriceFils: 6000,
    images: ['/images/pro_jersey_black.jpg'],
    description: 'Numbered limited run gold-embroidered collector jersey celebrating 10 years of STRATEGY sports excellence.',
    stockQuantity: 12,
    lowStockThreshold: 5,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isSpecialEdition: true,
    status: 'published',
    sizes: ['M', 'L', 'XL'],
    colors: ['Midnight Black / 24K Gold'],
    variants: [],
    updatedAt: new Date().toISOString()
  }
];

export const getProducts = async (req, res, next) => {
  try {
    const { category, status, stockAlert, search, sort = 'name', order = 'asc' } = req.query;

    let result = [...productsStore];

    // Category Filter
    if (category && category !== 'all') {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    // Status Filter
    if (status && status !== 'all') {
      result = result.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }

    // Stock Alert Filter
    if (stockAlert === 'low_stock') {
      result = result.filter((p) => p.stockQuantity <= (p.lowStockThreshold || 5) && p.stockQuantity > 0);
    } else if (stockAlert === 'out_of_stock') {
      result = result.filter((p) => p.stockQuantity === 0);
    }

    // Search Query
    if (search) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sport.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sort];
      let valB = b[sort];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sendSuccess(res, { products: result, total: result.length }, 'Products fetched successfully');
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const newProduct = {
      id: `prod_${Date.now()}`,
      name: req.body.name,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      sku: req.body.sku || `STR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      category: req.body.category || 'Apparel',
      sport: req.body.sport || 'General',
      gender: req.body.gender || 'unisex',
      priceFils: req.body.priceFils || 5000,
      salePriceFils: req.body.salePriceFils || req.body.priceFils || 5000,
      costPriceFils: req.body.costPriceFils || 2500,
      images: req.body.images?.length ? req.body.images : ['/images/strategy_basketball_ball.jpg'],
      description: req.body.description || '',
      stockQuantity: req.body.stockQuantity || 10,
      lowStockThreshold: req.body.lowStockThreshold || 5,
      isFeatured: !!req.body.isFeatured,
      isBestSeller: !!req.body.isBestSeller,
      isNewArrival: !!req.body.isNewArrival,
      isSpecialEdition: !!req.body.isSpecialEdition,
      status: req.body.status || 'published',
      sizes: req.body.sizes || [],
      colors: req.body.colors || [],
      variants: req.body.variants || [],
      updatedAt: new Date().toISOString()
    };

    productsStore.unshift(newProduct);
    return sendSuccess(res, newProduct, 'Product created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = productsStore.findIndex((p) => p.id === id);

    if (index === -1) {
      return sendError(res, 'Product not found', 404);
    }

    const updatedProduct = {
      ...productsStore[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    productsStore[index] = updatedProduct;
    return sendSuccess(res, updatedProduct, 'Product updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = productsStore.findIndex((p) => p.id === id);

    if (index === -1) {
      return sendError(res, 'Product not found', 404);
    }

    // Soft delete / Archive
    productsStore[index].status = 'archived';
    productsStore[index].updatedAt = new Date().toISOString();

    return sendSuccess(res, { id, status: 'archived' }, 'Product archived successfully');
  } catch (err) {
    next(err);
  }
};

export const bulkUpdateProducts = async (req, res, next) => {
  try {
    const { ids, action, payload } = req.body; // action: 'status' | 'stock' | 'delete'

    if (!Array.isArray(ids) || ids.length === 0) {
      return sendError(res, 'No product IDs provided', 400);
    }

    productsStore = productsStore.map((p) => {
      if (ids.includes(p.id)) {
        if (action === 'status') p.status = payload.status;
        else if (action === 'stock') p.stockQuantity = payload.stockQuantity;
        else if (action === 'archive') p.status = 'archived';
        p.updatedAt = new Date().toISOString();
      }
      return p;
    });

    return sendSuccess(res, { updatedCount: ids.length }, `Bulk update completed on ${ids.length} products`);
  } catch (err) {
    next(err);
  }
};
