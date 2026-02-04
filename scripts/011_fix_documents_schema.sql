-- Fix documents table to allow OCR uploads without file_url
-- The OCR route processes images directly without storing files in storage

-- Make file_url and file_type nullable (they were NOT NULL in original schema)
ALTER TABLE public.documents ALTER COLUMN file_url DROP NOT NULL;
ALTER TABLE public.documents ALTER COLUMN file_type DROP NOT NULL;

-- Add status column if it doesn't exist
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- Add metadata column if it doesn't exist  
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';
