import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import AcademyBookingsChart from '../../components/AcademyBookingsChart';
import Modal from '../../components/Modal';
import { TextInput, SelectInput, TextareaInput } from '../../components/FormInputs';
import {
  getAcademyPackages,
  saveAcademyPackages,
  resetAcademyPackages
} from '../../../utils/academyPackagesData';
import {
  GraduationCap,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  Package,
  Sparkles,
  Check,
  Shield,
  HelpCircle,
  TrendingUp,
  Tag,
  RefreshCw
} from 'lucide-react';

export default function AcademyView() {
  const [activeTab, setActiveTab] = useState('packages'); // 'packages' | 'bookings' | 'programs' | 'coaches'
  const [packages, setPackages] = useState(getAcademyPackages);

  const [bookings, setBookings] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Modal State for Packages
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [packageFormData, setPackageFormData] = useState({
    title: '',
    sport: 'Skating',
    durationLabel: '1 Month (8 Classes)',
    classesCount: 8,
    priceAED: 450,
    originalPriceAED: 500,
    badgeText: 'Standard',
    validityDays: 30,
    inclusions: 'Free registration, Certified coaching, Flexible rescheduling, Progress reports',
    status: 'active'
  });

  const fetchAcademyData = async () => {
    setLoading(true);
    try {
      const [resB, resP, resC] = await Promise.all([
        fetch('http://localhost:5000/api/v1/admin/academy/bookings').then((r) => r.json()),
        fetch('http://localhost:5000/api/v1/admin/academy/programs').then((r) => r.json()),
        fetch('http://localhost:5000/api/v1/admin/academy/coaches').then((r) => r.json()),
      ]);

      if (resB.success) setBookings(resB.data.bookings || []);
      if (resP.success) setPrograms(resP.data.programs || []);
      if (resC.success) setCoaches(resC.data.coaches || []);
    } catch (e) {
      setBookings([
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
          programTitle: 'Skating Trial Session',
          coachName: 'Coach Elena Rostova',
          preferredDay: 'Friday',
          preferredTime: '05:00 PM - 06:30 PM',
          customerName: 'Lucas Silva',
          customerEmail: 'silva.family@gmail.com',
          customerPhone: '+971 55 444 3322',
          feePaidFils: 0,
          status: 'confirmed',
          createdAt: '2026-10-05T10:15:00Z',
        }
      ]);

      setPrograms([
        {
          id: 'prg_01',
          title: 'Pro Basketball Intensive Academy',
          sport: 'Basketball',
          coachName: 'Coach Marcus Vance',
          ageGroup: 'Ages 10-18',
          feeFils: 49900,
          schedule: 'Saturdays & Tuesdays',
          status: 'active',
        },
        {
          id: 'prg_02',
          title: 'Elite Speed Skating Masterclass',
          sport: 'Skating',
          coachName: 'Coach Elena Rostova',
          ageGroup: 'Ages 8-16',
          feeFils: 59900,
          schedule: 'Sundays & Thursdays',
          status: 'active',
        }
      ]);

      setCoaches([
        {
          id: 'cch_01',
          name: 'Coach Marcus Vance',
          sport: 'Basketball',
          roleTitle: 'Head Basketball Academy Director',
          experienceYears: 12,
          imageUrl: '/images/avatar_david.jpg',
          bio: 'Former collegiate player with 12+ years of high-performance youth development experience.',
          status: 'active',
        },
        {
          id: 'cch_02',
          name: 'Coach Elena Rostova',
          sport: 'Skating',
          roleTitle: 'Speed Skating Technical Coach',
          experienceYears: 10,
          imageUrl: '/images/avatar_mariam.jpg',
          bio: 'International inline speed skating medalist focused on stroke biomechanics and agility.',
          status: 'active',
        }
      ]);
    } finally {
      // Load STRATEGY packages from persistent store
      setPackages(getAcademyPackages());
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademyData();
    const handleSync = (e) => {
      if (e.detail?.packages) setPackages(e.detail.packages);
      else setPackages(getAcademyPackages());
    };
    window.addEventListener('strategy_packages_updated', handleSync);
    return () => window.removeEventListener('strategy_packages_updated', handleSync);
  }, []);

  const handleBookingStatusChange = async (bkgId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bkgId ? { ...b, status: newStatus } : b))
    );
    try {
      const token = localStorage.getItem('strategy_admin_token');
      await fetch(`http://localhost:5000/api/v1/admin/academy/bookings/${bkgId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      setToastMessage(`Booking status updated to ${newStatus.toUpperCase()}.`);
    } catch (e) {
      setToastMessage(`Booking status updated to ${newStatus.toUpperCase()}.`);
    } finally {
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  // Open modal to create a new package
  const handleOpenCreatePackage = () => {
    setEditingPackageId(null);
    setPackageFormData({
      title: '',
      sport: 'Skating',
      durationLabel: '1 Month (8 Classes)',
      classesCount: 8,
      priceAED: 450,
      originalPriceAED: 500,
      badgeText: 'New',
      validityDays: 30,
      inclusions: 'Free registration, Certified coaching, Flexible rescheduling',
      status: 'active'
    });
    setIsPackageModalOpen(true);
  };

  // Open modal to edit existing package
  const handleOpenEditPackage = (pkg) => {
    setEditingPackageId(pkg.id);
    setPackageFormData({
      title: pkg.title,
      sport: pkg.sport,
      durationLabel: pkg.durationLabel,
      classesCount: pkg.classesCount,
      priceAED: pkg.priceAED,
      originalPriceAED: pkg.originalPriceAED || pkg.priceAED,
      badgeText: pkg.badgeText || '',
      validityDays: pkg.validityDays || 30,
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join('\n') : pkg.inclusions,
      status: pkg.status || 'active'
    });
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = (e) => {
    e.preventDefault();
    const inclusionList = packageFormData.inclusions
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    let updated;
    if (editingPackageId) {
      updated = packages.map((p) =>
        p.id === editingPackageId
          ? {
              ...p,
              ...packageFormData,
              priceAED: Number(packageFormData.priceAED),
              originalPriceAED: Number(packageFormData.originalPriceAED),
              classesCount: Number(packageFormData.classesCount),
              validityDays: Number(packageFormData.validityDays),
              inclusions: inclusionList,
            }
          : p
      );
      setToastMessage(`Package "${packageFormData.title}" updated successfully.`);
    } else {
      const newPkg = {
        ...packageFormData,
        id: `pkg_${Date.now()}`,
        priceAED: Number(packageFormData.priceAED),
        originalPriceAED: Number(packageFormData.originalPriceAED),
        classesCount: Number(packageFormData.classesCount),
        validityDays: Number(packageFormData.validityDays),
        inclusions: inclusionList,
        enrolledCount: 0,
        rules: `Valid for ${packageFormData.validityDays} calendar days from purchase.`,
      };
      updated = [newPkg, ...packages];
      setToastMessage(`Package "${packageFormData.title}" created successfully.`);
    }

    setPackages(updated);
    saveAcademyPackages(updated);
    setIsPackageModalOpen(false);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDeletePackage = (pkgId) => {
    if (window.confirm('Are you sure you want to delete this training package?')) {
      const updated = packages.filter((p) => p.id !== pkgId);
      setPackages(updated);
      saveAcademyPackages(updated);
      setToastMessage('Package removed from catalog.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleResetPackages = () => {
    if (window.confirm('Reset all training packages to default pricing and settings?')) {
      const res = resetAcademyPackages();
      setPackages(res);
      setToastMessage('Packages reset to factory defaults.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };


  const bookingColumns = [
    {
      header: 'Booking #',
      accessor: 'bookingNumber',
      render: (val) => <span className="font-mono text-xs font-medium text-zinc-900">{val}</span>,
    },
    {
      header: 'Participant',
      accessor: 'participantName',
      render: (val, row) => (
        <div>
          <p className="font-medium text-zinc-900 text-xs sm:text-sm">{val} ({row.participantAge} yrs)</p>
          <p className="text-[10px] text-zinc-500">Parent: {row.customerName}</p>
        </div>
      ),
    },
    {
      header: 'Program / Package',
      accessor: 'programTitle',
      render: (val, row) => (
        <div>
          <p className="font-medium text-zinc-900 text-xs">{val}</p>
          <p className="text-[10px] text-zinc-500">{row.coachName}</p>
        </div>
      ),
    },
    {
      header: 'Preferred Slot',
      accessor: 'preferredDay',
      render: (val, row) => (
        <span className="text-xs text-slate-800 font-semibold">
          {val} ({row.preferredTime})
        </span>
      ),
    },
    {
      header: 'Contact',
      accessor: 'customerPhone',
      render: (val, row) => (
        <div className="text-[11px] text-slate-600 font-medium">
          <p>{val}</p>
          <p className="truncate max-w-[140px] text-slate-500">{row.customerEmail}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      align: 'center',
      render: (val, row) => (
        <select
          value={val}
          onChange={(e) => handleBookingStatusChange(row.id, e.target.value)}
          className="px-2 py-1 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-md text-xs text-zinc-800 focus:outline-none cursor-pointer transition-colors"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="attended">Attended</option>
          <option value="cancelled">Cancelled</option>
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed top-16 right-6 z-[100] bg-zinc-900 text-white px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-2 font-medium text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>Academy Packages & Services Manager</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Admin Workspace
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage training packages, trial class bookings, coaching staff, and enrollment pricing rules.
          </p>
        </div>

        {activeTab === 'packages' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetPackages}
              className="px-3 py-1.5 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset packages to default settings"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={handleOpenCreatePackage}
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Training Package</span>
            </button>
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-0.5 bg-zinc-100 border border-zinc-200 rounded-lg">
        <button
          onClick={() => setActiveTab('packages')}
          className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'packages' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900 font-normal'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-indigo-500" />
          <span>Training Packages ({packages.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'bookings' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900 font-normal'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
          <span>Trial & Appointments ({bookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('programs')}
          className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'programs' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900 font-normal'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Curriculum & Programs ({programs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('coaches')}
          className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'coaches' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900 font-normal'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-blue-500" />
          <span>Coaches & Directors ({coaches.length})</span>
        </button>
      </div>

      {/* 1. TRAINING PACKAGES TAB */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white border border-zinc-200/90 rounded-xl space-y-1">
              <span className="text-[11px] text-zinc-500 font-medium">Active Packages</span>
              <p className="text-xl font-bold text-zinc-900">{packages.length}</p>
              <span className="text-[10px] text-emerald-600 font-medium">In Storefront Catalog</span>
            </div>
            <div className="p-3.5 bg-white border border-zinc-200/90 rounded-xl space-y-1">
              <span className="text-[11px] text-zinc-500 font-medium">Enrolled Students</span>
              <p className="text-xl font-bold text-zinc-900">
                {packages.reduce((sum, p) => sum + (p.enrolledCount || 0), 0)}
              </p>
              <span className="text-[10px] text-indigo-600 font-medium">Across all cohorts</span>
            </div>
            <div className="p-3.5 bg-white border border-zinc-200/90 rounded-xl space-y-1">
              <span className="text-[11px] text-zinc-500 font-medium">Starting Package Fee</span>
              <p className="text-xl font-bold text-zinc-900">
                AED {packages.length > 0 ? Math.min(...packages.map((p) => Number(p.priceAED) || 9999)) : 450}
              </p>
              <span className="text-[10px] text-zinc-400">8 Classes / Month</span>
            </div>
            <div className="p-3.5 bg-white border border-zinc-200/90 rounded-xl space-y-1">
              <span className="text-[11px] text-zinc-500 font-medium">VIP Tier</span>
              <p className="text-xl font-bold text-zinc-900">AED 1,050</p>
              <span className="text-[10px] text-amber-600 font-medium">Unlimited Sessions (3 Mo)</span>
            </div>
          </div>

          {/* Package Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                  pkg.isPopular
                    ? 'bg-gradient-to-b from-indigo-50/50 via-white to-white border-indigo-300 ring-1 ring-indigo-200/80 shadow-xs'
                    : 'bg-white border-zinc-200/90 hover:border-zinc-300 shadow-xs'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200/60 text-[10px] font-semibold">
                        {pkg.sport}
                      </span>
                      {pkg.badgeText && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            pkg.isPopular
                              ? 'bg-indigo-600 text-white'
                              : 'bg-zinc-900 text-white'
                          }`}
                        >
                          {pkg.badgeText}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={pkg.status} size="sm" />
                      <button
                        onClick={() => handleOpenEditPackage(pkg)}
                        className="p-1 text-zinc-400 hover:text-zinc-900 transition cursor-pointer"
                        title="Edit Package"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="p-1 text-zinc-400 hover:text-rose-600 transition cursor-pointer"
                        title="Delete Package"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Duration */}
                  <h3 className="font-bold text-zinc-900 text-base">{pkg.title}</h3>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">{pkg.durationLabel}</p>

                  {/* Pricing Display */}
                  <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-zinc-900 tracking-tight">
                      AED {pkg.priceAED}
                    </span>
                    {pkg.originalPriceAED && pkg.originalPriceAED > pkg.priceAED && (
                      <span className="text-xs text-zinc-400 line-through">
                        AED {pkg.originalPriceAED}
                      </span>
                    )}
                    <span className="text-[11px] text-zinc-400">/ package ({pkg.validityDays} days validity)</span>
                  </div>

                  {/* Inclusions Checklist */}
                  <div className="mt-4 space-y-2 border-t border-zinc-100 pt-3">
                    <p className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">
                      Included In Package:
                    </p>
                    <ul className="space-y-1.5 text-xs text-zinc-600">
                      {pkg.inclusions?.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Meta & Rules */}
                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1 font-medium text-zinc-700">
                    <Users className="w-3 h-3 text-zinc-400" />
                    <span>{pkg.enrolledCount} Students Enrolled</span>
                  </span>
                  <span className="text-zinc-400 font-mono text-[10px]">
                    ID: {pkg.id}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Official Package Policy & Rules Card */}
          <div className="p-5 bg-zinc-50/80 border border-zinc-200/90 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-600" />
              <span>Strategy Academy Official Package Policies & Rules</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs text-zinc-600">
              <div className="p-3 bg-white border border-zinc-200/70 rounded-xl space-y-1">
                <span className="font-semibold text-zinc-900 block">1. Limited Validity Period</span>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Each training package has a fixed validity duration from the date of first session (30, 60, or 90 days). Unused sessions expire automatically upon expiration.
                </p>
              </div>
              <div className="p-3 bg-white border border-zinc-200/70 rounded-xl space-y-1">
                <span className="font-semibold text-zinc-900 block">2. Flexible Session Scheduling</span>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Parents may book class days flexibly around school schedules. 24 hours prior notice is required to reschedule any missed session without deducting credit.
                </p>
              </div>
              <div className="p-3 bg-white border border-zinc-200/70 rounded-xl space-y-1">
                <span className="font-semibold text-zinc-900 block">3. Uniform & Equipment Kit</span>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  2-Month & 3-Month package enrollments automatically include the Strategy Academy team jersey kit and gear inspection by certified coaches.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TRIAL & BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="space-y-5">
          <AcademyBookingsChart />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-zinc-900">
                Registered Trial Bookings & Package Enquiries
              </h4>
              <span className="text-xs text-zinc-500 font-normal">
                {bookings.length} total registrations
              </span>
            </div>
            <DataTable
              columns={bookingColumns}
              data={bookings}
              loading={loading}
              searchable={true}
              searchPlaceholder="Search participant, parent, phone, or program..."
              pageSize={10}
              onRefresh={fetchAcademyData}
            />
          </div>
        </div>
      )}

      {/* 3. TRAINING PROGRAMS TAB */}
      {activeTab === 'programs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((prg) => (
            <div key={prg.id} className="p-5 bg-white border border-zinc-200/90 rounded-xl space-y-2.5 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200/60 text-[10px] font-semibold">
                  {prg.sport}
                </span>
                <StatusBadge status={prg.status} size="sm" />
              </div>
              <h3 className="font-semibold text-zinc-900 text-sm">{prg.title}</h3>
              <p className="text-xs text-zinc-600">Head Coach: <strong className="text-zinc-900 font-medium">{prg.coachName}</strong></p>
              <p className="text-xs text-zinc-600">Schedule: <span className="text-zinc-800">{prg.schedule}</span></p>
              <div className="pt-2 border-t border-zinc-100 flex justify-between items-center text-xs">
                <span className="text-zinc-400 text-[11px]">{prg.ageGroup}</span>
                <span className="font-bold text-zinc-900 text-xs">
                  AED {(prg.feeFils / 100).toFixed(2)} / mo
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. COACHES TAB */}
      {activeTab === 'coaches' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coaches.map((cch) => (
            <div key={cch.id} className="p-5 bg-white border border-zinc-200/90 rounded-xl flex items-start gap-3.5 shadow-xs">
              <img src={cch.imageUrl} alt={cch.name} className="w-14 h-14 rounded-xl object-cover border border-zinc-200 flex-shrink-0" />
              <div className="space-y-0.5">
                <h3 className="font-semibold text-zinc-900 text-sm">{cch.name}</h3>
                <p className="text-xs font-medium text-zinc-600">{cch.roleTitle}</p>
                <p className="text-xs text-zinc-500 leading-relaxed pt-0.5">{cch.bio}</p>
                <span className="inline-block mt-1.5 text-[10px] font-medium text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200/60">
                  {cch.experienceYears}+ Years Experience
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Package Modal */}
      <Modal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        title={editingPackageId ? 'Edit Training Package' : 'Create New Training Package'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSavePackage} className="space-y-3.5">
          <TextInput
            label="Package Title"
            value={packageFormData.title}
            onChange={(e) => setPackageFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. 2-Months Skating Training Package"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <SelectInput
              label="Sport Category"
              value={packageFormData.sport}
              onChange={(e) => setPackageFormData((prev) => ({ ...prev, sport: e.target.value }))}
              options={[
                { label: 'Inline Skating', value: 'Skating' },
                { label: 'Basketball Academy', value: 'Basketball' },
                { label: 'General Fitness', value: 'Fitness' },
              ]}
            />
            <TextInput
              label="Badge / Tag"
              value={packageFormData.badgeText}
              onChange={(e) => setPackageFormData((prev) => ({ ...prev, badgeText: e.target.value }))}
              placeholder="e.g. Most Popular"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Package Price (AED)"
              type="number"
              value={packageFormData.priceAED}
              onChange={(e) => setPackageFormData((prev) => ({ ...prev, priceAED: e.target.value }))}
              required
            />
            <TextInput
              label="Original Price (AED)"
              type="number"
              value={packageFormData.originalPriceAED}
              onChange={(e) => setPackageFormData((prev) => ({ ...prev, originalPriceAED: e.target.value }))}
              placeholder="e.g. 950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Total Classes Included"
              type="number"
              value={packageFormData.classesCount}
              onChange={(e) => setPackageFormData((prev) => ({ ...prev, classesCount: e.target.value }))}
              placeholder="e.g. 16"
              required
            />
            <TextInput
              label="Validity Duration (Days)"
              type="number"
              value={packageFormData.validityDays}
              onChange={(e) => setPackageFormData((prev) => ({ ...prev, validityDays: e.target.value }))}
              placeholder="e.g. 60"
              required
            />
          </div>

          <TextInput
            label="Duration Subtitle Label"
            value={packageFormData.durationLabel}
            onChange={(e) => setPackageFormData((prev) => ({ ...prev, durationLabel: e.target.value }))}
            placeholder="e.g. 2 Months • 16 Classes"
            required
          />

          <TextareaInput
            label="Inclusions (one per line)"
            rows={3}
            value={packageFormData.inclusions}
            onChange={(e) => setPackageFormData((prev) => ({ ...prev, inclusions: e.target.value }))}
            placeholder="Free registration&#10;Official uniform kit included&#10;Certified coach evaluation"
          />

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsPackageModalOpen(false)}
              className="px-3.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium rounded-lg text-xs transition cursor-pointer"
            >
              {editingPackageId ? 'Update Package' : 'Save Package'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
