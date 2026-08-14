import { supabase } from '../lib/supabase';

export const uploadProductImage = async (file: File): Promise<{ publicUrl: string | null; error: string | null }> => {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { publicUrl: data.publicUrl, error: null };
  } catch (err: any) {
    console.error('Error uploading product image:', err);
    return { publicUrl: null, error: err.message || 'Failed to upload image' };
  }
};

export const uploadCategoryImage = async (file: File): Promise<{ publicUrl: string | null; error: string | null }> => {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `categories/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { publicUrl: data.publicUrl, error: null };
  } catch (err: any) {
    console.error('Error uploading category image:', err);
    return { publicUrl: null, error: err.message || 'Failed to upload category image' };
  }
};
