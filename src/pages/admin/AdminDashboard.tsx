import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Plus,
  ShoppingCart,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { getProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { getOrders, getOrderStats } from '../../services/orderService';
import type { Product, Category, Order, OrderStats } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      const [prodRes, catRes, ordersRes, statsRes] = await Promise.all([
        getProducts(),
        getCategories(),
        getOrders(),
        getOrderStats()
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
      if (ordersRes.data) setOrders(ordersRes.data.slice(0, 5));
      if (statsRes.data) setOrderStats(statsRes.data);
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.is_available).length;
  const outOfStockProducts = products.filter(p => !p.is_available).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col lg:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        
        {/* TOP TITLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
              Store Dashboard
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm mt-0.5">
              Hafiz Ji Bartan Store • Sales analytics, order fulfillment & inventory manager
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Manage Customer Orders</span>
            </Link>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* E-COMMERCE SALES & ORDER CARDS */}
        {orderStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Sales</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-black font-serif text-amber-400 block">
                {formatCurrency(orderStats.totalRevenue)}
              </span>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Orders</span>
                <ShoppingCart className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-2xl font-black font-serif text-white block">
                {orderStats.totalOrders}
              </span>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Pending Orders</span>
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
              <span className="text-2xl font-black font-serif text-amber-400 block">
                {orderStats.pendingOrders}
              </span>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Delivered</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-black font-serif text-emerald-400 block">
                {orderStats.deliveredOrders}
              </span>
            </div>

          </div>
        )}

        {/* INVENTORY STATS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-stone-900/60 border border-stone-800/80 p-4 rounded-xl space-y-1">
            <span className="text-stone-400 text-xs font-medium block">Total Catalogue Items</span>
            <span className="text-lg font-bold text-white">{totalProducts}</span>
          </div>
          <div className="bg-stone-900/60 border border-stone-800/80 p-4 rounded-xl space-y-1">
            <span className="text-stone-400 text-xs font-medium block">In Stock</span>
            <span className="text-lg font-bold text-emerald-400">{availableProducts}</span>
          </div>
          <div className="bg-stone-900/60 border border-stone-800/80 p-4 rounded-xl space-y-1">
            <span className="text-stone-400 text-xs font-medium block">Out of Stock</span>
            <span className="text-lg font-bold text-stone-400">{outOfStockProducts}</span>
          </div>
          <div className="bg-stone-900/60 border border-stone-800/80 p-4 rounded-xl space-y-1">
            <span className="text-stone-400 text-xs font-medium block">Categories</span>
            <span className="text-lg font-bold text-white">{categories.length}</span>
          </div>
        </div>

        {/* RECENT ORDERS SUMMARY WIDGET */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <h3 className="font-bold font-serif text-white text-lg">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
              <span>View All Orders ({orderStats?.totalOrders || 0})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-950 text-stone-400 font-bold uppercase tracking-wider border-b border-stone-800">
                <tr>
                  <th className="px-6 py-3.5">Order #</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800 text-stone-300">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-stone-500 text-xs">No orders placed yet.</td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-amber-400">
                        {ord.order_number}
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">
                        {ord.customer_name}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-white">
                        {formatCurrency(ord.grand_total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          ord.order_status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          ord.order_status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {ord.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-400">
                        {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};
