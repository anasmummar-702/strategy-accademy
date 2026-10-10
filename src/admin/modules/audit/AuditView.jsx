import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import { FileText, Clock, User, Shield } from 'lucide-react';

export default function AuditView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('strategy_admin_token');
      const res = await fetch('http://localhost:5000/api/v1/admin/settings/audit-logs', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const result = await res.json();
      if (result.success && result.data?.auditLogs) setLogs(result.data.auditLogs);
    } catch (e) {
      setLogs([
        {
          id: 'log_01',
          actorName: 'Executive Owner',
          actorRole: 'Admin',
          action: 'PRODUCT_UPDATE',
          target: 'STRATEGY Carbon Elite Speed Shoe',
          details: 'Updated sale price to AED 899.00 and stock to 18 units',
          timestamp: '2026-10-07T16:40:00Z',
        },
        {
          id: 'log_02',
          actorName: 'Store Operations Manager',
          actorRole: 'Store Manager',
          action: 'ORDER_FULFILLED',
          target: 'Order #ORD-2026-1047',
          details: 'Status updated to SHIPPED via Emirates Post (TRK-99201)',
          timestamp: '2026-10-07T15:10:00Z',
        },
        {
          id: 'log_03',
          actorName: 'Content & CMS Editor',
          actorRole: 'Content Editor',
          action: 'BANNER_PUBLISH',
          target: 'Special Vault Promotion Banner',
          details: 'Published homepage hero banner set to end Oct 31',
          timestamp: '2026-10-06T09:30:00Z',
        },
        {
          id: 'log_04',
          actorName: 'Executive Owner',
          actorRole: 'Admin',
          action: 'COUPON_CREATE',
          target: 'WELCOME10',
          details: 'Created 10% discount promo code for new subscribers',
          timestamp: '2026-10-05T12:00:00Z',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      sortable: true,
      render: (val) => (
        <span className="font-mono text-[11px] text-zinc-500">
          {new Date(val).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
        </span>
      ),
    },
    {
      header: 'Admin Actor',
      accessor: 'actorName',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-medium text-zinc-900 text-xs">{val}</p>
          <p className="text-[10px] text-zinc-400">{row.actorRole}</p>
        </div>
      ),
    },
    {
      header: 'Action Category',
      accessor: 'action',
      render: (val) => (
        <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200/60">
          {val}
        </span>
      ),
    },
    {
      header: 'Target Entity',
      accessor: 'target',
      render: (val) => <span className="font-medium text-zinc-800 text-xs">{val}</span>,
    },
    {
      header: 'Details',
      accessor: 'details',
      render: (val) => <p className="text-zinc-500 text-xs truncate max-w-sm">{val}</p>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-zinc-500" />
            <span>System Audit Trail</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Audit log tracking administrative changes, price edits, order fulfillments, and permissions.</p>
        </div>
      </div>

      <DataTable columns={columns} data={logs} loading={loading} searchable={true} searchPlaceholder="Search audit logs..." />
    </div>
  );
}
