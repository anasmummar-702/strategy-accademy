import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import OrderDetailModal from './OrderDetailModal';
import PrintInvoiceModal from './PrintInvoiceModal';
import { loadOrders } from '../../services/storeData';
import { Printer, CheckCircle2 } from 'lucide-react';

// Orders move: To pack → Packing → Sent → Delivered
const ORDER_TABS = [
  { id: 'topack', label: 'To pack', statuses: ['pending', 'paid'] },
  { id: 'packing', label: 'Packing', statuses: ['processing'] },
  { id: 'sent', label: 'Sent', statuses: ['shipped'] },
  { id: 'delivered', label: 'Delivered', statuses: ['delivered'] },
  { id: 'all', label: 'All' },
];

export default function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatusTab, setActiveStatusTab] = useState('topack');
  const [selectedOrder, setSelectedOrder] = useState(null); // order for detail modal
  const [printInvoiceOrder, setPrintInvoiceOrder] = useState(null); // order for print invoice modal
  const [toastMessage, setToastMessage] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    const list = await loadOrders();
    setOrders(list);
    // Nothing waiting to be packed? Show everything instead of an empty tab
    if (!list.some((o) => ['pending', 'paid'].includes(o.status))) setActiveStatusTab('all');
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatusSuccess = (updatedOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    setSelectedOrder(updatedOrder);
    const label = ORDER_TABS.find((t) => t.statuses?.includes(updatedOrder.status))?.label || updatedOrder.status;
    setToastMessage(`${updatedOrder.orderNumber} → ${label}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const tabCount = (tab) => (tab.statuses ? orders.filter((o) => tab.statuses.includes(o.status)).length : orders.length);
  const currentTab = ORDER_TABS.find((t) => t.id === activeStatusTab) || ORDER_TABS[0];
  const filteredOrders = currentTab.statuses ? orders.filter((o) => currentTab.statuses.includes(o.status)) : orders;

  const columns = [
    {
      header: 'Order',
      accessor: 'orderNumber',
      sortable: true,
      render: (val, row) => (
        <div>
          <span
            onClick={() => setSelectedOrder(row)}
            className="font-mono text-xs font-semibold text-zinc-900 hover:underline cursor-pointer"
          >
            {val}
          </span>
          <p className="text-[10px] text-zinc-400">
            {new Date(row.createdAt || Date.now()).toLocaleDateString('en-US', { dateStyle: 'short' })}
          </p>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customerName',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-medium text-zinc-900 text-xs sm:text-sm">{val}</p>
          <p className="text-[10px] text-zinc-500 truncate max-w-[160px]">{row.customerEmail}</p>
        </div>
      ),
    },
    {
      header: 'Payment',
      accessor: 'paymentMethod',
      render: (val, row) => (
        <div>
          <span className="font-medium text-zinc-900 text-xs block">{val}</span>
          <span className={`text-xs font-medium ${row.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
            {row.paymentStatus === 'paid' ? 'Paid' : 'Not paid yet'}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      align: 'center',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      header: 'Total',
      accessor: 'totalFils',
      sortable: true,
      align: 'right',
      render: (val) => {
        const aed = val ? (val / 100).toFixed(2) : '0.00';
        return <span className="font-medium text-zinc-900 text-xs">AED {aed}</span>;
      },
    },
    {
      header: '',
      accessor: 'id',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedOrder(row)}
            className="px-3 py-1.5 text-sm font-medium text-zinc-800 ring-1 ring-zinc-200 hover:bg-zinc-50 rounded-lg cursor-pointer"
          >
            Open
          </button>
          <button
            onClick={() => setPrintInvoiceOrder(row)}
            title="Print invoice"
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-[100] bg-zinc-900 text-white px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-2 font-medium text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-base text-zinc-500">Orders from your website. Open one to update its status or print the invoice.</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {ORDER_TABS.map((tab) => (
          <button
            key={tab.id}
            id={`order-tab-${tab.id}`}
            onClick={() => setActiveStatusTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer flex items-center gap-2 ${
              activeStatusTab === tab.id ? 'bg-zinc-900 text-white' : 'bg-white ring-1 ring-zinc-200 text-zinc-700 hover:ring-zinc-400'
            }`}
          >
            {tab.label}
            <span className={`min-w-[22px] px-1.5 py-0.5 rounded-full text-xs font-semibold ${activeStatusTab === tab.id ? 'bg-white/20' : 'bg-zinc-100 text-zinc-600'}`}>
              {tabCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search order # or customer name..."
        pageSize={10}
        onRefresh={fetchOrders}
        onRowClick={(row) => setSelectedOrder(row)}
      />

      {/* Order Detail & Fulfillment Modal */}
      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onUpdateStatusSuccess={handleUpdateStatusSuccess}
        onOpenPrintInvoice={(ord) => {
          setSelectedOrder(null);
          setPrintInvoiceOrder(ord);
        }}
      />

      {/* Printable Tax Invoice Modal */}
      <PrintInvoiceModal
        isOpen={!!printInvoiceOrder}
        onClose={() => setPrintInvoiceOrder(null)}
        order={printInvoiceOrder}
      />
    </div>
  );
}
