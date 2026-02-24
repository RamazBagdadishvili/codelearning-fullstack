-- Migration: Fix missing columns in courses table
-- Run this in your PostgreSQL database (codelearning)

ALTER TABLE courses ADD COLUMN IF NOT EXISTS cover_image VARCHAR(500);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS short_description VARCHAR(500);

-- Update prerequisites type if necessary (assuming it was UUID[] or missing)
-- Note: Changing column type might require casting, but let's first ensure it exists as JSONB
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='prerequisites') THEN
        ALTER TABLE courses ALTER COLUMN prerequisites TYPE JSONB USING prerequisites::text::jsonb;
    ELSE
        ALTER TABLE courses ADD COLUMN prerequisites JSONB;
    END IF;
END $$;
