import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Product, ProductFilters } from '../types';

export const INITIAL_DEMO_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '[Demo] Premium Stainless Steel Thali Set',
    slug: 'demo-steel-thali-set',
    description: 'High-grade heavy stainless steel thali with 4 bowls, glass, and spoon for family meals.',
    price: 450,
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
    is_featured: true,
    is_available: true,
    stock_quantity: 25,
    category: { id: '1', name: 'Steel Bartan', slug: 'steel-bartan' }
  },
  {
    id: 'p2',
    name: '[Demo] Heavy Gauge Stainless Steel Dabba Container Set',
    slug: 'demo-steel-dabba-set',
    description: 'Set of 3 airtight stainless steel storage containers for kitchen groceries and grains.',
    price: 550,
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    is_featured: false,
    is_available: true,
    stock_quantity: 18,
    category: { id: '1', name: 'Steel Bartan', slug: 'steel-bartan' }
  },
  {
    id: 'p3',
    name: '[Demo] 5-Litre Outer Lid Aluminium Pressure Cooker',
    slug: 'demo-5l-pressure-cooker',
    description: 'Durable 5-Litre pressure cooker with heat-resistant handle and safety valve for daily cooking.',
    price: 1250,
    category_id: '4',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    is_featured: true,
    is_available: true,
    stock_quantity: 10,
    category: { id: '4', name: 'Pressure Cookers', slug: 'pressure-cookers' }
  },
  {
    id: 'p4',
    name: '[Demo] Stainless Steel Spoon & Ladle Set (6 Pcs)',
    slug: 'demo-spoon-ladle-set',
    description: 'Mirror-finish stainless steel serving ladles, rice spoons, and skimmer set.',
    price: 280,
    category_id: '3',
    image_url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80',
    is_featured: false,
    is_available: true,
    stock_quantity: 30,
    category: { id: '3', name: 'Kitchen Utensils', slug: 'kitchen-utensils' }
  },
  {
    id: 'p5',
    name: '[Demo] Heavy Base Aluminium Kadai (3 Litre)',
    slug: 'demo-heavy-aluminium-kadai',
    description: 'Thick aluminium kadai ideal for frying, curry, and large volume household cooking.',
    price: 480,
    category_id: '2',
    image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
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

    if (error) throw error;
    
    if (!data || data.length === 0) {
      // If db returns empty results without search, return demo data fallback
      if (!filters?.search && !filters?.categoryId) {
        return { data: INITIAL_DEMO_PRODUCTS, error: null };
      }
      return { data: [], error: null };
    }

    return { data: data as Product[], error: null };
  } catch (err: any) {
    console.warn('Supabase query failed/timed out, using demo products fallback:', err?.message || err);
    return { data: INITIAL_DEMO_PRODUCTS, error: null };
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
    console.warn('Supabase product slug query failed/timed out, using fallback:', err?.message || err);
    const fallback = INITIAL_DEMO_PRODUCTS.find(p => p.slug === slug) || null;
    return { data: fallback, error: null };
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
