# Supabase Storage Setup - RLS Policies

## Cara Menambahkan Policies untuk Bucket "assets"

### Via Supabase Dashboard:

1. **Buka Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/origfjoncpvjsjihauzm

2. **Buka SQL Editor**
   - Klik menu "SQL Editor" di sidebar kiri
   - Klik "New query"

3. **Paste dan Run SQL ini:**

```sql
-- Enable RLS on storage.objects if not enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public to read/view images from assets bucket
CREATE POLICY "Public Access to Assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

-- Policy 2: Allow authenticated users to upload to assets bucket
CREATE POLICY "Authenticated users can upload to assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'assets' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'assets' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Policy 4: Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'assets' AND auth.role() = 'authenticated');
```

4. **Run Query**
   - Klik tombol "Run" atau tekan Cmd+Enter
   - Harus muncul "Success. No rows returned"

### Verifikasi:

1. **Cek Policies**
   - Go to: Storage → assets → Policies
   - Harus terlihat 4 policies:
     - ✅ Public Access to Assets (SELECT)
     - ✅ Authenticated users can upload to assets (INSERT)
     - ✅ Authenticated users can update assets (UPDATE)
     - ✅ Authenticated users can delete assets (DELETE)

### Test Upload:

1. Login: http://localhost:3000/login
2. Go to: http://localhost:3000/admin/about
3. Upload gambar
4. Harus berhasil dan preview muncul!

### Troubleshooting:

Jika masih error 400/403:

1. **Cek bucket public:**
   ```sql
   SELECT id, name, public FROM storage.buckets WHERE id = 'assets';
   ```
   Harus return: public = true

2. **Cek existing policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%assets%';
   ```

3. **Drop existing policies jika ada yang conflict:**
   ```sql
   DROP POLICY IF EXISTS "Public Access to Assets" ON storage.objects;
   DROP POLICY IF EXISTS "Authenticated users can upload to assets" ON storage.objects;
   DROP POLICY IF EXISTS "Authenticated users can update assets" ON storage.objects;
   DROP POLICY IF EXISTS "Authenticated users can delete assets" ON storage.objects;
   ```
   
   Lalu jalankan lagi CREATE POLICY di atas.

### Alternative: Disable RLS (Untuk Development Only)

⚠️ **TIDAK DISARANKAN UNTUK PRODUCTION!**

```sql
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

Ini akan membuat semua storage accessible tanpa policy checks.
