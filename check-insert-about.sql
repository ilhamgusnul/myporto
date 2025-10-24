-- Check and Insert About Data if Not Exists
-- Run this in Supabase SQL Editor

-- 1. Check if About table exists and has data
SELECT * FROM public."About";

-- 2. If no data, insert default About record
INSERT INTO public."About" (
    id, 
    title, 
    subtitle, 
    tagline, 
    content, 
    "avatarUrl",
    "createdAt", 
    "updatedAt"
)
SELECT 
    gen_random_uuid()::text,
    'Ilham Gusnul Romadhon',
    'Full Stack Developer & Designer',
    'Code by Logic, Design with Passion',
    'Developing digital solutions through a combination of expertise in web & mobile development, UI/UX design, and graphic design. Focused on delivering optimal, efficient results with a strong emphasis on user experience. A commitment to detail and quality is the top priority in every project.',
    NULL,
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM public."About");

-- 3. Verify data was inserted
SELECT * FROM public."About";

-- 4. If you need to update existing record with your information
-- UPDATE public."About" 
-- SET 
--     title = 'Ilham Gusnul Romadhon',
--     subtitle = 'Full Stack Developer & Designer',
--     tagline = 'Code by Logic, Design with Passion',
--     content = 'Your detailed description here...',
--     "updatedAt" = NOW()
-- WHERE id = (SELECT id FROM public."About" LIMIT 1);
