-- Portfolio Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Stat table (statistics displayed on homepage)
CREATE TABLE IF NOT EXISTS "Stat" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CTA (Call to Action) table
CREATE TABLE IF NOT EXISTS "CTA" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "buttonLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About table (about section content)
CREATE TABLE IF NOT EXISTS "About" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    tagline TEXT,
    content TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service table (services offered)
CREATE TABLE IF NOT EXISTS "Service" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SkillGroup table (grouped skills)
CREATE TABLE IF NOT EXISTS "SkillGroup" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}',
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project table (portfolio projects)
CREATE TABLE IF NOT EXISTS "Project" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "imageUrl" TEXT,
    "demoUrl" TEXT,
    "githubUrl" TEXT,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform table (social platforms)
CREATE TABLE IF NOT EXISTS "Platform" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    url TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ContactInfo table (contact information)
CREATE TABLE IF NOT EXISTS "ContactInfo" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message table (contact form messages)
CREATE TABLE IF NOT EXISTS "Message" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SocialMedia table (social media links)
CREATE TABLE IF NOT EXISTS "SocialMedia" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    url TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stat_order ON "Stat"("order");
CREATE INDEX IF NOT EXISTS idx_service_order ON "Service"("order");
CREATE INDEX IF NOT EXISTS idx_skillgroup_order ON "SkillGroup"("order");
CREATE INDEX IF NOT EXISTS idx_project_order ON "Project"("order");
CREATE INDEX IF NOT EXISTS idx_project_featured ON "Project"(featured);
CREATE INDEX IF NOT EXISTS idx_platform_order ON "Platform"("order");
CREATE INDEX IF NOT EXISTS idx_message_read ON "Message"(read);
CREATE INDEX IF NOT EXISTS idx_socialmedia_order ON "SocialMedia"("order");

-- Enable Row Level Security (RLS)
ALTER TABLE "Stat" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CTA" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "About" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SkillGroup" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Platform" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactInfo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialMedia" ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (except Message)
CREATE POLICY "Public read access" ON "Stat" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "CTA" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "About" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Service" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "SkillGroup" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Project" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Platform" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "ContactInfo" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "SocialMedia" FOR SELECT USING (true);

-- Allow insert on Message table (contact form)
CREATE POLICY "Public can insert messages" ON "Message" FOR INSERT WITH CHECK (true);

-- Note: For admin operations (INSERT, UPDATE, DELETE), use service_role key in server-side code
-- Service role bypasses RLS policies

-- ============================================================================
-- OPTIONAL: Create initial admin user
-- ============================================================================
-- Uncomment dan jalankan setelah schema dibuat
-- Ganti email dan password sesuai kebutuhan

/*
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Create admin user in auth.users
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
    'admin@example.com', -- GANTI dengan email Anda
    crypt('Admin123!', gen_salt('bf')), -- GANTI dengan password Anda
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin User","role":"ADMIN"}',
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
  SET role = 'ADMIN', name = 'Admin User'
  WHERE id = new_user_id;

  RAISE NOTICE 'Admin user created successfully with ID: %', new_user_id;
END $$;
*/

-- ============================================================================
-- Profile Table & Auth Integration
-- ============================================================================
-- Create Profile table (linked to auth.users)
-- This table automatically syncs with Supabase Auth users
CREATE TABLE IF NOT EXISTS "Profile" (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Profile
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;

-- Profile policies: anyone can read, only owner can update
CREATE POLICY "Public profiles are viewable by everyone"
ON "Profile" FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON "Profile" FOR UPDATE
USING (auth.uid() = id);

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
