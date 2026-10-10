import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { Star, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

export default function ReviewsView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/admin/settings/reviews');
      const result = await res.json();
      if (result.success && result.data?.reviews) setReviews(result.data.reviews);
    } catch (e) {
      setReviews([
        {
          id: 'rev_01',
          productName: 'STRATEGY Carbon Elite Speed Shoe',
          reviewerName: 'Zayed Al Mansoori',
          rating: 5,
          reviewText: 'The carbon plate propulsion on these shoes is insane! Lowered my 10k time by 90 seconds.',
          isVerifiedBuyer: true,
          status: 'approved',
          createdAt: '2026-10-06T14:20:00Z',
        },
        {
          id: 'rev_02',
          productName: 'STRATEGY Tournament Leather Basketball',
          reviewerName: 'Coach Marcus Vance',
          rating: 5,
          reviewText: 'Excellent moisture-wicking composite leather grip. We use these exclusively in our academy.',
          isVerifiedBuyer: true,
          status: 'approved',
          createdAt: '2026-10-05T10:15:00Z',
        },
        {
          id: 'rev_03',
          productName: 'STRATEGY Speed Carbon inline Skates',
          reviewerName: 'Mariam Al Shehhi',
          rating: 5,
          reviewText: 'Super rigid heat-moldable carbon boot. Top quality bearings!',
          isVerifiedBuyer: true,
          status: 'approved',
          createdAt: '2026-10-04T18:30:00Z',
        },
        {
          id: 'rev_04',
          productName: 'STRATEGY Matchmaster Pro Football',
          reviewerName: 'Rashid Al Nuaimi',
          rating: 4,
          reviewText: 'True flight trajectory on long passes. Highly recommended match ball.',
          isVerifiedBuyer: true,
          status: 'pending',
          createdAt: '2026-10-07T08:10:00Z',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatus = async (id, status) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setToastMessage(`Review ${status.toUpperCase()}.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'productName',
      render: (val) => <span className="font-medium text-zinc-900 text-xs sm:text-sm">{val}</span>,
    },
    {
      header: 'Reviewer',
      accessor: 'reviewerName',
      render: (val, row) => (
        <div>
          <span className="font-medium text-zinc-900">{val}</span>
          {row.isVerifiedBuyer && <span className="ml-1.5 text-[10px] text-emerald-700 font-medium">✓ Verified Buyer</span>}
        </div>
      ),
    },
    {
      header: 'Rating',
      accessor: 'rating',
      align: 'center',
      render: (val) => (
        <div className="flex items-center justify-center text-amber-500 font-bold">
          {'★'.repeat(val)}
        </div>
      ),
    },
    {
      header: 'Review Comment',
      accessor: 'reviewText',
      render: (val) => <p className="text-slate-600 font-medium text-xs truncate max-w-sm">{val}</p>,
    },
    {
      header: 'Status',
      accessor: 'status',
      align: 'center',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {row.status !== 'approved' && (
            <button
              onClick={() => handleStatus(row.id, 'approved')}
              className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Approve
            </button>
          )}
          {row.status !== 'rejected' && (
            <button
              onClick={() => handleStatus(row.id, 'rejected')}
              className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Reject
            </button>
          )}
        </div>
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
            <Star className="w-5 h-5 text-zinc-500" />
            <span>Product Reviews Moderation</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Moderate customer reviews before publishing to storefront product pages.</p>
        </div>
      </div>

      <DataTable columns={columns} data={reviews} loading={loading} searchable={true} searchPlaceholder="Search reviews..." />
    </div>
  );
}
