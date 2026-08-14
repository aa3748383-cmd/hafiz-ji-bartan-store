-- ====================================================================
-- HAFIZ JI BARTAN STORE - SUPABASE INITIAL SEED DATA
-- ====================================================================

-- 1. INSERT INITIAL CATEGORIES
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

-- 2. INSERT DEMO / TEST PRODUCTS (Clearly tagged for easy identification/cleanup)
DO $$
DECLARE
    cat_steel UUID;
    cat_cookers UUID;
    cat_utensils UUID;
    cat_dinner UUID;
    cat_aluminium UUID;
BEGIN
    SELECT id INTO cat_steel FROM public.categories WHERE slug = 'steel-bartan' LIMIT 1;
    SELECT id INTO cat_cookers FROM public.categories WHERE slug = 'pressure-cookers' LIMIT 1;
    SELECT id INTO cat_utensils FROM public.categories WHERE slug = 'kitchen-utensils' LIMIT 1;
    SELECT id INTO cat_dinner FROM public.categories WHERE slug = 'dinner-sets' LIMIT 1;
    SELECT id INTO cat_aluminium FROM public.categories WHERE slug = 'aluminium-items' LIMIT 1;

    -- Stainless Steel Thali Set
    IF cat_steel IS NOT NULL THEN
        INSERT INTO public.products (name, slug, description, price, category_id, image_url, is_featured, is_available, stock_quantity)
        VALUES (
            '[Demo] Premium Stainless Steel Thali Set',
            'demo-steel-thali-set',
            'High-grade heavy stainless steel thali with 4 bowls, glass, and spoon for family meals.',
            450.00,
            cat_steel,
            'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
            TRUE,
            TRUE,
            25
        ) ON CONFLICT (slug) DO NOTHING;

        INSERT INTO public.products (name, slug, description, price, category_id, image_url, is_featured, is_available, stock_quantity)
        VALUES (
            '[Demo] Heavy Gauge Stainless Steel Dabba Container Set',
            'demo-steel-dabba-set',
            'Set of 3 airtight stainless steel storage containers for kitchen groceries and grains.',
            550.00,
            cat_steel,
            'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
            FALSE,
            TRUE,
            18
        ) ON CONFLICT (slug) DO NOTHING;
    END IF;

    -- Pressure Cooker
    IF cat_cookers IS NOT NULL THEN
        INSERT INTO public.products (name, slug, description, price, category_id, image_url, is_featured, is_available, stock_quantity)
        VALUES (
            '[Demo] 5-Litre Outer Lid Aluminium Pressure Cooker',
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

    -- Utensil Set
    IF cat_utensils IS NOT NULL THEN
        INSERT INTO public.products (name, slug, description, price, category_id, image_url, is_featured, is_available, stock_quantity)
        VALUES (
            '[Demo] Stainless Steel Spoon & Ladle Set (6 Pcs)',
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

    -- Aluminium Kadai
    IF cat_aluminium IS NOT NULL THEN
        INSERT INTO public.products (name, slug, description, price, category_id, image_url, is_featured, is_available, stock_quantity)
        VALUES (
            '[Demo] Heavy Base Aluminium Kadai (3 Litre)',
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
