-- ====================================================================
-- HAFIZ JI BARTAN STORE - SUPABASE STORAGE BUCKET & RLS POLICIES
-- ====================================================================

-- 1. CREATE BUCKET FOR PRODUCT IMAGES (If not already created via UI)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    TRUE,
    5242880, -- 5MB limit per image
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif']
)
ON CONFLICT (id) DO UPDATE 
SET 
    public = TRUE,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];

-- 2. STORAGE RLS POLICIES

-- Public Read Policy: Allow anyone to view product images
DROP POLICY IF EXISTS "Public product image read policy" ON storage.objects;
CREATE POLICY "Public product image read policy"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'product-images');

-- Admin Insert Policy: Allow authenticated users (admin) to upload images
DROP POLICY IF EXISTS "Admin product image insert policy" ON storage.objects;
CREATE POLICY "Admin product image insert policy"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');

-- Admin Update Policy: Allow authenticated users (admin) to update images
DROP POLICY IF EXISTS "Admin product image update policy" ON storage.objects;
CREATE POLICY "Admin product image update policy"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images')
    WITH CHECK (bucket_id = 'product-images');

-- Admin Delete Policy: Allow authenticated users (admin) to delete images
DROP POLICY IF EXISTS "Admin product image delete policy" ON storage.objects;
CREATE POLICY "Admin product image delete policy"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images');
