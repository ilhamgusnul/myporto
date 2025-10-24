# 🔧 Fix: Configuration Error 500 di Vercel

## ❌ Error yang Terjadi:
```
500 (Internal Server Error)
/api/auth/error?error=Configuration
Server error: There is a problem with the server configuration
```

## ✅ Penyebab:
1. Environment variables belum diset di Vercel
2. `NEXTAUTH_SECRET` missing atau salah
3. `NEXTAUTH_URL` tidak sesuai dengan production URL

## 🛠️ Solusi (Step by Step):

### Step 1: Generate NEXTAUTH_SECRET

Di terminal lokal Anda, jalankan:
```bash
openssl rand -base64 32
```

Copy hasil output-nya (contoh: `Xo8kV7rN5tP2hQ9wJ3mF6sL1dC4bA8gT0yU5iE7nR6k=`)

### Step 2: Set Environment Variables di Vercel

1. **Buka Vercel Dashboard:**
   - Go to: https://vercel.com/dashboard
   - Pilih project Anda: `myporto` atau nama project Anda

2. **Masuk ke Settings:**
   - Klik tab **Settings**
   - Klik **Environment Variables** di sidebar

3. **Tambahkan Variable (satu per satu):**

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://fmwvuxlnaifkphzaxypo.supabase.co
Environment: Production ✓ Preview ✓ Development ✓
```

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: (Copy dari Supabase Dashboard → Settings → API → anon public key)
Environment: Production ✓ Preview ✓ Development ✓
```

**Cara get anon key:**
1. Buka https://supabase.com/dashboard
2. Pilih project: fmwvuxlnaifkphzaxypo
3. Settings → API
4. Copy **anon** / **public** key

#### Variable 3: SUPABASE_SERVICE_ROLE_KEY
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: (Copy dari Supabase Dashboard → Settings → API → service_role key)
Environment: Production ✓ Preview ✓ Development ✓
```

⚠️ **PENTING:** Service role key adalah **SECRET**, jangan share ke siapapun!

#### Variable 4: NEXTAUTH_SECRET
```
Name: NEXTAUTH_SECRET
Value: (Hasil dari openssl rand -base64 32)
Environment: Production ✓ Preview ✓ Development ✓
```

#### Variable 5: NEXTAUTH_URL (Production only)
```
Name: NEXTAUTH_URL
Value: https://ilhamgusnul.vercel.app (ganti dengan URL production Anda)
Environment: Production ✓ (HANYA Production, jangan Preview/Development)
```

### Step 3: Redeploy

Setelah semua environment variables di-set:

**Opsi A: Via Dashboard**
1. Klik tab **Deployments**
2. Cari deployment terakhir
3. Klik **...** (three dots)
4. Pilih **Redeploy**
5. Tunggu build selesai (±2 menit)

**Opsi B: Via Git Push**
```bash
# Trigger redeploy dengan empty commit
git commit --allow-empty -m "Trigger redeploy after setting env vars"
git push origin main
```

### Step 4: Cek Production URL

Setelah deployment selesai:

1. **Dapatkan Production URL:**
   - Lihat di Vercel Dashboard → Deployments
   - Contoh: `https://ilhamgusnul.vercel.app`

2. **Update NEXTAUTH_URL:**
   - Kembali ke Settings → Environment Variables
   - Edit `NEXTAUTH_URL` (Production)
   - Set value: `https://ilhamgusnul.vercel.app` (URL production Anda)
   - Save

3. **Redeploy sekali lagi** (karena update NEXTAUTH_URL)

### Step 5: Test Login

1. Buka: `https://your-site.vercel.app/login`
2. Masukkan credentials admin
3. Klik Sign In
4. Harus berhasil dan redirect ke `/admin`

## 📋 Checklist Environment Variables:

Copy paste ini dan check satu-satu:

