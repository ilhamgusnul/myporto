-- Migration: Rename imageUrl to avatarUrl in About table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/fmwvuxlnaifkphzaxypo/sql/new

-- 1. Check current column name
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'About' 
AND column_name IN ('imageUrl', 'avatarUrl');

-- 2. Rename imageUrl to avatarUrl if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'About' 
        AND column_name = 'imageUrl'
    ) THEN
        ALTER TABLE public."About" 
        RENAME COLUMN "imageUrl" TO "avatarUrl";
        
        RAISE NOTICE 'Column imageUrl renamed to avatarUrl successfully';
    ELSE
        RAISE NOTICE 'Column imageUrl does not exist, no action needed';
    END IF;
END $$;

-- 3. Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'About' 
AND column_name = 'avatarUrl';

-- 4. Check data after migration
SELECT id, title, "avatarUrl" FROM public."About";
