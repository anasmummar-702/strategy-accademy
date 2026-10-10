import { sendSuccess, sendError } from '../utils/responseHelper.js';

export let coachesStore = [
  {
    id: 'cch_01',
    name: 'Coach Marcus Vance',
    sport: 'Basketball',
    roleTitle: 'Head Basketball Academy Director',
    experienceYears: 12,
    bio: 'Former NCAA Division 1 player specializing in point guard ball handling, shooting mechanics, and elite court vision.',
    imageUrl: '/images/avatar_david.jpg',
    status: 'active',
  },
  {
    id: 'cch_02',
    name: 'Coach Elena Rostova',
    sport: 'Skating',
    roleTitle: 'Speed Skating Technical Coach',
    experienceYears: 10,
    bio: 'International speed skating champion with a focus on custom stride biomechanics and edge control.',
    imageUrl: '/images/avatar_mariam.jpg',
    status: 'active',
  },
];

export let programsStore = [
  {
    id: 'prg_01',
    title: 'Pro Basketball Intensive Academy',
    sport: 'Basketball',
    coachId: 'cch_01',
    coachName: 'Coach Marcus Vance',
    ageGroup: 'Ages 10-18',
    feeFils: 49900, // AED 499.00 / month
    schedule: 'Saturdays & Tuesdays (04:00 PM - 06:00 PM)',
    location: 'STRATEGY Indoor Arena, Dubai',
    status: 'active',
  },
  {
    id: 'prg_02',
    title: 'Elite Speed Skating Masterclass',
    sport: 'Skating',
    coachId: 'cch_02',
    coachName: 'Coach Elena Rostova',
    ageGroup: 'Ages 8-16',
    feeFils: 59900, // AED 599.00 / month
    schedule: 'Sundays & Thursdays (05:00 PM - 07:00 PM)',
    location: 'STRATEGY Skating Rink, Dubai',
    status: 'active',
  },
];

export let bookingsStore = [
  {
    id: 'bkg_01',
    bookingNumber: 'BKG-2026-881',
    participantName: 'Tariq Al Mansoori',
    participantAge: 14,
    programTitle: 'Pro Basketball Intensive Academy',
    coachName: 'Coach Marcus Vance',
    preferredDay: 'Saturday',
    preferredTime: '10:00 AM - 12:00 PM',
    customerName: 'Zayed Al Mansoori',
    customerEmail: 'tariq.mansoori@gmail.com',
    customerPhone: '+971 50 123 4567',
    feePaidFils: 0,
    status: 'pending',
    createdAt: '2026-10-07T14:20:00Z',
  },
  {
    id: 'bkg_02',
    bookingNumber: 'BKG-2026-880',
    participantName: 'Amira Al Hashimi',
    participantAge: 11,
    programTitle: 'Elite Speed Skating Masterclass',
    coachName: 'Coach Elena Rostova',
    preferredDay: 'Sunday',
    preferredTime: '04:00 PM - 05:30 PM',
    customerName: 'Amira Al Hashimi',
    customerEmail: 'amira.h@outlook.com',
    customerPhone: '+971 52 987 6543',
    feePaidFils: 59900,
    status: 'confirmed',
    createdAt: '2026-10-06T18:45:00Z',
  },
  {
    id: 'bkg_03',
    bookingNumber: 'BKG-2026-879',
    participantName: 'Lucas Silva',
    participantAge: 9,
    programTitle: 'Pro Basketball Intensive Academy',
    coachName: 'Coach Marcus Vance',
    preferredDay: 'Friday',
    preferredTime: '05:00 PM - 06:30 PM',
    customerName: 'Lucas Silva',
    customerEmail: 'silva.family@gmail.com',
    customerPhone: '+971 55 444 3322',
    feePaidFils: 49900,
    status: 'confirmed',
    createdAt: '2026-10-05T11:15:00Z',
  }
];

export let customersStore = [
  {
    id: 'cust_01',
    fullName: 'Zayed Al Mansoori',
    email: 'zayed.mansoori@gmail.com',
    phone: '+971 50 112 2334',
    city: 'Dubai',
    totalOrders: 3,
    totalSpendFils: 184800, // AED 1,848.00
    memberSince: '2025-04-12',
    status: 'active',
  },
  {
    id: 'cust_02',
    fullName: 'David Miller',
    email: 'david.miller@eim.ae',
    phone: '+971 52 887 9900',
    city: 'Dubai',
    totalOrders: 2,
    totalSpendFils: 69800, // AED 698.00
    memberSince: '2025-08-20',
    status: 'active',
  },
  {
    id: 'cust_03',
    fullName: 'Mariam Al Shehhi',
    email: 'mariam.shehhi@yahoo.com',
    phone: '+971 56 334 5566',
    city: 'Abu Dhabi',
    totalOrders: 4,
    totalSpendFils: 249800, // AED 2,498.00
    memberSince: '2025-01-10',
    status: 'active',
  }
];

// Handlers
export const getCoaches = async (req, res, next) => {
  try {
    return sendSuccess(res, { coaches: coachesStore });
  } catch (err) {
    next(err);
  }
};

export const getPrograms = async (req, res, next) => {
  try {
    return sendSuccess(res, { programs: programsStore });
  } catch (err) {
    next(err);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    return sendSuccess(res, { bookings: bookingsStore });
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = bookingsStore.find((b) => b.id === id || b.bookingNumber === id);
    if (!booking) return sendError(res, 'Booking not found', 404);
    booking.status = status;
    return sendSuccess(res, booking, 'Booking status updated successfully');
  } catch (err) {
    next(err);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    return sendSuccess(res, { customers: customersStore });
  } catch (err) {
    next(err);
  }
};
