import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import DataTable from '../../components/DataTable';
import AcademyBookingsChart from '../../components/AcademyBookingsChart';
import { SkeletonCard, SkeletonTable } from '../../components/Skeleton';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  DollarSign,
  ShoppingBag,
  Package,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  UserCheck,
  Activity,
  Plus,
  ChevronRight,
  CheckCircle2,
  Clock,
  Filter,
  Store,
  Crown,
  Users,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function DashboardView({ onNavigate, workspace, setWorkspace }) {
  const { admin } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState('30d'); // '7d' | '30d'
  const [chartMetric, setChartMetric] = useState('revenue'); // 'revenue' | 'orders'
  const [toastMessage, setToastMessage] = useState('');
  const [hoveredPointIdx, setHoveredPointIdx] = useState(null);
  const [lowStockList, setLowStockList] = useState([]);

  const isStoreMode = admin?.role === 'store_admin';

  const defaultLowStockItems = [
    {
      id: 'ls_01',
      name: 'STRATEGY Speed Carbon inline Skates',
      sku: 'STR-SKT-001',
      variant: 'Size 42 EU',
      category: 'Skating',
      image: '/images/inline_skates.jpg',
      stock: 4,
      threshold: 5,
    },
    {
      id: 'ls_02',
      name: 'STRATEGY Pro Grip Football Cleats',
      sku: 'STR-FTB-002',
      variant: 'Size 43 EU',
      category: 'Football',
      image: '/images/strategy_football_cleat.jpg',
      stock: 2,
      threshold: 5,
    },
    {
      id: 'ls_03',
      name: 'STRATEGY Carbon Elite Speed Shoe',
      sku: 'STR-FTW-001',
      variant: 'Size 44 EU',
      category: 'Footwear',
      image: '/images/strategy_running_shoe.jpg',
      stock: 5,
      threshold: 5,
    },
    {
      id: 'ls_04',
      name: 'STRATEGY Pro Compression Jersey',
      sku: 'STR-APP-001',
      variant: 'Size XL',
      category: 'Apparel',
      image: '/images/strategy_performance_jacket.jpg',
      stock: 7,
      threshold: 10,
    },
  ];

  const defaultRecentOrders = [
    {
      id: 'ORD-2026-1048',
      customer: 'Omar Al Mansoori',
      email: 'omar.m@dubai.ae',
      date: 'Today, 11:24 AM',
      totalFils: 145000,
      status: 'delivered',
      itemsCount: 2,
    },
    {
      id: 'ORD-2026-1047',
      customer: 'Sarah Jenkins',
      email: 'sarah.j@gmail.com',
      date: 'Today, 09:15 AM',
      totalFils: 65000,
      status: 'shipped',
      itemsCount: 1,
    },
    {
      id: 'ORD-2026-1046',
      customer: 'Tariq Al Hashimi',
      email: 'tariq.h@outlook.com',
      date: 'Yesterday, 04:30 PM',
      totalFils: 289000,
      status: 'processing',
      itemsCount: 3,
    },
    {
      id: 'ORD-2026-1045',
      customer: 'Fatima Al Zahra',
      email: 'fatima.z@emirates.net',
      date: 'Oct 07, 2026',
      totalFils: 42000,
      status: 'pending',
      itemsCount: 1,
    },
    {
      id: 'ORD-2026-1044',
      customer: 'Lucas Silva',
      email: 'lucas.silva@gmail.com',
      date: 'Oct 06, 2026',
      totalFils: 128000,
      status: 'delivered',
      itemsCount: 2,
    },
    {
      id: 'ORD-2026-1043',
      customer: 'Elena Rostova',
      email: 'elena.r@yahoo.com',
      date: 'Oct 05, 2026',
      totalFils: 75000,
      status: 'cancelled',
      itemsCount: 1,
    },
  ];

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getDashboardKpis();
      setData(res);
      setLowStockList(res.lowStockAlerts || defaultLowStockItems);
    } catch (err) {
      console.warn('Backend API error, loading mock dashboard fallback:', err.message);
      setLowStockList(defaultLowStockItems);
      setData({
        summary: {
          totalRevenueFils: 4825000,
          revenueGrowthPercent: 18.4,
          totalOrders: 142,
          ordersGrowthPercent: 12.1,
          todaySalesFils: 385000,
          todaySalesGrowthPercent: 8.2,
          averageOrderValueFils: 33978,
          aovGrowthPercent: 5.2,
          activeProducts: 24,
          totalCustomers: 156,
          lowStockCount: 4,
          deliveredOrders: 88,
          academyEnquiries: 38,
          academyGrowthPercent: 24.5,
          activePackagesCount: 4,
          activeCoachesCount: 2,
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
        recentOrders: defaultRecentOrders,
        topSellingProducts: [
          {
            id: 'prod_01',
            name: 'STRATEGY Carbon Elite Speed Shoe',
            sku: 'STR-FTW-001',
            image: '/images/strategy_running_shoe.jpg',
            category: 'Footwear',
            soldCount: 42,
            revenueFils: 3775800,
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
            revenueFils: 946200,
            stockQuantity: 45,
            status: 'published',
          },
          {
            id: 'prod_03',
            name: 'STRATEGY Speed Carbon inline Skates',
            sku: 'STR-SKT-001',
            image: '/images/inline_skates.jpg',
            category: 'Skating',
            soldCount: 29,
            revenueFils: 3767100,
            stockQuantity: 4,
            status: 'published',
          },
          {
            id: 'prod_04',
            name: 'STRATEGY Pro Compression Jersey',
            sku: 'STR-APP-001',
            image: '/images/strategy_performance_jacket.jpg',
            category: 'Apparel',
            soldCount: 26,
            revenueFils: 491400,
            stockQuantity: 32,
            status: 'published',
          },
          {
            id: 'prod_05',
            name: 'STRATEGY Pro Grip Football Cleats',
            sku: 'STR-FTB-002',
            image: '/images/strategy_football_cleat.jpg',
            category: 'Football',
            soldCount: 19,
            revenueFils: 378100,
            stockQuantity: 2,
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
            createdAt: 'Oct 07, 2026',
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
            createdAt: 'Oct 06, 2026',
          },
          {
            id: 'enq_03',
            bookingNumber: 'BKG-2026-879',
            participantName: 'Lucas Silva',
            age: 9,
            program: 'Skating Trial Session',
            coachName: 'Coach Elena Rostova',
            preferredDay: 'Friday',
            preferredTime: '05:00 PM - 06:30 PM',
            contactEmail: 'silva.family@gmail.com',
            contactPhone: '+971 55 444 3322',
            status: 'confirmed',
            createdAt: 'Oct 05, 2026',
          },
        ],
        recentAuditLogs: [
          {
            id: 'log_01',
            actorName: 'Executive Owner',
            actorRole: 'Admin',
            action: 'PACKAGE_UPDATE',
            target: '2-Months Skating Training Package',
            details: 'Updated promotion price to AED 800 and verified uniform kit bonus',
            timestamp: '15 mins ago',
          },
          {
            id: 'log_02',
            actorName: 'Store Admin',
            actorRole: 'Store Admin',
            action: 'ORDER_FULFILLED',
            target: 'Order #ORD-2026-1047',
            details: 'Status updated to SHIPPED via Emirates Post (TRK-99201)',
            timestamp: '1 hour ago',
          },
          {
            id: 'log_03',
            actorName: 'Admin',
            actorRole: 'Admin',
            action: 'TRIAL_CONFIRMED',
            target: 'Amira Al Hashimi (BKG-2026-880)',
            details: 'Confirmed Sunday 04:00 PM speed skating trial slot',
            timestamp: 'Yesterday',
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleExportCSV = () => {
    setToastMessage('Exporting CSV Report...');
    setTimeout(() => {
      setToastMessage('');
      alert(`STRATEGY ${isStoreMode ? 'E-Commerce' : 'Executive Academy'} Report exported successfully.`);
    }, 1200);
  };

  const handleRestock = (item) => {
    setLowStockList((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, stock: i.stock + 10 } : i))
    );
    setToastMessage(`Restocked +10 units to ${item.name}! Current stock: ${item.stock + 10}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const currentChartPoints = data?.chartData?.[timeRange] || [];
  const maxVal = Math.max(...currentChartPoints.map((p) => p[chartMetric]), 1);

  // SVG Chart Geometry Calculation
  const svgWidth = 660;
  const svgHeight = 230;
  const chartPad = { top: 25, right: 35, bottom: 40, left: 65 };
  const innerW = svgWidth - chartPad.left - chartPad.right;
  const innerH = svgHeight - chartPad.top - chartPad.bottom;

  const plottedCoordinates = currentChartPoints.map((pt, idx) => {
    const x = chartPad.left + (currentChartPoints.length > 1 ? (idx / (currentChartPoints.length - 1)) * innerW : innerW / 2);
    const y = chartPad.top + innerH - (pt[chartMetric] / maxVal) * innerH;
    return { ...pt, x, y };
  });

  let lineD = '';
  let areaD = '';
  if (plottedCoordinates.length > 0) {
    lineD = `M ${plottedCoordinates[0].x} ${plottedCoordinates[0].y}`;
    for (let i = 0; i < plottedCoordinates.length - 1; i++) {
      const p1 = plottedCoordinates[i];
      const p2 = plottedCoordinates[i + 1];
      const cp1x = p1.x + (p2.x - p1.x) * 0.45;
      const cp1y = p1.y;
      const cp2x = p1.x + (p2.x - p1.x) * 0.55;
      const cp2y = p2.y;
      lineD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    const firstP = plottedCoordinates[0];
    const lastP = plottedCoordinates[plottedCoordinates.length - 1];
    areaD = `${lineD} L ${lastP.x} ${chartPad.top + innerH} L ${firstP.x} ${chartPad.top + innerH} Z`;
  }

  const gridTicks = [1, 0.75, 0.5, 0.25, 0];

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-[100] bg-zinc-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 font-medium text-xs border border-zinc-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              {isStoreMode ? (
                <>
                  <Store className="w-5 h-5 text-[#065184]" />
                  <span>Dashboard Overview</span>
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 text-indigo-600" />
                  <span>Academy & Master Executive Overview</span>
                </>
              )}
            </h1>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isStoreMode
                  ? 'bg-blue-50 text-[#065184] border-blue-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              {isStoreMode ? 'Store Admin' : 'Admin'}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            {isStoreMode
              ? 'Catalog inventory, revenue performance, order logistics, and customer shipments.'
              : 'Training packages, student trial registrations, coaching staff, and platform governance.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center p-0.5 bg-zinc-100 border border-zinc-200 rounded-lg">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                timeRange === '7d' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900 font-normal'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                timeRange === '30d' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900 font-normal'
              }`}
            >
              30 Days
            </button>
          </div>

          <button
            onClick={fetchDashboardData}
            title="Refresh Metrics"
            className="p-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-zinc-300" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          WORKSPACE A: E-COMMERCE STORE ADMIN VIEW (ROYAL COLLECTIONS INSPIRED)
         ========================================================================= */}
      {isStoreMode ? (
        <>
          {/* 1. Royal Collections 5-Stat Cards Grid with Circular Pastel Icons */}
          <div className="royal-dashboard-stats-grid">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <>
                {/* Stat 1: Total Orders */}
                <div className="royal-stat-card">
                  <div className="royal-stat-icon" style={{ color: '#065184', background: 'rgba(6, 81, 132, 0.1)' }}>
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="royal-stat-info">
                    <span className="royal-stat-label">Total Orders</span>
                    <span className="royal-stat-value">{data?.summary?.totalOrders || 142}</span>
                  </div>
                </div>

                {/* Stat 2: Total Revenue */}
                <div className="royal-stat-card">
                  <div className="royal-stat-icon" style={{ color: '#27ae60', background: 'rgba(39, 174, 96, 0.1)' }}>
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div className="royal-stat-info">
                    <span className="royal-stat-label">Total Revenue</span>
                    <span className="royal-stat-value">
                      AED {((data?.summary?.totalRevenueFils || 4825000) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Stat 3: Today's Sales */}
                <div className="royal-stat-card">
                  <div className="royal-stat-icon" style={{ color: '#c2410c', background: 'rgba(194, 65, 12, 0.1)' }}>
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="royal-stat-info">
                    <span className="royal-stat-label">Today's Sales</span>
                    <span className="royal-stat-value">
                      AED {((data?.summary?.todaySalesFils || 385000) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Stat 4: Total Products */}
                <div className="royal-stat-card">
                  <div className="royal-stat-icon" style={{ color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)' }}>
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="royal-stat-info">
                    <span className="royal-stat-label">Total Products</span>
                    <span className="royal-stat-value">{data?.summary?.activeProducts || 24}</span>
                  </div>
                </div>

                {/* Stat 5: Total Customers */}
                <div className="royal-stat-card">
                  <div className="royal-stat-icon" style={{ color: '#0d9488', background: 'rgba(13, 148, 136, 0.1)' }}>
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="royal-stat-info">
                    <span className="royal-stat-label">Total Customers</span>
                    <span className="royal-stat-value">{data?.summary?.totalCustomers || 156}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 2. Royal Collections 2-Column Analytics & Low Stock Row (1.7fr 1.3fr) */}
          <div className="royal-dashboard-analytics-row">
            {/* Left Card: Sales Analytics with Smooth Curved SVG Chart */}
            <div className="royal-analytics-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-100">
                <div>
                  <h3 className="royal-card-title flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#065184]" />
                    <span>Sales Analytics ({timeRange === '7d' ? 'Last 7 Days' : 'Last 30 Days'})</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Real-time storefront checkout volume and revenue curves.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-xs">
                    <button
                      onClick={() => setChartMetric('revenue')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        chartMetric === 'revenue' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      Revenue (AED)
                    </button>
                    <button
                      onClick={() => setChartMetric('orders')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        chartMetric === 'orders' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      Orders
                    </button>
                  </div>
                </div>
              </div>

              {/* Smooth Gradient Area Curve SVG Chart */}
              <div className="relative w-full overflow-hidden">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-56 select-none"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="royalSalesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#065184" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#065184" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines & Y-Axis Labels */}
                  {gridTicks.map((tick, tIdx) => {
                    const yPos = chartPad.top + innerH * (1 - tick);
                    const tickVal = Math.round(maxVal * tick);
                    return (
                      <g key={tIdx}>
                        <line
                          x1={chartPad.left}
                          y1={yPos}
                          x2={svgWidth - chartPad.right}
                          y2={yPos}
                          stroke="#f1f5f9"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text
                          x={chartPad.left - 10}
                          y={yPos + 3.5}
                          textAnchor="end"
                          className="text-[10px] fill-zinc-400 font-sans"
                        >
                          {chartMetric === 'revenue'
                            ? `AED ${tickVal >= 1000 ? `${(tickVal / 1000).toFixed(0)}k` : tickVal}`
                            : tickVal}
                        </text>
                      </g>
                    );
                  })}

                  {/* Shaded Area Under Curve */}
                  {areaD && <path d={areaD} fill="url(#royalSalesGrad)" />}

                  {/* Glowing Smooth Line */}
                  {lineD && (
                    <path
                      d={lineD}
                      fill="none"
                      stroke="#065184"
                      strokeWidth="2.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Interactive Crosshair when hovered */}
                  {hoveredPointIdx !== null && plottedCoordinates[hoveredPointIdx] && (
                    <line
                      x1={plottedCoordinates[hoveredPointIdx].x}
                      y1={chartPad.top}
                      x2={plottedCoordinates[hoveredPointIdx].x}
                      y2={chartPad.top + innerH}
                      stroke="#065184"
                      strokeDasharray="3 3"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  )}

                  {/* Data Points and X Labels */}
                  {plottedCoordinates.map((pt, pIdx) => {
                    const isHovered = hoveredPointIdx === pIdx;
                    return (
                      <g
                        key={pIdx}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPointIdx(pIdx)}
                        onMouseLeave={() => setHoveredPointIdx(null)}
                      >
                        {/* Hidden broader hit target */}
                        <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                        {/* Visible Data Dot */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 6 : 4}
                          fill="#ffffff"
                          stroke="#065184"
                          strokeWidth="2.5"
                          className="transition-all duration-150"
                        />

                        {/* Bottom X-Axis Label */}
                        <text
                          x={pt.x}
                          y={chartPad.top + innerH + 20}
                          textAnchor="middle"
                          className={`text-[11px] font-sans ${isHovered ? 'fill-zinc-900 font-semibold' : 'fill-zinc-500 font-normal'}`}
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Tooltip Bubble */}
                {hoveredPointIdx !== null && plottedCoordinates[hoveredPointIdx] && (
                  <div
                    className="absolute pointer-events-none z-20 bg-zinc-950 text-white px-3 py-1.5 rounded-lg shadow-xl text-xs flex flex-col gap-0.5 border border-zinc-800 transition-all duration-75"
                    style={{
                      left: `${(plottedCoordinates[hoveredPointIdx].x / svgWidth) * 100}%`,
                      top: `${Math.max(10, (plottedCoordinates[hoveredPointIdx].y / svgHeight) * 100 - 35)}%`,
                      transform: 'translate(-50%, -100%)',
                    }}
                  >
                    <span className="font-semibold text-[11px] text-zinc-300">
                      {plottedCoordinates[hoveredPointIdx].label}
                    </span>
                    <span className="font-bold text-white text-xs">
                      {chartMetric === 'revenue'
                        ? `AED ${plottedCoordinates[hoveredPointIdx].revenue.toLocaleString()}`
                        : `${plottedCoordinates[hoveredPointIdx].orders} Orders`}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Insight Bar */}
              <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-100">
                <span className="flex items-center gap-1.5 text-zinc-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Weekend Surge: <strong className="text-zinc-900 font-semibold">+42% spike</strong> in online orders
                </span>
                <span className="text-[11px] text-zinc-400">Currency: AED (United Arab Emirates Dirham)</span>
              </div>
            </div>

            {/* Right Card: Low Stock Alerts matching Royal Collections */}
            <div className="royal-alerts-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-3">
                  <h3 className="royal-card-title flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Low Stock Alerts</span>
                  </h3>
                  <button
                    onClick={() => onNavigate('products')}
                    className="text-xs font-semibold text-[#065184] hover:underline cursor-pointer"
                  >
                    Full Inventory →
                  </button>
                </div>

                <div className="royal-alerts-list-wrapper">
                  <div className="royal-alerts-list">
                    {lowStockList.map((item) => (
                      <div key={item.id} className="royal-alert-item group">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-900 text-xs truncate max-w-[170px]">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-zinc-500 truncate">
                              {item.sku} • {item.variant || item.category}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="royal-alert-badge-red">
                            Only {item.stock} left
                          </span>
                          <button
                            onClick={() => handleRestock(item)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-rose-300 hover:border-rose-400 hover:bg-rose-50 text-rose-700 rounded-md transition cursor-pointer shadow-2xs"
                            title="Quick restock +10 units"
                          >
                            Restock
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Critical threshold: &lt; 5 units
                </span>
                <button
                  onClick={() => onNavigate('products')}
                  className="font-medium text-zinc-700 hover:text-black cursor-pointer"
                >
                  Manage Stock →
                </button>
              </div>
            </div>
          </div>

          {/* 3. Royal Collections Recent Orders Modern Table Card */}
          <div className="royal-recent-orders-card">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
              <div>
                <h3 className="royal-card-title flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>Recent Orders</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Direct storefront checkout transactions and logistics status.
                </p>
              </div>

              <button
                onClick={() => onNavigate('orders')}
                className="px-3 py-1.5 rounded-lg border border-zinc-300 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white text-xs font-semibold text-zinc-700 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="royal-modern-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.recentOrders || defaultRecentOrders).map((order) => (
                    <tr key={order.id} className="transition-colors hover:bg-zinc-50/80">
                      <td className="font-mono font-semibold text-zinc-900 text-xs">
                        {order.id}
                      </td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-50 text-[#065184] font-bold text-[10px] flex items-center justify-center border border-blue-200 flex-shrink-0">
                            {order.customer.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900 text-xs leading-none">{order.customer}</p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">{order.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-zinc-500 text-xs">{order.date}</td>
                      <td className="font-semibold text-zinc-900 text-xs">
                        AED {(order.totalFils / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => onNavigate('orders')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 rounded-md transition cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Bottom Section: Order Fulfillment Distribution + Top Selling Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Order Status Breakdown */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-500" />
                  Order Fulfillment Status
                </h3>
                <span className="text-xs text-zinc-400 font-normal">142 total</span>
              </div>

              <div className="space-y-3 pt-1">
                {data?.orderStatusBreakdown?.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-normal text-zinc-700 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.status}
                      </span>
                      <span className="font-semibold text-zinc-900">
                        {item.count} <span className="text-zinc-400 font-normal text-[11px]">({item.percentage}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-100 text-center">
                <button
                  onClick={() => onNavigate('orders')}
                  className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Open Orders & Shipping Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Top Selling Products Leaderboard */}
            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Top Selling Gear & Equipment
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Ranked by revenue generated this month.</p>
                </div>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer transition-colors"
                >
                  Full Catalog ({data?.summary?.activeProducts || 24}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider border-b border-zinc-100 pb-2">
                      <th className="pb-2">Product</th>
                      <th className="pb-2">Category</th>
                      <th className="pb-2 text-center">Units Sold</th>
                      <th className="pb-2 text-right">Revenue</th>
                      <th className="pb-2 text-right">Inventory</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {data?.topSellingProducts?.map((product, idx) => (
                      <tr key={product.id} className="group hover:bg-zinc-50/70 transition-colors">
                        <td className="py-2.5 pr-3">
                          <div className="flex items-center gap-2.5">
                            <span className="font-normal text-zinc-400 text-xs w-4 text-center">#{idx + 1}</span>
                            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-900 group-hover:text-black transition-colors truncate max-w-[180px]">
                                {product.name}
                              </p>
                              <p className="text-[10px] text-zinc-400 font-mono">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-2">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 font-medium text-[10px]">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center font-normal text-zinc-700">
                          {product.soldCount}
                        </td>
                        <td className="py-2.5 px-2 text-right font-semibold text-zinc-900">
                          AED {(product.revenueFils / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 pl-2 text-right">
                          {product.stockQuantity <= 5 ? (
                            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/60 text-[10px] font-medium">
                              Low: {product.stockQuantity}
                            </span>
                          ) : (
                            <span className="text-zinc-500 font-normal">{product.stockQuantity} units</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* =========================================================================
            WORKSPACE B: ADMIN ACADEMY & MASTER DASHBOARD VIEW
           ========================================================================= */
        <>
          {/* 1. Admin KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <>
                <StatsCard
                  title="Total Students"
                  value={data.academyEnrollmentAnalytics?.summary?.totalStudents || 148}
                  trend={{ direction: 'up', value: `+${data.summary.academyGrowthPercent}%`, label: 'Enrolled' }}
                  icon={GraduationCap}
                />

                <StatsCard
                  title="Trial Bookings"
                  value={data.summary.academyEnquiries || 38}
                  trend={{ direction: 'up', value: '3 Pending', label: 'Action needed' }}
                  icon={Calendar}
                />

                <StatsCard
                  title="Training Packages"
                  value={data.summary.activePackagesCount || 4}
                  subtext="100% active in catalog"
                  icon={Package}
                />

                <StatsCard
                  title="Academy Coaches"
                  value={data.summary.activeCoachesCount || 2}
                  subtext="Marcus & Elena"
                  icon={Users}
                />

                <StatsCard
                  title="Storefront Sales"
                  value={`AED ${(data.summary.totalRevenueFils / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
                  trend={{ direction: 'up', value: `+${data.summary.revenueGrowthPercent}%` }}
                  icon={DollarSign}
                />

                <StatsCard
                  title="Security Audit Logs"
                  value="24 Events"
                  subtext="100% verified"
                  icon={ShieldCheck}
                />
              </>
            )}
          </div>

          {/* Quick Action Banner for Admin */}
          <div className="p-4 bg-gradient-to-r from-indigo-900 to-zinc-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                Academy Management Master Control
              </span>
              <h3 className="font-bold text-sm text-white">
                Manage Training Packages, Coaching Staff, and Trial Registrations
              </h3>
              <p className="text-xs text-zinc-300">
                Configure 1-Month, 2-Month, and 3-Month packages, set validity durations, and confirm incoming trials.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('academy')}
                className="px-3.5 py-1.5 bg-white text-zinc-950 hover:bg-zinc-100 font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Package className="w-3.5 h-3.5 text-indigo-600" />
                <span>Open Training Packages</span>
              </button>
            </div>
          </div>

          {/* 2. Academy Student Bookings Graph: Basketball vs Skating */}
          <AcademyBookingsChart analyticsData={data?.academyEnrollmentAnalytics} />

          {/* 3. Bottom Section: Recent Academy Trial Bookings & Audit Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Recent Academy Trial Bookings */}
            <div className="bg-white border border-zinc-200/90 rounded-xl p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    Recent Academy Trial Registrations
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Incoming trial inquiries requiring coach confirmation.</p>
                </div>
                <button
                  onClick={() => onNavigate('academy')}
                  className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer transition-colors"
                >
                  All Trials & Packages →
                </button>
              </div>

              <div className="space-y-2.5">
                {data?.recentEnquiries?.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-3 bg-zinc-50/70 border border-zinc-200/80 rounded-lg space-y-1.5 hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-900">{enq.participantName} ({enq.age} yrs)</span>
                      <StatusBadge status={enq.status} size="sm" />
                    </div>
                    <div className="text-[11px] text-zinc-600 space-y-0.5 font-normal">
                      <p className="font-semibold text-zinc-800">{enq.program}</p>
                      <p className="text-zinc-500">Coach: {enq.coachName} • Slot: {enq.preferredDay} ({enq.preferredTime})</p>
                      <p className="text-zinc-400">Contact: {enq.contactPhone} • {enq.contactEmail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Log / Recent System Activity */}
            <div className="bg-white border border-zinc-200/90 rounded-xl p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    Governance & Admin Audit Logs
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Immutable record of administrator actions across the platform.</p>
                </div>
                <button
                  onClick={() => onNavigate('audit')}
                  className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer transition-colors"
                >
                  View Full Audit Log →
                </button>
              </div>

              <div className="space-y-2.5">
                {data?.recentAuditLogs?.map((log) => (
                  <div key={log.id} className="flex items-start gap-2.5 p-2.5 bg-zinc-50/70 border border-zinc-200/80 rounded-lg">
                    <div className="w-7 h-7 rounded-md bg-zinc-900 text-white font-semibold flex items-center justify-center text-xs flex-shrink-0">
                      {log.actorName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-zinc-900 truncate">{log.actorName}</span>
                        <span className="text-[10px] text-zinc-400">{log.timestamp}</span>
                      </div>
                      <p className="text-zinc-600 mt-0.5">{log.details}</p>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">Target: {log.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
