-- ====================================================================
-- HAFIZ JI BARTAN STORE - SECURE SUPABASE POSTGRESQL DATABASE MIGRATION
-- Copy and paste this entire script into your Supabase SQL Editor.
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. EXTENSIONS & SETUP
-- --------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 2. ADMIN USERS TABLE & SECURITY DEFINER FUNCTION
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helper function to check if the current requesting user is a designated admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view admin_users list" ON public.admin_users;
CREATE POLICY "Admins can view admin_users list"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

-- --------------------------------------------------------------------
-- 3. CATEGORIES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. PRODUCTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    image_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. PERFORMANCE INDEXES
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);

-- --------------------------------------------------------------------
-- 6. AUTOMATED UPDATED_AT TRIGGER FUNCTION & TRIGGERS
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------
-- 7. SECURE ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- CATEGORIES RLS POLICIES
-- Public: Anyone can read categories
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories"
    ON public.categories FOR SELECT
    USING (true);

-- Admin Only: Insert categories
DROP POLICY IF EXISTS "Admin only insert categories" ON public.categories;
CREATE POLICY "Admin only insert categories"
    ON public.categories FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Admin Only: Update categories
DROP POLICY IF EXISTS "Admin only update categories" ON public.categories;
CREATE POLICY "Admin only update categories"
    ON public.categories FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Admin Only: Delete categories
DROP POLICY IF EXISTS "Admin only delete categories" ON public.categories;
CREATE POLICY "Admin only delete categories"
    ON public.categories FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- PRODUCTS RLS POLICIES
-- Public: Anyone can view products (in-stock & out-of-stock); Admins can modify products
DROP POLICY IF EXISTS "Public can view available products" ON public.products;
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products"
    ON public.products FOR SELECT
    USING (true);

-- Admin Only: Insert products
DROP POLICY IF EXISTS "Admin only insert products" ON public.products;
CREATE POLICY "Admin only insert products"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Admin Only: Update products
DROP POLICY IF EXISTS "Admin only update products" ON public.products;
CREATE POLICY "Admin only update products"
    ON public.products FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Admin Only: Delete products
DROP POLICY IF EXISTS "Admin only delete products" ON public.products;
CREATE POLICY "Admin only delete products"
    ON public.products FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- --------------------------------------------------------------------
-- 8. SUPABASE STORAGE BUCKET & ADMIN-ONLY STORAGE POLICIES
-- --------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    TRUE,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif']
)
ON CONFLICT (id) DO UPDATE 
SET 
    public = TRUE,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];

-- Public Read: Anyone can view image assets
DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
CREATE POLICY "Public read access for product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

-- Admin Only: Upload product images
DROP POLICY IF EXISTS "Admin only upload product images" ON storage.objects;
CREATE POLICY "Admin only upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

-- Admin Only: Update product images
DROP POLICY IF EXISTS "Admin only update product images" ON storage.objects;
CREATE POLICY "Admin only update product images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin())
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

-- Admin Only: Delete product images
DROP POLICY IF EXISTS "Admin only delete product images" ON storage.objects;
CREATE POLICY "Admin only delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin());

