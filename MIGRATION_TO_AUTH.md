# Migration: User Table → Supabase Auth + Profile

## ✅ Perubahan yang Telah Dilakukan

### 1. Database Schema (`supabase-schema.sql`)

**Sebelum:**
```sql
CREATE TABLE "User" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Password di-hash dengan bcrypt
    name TEXT,
    createdAt TIMESTAMP
);
```

**Sesudah:**
```sql
-- Menggunakan auth.users bawaan Supabase
CREATE TABLE "Profile" (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP
);

-- Trigger otomatis membuat Profile saat user baru dibuat
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Keuntungan:**
- ✅ Password hashing otomatis oleh Supabase
- ✅ Email verification built-in
- ✅ Password reset gratis
- ✅ Session management otomatis
- ✅ Profile sync otomatis dengan trigger
- ✅ Tidak perlu bcrypt dependency

### 2. Authentication Logic (`src/lib/auth.ts`)

**Sebelum:**
```typescript
// Login dengan bcrypt compare manual
const user = await supabaseAdmin.from("User").select("*")...
const ok = await bcrypt.compare(password, user.password);
```

**Sesudah:**
```typescript
// Login dengan Supabase Auth
const { data: authData } = await supabase.auth.signInWithPassword({
  email: creds.email,
  password: creds.password,
});

// Get profile data
const { data: profile } = await supabaseAdmin
  .from("Profile").select("*")...
```

### 3. Profile Management (`src/app/admin/profile/`)

**Perubahan:**
- `User` → `Profile` di semua query
- Password update menggunakan `supabase.auth.admin.updateUserById()`
- Email update disync ke `auth.users` dan `Profile`
- Tidak lagi menggunakan bcrypt

### 4. Dependencies

**Dihapus:**
```json
{
  "bcrypt": "^5.1.1"  // Tidak diperlukan lagi
}
```

**Tetap digunakan:**
```json
{
  "@supabase/supabase-js": "^2.39.0",  // Untuk auth operations
  "next-auth": "^4.24.5"               // Untuk session management
}
```

## 🚀 Langkah Deployment

### Step 1: Update Database Schema di Supabase

1. Buka **Supabase Dashboard** → SQL Editor
2. Jalankan script dari `supabase/migrations/supabase-schema.sql`
3. Pastikan trigger `on_auth_user_created` berhasil dibuat

### Step 2: Buat Admin User Pertama

**Cara termudah via Dashboard:**

1. Buka **Authentication** → **Users**
2. Klik **Add User**
3. Isi:
   - Email: `admin@example.com`
   - Password: `Admin123!`
   - Auto Confirm User: ✅
4. Save

5. Buka **SQL Editor**, jalankan:
```sql
UPDATE public."Profile"
SET role = 'ADMIN'
WHERE email = 'admin@example.com';
```

**Atau via SQL (Opsi 2):**

Uncomment dan jalankan bagian akhir dari `supabase-schema.sql`:
```sql
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  INSERT INTO auth.users (...)
  VALUES (...);
  
  UPDATE public."Profile"
  SET role = 'ADMIN'
  WHERE id = new_user_id;
END $$;
```

### Step 3: Update Environment Variables di Vercel

Pastikan environment variables sudah benar:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fmwvuxlnaifkphzaxypo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
```

Di **Vercel Dashboard**:
1. Project Settings → Environment Variables
2. Update/tambahkan semua variable di atas
3. Pilih environment: Production, Preview, Development

### Step 4: Deploy ke Vercel

```bash
# Commit semua perubahan
git add .
git commit -m "Migrate from User table to Supabase Auth + Profile"
git push origin main
```

Vercel akan otomatis trigger deployment.

### Step 5: Test di Production

1. **Test Login:**
   - Buka `https://your-domain.vercel.app/login`
   - Login dengan admin credentials
   - Harus redirect ke `/admin`

