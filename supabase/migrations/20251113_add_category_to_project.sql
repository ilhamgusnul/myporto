-- Add category field to Project table
-- This field stores the skill category for filtering projects

ALTER TABLE "Project" 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Create index for better filter performance
CREATE INDEX IF NOT EXISTS idx_project_category ON "Project"(category);

-- Update existing projects to have a default category (optional)
-- You can run specific updates after this migration to set categories for existing projects
