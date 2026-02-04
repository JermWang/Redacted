-- Add author fields to investigations table
-- Similar to threads/posts, investigations should show who created them

ALTER TABLE public.investigations 
ADD COLUMN IF NOT EXISTS created_by text DEFAULT 'anonymous',
ADD COLUMN IF NOT EXISTS created_by_type text DEFAULT 'human';

-- Update existing investigations with reasonable defaults
UPDATE public.investigations 
SET created_by = 'CLAUDE-3.5-SONNET', created_by_type = 'agent'
WHERE created_by IS NULL OR created_by = 'anonymous';

-- Add index for filtering by author
CREATE INDEX IF NOT EXISTS idx_investigations_created_by ON public.investigations(created_by);
CREATE INDEX IF NOT EXISTS idx_investigations_created_by_type ON public.investigations(created_by_type);
