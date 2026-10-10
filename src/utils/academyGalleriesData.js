/**
 * Centralized Store & Management for Academy Galleries:
 * - Skating Academy Photo Gallery (AboutSection.jsx)
 * - Basketball Academy Photo Gallery (BasketballSection.jsx)
 * 
 * Supports dynamic editing via the Admin Control Center with instant reactive sync.
 */

export const DEFAULT_SKATING_GALLERY = [
  {
    id: 'sk_01',
    src: '/images/skating_angels/gallery_1.jpg',
    title: '1:1 Certified Coach Training',
    desc: 'Patient pro instructor guiding beginner balance & confidence',
    badge: 'UAE Skating Angels'
  },
  {
    id: 'sk_02',
    src: '/images/skating_angels/gallery_2.jpg',
    title: 'Youth Group Roller Skating Session',
    desc: 'Joyful group glide with full safety gear & pro supervision',
    badge: 'UAE Skating Angels'
  },
  {
    id: 'sk_03',
    src: '/images/skating_angels/gallery_3.jpg',
    title: 'Pro Shop Skates & Protection Gear',
    desc: 'High-performance inline & quad skates, helmets, and pads',
    badge: 'UAE Skating Angels'
  },
  {
    id: 'sk_04',
    src: '/images/skating_angels/gallery_4.jpg',
    title: 'Speed & Championship Technique',
    desc: 'Fast turns, agility, and competitive skating clinic',
    badge: 'UAE Skating Angels'
  },
  {
    id: 'sk_05',
    src: '/images/skating_angels/gallery_5.jpg',
    title: 'Graceful Balance & Freestyle Glide',
    desc: 'Confidence, artistic posture, and balance mastery',
    badge: 'UAE Skating Angels'
  },
  {
    id: 'sk_06',
    src: '/images/skating_angels/gallery_6.jpg',
    title: 'Regional Championship Podium',
    desc: 'Proud students celebrating medals and official certificates',
    badge: 'UAE Skating Angels'
  },
  {
    id: 'sk_07',
    src: '/images/skating_angels/gallery_7.jpg',
    title: 'Arena Lounge & Skate Rental Counter',
    desc: 'Air-conditioned luxury lounge at Al Nahiyan, Abu Dhabi',
    badge: 'UAE Skating Angels'
  },
  {
    id: 'sk_08',
    src: '/images/skating_angels/gallery_8.jpg',
    title: 'Youth Mentorship & Guidance',
    desc: 'Encouraging certified instructors building real skill step-by-step',
    badge: 'UAE Skating Angels'
  }
];

export const DEFAULT_BASKETBALL_GALLERY = [
  {
    id: 'bb_01',
    src: '/images/basketball_team_huddle_banner.jpg',
    title: 'Championship Team Huddle & Court Strategy',
    desc: 'Coach Marcus Vance breaking down high-pressure court execution',
    badge: 'Strategy Basketball Academy'
  },
  {
    id: 'bb_02',
    src: '/images/basketball_hero_court.jpg',
    title: 'Hardwood FIBA Arena & Glass Backboards',
    desc: 'Air-conditioned championship maple hardwood court at Al Nahyan',
    badge: 'Strategy Basketball Academy'
  },
  {
    id: 'bb_03',
    src: '/images/basketball_hero_kids.jpg',
    title: 'Youth Agility & Dribble Cone Drills',
    desc: 'Fingertip control, high-low crossovers, and fast transition pace',
    badge: 'Strategy Basketball Academy'
  },
  {
    id: 'bb_04',
    src: '/images/basketball_trial_athletes.jpg',
    title: 'Shooting Form & Arc Elevation Mechanics',
    desc: 'B.E.E.F shot rhythm coaching with video analytics review',
    badge: 'Strategy Basketball Academy'
  },
  {
    id: 'bb_05',
    src: '/images/basketball_banner_clinic.jpg',
    title: '1:1 Defense & Footwork Fundamentals',
    desc: 'Lateral slides, closeouts, and triple-threat lockdown defense',
    badge: 'Strategy Basketball Academy'
  },
  {
    id: 'bb_06',
    src: '/images/basketball_academy.jpg',
    title: 'Live 3v3 Scrimmage & Fast Breaks',
    desc: 'Real-time decision making, court spacing, and transition passing',
    badge: 'Strategy Basketball Academy'
  },
  {
    id: 'bb_07',
    src: '/images/package_basketball.jpg',
    title: 'Official Match Ball & Pro Uniform Kit',
    desc: 'Exclusive custom jerseys and official composite leather basketballs',
    badge: 'Strategy Basketball Academy'
  },
  {
    id: 'bb_08',
    src: '/images/strategy_athlete_banner.jpg',
    title: 'Strength, Speed & Vertical Jump Conditioning',
    desc: 'Explosive athletic development tailored for aspiring players',
    badge: 'Strategy Basketball Academy'
  }
];

const SKATING_STORAGE_KEY = 'strategy_skating_gallery';
const BASKETBALL_STORAGE_KEY = 'strategy_basketball_gallery';

/**
 * Get Skating Academy gallery photos (localStorage with fallback)
 */
export function getSkatingGallery() {
  if (typeof window === 'undefined') return DEFAULT_SKATING_GALLERY;
  try {
    const raw = localStorage.getItem(SKATING_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse skating gallery from storage:', e);
  }
  return DEFAULT_SKATING_GALLERY;
}

/**
 * Save Skating Academy gallery photos
 */
export function saveSkatingGallery(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SKATING_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('strategy_gallery_updated', { detail: { sport: 'skating', items } }));
  } catch (e) {
    console.error('Failed to save skating gallery:', e);
  }
}

/**
 * Get Basketball Academy gallery photos (localStorage with fallback)
 */
export function getBasketballGallery() {
  if (typeof window === 'undefined') return DEFAULT_BASKETBALL_GALLERY;
  try {
    const raw = localStorage.getItem(BASKETBALL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse basketball gallery from storage:', e);
  }
  return DEFAULT_BASKETBALL_GALLERY;
}

/**
 * Save Basketball Academy gallery photos
 */
export function saveBasketballGallery(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BASKETBALL_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('strategy_gallery_updated', { detail: { sport: 'basketball', items } }));
  } catch (e) {
    console.error('Failed to save basketball gallery:', e);
  }
}

/**
 * Reset galleries to original defaults
 */
export function resetGallery(sport = 'all') {
  if (typeof window === 'undefined') return;
  if (sport === 'skating' || sport === 'all') {
    localStorage.removeItem(SKATING_STORAGE_KEY);
  }
  if (sport === 'basketball' || sport === 'all') {
    localStorage.removeItem(BASKETBALL_STORAGE_KEY);
  }
  window.dispatchEvent(new CustomEvent('strategy_gallery_updated', { detail: { sport } }));
}
