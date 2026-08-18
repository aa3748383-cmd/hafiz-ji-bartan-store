import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowLeft,
  Banknote,
  Lock,
  MessageCircle
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { createOrder } from '../services/orderService';
import type { CheckoutFormData } from '../types';
import { formatCurrency } from '../utils/formatters';
import { updateSEOMetadata } from '../utils/seo';
import { getOrderWhatsAppLink } from '../utils/whatsapp';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { cart, cartSubtotal, deliveryCharge, cartGrandTotal, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSubmittedRef = useRef(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    city: 'Lalganj',
    state: 'Uttar Pradesh',
    pincode: '276202',
    orderNotes: '',
    paymentMethod: 'cod'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  useEffect(() => {
    updateSEOMetadata({
      title: 'Checkout - Complete Order',
      description: 'Enter your delivery address to complete your order at Hafiz Ji Bartan Store.',
    });
    window.scrollTo(0, 0);

    if (cart.length === 0 && !isSubmitting && !hasSubmittedRef.current) {
      navigate('/cart');
    }
  }, [cart.length, isSubmitting, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Please enter your full name.';
    }

    const cleanPhone = formData.customerPhone.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.customerPhone = 'Please enter your 10-digit mobile number.';
    } else if (cleanPhone.length < 10) {
      newErrors.customerPhone = 'Mobile number must be at least 10 digits.';
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Please enter your delivery street address.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your city.';
    }

    const cleanPincode = formData.pincode.trim().replace(/\D/g, '');
    if (!cleanPincode || cleanPincode.length !== 6) {
      newErrors.pincode = 'Please enter a valid 6-digit PIN code.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent, paymentMode: 'cod' | 'whatsapp' = 'cod') => {
    e.preventDefault();

    // Prevent duplicate submission if already submitting
    if (isSubmitting) return;

    if (!validateForm()) {
      showToast('Validation Error', 'Please fill in all required delivery information.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Synchronously pre-open popup tab inside click handler stack to satisfy browser popup blockers
    let waWindow: Window | null = null;
    try {
      waWindow = window.open('about:blank', '_blank');
    } catch (popupErr) {
      console.warn('Browser prevented pre-opening popup window:', popupErr);
    }

    const payloadFormData: CheckoutFormData = {
      ...formData,
      paymentMethod: paymentMode
    };

    try {
      // 1. Insert order into Supabase FIRST
      const res = await createOrder(
        payloadFormData,
        cart,
        cartSubtotal,
        deliveryCharge,
        cartGrandTotal
      );

      // 2. If database creation fails, close pre-opened tab and DO NOT clear cart
      if (res.error || !res.data) {
        if (waWindow && !waWindow.closed) {
          waWindow.close();
        }
        console.error('ORDER CREATION FAILED:', res.error);
        showToast('Order Placement Failed', res.error || 'Failed to place order. Please try again.', 'error');
        setIsSubmitting(false);
        return;
      }

      const createdOrder = res.data;
      console.log('ORDER_CREATED:', createdOrder);

      // 3. Generate complete WhatsApp URL using actual created order from Supabase
      const waUrl = getOrderWhatsAppLink(createdOrder);
      console.log('WHATSAPP_URL_CREATED:', waUrl);

      // 4. Redirect pre-opened tab to admin WhatsApp URL
      let autoOpened = false;
      if (waWindow && !waWindow.closed) {
        try {
          waWindow.location.href = waUrl;
          autoOpened = true;
          console.log('WHATSAPP_AUTO_OPENED_SUCCESSFULLY');
        } catch (locationErr) {
          console.warn('Could not assign popup tab location:', locationErr);
        }
      }

      // If pre-opened window was blocked or closed, try secondary fallback
      if (!autoOpened) {
        try {
          const fallbackWin = window.open(waUrl, '_blank', 'noopener,noreferrer');
          if (fallbackWin) autoOpened = true;
        } catch (fbErr) {
          console.warn('Fallback window.open blocked:', fbErr);
        }
      }

      // 5. Save order & WhatsApp URL in sessionStorage for reliable fallback button access
      try {
        sessionStorage.setItem(`pending_whatsapp_url_${createdOrder.order_number}`, waUrl);
        sessionStorage.setItem(`pending_order_${createdOrder.order_number}`, JSON.stringify(createdOrder));
      } catch (storageErr) {
        console.warn('Could not save order details to sessionStorage:', storageErr);
      }

      // Mark submission complete ref to prevent useEffect from triggering navigate('/cart')
      hasSubmittedRef.current = true;

      const confirmationRoute = `/order-confirmation/${createdOrder.order_number}`;
      console.log('CONFIRMATION_ROUTE:', confirmationRoute);

      showToast('Order Placed Successfully!', `Order #${createdOrder.order_number} confirmed.`, 'success');

      // 6. Navigate directly to Order Confirmation page with order state BEFORE clearing cart
      navigate(confirmationRoute, { 
        replace: true, 
        state: { order: createdOrder, whatsappUrl: waUrl, autoOpened } 
      });

      // 7. Clear cart ONLY AFTER navigation has been initiated
      clearCart();
    } catch (err: any) {
      if (waWindow && !waWindow.closed) {
        waWindow.close();
      }
      console.error('SUBMIT ERROR:', err);
      showToast('Error', err?.message || 'An unexpected error occurred during order submission.', 'error');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !isSubmitting && !hasSubmittedRef.current) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-safe-action-bar">
      
      {/* TOP HEADER */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <Link to="/cart" className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-amber-800 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shopping Cart</span>
          </Link>
          <h1 className="text-3xl font-bold font-serif text-stone-900">
            Delivery & Order Checkout
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure Checkout</span>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmitOrder(e, formData.paymentMethod === 'whatsapp' ? 'whatsapp' : 'cod')} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT FORM COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 1: CUSTOMER DETAILS */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <User className="w-5 h-5 text-amber-800" />
              <span>Customer Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* FULL NAME */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="e.g. Akhlaq Ahmad"
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-stone-900 bg-stone-50/60 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium ${
                      errors.customerName ? 'border-red-500 bg-red-50/30' : 'border-stone-300 focus:border-amber-700'
                    }`}
                  />
                </div>
                {errors.customerName && <p className="text-xs text-red-600 font-bold">{errors.customerName}</p>}
              </div>

              {/* MOBILE NUMBER */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Mobile Number (Required) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-stone-900 bg-stone-50/60 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium ${
                      errors.customerPhone ? 'border-red-500 bg-red-50/30' : 'border-stone-300 focus:border-amber-700'
                    }`}
                  />
                </div>
                {errors.customerPhone && <p className="text-xs text-red-600 font-bold">{errors.customerPhone}</p>}
              </div>

              {/* EMAIL */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-700 text-sm text-stone-900 bg-stone-50/60 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: DELIVERY ADDRESS */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <MapPin className="w-5 h-5 text-amber-800" />
              <span>Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* STREET ADDRESS */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  House No. / Street Address / Landmark <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="deliveryAddress"
                  rows={3}
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  placeholder="e.g. House #12, Near Bus Stand, Main Market Road"
                  disabled={isSubmitting}
                  className={`w-full p-3 rounded-xl border text-sm text-stone-900 bg-stone-50/60 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium ${
                    errors.deliveryAddress ? 'border-red-500 bg-red-50/30' : 'border-stone-300 focus:border-amber-700'
                  }`}
                />
                {errors.deliveryAddress && <p className="text-xs text-red-600 font-bold">{errors.deliveryAddress}</p>}
              </div>

              {/* CITY */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  City / Town <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Lalganj"
                  disabled={isSubmitting}
                  className={`w-full p-2.5 rounded-xl border text-sm text-stone-900 bg-stone-50/60 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium ${
                    errors.city ? 'border-red-500 bg-red-50/30' : 'border-stone-300 focus:border-amber-700'
                  }`}
                />
                {errors.city && <p className="text-xs text-red-600 font-bold">{errors.city}</p>}
              </div>

              {/* STATE */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Uttar Pradesh"
                  disabled={isSubmitting}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50/60 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium"
                />
              </div>

              {/* PINCODE */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  PIN Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  placeholder="276202"
                  disabled={isSubmitting}
                  className={`w-full p-2.5 rounded-xl border text-sm text-stone-900 bg-stone-50/60 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium ${
                    errors.pincode ? 'border-red-500 bg-red-50/30' : 'border-stone-300 focus:border-amber-700'
                  }`}
                />
                {errors.pincode && <p className="text-xs text-red-600 font-bold">{errors.pincode}</p>}
              </div>

              {/* ORDER NOTES */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Order Notes <span className="text-stone-400 font-normal">(Optional delivery instructions)</span>
                </label>
                <input
                  type="text"
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleChange}
                  placeholder="e.g. Please deliver in afternoon"
                  disabled={isSubmitting}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50/60 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PAYMENT & ORDER OPTIONS */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Banknote className="w-5 h-5 text-amber-800" />
              <span>Select Order & Payment Option</span>
            </h2>

            <div className="space-y-3">
              {/* CASH ON DELIVERY OPTION */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                formData.paymentMethod === 'cod' ? 'border-amber-800 bg-amber-50/70 shadow-2xs' : 'border-stone-200 hover:border-stone-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="mt-1 text-amber-800 focus:ring-amber-700 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <span>Cash on Delivery (COD)</span>
                    <span className="bg-emerald-700 text-white text-[10px] font-black px-2 py-0.5 rounded">RECOMMENDED</span>
                  </span>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Pay cash when store order arrives at your address in Lalganj / Azamgarh.
                  </p>
                </div>
              </label>

              {/* WHATSAPP ORDER OPTION */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                formData.paymentMethod === 'whatsapp' ? 'border-emerald-600 bg-emerald-50/80 shadow-2xs' : 'border-stone-200 hover:border-stone-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="whatsapp"
                  checked={formData.paymentMethod === 'whatsapp'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="mt-1 text-emerald-600 focus:ring-emerald-600 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    <span>Order via WhatsApp Direct</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded">INSTANT</span>
                  </span>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Saves order to database and opens WhatsApp with complete order notification for shop owner.
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* RIGHT ORDER SUMMARY SIDEBAR */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-lg font-bold font-serif text-stone-900 pb-3 border-b border-stone-200">
              Ordered Products ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>

            {/* PRODUCT MINI LIST */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map(({ product, quantity }) => {
                const price = product.discount_price && product.discount_price > 0 ? product.discount_price : product.price;
                return (
                  <div key={product.id} className="flex items-center gap-3 text-xs">
                    <img
                      src={product.image_url || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80'}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stone-900 truncate">{product.name}</p>
                      <p className="text-stone-500">{quantity} × {formatCurrency(price)}</p>
                    </div>
                    <span className="font-extrabold text-stone-900">
                      {formatCurrency(price * quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* BREAKDOWN */}
            <div className="space-y-2 text-sm pt-4 border-t border-stone-200">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Charge</span>
                {deliveryCharge === 0 ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs">
                    FREE
                  </span>
                ) : (
                  <span className="font-bold text-stone-900">{formatCurrency(deliveryCharge)}</span>
                )}
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-base font-bold text-stone-900">Grand Total</span>
                <span className="text-2xl font-black text-stone-900">
                  {formatCurrency(cartGrandTotal)}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              {formData.paymentMethod === 'whatsapp' ? (
                <button
                  type="button"
                  onClick={(e) => handleSubmitOrder(e, 'whatsapp')}
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving & Opening WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5 text-white" />
                      <span>Order via WhatsApp Direct</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Placing & Confirming Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Confirm Cash on Delivery Order</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="text-[11px] text-stone-500 text-center space-y-1">
              <p className="flex items-center justify-center gap-1 font-medium text-stone-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Original products from Hafiz Ji Bartan Store, Lalganj</span>
              </p>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
