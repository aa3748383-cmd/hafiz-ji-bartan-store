import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Zap, 
  ArrowLeft, 
  Tag, 
  Check, 
  XCircle, 
  Sparkles, 
  Store,
  Share2,
  ShieldCheck,
  Award,
  Plus,
  Minus,
  MessageCircle
} from 'lucide-react';
import { getProductBySlug, getProducts } from '../services/productService';
import type { Product } from '../types';
import { formatCurrency } from '../utils/formatters';
import { getProductWhatsAppLink } from '../utils/whatsapp';
import { DEFAULT_PRODUCT_IMAGE, BUSINESS_DETAILS } from '../lib/constants';
import { ProductCard } from '../components/products/ProductCard';
import { useToast } from '../contexts/ToastContext';
import { useCart } from '../contexts/CartContext';
import { updateSEOMetadata } from '../utils/seo';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Image gallery state
  const [activeImage, setActiveImage] = useState<string>(DEFAULT_PRODUCT_IMAGE);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  
  // Quantity selector state
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      setLoading(true);
      const res = await getProductBySlug(slug);
      
      if (res.data) {
        setProduct(res.data);
        const mainImg = res.data.image_url || DEFAULT_PRODUCT_IMAGE;
        setActiveImage(mainImg);
        
        // Build gallery array
        const list = res.data.images && res.data.images.length > 0 ? res.data.images : [mainImg];
        if (!list.includes(mainImg)) list.unshift(mainImg);
        setGalleryImages(list);
        setQuantity(1);
        
        updateSEOMetadata({
          title: res.data.name,
          description: res.data.description || `Buy ${res.data.name} online at Hafiz Ji Bartan Store in Lalganj Azamgarh UP.`,
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
        text: `Buy ${product?.name} at Hafiz Ji Bartan Store, Lalganj`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied!', 'Product URL copied to clipboard.', 'success');
    }
  };

  const handleQuantityChange = (delta: number) => {
    if (!product) return;
    const nextQty = quantity + delta;
    if (nextQty >= 1 && nextQty <= product.stock_quantity) {
      setQuantity(nextQty);
    } else if (nextQty > product.stock_quantity) {
      showToast('Stock Limit', `Only ${product.stock_quantity} units available in stock.`, 'info');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/checkout');
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
          <span>Back to Product Shop</span>
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discount_price && product.discount_price > 0 && product.discount_price < product.price;
  const activePrice = hasDiscount ? product.discount_price! : product.price;
  const originalPrice = product.price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - activePrice) / originalPrice) * 100) : 0;
  const inStock = product.is_available && product.stock_quantity > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-safe-action-bar">
      
      {/* BREADCRUMB & BACK LINK */}
      <div className="flex items-center justify-between">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-800 text-sm font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* MAIN PRODUCT DETAIL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT: IMAGE GALLERY SHOWCASE */}
        <div className="md:col-span-6 space-y-4">
          <div className="relative aspect-4/3 w-full rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-2xs">
            <img
              src={activeImage}
              alt={product.name}
              onError={() => setActiveImage(DEFAULT_PRODUCT_IMAGE)}
              className="w-full h-full object-cover"
            />
            {product.is_featured && (
              <div className="absolute top-4 left-4 gold-badge text-stone-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Item</span>
              </div>
            )}
            {hasDiscount && (
              <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-sm">
                SAVE {discountPercent}%
              </div>
            )}
          </div>

          {/* THUMBNAILS GALLERY */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                    activeImage === img ? 'border-amber-700 ring-2 ring-amber-300' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* STORE QUALITY PROMISE */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-2 text-xs font-bold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
              <span>Genuine Heavy Gauge Stainless Steel</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-2 text-xs font-bold text-amber-900">
              <Award className="w-4 h-4 text-amber-800 shrink-0" />
              <span>Authentic Store Guarantee</span>
            </div>
          </div>
        </div>

        {/* RIGHT: DETAILS & SHOPPING ACTIONS */}
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

              {inStock ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <Check className="w-3 h-3" />
                  <span>In Stock ({product.stock_quantity} available)</span>
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

            {/* PRICE & DISCOUNT */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-stone-900">
                {formatCurrency(activePrice)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-stone-400 line-through font-medium">
                  {formatCurrency(originalPrice)}
                </span>
              )}
              {hasDiscount && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                  You Save {formatCurrency(originalPrice - activePrice)}
                </span>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          {product.description && (
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Product Specifications & Description</h3>
              <p className="text-stone-700 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* QUANTITY SELECTOR & E-COMMERCE BUTTONS */}
          {inStock && (
            <div className="space-y-4 pt-2 border-t border-stone-200">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-stone-800">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2.5 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-50 text-stone-800 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock_quantity}
                    className="p-2.5 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-50 text-stone-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ACTION BUTTONS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="py-3.5 px-6 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-95 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-amber-400" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          )}

          {/* STORE VERIFICATION BADGE & WHATSAPP SECONDARY CTA */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-xs text-amber-950">
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-amber-800 shrink-0" />
              <div>
                <p className="font-bold">{BUSINESS_DETAILS.name} • Lalganj</p>
                <p className="text-amber-900 mt-0.5">Proprietor: <strong>{BUSINESS_DETAILS.owner}</strong></p>
              </div>
            </div>
            
            <a
              href={getProductWhatsAppLink(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>
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

    </div>
  );
};
