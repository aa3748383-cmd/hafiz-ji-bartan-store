import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Layers, MessageCircle } from 'lucide-react';
import { getCategories } from '../services/categoryService';
import type { Category } from '../types';
import { CategoryCardSkeleton } from '../components/common/SkeletonLoader';
import { updateSEOMetadata } from '../utils/seo';
import { getWhatsAppLink } from '../utils/whatsapp';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    updateSEOMetadata({
      title: 'Product Categories',
      description: 'Explore kitchenware categories at Hafiz Ji Bartan Store: Steel Bartan, Aluminium Items, Pressure Cookers, Dinner Sets, and Kitchen Accessories in Lalganj Azamgarh.',
    });

    const loadData = async () => {
      setLoading(true);
      const res = await getCategories();
      if (res.data) setCategories(res.data);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-safe-action-bar">
      
      {/* PAGE HEADER */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          <span>Browse By Category</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900">
          Product Categories
        </h1>
        <p className="text-stone-600 text-sm max-w-2xl">
          Select a category below to explore specific kitchenware, utensils, pressure cookers, and daily cooking items at Hafiz Ji Bartan Store, Lalganj.
        </p>
      </div>

      {/* CATEGORIES GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group bg-white rounded-2xl border border-stone-200 p-5 hover:border-amber-400 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <Link to={`/products?category=${category.id}`} className="space-y-4">
                <div className="aspect-4/3 w-full bg-stone-100 rounded-xl overflow-hidden relative">
                  <img
                    src={category.image_url || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Store Category
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-lg group-hover:text-amber-800 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-stone-500 text-xs mt-1 leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>

              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                <Link
                  to={`/products?category=${category.id}`}
                  className="font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
                >
                  <span>View Items</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href={getWhatsAppLink(`Hello, I want to enquire about prices for ${category.name} items.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  title={`WhatsApp enquiry for ${category.name}`}
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

