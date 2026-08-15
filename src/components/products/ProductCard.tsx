import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Eye, Tag, Check, XCircle, Sparkles } from 'lucide-react';
import type { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { getProductWhatsAppLink } from '../../utils/whatsapp';
import { DEFAULT_PRODUCT_IMAGE } from '../../lib/constants';

interface ProductCardProps {
  product: Product;
  onQuickEnquire?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imgSrc, setImgSrc] = useState(product.image_url || DEFAULT_PRODUCT_IMAGE);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(DEFAULT_PRODUCT_IMAGE);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 shadow-2xs hover:shadow-card-hover hover:border-amber-300 transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1">
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          onError={handleImageError}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* FEATURED BADGE */}
        {product.is_featured && (
          <div className="absolute top-3 left-3 gold-badge text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-stone-900" />
            <span>Featured</span>
          </div>
        )}

        {/* STOCK STATUS BADGE */}
        <div className="absolute top-3 right-3">
          {product.is_available ? (
            <span className="bg-emerald-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs shadow-xs flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>In Stock</span>
            </span>
          ) : (
            <span className="bg-stone-900/90 text-stone-300 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs shadow-xs flex items-center gap-1">
              <XCircle className="w-3 h-3 text-stone-400" />
              <span>Out of Stock</span>
            </span>
          )}
        </div>
      </div>

      {/* CONTENT CONTAINER */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* CATEGORY NAME */}
          {product.category && (
            <div className="flex items-center gap-1 text-xs text-amber-800 font-bold mb-1.5">
              <Tag className="w-3 h-3" />
              <span>{product.category.name}</span>
            </div>
          )}

          {/* PRODUCT NAME */}
          <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-amber-800 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* DESCRIPTION SNIPPET */}
          {product.description && (
            <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* PRICE & ACTIONS */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-stone-400 block font-medium -mb-0.5">Estimated Price</span>
            <span className="text-lg font-extrabold text-stone-900">
              {formatCurrency(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* VIEW DETAILS LINK */}
            <Link
              to={`/product/${product.slug}`}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 transition-colors"
              title="View Product Details"
            >
              <Eye className="w-4 h-4" />
            </Link>

            {/* WHATSAPP ENQUIRY BUTTON */}
            <a
              href={getProductWhatsAppLink(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Enquire</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

