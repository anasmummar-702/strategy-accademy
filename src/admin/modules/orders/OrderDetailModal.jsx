import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import { SelectInput, TextInput } from '../../components/FormInputs';
import { ShoppingBag, Truck, CreditCard, Printer, MapPin, Loader2, Check } from 'lucide-react';

export default function OrderDetailModal({
  isOpen,
  onClose,
  order = null,
  onUpdateStatusSuccess,
  onOpenPrintInvoice,
}) {
  if (!order) return null;

  const [status, setStatus] = useState(order.status || 'pending');
  const [courierName, setCourierName] = useState(order.courierName || 'Emirates Post');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus || 'paid');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status || 'pending');
      setCourierName(order.courierName || 'Emirates Post');
      setTrackingNumber(order.trackingNumber || '');
      setPaymentStatus(order.paymentStatus || 'paid');
    }
  }, [order, isOpen]);

  const handleUpdateFulfillment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('strategy_admin_token');
      await fetch(`http://localhost:5000/api/v1/admin/orders/${order.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status,
          courierName,
          trackingNumber,
          paymentStatus,
        }),
      });
      onUpdateStatusSuccess({
        ...order,
        status,
        courierName,
        trackingNumber,
        paymentStatus,
      });
      onClose();
    } catch (err) {
      console.warn('API update order fallback:', err.message);
      onUpdateStatusSuccess({
        ...order,
        status,
        courierName,
        trackingNumber,
        paymentStatus,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const subtotalAed = order.subtotalFils ? (order.subtotalFils / 100).toFixed(2) : '0.00';
  const vatAed = order.vatFils ? (order.vatFils / 100).toFixed(2) : '0.00';
  const totalAed = order.totalFils ? (order.totalFils / 100).toFixed(2) : '0.00';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order ${order.orderNumber}`}
      subtitle={`Placed by ${order.customerName} on ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { dateStyle: 'medium' })}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Top Actions & Quick Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-bold">Fulfillment Status:</span>
            <StatusBadge status={status} size="md" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPrintInvoice(order)}
              className="px-3 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 font-medium text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-500" />
              <span>Print Tax Invoice</span>
            </button>
          </div>
        </div>

        {/* Customer & Shipping Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-white border border-zinc-200/90 rounded-xl space-y-1.5">
            <p className="font-medium text-zinc-500 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" /> Customer & Delivery Address
            </p>
            <p className="font-medium text-zinc-900 text-sm">{order.customerName}</p>
            <p className="text-zinc-500">{order.shippingAddress?.street || 'Dubai, United Arab Emirates'}</p>
            <p className="text-zinc-500">{order.shippingAddress?.city}, {order.shippingAddress?.emirate}, UAE</p>
            <p className="text-zinc-700 pt-0.5">Phone: <span className="text-zinc-900 font-medium">{order.customerPhone}</span></p>
            <p className="text-zinc-700">Email: <span className="text-zinc-900 font-medium">{order.customerEmail}</span></p>
          </div>

          <div className="p-3.5 bg-white border border-zinc-200/90 rounded-xl space-y-1.5">
            <p className="font-medium text-zinc-500 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-zinc-400" /> Payment & Financials
            </p>
            <p className="text-zinc-600">Method: <strong className="text-zinc-900 font-medium">{order.paymentMethod}</strong></p>
            <p className="text-zinc-600">Payment Status: <strong className="text-emerald-700 font-medium uppercase">{paymentStatus}</strong></p>
            <p className="text-zinc-600">Subtotal: <strong className="text-zinc-900 font-medium">AED {subtotalAed}</strong></p>
            <p className="text-zinc-600">VAT (5%): <strong className="text-zinc-900 font-medium">AED {vatAed}</strong></p>
            <p className="text-sm font-semibold text-zinc-900 pt-1 border-t border-zinc-100">
              Total Paid: <span>AED {totalAed}</span>
            </p>
          </div>
        </div>

        {/* Order Line Items */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-zinc-900">Line Items ({order.items?.length || 0})</p>
          <div className="overflow-x-auto border border-zinc-200/90 rounded-xl bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50/90 border-b border-zinc-200 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Item</th>
                  <th className="py-2.5 px-3">SKU & Variant</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-900">
                {order.items?.map((item) => {
                  const unitPrice = item.unitPriceFils ? (item.unitPriceFils / 100).toFixed(2) : '0.00';
                  return (
                    <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-zinc-900">{item.productName}</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-500">{item.sku} ({item.variant})</td>
                      <td className="py-2.5 px-3 text-center font-medium text-zinc-900">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-medium text-zinc-900">AED {unitPrice}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fulfillment & Tracking Updater Form */}
        <form onSubmit={handleUpdateFulfillment} className="p-3.5 bg-zinc-50/60 border border-zinc-200/80 rounded-xl space-y-3">
          <p className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-zinc-500" /> Logistics & Status Update
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SelectInput
              label="Fulfillment Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: 'Pending Processing', value: 'pending' },
                { label: 'Processing in Warehouse', value: 'processing' },
                { label: 'Shipped via Courier', value: 'shipped' },
                { label: 'Delivered to Customer', value: 'delivered' },
                { label: 'Cancelled', value: 'cancelled' },
              ]}
            />

            <SelectInput
              label="Courier Partner"
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              options={[
                { label: 'Emirates Post', value: 'Emirates Post' },
                { label: 'Aramex Express', value: 'Aramex Express' },
                { label: 'DHL Express', value: 'DHL Express' },
                { label: 'FedEx UAE', value: 'FedEx UAE' },
              ]}
            />

            <TextInput
              label="Waybill / Tracking #"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="TRK-AE-99201"
            />
          </div>

          <div className="pt-1 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save & Update Logistics</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
