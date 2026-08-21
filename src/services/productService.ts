import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Product, ProductFilters } from '../types';

export const INITIAL_DEMO_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Premium Heavy Stainless Steel Thali Set (6 Pcs)',
    slug: 'demo-steel-thali-set',
    description: 'High-grade 100% heavy stainless steel thali set containing 1 large thali, 4 curry bowls, 1 glass, and 1 spoon. Mirror polished, durable, and dishwasher safe.',
    price: 599,
    discount_price: 450,
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80'
    ],
    is_featured: true,
    is_available: true,
    stock_quantity: 25,
    category: { id: '1', name: 'Steel Bartan', slug: 'steel-bartan' }
  },
  {
    id: 'p2',
    name: 'Heavy Gauge Stainless Steel Dabba Container Set (3 Pcs)',
    slug: 'demo-steel-dabba-set',
    description: 'Set of 3 airtight heavy gauge stainless steel storage containers with see-through glass lids. Ideal for kitchen groceries, pulses, and dry fruits.',
    price: 750,
    discount_price: 550,
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80'
    ],
    is_featured: false,
    is_available: true,
    stock_quantity: 18,
    category: { id: '1', name: 'Steel Bartan', slug: 'steel-bartan' }
  },
  {
    id: 'p3',
    name: '5-Litre Outer Lid Heavy Aluminium Pressure Cooker',
    slug: 'demo-5l-pressure-cooker',
    description: 'Durable ISI certified 5-Litre pressure cooker with heavy induction bottom, heat-resistant bakelite handle, and high-safety release valve.',
    price: 1599,
    discount_price: 1250,
    category_id: '4',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
    ],
    is_featured: true,
    is_available: true,
    stock_quantity: 10,
    category: { id: '4', name: 'Pressure Cookers', slug: 'pressure-cookers' }
  },
  {
    id: 'p4',
    name: 'Stainless Steel Spoon & Serving Ladle Set (6 Pcs)',
    slug: 'demo-spoon-ladle-set',
    description: 'Mirror-finish stainless steel serving ladles, rice spoons, dal karchhi, and frying skimmer set with ergonomic comfortable handles.',
    price: 350,
    discount_price: 280,
    category_id: '3',
    image_url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80'
    ],
    is_featured: false,
    is_available: true,
    stock_quantity: 30,
    category: { id: '3', name: 'Kitchen Utensils', slug: 'kitchen-utensils' }
  },
  {
    id: 'p5',
    name: 'Heavy Base Aluminium Deep Kadai (3 Litre)',
    slug: 'demo-heavy-aluminium-kadai',
    description: 'Extra thick heavy base pure aluminium deep kadai ideal for deep frying, rich curries, and large volume household festival cooking.',
    price: 650,
    discount_price: 480,
    category_id: '2',
    image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'
    ],
    is_featured: true,
    is_available: true,
    stock_quantity: 15,
    category: { id: '2', name: 'Aluminium Items', slug: 'aluminium-items' }
  }
];

const DEFAULT_TIMEOUT_MS = 4000;

const withTimeout = <T>(promiseLike: PromiseLike<T>, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Supabase query timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    Promise.resolve(promiseLike)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

export const getProducts = async (filters?: Partial<ProductFilters>): Promise<{ data: Product[]; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    let result = [...INITIAL_DEMO_PRODUCTS];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }
    if (filters?.categoryId) {
      result = result.filter(p => p.category_id === filters.categoryId);
    }
    if (filters?.availableOnly) {
      result = result.filter(p => p.is_available);
    }
    if (filters?.featuredOnly) {
      result = result.filter(p => p.is_featured);
    }

    if (filters?.sortBy === 'price-asc') {
      result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
    } else if (filters?.sortBy === 'price-desc') {
      result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
    } else if (filters?.sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return { data: result, error: null };
  }

  try {
    let query = supabase
      .from('products')
      .select('*, category:categories(*)');

    if (filters?.search && filters.search.trim() !== '') {
      query = query.ilike('name', `%${filters.search.trim()}%`);
    }

    if (filters?.categoryId && filters.categoryId.trim() !== '') {
      query = query.eq('category_id', filters.categoryId);
    }

    if (filters?.availableOnly) {
      query = query.eq('is_available', true);
    }

    if (filters?.featuredOnly) {
      query = query.eq('is_featured', true);
    }

    // Sorting
    switch (filters?.sortBy) {
      case 'price-asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false });
        break;
      case 'name-asc':
        query = query.order('name', { ascending: true });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        break;
    }

    const { data, error } = await withTimeout(query);

    if (error) {
      console.error('[Supabase getProducts Error]:', error);
      throw error;
    }

    return { data: (data as Product[]) || [], error: null };
  } catch (err: any) {
    console.error('[Supabase getProducts Exception]:', err?.message || err);
    if (!isSupabaseConfigured()) {
      return { data: INITIAL_DEMO_PRODUCTS, error: null };
    }
    return { data: [], error: err?.message || 'Failed to fetch products' };
  }
};

export const getProductBySlug = async (slug: string): Promise<{ data: Product | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    const found = INITIAL_DEMO_PRODUCTS.find(p => p.slug === slug) || null;
    return { data: found, error: null };
  }

  try {
    const query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .single();

    const { data, error } = await withTimeout(query);

    if (error) throw error;
    return { data: data as Product, error: null };
  } catch (err: any) {
    console.error('[Supabase getProductBySlug Error]:', err?.message || err);
    if (!isSupabaseConfigured()) {
      const fallback = INITIAL_DEMO_PRODUCTS.find(p => p.slug === slug) || null;
      return { data: fallback, error: null };
    }
    return { data: null, error: err?.message || 'Product not found' };
  }
};

export const getFeaturedProducts = async (_limit: number = 6): Promise<{ data: Product[]; error: string | null }> => {
  return getProducts({ featuredOnly: true, availableOnly: true });
};

export const createProduct = async (productData: Partial<Product>): Promise<{ data: Product | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;
    return { data: data as Product, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to create product' };
  }
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<{ data: Product | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;
    return { data: data as Product, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to update product' };
  }
};

export const deleteProduct = async (id: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete product' };
  }
};
