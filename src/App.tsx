import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { CartProvider } from './contexts/CartContext';

// COMMON COMPONENTS
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileActionBar } from './components/common/MobileActionBar';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// PUBLIC PAGES (Home loaded directly for instant initial render, others lazy-loaded)
import { Home } from './pages/Home';
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Categories = lazy(() => import('./pages/Categories').then(m => ({ default: m.Categories })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));

// E-COMMERCE SHOPPING PAGES
const Cart = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation').then(m => ({ default: m.OrderConfirmation })));
const TrackOrder = lazy(() => import('./pages/TrackOrder').then(m => ({ default: m.TrackOrder })));

// ADMIN PAGES (Lazy loaded so non-admin users never download admin code)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories').then(m => ({ default: m.AdminCategories })));

// SEO SCHEMA
import { generateLocalBusinessSchema } from './utils/seo';

// PAGE LOADING FALLBACK
const PageFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-7 h-7 border-3 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// PUBLIC LAYOUT WRAPPER
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <MobileActionBar />
    </div>
  );
};

export const App: React.FC = () => {
  useEffect(() => {
    // Inject LocalBusiness JSON-LD schema into head
    const existingSchema = document.getElementById('local-business-jsonld');
    if (!existingSchema) {
      const script = document.createElement('script');
      script.id = 'local-business-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(generateLocalBusinessSchema());
      document.head.appendChild(script);
    }
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Router>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                {/* PUBLIC WEBSITE ROUTES */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Route>

                {/* ADMIN ROUTES */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute>
                      <AdminProducts />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/categories"
                  element={
                    <ProtectedRoute>
                      <AdminCategories />
                    </ProtectedRoute>
                  }
                />

                {/* FALLBACK REDIRECT */}
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
          </Router>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
