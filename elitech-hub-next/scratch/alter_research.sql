-- Add new columns for the advanced SSRN-style research portal

ALTER TABLE research
  ADD COLUMN IF NOT EXISTS abstract TEXT,
  ADD COLUMN IF NOT EXISTS authors JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS doi VARCHAR(255),
  ADD COLUMN IF NOT EXISTS citations_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS downloads_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT;
