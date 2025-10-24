-- Setup Supabase Storage Bucket for Image Uploads
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/fmwvuxlnaifkphzaxypo/sql/new

-- 1. Create storage bucket 'assets' if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'assets',
    'assets',
    true,  -- Public bucket for images
    5242880,  -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[];

-- 2. Create RLS Policies for Storage

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assets');

-- Allow public to read files (public bucket)
CREATE POLICY "Allow public to read files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'assets');

-- Allow authenticated users to update their own files
CREATE POLICY "Allow authenticated users to update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'assets');

-- Allow authenticated users to delete files
CREATE POLICY "Allow authenticated users to delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'assets');

-- 3. Verify bucket creation
SELECT * FROM storage.buckets WHERE id = 'assets';

-- 4. Check policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
