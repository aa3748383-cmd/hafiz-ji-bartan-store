import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, ShoppingBag, ShieldCheck, LayoutDashboard, Search } from 'lucide-react';
import { BUSINESS_DETAILS, NAV_LINKS } from '../../lib/constants';
import { getWhatsAppLink } from '../../utils/whatsapp';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-stone-200/80 transition-all">
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-stone-950 text-stone-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">
              Store Owner: <strong className="text-amber-300 font-semibold">{BUSINESS_DETAILS.owner}</strong> | Main Road, Lalganj, Azamgarh
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-stone-200">
            <a 
              href={`tel:${BUSINESS_DETAILS.phone}`} 
              className="hover:text-amber-300 transition-colors flex items-center gap-1 font-medium"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{BUSINESS_DETAILS.formattedPhone}</span>
            </a>
            {user ? (
              <Link 
                to="/admin/dashboard" 
                className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 px-2 py-0.5 rounded-lg flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
              >
                <LayoutDashboard className="w-3 h-3 text-amber-300" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link to="/admin/login" className="hover:text-amber-300 transition-colors flex items-center gap-1 text-[11px] opacity-80 hover:opacity-100">
                <ShieldCheck className="w-3 h-3" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* BRAND LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl copper-gradient flex items-center justify-center text-white shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-xl font-bold font-serif tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors">
              Hafiz Ji <span className="text-amber-700">Bartan Store</span>
            </span>
            <p className="text-[11px] text-stone-500 font-medium tracking-wider uppercase -mt-1">
              Lalganj, Azamgarh
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(link.path)
                  ? 'bg-amber-100/80 text-amber-900 font-semibold shadow-2xs border border-amber-200/60'
                  : 'text-stone-700 hover:text-amber-800 hover:bg-stone-100/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT DESKTOP CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/products"
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 transition-colors"
            title="Search Products"
          >
            <Search className="w-4 h-4" />
          </Link>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Us</span>
          </a>
        </div>

        {/* MOBILE HAMBURGER TOGGLE */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/products"
            className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
            aria-label="Search Products"
          >
            <Search className="w-5 h-5" />
          </Link>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
            aria-label="WhatsApp Us"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200/80 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 animate-slide-up shadow-xl">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-amber-100/80 text-amber-900 font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-medium text-sm shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Enquiry</span>
            </a>
            
            <a
              href={`tel:${BUSINESS_DETAILS.phone}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-100 text-stone-800 font-medium text-sm border border-stone-200"
            >
              <Phone className="w-4 h-4 text-amber-700" />
              <span>Call: {BUSINESS_DETAILS.formattedPhone}</span>
            </a>

            <div className="pt-2 flex justify-between text-xs text-stone-500">
              {user ? (
                <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="hover:underline flex items-center gap-1 text-amber-700 font-semibold">
                  <LayoutDashboard className="w-3 h-3 text-amber-600" />
                  <span>Admin Dashboard</span>
                </Link>
              ) : (
                <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="hover:underline flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-stone-400" />
                  <span>Admin Login</span>
                </Link>
              )}
              <span>Owner: {BUSINESS_DETAILS.owner}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

