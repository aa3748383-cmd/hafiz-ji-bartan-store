import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  if (!rawUrl || !rawKey) return false;

  const lowerUrl = rawUrl.toLowerCase();
  const lowerKey = rawKey.toLowerCase();

  const isPlaceholderUrl = 
    lowerUrl.includes('placeholder') || 
    lowerUrl.includes('your-project') || 
    lowerUrl.includes('your-supabase') || 
    lowerUrl.includes('example.co');

  const isPlaceholderKey = 
    lowerKey.includes('placeholder') || 
    lowerKey.includes('your-actual') || 
    lowerKey.includes('your-anon');

  return !isPlaceholderUrl && !isPlaceholderKey && (rawUrl.startsWith('https://') || rawUrl.startsWith('http://'));
};

const supabaseUrl = isSupabaseConfigured() ? rawUrl : 'https://placeholder-project.supabase.co';
const supabaseAnonKey = isSupabaseConfigured() ? rawKey : 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
