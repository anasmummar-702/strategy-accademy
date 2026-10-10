// Storefront & Category Hero Banners Configuration Service
// Synchronizes category banners between the Admin Category Tree and the storefront CategoryShopView

export const BANNER_IMAGE_PRESETS = [
  { label: 'Inline Skates', url: '/images/inline_skates.jpg' },
  { label: 'Running Shoes', url: '/images/strategy_running_shoe.jpg' },
  { label: 'Basketball Ball', url: '/images/strategy_basketball_ball.jpg' },
  { label: 'Football Cleat', url: '/images/strategy_football_cleat.jpg' },
  { label: 'Performance Jacket', url: '/images/strategy_performance_jacket.jpg' },
  { label: 'Athlete Hero Banner', url: '/images/strategy_athlete_banner.jpg' },
  { label: 'Vault Special Edition', url: '/images/banner_special_vault.jpg' },
  { label: 'Basketball Court', url: '/images/basketball_hero_court.jpg' },
  { label: 'Junior Coaching', url: '/images/banner_1.jpg' },
  { label: 'Group Skating', url: '/images/banner_2.jpg' },
];

export const BANNER_GRADIENT_PRESETS = [
  { label: 'Teal Emerald', value: 'from-slate-950/95 via-slate-950/85 to-teal-950/90', glow: 'bg-teal-500/25', badgeStyle: 'bg-teal-400/20 text-teal-300 border-teal-400/40' },
  { label: 'Sky Blue', value: 'from-slate-950/95 via-slate-950/85 to-sky-950/90', glow: 'bg-sky-500/25', badgeStyle: 'bg-sky-400/20 text-sky-300 border-sky-400/40' },
  { label: 'Hardwood Amber', value: 'from-slate-950/95 via-slate-950/85 to-amber-950/90', glow: 'bg-amber-600/25', badgeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { label: 'Stadium Emerald', value: 'from-slate-950/95 via-slate-950/85 to-emerald-950/90', glow: 'bg-emerald-500/25', badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { label: 'Indigo Pro', value: 'from-slate-950/95 via-slate-950/85 to-indigo-950/90', glow: 'bg-indigo-500/25', badgeStyle: 'bg-indigo-400/20 text-indigo-300 border-indigo-400/40' },
  { label: 'Royal Blue', value: 'from-slate-950/95 via-blue-950/85 to-slate-950/90', glow: 'bg-blue-600/25', badgeStyle: 'bg-blue-400/20 text-blue-300 border-blue-400/40' },
  { label: 'Rose Performance', value: 'from-slate-950/95 via-slate-950/85 to-rose-950/90', glow: 'bg-rose-500/25', badgeStyle: 'bg-rose-400/20 text-rose-300 border-rose-400/40' },
  { label: 'Cyan Athletics', value: 'from-slate-950/95 via-slate-950/85 to-cyan-950/90', glow: 'bg-cyan-500/25', badgeStyle: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40' },
  { label: 'Gold Vault', value: 'from-slate-950/95 via-amber-950/85 to-slate-950/90', glow: 'bg-amber-500/25', badgeStyle: 'bg-amber-400/20 text-amber-300 border-amber-400/40' },
];

export const DEFAULT_CATEGORY_BANNERS = [
  {
    id: 'ban_skating',
    slug: 'skating',
    categoryName: 'Inline Skating',
    badge: 'PRECISION GLIDE & RINK GEAR',
    badgeStyle: 'bg-teal-400/20 text-teal-300 border-teal-400/40',
    title: 'SKATING ANGELS RINK',
    subtitle: 'Inline quad skates, protective armor padding kits & precision bearings.',
    image: '/images/inline_skates.jpg',
    gradient: 'from-slate-950/95 via-slate-950/85 to-teal-950/90',
    glow: 'bg-teal-500/25',
    status: 'published',
  },
  {
    id: 'ban_running',
    slug: 'running',
    categoryName: 'Running & Footwear',
    badge: 'CARBON PLATED SPEED',
    badgeStyle: 'bg-sky-400/20 text-sky-300 border-sky-400/40',
    title: 'CARBON RUNNING LAB',
    subtitle: 'Carbon-plated marathon racing shoes, ultra-light apparel & performance gear.',
    image: '/images/strategy_running_shoe.jpg',
    gradient: 'from-slate-950/95 via-slate-950/85 to-sky-950/90',
    glow: 'bg-sky-500/25',
    status: 'published',
  },
  {
    id: 'ban_basketball',
    slug: 'basketball',
    categoryName: 'Basketball Gear',
    badge: 'HARDWOOD & STREET DOMINANCE',
    badgeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    title: 'BASKETBALL HARDWOOD',
    subtitle: 'High-top court shoes, composite leather match balls & breathable athletic jerseys.',
    image: '/images/strategy_basketball_ball.jpg',
    gradient: 'from-slate-950/95 via-slate-950/85 to-amber-950/90',
    glow: 'bg-amber-600/25',
    status: 'published',
  },
  {
    id: 'ban_football',
    slug: 'football',
    categoryName: 'Football / Soccer',
    badge: 'PITCH & STADIUM PERFORMANCE',
    badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    title: 'FOOTBALL PRECISION',
    subtitle: 'FG/AG firm ground cleat tech, match balls & tactical moisture-wicking kits.',
    image: '/images/strategy_football_cleat.jpg',
    gradient: 'from-slate-950/95 via-slate-950/85 to-emerald-950/90',
    glow: 'bg-emerald-500/25',
    status: 'published',
  },
  {
    id: 'ban_training',
    slug: 'training',
    categoryName: 'Cross Training & Gym',
    badge: 'HIGH-INTENSITY GEAR',
    badgeStyle: 'bg-indigo-400/20 text-indigo-300 border-indigo-400/40',
    title: 'PRO TRAINING APPAREL',
    subtitle: 'High-intensity gym jackets, sweat-wicking base layers & activewear accessories.',
    image: '/images/strategy_performance_jacket.jpg',
    gradient: 'from-slate-950/95 via-slate-950/85 to-indigo-950/90',
    glow: 'bg-indigo-500/25',
    status: 'published',
  },
  {
    id: 'ban_fitness',
    slug: 'fitness',
    categoryName: 'Fitness Conditioning',
    badge: 'STRENGTH & CONDITIONING',
    badgeStyle: 'bg-rose-400/20 text-rose-300 border-rose-400/40',
    title: 'FITNESS & CONDITIONING',
    subtitle: 'Pro resistance bands, speed jump ropes, foam rollers & recovery equipment.',
    image: '/images/strategy_running_shoe.jpg',
    gradient: 'from-slate-950/95 via-slate-950/85 to-rose-950/90',
    glow: 'bg-rose-500/25',
    status: 'published',
  },
  {
    id: 'ban_apparel',
    slug: 'apparel',
    categoryName: 'Technical Apparel',
    badge: 'AERODYNAMIC TEXTILES',
    badgeStyle: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40',
    title: 'TECHNICAL ATHLETIC APPAREL',
    subtitle: 'Moisture-wicking athletic jerseys, jackets, shorts, and compression wear.',
    image: '/images/strategy_performance_jacket.jpg',
    gradient: 'from-slate-950/95 via-slate-950/85 to-cyan-950/90',
    glow: 'bg-cyan-500/25',
    status: 'published',
  },
  {
    id: 'ban_men',
    slug: 'men',
    categoryName: 'Men\'s Athletic Gear',
    badge: 'MEN\'S ATHLETIC VAULT',
    badgeStyle: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    title: 'MEN\'S PERFORMANCE',
    subtitle: 'Pro-grade training gear, carbon-plated runners & tournament-tested sportswear.',
    image: '/images/strategy_athlete_banner.jpg',
    gradient: 'from-slate-950/95 via-blue-950/85 to-slate-950/90',
    glow: 'bg-blue-500/25',
    status: 'published',
  },
  {
    id: 'ban_women',
    slug: 'women',
    categoryName: 'Women\'s Collection',
    badge: 'PRECISION ENGINEERING FOR WOMEN',
    badgeStyle: 'bg-rose-400/20 text-rose-300 border-rose-400/40',
    title: 'WOMEN\'S COLLECTION',
    subtitle: 'Ergonomic athletic sportswear, speed skates, high-grip footwear & accessories.',
    image: '/images/strategy_athlete_banner.jpg',
    gradient: 'from-slate-950/95 via-rose-950/85 to-slate-950/90',
    glow: 'bg-rose-500/25',
    status: 'published',
  },
  {
    id: 'ban_kids',
    slug: 'kids',
    categoryName: 'Junior & Kids Athletics',
    badge: 'FUTURE CHAMPIONS GEAR',
    badgeStyle: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    title: 'JUNIOR ATHLETES',
    subtitle: 'Safe, durable equipment, adjustable inline skates & protective padding for kids.',
    image: '/images/banner_1.jpg',
    gradient: 'from-slate-950/95 via-amber-950/85 to-slate-950/90',
    glow: 'bg-amber-400/25',
    status: 'published',
  },
  {
    id: 'ban_special',
    slug: 'special-edition',
    categoryName: 'Special Edition Drops',
    badge: 'COLLECTOR\'S EDITION DROP',
    badgeStyle: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    title: 'SPECIAL EDITION VAULT',
    subtitle: 'Limited production runs, serialized athletic equipment & championship memorabilia.',
    image: '/images/banner_special_vault.jpg',
    gradient: 'from-slate-950/95 via-amber-950/85 to-slate-950/90',
    glow: 'bg-amber-500/25',
    status: 'published',
  },
  {
    id: 'ban_shop',
    slug: 'shop',
    categoryName: 'All Sports & Catalog',
    badge: '10+ YEARS OF ATHLETIC INNOVATION',
    badgeStyle: 'bg-blue-400/20 text-blue-300 border-blue-400/40',
    title: 'STRATEGY PRO CATALOG',
    subtitle: 'Tournament-tested equipment, carbon-plated footwear & technical athletic sportswear.',
    image: '/images/strategy_athlete_banner.jpg',
    gradient: 'from-slate-950/95 via-blue-950/85 to-slate-950/90',
    glow: 'bg-blue-600/25',
    status: 'published',
  },
];

const STORAGE_KEY = 'strategy_category_banners';

// Retrieve all stored category banners, merging with default definitions
export function getStoredCategoryBanners() {
  if (typeof window === 'undefined') return DEFAULT_CATEGORY_BANNERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CATEGORY_BANNERS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_CATEGORY_BANNERS;
    
    // Merge to ensure all slugs have configurations
    const map = new Map();
    DEFAULT_CATEGORY_BANNERS.forEach((item) => map.set(item.slug, item));
    parsed.forEach((item) => {
      if (item && item.slug) {
        map.set(item.slug, { ...map.get(item.slug), ...item });
      }
    });
    return Array.from(map.values());
  } catch (e) {
    console.warn('Error reading category banners from localStorage:', e);
    return DEFAULT_CATEGORY_BANNERS;
  }
}

// Save all category banners and dispatch an event so all views update dynamically
export function saveCategoryBanners(banners) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
    window.dispatchEvent(new CustomEvent('strategy-banners-updated', { detail: banners }));
  } catch (e) {
    console.error('Error saving category banners to localStorage:', e);
  }
}

