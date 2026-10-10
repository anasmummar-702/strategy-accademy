import React from 'react';

export default function StatusBadge({ status, size = 'md' }) {
  if (!status) return null;

  const normalized = String(status).toLowerCase().trim();

  const configs = {
    // Published / Active / Approved
    published: { label: 'Published', dot: 'bg-emerald-500', style: 'bg-emerald-50/70 text-emerald-800 border-emerald-200/50' },
    active: { label: 'Active', dot: 'bg-emerald-500', style: 'bg-emerald-50/70 text-emerald-800 border-emerald-200/50' },
    approved: { label: 'Approved', dot: 'bg-emerald-500', style: 'bg-emerald-50/70 text-emerald-800 border-emerald-200/50' },
    delivered: { label: 'Delivered', dot: 'bg-emerald-500', style: 'bg-emerald-50/70 text-emerald-800 border-emerald-200/50' },
    paid: { label: 'Paid', dot: 'bg-emerald-500', style: 'bg-emerald-50/70 text-emerald-800 border-emerald-200/50' },
    confirmed: { label: 'Confirmed', dot: 'bg-emerald-500', style: 'bg-emerald-50/70 text-emerald-800 border-emerald-200/50' },

    // Draft / Pending / Processing / Shipped
    draft: { label: 'Draft', dot: 'bg-zinc-400', style: 'bg-zinc-100 text-zinc-700 border-zinc-200' },
    pending: { label: 'Pending', dot: 'bg-amber-500', style: 'bg-amber-50/70 text-amber-800 border-amber-200/60' },
    processing: { label: 'Processing', dot: 'bg-blue-500', style: 'bg-blue-50/70 text-blue-800 border-blue-200/60' },
    shipped: { label: 'Shipped', dot: 'bg-zinc-900', style: 'bg-zinc-100 text-zinc-900 border-zinc-300' },

    // Archived / Inactive / Cancelled / Rejected
    archived: { label: 'Archived', dot: 'bg-zinc-400', style: 'bg-zinc-50 text-zinc-500 border-zinc-200' },
    inactive: { label: 'Inactive', dot: 'bg-zinc-400', style: 'bg-zinc-50 text-zinc-500 border-zinc-200' },
    cancelled: { label: 'Cancelled', dot: 'bg-rose-500', style: 'bg-rose-50/70 text-rose-800 border-rose-200/50' },
    rejected: { label: 'Rejected', dot: 'bg-rose-500', style: 'bg-rose-50/70 text-rose-800 border-rose-200/50' },
    failed: { label: 'Failed', dot: 'bg-rose-500', style: 'bg-rose-50/70 text-rose-800 border-rose-200/50' },
  };

  const config = configs[normalized] || {
    label: status,
    dot: 'bg-zinc-400',
    style: 'bg-zinc-100 text-zinc-800 border-zinc-200',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.style} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5 flex-shrink-0`} />
      {config.label}
    </span>
  );
}
