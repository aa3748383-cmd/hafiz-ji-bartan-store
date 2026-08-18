import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, Truck, MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../../utils/whatsapp';
import { useCart } from '../../contexts/CartContext';

export const MobileActionBar: React.FC = () => {
  const location = useLocation();
  const { cartCount } = useCart();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-xl px-3 py-2">
      <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
        
        {/* SHOP CTA */}
        <Link
          to="/products"
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors active:scale-95 ${
            isActive('/products') ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Shop</span>
        </Link>

        {/* CART CTA WITH BADGE */}
        <Link
          to="/cart"
          className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors active:scale-95 ${
            isActive('/cart') ? 'bg-amber-800 text-white font-bold' : 'bg-amber-50 text-amber-900 border border-amber-200'
          }`}
        >
          <ShoppingCart className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 right-2 bg-amber-400 text-stone-950 text-[10px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          )}
        </Link>

        {/* TRACK ORDER CTA */}
        <Link
          to="/track-order"
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors active:scale-95 ${
            isActive('/track-order') ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Truck className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Track</span>
        </Link>

        {/* WHATSAPP CTA */}
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors active:scale-95 shadow-2xs"
        >
          <MessageCircle className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-tight uppercase">Chat</span>
        </a>

      </div>
    </div>
  );
};
