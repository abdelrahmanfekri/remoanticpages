-- Add config column to pages table for storing template configuration
ALTER TABLE pages ADD COLUMN IF NOT EXISTS config JSONB;

-- Add comment
COMMENT ON COLUMN pages.config IS 'Template configuration stored as JSONB, includes components, theme, and background settings';

