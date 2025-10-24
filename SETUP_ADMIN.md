# Setup Admin User - Supabase Auth

Aplikasi ini menggunakan **Supabase Authentication** untuk manajemen user. Tabel `Profile` otomatis tersinkronisasi dengan `auth.users` melalui database trigger.

## Struktur Database

- **auth.users** - Tabel authentication bawaan Supabase (email, password, dll)
- **public.Profile** - Tabel profile yang berisi role dan informasi tambahan
- **Trigger** - Otomatis membuat record di `Profile` saat user baru dibuat

## Cara Membuat Admin User

### Opsi 1: Melalui Supabase Dashboard (Recommended)

1. Buka **Supabase Dashboard** → Project Anda
2. Pilih **Authentication** → **Users**
3. Klik **Add User** / **Invite User**
4. Isi form:
   - **Email**: `admin@example.com` (atau email lain)
   - **Password**: `Admin123!` (atau password lain, min 8 karakter)
   - **Auto Confirm User**: ✅ (centang ini agar langsung aktif)
5. Klik **Save** / **Send Invite**

6. Setelah user dibuat, buka **SQL Editor**
7. Jalankan query untuk set role ADMIN:

```sql
-- Update role user menjadi ADMIN
UPDATE public."Profile"
SET role = 'ADMIN'
WHERE email = 'admin@example.com';
```

### Opsi 2: Melalui SQL Editor

Jalankan script berikut di **Supabase SQL Editor**:

```sql
-- 1. Buat user di auth.users
-- Replace dengan email dan password yang diinginkan
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Create user in auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@example.com', -- GANTI EMAIL
    crypt('Admin123!', gen_salt('bf')), -- GANTI PASSWORD
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin User"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Profile akan otomatis dibuat oleh trigger
  -- Tapi kita perlu update rolenya menjadi ADMIN
  UPDATE public."Profile"
  SET role = 'ADMIN'
  WHERE id = new_user_id;

  RAISE NOTICE 'Admin user created with ID: %', new_user_id;
END $$;
```

### Opsi 3: Setelah User Sudah Terdaftar

Jika sudah ada user yang terdaftar dan ingin dijadikan admin:

```sql
-- Cek dulu user yang ada
SELECT id, email, role FROM public."Profile";

-- Update role menjadi ADMIN
UPDATE public."Profile"
SET role = 'ADMIN'
WHERE email = 'email@user.com'; -- ganti dengan email user
```

## Cara Login

1. Buka aplikasi di browser: `http://localhost:3000/login`
2. Masukkan email dan password yang sudah dibuat
3. Klik **Sign In**
4. Jika berhasil, akan redirect ke `/admin`

## Testing Authentication

Untuk memastikan semuanya bekerja:

1. **Test Login**:
   - Buka `/login`
   - Login dengan credentials admin
   - Harus berhasil dan redirect ke `/admin`

2. **Test Profile**:
   - Buka `/admin/profile`
   - Harus menampilkan data profile dengan role ADMIN

3. **Test Update Profile**:
   - Ubah name di halaman profile
   - Klik **Update Profile**
   - Data harus tersimpan di database

4. **Test Change Password**:
   - Masukkan current password
   - Masukkan new password
   - Klik **Change Password**
   - Coba logout dan login dengan password baru

## Troubleshooting

### Error: "User not found" saat login

**Penyebab**: Profile belum dibuat atau trigger tidak jalan

**Solusi**:
```sql
-- Cek apakah profile ada
SELECT * FROM public."Profile" WHERE email = 'admin@example.com';

-- Jika tidak ada, buat manual
INSERT INTO public."Profile" (id, email, name, role, "createdAt", "updatedAt")
SELECT 
  id,
  email,
  raw_user_meta_data->>'name',
  'ADMIN',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'admin@example.com';
```

### Error: "Invalid credentials"

**Penyebab**: Password salah atau user tidak confirmed

**Solusi**:
```sql
-- Confirm user
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'admin@example.com';

-- Reset password (ganti dengan password baru)
UPDATE auth.users
SET encrypted_password = crypt('PasswordBaru123!', gen_salt('bf'))
WHERE email = 'admin@example.com';
```

### Trigger tidak jalan otomatis

**Penyebab**: Trigger belum dibuat atau ada error

**Solusi**: Jalankan ulang script trigger di `supabase-schema.sql`:

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public."Profile" (id, email, name, role, "createdAt", "updatedAt")
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'USER'),
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Environment Variables

Pastikan `.env` sudah benar:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fmwvuxlnaifkphzaxypo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## Keuntungan Menggunakan Supabase Auth

✅ **Password Hashing Otomatis** - Tidak perlu bcrypt manual
✅ **Email Verification** - Built-in email confirmation
✅ **Password Reset** - Fitur forgot password gratis
✅ **Social Login** - Bisa tambahkan Google, GitHub, dll
✅ **Session Management** - JWT tokens otomatis
✅ **Security** - RLS (Row Level Security) terintegrasi
✅ **Trigger Otomatis** - Profile otomatis dibuat saat signup

## Next Steps

Setelah admin user berhasil dibuat:

1. Login ke `/admin`
2. Mulai tambahkan data portfolio:
   - Stats
   - About
   - Services
   - Skills
   - Projects
   - Platforms
   - Social Media
   - CTA
3. Upload images via admin interface
4. Test semua fitur CRUD
5. Deploy ke Vercel

## Support

Jika masih ada masalah, cek:
- Supabase logs di Dashboard → Logs
- Browser console untuk error
- Network tab untuk failed requests
