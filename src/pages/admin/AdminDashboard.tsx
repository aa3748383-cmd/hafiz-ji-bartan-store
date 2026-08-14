import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Plus 
} from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { getProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import type { Product, Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.is_available).length;
  const outOfStockProducts = products.filter(p => !p.is_available).length;
  const featuredProducts = products.filter(p => p.is_featured).length;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        
        {/* TOP TITLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900">
              Admin Overview Dashboard
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Hafiz Ji Bartan Store • Real-time product inventory & category manager
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] hover:bg-stone-800 text-white border border-[#111111] font-semibold text-xs shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 text-white shrink-0" />
              <span className="text-white">Add New Product</span>
            </Link>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Products</span>
              <Package className="w-4 h-4 text-brand-700" />
            </div>
            <span className="text-2xl font-bold font-serif text-stone-900 block">{totalProducts}</span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">In Stock</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold font-serif text-emerald-600 block">{availableProducts}</span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Out of Stock</span>
              <XCircle className="w-4 h-4 text-stone-400" />
            </div>
            <span className="text-2xl font-bold font-serif text-stone-800 block">{outOfStockProducts}</span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Featured</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-2xl font-bold font-serif text-amber-600 block">{featuredProducts}</span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Categories</span>
              <Layers className="w-4 h-4 text-stone-700" />
            </div>
            <span className="text-2xl font-bold font-serif text-stone-900 block">{categories.length}</span>
          </div>

        </div>

        {/* RECENT PRODUCTS TABLE */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold font-serif text-stone-900 text-lg">Inventory Quick View</h3>
            <Link to="/admin/products" className="text-xs font-semibold text-brand-700 hover:underline">
              Manage All Products →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3.5">Product Name</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Featured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.slice(0, 5).map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-stone-900 flex items-center gap-3">
                      <img
                        src={prod.image_url || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80'}
                        alt={prod.name}
                        className="w-10 h-10 object-cover rounded-lg shrink-0"
                      />
                      <span className="line-clamp-1">{prod.name}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-stone-600">
                      {prod.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 font-bold text-stone-900">
                      {formatCurrency(prod.price)}
                    </td>
                    <td className="px-6 py-4">
                      {prod.is_available ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {prod.is_featured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                          Yes
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};
