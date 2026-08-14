import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isConfigured } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-xs text-stone-400 font-medium">Verifying Admin Credentials...</p>
      </div>
    );
  }

  // If Supabase is unconfigured in development, allow preview access with warning banner or redirect
  if (!user && isConfigured) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <>
      {!isConfigured && (
        <div className="bg-amber-500 text-stone-950 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Demo Admin Mode (Supabase Auth environment variables pending setup in .env)</span>
        </div>
      )}
      {children}
    </>
  );
};
