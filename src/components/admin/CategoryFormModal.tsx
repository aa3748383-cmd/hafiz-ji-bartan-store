import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, AlertCircle } from 'lucide-react';
import type { Category } from '../../types';
import { uploadCategoryImage } from '../../services/storageService';
import { slugify } from '../../utils/formatters';

interface CategoryFormModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Partial<Category>) => Promise<boolean>;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  category,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
      setImageUrl(category.image_url || '');
    } else {
      setName('');
      setDescription('');
      setImageUrl('');
    }
    setUploadError(null);
  }, [category, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const res = await uploadCategoryImage(file);
    if (res.error) {
      setUploadError(res.error);
    } else if (res.publicUrl) {
      setImageUrl(res.publicUrl);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    const slug = slugify(name);

    const payload: Partial<Category> = {
      name: name.trim(),
      slug: category?.slug || `${slug}-${Date.now().toString().substring(8)}`,
      description: description.trim(),
      image_url: imageUrl || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    };

    const success = await onSave(payload);
    setSubmitting(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative">
        
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* TITLE */}
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900">
            {category ? 'Edit Category' : 'Create Category'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage store product category for Hafiz Ji Bartan Store.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-stone-800">
          
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Copper Vessels"
              className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of items included in this category..."
              className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Category Header Image</label>
            <div className="flex items-center gap-4">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-14 h-14 object-cover rounded-xl border border-stone-200 shrink-0"
                />
              )}

              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-300 transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin text-brand-700" /> : <Upload className="w-4 h-4 text-brand-700" />}
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste URL"
                  className="w-full mt-2 p-2 rounded-lg border border-stone-200 text-xs text-stone-600 outline-hidden"
                />
              </div>
            </div>

            {uploadError && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{uploadError}</span>
              </p>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-stone-800 disabled:opacity-50 text-white border border-[#111111] font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin text-white" />}
              <span className="text-white">{category ? 'Save Category' : 'Create Category'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
