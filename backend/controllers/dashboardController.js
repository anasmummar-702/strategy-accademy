import { sendSuccess } from '../utils/responseHelper.js';

export const getDashboardKpis = async (req, res, next) => {
  try {
    const kpiData = {
      summary: {
        totalRevenueFils: 4825000, // AED 48,250.00
        revenueGrowthPercent: 18.4,
        totalOrders: 142,
        ordersGrowthPercent: 12.1,
        averageOrderValueFils: 33978, // AED 339.78
        aovGrowthPercent: 5.2,
        activeProducts: 24,
        lowStockCount: 3,
        academyEnquiries: 38,
        academyGrowthPercent: 24.5,
      },
      academyEnrollmentAnalytics: {
        summary: {
          totalStudents: 148,
          basketballStudents: 66,
          skatingStudents: 82,
          growthPercent: 24.5,
          peakDay: 'Saturday (54 students)',
        },
        '7d': [
          { label: 'Mon', basketball: 8, skating: 11, total: 19 },
          { label: 'Tue', basketball: 12, skating: 10, total: 22 },
          { label: 'Wed', basketball: 7, skating: 14, total: 21 },
          { label: 'Thu', basketball: 9, skating: 12, total: 21 },
          { label: 'Fri', basketball: 14, skating: 18, total: 32 },
          { label: 'Sat', basketball: 26, skating: 28, total: 54 },
          { label: 'Sun', basketball: 18, skating: 25, total: 43 },
        ],
        '30d': [
          { label: 'Week 1', basketball: 14, skating: 18, total: 32 },
          { label: 'Week 2', basketball: 17, skating: 21, total: 38 },
          { label: 'Week 3', basketball: 15, skating: 20, total: 35 },
          { label: 'Week 4', basketball: 20, skating: 23, total: 43 },
        ],
        '6m': [
          { label: 'May', basketball: 32, skating: 40, total: 72 },
          { label: 'Jun', basketball: 45, skating: 52, total: 97 },
          { label: 'Jul', basketball: 38, skating: 48, total: 86 },
          { label: 'Aug', basketball: 50, skating: 64, total: 114 },
          { label: 'Sep', basketball: 58, skating: 71, total: 129 },
          { label: 'Oct', basketball: 66, skating: 82, total: 148 },
        ],
      },
      chartData: {
        '7d': [
          { label: 'Mon', revenue: 4200, orders: 12 },
          { label: 'Tue', revenue: 5800, orders: 16 },
          { label: 'Wed', revenue: 7100, orders: 21 },
          { label: 'Thu', revenue: 6400, orders: 19 },
          { label: 'Fri', revenue: 9200, orders: 28 },
          { label: 'Sat', revenue: 11400, orders: 34 },
          { label: 'Sun', revenue: 8150, orders: 24 },
        ],
        '30d': [
          { label: 'Week 1', revenue: 24500, orders: 72 },
          { label: 'Week 2', revenue: 31200, orders: 94 },
          { label: 'Week 3', revenue: 28900, orders: 85 },
          { label: 'Week 4', revenue: 48250, orders: 142 },
        ],
      },
      orderStatusBreakdown: [
        { status: 'Delivered', count: 88, color: '#10b981', percentage: 62 },
        { status: 'Shipped', count: 24, color: '#a855f7', percentage: 17 },
        { status: 'Processing', count: 18, color: '#3b82f6', percentage: 13 },
        { status: 'Pending', count: 8, color: '#f59e0b', percentage: 6 },
        { status: 'Cancelled', count: 4, color: '#f43f5e', percentage: 2 },
      ],
      topSellingProducts: [
        {
          id: 'prod_01',
          name: 'STRATEGY Carbon Elite Speed Shoe',
          sku: 'STR-FTW-001',
          image: '/images/carbon_pro_shoe.jpg',
          category: 'Footwear',
          soldCount: 42,
          revenueFils: 3775800, // AED 37,758.00
          stockQuantity: 18,
          status: 'published',
        },
        {
          id: 'prod_02',
          name: 'STRATEGY Tournament Leather Basketball',
          sku: 'STR-BKB-001',
          image: '/images/strategy_basketball_ball.jpg',
          category: 'Basketball',
          soldCount: 38,
          revenueFils: 946200, // AED 9,462.00
          stockQuantity: 45,
          status: 'published',
        },
        {
          id: 'prod_03',
          name: 'STRATEGY Speed Carbon inline Skates',
          sku: 'STR-SKT-001',
          image: '/images/speed_inline_skates.jpg',
          category: 'Skating',
          soldCount: 29,
          revenueFils: 3767100, // AED 37,671.00
          stockQuantity: 4, // low stock
          status: 'published',
        },
        {
          id: 'prod_04',
          name: 'STRATEGY Pro Compression Jersey',
          sku: 'STR-APP-001',
          image: '/images/pro_jersey_black.jpg',
          category: 'Apparel',
          soldCount: 26,
          revenueFils: 491400, // AED 4,914.00
          stockQuantity: 32,
          status: 'published',
        },
        {
          id: 'prod_05',
          name: 'STRATEGY Pro Grip goalkeeper Gloves',
          sku: 'STR-FTB-002',
          image: '/images/pro_grip_gloves.jpg',
          category: 'Football',
          soldCount: 19,
          revenueFils: 378100, // AED 3,781.00
          stockQuantity: 2, // low stock
          status: 'published',
        },
      ],
      recentEnquiries: [
        {
          id: 'enq_01',
          bookingNumber: 'BKG-2026-881',
          participantName: 'Tariq Al Mansoori',
          age: 14,
          program: 'Pro Basketball Intensive Academy',
          coachName: 'Coach Marcus Vance',
          preferredDay: 'Saturday',
          preferredTime: '10:00 AM - 12:00 PM',
          contactEmail: 'tariq.mansoori@gmail.com',
          contactPhone: '+971 50 123 4567',
          status: 'pending',
          createdAt: '2026-10-07T14:20:00Z',
        },
        {
          id: 'enq_02',
          bookingNumber: 'BKG-2026-880',
          participantName: 'Amira Al Hashimi',
          age: 11,
          program: 'Elite Speed Skating Masterclass',
          coachName: 'Coach Elena Rostova',
          preferredDay: 'Sunday',
          preferredTime: '04:00 PM - 05:30 PM',
          contactEmail: 'amira.h@outlook.com',
          contactPhone: '+971 52 987 6543',
          status: 'confirmed',
          createdAt: '2026-10-06T18:45:00Z',
        },
        {
          id: 'enq_03',
          bookingNumber: 'BKG-2026-879',
          participantName: 'Lucas Silva',
          age: 9,
          program: 'Junior Basketball Fundamentals',
          coachName: 'Coach Marcus Vance',
          preferredDay: 'Friday',
          preferredTime: '05:00 PM - 06:30 PM',
          contactEmail: 'silva.family@gmail.com',
          contactPhone: '+971 55 444 3322',
          status: 'confirmed',
          createdAt: '2026-10-05T11:15:00Z',
        },
      ],
      recentAuditLogs: [
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
          actorName: 'Store Manager',
          actorRole: 'Store Manager',
          action: 'ORDER_FULFILLED',
          target: 'Order #ORD-2026-1047',
          details: 'Status updated to SHIPPED via Emirates Post (TRK-99201)',
          timestamp: '2026-10-07T15:10:00Z',
        },
        {
          id: 'log_03',
          actorName: 'Content Editor',
          actorRole: 'Content Editor',
          action: 'BANNER_PUBLISH',
          target: 'Special Vault Promotion Banner',
          details: 'Published homepage hero banner set to end Oct 31',
          timestamp: '2026-10-06T09:30:00Z',
        },
      ],
    };

    return sendSuccess(res, kpiData, 'Dashboard KPIs fetched successfully');
  } catch (err) {
    next(err);
  }
};
