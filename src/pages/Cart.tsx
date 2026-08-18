import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Tag
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatters';
import { updateSEOMetadata } from '../utils/seo';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartSubtotal, 
    deliveryCharge, 
    cartGrandTotal 
  } = useCart();

  useEffect(() => {
    updateSEOMetadata({
      title: 'Shopping Cart',
      description: 'Review your selected utensils, pressure cookers, and kitchenware items in your shopping cart at Hafiz Ji Bartan Store.',
    });
    window.scrollTo(0, 0);
  }, []);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 pb-safe-action-bar">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-800">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">Your Shopping Cart is Empty</h1>
          <p className="text-stone-600 text-sm max-w-md mx-auto">
            Looks like you haven't added any kitchenware items to your cart yet. Explore our genuine steel bartan and kitchen items collection.
          </p>
        </div>
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Product Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-safe-action-bar">
      
      {/* HEADER & TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Shopping Cart
          </span>
          <h1 className="text-3xl font-bold font-serif text-stone-900">
            Your Selected Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearCart}
            className="text-xs font-bold text-stone-500 hover:text-red-700 underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>

      {/* MAIN CART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* CART ITEMS LIST */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(({ product, quantity }) => {
            const hasDiscount = product.discount_price && product.discount_price > 0 && product.discount_price < product.price;
            const activePrice = hasDiscount ? product.discount_price! : product.price;
            const itemTotal = activePrice * quantity;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:border-amber-300 transition-colors"
              >
                {/* PRODUCT THUMBNAIL & INFO */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                    <img
                      src={product.image_url || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 flex-1">
                    {product.category && (
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                        {product.category.name}
                      </span>
                    )}
                    <Link
                      to={`/product/${product.slug}`}
                      className="font-bold text-stone-900 text-base hover:text-amber-800 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-extrabold text-stone-900">
                        {formatCurrency(activePrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-stone-400 line-through">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* QUANTITY & ITEM TOTAL */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  {/* QUANTITY CONTROL */}
                  <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-2 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                      title="Decrease Quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-2 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                      title="Increase Quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* ITEM TOTAL */}
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block font-medium">Subtotal</span>
                    <span className="text-base font-extrabold text-stone-900">
                      {formatCurrency(itemTotal)}
                    </span>
                  </div>

                  {/* REMOVE BUTTON */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY SIDEBAR */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold font-serif text-stone-900 pb-3 border-b border-stone-200">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-stone-900">{formatCurrency(cartSubtotal)}</span>
              </div>

              <div className="flex justify-between text-stone-600 items-center">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-stone-500" />
                  <span>Delivery Charge</span>
                </span>
                {deliveryCharge === 0 ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs">
                    FREE Delivery
                  </span>
                ) : (
                  <span className="font-bold text-stone-900">{formatCurrency(deliveryCharge)}</span>
                )}
              </div>

              {cartSubtotal < 999 && (
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg font-medium border border-amber-200">
                  Add <strong>{formatCurrency(999 - cartSubtotal)}</strong> more to get FREE delivery!
                </p>
              )}

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-base font-bold text-stone-900">Grand Total</span>
                <span className="text-2xl font-black text-stone-900">
                  {formatCurrency(cartGrandTotal)}
                </span>
              </div>
            </div>

            {/* CHECKOUT BUTTON */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 px-6 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-95 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* GUARANTEE BADGES */}
            <div className="pt-2 space-y-2 border-t border-stone-100 text-xs text-stone-500 font-medium">
              <div className="flex items-center gap-2 text-stone-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cash on Delivery Available</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Tag className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Original Quality from Lalganj Store</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
