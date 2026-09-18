-- ============================================================
-- Phase 1 Migration: Research Repository & Web Dev Case Studies
-- ============================================================

-- 1. Researcher Profiles (Extension of users)
CREATE TABLE IF NOT EXISTS researcher_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    orcid VARCHAR(50),
    institution VARCHAR(255),
    department VARCHAR(255),
    country VARCHAR(100),
    research_interests TEXT[],
    biography TEXT,
    avatar_url TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Expand Research Table (Additive Migration)
ALTER TABLE research
  ADD COLUMN IF NOT EXISTS submitter_id UUID REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS abstract TEXT,
  ADD COLUMN IF NOT EXISTS keywords TEXT[],
  ADD COLUMN IF NOT EXISTS research_type VARCHAR(100) DEFAULT 'article', -- preprint, article, technical_report, conference_paper, thesis, review
  ADD COLUMN IF NOT EXISTS publication_status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, under_review, revision_required, accepted, rejected, published
  ADD COLUMN IF NOT EXISTS license VARCHAR(100),
  ADD COLUMN IF NOT EXISTS funding_info TEXT,
  ADD COLUMN IF NOT EXISTS conflict_of_interest TEXT,
  ADD COLUMN IF NOT EXISTS ethics_statement TEXT,
  ADD COLUMN IF NOT EXISTS rights_confirmed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS reviewer_notes TEXT,
  ADD COLUMN IF NOT EXISTS similarity_score DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS ai_detection_score DECIMAL(5,2);

-- 3. Research Authors
CREATE TABLE IF NOT EXISTS research_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    research_id UUID NOT NULL REFERENCES research(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    orcid VARCHAR(50),
    institution VARCHAR(255),
    department VARCHAR(255),
    country VARCHAR(100),
    author_order INTEGER NOT NULL DEFAULT 1,
    is_primary_contact BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Research Versions
CREATE TABLE IF NOT EXISTS research_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    research_id UUID NOT NULL REFERENCES research(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    file_url TEXT NOT NULL,
    changes_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Research Identifiers (DOI, etc.)
CREATE TABLE IF NOT EXISTS research_identifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    research_id UUID NOT NULL REFERENCES research(id) ON DELETE CASCADE,
    identifier_type VARCHAR(50) NOT NULL, -- DOI, arXiv, internal
    identifier_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(research_id, identifier_type)
);

-- 6. Web Development Case Studies
CREATE TABLE IF NOT EXISTS web_case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    client_name VARCHAR(255),
    client_industry VARCHAR(100),
    problem TEXT,
    solution TEXT,
    features TEXT[],
    technologies TEXT[],
    security_implementation TEXT,
    seo_implementation TEXT,
    performance_metrics JSONB, -- { load_time: "1.2s", lighthouse_score: 98 }
    results TEXT,
    live_url TEXT,
    cover_image TEXT,
    screenshots TEXT[],
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Researcher Profiles
ALTER TABLE researcher_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON researcher_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON researcher_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON researcher_profiles FOR UPDATE USING (auth.uid() = id);

-- Update RLS for Research Table (Submitter logic)
-- Note: 'research' table has existing policies: "Research visible to all" (published=true) and "Research admin only write"
DROP POLICY IF EXISTS "Submitter can manage own research" ON research;
CREATE POLICY "Submitter can manage own research" ON research
  FOR ALL USING (auth.uid() = submitter_id);

-- RLS for Research Authors
ALTER TABLE research_authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public authors viewable" ON research_authors FOR SELECT USING (true);
CREATE POLICY "Submitter can manage authors" ON research_authors FOR ALL USING (
    EXISTS (SELECT 1 FROM research WHERE research.id = research_authors.research_id AND research.submitter_id = auth.uid())
);
CREATE POLICY "Admin can manage authors" ON research_authors FOR ALL USING (true); -- Requires auth.role() = 'admin' normally, keeping simple for now

-- RLS for Research Versions
ALTER TABLE research_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public versions viewable" ON research_versions FOR SELECT USING (true);
CREATE POLICY "Submitter can manage versions" ON research_versions FOR ALL USING (
    EXISTS (SELECT 1 FROM research WHERE research.id = research_versions.research_id AND research.submitter_id = auth.uid())
);

-- RLS for Research Identifiers
ALTER TABLE research_identifiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public identifiers viewable" ON research_identifiers FOR SELECT USING (true);
CREATE POLICY "Admin can manage identifiers" ON research_identifiers FOR ALL USING (true);

-- RLS for Web Case Studies
ALTER TABLE web_case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public case studies viewable" ON web_case_studies FOR SELECT USING (published = true);
CREATE POLICY "Admin can manage case studies" ON web_case_studies FOR ALL USING (true);
