import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  ShoppingBag 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BUSINESS_DETAILS } from '../../lib/constants';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
  ];

  return (
    <aside className="w-full lg:w-64 bg-stone-900 text-stone-300 flex flex-col justify-between p-5 border-r border-stone-800 shrink-0">
      
      <div className="space-y-6">
        {/* BRAND LOGO */}
        <div className="flex items-center gap-3 pb-5 border-b border-stone-800">
          <div className="w-9 h-9 rounded-xl copper-gradient flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="text-base font-bold font-serif text-white block leading-tight">
              Admin Panel
            </span>
            <span className="text-[11px] text-stone-400">
              {BUSINESS_DETAILS.name}
            </span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-700 text-white font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-6 border-t border-stone-800 space-y-3">
        <Link
          to="/"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 text-xs font-medium transition-colors"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>View Live Site</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
        </Link>

        {user && (
          <div className="px-3.5 py-2 rounded-xl bg-stone-950 text-[11px] text-stone-400 truncate">
            <span>Admin: </span>
            <span className="text-stone-200 font-mono">{user.email}</span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-200 text-xs font-semibold border border-red-900/50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Logout Session</span>
        </button>
      </div>

    </aside>
  );
};
