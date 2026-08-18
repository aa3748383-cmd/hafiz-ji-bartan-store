import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  MessageCircle, 
  Truck, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Calendar,
  Banknote,
  Package
} from 'lucide-react';
import { getOrderDetailsByNumber } from '../services/orderService';
import type { Order } from '../types';
import { formatCurrency } from '../utils/formatters';
import { BUSINESS_DETAILS } from '../lib/constants';
import { updateSEOMetadata } from '../utils/seo';

export const OrderConfirmation: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateSEOMetadata({
      title: 'Order Confirmed',
      description: 'Your order has been successfully placed at Hafiz Ji Bartan Store, Lalganj.',
    });
    window.scrollTo(0, 0);

    if (orderNumber) {
      getOrderDetailsByNumber(orderNumber).then(res => {
        setOrder(res.data);
        setLoading(false);
      });
    }
  }, [orderNumber]);

  const generateWhatsAppOrderLink = () => {
    if (!order) return '#';
    const text = `Hello *Hafiz Ji Bartan Store* (${BUSINESS_DETAILS.owner}),\n\nI have placed an order on your website:\n*Order Number:* ${order.order_number}\n*Name:* ${order.customer_name}\n*Phone:* ${order.customer_phone}\n*Address:* ${order.delivery_address}, ${order.city}\n*Total Amount:* ${formatCurrency(order.grand_total)} (COD)\n\nPlease confirm my order dispatch. Thank you!`;
    return `https://wa.me/${BUSINESS_DETAILS.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-stone-600 text-sm font-medium">Retrieving your order confirmation details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4 pb-safe-action-bar">
        <h2 className="text-2xl font-bold font-serif text-stone-900">Order Details Not Found</h2>
        <p className="text-stone-600 text-sm">We could not find the details for Order #{orderNumber}.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-800 text-white font-bold text-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-safe-action-bar">
      
      {/* CONFIRMATION HERO CARD */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Placed Successfully
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900 pt-2">
            Thank You For Your Order!
          </h1>
          <p className="text-stone-600 text-sm max-w-md mx-auto">
            Your order <strong>#{order.order_number}</strong> has been received by Hafiz Ji Bartan Store and is being processed for delivery.
          </p>
        </div>

        {/* ORDER NUMBER & DATE DISPLAY */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-stone-50 border border-stone-200 px-6 py-3 rounded-2xl text-xs font-bold text-stone-800">
          <div className="flex items-center gap-1.5">
            <Package className="w-4 h-4 text-amber-800" />
            <span>Order #: <strong className="text-amber-900 font-mono text-sm">{order.order_number}</strong></span>
          </div>
          <span className="text-stone-300">|</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-stone-500" />
            <span>Date: {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* PRIMARY ACTIONS */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={generateWhatsAppOrderLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Order on WhatsApp</span>
          </a>

          <Link
            to="/track-order"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Status</span>
          </Link>
        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DELIVERY INFO */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-2xs">
          <h3 className="font-bold text-stone-900 text-base font-serif flex items-center gap-2 border-b border-stone-100 pb-2">
            <MapPin className="w-4 h-4 text-amber-800" />
            <span>Delivery Information</span>
          </h3>

          <div className="space-y-1.5 text-xs text-stone-700 font-medium">
            <p><strong>Customer:</strong> {order.customer_name}</p>
            <p className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>{order.customer_phone}</span>
            </p>
            <p><strong>Delivery Address:</strong> {order.delivery_address}, {order.city}, {order.state} - {order.pincode}</p>
            {order.order_notes && <p className="text-stone-500 italic">Notes: "{order.order_notes}"</p>}
          </div>
        </div>

        {/* PAYMENT INFO */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-2xs">
          <h3 className="font-bold text-stone-900 text-base font-serif flex items-center gap-2 border-b border-stone-100 pb-2">
            <Banknote className="w-4 h-4 text-amber-800" />
            <span>Payment Breakdown</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Payment Mode</span>
              <span className="font-bold text-stone-900 uppercase">Cash on Delivery (COD)</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Delivery Charge</span>
              <span className="font-bold text-stone-900">
                {order.delivery_charge === 0 ? 'FREE' : formatCurrency(order.delivery_charge)}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-extrabold text-stone-900">
              <span>Total Payable</span>
              <span className="text-base text-amber-900">{formatCurrency(order.grand_total)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ORDERED ITEMS TABLE */}
      {order.items && order.items.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-2xs">
          <h3 className="font-bold text-stone-900 text-base font-serif border-b border-stone-100 pb-3">
            Ordered Items Summary
          </h3>

          <div className="divide-y divide-stone-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <p className="font-bold text-stone-900">{item.product_name}</p>
                  <p className="text-stone-500 text-xs">Qty: {item.quantity} × {formatCurrency(item.product_price)}</p>
                </div>
                <span className="font-extrabold text-stone-900">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER ACTION */}
      <div className="text-center pt-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping More Items</span>
        </Link>
      </div>

    </div>
  );
};
