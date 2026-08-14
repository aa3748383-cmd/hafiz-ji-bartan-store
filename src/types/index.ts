export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  category_id: string;
  image_url?: string | null;
  is_featured: boolean;
  is_available: boolean;
  stock_quantity: number;
  created_at?: string;
  updated_at?: string;
  category?: Category;
}

export interface ProductFilters {
  search: string;
  categoryId: string;
  availableOnly: boolean;
  featuredOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

export interface BusinessInfo {
  name: string;
  owner: string;
  phone: string;
  formattedPhone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  fullAddress: string;
  whatsappNumber: string;
  googleMapsUrl: string;
}
