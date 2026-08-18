import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  Phone, 
  X,
  RefreshCw,
  MessageCircle
} from 'lucide-react';
import { getOrders, updateOrderStatus, getOrderStats } from '../../services/orderService';
import type { Order, OrderStatus, OrderStats } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../contexts/ToastContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { getOrderWhatsAppLink } from '../../utils/whatsapp';

export const AdminOrders: React.FC = () => {
  const { showToast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected order modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchOrdersData = async () => {
    setLoading(true);
    const [ordersRes, statsRes] = await Promise.all([
      getOrders({ status: activeTab, search: searchQuery }),
      getOrderStats()
    ]);

    if (ordersRes.data) setOrders(ordersRes.data);
    if (statsRes.data) setStats(statsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrdersData();
  }, [activeTab, searchQuery]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    const res = await updateOrderStatus(orderId, newStatus);
    
    if (res.success) {
      showToast('Order Status Updated', `Order status updated to "${getStatusText(newStatus)}".`, 'success');
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, order_status: newStatus } : null);
      }
      fetchOrdersData();
    } else {
      showToast('Error', res.error || 'Failed to update order status.', 'error');
    }
    setIsUpdating(false);
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">Pending</span>;
      case 'confirmed':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">Confirmed</span>;
      case 'preparing':
        return <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">Preparing</span>;
      case 'out_for_delivery':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">Out for Delivery</span>;
      case 'delivered':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">Delivered</span>;
      case 'cancelled':
        return <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">Cancelled</span>;
      default:
        return <span className="bg-stone-800 text-stone-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col lg:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Store Administration</span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">Order Management</h1>
          </div>

          <button
            onClick={fetchOrdersData}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Orders</span>
          </button>
        </div>

        {/* STATS OVERVIEW CARDS */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-1">
              <span className="text-stone-400 text-xs font-medium block">Total Sales Revenue</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-serif">
                {formatCurrency(stats.totalRevenue)}
              </span>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-1">
              <span className="text-stone-400 text-xs font-medium block">Total Orders</span>
              <span className="text-xl sm:text-2xl font-black text-white font-serif">{stats.totalOrders}</span>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-1">
              <span className="text-stone-400 text-xs font-medium block">Pending Orders</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-serif">{stats.pendingOrders}</span>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-1">
              <span className="text-stone-400 text-xs font-medium block">Delivered Orders</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-serif">{stats.deliveredOrders}</span>
            </div>
          </div>
        )}

        {/* FILTERS & SEARCH */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            
            {/* SEARCH */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order #, customer or phone..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:border-amber-500 outline-hidden font-medium"
              />
            </div>

            {/* STATUS TABS */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {(['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  {tab === 'all' ? 'All Orders' : getStatusText(tab)}
                </button>
              ))}
            </div>
          </div>

          {/* ORDERS TABLE */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-stone-400 text-xs font-medium space-y-2">
                <div className="w-7 h-7 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p>Loading store orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center text-stone-500 text-xs font-medium space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto text-stone-700" />
                <p>No orders found matching filter criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-stone-950/80 text-stone-400 font-bold uppercase tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="py-3.5 px-4">Order #</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Phone</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-300">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-800/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">
                          {ord.order_number}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          {ord.customer_name}
                        </td>
                        <td className="py-3 px-4 text-stone-400 font-mono">
                          {ord.customer_phone}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-white">
                          {formatCurrency(ord.grand_total)}
                        </td>
                        <td className="py-3 px-4 uppercase font-bold text-stone-400">
                          {ord.payment_method}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(ord.order_status)}
                        </td>
                        <td className="py-3 px-4 text-stone-400">
                          {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-400" />
                              <span>Details</span>
                            </button>
                            <a
                              href={getOrderWhatsAppLink(ord)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 transition-colors"
                              title="Send Order Notification via WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* ORDER DETAILS & STATUS UPDATE MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-6 p-6 max-h-[90vh] overflow-y-auto">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Order Details</span>
                <h3 className="text-xl font-bold font-mono text-white">{selectedOrder.order_number}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STATUS UPDATE DROPDOWN & WHATSAPP ACTION */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Update Order Status</span>
                  <span className="text-xs text-stone-500">Change status stage for customer order</span>
                </div>

                <select
                  value={selectedOrder.order_status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs font-bold text-white focus:border-amber-500 outline-hidden cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-end">
                <a
                  href={getOrderWhatsAppLink(selectedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send Order Notification to Admin / WhatsApp</span>
                </a>
              </div>
            </div>

            {/* CUSTOMER & ADDRESS DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-stone-950 p-4 rounded-2xl space-y-1.5 border border-stone-800">
                <span className="font-bold text-amber-400 block uppercase tracking-wider text-[11px]">Customer Details</span>
                <p className="font-bold text-white text-sm">{selectedOrder.customer_name}</p>
                <p className="text-stone-300 font-mono flex items-center gap-1">
                  <Phone className="w-3 h-3 text-stone-500" />
                  <span>{selectedOrder.customer_phone}</span>
                </p>
                {selectedOrder.customer_email && <p className="text-stone-400">{selectedOrder.customer_email}</p>}
              </div>

              <div className="bg-stone-950 p-4 rounded-2xl space-y-1.5 border border-stone-800">
                <span className="font-bold text-amber-400 block uppercase tracking-wider text-[11px]">Delivery Address</span>
                <p className="text-stone-200">{selectedOrder.delivery_address}</p>
                <p className="text-stone-400">{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
                {selectedOrder.order_notes && <p className="text-amber-300/80 italic mt-1">Note: "{selectedOrder.order_notes}"</p>}
              </div>
            </div>

            {/* ORDERED ITEMS */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold text-stone-400 uppercase tracking-wider text-xs block">Ordered Items</span>
                <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 divide-y divide-stone-800 text-xs">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="py-2 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">{item.product_name}</p>
                        <p className="text-stone-400 text-[11px]">{item.quantity} × {formatCurrency(item.product_price)}</p>
                      </div>
                      <span className="font-extrabold text-amber-400">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUMMARY TOTALS */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex justify-between items-center text-xs">
              <span className="text-stone-400 font-bold">Grand Total ({selectedOrder.payment_method.toUpperCase()}):</span>
              <span className="text-xl font-extrabold text-white font-serif">{formatCurrency(selectedOrder.grand_total)}</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
