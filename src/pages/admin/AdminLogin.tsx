import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BUSINESS_DETAILS } from '../../lib/constants';
import { updateSEOMetadata } from '../../utils/seo';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, user, loading: authLoading, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    updateSEOMetadata({
      title: 'Admin Login',
      description: 'Secure Administrator Authentication Panel for Hafiz Ji Bartan Store',
    });

    if (user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    const res = await login(email, password);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      navigate('/admin/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-stone-900 text-stone-100">
      <div className="max-w-md w-full bg-stone-800/90 border border-stone-700/80 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* HEADER BRANDING */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl copper-gradient mx-auto flex items-center justify-center text-white shadow-lg">
            <ShieldCheck className="w-7 h-7 text-amber-300" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-white tracking-tight">
            Store Admin Login
          </h1>
          <p className="text-xs text-stone-400">
            {BUSINESS_DETAILS.name} • {BUSINESS_DETAILS.owner}
          </p>
        </div>

        {/* DEMO NOTICE IF UNCONFIGURED */}
        {!isConfigured && (
          <div className="bg-amber-950/70 border border-amber-800 text-amber-200 text-xs p-3.5 rounded-xl space-y-1">
            <p className="font-semibold flex items-center gap-1.5 text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Supabase Environment Setup Required</span>
            </p>
            <p className="text-[11px] leading-relaxed">
              Add your actual <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env</code> file to connect your Supabase Auth user.
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-950/70 border border-red-800 text-red-200 text-xs p-3.5 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hafizjibartan.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-sm text-white placeholder-stone-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-hidden transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-sm text-white placeholder-stone-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-hidden transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-600 disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Login to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-stone-400 hover:text-amber-400 transition-colors">
            ← Return to Public Website
          </Link>
        </div>

      </div>
    </div>
  );
};
