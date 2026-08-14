import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-4 animate-pulse shadow-xs">
      <div className="w-full h-48 bg-stone-200 rounded-xl"></div>
      <div className="space-y-2">
        <div className="h-4 bg-stone-200 rounded w-1/3"></div>
        <div className="h-5 bg-stone-300 rounded w-3/4"></div>
        <div className="h-4 bg-stone-200 rounded w-full"></div>
      </div>
      <div className="pt-2 flex justify-between items-center border-t border-stone-100">
        <div className="h-6 bg-stone-300 rounded w-1/4"></div>
        <div className="h-9 bg-stone-200 rounded-xl w-1/3"></div>
      </div>
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 animate-pulse shadow-xs">
      <div className="w-full h-36 bg-stone-200 rounded-xl"></div>
      <div className="h-5 bg-stone-300 rounded w-1/2 mx-auto"></div>
      <div className="h-3 bg-stone-200 rounded w-3/4 mx-auto"></div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
