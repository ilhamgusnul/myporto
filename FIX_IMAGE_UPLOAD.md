# Fix Upload Image di Production

## 🐛 Masalah yang Ditemukan

### 1. Hero Section Integration
✅ **SUDAH TERINTEGRASI** dengan About di admin

File `src/app/page.tsx` hero section menggunakan:
- `about?.title` → Nama (2 kata pertama orange)
- `about?.subtitle` → Full Stack Developer & Designer
- `about?.tagline` → Code by Logic, Design with Passion (orange)
- `about?.content` → Deskripsi panjang
- `about?.avatarUrl` → Foto profil

Semua bisa diedit di `/admin/about` ✅

### 2. Upload Image Failed
❌ **BUG DITEMUKAN**: Environment variable salah

**Problem**:
- Line 36 di `src/app/api/upload/route.ts` menggunakan `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`
- Seharusnya: `SUPABASE_SERVICE_ROLE_KEY` (without NEXT_PUBLIC prefix)

**Impact**: Upload API tidak bisa authenticate ke Supabase Storage

---

## ✅ Perbaikan yang Dilakukan

### 1. Fix Environment Variable Bug

**File**: `src/app/api/upload/route.ts`

**Before**:
```typescript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!  // ❌ WRONG
);
```

**After**:
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;  // ✅ CORRECT

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials");
  return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
```

### 2. Enhanced Error Logging

Tambahan detailed logging untuk debugging:

```typescript
// Log upload attempt
console.log(`Uploading file: ${filename} (${file.size} bytes) to bucket: assets`);

// Log error details
if (uploadError) {
  console.error("Upload error details:", {
    message: uploadError.message,
    name: uploadError.name,
    stack: uploadError.stack,
    bucket: "assets",
    path: path
  });
}

// Log success
console.log("Upload successful:", uploadData);
console.log("Public URL generated:", data.publicUrl);
```

### 3. Better Error Response

Response sekarang include details untuk debugging:

```typescript
return NextResponse.json({ 
  error: `Upload failed: ${uploadError.message}`,
  details: uploadError 
}, { status: 500 });
```

---

## 🗄️ Setup Storage Bucket

### SQL Script: `setup-storage.sql`

Script ini akan:
1. ✅ Create bucket 'assets' (public)
2. ✅ Set file size limit (5MB)
3. ✅ Set allowed MIME types (image only)
4. ✅ Create RLS policies untuk upload/read/update/delete

**Run di Supabase SQL Editor**:
https://supabase.com/dashboard/project/fmwvuxlnaifkphzaxypo/sql/new

Copy paste isi file `setup-storage.sql` dan run.

---

## 🚀 Deployment Steps

### Step 1: Verify Environment Variables di Vercel

⚠️ **PENTING**: Pastikan env var benar di Vercel Dashboard

1. Go to: https://vercel.com/ilhamgusnul/myporto/settings/environment-variables

2. Verify these variables exist:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://fmwvuxlnaifkphzaxypo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...  ← This one is critical for upload!
   NEXTAUTH_SECRET=...
   NEXTAUTH_URL=https://ilhamgusnul.vercel.app
   ```

3. **CRITICAL**: `SUPABASE_SERVICE_ROLE_KEY` harus tanpa prefix `NEXT_PUBLIC_`

### Step 2: Setup Storage Bucket di Supabase

1. Buka Supabase SQL Editor
2. Copy paste dari `setup-storage.sql`
3. Click Run
4. Verify bucket dibuat:
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'assets';
   ```

### Step 3: Push Code Changes

```bash
git add -A
git commit -m "Fix: Correct SUPABASE_SERVICE_ROLE_KEY env var for upload API"
git push origin main
```

Vercel akan auto-deploy.

### Step 4: Test Upload

1. Login ke admin: https://ilhamgusnul.vercel.app/login
2. Go to any page dengan image upload (About, Projects, Services, dll)
3. Try upload image
4. Check Vercel logs untuk error details: https://vercel.com/ilhamgusnul/myporto/logs

---

## 🧪 Testing

### Local Testing

```bash
# Make sure .env has correct values
NEXT_PUBLIC_SUPABASE_URL=https://fmwvuxlnaifkphzaxypo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # No NEXT_PUBLIC_ prefix!

# Run dev server
npm run dev

# Test upload at http://localhost:3000/admin/about
```

### Production Testing

1. Go to: https://ilhamgusnul.vercel.app/admin/about
2. Try upload image
3. Check browser console for errors
4. Check Vercel logs for server-side errors

---

## 🔍 Troubleshooting

### Error: "Server configuration error"

**Problem**: Environment variable tidak di-set di Vercel

**Solution**:
1. Check Vercel Dashboard → Settings → Environment Variables
2. Ensure `SUPABASE_SERVICE_ROLE_KEY` exists (without NEXT_PUBLIC_ prefix)
3. Redeploy

### Error: "Bucket not found"

**Problem**: Storage bucket 'assets' belum dibuat

**Solution**:
1. Run SQL dari `setup-storage.sql`
2. Verify dengan: `SELECT * FROM storage.buckets WHERE id = 'assets';`

### Error: "new row violates row-level security policy"

**Problem**: RLS policies belum di-set

**Solution**:
1. Run RLS policies dari `setup-storage.sql`
2. Verify dengan: `SELECT * FROM pg_policies WHERE tablename = 'objects';`

### Upload Success tapi Image Tidak Muncul

**Problem**: CORS atau bucket tidak public

**Solution**:
1. Pastikan bucket public = true
2. Run:
   ```sql
   UPDATE storage.buckets 
   SET public = true 
   WHERE id = 'assets';
   ```

---

## 📊 Verification Checklist

- [ ] Environment variable `SUPABASE_SERVICE_ROLE_KEY` di-set di Vercel (tanpa NEXT_PUBLIC_)
- [ ] Storage bucket 'assets' sudah dibuat di Supabase
- [ ] RLS policies untuk storage sudah di-set
- [ ] Code changes sudah di-push dan deployed
- [ ] Test upload di local works
- [ ] Test upload di production works
- [ ] Images accessible via public URL

---

## 🎯 Expected Behavior

### Upload Flow:

1. User click "Upload Image" di admin panel
2. Select file (max 5MB, images only)
3. File uploaded ke Supabase Storage bucket 'assets'
4. Path: `uploads/{uuid}.{ext}`
5. Public URL returned: `https://fmwvuxlnaifkphzaxypo.supabase.co/storage/v1/object/public/assets/uploads/{uuid}.{ext}`
6. URL saved to database
7. Image displayed di admin preview dan homepage

### Success Response:

```json
{
  "url": "https://fmwvuxlnaifkphzaxypo.supabase.co/storage/v1/object/public/assets/uploads/abc-123.jpg",
  "path": "uploads/abc-123.jpg",
  "size": 245678
}
```

---

## 📝 Notes

- **Service Role Key**: Harus disimpan sebagai server-side env var (tanpa NEXT_PUBLIC_)
- **Public URLs**: Semua images di bucket 'assets' accessible via public URL
- **File Naming**: UUID untuk avoid conflicts
- **Max Size**: 5MB per file
- **Allowed Types**: JPEG, PNG, WebP, GIF

---

**Status**: ✅ Fixed and ready for deployment
