-- Add Google OAuth columns to writers table
ALTER TABLE writers ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;
ALTER TABLE writers ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE writers ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false;
ALTER TABLE writers ADD COLUMN IF NOT EXISTS mfa_secret TEXT;
ALTER TABLE writers ADD COLUMN IF NOT EXISTS posting_days TEXT[] DEFAULT '{}';
ALTER TABLE writers ADD COLUMN IF NOT EXISTS last_post_date DATE;

-- Create index for Google ID lookups
CREATE INDEX IF NOT EXISTS idx_writers_google_id ON writers(google_id);
