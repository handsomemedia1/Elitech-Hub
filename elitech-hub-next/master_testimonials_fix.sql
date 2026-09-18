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
-- Elitech Hub Migration 004: Testimonials System Expansion

-- Add necessary fields to the existing testimonials table
ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS organization TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS author_type TEXT DEFAULT 'client' CHECK (author_type IN ('client', 'student', 'partner', 'researcher', 'community')),
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS service_id TEXT,
ADD COLUMN IF NOT EXISTS project_id TEXT,
ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_testimonials_modtime ON public.testimonials;
CREATE TRIGGER update_testimonials_modtime
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
-- Elitech Hub Migration 005: Testimonial Collection System

-- 1. Create the testimonial_collection_requests table
CREATE TABLE IF NOT EXISTS public.testimonial_collection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    recipient_name TEXT NOT NULL,
    recipient_email TEXT,
    relationship_type TEXT,
    context TEXT,
    requested_by UUID,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'submitted', 'expired', 'revoked')),
    expires_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    testimonial_id UUID, -- Will be linked after submission
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger for updated_at
CREATE TRIGGER update_testimonial_requests_modtime
    BEFORE UPDATE ON public.testimonial_collection_requests
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE public.testimonial_collection_requests ENABLE ROW LEVEL SECURITY;

-- Policies for requests: Only authenticated users (admins) can view or manage requests
CREATE POLICY "Admins can view collection requests" 
    ON public.testimonial_collection_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert collection requests" 
    ON public.testimonial_collection_requests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update collection requests" 
    ON public.testimonial_collection_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete collection requests" 
    ON public.testimonial_collection_requests FOR DELETE TO authenticated USING (true);
-- Note: Service Role will be used by the public collection form server action to read token validity and update status, bypassing RLS safely.

-- 2. Expand testimonials table
ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS collection_token UUID REFERENCES public.testimonial_collection_requests(token) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS relationship_type TEXT,
ADD COLUMN IF NOT EXISTS relationship_context TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
ADD COLUMN IF NOT EXISTS consent_to_publish BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_to_use_name BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_to_use_photo BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_to_use_organization BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

-- Migrate existing 'is_published' state to 'status'
UPDATE public.testimonials SET status = 'approved' WHERE is_published = true;
UPDATE public.testimonials SET status = 'pending' WHERE is_published = false;

-- Allow source to be 'first_party' or 'imported' in addition to existing check
-- Wait, to alter a CHECK constraint in Postgres, we have to drop it and recreate it.
-- Let's drop the constraint if we know its name. Typically it's table_column_check. 
-- Since we didn't name it explicitly in 001, it might be named `testimonials_source_check`.
DO $$
DECLARE constraint_name text;
BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.testimonials'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) LIKE '%source%';
    
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.testimonials DROP CONSTRAINT ' || constraint_name;
    END IF;
END $$;
-- Re-add source constraint with expanded options
ALTER TABLE public.testimonials ADD CONSTRAINT testimonials_source_check 
CHECK (source IN ('senja', 'trustpilot', 'manual', 'first_party', 'imported', 'linkedin'));

-- Update existing policies for testimonials to use 'status' instead of 'is_published'
DROP POLICY IF EXISTS "Public can view published testimonials" ON public.testimonials;
CREATE POLICY "Public can view published testimonials" 
    ON public.testimonials FOR SELECT TO anon USING (status = 'approved');

-- Allow anonymous users to INSERT into testimonials IF they are using the server action / valid flow.
-- Usually, we restrict INSERT to authenticated users and let the Server Action (using Service Role) handle it, 
-- which is much safer than allowing anon INSERTs. So we will rely on Service Role for the public form submission.
-- No anon INSERT policy needed.

-- Add foreign key from requests to testimonials now that testimonials exists
ALTER TABLE public.testimonial_collection_requests
ADD CONSTRAINT fk_testimonial 
FOREIGN KEY (testimonial_id) REFERENCES public.testimonials(id) ON DELETE SET NULL;
