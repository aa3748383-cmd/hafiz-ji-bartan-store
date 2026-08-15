import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  MessageCircle, 
  Phone, 
  Navigation, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle, 
  Utensils, 
  MapPin, 
  Sparkles,
  ArrowRight,
  Gift,
  Clock
} from 'lucide-react';
import { BUSINESS_DETAILS } from '../lib/constants';
import { getWhatsAppLink, getPhoneCallLink, getDirectionsLink } from '../utils/whatsapp';
import { getCategories } from '../services/categoryService';
import { getFeaturedProducts } from '../services/productService';
import type { Category, Product } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';
import { EnquiryModal } from '../components/products/EnquiryModal';
import { updateSEOMetadata } from '../utils/seo';

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiryProduct, setSelectedEnquiryProduct] = useState<Product | null>(null);

  useEffect(() => {
    updateSEOMetadata({
      title: 'Home',
      description: `Welcome to ${BUSINESS_DETAILS.name} owned by ${BUSINESS_DETAILS.owner} in Lalganj, Azamgarh. Quality stainless steel bartan, pressure cookers, aluminium cookware & kitchenware.`,
    });

    const fetchData = async () => {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        getCategories(),
        getFeaturedProducts(6)
      ]);

      if (catRes.data) setCategories(catRes.data.slice(0, 8));
      if (prodRes.data) setFeaturedProducts(prodRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-safe-action-bar">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden hero-gradient pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* HERO TEXT CONTENT */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Authentic Kitchenware Store in Lalganj</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-stone-900 tracking-tight leading-tight">
                Quality Steel Bartan & Kitchenware For Every Indian Home
              </h1>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Explore heavy stainless steel utensils, durable aluminium cookware, brand pressure cookers, and complete dinner sets at <strong className="text-stone-900 font-semibold">{BUSINESS_DETAILS.name}</strong>. Personally managed by <strong className="text-stone-900 font-semibold">{BUSINESS_DETAILS.owner}</strong>.
              </p>

              {/* HERO CTA BUTTONS */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                {/* PRIMARY CTA */}
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-md shadow-amber-900/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <ShoppingBag className="w-4.5 h-4.5" />
                  <span>View Full Inventory</span>
                </Link>

                {/* SECONDARY CTA */}
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                  <span>WhatsApp Enquiry</span>
                </a>

                {/* ADDITIONAL CTA */}
                <a
                  href={getPhoneCallLink()}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Phone className="w-4.5 h-4.5" />
                  <span>Call Owner</span>
                </a>
              </div>

              {/* QUICK STORE STATS / HIGHLIGHTS */}
              <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center">
                <div className="bg-white/70 p-3 rounded-2xl border border-stone-200/60 shadow-2xs">
                  <span className="text-lg sm:text-xl font-bold font-serif text-stone-900 block">100%</span>
                  <span className="text-[11px] text-stone-500 font-semibold">Heavy Gauge Quality</span>
                </div>
                <div className="bg-white/70 p-3 rounded-2xl border border-stone-200/60 shadow-2xs">
                  <span className="text-lg sm:text-xl font-bold font-serif text-stone-900 block">Lalganj</span>
                  <span className="text-[11px] text-stone-500 font-semibold">Main Road Shop</span>
                </div>
                <div className="bg-white/70 p-3 rounded-2xl border border-stone-200/60 shadow-2xs">
                  <span className="text-lg sm:text-xl font-bold font-serif text-stone-900 block">Direct</span>
                  <span className="text-[11px] text-stone-500 font-semibold">Owner Quotes</span>
                </div>
              </div>
            </div>

            {/* HERO IMAGE SHOWCASE */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1.5 rounded-3xl copper-gradient opacity-25 blur-lg"></div>
                <div className="relative bg-white rounded-3xl p-4 shadow-xl border border-stone-200/80 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80"
                    alt="Hafiz Ji Bartan Store Stainless Steel Utensils"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                  />
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-card text-stone-900 shadow-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Hafiz Ji Bartan Store</p>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">Lalganj</span>
                    </div>
                    <p className="text-sm font-bold mt-1">Steel Bartan • Cookers • Dinner Sets</p>
                    <p className="text-xs text-stone-600 mt-0.5">Proprietor: {BUSINESS_DETAILS.owner} ({BUSINESS_DETAILS.phone})</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SPECIAL ANNOUNCEMENT / WEDDING GIFT SET BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="copper-gradient rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Gift className="w-3.5 h-3.5" />
              <span>Special Wedding & Gift Packages</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-serif">
              Complete Bartan Sets for Weddings & Special Occasions
            </h3>
            <p className="text-amber-100 text-sm max-w-xl">
              Get customized 51-piece, 71-piece, and 101-piece stainless steel dinner and kitchenware sets at special shop prices.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 z-10 shrink-0">
            <a
              href={getWhatsAppLink('Hello, I want to inquire about Wedding Bartan Sets and pricing.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-white text-amber-950 font-bold text-xs shadow-md hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Get Wedding Set Quote</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Explore Our Store Catalogue
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Product Categories
            </h2>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1 text-sm font-bold text-amber-800 hover:text-amber-900 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* CATEGORY GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group bg-white rounded-2xl border border-stone-200 p-4 hover:border-amber-400 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-4/3 w-full bg-stone-100 rounded-xl overflow-hidden mb-3">
                <img
                  src={category.image_url || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'}
                  alt={category.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-sm sm:text-base group-hover:text-amber-800 transition-colors">
                  {category.name}
                </h3>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Handpicked Items
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm font-bold text-amber-800 hover:text-amber-900 transition-colors"
          >
            <span>Browse Full Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickEnquire={(p) => setSelectedEnquiryProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="bg-stone-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Your Local Bartan Store
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">
              Why Customers Trust Hafiz Ji Bartan Store
            </h2>
            <p className="text-stone-400 text-sm">
              Providing genuine cookware, steel bartan, and household kitchen items directly to families in Lalganj and Azamgarh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white">Authentic Material Quality</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Heavy gauge stainless steel and high grade aluminium utensils built for long-term daily kitchen use.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white">Wide Variety of Utensils</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                From daily cooking patili and pressure cookers to complete dinner thali sets and glass accessories.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white">Direct Owner Service</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Personalized service directly by shop owner Akhlaq Ahmad at Main Road, Lalganj, Azamgarh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LOCATION & CONTACT CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 lg:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
              Visit Our Shop In Person
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Locate Hafiz Ji Bartan Store in Lalganj
            </h2>
            <div className="space-y-2 text-stone-700 text-sm">
              <p className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <span><strong>Address:</strong> {BUSINESS_DETAILS.fullAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-800 shrink-0" />
                <span><strong>Proprietor:</strong> {BUSINESS_DETAILS.owner} ({BUSINESS_DETAILS.formattedPhone})</span>
              </p>
              <div className="flex items-start gap-2 text-stone-600">
                <Clock className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p><strong>Shop Timing:</strong> Mon - Fri (9:00 AM - 9:00 PM)</p>
                  <p className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                    Saturday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <a
                href={getDirectionsLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-sm transition-all"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>Get Google Maps Directions</span>
              </a>

              <a
                href={getPhoneCallLink()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-sm border border-stone-300 transition-all"
              >
                <Phone className="w-4 h-4 text-amber-800" />
                <span>Call Store ({BUSINESS_DETAILS.phone})</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 bg-stone-50 rounded-2xl p-6 border border-stone-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-lg">Have a Query About Bartan Prices?</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Send us a direct WhatsApp message to check stock availability, sizes, or custom sets.
            </p>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>
      </section>

      {/* ENQUIRY MODAL */}
      <EnquiryModal
        product={selectedEnquiryProduct}
        isOpen={Boolean(selectedEnquiryProduct)}
        onClose={() => setSelectedEnquiryProduct(null)}
      />

    </div>
  );
};

