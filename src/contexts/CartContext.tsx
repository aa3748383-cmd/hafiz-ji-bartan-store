import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Product } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryCharge: number;
  cartGrandTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'hbsweb_cart_items_v1';
const FREE_DELIVERY_THRESHOLD = 999;
const STANDARD_DELIVERY_CHARGE = 50;

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    if (!product.is_available || product.stock_quantity <= 0) {
      showToast('Out of Stock', `"${product.name}" is currently unavailable.`, 'error');
      return;
    }

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > product.stock_quantity) {
          showToast('Stock Limit Reached', `Only ${product.stock_quantity} unit(s) of "${product.name}" available in stock.`, 'info');
          const updated = [...prevCart];
          updated[existingIndex].quantity = product.stock_quantity;
          return updated;
        }

        const updated = [...prevCart];
        updated[existingIndex].quantity = newQty;
        showToast('Cart Updated', `Updated quantity of "${product.name}" to ${newQty}.`, 'success');
        return updated;
      } else {
        if (quantity > product.stock_quantity) {
          showToast('Stock Limit Reached', `Only ${product.stock_quantity} unit(s) of "${product.name}" available in stock.`, 'info');
          showToast('Item Added', `Added ${product.stock_quantity} unit(s) of "${product.name}" to your cart.`, 'success');
          return [...prevCart, { product, quantity: product.stock_quantity }];
        }
        showToast('Added to Cart', `"${product.name}" has been added to your shopping cart.`, 'success');
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.product.id === productId);
      if (item) {
        showToast('Item Removed', `"${item.product.name}" removed from cart.`, 'info');
      }
      return prevCart.filter(i => i.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock_quantity) {
            showToast('Stock Limit', `Only ${item.product.stock_quantity} available in stock.`, 'info');
            return { ...item, quantity: item.product.stock_quantity };
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cart.reduce((total, item) => {
    const activePrice = item.product.discount_price && item.product.discount_price > 0
      ? item.product.discount_price
      : item.product.price;
    return total + activePrice * item.quantity;
  }, 0);

  const deliveryCharge = cartSubtotal === 0 || cartSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_CHARGE;

  const cartGrandTotal = cartSubtotal + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryCharge,
        cartGrandTotal,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