```
[Vercel Dashboard → Settings → Environment Variables]

✅ NEXT_PUBLIC_SUPABASE_URL
   Value: https://fmwvuxlnaifkphzaxypo.supabase.co
   Env: Production ✓ Preview ✓ Development ✓

✅ NEXT_PUBLIC_SUPABASE_ANON_KEY  
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3... (dari Supabase)
   Env: Production ✓ Preview ✓ Development ✓

✅ SUPABASE_SERVICE_ROLE_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3... (dari Supabase)
   Env: Production ✓ Preview ✓ Development ✓

✅ NEXTAUTH_SECRET
   Value: Xo8kV7rN5tP2hQ9wJ3mF6sL1dC4bA8gT... (dari openssl)
   Env: Production ✓ Preview ✓ Development ✓

✅ NEXTAUTH_URL
   Value: https://ilhamgusnul.vercel.app (production URL)
   Env: Production ✓ (ONLY Production!)
```

## 🔍 Verifikasi di Supabase:

### 1. Cek Admin User Ada
```sql
-- Jalankan di Supabase SQL Editor
SELECT * FROM auth.users WHERE email = 'admin@example.com';
```

Harus return 1 row dengan:
- `email_confirmed_at` NOT NULL
- `encrypted_password` NOT NULL

### 2. Cek Profile Ada
```sql
SELECT * FROM public."Profile" WHERE email = 'admin@example.com';
```

Harus return 1 row dengan:
- `role` = 'ADMIN'
- `id` sama dengan `auth.users.id`

### 3. Jika User Belum Ada:

**Via Supabase Dashboard:**
1. Authentication → Users
2. Add User
3. Email: `admin@example.com`
4. Password: `Admin123!` (atau password kuat lainnya)
5. ✅ Auto Confirm User
6. Create

**Set Role:**
```sql
UPDATE public."Profile" 
SET role = 'ADMIN' 
WHERE email = 'admin@example.com';
```

## 🐛 Troubleshooting:

### Error: "Invalid login credentials"
**Solusi:**
```sql
-- Confirm email user
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'admin@example.com';
```

### Error: "User not found"
**Solusi:**
```sql
-- Cek profile ada
SELECT * FROM public."Profile" WHERE email = 'admin@example.com';

-- Jika tidak ada, trigger belum jalan
-- Buat manual:
INSERT INTO public."Profile" (id, email, name, role, "createdAt", "updatedAt")
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', 'Admin'),
  'ADMIN',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'admin@example.com';
```

### Error: Still showing Configuration Error
**Solusi:**
1. Clear Vercel cache: Deployments → ... → Clear Cache and Redeploy
2. Check browser console (F12) untuk error details
3. Check Vercel Function Logs: Deployments → View Function Logs

### Error: "NEXTAUTH_URL mismatch"
**Solusi:**
Pastikan `NEXTAUTH_URL` di Vercel environment variables **EXACT** sama dengan production URL (dengan https://)

## ✅ Final Check:

Setelah semua langkah selesai, test ini:

1. ✅ Homepage load: `https://your-site.vercel.app`
2. ✅ Login page load: `https://your-site.vercel.app/login`
3. ✅ Login berhasil dengan admin credentials
4. ✅ Redirect ke `/admin` setelah login
5. ✅ Dashboard menampilkan statistics
6. ✅ CRUD operations bekerja (add/edit/delete)

Jika semua ✅, deployment **BERHASIL!** 🎉

## 📞 Need Help?

Jika masih error:
1. Screenshot error di browser console (F12)
2. Check Vercel Function Logs
3. Check Supabase Logs (Dashboard → Logs)
4. Pastikan semua env vars sudah benar (case sensitive!)

## 🎯 Quick Fix Commands:

```bash
# Generate new secret
openssl rand -base64 32

# Test lokal dengan env vars
npm run dev

# Trigger redeploy
git commit --allow-empty -m "Redeploy"
git push origin main

# Check env vars (local)
echo $NEXTAUTH_SECRET
```

---

**Last Updated:** After fixing Configuration Error 500
**Status:** ✅ Ready to deploy after setting env vars