2. **Test Profile:**
   - Buka `/admin/profile`
   - Cek data profile muncul dengan role ADMIN
   - Test update name
   - Test change password

3. **Test CRUD:**
   - Test semua fitur admin:
     - Stats, Services, Projects, Skills
     - Platforms, Socials, Messages
     - About, Contact, CTA
   - Pastikan semua insert/update/delete bekerja

## 📋 Checklist Deployment

- [ ] Schema SQL sudah dijalankan di Supabase
- [ ] Trigger `on_auth_user_created` sudah dibuat
- [ ] Admin user sudah dibuat dan role = ADMIN
- [ ] Test login lokal berhasil
- [ ] Build lokal berhasil (`npm run build`)
- [ ] Environment variables sudah diset di Vercel
- [ ] Code sudah di-push ke GitHub
- [ ] Deployment Vercel berhasil
- [ ] Test login production berhasil
- [ ] Test CRUD di production berhasil

## 🔒 Security Features

### Row Level Security (RLS)

```sql
-- Profile policies
CREATE POLICY "Public profiles are viewable by everyone"
ON "Profile" FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
ON "Profile" FOR UPDATE USING (auth.uid() = id);
```

**Catatan:** Admin operations menggunakan `service_role_key` yang bypass RLS.

### Password Security

- ✅ Passwords di-hash dengan **bcrypt** oleh Supabase (tidak disimpan plain text)
- ✅ Password minimum 8 karakter (configurable)
- ✅ Session menggunakan **JWT tokens** dengan expiry
- ✅ HTTPS only di production

### API Security

- ✅ Server Actions dilindungi dengan NextAuth session check
- ✅ Service role key hanya di server-side (tidak exposed ke client)
- ✅ Middleware proteksi untuk `/admin` routes

## 🆘 Troubleshooting

### Issue: "User not found" saat login

**Solusi:**
```sql
-- Cek profile ada atau tidak
SELECT * FROM public."Profile" WHERE email = 'admin@example.com';

-- Jika tidak ada, buat manual
INSERT INTO public."Profile" (id, email, name, role)
SELECT id, email, raw_user_meta_data->>'name', 'ADMIN'
FROM auth.users
WHERE email = 'admin@example.com';
```

### Issue: "Invalid credentials"

**Solusi:**
```sql
-- Confirm user email
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'admin@example.com';
```

### Issue: Trigger tidak jalan

**Solusi:** Jalankan ulang script trigger dari `supabase-schema.sql`.

### Issue: Build error "Module not found: bcrypt"

**Solusi:** 
```bash
npm uninstall bcrypt
npm install
```

## 📚 Dokumentasi Lengkap

Lihat `SETUP_ADMIN.md` untuk:
- Cara membuat user baru
- Testing authentication
- Troubleshooting lengkap
- Best practices

## 🎉 Next Steps

Setelah deployment berhasil:

1. **Populate Data:**
   - Login ke admin panel
   - Tambahkan Stats, About, Services
   - Upload projects dengan gambar
   - Set up social media links

2. **Customize:**
   - Update About section dengan info Anda
   - Ganti colors di `tailwind.config.ts`
   - Upload logo/favicon

3. **Optional Features:**
   - Setup email notifications untuk contact form
   - Add Google Analytics
   - Setup custom domain
   - Enable social login (Google, GitHub)

4. **Monitoring:**
   - Cek Vercel Analytics
   - Monitor Supabase usage
   - Review error logs

## 📝 Summary

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Authentication | Custom bcrypt | Supabase Auth |
| User Table | `public.User` | `public.Profile` + `auth.users` |
| Password Storage | Manual hash | Automatic (Supabase) |
| Dependencies | bcrypt required | No bcrypt needed |
| Password Reset | Manual implementation | Built-in |
| Email Verification | Manual implementation | Built-in |
| Security | Manual | Enhanced (RLS + JWT) |

**Result:** ✅ Sistem lebih secure, maintainable, dan feature-rich!
