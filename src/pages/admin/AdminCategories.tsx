import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, AlertTriangle } from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { CategoryFormModal } from '../../components/admin/CategoryFormModal';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../services/categoryService';
import type { Category } from '../../types';
import { useToast } from '../../contexts/ToastContext';

export const AdminCategories: React.FC = () => {
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [_loading, setLoading] = useState(true);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const res = await getCategories();
    if (res.data) setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsFormOpen(true);
  };

  const handleSaveCategory = async (catData: Partial<Category>): Promise<boolean> => {
    if (editingCategory) {
      const res = await updateCategory(editingCategory.id, catData);
      if (res.error) {
        showToast('Update Failed', res.error, 'error');
        return false;
      }
      showToast('Category Updated', `Successfully updated "${catData.name}".`, 'success');
    } else {
      const res = await createCategory(catData);
      if (res.error) {
        showToast('Creation Failed', res.error, 'error');
        return false;
      }
      showToast('Category Created', `Successfully created "${catData.name}".`, 'success');
    }

    loadData();
    return true;
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;

    setDeleting(true);
    const res = await deleteCategory(deletingCategory.id);
    setDeleting(false);

    if (res.error) {
      showToast('Delete Prevented', res.error, 'error');
    } else {
      showToast('Category Deleted', `Removed category "${deletingCategory.name}".`, 'success');
      setDeletingCategory(null);
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
              Category Management
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Create, edit, and organize product categories.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-stone-800 text-white border border-[#111111] font-semibold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white shrink-0" />
            <span className="text-white">Add New Category</span>
          </button>
        </div>

        {/* CATEGORIES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={cat.image_url || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'}
                  alt={cat.name}
                  className="w-16 h-16 object-cover rounded-xl shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-stone-900 text-base truncate">{cat.name}</h3>
                  <p className="text-stone-500 text-xs mt-0.5 line-clamp-2">{cat.description || 'No description'}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-stone-400">/{cat.slug}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                    title="Edit Category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeletingCategory(cat)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FORM MODAL */}
        <CategoryFormModal
          category={editingCategory}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveCategory}
        />

        {/* DELETE CONFIRMATION MODAL */}
        {deletingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-stone-200 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-stone-900">Delete Category?</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Are you sure you want to delete category "<strong>{deletingCategory.name}</strong>"?
                </p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Deletion will fail if products are currently assigned to this category.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeletingCategory(null)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs shadow-sm hover:bg-red-700"
                >
                  {deleting ? 'Checking...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
