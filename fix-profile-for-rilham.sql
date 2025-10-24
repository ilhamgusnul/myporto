-- Fix: Create Profile for existing Supabase Auth user
-- User ID dari screenshot: 37be5af2-f0a4-445d-a4a3-48ae63c0261
-- Email: rilham2612@gmail.com

-- 1. First, check if Profile already exists
SELECT id, email, name, role FROM public."Profile" WHERE id = '37be5af2-f0a4-445d-a4a3-48ae63c0261';

-- 2. If Profile doesn't exist, create it manually
INSERT INTO public."Profile" (id, email, name, role, "createdAt", "updatedAt")
VALUES (
    '37be5af2-f0a4-445d-a4a3-48ae63c0261'::uuid,
    'rilham2612@gmail.com',
    'Ilham',
    'ADMIN',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    role = 'ADMIN',
    name = 'Ilham',
    "updatedAt" = NOW();

-- 3. Verify Profile was created
SELECT id, email, name, role FROM public."Profile" WHERE email = 'rilham2612@gmail.com';

-- 4. Ensure user email is confirmed in auth.users
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE id = '37be5af2-f0a4-445d-a4a3-48ae63c0261' 
AND email_confirmed_at IS NULL;

-- 5. Final verification - check both tables
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    p.name,
    p.role
FROM auth.users u
LEFT JOIN public."Profile" p ON p.id = u.id
WHERE u.email = 'rilham2612@gmail.com';
