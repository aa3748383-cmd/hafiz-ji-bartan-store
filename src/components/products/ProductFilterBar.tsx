import React from 'react';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import type { Category, ProductFilters } from '../../types';

interface ProductFilterBarProps {
  categories: Category[];
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  onReset: () => void;
  totalResults: number;
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  categories,
  filters,
  onFilterChange,
  onReset,
  totalResults,
}) => {
  const hasActiveFilters = Boolean(
    filters.search || filters.categoryId || filters.availableOnly || filters.featuredOnly
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs mb-8 space-y-4">
      {/* TOP ROW: SEARCH BAR & SORT SELECT */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* SEARCH INPUT */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search stainless steel thali, pressure cooker, kadai..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-stone-300 focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 text-sm text-stone-900 bg-stone-50/60 transition-all outline-hidden font-medium"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* SORT & TOGGLES */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* AVAILABLE ONLY TOGGLE */}
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold text-stone-700 cursor-pointer hover:bg-stone-200/70 transition-colors select-none">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(e) => onFilterChange({ availableOnly: e.target.checked })}
              className="rounded text-amber-700 focus:ring-amber-700 w-4 h-4"
            />
            <span>In Stock Only</span>
          </label>

          {/* SORT BY */}
          <div className="relative inline-flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 absolute left-3 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="pl-8 pr-8 py-2 rounded-xl border border-stone-300 bg-stone-50/60 text-xs font-bold text-stone-800 focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 appearance-none cursor-pointer outline-hidden"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

        </div>

      </div>

      {/* BOTTOM ROW: CATEGORY PILLS */}
      <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-stone-500 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </span>

        {/* ALL CATEGORIES PILL */}
        <button
          onClick={() => onFilterChange({ categoryId: '' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            !filters.categoryId
              ? 'bg-amber-800 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          All Items
        </button>

        {/* DYNAMIC CATEGORY PILLS */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onFilterChange({ categoryId: cat.id })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filters.categoryId === cat.id
                ? 'bg-amber-800 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {cat.name}
          </button>
        ))}

        {/* RESET FILTERS LINK */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="ml-auto text-xs font-bold text-amber-800 hover:text-amber-900 underline underline-offset-2 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* RESULTS COUNT SUMMARY */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-1 font-medium">
        <span>Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'product' : 'products'}</span>
        {hasActiveFilters && <span className="text-amber-800 font-bold">Filters Active</span>}
      </div>
    </div>
  );
};

