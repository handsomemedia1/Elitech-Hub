-- ============================================================
-- Remediation Migration: Research Repository & Security Fixes
-- Run this in your Supabase SQL Editor to resolve Audit Gaps
-- (C1, C3, C6, H4, M7)
-- ============================================================

-- 1. Ensure 'research' table has all missing columns (C1, H4)
ALTER TABLE research
  ADD COLUMN IF NOT EXISTS submitter_id UUID REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS abstract TEXT,
  ADD COLUMN IF NOT EXISTS keywords TEXT[],
  ADD COLUMN IF NOT EXISTS research_type VARCHAR(100) DEFAULT 'article',
  ADD COLUMN IF NOT EXISTS publication_status VARCHAR(50) DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ, -- H4: Real publication date
  ADD COLUMN IF NOT EXISTS license VARCHAR(100),
  ADD COLUMN IF NOT EXISTS funding_info TEXT,
  ADD COLUMN IF NOT EXISTS conflict_of_interest TEXT,
  ADD COLUMN IF NOT EXISTS ethics_statement TEXT,
  ADD COLUMN IF NOT EXISTS rights_confirmed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS reviewer_notes TEXT,
  ADD COLUMN IF NOT EXISTS similarity_score DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS ai_detection_score DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS citations_count INTEGER DEFAULT 0;

-- H4: Trigger to auto-set published_at when publication_status becomes 'published'
CREATE OR REPLACE FUNCTION set_research_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.publication_status = 'published' AND OLD.publication_status IS DISTINCT FROM 'published' THEN
    NEW.published_at = NOW();
    NEW.published = TRUE;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_research_published_at ON research;
CREATE TRIGGER trigger_research_published_at
  BEFORE UPDATE ON research
  FOR EACH ROW
  EXECUTE FUNCTION set_research_published_at();

-- 2. Create missing relational tables (C1)

-- Researcher Profiles
CREATE TABLE IF NOT EXISTS researcher_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    orcid VARCHAR(50),
    institution VARCHAR(255),
    department VARCHAR(255),
    country VARCHAR(100),
    biography TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Research Authors
CREATE TABLE IF NOT EXISTS research_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    research_id UUID NOT NULL REFERENCES research(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    orcid VARCHAR(50),
    institution VARCHAR(255),
    author_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Research Versions
CREATE TABLE IF NOT EXISTS research_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    research_id UUID NOT NULL REFERENCES research(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    file_url TEXT NOT NULL,
    changes_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Research Identifiers
CREATE TABLE IF NOT EXISTS research_identifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    research_id UUID NOT NULL REFERENCES research(id) ON DELETE CASCADE,
    identifier_type VARCHAR(50) NOT NULL,
    identifier_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(research_id, identifier_type)
);

-- Web Case Studies
CREATE TABLE IF NOT EXISTS web_case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    client_name VARCHAR(255),
    problem TEXT,
    solution TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Atomic Citation Increment RPC (C3)
CREATE OR REPLACE FUNCTION increment_citation_count(paper_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE research
  SET citations_count = COALESCE(citations_count, 0) + 1
  WHERE slug = paper_slug;
END;
$$;

-- 4. Enforce Read Security for Unpublished Papers (C6)
-- ARCHITECTURE NOTE:
-- This application uses a CUSTOM JWT system (elitech_token) signed with JWT_SECRET
-- and is NOT integrated with Supabase Auth. auth.uid() is always NULL for all
-- anon-key or direct API requests. Therefore:
--   - All auth.uid()-based RLS policies have been REMOVED (they are dead code).
--   - Application-layer enforcement (requireAuth, getServerUser) in Next.js API routes
--     uses the service_role key (bypasses RLS) and validates elitech_token.
--   - RLS here implements DENY-BY-DEFAULT for anonymous direct DB access only.
ALTER TABLE research ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Research visible to all" ON research;
DROP POLICY IF EXISTS "Public can view published research" ON research;
DROP POLICY IF EXISTS "Anon can view published research only" ON research;
DROP POLICY IF EXISTS "Submitters can view their own unpublished research" ON research;
DROP POLICY IF EXISTS "Submitter can manage own research" ON research;
DROP POLICY IF EXISTS "Admins can view all research" ON research;
DROP POLICY IF EXISTS "Admins can update all research" ON research;
DROP POLICY IF EXISTS "Admins can delete research" ON research;

-- Only policy: anon key sees published rows only.
-- Service role (used in all API routes) bypasses this.
CREATE POLICY "Anon can view published research only" ON research
  FOR SELECT
  USING (published = true OR publication_status = 'published');

-- 5. RLS for New Tables (same architecture)
ALTER TABLE researcher_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON researcher_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON researcher_profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON researcher_profiles;
DROP POLICY IF EXISTS "Profiles publicly readable" ON researcher_profiles;
CREATE POLICY "Profiles publicly readable" ON researcher_profiles
  FOR SELECT USING (true);
-- INSERT/UPDATE via service_role in API routes only

ALTER TABLE research_authors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public authors viewable" ON research_authors;
DROP POLICY IF EXISTS "Submitter can manage authors" ON research_authors;
DROP POLICY IF EXISTS "Authors publicly readable" ON research_authors;
CREATE POLICY "Authors publicly readable" ON research_authors
  FOR SELECT USING (true);

ALTER TABLE research_versions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public versions viewable" ON research_versions;
DROP POLICY IF EXISTS "Submitter can manage versions" ON research_versions;
-- No anon SELECT on versions: only accessible via service_role in API routes

ALTER TABLE research_identifiers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public identifiers viewable" ON research_identifiers;
DROP POLICY IF EXISTS "Identifiers publicly readable" ON research_identifiers;
CREATE POLICY "Identifiers publicly readable" ON research_identifiers
  FOR SELECT USING (true);

ALTER TABLE web_case_studies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public case studies viewable" ON web_case_studies;
DROP POLICY IF EXISTS "Published case studies publicly readable" ON web_case_studies;
CREATE POLICY "Published case studies publicly readable" ON web_case_studies
  FOR SELECT USING (published = true);

-- 6. Storage Bucket Security (M7)
-- Create a private bucket. ALL direct access is blocked.
-- Files are served ONLY via /api/research/download (service_role signed URL + app-layer auth).
INSERT INTO storage.buckets (id, name, public)
  VALUES ('research-files', 'research-files', false)
  ON CONFLICT (id) DO UPDATE SET public = false;

-- Remove any old storage policies
DROP POLICY IF EXISTS "Block anon access to research files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload research files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can read own research files" ON storage.objects;
-- No new storage SELECT policies: service_role bypasses all storage RLS.

-- OPERATOR ACTION REQUIRED:
-- After running this migration, the admin/lab page (admin/lab/page.tsx line 17)
-- uses an anon-key client-side Supabase query and will be restricted to
-- published-only rows by RLS. Drafts will not appear in the admin lab.
-- Fix: migrate admin/lab to fetch via a protected server-side API route using service_role.
