import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { Printer, Phone, MessageCircle, Check, Truck, PackageCheck, Package, Loader2, XCircle } from 'lucide-react';

// The order journey, in plain words
const STEPS = [
  { key: 'received', label: 'Received', statuses: ['pending', 'paid'] },
  { key: 'packing', label: 'Packing', statuses: ['processing'] },
  { key: 'sent', label: 'Sent', statuses: ['shipped'] },
  { key: 'delivered', label: 'Delivered', statuses: ['delivered'] },
];
const COURIERS = ['Emirates Post', 'Aramex Express', 'DHL Express', 'FedEx UAE'];

const aed = (fils) => `AED ${((fils || 0) / 100).toFixed(2)}`;
const digits = (phone) => String(phone || '').replace(/\D/g, '');

export default function OrderDetailModal({ isOpen, onClose, order = null, onUpdateStatusSuccess, onOpenPrintInvoice }) {
  const [status, setStatus] = useState(order?.status || 'pending');
  const [courierName, setCourierName] = useState(order?.courierName || 'Emirates Post');
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
  const [askSend, setAskSend] = useState(false);
  const [askCancel, setAskCancel] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status || 'pending');
      setCourierName(order.courierName || 'Emirates Post');
      setTrackingNumber(order.trackingNumber || '');
      setAskSend(false);
      setAskCancel(false);
    }
  }, [order, isOpen]);

  // Hooks above must always run; only bail out after them.
  if (!order) return null;

  const save = async (newStatus, extra = {}) => {
    setSaving(true);
    const updated = { ...order, status: newStatus, courierName, trackingNumber, ...extra };
    try {
      const token = localStorage.getItem('strategy_admin_token');
      await fetch(`http://localhost:5000/api/v1/admin/orders/${order.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ status: newStatus, courierName, trackingNumber, paymentStatus: updated.paymentStatus }),
      });
    } catch {
      // backend offline – still update the list on screen
    }
    setStatus(newStatus);
    setAskSend(false);
    setAskCancel(false);
    onUpdateStatusSuccess(updated);
    setSaving(false);
  };

  const stepIndex = STEPS.findIndex((s) => s.statuses.includes(status));
  const cancelled = status === 'cancelled';
  const isCod = /cod|cash/i.test(order.paymentMethod || '');

  const primaryBtn =
    'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-black text-white text-base font-medium cursor-pointer disabled:opacity-50';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order ${order.orderNumber}`}
      subtitle={`${order.customerName} · ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Progress */}
        {cancelled ? (
          <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 text-sm font-medium flex items-center gap-2">
            <XCircle className="w-5 h-5" /> This order was cancelled.
          </div>
        ) : (
          <ol className="grid grid-cols-4 gap-2">
            {STEPS.map((s, i) => {
              const done = i < stepIndex || (i === stepIndex && status === 'delivered');
              const current = i === stepIndex && status !== 'delivered';
              return (
                <li key={s.key} className="flex flex-col items-center text-center gap-1.5">
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                      done ? 'bg-emerald-600 text-white' : current ? 'bg-zinc-900 text-white ring-4 ring-zinc-200' : 'bg-zinc-100 text-zinc-400'
                    }`}
                  >
                    {done ? <Check className="w-4 h-4" /> : i + 1}
                  </span>
                  <span className={`text-sm ${current ? 'font-semibold text-zinc-900' : done ? 'text-zinc-700' : 'text-zinc-400'}`}>{s.label}</span>
                </li>
              );
            })}
          </ol>
        )}

        {/* The one next step */}
        {!cancelled && (
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 space-y-3">
            {(status === 'pending' || status === 'paid') && (
              <>
                <p className="text-sm text-zinc-600">Next: pick the items and pack the parcel.</p>
                <button id="order-next-step" disabled={saving} onClick={() => save('processing')} className={primaryBtn}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-5 h-5" />} Start packing
                </button>
              </>
            )}

            {status === 'processing' && !askSend && (
              <>
                <p className="text-sm text-zinc-600">Next: hand the parcel to the courier.</p>
                <button id="order-next-step" onClick={() => setAskSend(true)} className={primaryBtn}>
                  <Truck className="w-5 h-5" /> Mark as sent
                </button>
              </>
            )}

            {status === 'processing' && askSend && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-sm font-medium text-zinc-800 mb-1.5">Courier</span>
                    <select
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-xl text-sm bg-white"
                    >
                      {COURIERS.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-zinc-800 mb-1.5">Tracking number (optional)</span>
                    <input
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-xl text-sm"
                    />
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button id="order-confirm-sent" disabled={saving} onClick={() => save('shipped')} className={primaryBtn}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-5 h-5" />} Confirm sent
                  </button>
                  <button onClick={() => setAskSend(false)} className="px-4 py-3 rounded-xl text-sm ring-1 ring-zinc-200 bg-white cursor-pointer">
                    Back
                  </button>
                </div>
              </div>
            )}

            {status === 'shipped' && (
              <>
                <p className="text-sm text-zinc-600">
                  Sent with {courierName}
                  {trackingNumber && <> · tracking <span className="font-mono">{trackingNumber}</span></>}. Mark it delivered once it arrives
                  {isCod && ' and the cash has been collected'}.
                </p>
                <button
                  id="order-next-step"
                  disabled={saving}
                  onClick={() => save('delivered', isCod ? { paymentStatus: 'paid' } : {})}
                  className={primaryBtn}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageCheck className="w-5 h-5" />} Mark as delivered
                </button>
              </>
            )}

            {status === 'delivered' && (
              <p className="text-base text-emerald-700 font-medium flex items-center gap-2">
                <Check className="w-5 h-5" /> Delivered. Nothing more to do.
              </p>
            )}
          </div>
        )}

        {/* Customer */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 text-sm">
            <h3 className="text-sm font-semibold text-zinc-900 mb-1">Deliver to</h3>
            <p className="text-zinc-900 font-medium">{order.customerName}</p>
            <p className="text-zinc-600">{order.shippingAddress?.street}</p>
            <p className="text-zinc-600">
              {[order.shippingAddress?.city, order.shippingAddress?.emirate].filter(Boolean).join(', ')}
            </p>
            <p className="text-zinc-600 break-all">{order.customerEmail}</p>
            {order.customerPhone && (
              <div className="flex gap-2 pt-2">
                <a href={`tel:+${digits(order.customerPhone)}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 text-white text-sm">
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a
                  href={`https://wa.me/${digits(order.customerPhone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            )}
          </div>
          <div className="text-sm space-y-1">
            <h3 className="text-sm font-semibold text-zinc-900 mb-1">Payment</h3>
            <p className="text-zinc-600">
              {order.paymentMethod} ·{' '}
              <span className={order.paymentStatus === 'paid' ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
                {order.paymentStatus === 'paid' ? 'Paid' : isCod ? 'Collect cash on delivery' : 'Not paid yet'}
              </span>
            </p>
            <div className="flex justify-between text-zinc-600 pt-2"><span>Items</span><span>{aed(order.subtotalFils)}</span></div>
            <div className="flex justify-between text-zinc-600"><span>VAT (5%)</span><span>{aed(order.vatFils)}</span></div>
            <div className="flex justify-between text-zinc-900 font-semibold text-base pt-1 border-t border-zinc-100">
              <span>Total</span>
              <span>{aed(order.totalFils)}</span>
            </div>
          </div>
        </section>

        {/* Items */}
        {order.items?.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-zinc-900 mb-2">What to pack ({order.items.reduce((n, i) => n + (i.quantity || 0), 0)} items)</h3>
            <ul className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center font-semibold text-zinc-800 flex-shrink-0">
                    {item.quantity}×
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 truncate">{item.productName}</p>
                    {item.variant && <p className="text-zinc-500">{item.variant}</p>}
                  </div>
                  <span className="text-zinc-700 whitespace-nowrap">{aed(item.unitPriceFils)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Secondary actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-100">
          <button
            onClick={() => onOpenPrintInvoice(order)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ring-1 ring-zinc-200 hover:bg-zinc-50 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print invoice
          </button>

          {!cancelled && status !== 'delivered' && (
            askCancel ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-700">Cancel this order?</span>
                <button onClick={() => setAskCancel(false)} className="px-3 py-2 rounded-xl text-sm ring-1 ring-zinc-200 cursor-pointer">No</button>
                <button onClick={() => save('cancelled')} className="px-3 py-2 rounded-xl text-sm bg-rose-600 text-white cursor-pointer">Yes, cancel</button>
              </div>
            ) : (
              <button onClick={() => setAskCancel(true)} className="text-sm text-rose-600 hover:text-rose-700 cursor-pointer">
                Cancel order
              </button>
            )
          )}
          {cancelled && (
            <button onClick={() => save('pending')} className="text-sm text-zinc-600 hover:text-zinc-900 underline cursor-pointer">
              Undo cancel
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
