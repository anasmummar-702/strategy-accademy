import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { TextInput, SelectInput } from '../../components/FormInputs';
import { ShieldCheck, Plus, CheckCircle2, User } from 'lucide-react';

export default function UsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'store_manager',
    password: 'Password123!',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('strategy_admin_token');
      const res = await fetch('http://localhost:5000/api/v1/admin/settings/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const result = await res.json();
      if (result.success && result.data?.users) setUsers(result.data.users);
    } catch (e) {
      setUsers([
        {
          id: 'usr_01',
          email: 'admin@strategy.ae',
          fullName: 'Executive Owner',
          role: 'super_admin',
          roleName: 'Administrator',
          status: 'active',
          lastLogin: 'Just now',
        },
        {
          id: 'usr_02',
          email: 'store@strategy.ae',
          fullName: 'E-Commerce Store Admin',
          role: 'store_admin',
          roleName: 'Store Administrator',
          status: 'active',
          lastLogin: '25 mins ago',
        },
        {
          id: 'usr_03',
          email: 'editor@strategy.ae',
          fullName: 'Content & CMS Editor',
          role: 'content_editor',
          roleName: 'Content Editor',
          status: 'active',
          lastLogin: 'Yesterday',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    const roleNames = {
      super_admin: 'Administrator',
      store_admin: 'Store Administrator',
      content_editor: 'Content Editor',
      customer_support: 'Customer Support Agent',
    };
    const newUser = {
      ...formData,
      id: `usr_${Date.now()}`,
      roleName: roleNames[formData.role] || formData.role,
      status: 'active',
      lastLogin: 'Never',
    };
    setUsers((prev) => [...prev, newUser]);
    setIsModalOpen(false);
    setToastMessage(`Admin user "${formData.fullName}" created.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const columns = [
    {
      header: 'Admin Name',
      accessor: 'fullName',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white font-medium flex items-center justify-center text-xs">
            {val.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-zinc-900 text-xs sm:text-sm">{val}</p>
            <p className="text-[10px] text-zinc-500 font-normal">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role Title',
      accessor: 'roleName',
      render: (val) => (
        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-900 border border-slate-300 text-xs font-bold">
          {val}
        </span>
      ),
    },
    {
      header: 'Last Login',
      accessor: 'lastLogin',
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
            <ShieldCheck className="w-5 h-5 text-zinc-500" />
            <span>Admin Users & Access Control</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Manage Control Center administrators, assign roles, and revoke access.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Admin User</span>
        </button>
      </div>

      <DataTable columns={columns} data={users} loading={loading} searchable={true} searchPlaceholder="Search users..." />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Admin User" maxWidth="max-w-md">
        <form onSubmit={handleAddUser} className="space-y-4">
          <TextInput
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
            placeholder="e.g. Operations Specialist"
            required
          />

          <TextInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="user@strategy.ae"
            required
          />

          <SelectInput
            label="Assigned Role"
            value={formData.role}
            onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
            options={[
              { label: 'Administrator (Platform & Academy Master)', value: 'super_admin' },
              { label: 'Store Admin (E-Commerce, Catalog & Orders)', value: 'store_admin' },
              { label: 'Content Editor (CMS & Banners)', value: 'content_editor' },
              { label: 'Customer Support Agent (Read Only)', value: 'customer_support' },
            ]}
          />

          <TextInput
            label="Initial Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            required
          />

          <div className="pt-2 flex justify-end gap-2.5">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-medium transition cursor-pointer">Cancel</button>
            <button type="submit" className="px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium rounded-lg text-xs transition cursor-pointer">Create User</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
