import React from 'react';
import { PackageSearch, AlertTriangle, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  isError?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Products will be available soon.",
  description = "No items match your current selection or search term. Please try adjusting your filters.",
  onReset,
  isError = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-3xl border border-stone-200 shadow-xs max-w-lg mx-auto my-8">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
        isError ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
      }`}>
        {isError ? <AlertTriangle className="w-8 h-8" /> : <PackageSearch className="w-8 h-8" />}
      </div>
      
      <h3 className="text-xl font-bold font-serif text-stone-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-stone-600 mb-6 leading-relaxed max-w-sm">
        {description}
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Search & Filters</span>
        </button>
      )}
    </div>
  );
};
