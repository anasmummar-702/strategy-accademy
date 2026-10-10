import { sendSuccess, sendError } from '../utils/responseHelper.js';

export let homepageSectionsStore = [
  {
    id: 'sec_hero',
    key: 'hero_banner',
    title: 'Hero Campaign Banners',
    subtitle: 'Main storefront hero slider featuring top promotions and new drops.',
    displayOrder: 1,
    isVisible: true,
    configuration: {
      autoplay: true,
      intervalMs: 5000,
      bannerCount: 3,
    },
  },
  {
    id: 'sec_trust',
    key: 'trust_badges',
    title: 'Brand Trust Badges & Metrics',
    subtitle: 'Highlights 10+ years experience, official equipment, and 3-day returns.',
    displayOrder: 2,
    isVisible: true,
    configuration: {
      showReturnBadge: true,
      showShippingBadge: true,
      showQualityBadge: true,
    },
  },
  {
    id: 'sec_categories',
    key: 'category_grid',
    title: 'Shop By Category Grid',
    subtitle: 'Visual grid highlighting main sports categories.',
    displayOrder: 3,
    isVisible: true,
    configuration: {
      columns: 4,
      showProductCounts: true,
    },
  },
  {
    id: 'sec_featured',
    key: 'featured_products',
    title: 'Featured Products Showcase',
    subtitle: 'Highlighted high-performance athletic gear.',
    displayOrder: 4,
    isVisible: true,
    configuration: {
      heading: 'FEATURED STRATEGY GEAR',
      subheading: 'Engineered for tournament competitors and elite athletes.',
      limit: 8,
    },
  },
  {
    id: 'sec_special_vault',
    key: 'special_vault',
    title: 'Special Edition Vault Banner',
    subtitle: 'Exclusive collector releases and limited edition gold drop.',
    displayOrder: 5,
    isVisible: true,
    configuration: {
      bannerTitle: 'SPECIAL EDITION VAULT',
      buttonText: 'EXPLORE VAULT',
      buttonLink: '#special-edition',
    },
  },
  {
    id: 'sec_best_sellers',
    key: 'best_sellers',
    title: 'Best Sellers Showcase',
    subtitle: 'Top rated gear by sports academy participants and customers.',
    displayOrder: 6,
    isVisible: true,
    configuration: {
      heading: 'BEST SELLERS',
      limit: 6,
    },
  },
  {
    id: 'sec_academy',
    key: 'academy_programs',
    title: 'Academy & Training Programs',
    subtitle: 'Professional sports coaching for basketball and skating.',
    displayOrder: 7,
    isVisible: true,
    configuration: {
      showTrialButton: true,
    },
  },
  {
    id: 'sec_reviews',
    key: 'customer_reviews',
    title: 'Customer & Athlete Reviews',
    subtitle: 'Verified feedback from academy parents, coaches, and players.',
    displayOrder: 8,
    isVisible: true,
    configuration: {
      displayCount: 6,
    },
  },
  {
    id: 'sec_newsletter',
    key: 'newsletter_signup',
    title: 'VIP Club & Newsletter',
    subtitle: 'Email capture section for exclusive discount codes.',
    displayOrder: 9,
    isVisible: true,
    configuration: {
      discountCode: 'WELCOME10',
    },
  },
];

export const getHomepageSections = async (req, res, next) => {
  try {
    const sorted = [...homepageSectionsStore].sort((a, b) => a.displayOrder - b.displayOrder);
    return sendSuccess(res, { sections: sorted }, 'Homepage sections fetched successfully');
  } catch (err) {
    next(err);
  }
};

export const reorderHomepageSections = async (req, res, next) => {
  try {
    const { sectionKeys } = req.body; // array of keys in new order
    if (!Array.isArray(sectionKeys)) {
      return sendError(res, 'Invalid sectionKeys array', 400);
    }

    sectionKeys.forEach((key, index) => {
      const item = homepageSectionsStore.find((s) => s.key === key);
      if (item) {
        item.displayOrder = index + 1;
      }
    });

    const sorted = [...homepageSectionsStore].sort((a, b) => a.displayOrder - b.displayOrder);
    return sendSuccess(res, { sections: sorted }, 'Homepage reordered successfully');
  } catch (err) {
    next(err);
  }
};

export const updateHomepageSection = async (req, res, next) => {
  try {
    const { key } = req.params;
    const item = homepageSectionsStore.find((s) => s.key === key);
    if (!item) {
      return sendError(res, 'Section not found', 404);
    }

    if (req.body.title !== undefined) item.title = req.body.title;
    if (req.body.subtitle !== undefined) item.subtitle = req.body.subtitle;
    if (req.body.isVisible !== undefined) item.isVisible = req.body.isVisible;
    if (req.body.configuration !== undefined) item.configuration = { ...item.configuration, ...req.body.configuration };

    return sendSuccess(res, item, 'Section updated successfully');
  } catch (err) {
    next(err);
  }
};
