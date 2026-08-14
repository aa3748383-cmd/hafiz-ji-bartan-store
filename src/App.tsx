import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// COMMON COMPONENTS
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileActionBar } from './components/common/MobileActionBar';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// PUBLIC PAGES
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Categories } from './pages/Categories';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

// ADMIN PAGES
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';

// SEO SCHEMA
import { generateLocalBusinessSchema } from './utils/seo';

// PUBLIC LAYOUT WRAPPER
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
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
        <Router>
          <Routes>
            {/* PUBLIC WEBSITE ROUTES */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/categories" element={<Categories />} />
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
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
