import { sendSuccess, sendError } from '../utils/responseHelper.js';

export let categoriesStore = [
  {
    id: 'cat_bb',
    name: 'Basketball',
    slug: 'basketball',
    parentId: null,
    image: '/images/strategy_basketball_ball.jpg',
    description: 'Tournament-grade basketball balls, jerseys, footwear, and training gear.',
    displayOrder: 1,
    productCount: 4,
    status: 'published',
    subcategories: [
      { id: 'sub_bb_balls', name: 'Basketballs', slug: 'basketballs', productCount: 2 },
      { id: 'sub_bb_apparel', name: 'Jerseys & Apparel', slug: 'basketball-apparel', productCount: 2 },
    ]
  },
  {
    id: 'cat_run',
    name: 'Running',
    slug: 'running',
    parentId: null,
    image: '/images/strategy_running_shoe.jpg',
    description: 'Carbon-plated running shoes, marathon apparel, and hydrations packs.',
    displayOrder: 2,
    productCount: 3,
    status: 'published',
    subcategories: [
      { id: 'sub_run_shoes', name: 'Running Shoes', slug: 'running-shoes', productCount: 2 },
    ]
  },
  {
    id: 'cat_ftb',
    name: 'Football',
    slug: 'football',
    parentId: null,
    image: '/images/strategy_football_ball.jpg',
    description: 'Match balls, goalkeeper gloves, shin guards, and boots.',
    displayOrder: 3,
    productCount: 3,
    status: 'published',
    subcategories: []
  },
  {
    id: 'cat_skt',
    name: 'Skating',
    slug: 'skating',
    parentId: null,
    image: '/images/speed_inline_skates.jpg',
    description: 'Custom carbon speed inline skates, protective gear, and wheels.',
    displayOrder: 4,
    productCount: 2,
    status: 'published',
    subcategories: []
  },
  {
    id: 'cat_fit',
    name: 'Fitness',
    slug: 'fitness',
    parentId: null,
    image: '/images/speed_jump_rope.jpg',
    description: 'Pro resistance bands, speed jump ropes, and recovery foam rollers.',
    displayOrder: 5,
    productCount: 2,
    status: 'published',
    subcategories: []
  },
  {
    id: 'cat_app',
    name: 'Apparel',
    slug: 'apparel',
    parentId: null,
    image: '/images/pro_jersey_black.jpg',
    description: 'Moisture-wicking athletic jerseys, jackets, shorts, and compression wear.',
    displayOrder: 6,
    productCount: 5,
    status: 'published',
    subcategories: []
  }
];

export let collectionsStore = [
  {
    id: 'col_vault',
    name: 'Special Edition Vault',
    slug: 'special-edition-vault',
    image: '/images/pro_jersey_black.jpg',
    type: 'automated',
    ruleField: 'isSpecialEdition',
    ruleCondition: 'equals',
    ruleValue: 'true',
    productCount: 3,
    status: 'published',
    description: 'Numbered limited run gold-embroidered collector products.'
  },
  {
    id: 'col_best',
    name: 'Best Sellers 2026',
    slug: 'best-sellers',
    image: '/images/carbon_pro_shoe.jpg',
    type: 'automated',
    ruleField: 'isBestSeller',
    ruleCondition: 'equals',
    ruleValue: 'true',
    productCount: 5,
    status: 'published',
    description: 'Top rated performance gear chosen by professional athletes.'
  },
  {
    id: 'col_new',
    name: 'New Season Drops',
    slug: 'new-arrivals',
    image: '/images/strategy_performance_jacket.jpg',
    type: 'automated',
    ruleField: 'isNewArrival',
    ruleCondition: 'equals',
    ruleValue: 'true',
    productCount: 4,
    status: 'published',
    description: 'Latest 2026 sports innovations fresh from the STRATEGY design lab.'
  }
];

// Category API Handlers
export const getCategories = async (req, res, next) => {
  try {
    return sendSuccess(res, { categories: categoriesStore, total: categoriesStore.length });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const newCat = {
      id: `cat_${Date.now()}`,
      name: req.body.name,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      parentId: req.body.parentId || null,
      image: req.body.image || '/images/strategy_basketball_ball.jpg',
      description: req.body.description || '',
      displayOrder: req.body.displayOrder || categoriesStore.length + 1,
      productCount: 0,
      status: req.body.status || 'published',
      subcategories: [],
    };
    categoriesStore.push(newCat);
    return sendSuccess(res, newCat, 'Category created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = categoriesStore.findIndex((c) => c.id === id);
    if (index === -1) return sendError(res, 'Category not found', 404);

    categoriesStore[index] = { ...categoriesStore[index], ...req.body };
    return sendSuccess(res, categoriesStore[index], 'Category updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    categoriesStore = categoriesStore.filter((c) => c.id !== id);
    return sendSuccess(res, { id }, 'Category deleted successfully');
  } catch (err) {
    next(err);
  }
};

// Collection API Handlers
export const getCollections = async (req, res, next) => {
  try {
    return sendSuccess(res, { collections: collectionsStore, total: collectionsStore.length });
  } catch (err) {
    next(err);
  }
};

export const createCollection = async (req, res, next) => {
  try {
    const newCol = {
      id: `col_${Date.now()}`,
      name: req.body.name,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image: req.body.image || '/images/strategy_basketball_ball.jpg',
      type: req.body.type || 'manual',
      ruleField: req.body.ruleField || 'tag',
      ruleCondition: req.body.ruleCondition || 'equals',
      ruleValue: req.body.ruleValue || '',
      productCount: 0,
      status: req.body.status || 'published',
      description: req.body.description || '',
    };
    collectionsStore.push(newCol);
    return sendSuccess(res, newCol, 'Collection created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = collectionsStore.findIndex((c) => c.id === id);
    if (index === -1) return sendError(res, 'Collection not found', 404);

    collectionsStore[index] = { ...collectionsStore[index], ...req.body };
    return sendSuccess(res, collectionsStore[index], 'Collection updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    collectionsStore = collectionsStore.filter((c) => c.id !== id);
    return sendSuccess(res, { id }, 'Collection deleted successfully');
  } catch (err) {
    next(err);
  }
};
