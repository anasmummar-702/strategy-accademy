import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import OrderDetailModal from './OrderDetailModal';
import PrintInvoiceModal from './PrintInvoiceModal';
import {
  ShoppingBag,
  Truck,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  DollarSign,
  PackageCheck
} from 'lucide-react';

export default function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatusTab, setActiveStatusTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null); // order for detail modal
  const [printInvoiceOrder, setPrintInvoiceOrder] = useState(null); // order for print invoice modal
  const [toastMessage, setToastMessage] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/admin/orders');
      const result = await res.json();
      if (result.success && result.data?.orders) {
        setOrders(result.data.orders);
      } else {
        throw new Error('API fallback');
      }
    } catch (e) {
      setOrders([
        {
          id: 'ord_1048',
          orderNumber: 'ORD-2026-1048',
          customerName: 'Zayed Al Mansoori',
          customerEmail: 'zayed.mansoori@gmail.com',
          customerPhone: '+971 50 112 2334',
          status: 'processing',
          paymentMethod: 'COD',
          paymentStatus: 'pending',
          subtotalFils: 80857,
          vatFils: 4043,
          totalFils: 84900,
          shippingAddress: { street: 'Villa 14, Al Wasl Road', city: 'Dubai', emirate: 'Dubai' },
          courierName: 'Emirates Post',
          trackingNumber: 'TRK-AE-99201',
          createdAt: '2026-10-07T12:30:00Z',
          items: [
            { id: 'i1', productName: 'STRATEGY Official Grip Composite Basketball', sku: 'STR-BKB-001', variant: 'Size 7 / Navy', unitPriceFils: 6999, quantity: 2 },
            { id: 'i2', productName: 'STRATEGY SF-Elite Carbon Speed Runner', sku: 'STR-FTW-001', variant: 'US 10 / Volt', unitPriceFils: 19999, quantity: 1 }
          ]
        },
        {
          id: 'ord_1047',
          orderNumber: 'ORD-2026-1047',
          customerName: 'David Miller',
          customerEmail: 'david.miller@eim.ae',
          customerPhone: '+971 52 887 9900',
          status: 'shipped',
          paymentMethod: 'Credit Card (Stripe)',
          paymentStatus: 'paid',
          subtotalFils: 33238,
          vatFils: 1662,
          totalFils: 34900,
          shippingAddress: { street: 'Apt 2204, Marina Crown', city: 'Dubai', emirate: 'Dubai' },
          courierName: 'Aramex Express',
          trackingNumber: 'ARX-982104-AE',
          createdAt: '2026-10-06T15:15:00Z',
          items: [
            { id: 'i3', productName: 'STRATEGY Special Edition Gold Vault Jersey', sku: 'STR-SPC-001', variant: 'XL / Gold', unitPriceFils: 14999, quantity: 2 }
          ]
        },
        {
          id: 'ord_1046',
          orderNumber: 'ORD-2026-1046',
          customerName: 'Mariam Al Shehhi',
          customerEmail: 'mariam.shehhi@yahoo.com',
          customerPhone: '+971 56 334 5566',
          status: 'delivered',
          paymentMethod: 'Credit Card',
          paymentStatus: 'paid',
          subtotalFils: 123714,
          vatFils: 6186,
          totalFils: 129900,
          shippingAddress: { street: 'House 88, Corniche St', city: 'Abu Dhabi', emirate: 'Abu Dhabi' },
          courierName: 'DHL Express',
          trackingNumber: 'DHL-AE-448201',
          createdAt: '2026-10-06T09:40:00Z',
          items: [
            { id: 'i4', productName: 'STRATEGY Speed Carbon inline Skates', sku: 'STR-SKT-001', variant: 'EU 41 / Black', unitPriceFils: 12999, quantity: 1 }
          ]
        },
        {
          id: 'ord_1045',
          orderNumber: 'ORD-2026-1045',
          customerName: 'Rashid Al Nuaimi',
          customerEmail: 'rashid.n@gmail.com',
          customerPhone: '+971 50 998 7766',
          status: 'paid',
          paymentMethod: 'Credit Card',
          paymentStatus: 'paid',
          subtotalFils: 57048,
          vatFils: 2852,
          totalFils: 59900,
          shippingAddress: { street: 'Villa 5, Al Jurf', city: 'Ajman', emirate: 'Ajman' },
          courierName: 'Emirates Post',
          trackingNumber: 'TRK-AE-88120',
          createdAt: '2026-10-05T18:20:00Z',
          items: []
        },
        {
          id: 'ord_1044',
          orderNumber: 'ORD-2026-1044',
          customerName: 'Sarah Jenkins',
          customerEmail: 'sarah.j@outlook.com',
          customerPhone: '+971 55 123 9988',
          status: 'pending',
          paymentMethod: 'COD',
          paymentStatus: 'pending',
          subtotalFils: 23714,
          vatFils: 1186,
          totalFils: 24900,
          shippingAddress: { street: 'Apt 401, JLT Cluster T', city: 'Dubai', emirate: 'Dubai' },
          courierName: 'Emirates Post',
          trackingNumber: '',
          createdAt: '2026-10-05T14:10:00Z',
          items: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatusSuccess = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    setToastMessage(`Order ${updatedOrder.orderNumber} updated to ${updatedOrder.status.toUpperCase()}.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filtered orders list based on status tab
  const filteredOrders = activeStatusTab === 'all'
    ? orders
    : orders.filter((o) => o.status.toLowerCase() === activeStatusTab.toLowerCase());

  // Summary Metrics
  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped' || o.status === 'delivered').length;
  const totalRevFils = orders.reduce((sum, o) => sum + (o.totalFils || 0), 0);

  const columns = [
    {
      header: 'Order #',
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
      header: 'Customer Info',
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
      header: 'Payment Method',
      accessor: 'paymentMethod',
      render: (val, row) => (
        <div>
          <span className="font-medium text-zinc-900 text-xs block">{val}</span>
          <span className={`text-[10px] font-medium uppercase ${row.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
            {row.paymentStatus}
          </span>
        </div>
      ),
    },
    {
      header: 'Fulfillment Status',
      accessor: 'status',
      sortable: true,
      align: 'center',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      header: 'Total (AED)',
      accessor: 'totalFils',
      sortable: true,
      align: 'right',
      render: (val) => {
        const aed = val ? (val / 100).toFixed(2) : '0.00';
        return <span className="font-medium text-zinc-900 text-xs">AED {aed}</span>;
      },
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedOrder(row)}
            title="Inspect & Fulfill Order"
            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPrintInvoiceOrder(row)}
            title="Print Tax Invoice"
            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
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
          <h1 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-zinc-500" />
            <span>Order Fulfillment & Logistics</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Track customer orders, assign waybills, update status, and generate official UAE Tax Invoices.
          </p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white border border-zinc-200/90 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Total Orders</p>
            <p className="text-xl font-semibold text-zinc-900 mt-0.5">{totalOrders} Orders</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
          </div>
        </div>

        <div className="p-4 bg-white border border-zinc-200/90 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Pending Fulfillment</p>
            <p className="text-xl font-semibold text-zinc-900 mt-0.5">{pendingCount} Orders</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
            <Clock className="w-4 h-4 stroke-[1.75]" />
          </div>
        </div>

        <div className="p-4 bg-white border border-zinc-200/90 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Shipped & Delivered</p>
            <p className="text-xl font-semibold text-zinc-900 mt-0.5">{shippedCount} Orders</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
            <PackageCheck className="w-4 h-4 stroke-[1.75]" />
          </div>
        </div>

        <div className="p-4 bg-white border border-zinc-200/90 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Total Orders Value</p>
            <p className="text-xl font-semibold text-zinc-900 mt-0.5">
              AED {(totalRevFils / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
            <DollarSign className="w-4 h-4 stroke-[1.75]" />
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-0.5 bg-zinc-100 border border-zinc-200 rounded-lg">
        {[
          { id: 'all', label: 'All Orders' },
          { id: 'pending', label: 'Pending' },
          { id: 'processing', label: 'Processing' },
          { id: 'shipped', label: 'Shipped' },
          { id: 'delivered', label: 'Delivered' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStatusTab(tab.id)}
            className={`px-3 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              activeStatusTab === tab.id
                ? 'bg-white text-zinc-900 shadow-xs font-medium'
                : 'text-zinc-600 hover:text-zinc-900 font-normal'
            }`}
          >
            {tab.label}
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
