import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import ProductFormModal from './ProductFormModal';
import BulkStockEditorModal from './BulkStockEditorModal';
import StockControl from '../../components/StockControl';
import { productsData } from '../../../data/products';
import {
  Package,
  Plus,
  Sliders,
  AlertTriangle,
  RefreshCw,
  Edit,
  Trash2,
  CheckCircle2,
  Filter,
  DollarSign,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ProductsView({ onAddNewProduct, onEditProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); // product being edited
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkEditorOpen, setIsBulkEditorOpen] = useState(false);
  const [deleteProductTarget, setDeleteProductTarget] = useState(null); // product being deleted
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('strategy_admin_token');
      const response = await fetch('http://localhost:5000/api/v1/admin/products');
      const result = await response.json();
      if (result.success && result.data?.products?.length) {
        setProducts(result.data.products);
      } else {
        throw new Error('API products fallback');
      }
    } catch (err) {
      console.warn('Backend API connection fallback, loading local seed data:', err.message);
      // Map local products to standardized schema
      const mapped = productsData.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku || `STR-${p.id.toUpperCase()}`,
        category: p.category || 'General',
        sport: p.sport || 'General',
        gender: p.gender || 'unisex',
        priceFils: Math.round((p.price || 49.99) * 100),
        salePriceFils: Math.round((p.price || 49.99) * 100),
        costPriceFils: Math.round((p.price || 49.99) * 50),
        images: p.images || ['/images/strategy_basketball_ball.jpg'],
        image: p.images?.[0] || '/images/strategy_basketball_ball.jpg',
        description: p.description || '',
        stockQuantity: p.stock ?? 25,
        lowStockThreshold: 5,
        isFeatured: !!p.isFeatured,
        isBestSeller: !!p.isBestSeller,
        isNewArrival: !!p.isNew,
        isSpecialEdition: !!p.isSpecialEdition,
        status: 'published',
        variants: [],
      }));
      setProducts(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateNew = () => {
    if (onAddNewProduct) {
      onAddNewProduct();
    } else {
      setSelectedProduct(null);
      setIsFormOpen(true);
    }
  };

  const handleEditProduct = (prod) => {
    if (onEditProduct) {
      onEditProduct(prod);
    } else {
      setSelectedProduct(prod);
      setIsFormOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProductTarget) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem('strategy_admin_token');
      await fetch(`http://localhost:5000/api/v1/admin/products/${deleteProductTarget.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === deleteProductTarget.id ? { ...p, status: 'archived' } : p))
      );
      setToastMessage(`Product "${deleteProductTarget.name}" archived.`);
    } catch (e) {
      setProducts((prev) =>
        prev.map((p) => (p.id === deleteProductTarget.id ? { ...p, status: 'archived' } : p))
      );
      setToastMessage(`Product "${deleteProductTarget.name}" archived.`);
    } finally {
      setIsDeleting(false);
      setDeleteProductTarget(null);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleSaveSuccess = (savedProduct) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProduct.id ? { ...p, ...savedProduct } : p));
      }
      return [savedProduct, ...prev];
    });
    setToastMessage(`Product "${savedProduct.name}" saved successfully.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleInlineStockChange = async (productId, newQty) => {
    const qty = Math.max(0, parseInt(newQty) || 0);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockQuantity: qty, stock: qty } : p))
    );

    try {
      const token = localStorage.getItem('strategy_admin_token');
      await fetch(`http://localhost:5000/api/v1/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ stockQuantity: qty }),
      });
    } catch (e) {
      // Optimistic state preserved
    }
  };

  const handleBulkAction = async (actionStatus) => {
    if (selectedIds.length === 0) return;
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: actionStatus } : p))
    );
    setToastMessage(`Updated ${selectedIds.length} products to ${actionStatus}.`);
    setSelectedIds([]);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Summary KPIs
  const totalProducts = products.length;
  const publishedCount = products.filter((p) => p.status === 'published').length;
  const lowStockCount = products.filter((p) => (p.stockQuantity ?? p.stock ?? 0) <= (p.lowStockThreshold || 5)).length;
  const totalStockValFils = products.reduce((sum, p) => sum + (p.priceFils || 0) * (p.stockQuantity ?? p.stock ?? 0), 0);

  // Table Columns Setup
  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      sortable: true,
      render: (val, row) => {
        const img = row.image || row.images?.[0] || '/images/strategy_basketball_ball.jpg';
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0">
              <img src={img} alt={val} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-medium text-zinc-900 hover:text-black transition-colors cursor-pointer text-xs" onClick={() => handleEditProduct(row)}>
                {val}
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-400">
                <span className="font-mono">{row.sku}</span>
                {row.isFeatured && <span className="text-amber-700 font-medium">★ Featured</span>}
                {row.isBestSeller && <span className="text-blue-700 font-medium">🔥 Best Seller</span>}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Category',
      accessor: 'category',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium text-[11px] border border-zinc-200/60">
          {val}
        </span>
      ),
    },
    {
      header: 'Price (AED)',
      accessor: 'priceFils',
      sortable: true,
      align: 'right',
      render: (val) => {
        const aed = val ? (val / 100).toFixed(2) : '0.00';
        return <span className="font-medium text-zinc-900">AED {aed}</span>;
      },
    },
    {
      header: 'Stock Level',
      accessor: 'stockQuantity',
      sortable: true,
      align: 'center',
      render: (val, row) => {
        const stock = val ?? row.stock ?? 0;
        const lowLimit = row.lowStockThreshold || 5;

        return (
          <div className="flex flex-col items-center justify-center py-0.5">
            <StockControl
              value={stock}
              lowThreshold={lowLimit}
              onChange={(newQty) => handleInlineStockChange(row.id, newQty)}
              showBadge={true}
              badgePosition="top"
              showQuickPills={stock <= lowLimit}
            />
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      align: 'center',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleEditProduct(row)}
            title="Edit Product"
            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteProductTarget(row)}
            title="Archive Product"
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
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-[100] bg-zinc-900 text-white px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-2 font-medium text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-zinc-500" />
            <span>Product & Inventory Management</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage your full product catalog, SKUs, inventory stock alerts, prices, and variants.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsBulkEditorOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-zinc-500" />
            <span>Rapid Stock Matrix</span>
          </button>

          <button
            onClick={handleCreateNew}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white border border-zinc-200/90 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Total Catalog</p>
            <p className="text-xl font-semibold text-zinc-900 mt-0.5">{totalProducts} Products</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
            <Package className="w-4 h-4 stroke-[1.75]" />
          </div>
        </div>

        <div className="p-4 bg-white border border-zinc-200/90 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Published Live</p>
            <p className="text-xl font-semibold text-zinc-900 mt-0.5">{publishedCount} Items</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 stroke-[1.75]" />
          </div>
        </div>

        <div className="p-4 bg-white border border-zinc-200/90 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Low Stock Warnings</p>
            <p className="text-xl font-semibold text-zinc-900 mt-0.5">{lowStockCount} Products</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 stroke-[1.75]" />
          </div>
        </div>

        <div className="p-4 bg-white border border-zinc-200/90 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Stock Retail Value</p>
            <p className="text-xl font-semibold text-zinc-900 mt-0.5">
              AED {(totalStockValFils / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
            <DollarSign className="w-4 h-4 stroke-[1.75]" />
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="p-2.5 bg-zinc-900 text-white rounded-lg flex items-center justify-between text-xs animate-in fade-in">
          <span className="font-medium text-zinc-200">
            {selectedIds.length} Products Selected
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleBulkAction('published')}
              className="px-2.5 py-1 bg-white text-zinc-900 hover:bg-zinc-100 font-medium rounded-md transition-colors cursor-pointer"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkAction('draft')}
              className="px-2.5 py-1 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 font-medium rounded-md transition-colors cursor-pointer"
            >
              Draft
            </button>
            <button
              onClick={() => handleBulkAction('archived')}
              className="px-2.5 py-1 bg-zinc-800 text-rose-300 hover:bg-rose-950 font-medium rounded-md transition-colors cursor-pointer"
            >
              Archive
            </button>
          </div>
        </div>
      )}

      {/* Products Data Table */}
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        selectable={true}
        onSelectionChange={(ids) => setSelectedIds(ids)}
        searchable={true}
        searchPlaceholder="Search products by name, SKU, category..."
        filterOptions={[
          {
            key: 'category',
            label: 'Category',
            options: [
              { label: 'Basketball', value: 'Basketball' },
              { label: 'Running', value: 'Running' },
              { label: 'Football', value: 'Football' },
              { label: 'Skating', value: 'Skating' },
              { label: 'Fitness', value: 'Fitness' },
              { label: 'Apparel', value: 'Apparel' },
            ],
          },
          {
            key: 'status',
            label: 'Status',
            options: [
              { label: 'Published', value: 'published' },
              { label: 'Draft', value: 'draft' },
              { label: 'Archived', value: 'archived' },
            ],
          },
        ]}
        pageSize={10}
        onRefresh={fetchProducts}
        emptyTitle="No products found in catalog"
        emptyDescription="Create your first product or reset your search filters."
      />

      {/* Product Form Modal (Create / Edit) */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={selectedProduct}
        onSaveSuccess={handleSaveSuccess}
      />

      {/* Bulk Stock Matrix Editor Modal */}
      <BulkStockEditorModal
        isOpen={isBulkEditorOpen}
        onClose={() => setIsBulkEditorOpen(false)}
        products={products}
        onSaveSuccess={(updatedList) => {
          fetchProducts();
          setToastMessage('Bulk matrix stock & prices saved.');
          setTimeout(() => setToastMessage(''), 3000);
        }}
      />

      {/* Delete / Archive Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteProductTarget}
        onClose={() => setDeleteProductTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Archive "${deleteProductTarget?.name}"?`}
        description="This product will be archived and hidden from the storefront catalog."
        confirmLabel="Archive Product"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
