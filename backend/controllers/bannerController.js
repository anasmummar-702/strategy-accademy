import { sendSuccess, sendError } from '../utils/responseHelper.js';

export let bannersStore = [
  {
    id: 'ban_01',
    title: 'NEW SEASON STRATEGY ATHLETICS',
    subtitle: 'Carbon-Plated Speed Footwear & Pro Tournament Gear',
    desktopImageUrl: '/images/strategy_athlete_banner.jpg',
    mobileImageUrl: '/images/strategy_athlete_banner.jpg',
    targetUrl: '#shop',
    buttonText: 'SHOP THE COLLECTION',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    displayOrder: 1,
    status: 'published',
  },
  {
    id: 'ban_02',
    title: 'SPECIAL EDITION GOLD VAULT DROP',
    subtitle: 'Limited Run 10-Year Collector Collection',
    desktopImageUrl: '/images/pro_jersey_black.jpg',
    mobileImageUrl: '/images/pro_jersey_black.jpg',
    targetUrl: '#special-edition',
    buttonText: 'EXPLORE VAULT',
    startDate: '2026-10-05',
    endDate: '2026-10-31',
    displayOrder: 2,
    status: 'published',
  },
  {
    id: 'ban_03',
    title: 'STRATEGY SPORTS ACADEMIES',
    subtitle: 'Elite Basketball & Speed Skating Professional Coaching',
    desktopImageUrl: '/images/basketball_hero_court.jpg',
    mobileImageUrl: '/images/basketball_hero_court.jpg',
    targetUrl: '#trial',
    buttonText: 'BOOK FREE TRIAL',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    displayOrder: 3,
    status: 'published',
  }
];

export const getBanners = async (req, res, next) => {
  try {
    const sorted = [...bannersStore].sort((a, b) => a.displayOrder - b.displayOrder);
    return sendSuccess(res, { banners: sorted, total: sorted.length }, 'Banners fetched successfully');
  } catch (err) {
    next(err);
  }
};

export const createBanner = async (req, res, next) => {
  try {
    const newBanner = {
      id: `ban_${Date.now()}`,
      title: req.body.title || 'Untitled Campaign Banner',
      subtitle: req.body.subtitle || '',
      desktopImageUrl: req.body.desktopImageUrl || '/images/strategy_athlete_banner.jpg',
      mobileImageUrl: req.body.mobileImageUrl || req.body.desktopImageUrl || '/images/strategy_athlete_banner.jpg',
      targetUrl: req.body.targetUrl || '#shop',
      buttonText: req.body.buttonText || 'EXPLORE NOW',
      startDate: req.body.startDate || new Date().toISOString().split('T')[0],
      endDate: req.body.endDate || '2026-12-31',
      displayOrder: req.body.displayOrder || bannersStore.length + 1,
      status: req.body.status || 'published',
    };
    bannersStore.push(newBanner);
    return sendSuccess(res, newBanner, 'Banner created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = bannersStore.findIndex((b) => b.id === id);
    if (index === -1) return sendError(res, 'Banner not found', 404);

    bannersStore[index] = { ...bannersStore[index], ...req.body };
    return sendSuccess(res, bannersStore[index], 'Banner updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    bannersStore = bannersStore.filter((b) => b.id !== id);
    return sendSuccess(res, { id }, 'Banner deleted successfully');
  } catch (err) {
    next(err);
  }
};
