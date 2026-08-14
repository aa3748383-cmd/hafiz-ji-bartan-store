import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MapPin, Phone, MessageCircle, Navigation, ShieldCheck, LayoutDashboard, Clock } from 'lucide-react';
import { BUSINESS_DETAILS, NAV_LINKS } from '../../lib/constants';
import { getWhatsAppLink, getDirectionsLink } from '../../utils/whatsapp';
import { useAuth } from '../../contexts/AuthContext';

export const Footer: React.FC = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-stone-950 text-stone-300 pt-14 pb-12 border-t border-stone-800 pb-safe-action-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* COLUMN 1: BRAND & OWNER */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl copper-gradient flex items-center justify-center text-white shadow-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-serif text-white tracking-tight">
                Hafiz Ji <span className="text-amber-400">Bartan Store</span>
              </span>
            </Link>
            
            <p className="text-sm text-stone-400 leading-relaxed">
              Your trusted destination for premium stainless steel bartan, heavy aluminium utensils, daily pressure cookers, and wedding gift sets in Lalganj, Azamgarh.
            </p>

            <div className="pt-2 text-xs text-stone-400 space-y-1.5 border-t border-stone-800/80">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <strong className="text-stone-200">Owner:</strong> {BUSINESS_DETAILS.owner}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-stone-300">Mon - Sat: 9:00 AM - 9:00 PM</span>
              </p>
            </div>
          </div>

          {/* COLUMN 2: QUICK NAVIGATION */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 border-l-2 border-amber-500 pl-3">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map(link => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="hover:text-amber-400 transition-colors inline-block text-stone-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                {user ? (
                  <Link 
                    to="/admin/dashboard" 
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-stone-300 text-xs mt-3 pt-3 border-t border-stone-800 font-medium"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Dashboard</span>
                    <span className="ml-auto px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 text-[10px] uppercase font-semibold">Active</span>
                  </Link>
                ) : (
                  <Link 
                    to="/admin/login" 
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-stone-400 text-xs mt-3 pt-3 border-t border-stone-800"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>Admin Login</span>
                  </Link>
                )}
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CATEGORIES */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 border-l-2 border-amber-500 pl-3">
              Store Collections
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li><Link to="/products" className="hover:text-amber-400 transition-colors">All Store Inventory</Link></li>
              <li><Link to="/categories" className="hover:text-amber-400 transition-colors">Steel Bartan Sets</Link></li>
              <li><Link to="/categories" className="hover:text-amber-400 transition-colors">Aluminium Cookware</Link></li>
              <li><Link to="/categories" className="hover:text-amber-400 transition-colors">Pressure Cookers</Link></li>
              <li><Link to="/categories" className="hover:text-amber-400 transition-colors">Dinner Sets & Gifts</Link></li>
              <li><Link to="/categories" className="hover:text-amber-400 transition-colors">Kitchen Utensils</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: STORE CONTACT & LOCATION */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 border-l-2 border-amber-500 pl-3">
              Store Location
            </h3>
            
            <div className="space-y-3 text-sm text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>{BUSINESS_DETAILS.fullAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <a href={`tel:${BUSINESS_DETAILS.phone}`} className="hover:underline text-amber-300">
                  {BUSINESS_DETAILS.formattedPhone}
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enquire via WhatsApp</span>
              </a>
              
              <a
                href={getDirectionsLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>Get Google Maps Directions</span>
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & CREDITS */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {BUSINESS_DETAILS.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Store Proprietor:</span>
            <strong className="text-stone-300 font-medium">{BUSINESS_DETAILS.owner}</strong>
            <span>• Lalganj, Azamgarh, UP</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

