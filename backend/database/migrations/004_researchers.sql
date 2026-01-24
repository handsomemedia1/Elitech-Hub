-- Elitech Hub - Researcher Dashboard Database Migration
-- Run this in Supabase SQL Editor

-- =====================================================
-- 1. CREATE RESEARCHERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS researchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    bio TEXT,
    affiliation VARCHAR(255),
    orcid VARCHAR(50),
    profile_image TEXT,
    research_interests TEXT[] DEFAULT '{}',
    linkedin_url TEXT,
    researchgate_url TEXT,
    google_scholar_url TEXT,
    
    -- Metrics
    h_index INTEGER DEFAULT 0,
    total_citations INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    publications_count INTEGER DEFAULT 0,
    
    -- Gamification
    badges TEXT[] DEFAULT '{}',
    level VARCHAR(50) DEFAULT 'New Researcher',
    
    -- Status
    active BOOLEAN DEFAULT TRUE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. MODIFY RESEARCH TABLE
-- =====================================================

-- Ensure research table exists
CREATE TABLE IF NOT EXISTS research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    type VARCHAR(50) DEFAULT 'pdf',
    file_url TEXT,
    thumbnail TEXT,
    views INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns

ALTER TABLE research ADD COLUMN IF NOT EXISTS researcher_id UUID REFERENCES researchers(id);
ALTER TABLE research ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft';
ALTER TABLE research ADD COLUMN IF NOT EXISTS citations INTEGER DEFAULT 0;
ALTER TABLE research ADD COLUMN IF NOT EXISTS downloads INTEGER DEFAULT 0;
ALTER TABLE research ADD COLUMN IF NOT EXISTS abstract TEXT;
ALTER TABLE research ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';
ALTER TABLE research ADD COLUMN IF NOT EXISTS co_authors JSONB DEFAULT '[]';
ALTER TABLE research ADD COLUMN IF NOT EXISTS journal VARCHAR(255);
ALTER TABLE research ADD COLUMN IF NOT EXISTS doi VARCHAR(100);
ALTER TABLE research ADD COLUMN IF NOT EXISTS publication_date DATE;
ALTER TABLE research ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- =====================================================
-- 3. CREATE RESEARCHER ACTIVITY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS researcher_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    researcher_id UUID REFERENCES researchers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'paper_published', 'citation_added', 'download', 'badge_earned'
    data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_researcher_activity_researcher ON researcher_activity(researcher_id);
CREATE INDEX IF NOT EXISTS idx_researcher_activity_type ON researcher_activity(type);

-- =====================================================
-- 4. CREATE FUNCTION TO UPDATE RESEARCHER STATS
-- =====================================================

CREATE OR REPLACE FUNCTION update_researcher_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update researcher's aggregate stats when a paper is published
    IF NEW.status = 'published' AND (OLD IS NULL OR OLD.status != 'published') THEN
        UPDATE researchers SET
            publications_count = (
                SELECT COUNT(*) FROM research 
                WHERE researcher_id = NEW.researcher_id AND status = 'published'
            ),
            total_citations = (
                SELECT COALESCE(SUM(citations), 0) FROM research 
                WHERE researcher_id = NEW.researcher_id
            ),
            total_downloads = (
                SELECT COALESCE(SUM(downloads), 0) FROM research 
                WHERE researcher_id = NEW.researcher_id
            ),
            updated_at = NOW()
        WHERE id = NEW.researcher_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_researcher_stats ON research;
CREATE TRIGGER trigger_update_researcher_stats
    AFTER INSERT OR UPDATE ON research
    FOR EACH ROW
    EXECUTE FUNCTION update_researcher_stats();

-- =====================================================
-- 5. CREATE RESEARCHER LEADERBOARD VIEW
-- =====================================================

CREATE OR REPLACE VIEW researcher_leaderboard AS
SELECT 
    r.id,
    r.name,
    r.affiliation,
    r.publications_count,
    r.total_citations,
    r.h_index,
    COALESCE(array_length(r.badges, 1), 0) as badge_count,
    (COALESCE(r.publications_count, 0) * 10 + COALESCE(r.total_citations, 0) + COALESCE(r.h_index, 0) * 50) as score,
    r.level,
    r.created_at
FROM researchers r
WHERE r.active = TRUE
ORDER BY score DESC;

-- =====================================================
-- 6. RLS POLICIES
-- =====================================================

ALTER TABLE researchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE researcher_activity ENABLE ROW LEVEL SECURITY;

-- Researchers can view their own data
CREATE POLICY "Researchers can view own profile" ON researchers
    FOR SELECT USING (true);

CREATE POLICY "Researchers can update own profile" ON researchers
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Activity visible to owner
CREATE POLICY "Researchers can view own activity" ON researcher_activity
    FOR SELECT USING (auth.uid()::text = researcher_id::text);

-- =====================================================
-- 7. GRANT PERMISSIONS
-- =====================================================

GRANT SELECT ON researcher_leaderboard TO authenticated;

-- =====================================================
-- SUCCESS
-- =====================================================

SELECT 'Researcher Dashboard migration completed successfully!' as message;
