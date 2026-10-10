import React, { useState } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { TextInput, SelectInput } from '../../components/FormInputs';
import { Menu, Plus, CheckCircle2, MoveUp, MoveDown } from 'lucide-react';

export default function NavigationView() {
  const [navItems, setNavItems] = useState([
    { id: '1', label: 'Home', url: '#home', location: 'header', displayOrder: 1 },
    { id: '2', label: 'Shop All', url: '#shop', location: 'header', displayOrder: 2 },
    { id: '3', label: 'Basketball', url: '#category-basketball', location: 'header', displayOrder: 3 },
    { id: '4', label: 'Running', url: '#category-running', location: 'header', displayOrder: 4 },
    { id: '5', label: 'Football', url: '#category-football', location: 'header', displayOrder: 5 },
    { id: '6', label: 'Skating', url: '#category-skating', location: 'header', displayOrder: 6 },
    { id: '7', label: 'Sports Academy', url: '#programs', location: 'header', displayOrder: 7 },
    { id: '8', label: 'Special Vault', url: '#special-edition', location: 'header', displayOrder: 8 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ label: '', url: '#', location: 'header' });
  const [toastMessage, setToastMessage] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    setNavItems((prev) => [
      ...prev,
      { ...formData, id: `n_${Date.now()}`, displayOrder: prev.length + 1 }
    ]);
    setIsModalOpen(false);
    setToastMessage(`Nav item "${formData.label}" added.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const columns = [
    {
      header: 'Menu Label',
      accessor: 'label',
      render: (val) => <span className="font-medium text-zinc-900 text-xs sm:text-sm">{val}</span>,
    },
    {
      header: 'Target Link Anchor',
      accessor: 'url',
      render: (val) => <span className="font-mono text-xs text-zinc-600">{val}</span>,
    },
    {
      header: 'Menu Placement',
      accessor: 'location',
      render: (val) => <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-300">{val}</span>,
    },
    {
      header: 'Order',
      accessor: 'displayOrder',
      align: 'center',
      render: (val) => <span className="font-normal text-zinc-600 text-xs">#{val}</span>,
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
            <Menu className="w-5 h-5 text-zinc-500" />
            <span>Navbar & Footer Menu Builder</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Configure public storefront header navigation links and footer menus.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Navigation Link</span>
        </button>
      </div>

      <DataTable columns={columns} data={navItems} loading={false} searchable={true} searchPlaceholder="Search menu items..." />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Navigation Link" maxWidth="max-w-md">
        <form onSubmit={handleAddItem} className="space-y-4">
          <TextInput
            label="Menu Item Label"
            value={formData.label}
            onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
            placeholder="e.g. Special Vault"
            required
          />

          <TextInput
            label="Target Link Anchor / URL"
            value={formData.url}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            placeholder="#special-edition"
            required
          />

          <SelectInput
            label="Placement Location"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            options={[
              { label: 'Header Navigation Navbar', value: 'header' },
              { label: 'Footer Services Column', value: 'footer' },
            ]}
          />

          <div className="pt-2 flex justify-end gap-2.5">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-medium transition cursor-pointer">Cancel</button>
            <button type="submit" className="px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium rounded-lg text-xs transition cursor-pointer">Add Link</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
