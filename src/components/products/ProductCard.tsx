import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Tag, Check, XCircle, Sparkles } from 'lucide-react';
import type { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { DEFAULT_PRODUCT_IMAGE } from '../../lib/constants';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [imgSrc, setImgSrc] = useState(product.image_url || DEFAULT_PRODUCT_IMAGE);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(DEFAULT_PRODUCT_IMAGE);
    }
  };

  const hasDiscount = product.discount_price && product.discount_price > 0 && product.discount_price < product.price;
  const activePrice = hasDiscount ? product.discount_price! : product.price;
  const originalPrice = product.price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - activePrice) / originalPrice) * 100) : 0;
  const inStock = product.is_available && product.stock_quantity > 0;

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 shadow-2xs hover:shadow-card-hover hover:border-amber-300 transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1">
      
      {/* IMAGE CONTAINER - CLICKABLE TO OPEN DETAILS PAGE */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={imgSrc}
            alt={product.name}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        
        {/* BADGES */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.is_featured && (
            <div className="gold-badge text-stone-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-stone-900" />
              <span>Featured</span>
            </div>
          )}
          {hasDiscount && (
            <div className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs tracking-wider">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* STOCK STATUS BADGE */}
        <div className="absolute top-3 right-3">
          {inStock ? (
            <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>In Stock</span>
            </span>
          ) : (
            <span className="bg-stone-900/90 text-stone-300 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs flex items-center gap-1">
              <XCircle className="w-3 h-3 text-stone-400" />
              <span>Out of Stock</span>
            </span>
          )}
        </div>
      </div>

      {/* CONTENT CONTAINER */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* CATEGORY NAME */}
          {product.category && (
            <div className="flex items-center gap-1 text-[11px] text-amber-800 font-bold mb-1">
              <Tag className="w-3 h-3" />
              <span>{product.category.name}</span>
            </div>
          )}

          {/* PRODUCT NAME - CLICKABLE */}
          <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-amber-800 transition-colors line-clamp-2">
            <Link to={`/product/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          {/* DESCRIPTION SNIPPET */}
          {product.description && (
            <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* PRICE & ADD TO CART CTA */}
        <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* PRICE DISPLAY */}
          <div>
            <span className="text-[10px] text-stone-400 block font-semibold uppercase -mb-0.5">Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-stone-900">
                {formatCurrency(activePrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-stone-400 line-through font-medium">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Link
              to={`/product/${product.slug}`}
              className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 transition-colors"
              title="View Product Details"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              onClick={() => addToCart(product)}
              disabled={!inStock}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                inStock
                  ? 'bg-amber-800 hover:bg-amber-900 text-white cursor-pointer transform active:scale-95'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
              title={inStock ? 'Add to Cart' : 'Out of Stock'}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
