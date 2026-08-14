import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MessageCircle, 
  Phone, 
  ArrowLeft, 
  Tag, 
  Check, 
  XCircle, 
  Sparkles, 
  Store,
  Share2,
  ShieldCheck,
  Award
} from 'lucide-react';
import { getProductBySlug, getProducts } from '../services/productService';
import type { Product } from '../types';
import { formatCurrency } from '../utils/formatters';
import { getProductWhatsAppLink, getPhoneCallLink } from '../utils/whatsapp';
import { DEFAULT_PRODUCT_IMAGE, BUSINESS_DETAILS } from '../lib/constants';
import { ProductCard } from '../components/products/ProductCard';
import { EnquiryModal } from '../components/products/EnquiryModal';
import { useToast } from '../contexts/ToastContext';
import { updateSEOMetadata } from '../utils/seo';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(DEFAULT_PRODUCT_IMAGE);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      setLoading(true);
      const res = await getProductBySlug(slug);
      
      if (res.data) {
        setProduct(res.data);
        setImgSrc(res.data.image_url || DEFAULT_PRODUCT_IMAGE);
        
        updateSEOMetadata({
          title: res.data.name,
          description: res.data.description || `Enquire about ${res.data.name} at Hafiz Ji Bartan Store in Lalganj Azamgarh UP.`,
        });

        // Fetch related products in same category
        if (res.data.category_id) {
          const relRes = await getProducts({ categoryId: res.data.category_id });
          if (relRes.data) {
            setRelatedProducts(relRes.data.filter(p => p.id !== res.data?.id).slice(0, 3));
          }
        }
      }
      setLoading(false);
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || BUSINESS_DETAILS.name,
        text: `Check out ${product?.name} at Hafiz Ji Bartan Store, Lalganj`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied!', 'Product URL copied to clipboard.', 'success');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-safe-action-bar space-y-8">
        <div className="h-6 w-32 bg-stone-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-stone-200 rounded-3xl animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-8 bg-stone-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-stone-300 rounded w-1/3 animate-pulse"></div>
            <div className="h-24 bg-stone-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4 pb-safe-action-bar">
        <h2 className="text-2xl font-bold font-serif text-stone-900">Product Not Found</h2>
        <p className="text-stone-600 text-sm">The product item you are looking for is unavailable or has been removed.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-800 text-white text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalogue</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-safe-action-bar">
      
      {/* BREADCRUMB & BACK LINK */}
      <div className="flex items-center justify-between">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-800 text-sm font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Product</span>
        </button>
      </div>

      {/* MAIN PRODUCT DETAIL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT: IMAGE SHOWCASE */}
        <div className="md:col-span-6 space-y-4">
          <div className="relative aspect-4/3 w-full rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-2xs">
            <img
              src={imgSrc}
              alt={product.name}
              onError={() => setImgSrc(DEFAULT_PRODUCT_IMAGE)}
              className="w-full h-full object-cover"
            />
            {product.is_featured && (
              <div className="absolute top-4 left-4 gold-badge text-stone-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Store Item</span>
              </div>
            )}
          </div>

          {/* ITEM QUALITY PROMISE */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-2 text-xs font-bold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
              <span>Genuine Gauge & Weight</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-2 text-xs font-bold text-amber-900">
              <Award className="w-4 h-4 text-amber-800 shrink-0" />
              <span>Original Store Warranty</span>
            </div>
          </div>
        </div>

        {/* RIGHT: DETAILS & ACTIONS */}
        <div className="md:col-span-6 space-y-6">
          
          <div>
            {/* CATEGORY & STOCK STATUS */}
            <div className="flex items-center justify-between gap-2 mb-2">
              {product.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold">
                  <Tag className="w-3 h-3" />
                  <span>{product.category.name}</span>
                </span>
              )}

              {product.is_available ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <Check className="w-3 h-3" />
                  <span>In Stock at Lalganj Store</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-bold">
                  <XCircle className="w-3 h-3" />
                  <span>Currently Out of Stock</span>
                </span>
              )}
            </div>

            {/* TITLE */}
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* PRICE */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-stone-900">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs text-stone-500 font-bold">Store retail estimate</span>
            </div>
          </div>

          {/* DESCRIPTION */}
          {product.description && (
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Product Description</h3>
              <p className="text-stone-700 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* STORE VERIFICATION BADGE */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-xs text-amber-950">
            <Store className="w-5 h-5 text-amber-800 shrink-0" />
            <div>
              <p className="font-bold">{BUSINESS_DETAILS.name} • Lalganj, Azamgarh</p>
              <p className="text-amber-900 mt-0.5">Visit store or WhatsApp proprietor <strong>{BUSINESS_DETAILS.owner}</strong> for exact price quotes and size options.</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-3 pt-2">
            
            {/* WHATSAPP CTA */}
            <a
              href={getProductWhatsAppLink(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Enquire on WhatsApp</span>
            </a>

            <div className="grid grid-cols-2 gap-3">
              {/* CUSTOM ENQUIRY MODAL TRIGGER */}
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Add to Enquiry</span>
              </button>

              {/* CALL CTA */}
              <a
                href={getPhoneCallLink()}
                className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call Store ({BUSINESS_DETAILS.phone})</span>
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-stone-200 space-y-6">
          <h2 className="text-xl font-bold font-serif text-stone-900">
            More Items in {product.category?.name || 'Utensils'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* ENQUIRY MODAL */}
      <EnquiryModal
        product={product}
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />

    </div>
  );
};

