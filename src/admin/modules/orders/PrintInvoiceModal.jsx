import React from 'react';
import Modal from '../../components/Modal';
import { Printer, Download, CheckCircle2 } from 'lucide-react';

export default function PrintInvoiceModal({ isOpen, onClose, order }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const subtotalAed = order.subtotalFils ? (order.subtotalFils / 100).toFixed(2) : '0.00';
  const vatAed = order.vatFils ? (order.vatFils / 100).toFixed(2) : '0.00';
  const shippingAed = order.shippingFils ? (order.shippingFils / 100).toFixed(2) : '0.00';
  const totalAed = order.totalFils ? (order.totalFils / 100).toFixed(2) : '0.00';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`TAX INVOICE — ${order.orderNumber}`}
      subtitle="Official STRATEGY UAE Tax Invoice Document"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 text-zinc-900 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/90 shadow-none font-['Plus_Jakarta_Sans',sans-serif] print:border-none print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-950 text-white font-semibold flex items-center justify-center text-sm">
              S
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-zinc-900">STRATEGY ATHLETICS</h2>
              <p className="text-[11px] text-zinc-500 font-normal">Premium Sportswear & Sports Equipment LLC</p>
              <p className="text-[10px] text-zinc-400 font-mono">TRN: 100293847500003 (UAE 5% VAT)</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block px-2.5 py-0.5 bg-zinc-100 text-zinc-700 font-medium text-[11px] rounded uppercase tracking-wider mb-1">
              Official Tax Invoice
            </span>
            <p className="text-sm font-medium text-zinc-900">{order.orderNumber}</p>
            <p className="text-xs text-zinc-500">Date: {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
          </div>
        </div>

        {/* Billed To & Shipped To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs border-b border-zinc-200 pb-5">
          <div>
            <p className="font-medium text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Billed & Shipped To:</p>
            <p className="font-medium text-sm text-zinc-900">{order.customerName}</p>
            <p className="text-zinc-500">{order.shippingAddress?.street || 'Dubai, UAE'}</p>
            <p className="text-zinc-500">{order.shippingAddress?.city}, {order.shippingAddress?.emirate}, UAE</p>
            <p className="text-zinc-500 mt-1">Phone: {order.customerPhone}</p>
            <p className="text-zinc-500">Email: {order.customerEmail}</p>
          </div>

          <div className="bg-zinc-50/70 p-3.5 rounded-xl space-y-1.5 border border-zinc-200/80">
            <p className="font-medium text-zinc-400 uppercase tracking-wider text-[10px]">Payment & Shipping Info:</p>
            <p className="text-zinc-600">Payment Method: <strong className="text-zinc-900 font-medium">{order.paymentMethod}</strong></p>
            <p className="text-zinc-600">Payment Status: <strong className="text-emerald-700 uppercase font-medium">{order.paymentStatus}</strong></p>
            <p className="text-zinc-600">Carrier: <strong className="text-zinc-900 font-medium">{order.courierName || 'Emirates Post'}</strong></p>
            <p className="text-zinc-600">Tracking #: <strong className="text-zinc-900 font-mono font-medium">{order.trackingNumber || 'N/A'}</strong></p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50/80 text-zinc-500 text-[10px] font-medium uppercase tracking-wider border-b border-zinc-200">
                <th className="py-2.5 px-3.5">Item & Description</th>
                <th className="py-2.5 px-3.5">SKU / Variant</th>
                <th className="py-2.5 px-3.5 text-center">Qty</th>
                <th className="py-2.5 px-3.5 text-right">Unit Price (AED)</th>
                <th className="py-2.5 px-3.5 text-right">Total (AED)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {order.items?.map((item, idx) => {
                const unitPrice = item.unitPriceFils ? (item.unitPriceFils / 100).toFixed(2) : '0.00';
                const totalPrice = item.totalPriceFils ? (item.totalPriceFils / 100).toFixed(2) : (item.quantity * parseFloat(unitPrice)).toFixed(2);
                return (
                  <tr key={idx} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium text-zinc-900">{item.productName}</td>
                    <td className="py-2.5 px-3.5 text-zinc-500 font-mono text-[11px]">{item.sku} ({item.variant})</td>
                    <td className="py-2.5 px-3.5 text-center font-medium">{item.quantity}</td>
                    <td className="py-2.5 px-3.5 text-right font-medium">AED {unitPrice}</td>
                    <td className="py-2.5 px-3.5 text-right font-semibold text-zinc-900">AED {totalPrice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Financial Summary Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2 border-t border-zinc-200">
          <div className="text-[11px] text-zinc-500 max-w-xs space-y-1">
            <p className="font-medium text-zinc-700">Returns & Guarantee Policy:</p>
            <p>3-Day Hassle-Free Returns on unused items in original packaging. Questions? Contact support@strategy.ae</p>
          </div>

          <div className="w-full sm:w-64 space-y-1.5 text-xs bg-zinc-50/70 p-3.5 rounded-xl border border-zinc-200/80">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal:</span>
              <span className="font-medium text-zinc-900">AED {subtotalAed}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Shipping Fee:</span>
              <span className="font-medium text-zinc-900">{parseFloat(shippingAed) === 0 ? 'FREE' : `AED ${shippingAed}`}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>UAE VAT (5%):</span>
              <span className="font-medium text-zinc-900">AED {vatAed}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-zinc-900 pt-1.5 border-t border-zinc-200">
              <span>Grand Total:</span>
              <span className="text-zinc-950">AED {totalAed}</span>
            </div>
          </div>
        </div>

        {/* Print Buttons */}
        <div className="pt-2 flex justify-end gap-2.5 print:hidden">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium text-xs rounded-lg transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium text-xs rounded-lg transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Invoice</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