// Update or insert a single category banner by slug
export function upsertCategoryBanner(slug, bannerData) {
  const current = getStoredCategoryBanners();
  const index = current.findIndex((b) => b.slug.toLowerCase() === slug.toLowerCase());
  let next;
  if (index >= 0) {
    next = [...current];
    next[index] = { ...next[index], ...bannerData };
  } else {
    next = [
      ...current,
      {
        id: `ban_${Date.now()}`,
        slug: slug.toLowerCase(),
        categoryName: bannerData.categoryName || slug,
        badge: bannerData.badge || 'PRO PERFORMANCE GEAR',
        badgeStyle: bannerData.badgeStyle || 'bg-blue-400/20 text-blue-300 border-blue-400/40',
        title: bannerData.title || `${slug.toUpperCase()} GEAR`,
        subtitle: bannerData.subtitle || `Tournament-tested performance equipment and athletic wear for ${slug}.`,
        image: bannerData.image || '/images/strategy_athlete_banner.jpg',
        gradient: bannerData.gradient || 'from-slate-950/95 via-blue-950/85 to-slate-950/90',
        glow: bannerData.glow || 'bg-blue-600/25',
        status: bannerData.status || 'published',
        ...bannerData,
      }
    ];
  }
  saveCategoryBanners(next);
  return next;
}

// Get the specific banner matching a category filter (e.g. 'category-skating', 'skating')
export function getBannerForFilter(filterType = 'shop') {
  const banners = getStoredCategoryBanners();
  const normalized = (filterType || 'shop')
    .toLowerCase()
    .replace('category-', '')
    .replace('gender-', '');

  const match = banners.find((b) => b.slug.toLowerCase() === normalized);
  if (match) return match;

  // General fallback
  const fallback = banners.find((b) => b.slug === 'shop') || DEFAULT_CATEGORY_BANNERS[DEFAULT_CATEGORY_BANNERS.length - 1];
  return {
    ...fallback,
    badge: `${normalized.toUpperCase()} COLLECTION`,
    title: `${normalized.toUpperCase()} ATHLETICS`,
    subtitle: `Tournament-tested equipment, carbon-plated footwear & technical athletic sportswear for ${normalized}.`
  };
}
