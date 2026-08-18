import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductFilterBar } from '../components/products/ProductFilterBar';
import { ProductCard } from '../components/products/ProductCard';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { EnquiryModal } from '../components/products/EnquiryModal';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import type { Category, Product, ProductFilters } from '../types';
import { updateSEOMetadata } from '../utils/seo';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnquiryProduct, setSelectedEnquiryProduct] = useState<Product | null>(null);

  // Filter state
  const [filters, setFilters] = useState<ProductFilters>({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('category') || '',
    availableOnly: searchParams.get('available') === 'true',
    featuredOnly: searchParams.get('featured') === 'true',
    sortBy: (searchParams.get('sort') as any) || 'featured',
  });

  useEffect(() => {
    updateSEOMetadata({
      title: 'Product Catalogue',
      description: 'Explore complete catalogue of stainless steel bartan, aluminium vessels, pressure cookers, dinner sets, and kitchenware at Hafiz Ji Bartan Store in Lalganj Azamgarh.',
    });

    const loadCategories = async () => {
      const res = await getCategories();
      if (res.data) setCategories(res.data);
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      setError(null);
      
      const res = await getProducts(filters);
      if (res.error) {
        setError(res.error);
      } else {
        setProducts(res.data);
      }
      setLoading(false);
    };

    fetchProductsData();

    // Sync filters with URL query parameters
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.categoryId) params.category = filters.categoryId;
    if (filters.availableOnly) params.available = 'true';
    if (filters.featuredOnly) params.featured = 'true';
    if (filters.sortBy !== 'featured') params.sort = filters.sortBy;

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleFilterChange = (updated: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      availableOnly: false,
      featuredOnly: false,
      sortBy: 'featured',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-safe-action-bar">
      
      {/* PAGE HEADER */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
          Store Inventory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900">
          Product Catalogue
        </h1>
        <p className="text-stone-600 text-sm max-w-2xl">
          Browse authentic kitchenware, steel bartan, pressure cookers, and daily cooking items available at Hafiz Ji Bartan Store, Lalganj, Azamgarh.
        </p>
      </div>

      {/* FILTER BAR */}
      <ProductFilterBar
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={products.length}
      />

      {/* PRODUCT GRID / LOADING / EMPTY STATE */}
      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : error ? (
        <EmptyState
          isError
          title="Could not load products"
          description="There was a temporary issue fetching store items. Please try refreshing or clearing filters."
          onReset={handleResetFilters}
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="Products will be available soon."
          description={
            filters.search || filters.categoryId
              ? "No store items match your current search criteria. Try clearing search filters."
              : "Our store inventory is currently being updated. Please check back shortly or enquire via WhatsApp."
          }
          onReset={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}

      {/* ENQUIRY MODAL */}
      <EnquiryModal
        product={selectedEnquiryProduct}
        isOpen={Boolean(selectedEnquiryProduct)}
        onClose={() => setSelectedEnquiryProduct(null)}
      />

    </div>
  );
};

