import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import type { Product, Category } from '../../types';
import { uploadProductImage } from '../../services/storageService';
import { slugify } from '../../utils/formatters';

interface ProductFormModalProps {
  product: Product | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<boolean>;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price);
      setCategoryId(product.category_id);
      setImageUrl(product.image_url || '');
      setStockQuantity(product.stock_quantity ?? 10);
      setIsAvailable(product.is_available);
      setIsFeatured(product.is_featured);
    } else {
      setName('');
      setDescription('');
      setPrice(0);
      setCategoryId(categories[0]?.id || '');
      setImageUrl('');
      setStockQuantity(10);
      setIsAvailable(true);
      setIsFeatured(false);
    }
    setUploadError(null);
  }, [product, categories, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const res = await uploadProductImage(file);
    if (res.error) {
      setUploadError(res.error);
    } else if (res.publicUrl) {
      setImageUrl(res.publicUrl);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price < 0 || !categoryId) return;

    setSubmitting(true);
    const slug = slugify(name);

    const payload: Partial<Product> = {
      name,
      slug: product?.slug || `${slug}-${Date.now().toString().substring(8)}`,
      description,
      price: Number(price),
      category_id: categoryId,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
      stock_quantity: Number(stockQuantity),
      is_available: isAvailable,
      is_featured: isFeatured,
    };

    const success = await onSave(payload);
    setSubmitting(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative my-8">
        
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
            {product ? 'Edit Store Product' : 'Create New Product'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Fill in the details to update inventory in Hafiz Ji Bartan Store catalogue.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-stone-800">
          
          {/* NAME */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Stainless Steel Thali Set (5 Pcs)"
              className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 outline-hidden"
            />
          </div>

          {/* CATEGORY & PRICE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Category *</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 text-sm bg-white focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 outline-hidden"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Price (₹ INR) *</label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="450"
                className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 outline-hidden"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product details, material finish, gauge thickness, capacity..."
              className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 outline-hidden"
            />
          </div>

          {/* IMAGE UPLOAD & PREVIEW */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Product Image</label>
            
            <div className="flex items-center gap-4">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-xl border border-stone-200 shrink-0"
                />
              )}

              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-300 transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin text-brand-700" /> : <Upload className="w-4 h-4 text-brand-700" />}
                  <span>{uploading ? 'Uploading to Supabase Storage...' : 'Upload New Image'}</span>
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
                  placeholder="Or paste image URL directly"
                  className="w-full mt-2 p-2 rounded-lg border border-stone-200 text-xs text-stone-600 outline-hidden"
                />
              </div>
            </div>

            {uploadError && (
              <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{uploadError}</span>
              </p>
            )}
          </div>

          {/* STOCK QUANTITY & TOGGLES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="rounded text-brand-700 w-4 h-4"
                />
                <span>Available In Stock</span>
              </label>
            </div>

            <div className="flex items-center pt-5">
              <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-amber-700">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-amber-600 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Item</span>
                </span>
              </label>
            </div>
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
              <span className="text-white">{product ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
