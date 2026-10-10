import React, { useState } from 'react';
import {
  GraduationCap,
  BarChart2,
  TrendingUp,
  Calendar,
  Users,
  Award,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function AcademyBookingsChart({
  analyticsData = null,
  title = "Student Class Bookings: Basketball vs. Skating",
  subtitle = "Live breakdown of student registrations across coaching disciplines"
}) {
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'line'
  const [timeRange, setTimeRange] = useState('7d'); // '7d' | '30d' | '6m'
  const [selectedSport, setSelectedSport] = useState('all'); // 'all' | 'basketball' | 'skating'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Fallback data if none passed
  const defaultData = {
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
  };

  const currentDataset = analyticsData?.[timeRange] || defaultData[timeRange] || defaultData['7d'];
  const summary = analyticsData?.summary || defaultData.summary;

  // Calculate totals and percentages
  const totalBball = currentDataset.reduce((sum, d) => sum + d.basketball, 0);
  const totalSkate = currentDataset.reduce((sum, d) => sum + d.skating, 0);
  const totalBoth = totalBball + totalSkate;

  const bballPct = totalBoth > 0 ? Math.round((totalBball / totalBoth) * 100) : 50;
  const skatePct = 100 - bballPct;

  // Max value calculation for scaling
  const maxVal = Math.max(
    ...currentDataset.map((d) => {
      if (selectedSport === 'basketball') return d.basketball;
      if (selectedSport === 'skating') return d.skating;
      return Math.max(d.basketball, d.skating);
    }),
    1
  );

  // SVG dimensions for Line Chart
  const svgWidth = 640;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 25;
  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingY * 2;

  // Generate coordinates for line chart
  const getCoordinates = (accessor) => {
    const step = currentDataset.length > 1 ? innerWidth / (currentDataset.length - 1) : innerWidth;
    return currentDataset.map((item, idx) => {
      const x = paddingX + idx * step;
      const y = paddingY + innerHeight - (item[accessor] / maxVal) * innerHeight;
      return { x, y, value: item[accessor], label: item.label, raw: item };
    });
  };

  const bballPoints = getCoordinates('basketball');
  const skatePoints = getCoordinates('skating');

  // SVG Path generator (smooth curved bezier or polyline)
  const buildSmoothPath = (points) => {
    if (!points || points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const buildAreaPath = (points) => {
    if (!points || points.length === 0) return '';
    const linePath = buildSmoothPath(points);
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;
    const bottomY = paddingY + innerHeight;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const bballLinePath = buildSmoothPath(bballPoints);
  const bballAreaPath = buildAreaPath(bballPoints);

  const skateLinePath = buildSmoothPath(skatePoints);
  const skateAreaPath = buildAreaPath(skatePoints);

  return (
    <div className="bg-white border border-zinc-200/90 rounded-xl p-5 space-y-4 shadow-none">
      {/* 1. Header Bar with Title and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-zinc-600" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Sport Filter */}
          <div className="flex items-center p-0.5 bg-zinc-100 border border-zinc-200 rounded-lg text-xs">
            <button
              onClick={() => setSelectedSport('all')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                selectedSport === 'all'
                  ? 'bg-white text-zinc-900 shadow-xs font-medium'
                  : 'text-zinc-600 hover:text-zinc-900 font-normal'
              }`}
            >
              All Sports
            </button>
            <button
              onClick={() => setSelectedSport('basketball')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                selectedSport === 'basketball'
                  ? 'bg-white text-zinc-900 shadow-xs font-medium'
                  : 'text-zinc-600 hover:text-zinc-900 font-normal'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              Basketball
            </button>
            <button
              onClick={() => setSelectedSport('skating')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                selectedSport === 'skating'
                  ? 'bg-white text-zinc-900 shadow-xs font-medium'
                  : 'text-zinc-600 hover:text-zinc-900 font-normal'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block" />
              Skating
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center p-0.5 bg-zinc-100 border border-zinc-200 rounded-lg text-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                timeRange === '7d'
                  ? 'bg-white text-zinc-900 shadow-xs font-medium'
                  : 'text-zinc-600 hover:text-zinc-900 font-normal'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                timeRange === '30d'
                  ? 'bg-white text-zinc-900 shadow-xs font-medium'
                  : 'text-zinc-600 hover:text-zinc-900 font-normal'
              }`}
            >
              4 Weeks
            </button>
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                timeRange === '6m'
                  ? 'bg-white text-zinc-900 shadow-xs font-medium'
                  : 'text-zinc-600 hover:text-zinc-900 font-normal'
              }`}
            >
              6 Mo
            </button>
          </div>

          {/* Chart Type Toggle: Bar vs Line */}
          <div className="flex items-center p-0.5 bg-zinc-100 border border-zinc-200 rounded-lg text-xs">
            <button
              onClick={() => setChartType('bar')}
              title="Bar Chart Mode"
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                chartType === 'bar'
                  ? 'bg-white text-zinc-900 shadow-xs font-medium'
                  : 'text-zinc-600 hover:text-zinc-900 font-normal'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bar Chart</span>
            </button>
            <button
              onClick={() => setChartType('line')}
              title="Line Chart Mode"
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                chartType === 'line'
                  ? 'bg-white text-zinc-900 shadow-xs font-medium'
                  : 'text-zinc-600 hover:text-zinc-900 font-normal'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Line Chart</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick KPI Strip: Basketball vs Skating Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <div className="p-2.5 bg-zinc-50 border border-zinc-200/80 rounded-lg">
          <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Total Enrolled</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-semibold text-zinc-900">{totalBoth}</span>
            <span className="text-[10px] text-emerald-600 font-medium">+{summary.growthPercent}%</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Across both sports</p>
        </div>

        <div className="p-2.5 bg-zinc-50 border border-zinc-200/80 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Basketball
            </p>
            <span className="text-[10px] text-zinc-400 font-medium">{bballPct}%</span>
          </div>
          <p className="text-lg font-semibold text-zinc-900 mt-0.5">{totalBball} <span className="text-xs font-normal text-zinc-500">students</span></p>
          <div className="w-full bg-zinc-200 h-1 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${bballPct}%` }} />
          </div>
        </div>

        <div className="p-2.5 bg-zinc-50 border border-zinc-200/80 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Skating
            </p>
            <span className="text-[10px] text-zinc-400 font-medium">{skatePct}%</span>
          </div>
          <p className="text-lg font-semibold text-zinc-900 mt-0.5">{totalSkate} <span className="text-xs font-normal text-zinc-500">students</span></p>
          <div className="w-full bg-zinc-200 h-1 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: `${skatePct}%` }} />
          </div>
        </div>

        <div className="p-2.5 bg-zinc-50 border border-zinc-200/80 rounded-lg">
          <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Peak Slot</p>
          <p className="text-sm font-semibold text-zinc-900 mt-0.5 truncate">{summary.peakDay}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">High weekend turnout</p>
        </div>
      </div>

      {/* 3. The Visualizer Canvas: Bar Chart OR Line Chart */}
      <div className="pt-2 relative">
        {chartType === 'bar' ? (
          /* ================= BAR CHART MODE ================= */
          <div className="space-y-3">
            <div className="h-48 sm:h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6 border-b border-zinc-100">
              {currentDataset.map((point, idx) => {
                const bHeight = Math.round((point.basketball / maxVal) * 100);
                const sHeight = Math.round((point.skating / maxVal) * 100);
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                  >
                    {/* Floating Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-14 z-30 bg-zinc-900 text-white rounded-lg p-2 text-[10px] shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
                        <div className="font-semibold text-zinc-200 border-b border-zinc-700 pb-1 mb-1">
                          {point.label} • {point.basketball + point.skating} total
                        </div>
                        {(selectedSport === 'all' || selectedSport === 'basketball') && (
                          <div className="flex items-center gap-1.5 text-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>Basketball: <strong>{point.basketball}</strong> students</span>
                          </div>
                        )}
                        {(selectedSport === 'all' || selectedSport === 'skating') && (
                          <div className="flex items-center gap-1.5 text-sky-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                            <span>Skating: <strong>{point.skating}</strong> students</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Grouped Bars Container */}
                    <div className="w-full flex items-end justify-center gap-1 max-w-[48px] h-full pb-0.5">
                      {/* Basketball Bar */}
                      {(selectedSport === 'all' || selectedSport === 'basketball') && (
                        <div
                          style={{ height: `${Math.max(bHeight, 6)}%` }}
                          className={`flex-1 rounded-t-sm transition-all duration-200 ${
                            isHovered
                              ? 'bg-amber-400 ring-2 ring-amber-400/30'
                              : 'bg-amber-500 hover:bg-amber-400'
                          }`}
                        />
                      )}

                      {/* Skating Bar */}
                      {(selectedSport === 'all' || selectedSport === 'skating') && (
                        <div
                          style={{ height: `${Math.max(sHeight, 6)}%` }}
                          className={`flex-1 rounded-t-sm transition-all duration-200 ${
                            isHovered
                              ? 'bg-sky-400 ring-2 ring-sky-400/30'
                              : 'bg-sky-500 hover:bg-sky-400'
                          }`}
                        />
                      )}
                    </div>

                    {/* X-Axis Label */}
                    <span className={`text-[11px] mt-2 transition-colors ${isHovered ? 'text-zinc-900 font-semibold' : 'text-zinc-500 font-normal'}`}>
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ================= LINE CHART MODE ================= */
          <div className="space-y-3">
            <div className="relative h-48 sm:h-56 w-full flex items-center justify-center">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Basketball Area Gradient */}
                  <linearGradient id="bballGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Skating Area Gradient */}
                  <linearGradient id="skateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Background horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                  const y = paddingY + innerHeight * (1 - pct);
                  return (
                    <line
                      key={idx}
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#f4f4f5"
                      strokeWidth="1"
                      strokeDasharray={pct === 0 ? '' : '3 3'}
                    />
                  );
                })}

                {/* Skating Area & Line */}
                {(selectedSport === 'all' || selectedSport === 'skating') && (
                  <>
                    <path d={skateAreaPath} fill="url(#skateGradient)" />
                    <path
                      d={skateLinePath}
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {skatePoints.map((pt, i) => (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r={hoveredIndex === i ? 5 : 3.5}
                        fill="#ffffff"
                        stroke="#0284c7"
                        strokeWidth="2.5"
                        className="transition-all duration-150"
                      />
                    ))}
                  </>
                )}

                {/* Basketball Area & Line */}
                {(selectedSport === 'all' || selectedSport === 'basketball') && (
                  <>
                    <path d={bballAreaPath} fill="url(#bballGradient)" />
                    <path
                      d={bballLinePath}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {bballPoints.map((pt, i) => (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r={hoveredIndex === i ? 5 : 3.5}
                        fill="#ffffff"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        className="transition-all duration-150"
                      />
                    ))}
                  </>
                )}

                {/* Hover Vertical Guide Line */}
                {hoveredIndex !== null && bballPoints[hoveredIndex] && (
                  <line
                    x1={bballPoints[hoveredIndex].x}
                    y1={paddingY}
                    x2={bballPoints[hoveredIndex].x}
                    y2={paddingY + innerHeight}
                    stroke="#71717a"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}
              </svg>

              {/* Hover Trigger Zones */}
              <div className="absolute inset-0 flex items-stretch px-[40px]">
                {currentDataset.map((point, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="flex-1 relative cursor-pointer group"
                  >
                    {hoveredIndex === idx && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 bg-zinc-900 text-white rounded-lg p-2 text-[10px] shadow-lg pointer-events-none whitespace-nowrap">
                        <div className="font-semibold text-zinc-200 border-b border-zinc-700 pb-1 mb-1">
                          {point.label} • {point.total} students
                        </div>
                        {(selectedSport === 'all' || selectedSport === 'basketball') && (
                          <div className="flex items-center gap-1.5 text-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>Basketball: <strong>{point.basketball}</strong></span>
                          </div>
                        )}
                        {(selectedSport === 'all' || selectedSport === 'skating') && (
                          <div className="flex items-center gap-1.5 text-sky-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                            <span>Skating: <strong>{point.skating}</strong></span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* X-Axis labels for Line Chart */}
            <div className="flex justify-between px-[40px] border-t border-zinc-100 pt-2 text-[11px] text-zinc-500">
              {currentDataset.map((point, idx) => (
                <span
                  key={idx}
                  className={`text-center ${hoveredIndex === idx ? 'text-zinc-900 font-semibold' : 'text-zinc-500 font-normal'}`}
                >
                  {point.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 4. Legend & Summary Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-zinc-100 text-xs">
          {/* Interactive Legend */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedSport((curr) => (curr === 'basketball' ? 'all' : 'basketball'))}
              className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${
                selectedSport === 'skating' ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
              <span className="text-zinc-700 font-medium">Basketball Academy</span>
              <span className="text-zinc-400 font-normal">({totalBball})</span>
            </button>

            <button
              onClick={() => setSelectedSport((curr) => (curr === 'skating' ? 'all' : 'skating'))}
              className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${
                selectedSport === 'basketball' ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" />
              <span className="text-zinc-700 font-medium">Skating Masterclass</span>
              <span className="text-zinc-400 font-normal">({totalSkate})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
            <span>Click legend items to isolate sport</span>
            <span>•</span>
            <span className="text-zinc-600 font-medium">Synced with live trial bookings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
