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
  discount_price?: number | null;
  category_id: string;
  image_url?: string | null;
  images?: string[] | null;
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

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'whatsapp' | 'online';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  delivery_address: string;
  city: string;
  state: string;
  pincode: string;
  order_notes?: string | null;
  subtotal: number;
  delivery_charge: number;
  grand_total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  city: string;
  state: string;
  pincode: string;
  orderNotes: string;
  paymentMethod: PaymentMethod;
}

export interface OrderFilters {
  status?: OrderStatus | 'all';
  search?: string;
  dateRange?: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
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
