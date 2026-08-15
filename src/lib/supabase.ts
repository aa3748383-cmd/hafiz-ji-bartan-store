import { createClient } from '@supabase/supabase-js';

export const getSupabaseUrl = (): string => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  return url.trim().replace(/^["']|["']$/g, '');
};

export const getSupabaseAnonKey = (): string => {
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return key.trim().replace(/^["']|["']$/g, '');
};

export const isSupabaseConfigured = (): boolean => {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) return false;

  const hasValidProtocol = url.startsWith('https://') || url.startsWith('http://');
  const isPlaceholderUrl = url.includes('your-supabase-project') || url.includes('placeholder-project') || url.includes('your-project');
  const isPlaceholderKey = key.includes('your-supabase-anon-key') || key.includes('placeholder-anon-key') || key.includes('your-anon');

  return hasValidProtocol && !isPlaceholderUrl && !isPlaceholderKey;
};

const supabaseUrl = isSupabaseConfigured() ? getSupabaseUrl() : 'https://placeholder-project.supabase.co';
const supabaseAnonKey = isSupabaseConfigured() ? getSupabaseAnonKey() : 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});


