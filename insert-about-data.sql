-- Insert default About data for portfolio
-- This should be run if the About table is empty

-- 1. Check if About data exists
SELECT * FROM public."About";

-- 2. If empty, insert default About data
INSERT INTO public."About" (id, title, subtitle, tagline, content, "avatarUrl", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid()::text,
    'Ilham Gusnul Romadhon',
    'Full Stack Developer & Designer',
    'Code by Logic, Design with Passion',
    'Developing digital solutions through a combination of expertise in web & mobile development, UI/UX design, and graphic design. Focused on delivering optimal, efficient results with a strong emphasis on user experience. A commitment to detail and quality is the top priority in every project.',
    NULL,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 3. Verify data was inserted
SELECT * FROM public."About";
