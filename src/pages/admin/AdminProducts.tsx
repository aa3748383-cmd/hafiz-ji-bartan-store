import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  AlertTriangle 
} from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import type { Product, Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../contexts/ToastContext';

export const AdminProducts: React.FC = () => {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [_loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      getProducts({ search: searchQuery, categoryId: selectedCategory }),
      getCategories()
    ]);

    if (prodRes.data) setProducts(prodRes.data);
    if (catRes.data) setCategories(catRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (productData: Partial<Product>): Promise<boolean> => {
    if (editingProduct) {
      const res = await updateProduct(editingProduct.id, productData);
      if (res.error) {
        showToast('Update Failed', res.error, 'error');
        return false;
      }
      showToast('Product Updated', `Successfully updated "${productData.name}".`, 'success');
    } else {
      const res = await createProduct(productData);
      if (res.error) {
        showToast('Creation Failed', res.error, 'error');
        return false;
      }
      showToast('Product Created', `Successfully added "${productData.name}".`, 'success');
    }

    loadData();
    return true;
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;

    setDeleting(true);
    const res = await deleteProduct(deletingProduct.id);
    setDeleting(false);

    if (res.error) {
      showToast('Delete Failed', res.error, 'error');
    } else {
      showToast('Product Deleted', `Removed "${deletingProduct.name}".`, 'success');
      setDeletingProduct(null);
      loadData();
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    const newStatus = !product.is_available;
    const res = await updateProduct(product.id, { is_available: newStatus });

    if (res.error) {
      showToast('Status Update Failed', res.error, 'error');
    } else {
      showToast(
        newStatus ? 'Product Available' : 'Marked Out of Stock',
        `Updated status for ${product.name}`,
        'info'
      );
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 space-y-6 overflow-y-auto">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900">
              Product Inventory Management
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Add, edit, toggle availability, and delete store items.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-stone-800 text-white border border-[#111111] font-semibold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white shrink-0" />
            <span className="text-white">Add New Product</span>
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by product name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-300 text-xs focus:border-brand-700 outline-hidden"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:border-brand-700 outline-hidden"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* PRODUCTS TABLE */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3.5">Product Name</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Stock</th>
                  <th className="px-6 py-3.5">Availability</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-stone-500 text-xs">
                      No products found. Click "Add New Product" to populate your inventory.
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                      
                      {/* NAME & THUMBNAIL */}
                      <td className="px-6 py-4 font-medium text-stone-900 flex items-center gap-3">
                        <img
                          src={prod.image_url || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80'}
                          alt={prod.name}
                          className="w-11 h-11 object-cover rounded-xl shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-stone-900 block line-clamp-1">{prod.name}</span>
                          {prod.is_featured && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Featured</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-4 text-xs font-medium text-stone-600">
                        {prod.category?.name || 'Uncategorized'}
                      </td>

                      {/* PRICE */}
                      <td className="px-6 py-4 font-bold text-stone-900">
                        {formatCurrency(prod.price)}
                      </td>

                      {/* STOCK */}
                      <td className="px-6 py-4 text-xs font-semibold text-stone-700">
                        {prod.stock_quantity ?? 0} pcs
                      </td>

                      {/* AVAILABILITY TOGGLE */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleAvailability(prod)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            prod.is_available
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {prod.is_available ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>{prod.is_available ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => setDeletingProduct(prod)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD / EDIT FORM MODAL */}
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveProduct}
        />

        {/* DELETE CONFIRMATION MODAL */}
        {deletingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-stone-200 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-stone-900">Delete Product?</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Are you sure you want to delete "<strong>{deletingProduct.name}</strong>"? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeletingProduct(null)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs shadow-sm hover:bg-red-700"
                >
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
