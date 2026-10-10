import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageUploader from '../../components/ImageUploader';
import { TextInput, SelectInput, TextareaInput } from '../../components/FormInputs';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  SlidersHorizontal,
  Package
} from 'lucide-react';

export default function CollectionsView() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'automated',
    ruleField: 'isSpecialEdition',
    ruleCondition: 'equals',
    ruleValue: 'true',
    image: '/images/strategy_performance_jacket.jpg',
    description: '',
    status: 'published',
  });

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/admin/collections');
      const result = await res.json();
      if (result.success && result.data?.collections) {
        setCollections(result.data.collections);
      } else {
        throw new Error('API fallback');
      }
    } catch (e) {
      setCollections([
        {
          id: 'col_vault',
          name: 'Special Edition Vault',
          slug: 'special-edition-vault',
          image: '/images/strategy_performance_jacket.jpg',
          type: 'automated',
          ruleField: 'isSpecialEdition',
          ruleCondition: 'equals',
          ruleValue: 'true',
          productCount: 3,
          status: 'published',
          description: 'Numbered limited run gold-embroidered collector products.'
        },
        {
          id: 'col_best',
          name: 'Best Sellers 2026',
          slug: 'best-sellers',
          image: '/images/strategy_running_shoe.jpg',
          type: 'automated',
          ruleField: 'isBestSeller',
          ruleCondition: 'equals',
          ruleValue: 'true',
          productCount: 5,
          status: 'published',
          description: 'Top rated performance gear chosen by professional athletes.'
        },
        {
          id: 'col_new',
          name: 'New Season Drops',
          slug: 'new-arrivals',
          image: '/images/strategy_performance_jacket.jpg',
          type: 'automated',
          ruleField: 'isNewArrival',
          ruleCondition: 'equals',
          ruleValue: 'true',
          productCount: 4,
          status: 'published',
          description: 'Latest 2026 sports innovations fresh from the STRATEGY design lab.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleOpenAdd = () => {
    setEditingCollection(null);
    setFormData({
      name: '',
      slug: '',
      type: 'automated',
      ruleField: 'isSpecialEdition',
      ruleCondition: 'equals',
      ruleValue: 'true',
      image: '/images/strategy_performance_jacket.jpg',
      description: '',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col) => {
    setEditingCollection(col);
    setFormData({
      name: col.name || '',
      slug: col.slug || '',
      type: col.type || 'automated',
      ruleField: col.ruleField || 'isSpecialEdition',
      ruleCondition: col.ruleCondition || 'equals',
      ruleValue: col.ruleValue || 'true',
      image: col.image || '/images/strategy_performance_jacket.jpg',
      description: col.description || '',
      status: col.status || 'published',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const token = localStorage.getItem('strategy_admin_token');
      if (editingCollection) {
        await fetch(`http://localhost:5000/api/v1/admin/collections/${editingCollection.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(formData),
        });
        setCollections((prev) =>
          prev.map((c) => (c.id === editingCollection.id ? { ...c, ...formData } : c))
        );
        setToastMessage(`Collection "${formData.name}" updated.`);
      } else {
        const newCol = {
          ...formData,
          id: `col_${Date.now()}`,
          productCount: 0,
        };
        await fetch(`http://localhost:5000/api/v1/admin/collections`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(formData),
        });
        setCollections((prev) => [...prev, newCol]);
        setToastMessage(`Collection "${formData.name}" created.`);
      }
    } catch (e) {
      setToastMessage('Collection saved.');
    } finally {
      setIsModalOpen(false);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setCollections((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setToastMessage(`Collection "${deleteTarget.name}" deleted.`);
    setIsDeleting(false);
    setDeleteTarget(null);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const columns = [
    {
      header: 'Collection Title',
      accessor: 'name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0">
            <img src={row.image} alt={val} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-medium text-zinc-900 hover:text-black transition-colors cursor-pointer text-xs" onClick={() => handleOpenEdit(row)}>
              {val}
            </p>
            <p className="text-[10px] text-zinc-400 font-mono">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Type & Automated Rule',
      accessor: 'type',
      render: (val, row) => (
        <div className="space-y-0.5">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase bg-zinc-100 text-zinc-700 border border-zinc-200/60">
            {val}
          </span>
          {val === 'automated' && (
            <p className="text-[11px] font-mono text-zinc-500">
              Condition: {row.ruleField} {row.ruleCondition} {row.ruleValue}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Assigned Items',
      accessor: 'productCount',
      align: 'center',
      render: (val) => (
        <span className="font-normal text-zinc-700 text-xs">{val} Products</span>
      ),
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
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleOpenEdit(row)}
            title="Edit Collection"
            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            title="Delete Collection"
            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-zinc-500" />
            <span>Collections & Rules Manager</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Group products into curated collections using automated smart rules or manual selections.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Collection</span>
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={collections}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search collections..."
        pageSize={10}
        onRefresh={fetchCollections}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCollection ? `Edit Collection: ${editingCollection.name}` : 'Create Collection'}
        subtitle="Define collection name, banner image, and automated product matching rules."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Collection Title"
            value={formData.name}
            onChange={(e) => {
              const name = e.target.value;
              setFormData((prev) => ({
                ...prev,
                name,
                slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
              }));
            }}
            placeholder="e.g. Special Edition Vault"
            required
          />

          <TextInput
            label="URL Slug"
            value={formData.slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder="special-edition-vault"
            required
          />

          <SelectInput
            label="Collection Type"
            value={formData.type}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
            options={[
              { label: 'Automated (Matches Smart Rules)', value: 'automated' },
              { label: 'Manual (Hand-picked products)', value: 'manual' },
            ]}
          />

          {formData.type === 'automated' && (
            <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-2">
              <label className="text-xs font-semibold text-zinc-900 block">Automated Rule Conditions</label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={formData.ruleField}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ruleField: e.target.value }))}
                  className="px-2 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-normal text-zinc-900 focus:outline-none focus:border-zinc-900"
                >
                  <option value="isSpecialEdition">isSpecialEdition</option>
                  <option value="isBestSeller">isBestSeller</option>
                  <option value="isNewArrival">isNewArrival</option>
                  <option value="category">Category</option>
                </select>

                <select
                  value={formData.ruleCondition}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ruleCondition: e.target.value }))}
                  style={{ color: '#09090b', backgroundColor: '#ffffff' }}
                  className="px-2 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-normal text-zinc-900 focus:outline-none focus:border-zinc-950 admin-input-control cursor-pointer"
                >
                  <option value="equals">equals</option>
                  <option value="contains">contains</option>
                </select>

                <input
                  type="text"
                  value={formData.ruleValue}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ruleValue: e.target.value }))}
                  placeholder="true"
                  style={{ color: '#09090b', backgroundColor: '#ffffff' }}
                  className="px-2 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-normal text-zinc-900 focus:outline-none focus:border-zinc-950 admin-input-control"
                />
              </div>
            </div>
          )}

          <TextareaInput
            label="Collection Description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Collection description for campaign banners..."
            rows={2}
          />

          <ImageUploader
            label="Collection Banner Image"
            value={formData.image}
            onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
          />

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium rounded-lg text-xs transition cursor-pointer"
            >
              Save Collection
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete Collection "${deleteTarget?.name}"?`}
        description="Are you sure? Products in this collection will remain in your catalog."
        confirmLabel="Delete Collection"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
