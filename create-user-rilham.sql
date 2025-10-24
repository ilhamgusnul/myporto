-- ============================================================================
-- CREATE USER: rilham2612@gmail.com
-- ============================================================================
-- Password akan di-set saat membuat user di Supabase Dashboard
-- Atau bisa menggunakan script ini dengan password yang sudah di-hash

-- Opsi 1: Via Supabase Dashboard (RECOMMENDED)
-- 1. Buka: https://supabase.com/dashboard/project/fmwvuxlnaifkphzaxypo/auth/users
-- 2. Klik "Add User" atau "Invite User"
-- 3. Isi:
--    Email: rilham2612@gmail.com
--    Password: (password pilihan Anda, minimal 8 karakter)
--    Auto Confirm User: ✅ CENTANG INI!
-- 4. Klik "Create" atau "Send Invite"
-- 5. Jalankan query di bawah untuk set role ADMIN:

UPDATE public."Profile"
SET role = 'ADMIN', name = 'Ilham'
WHERE email = 'rilham2612@gmail.com';

-- ============================================================================
-- Opsi 2: Create User via SQL (Jika sudah tahu password yang di-hash)
-- ============================================================================
-- CATATAN: Password harus di-hash dulu dengan bcrypt
-- Untuk create user baru, lebih mudah pakai Supabase Dashboard (Opsi 1)

-- Contoh jika password: MySecurePass123!
-- Hash bcrypt: $2b$10$... (generate di https://bcrypt-generator.com/)

/*
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
    'rilham2612@gmail.com',
    crypt('YourPasswordHere', gen_salt('bf')), -- GANTI dengan password Anda
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Ilham","role":"ADMIN"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Update profile role to ADMIN (Profile created by trigger)
  UPDATE public."Profile"
  SET role = 'ADMIN', name = 'Ilham'
  WHERE id = new_user_id;

  RAISE NOTICE 'User rilham2612@gmail.com created successfully with ID: %', new_user_id;
END $$;
*/

-- ============================================================================
-- VERIFY USER
-- ============================================================================

-- Cek user di auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'rilham2612@gmail.com';

-- Cek profile
SELECT 
  id,
  email,
  name,
  role,
  "createdAt",
  "updatedAt"
FROM public."Profile" 
WHERE email = 'rilham2612@gmail.com';

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================

-- Jika user ada tapi tidak bisa login:

-- 1. Confirm email user
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'rilham2612@gmail.com';

-- 2. Reset password (ganti NewPassword123! dengan password baru Anda)
UPDATE auth.users
SET encrypted_password = crypt('NewPassword123!', gen_salt('bf'))
WHERE email = 'rilham2612@gmail.com';

-- 3. Ensure profile exists and is ADMIN
INSERT INTO public."Profile" (id, email, name, role, "createdAt", "updatedAt")
SELECT 
  id,
  email,
  'Ilham',
  'ADMIN',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'rilham2612@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'ADMIN', name = 'Ilham';

-- ============================================================================
-- QUICK SETUP COMMANDS
-- ============================================================================

-- Run these in order after creating user via Supabase Dashboard:

-- 1. Set role to ADMIN
UPDATE public."Profile" SET role = 'ADMIN' WHERE email = 'rilham2612@gmail.com';

-- 2. Confirm email (if not auto-confirmed)
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'rilham2612@gmail.com';

-- 3. Verify setup
SELECT 
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  p.role,
  p.name
FROM auth.users u
LEFT JOIN public."Profile" p ON u.id = p.id
WHERE u.email = 'rilham2612@gmail.com';

-- Expected result:
-- email: rilham2612@gmail.com
-- email_confirmed: true
-- role: ADMIN
-- name: Ilham (or your name)

-- ✅ If all above are correct, login should work!
