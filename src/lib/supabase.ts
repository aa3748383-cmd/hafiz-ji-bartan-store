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

  const lowerUrl = url.toLowerCase();
  const lowerKey = key.toLowerCase();

  const isPlaceholderUrl = 
    lowerUrl.includes('placeholder') || 
    lowerUrl.includes('your-project') || 
    lowerUrl.includes('your-supabase') || 
    lowerUrl.includes('example.co');

  const isPlaceholderKey = 
    lowerKey.includes('placeholder') || 
    lowerKey.includes('your-actual') || 
    lowerKey.includes('your-anon');

  return !isPlaceholderUrl && !isPlaceholderKey && (url.startsWith('https://') || url.startsWith('http://'));
};

const supabaseUrl = getSupabaseUrl() || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = getSupabaseAnonKey() || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

