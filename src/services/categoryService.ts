import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Category } from '../types';

// Fallback initial categories if Supabase table is empty or connecting for the first time
export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Steel Bartan', slug: 'steel-bartan', description: 'High quality stainless steel kitchenware, plates, bowls, and storage containers.', image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80' },
  { id: '2', name: 'Aluminium Items', slug: 'aluminium-items', description: 'Durable aluminium patili, kadais, and cooking vessels.', image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80' },
  { id: '3', name: 'Kitchen Utensils', slug: 'kitchen-utensils', description: 'Essential everyday kitchen tools, spoons, ladles, strainers, and chimta.', image_url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80' },
  { id: '4', name: 'Pressure Cookers', slug: 'pressure-cookers', description: 'Heavy base pressure cookers for fast and safe daily cooking.', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' },
  { id: '5', name: 'Dinner Sets', slug: 'dinner-sets', description: 'Complete family dinner sets in stainless steel, glass, and opalware.', image_url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80' },
  { id: '6', name: 'Glass & Cups', slug: 'glass-and-cups', description: 'Tea cups, water glasses, jug sets, and glass servingware.', image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' },
  { id: '7', name: 'Kitchen Accessories', slug: 'kitchen-accessories', description: 'Spice boxes, rotimaker, belan-chakla, gas stove stands, and containers.', image_url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80' },
  { id: '8', name: 'Other Household Items', slug: 'other-household-items', description: 'Buckets, tubs, cleaning accessories, and general household items.', image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80' },
];

const DEFAULT_TIMEOUT_MS = 4000;

const withTimeout = <T>(promiseLike: PromiseLike<T>, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Supabase category query timed out after ${timeoutMs}ms`));
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

export const getCategories = async (): Promise<{ data: Category[]; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: INITIAL_CATEGORIES, error: null };
  }

  try {
    const query = supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    const { data, error } = await withTimeout(query);

    if (error) throw error;
    
    // If database has no categories yet, return initial defaults
    if (!data || data.length === 0) {
      return { data: INITIAL_CATEGORIES, error: null };
    }

    return { data: data as Category[], error: null };
  } catch (err: any) {
    console.warn('Supabase categories query failed/timed out, using fallback:', err?.message || err);
    return { data: INITIAL_CATEGORIES, error: null };
  }
};

export const getCategoryBySlug = async (slug: string): Promise<{ data: Category | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    const found = INITIAL_CATEGORIES.find(c => c.slug === slug) || null;
    return { data: found, error: null };
  }

  try {
    const query = supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    const { data, error } = await withTimeout(query);

    if (error) throw error;
    return { data: data as Category, error: null };
  } catch (err: any) {
    console.warn('Supabase category slug query failed/timed out, using fallback:', err?.message || err);
    const fallback = INITIAL_CATEGORIES.find(c => c.slug === slug) || null;
    return { data: fallback, error: null };
  }
};

export const createCategory = async (categoryData: Partial<Category>): Promise<{ data: Category | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    return { data: data as Category, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to create category' };
  }
};

export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<{ data: Category | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Category, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to update category' };
  }
};

export const deleteCategory = async (id: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Check if category has associated products
    const { count, error: countErr } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id);

    if (countErr) throw countErr;

    if (count && count > 0) {
      return { success: false, error: `Cannot delete category. There are ${count} products assigned to this category.` };
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete category' };
  }
};