-- --------------------------------------------------------------------
-- 9. INITIAL STORE CATEGORIES & Clearly Tagged DEMO Seed Data
-- --------------------------------------------------------------------
INSERT INTO public.categories (name, slug, description, image_url)
VALUES 
    ('Steel Bartan', 'steel-bartan', 'High quality stainless steel kitchenware, plates, bowls, and storage containers.', 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80'),
    ('Aluminium Items', 'aluminium-items', 'Durable aluminium patili, kadais, and cooking vessels.', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'),
    ('Kitchen Utensils', 'kitchen-utensils', 'Essential everyday kitchen tools, spoons, ladles, strainers, and chimta.', 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80'),
    ('Pressure Cookers', 'pressure-cookers', 'Heavy base pressure cookers for fast and safe daily cooking.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'),
    ('Dinner Sets', 'dinner-sets', 'Complete family dinner sets in stainless steel, glass, and opalware.', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80'),
    ('Glass & Cups', 'glass-and-cups', 'Tea cups, water glasses, jug sets, and glass servingware.', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'),
    ('Kitchen Accessories', 'kitchen-accessories', 'Spice boxes, rotimaker, belan-chakla, gas stove stands, and containers.', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80'),
    ('Other Household Items', 'other-household-items', 'Buckets, tubs, cleaning accessories, and general household items.', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (slug) DO UPDATE 
SET 
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;

-- DEMO PRODUCTS FOR DEVELOPMENT / TESTING ONLY
DO $$
DECLARE
    cat_steel UUID;
    cat_cookers UUID;
    cat_utensils UUID;
    cat_aluminium UUID;
BEGIN
    SELECT id INTO cat_steel FROM public.categories WHERE slug = 'steel-bartan' LIMIT 1;
    SELECT id INTO cat_cookers FROM public.categories WHERE slug = 'pressure-cookers' LIMIT 1;
    SELECT id INTO cat_utensils FROM public.categories WHERE slug = 'kitchen-utensils' LIMIT 1;
    SELECT id INTO cat_aluminium FROM public.categories WHERE slug = 'aluminium-items' LIMIT 1;

    IF cat_steel IS NOT NULL THEN
        INSERT INTO public.products (name, slug, description, price, category_id, image_url, is_featured, is_available, stock_quantity)
        VALUES 
        (
            '[DEMO] Premium Stainless Steel Thali Set',
            'demo-steel-thali-set',
            'High-grade heavy stainless steel thali with 4 bowls, glass, and spoon for family meals.',
            450.00,
            cat_steel,
            'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
            TRUE,
            TRUE,
            25
        ),
        (
            '[DEMO] Heavy Gauge Stainless Steel Dabba Container Set',
            'demo-steel-dabba-set',
            'Set of 3 airtight stainless steel storage containers for kitchen groceries and grains.',
            550.00,
            cat_steel,
            'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
            FALSE,
            TRUE,
            18
        )
        ON CONFLICT (slug) DO NOTHING;
    END IF;

    IF cat_cookers IS NOT NULL THEN
        INSERT INTO public.products (name, slug, description, price, category_id, image_url, is_featured, is_available, stock_quantity)
        VALUES (
            '[DEMO] 5-Litre Outer Lid Aluminium Pressure Cooker',
            'demo-5l-pressure-cooker',
            'Durable 5-Litre pressure cooker with heat-resistant handle and safety valve for daily cooking.',
            1250.00,
            cat_cookers,
            'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
            TRUE,
            TRUE,
            10
        ) ON CONFLICT (slug) DO NOTHING;
    END IF;

    IF cat_utensils IS NOT NULL THEN
        INSERT INTO public.products (name, slug, description, price, category_id, image_url, is_featured, is_available, stock_quantity)
        VALUES (
            '[DEMO] Stainless Steel Spoon & Ladle Set (6 Pcs)',
            'demo-spoon-ladle-set',
            'Mirror-finish stainless steel serving ladles, rice spoons, and skimmer set.',
            280.00,
            cat_utensils,
            'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80',
            FALSE,
            TRUE,
            30
        ) ON CONFLICT (slug) DO NOTHING;
    END IF;

    IF cat_aluminium IS NOT NULL THEN
        INSERT INTO public.products (name, slug, description, price, category_id, image_url, is_featured, is_available, stock_quantity)
        VALUES (
            '[DEMO] Heavy Base Aluminium Kadai (3 Litre)',
            'demo-heavy-aluminium-kadai',
            'Thick aluminium kadai ideal for frying, curry, and large volume household cooking.',
            480.00,
            cat_aluminium,
            'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
            TRUE,
            TRUE,
            15
        ) ON CONFLICT (slug) DO NOTHING;
    END IF;

END $$;
