/**
 * Centralized Store & Management for Strategy Academy Packages:
 * - Skating Academy Packages (1 Month, 2 Months, 3 Months in AboutSection.jsx)
 * - Basketball Academy Package (2 Months in BasketballSection.jsx & BasketballCheckoutPage.jsx)
 * 
 * Supports dynamic editing via Admin Control Center (AcademyView.jsx) with instant reactive sync.
 */

export const DEFAULT_ACADEMY_PACKAGES = [
  {
    id: 'pkg_01',
    title: '1-Month Skating Foundation Package',
    shortTitle: '1 Month',
    sport: 'Skating',
    durationLabel: '1 Month • 8 Classes',
    subtitle: 'Perfect for beginners & trial commitment',
    classesCount: 8,
    classesLabel: '8 Sessions',
    priceAED: 550, // Updated per user's admin change
    originalPriceAED: 600,
    uniformFeeAED: 50,
    registrationFeeAED: 0,
    badgeText: 'Starter',
    isPopular: false,
    validityDays: 30,
    validityLabel: '1 Month',
    enrolledCount: 38,
    inclusions: [
      '8 Guided on-track training sessions',
      'Free Academy Registration (Save AED 50)',
      'Certified Coach Assessment & feedback',
      'Flexible scheduling within 30 days',
      'Beginner to Intermediate skill grading'
    ],
    rules: 'Valid for 30 calendar days from first class. Unused classes expire at package end.',
    status: 'active',
  },
  {
    id: 'pkg_02',
    title: '2-Months Skating Training Package',
    shortTitle: '2 Months',
    sport: 'Skating',
    durationLabel: '2 Months • 16 Classes',
    subtitle: 'Ideal for building real skating skills',
    classesCount: 16,
    classesLabel: '16 Sessions',
    priceAED: 750,
    originalPriceAED: 900,
    uniformFeeAED: 50,
    registrationFeeAED: 0,
    badgeText: 'Most Popular',
    isPopular: true,
    validityDays: 60,
    validityLabel: '2 Months',
    enrolledCount: 64,
    inclusions: [
      '16 Comprehensive training sessions (2x / week)',
      'Official Strategy Welcome Kit & Uniform included',
      'Speed, slalom, and balance skill development',
      'Mid-term progress evaluation & medal certificate',
      'Flexible weekend & weekday class times'
    ],
    rules: 'Valid for 60 calendar days. Up to 2 classes can be rescheduled with 24h notice.',
    status: 'active',
  },
  {
    id: 'pkg_03',
    title: '3-Months Skating Unlimited VIP Package',
    shortTitle: '3 Months',
    sport: 'Skating',
    durationLabel: '3 Months • Unlimited Sessions',
    subtitle: 'Unlimited access — maximum progress',
    classesCount: 999,
    classesLabel: 'Unlimited',
    priceAED: 1000,
    originalPriceAED: 1300,
    uniformFeeAED: 50,
    registrationFeeAED: 0,
    badgeText: 'VIP Unlimited',
    isPopular: false,
    validityDays: 90,
    validityLabel: '3 Months',
    enrolledCount: 26,
    inclusions: [
      'Unlimited access to all scheduled group classes',
      'Complimentary Strategy Pro gear water bottle & uniform',
      '1-on-1 monthly biomechanics audit with Head Coach',
      'Priority lane allocation & competition prep',
      'Save AED 300 compared to single-month enrollments'
    ],
    rules: 'Valid for 90 days. Unlimited session reservations, max 1 class per day.',
    status: 'active',
  },
  {
    id: 'pkg_04',
    title: '2-Months Basketball Coaching Package',
    shortTitle: '2 Months Basketball Coaching',
    sport: 'Basketball',
    durationLabel: '2 Months • 16 Classes',
    subtitle: 'Train. Improve. Dominate.',
    classesCount: 16,
    classesLabel: '16 Classes',
    priceAED: 500,
    originalPriceAED: 750,
    uniformFeeAED: 0,
    registrationFeeAED: 0,
    badgeText: 'Special Deal',
    isPopular: false,
    validityDays: 60,
    validityLabel: '2 Months',
    enrolledCount: 42,
    inclusions: [
      '16 Intensive court coaching sessions',
      'Official Strategy Basketball Jersey included',
      'Shooting mechanics, handles & game IQ',
      'Weekend intra-academy tournament eligibility',
      'Direct mentorship by Coach Marcus Vance'
    ],
    rules: 'Valid for 60 days. Sessions take place Saturdays & Tuesdays.',
    status: 'active',
  }
];

const PACKAGES_STORAGE_KEY = 'strategy_academy_packages';

/**
 * Get all Academy packages (from localStorage with fallback to default)
 */
export function getAcademyPackages() {
  if (typeof window === 'undefined') return DEFAULT_ACADEMY_PACKAGES;
  try {
    const raw = localStorage.getItem(PACKAGES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse academy packages from storage:', e);
  }
  return DEFAULT_ACADEMY_PACKAGES;
}

/**
 * Save all Academy packages to localStorage and broadcast real-time event
 */
export function saveAcademyPackages(packages) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packages));
    window.dispatchEvent(
      new CustomEvent('strategy_packages_updated', {
        detail: { packages }
      })
    );
  } catch (e) {
    console.error('Failed to save academy packages to storage:', e);
  }
}

/**
 * Get Skating packages only
 */
export function getSkatingPackages() {
  const all = getAcademyPackages();
  return all.filter((p) => (p.sport || '').toLowerCase() === 'skating');
}

/**
 * Get Basketball package only
 */
export function getBasketballPackage() {
  const all = getAcademyPackages();
  return (
    all.find((p) => (p.sport || '').toLowerCase() === 'basketball') ||
    DEFAULT_ACADEMY_PACKAGES[3]
  );
}

/**
 * Reset Academy packages to factory defaults
 */
export function resetAcademyPackages() {
  if (typeof window === 'undefined') return DEFAULT_ACADEMY_PACKAGES;
  try {
    localStorage.removeItem(PACKAGES_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent('strategy_packages_updated', {
        detail: { packages: DEFAULT_ACADEMY_PACKAGES }
      })
    );
  } catch (e) {
    console.error('Failed to reset academy packages:', e);
  }
  return DEFAULT_ACADEMY_PACKAGES;
}
