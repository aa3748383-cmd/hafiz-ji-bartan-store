import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      setUser(activeSession?.user ?? null);
      setLoading(false);
    }).catch(err => {
      console.error('Session retrieval error:', err);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const login = async (email: string, pass: string): Promise<{ error: string | null }> => {
    if (!isConfigured) {
      return { 
        error: 'Supabase credentials are not configured yet. Please open .env.local and replace the placeholder URL & Anon Key with your real project credentials from Supabase Dashboard.' 
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        if (error.message.includes('Failed to fetch')) {
          return { 
            error: `Connection Error (Failed to fetch): Unable to reach Supabase project at ${import.meta.env.VITE_SUPABASE_URL}. Please verify your Project URL and Anon key in .env.local and check that your Supabase project is active.` 
          };
        }
        return { error: error.message };
      }

      setSession(data.session);
      setUser(data.user);
      return { error: null };
    } catch (err: any) {
      if (err.message && err.message.includes('Failed to fetch')) {
        return { 
          error: `Connection Error (Failed to fetch): Unable to connect to Supabase at ${import.meta.env.VITE_SUPABASE_URL}. Please check VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY in .env.local.` 
        };
      }
      return { error: err.message || 'An error occurred during login.' };
    }
  };

  const logout = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
