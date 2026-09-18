-- ============================================
-- Elitech Hub: Testimonials Table
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Create the testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL CHECK (source IN ('senja', 'trustpilot', 'manual')),
  author_name TEXT NOT NULL,
  author_role TEXT,
  quote TEXT NOT NULL,
  rating INT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  avatar_initials TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  external_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint for idempotent upserts
CREATE UNIQUE INDEX IF NOT EXISTS idx_testimonials_source_quote 
  ON testimonials (source, md5(quote));

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public (anon) policy: SELECT only published testimonials
CREATE POLICY "Public can view published testimonials" 
  ON testimonials
  FOR SELECT
  TO anon
  USING (is_published = true);

-- Authenticated users can view ALL testimonials (for admin panel)
CREATE POLICY "Authenticated users can view all testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can update testimonials (for toggling is_published)
CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete testimonials
CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- Service role can do everything (used by sync API route)
-- Note: service_role bypasses RLS by default, no policy needed

-- Add index for faster published queries
CREATE INDEX IF NOT EXISTS idx_testimonials_published 
  ON testimonials (is_published, created_at DESC);
