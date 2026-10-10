import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { TextInput, SelectInput, CurrencyInput } from '../../components/FormInputs';
import { Ticket, Plus, CheckCircle2, Copy } from 'lucide-react';

export default function CouponsView() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    code: 'NEWCODE10',
    discountType: 'percentage',
    discountValue: 10,
    minSpendFils: 10000,
    usageLimit: 100,
    expiryDate: '2026-12-31',
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/admin/settings/coupons');
      const result = await res.json();
      if (result.success && result.data?.coupons) setCoupons(result.data.coupons);
    } catch (e) {
      setCoupons([
        {
          id: 'c1',
          code: 'WELCOME10',
          discountType: 'percentage',
          discountValue: 10,
          minSpendFils: 10000,
          usageLimit: 500,
          timesUsed: 142,
          expiryDate: '2026-12-31',
          status: 'active',
        },
        {
          id: 'c2',
          code: 'STRATEGY50',
          discountType: 'fixed',
          discountValueFils: 5000,
          minSpendFils: 30000,
          usageLimit: 100,
          timesUsed: 38,
          expiryDate: '2026-11-30',
          status: 'active',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    const newCoup = {
      ...formData,
      id: `c_${Date.now()}`,
      code: formData.code.toUpperCase(),
      timesUsed: 0,
      status: 'active',
    };
    setCoupons((prev) => [newCoup, ...prev]);
    setIsModalOpen(false);
    setToastMessage(`Coupon ${newCoup.code} created.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const columns = [
    {
      header: 'Promo Code',
      accessor: 'code',
      render: (val) => <span className="font-mono text-xs font-medium text-zinc-900 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">{val}</span>,
    },
    {
      header: 'Discount Amount',
      accessor: 'discountType',
      render: (val, row) => (
        <span className="font-medium text-zinc-900">
          {val === 'percentage' ? `${row.discountValue}% OFF` : `AED ${(row.discountValueFils / 100).toFixed(2)} OFF`}
        </span>
      ),
    },
    {
      header: 'Min Purchase',
      accessor: 'minSpendFils',
      render: (val) => <span className="text-slate-700 font-bold">AED {(val / 100).toFixed(2)}</span>,
    },
    {
      header: 'Redemptions',
      accessor: 'timesUsed',
      align: 'center',
      render: (val, row) => <span className="text-slate-900 font-bold">{val} / {row.usageLimit} used</span>,
    },
    {
      header: 'Expiry Date',
      accessor: 'expiryDate',
      render: (val) => <span className="text-slate-600 font-medium text-xs">{val}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      align: 'center',
      render: (val) => <StatusBadge status={val} size="sm" />,
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
            <Ticket className="w-5 h-5 text-zinc-500" />
            <span>Coupons & Discount Offers</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Manage promotional discount codes and checkout vouchers.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      <DataTable columns={columns} data={coupons} loading={loading} searchable={true} searchPlaceholder="Search promo codes..." />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Discount Coupon Code" maxWidth="max-w-md">
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <TextInput
            label="Promo Code"
            value={formData.code}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
            required
          />

          <SelectInput
            label="Discount Type"
            value={formData.discountType}
            onChange={(e) => setFormData((prev) => ({ ...prev, discountType: e.target.value }))}
            options={[
              { label: 'Percentage Off (%)', value: 'percentage' },
              { label: 'Fixed Amount Off (AED)', value: 'fixed' },
            ]}
          />

          {formData.discountType === 'percentage' ? (
            <TextInput
              label="Percentage Off (%)"
              type="number"
              value={formData.discountValue}
              onChange={(e) => setFormData((prev) => ({ ...prev, discountValue: parseInt(e.target.value) || 0 }))}
              required
            />
          ) : (
            <CurrencyInput
              label="Fixed Amount Off"
              valueFils={formData.discountValueFils || 5000}
              onChangeFils={(fils) => setFormData((prev) => ({ ...prev, discountValueFils: fils }))}
            />
          )}

          <CurrencyInput
            label="Minimum Purchase Requirement"
            valueFils={formData.minSpendFils}
            onChangeFils={(fils) => setFormData((prev) => ({ ...prev, minSpendFils: fils }))}
          />

          <TextInput
            label="Expiration Date"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
          />

          <div className="pt-2 flex justify-end gap-2.5">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-medium transition cursor-pointer">Cancel</button>
            <button type="submit" className="px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium rounded-lg text-xs transition cursor-pointer">Save Coupon</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
