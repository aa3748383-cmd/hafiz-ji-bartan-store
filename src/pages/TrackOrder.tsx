import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Truck, 
  Search, 
  Check, 
  Clock, 
  PackageCheck, 
  PackageX, 
  MapPin, 
  Phone, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { trackOrder } from '../services/orderService';
import type { Order, OrderStatus } from '../types';
import { formatCurrency } from '../utils/formatters';
import { updateSEOMetadata } from '../utils/seo';

export const TrackOrder: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const [orderNumber, setOrderNumber] = useState(searchParams.get('num') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    updateSEOMetadata({
      title: 'Track Order',
      description: 'Check real-time order status and delivery updates at Hafiz Ji Bartan Store using your order number and phone number.',
    });
    window.scrollTo(0, 0);

    // Auto search if query params are present
    if (orderNumber && phone) {
      handleSearchTrack(orderNumber, phone);
    }
  }, []);

  const handleSearchTrack = async (numToSearch: string, phoneToSearch: string) => {
    if (!numToSearch.trim() || !phoneToSearch.trim()) {
      setErrorMessage('Please enter both Order Number and Phone Number.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSearched(true);

    const res = await trackOrder(numToSearch, phoneToSearch);
    if (res.error || !res.data) {
      setOrder(null);
      setErrorMessage(res.error || 'No order found matching this Order Number and Phone Number combination.');
    } else {
      setOrder(res.data);
    }

    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchTrack(orderNumber, phone);
  };

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'processing': return 3;
      case 'shipped': return 4;
      case 'delivered': return 5;
      case 'cancelled': return 0;
      default: return 1;
    }
  };

  const steps = [
    { label: 'Order Placed', statusKey: 'pending' },
    { label: 'Confirmed', statusKey: 'confirmed' },
    { label: 'Processing', statusKey: 'processing' },
    { label: 'Shipped', statusKey: 'shipped' },
    { label: 'Delivered', statusKey: 'delivered' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-safe-action-bar">
      
      {/* PAGE HEADER */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <Truck className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
          Order Progress Tracker
        </span>
        <h1 className="text-3xl font-extrabold font-serif text-stone-900">
          Track Your Store Order
        </h1>
        <p className="text-stone-600 text-sm">
          Enter your Order Number and registered Mobile Number to check real-time delivery status.
        </p>
      </div>

      {/* TRACKING FORM */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* ORDER NUMBER INPUT */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              Order Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. HBS-20260819-1234"
              className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-amber-700 text-sm font-mono text-stone-900 bg-stone-50/60 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-bold"
            />
          </div>

          {/* PHONE NUMBER INPUT */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              Mobile Number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Registered 10-digit mobile"
              className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-amber-700 text-sm text-stone-900 bg-stone-50/60 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium"
            />
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Track Order Status</span>
            </>
          )}
        </button>
      </form>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-medium max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ORDER DETAILS RESULT */}
      {order && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-8 animate-fade-in">
          
          {/* HEADER SUMMARY */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="text-xs font-bold text-stone-400 block uppercase tracking-wider">Order Status</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold font-mono text-stone-900">{order.order_number}</span>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                  order.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                  order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-900'
                }`}>
                  {order.order_status}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-stone-600 space-y-0.5">
              <p className="flex items-center sm:justify-end gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Placed on: {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </p>
              <p>Total: <strong className="text-stone-900 font-extrabold">{formatCurrency(order.grand_total)}</strong> (COD)</p>
            </div>
          </div>

          {/* STATUS PROGRESS TIMELINE */}
          {order.order_status === 'cancelled' ? (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-sm">
              <PackageX className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <p className="font-bold">This Order Has Been Cancelled</p>
                <p className="text-xs text-red-700">If you have any questions, please contact Hafiz Ji Bartan Store.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Order Delivery Timeline</h3>
              <div className="grid grid-cols-5 gap-2 relative">
                {steps.map((step, idx) => {
                  const currentIdx = getStepIndex(order.order_status);
                  const isCompleted = idx + 1 <= currentIdx;
                  const isCurrent = idx + 1 === currentIdx;

                  return (
                    <div key={idx} className="flex flex-col items-center text-center space-y-2">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isCompleted ? 'bg-amber-800 text-white shadow-xs' : 'bg-stone-100 text-stone-400 border border-stone-300'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className={`text-[11px] font-bold leading-tight ${
                        isCurrent ? 'text-amber-900 font-black' : isCompleted ? 'text-stone-900' : 'text-stone-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CUSTOMER & DELIVERY INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-200">
            <div className="space-y-1 text-xs text-stone-700">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-800" />
                <span>Delivery Address</span>
              </h4>
              <p className="font-bold text-stone-900">{order.customer_name}</p>
              <p className="flex items-center gap-1 text-stone-600">
                <Phone className="w-3 h-3 text-stone-400" />
                <span>{order.customer_phone}</span>
              </p>
              <p>{order.delivery_address}, {order.city}, {order.state} - {order.pincode}</p>
            </div>

            {/* ORDER ITEMS LIST */}
            {order.items && order.items.length > 0 && (
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5 text-amber-800" />
                  <span>Items Ordered</span>
                </h4>
                <div className="divide-y divide-stone-100 max-h-40 overflow-y-auto pr-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="py-1.5 flex justify-between">
                      <span className="font-medium text-stone-800">{item.product_name} × {item.quantity}</span>
                      <span className="font-bold text-stone-900">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* SEARCH EMPTY STATE */}
      {!order && !searched && (
        <div className="text-center py-8 space-y-3">
          <Clock className="w-8 h-8 text-stone-400 mx-auto" />
          <p className="text-stone-500 text-xs font-medium">Enter your details above to view live order progress.</p>
        </div>
      )}

    </div>
  );
};
