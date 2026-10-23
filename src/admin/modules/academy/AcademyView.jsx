import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { TextInput, SelectInput, TextareaInput } from '../../components/FormInputs';
import { getAcademyPackages, saveAcademyPackages } from '../../../utils/academyPackagesData';
import { CheckCircle2, Plus, Edit, Trash2, Check } from 'lucide-react';

// How many packages each page of the website shows (AboutSection: 3 skating cards,
// Basketball page/checkout: 1 package). Extra packages are kept but not shown.
const WEBSITE_SLOTS = { Skating: 3, Basketball: 1 };

// Packages & prices shown on the Skating and Basketball pages of the website.
export default function AcademyView() {
  const [packages, setPackages] = useState(getAcademyPackages);
  const [toastMessage, setToastMessage] = useState('');

  // Add / edit form
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

  useEffect(() => {
    const handleSync = (e) => setPackages(e.detail?.packages || getAcademyPackages());
    window.addEventListener('strategy_packages_updated', handleSync);
    return () => window.removeEventListener('strategy_packages_updated', handleSync);
  }, []);

  // Open modal to create a new package
  const handleOpenCreatePackage = () => {
    setEditingPackageId(null);
    setPackageFormData({
      title: '',
      sport: freeSports[0] || 'Skating',
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
      setToastMessage(`Package "${packageFormData.title}" saved.`);
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
      // Add at the end so it fills the next free slot on the website
      updated = [...packages, newPkg];
      setToastMessage(`Package "${packageFormData.title}" added.`);
    }

    if (!saveAcademyPackages(updated)) {
      setToastMessage("Not saved: this browser's storage is full.");
      setTimeout(() => setToastMessage(''), 6000);
      return;
    }
    setPackages(updated);
    setIsPackageModalOpen(false);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Only packages that are NOT on the website can be deleted (see WEBSITE_SLOTS)
  const handleDeletePackage = (pkgId) => {
    if (window.confirm('Delete this package?')) {
      const updated = packages.filter((p) => p.id !== pkgId);
      if (!saveAcademyPackages(updated)) {
        setToastMessage("Not saved: this browser's storage is full.");
      } else {
        setPackages(updated);
        setToastMessage('Package deleted.');
      }
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  // Which packages the website actually shows: the first N of each sport, in this order
  const bySport = (sport) => packages.filter((p) => p.sport === sport);
  const isOnSite = (pkg) => {
    const slots = WEBSITE_SLOTS[pkg.sport] || 0;
    return bySport(pkg.sport).findIndex((p) => p.id === pkg.id) < slots;
  };
  const freeSports = Object.keys(WEBSITE_SLOTS).filter((sp) => bySport(sp).length < WEBSITE_SLOTS[sp]);
  const otherSports = [...new Set(packages.map((p) => p.sport))].filter((sp) => !WEBSITE_SLOTS[sp]);
  const sports = [...Object.keys(WEBSITE_SLOTS), ...otherSports].filter((sp) => bySport(sp).length > 0);

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div
          className={`!m-0 fixed top-20 right-6 z-[100] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 font-medium text-sm ${
            toastMessage.startsWith('Not saved') ? 'bg-rose-700' : 'bg-zinc-900'
          }`}
        >
          {!toastMessage.startsWith('Not saved') && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-base text-zinc-500">
          Your Skating page shows 3 packages and your Basketball page shows 1. Edit their prices and details here. Changes show on
          the website straight away.
        </p>
        {freeSports.length > 0 && (
        <button
          id="add-package-btn"
          onClick={handleOpenCreatePackage}
          className="px-4 py-2.5 bg-zinc-900 hover:bg-black text-white font-medium text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add a package</span>
        </button>
        )}
      </div>

      {sports.map((sport) => (
        <section key={sport} className="space-y-3">
          <h2 className="text-base font-semibold text-zinc-900">
            {sport === 'Skating' ? '⛸️ Skating page' : sport === 'Basketball' ? '🏀 Basketball page' : sport}
            <span className="ml-2 text-sm font-normal text-zinc-500">
              {WEBSITE_SLOTS[sport]
                ? `shows ${WEBSITE_SLOTS[sport]} package${WEBSITE_SLOTS[sport] > 1 ? 's' : ''}`
                : 'not shown anywhere on the website'}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.filter((p) => p.sport === sport).map((pkg) => (
              <div key={pkg.id} className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {!isOnSite(pkg) && (
                      <span className="inline-block mb-2 mr-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 ring-1 ring-amber-200">
                        Not shown on the website
                      </span>
                    )}
                    {pkg.badgeText && (
                      <span className="inline-block mb-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-900 text-white">
                        {pkg.badgeText}
                      </span>
                    )}
                    <h3 className="font-semibold text-zinc-900 text-base leading-snug">{pkg.title}</h3>
                    <p className="text-sm text-zinc-500 mt-0.5">{pkg.durationLabel}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-zinc-900">AED {pkg.priceAED}</span>
                  {pkg.originalPriceAED > pkg.priceAED && (
                    <span className="text-sm text-zinc-400 line-through">AED {pkg.originalPriceAED}</span>
                  )}
                </div>
                <p className="text-sm text-zinc-500">Valid for {pkg.validityDays} days</p>

                <ul className="mt-4 space-y-1.5 text-sm text-zinc-600 flex-1">
                  {(pkg.inclusions || []).slice(0, 4).map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                  {(pkg.inclusions || []).length > 4 && (
                    <li className="text-zinc-400 pl-6">+{pkg.inclusions.length - 4} more</li>
                  )}
                </ul>

                <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditPackage(pkg)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-sm font-medium text-zinc-800 cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                    Edit price & details
                  </button>
{!isOnSite(pkg) && (
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="p-2 rounded-xl border border-zinc-200 text-zinc-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 cursor-pointer"
                    title="Delete package"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Add / Edit Package Modal */}
      <Modal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        title={editingPackageId ? 'Edit package' : 'Add a package'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSavePackage} className="space-y-3.5">
          <TextInput
            label="Package name"
            value={packageFormData.title}
            onChange={(e) => setPackageFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. 2-Months Skating Training Package"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            {editingPackageId ? (
              <TextInput label="Page" value={`${packageFormData.sport} page`} disabled onChange={() => {}} />
            ) : (
              <SelectInput
                label="Page"
                value={packageFormData.sport}
                onChange={(e) => setPackageFormData((prev) => ({ ...prev, sport: e.target.value }))}
                options={freeSports.map((sp) => ({ label: `${sp} page`, value: sp }))}
              />
            )}
            <TextInput
              label="Label (optional)"
              value={packageFormData.badgeText}
              onChange={(e) => setPackageFormData((prev) => ({ ...prev, badgeText: e.target.value }))}
              placeholder="e.g. Most Popular"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Price (AED)"
              type="number"
              value={packageFormData.priceAED}
              onChange={(e) => setPackageFormData((prev) => ({ ...prev, priceAED: e.target.value }))}
              required
            />
            <TextInput
              label="Old price (crossed out)"
              type="number"
              value={packageFormData.originalPriceAED}
              onChange={(e) => setPackageFormData((prev) => ({ ...prev, originalPriceAED: e.target.value }))}
              placeholder="e.g. 950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Number of classes"
              type="number"
              value={packageFormData.classesCount}
              onChange={(e) => setPackageFormData((prev) => ({ ...prev, classesCount: e.target.value }))}
              placeholder="e.g. 16"
              required
            />
            <TextInput
              label="Valid for (days)"
              type="number"
              value={packageFormData.validityDays}
              onChange={(e) => setPackageFormData((prev) => ({ ...prev, validityDays: e.target.value }))}
              placeholder="e.g. 60"
              required
            />
          </div>

          <TextInput
            label="Short description"
            value={packageFormData.durationLabel}
            onChange={(e) => setPackageFormData((prev) => ({ ...prev, durationLabel: e.target.value }))}
            placeholder="e.g. 2 Months • 16 Classes"
            required
          />

          <TextareaInput
            label="What's included (one per line)"
            rows={5}
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
              {editingPackageId ? 'Save changes' : 'Add package'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
