-- Migration: 002_research_lab.sql
-- Description: Enhances the 'research' table with scholarly fields and creates the 'labs' table for the backend-driven R&D system.

-- ============================================================
-- 1. ENHANCE RESEARCH TABLE
-- ============================================================

ALTER TABLE IF EXISTS research
  ADD COLUMN IF NOT EXISTS abstract TEXT,
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS authors JSONB,
  ADD COLUMN IF NOT EXISTS author TEXT,
  ADD COLUMN IF NOT EXISTS affiliations JSONB,
  ADD COLUMN IF NOT EXISTS keywords TEXT[],
  ADD COLUMN IF NOT EXISTS methodology TEXT,
  ADD COLUMN IF NOT EXISTS introduction TEXT,
  ADD COLUMN IF NOT EXISTS results TEXT,
  ADD COLUMN IF NOT EXISTS discussion TEXT,
  ADD COLUMN IF NOT EXISTS limitations TEXT,
  ADD COLUMN IF NOT EXISTS conclusion TEXT,
  ADD COLUMN IF NOT EXISTS references_list TEXT,
  ADD COLUMN IF NOT EXISTS publication_status VARCHAR(50) DEFAULT 'draft' CHECK (publication_status IN ('draft', 'review', 'published', 'archived')),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS doi VARCHAR(255),
  ADD COLUMN IF NOT EXISTS external_identifier VARCHAR(255),
  ADD COLUMN IF NOT EXISTS journal_title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS volume VARCHAR(50),
  ADD COLUMN IF NOT EXISTS issue VARCHAR(50),
  ADD COLUMN IF NOT EXISTS pages VARCHAR(50),
  ADD COLUMN IF NOT EXISTS citation_information TEXT,
  ADD COLUMN IF NOT EXISTS github_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS dataset_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS related_labs UUID[],
  ADD COLUMN IF NOT EXISTS related_blogs UUID[],
  ADD COLUMN IF NOT EXISTS related_trainings UUID[],
  ADD COLUMN IF NOT EXISTS submitter_id UUID,
  ADD COLUMN IF NOT EXISTS citations_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS version VARCHAR(50),
  ADD COLUMN IF NOT EXISTS license VARCHAR(100),
  ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS seo_description TEXT,
  ADD COLUMN IF NOT EXISTS og_image VARCHAR(500);

-- Update RLS for Research to respect publication_status
DROP POLICY IF EXISTS "Research visible to all" ON research;
CREATE POLICY "Research visible to all" ON research
    FOR SELECT USING (published = true OR publication_status = 'published');

-- ============================================================
-- 2. CREATE LABS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS labs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    objectives TEXT,
    prerequisites TEXT,
    tools TEXT[],
    skills TEXT[],
    environment TEXT,
    methodology TEXT,
    instructions TEXT,
    expected_outcome TEXT,
    findings TEXT,
    evidence TEXT,
    limitations TEXT,
    mitre_mappings JSONB,
    yara_rules TEXT,
    sigma_rules TEXT,
    code_artifacts TEXT,
    references_list TEXT,
    related_research UUID[],
    related_blogs UUID[],
    related_trainings UUID[],
    author VARCHAR(255),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    cover_image VARCHAR(500),
    external_resources JSONB
);

-- Indexes for labs
CREATE INDEX IF NOT EXISTS idx_labs_slug ON labs(slug);
CREATE INDEX IF NOT EXISTS idx_labs_status ON labs(status);
CREATE INDEX IF NOT EXISTS idx_labs_category ON labs(category);

-- RLS for labs
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;

-- Public can only see published labs
CREATE POLICY "Published labs visible to all" ON labs
    FOR SELECT USING (status = 'published');

-- Admins can do everything
CREATE POLICY "Admins can manage labs" ON labs
    FOR ALL USING (auth.role() = 'service_role' OR EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    ));

-- Trigger for auto updated_at
CREATE TRIGGER update_labs_updated_at
  BEFORE UPDATE ON labs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
