-- =====================================================
-- Migration 005: Professional Research Platform
-- Adds enhanced fields for academic publishing
-- =====================================================

-- Extend research table with professional fields
ALTER TABLE research ADD COLUMN IF NOT EXISTS structured_content JSONB;
ALTER TABLE research ADD COLUMN IF NOT EXISTS figures JSONB DEFAULT '[]';
ALTER TABLE research ADD COLUMN IF NOT EXISTS co_authors JSONB DEFAULT '[]';

-- Quality Control Fields
ALTER TABLE research ADD COLUMN IF NOT EXISTS plagiarism_claimed FLOAT;
ALTER TABLE research ADD COLUMN IF NOT EXISTS plagiarism_verified FLOAT;
ALTER TABLE research ADD COLUMN IF NOT EXISTS plagiarism_tool TEXT;
ALTER TABLE research ADD COLUMN IF NOT EXISTS plagiarism_report_url TEXT;
ALTER TABLE research ADD COLUMN IF NOT EXISTS grammar_score INTEGER;
ALTER TABLE research ADD COLUMN IF NOT EXISTS grammar_tool TEXT;
ALTER TABLE research ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0;

-- Academic Metadata
ALTER TABLE research ADD COLUMN IF NOT EXISTS orcid TEXT;
ALTER TABLE research ADD COLUMN IF NOT EXISTS license TEXT DEFAULT 'CC-BY-4.0';
ALTER TABLE research ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE research ADD COLUMN IF NOT EXISTS citation_style TEXT DEFAULT 'apa7';
ALTER TABLE research ADD COLUMN IF NOT EXISTS references_json JSONB DEFAULT '[]';

-- Publication Fields
ALTER TABLE research ADD COLUMN IF NOT EXISTS paper_type TEXT DEFAULT 'original'; -- original, review, case-study, survey
ALTER TABLE research ADD COLUMN IF NOT EXISTS ethics_approval TEXT; -- not-required, obtained, pending
ALTER TABLE research ADD COLUMN IF NOT EXISTS funding_source TEXT;
ALTER TABLE research ADD COLUMN IF NOT EXISTS data_availability TEXT;
ALTER TABLE research ADD COLUMN IF NOT EXISTS conflicts_of_interest TEXT;

-- Submission Wizard Progress
ALTER TABLE research ADD COLUMN IF NOT EXISTS submission_step INTEGER DEFAULT 1;
ALTER TABLE research ADD COLUMN IF NOT EXISTS submission_complete BOOLEAN DEFAULT FALSE;

-- Admin Review Fields
ALTER TABLE research ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE research ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE research ADD COLUMN IF NOT EXISTS revision_feedback TEXT;

-- =====================================================
-- Writer Strikes Table (3-Strike System)
-- =====================================================
CREATE TABLE IF NOT EXISTS writer_strikes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    researcher_id UUID REFERENCES researchers(id) ON DELETE CASCADE,
    strike_value FLOAT NOT NULL DEFAULT 1, -- 0.5, 1, or 2 depending on severity
    reason TEXT NOT NULL,
    paper_id UUID REFERENCES research(id),
    claimed_score FLOAT,
    actual_score FLOAT,
    created_by UUID, -- Admin who issued strike
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_strikes_researcher ON writer_strikes(researcher_id);

-- Add strike tracking to researchers table
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS total_strikes FLOAT DEFAULT 0;
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS strike_status TEXT DEFAULT 'good'; -- good, warning, suspended, banned

-- =====================================================
-- Function to update researcher strike count
-- =====================================================
CREATE OR REPLACE FUNCTION update_researcher_strikes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE researchers 
    SET total_strikes = (
        SELECT COALESCE(SUM(strike_value), 0) 
        FROM writer_strikes 
        WHERE researcher_id = NEW.researcher_id
    ),
    strike_status = CASE 
        WHEN (SELECT COALESCE(SUM(strike_value), 0) FROM writer_strikes WHERE researcher_id = NEW.researcher_id) >= 3 THEN 'banned'
        WHEN (SELECT COALESCE(SUM(strike_value), 0) FROM writer_strikes WHERE researcher_id = NEW.researcher_id) >= 2 THEN 'warning'
        ELSE 'good'
    END
    WHERE id = NEW.researcher_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trg_update_strikes ON writer_strikes;
CREATE TRIGGER trg_update_strikes
    AFTER INSERT ON writer_strikes
    FOR EACH ROW
    EXECUTE FUNCTION update_researcher_strikes();

-- =====================================================
-- Paper Submission History (Track revisions)
-- =====================================================
CREATE TABLE IF NOT EXISTS paper_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id UUID REFERENCES research(id) ON DELETE CASCADE,
    revision_number INTEGER NOT NULL,
    changes_made TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID,
    status TEXT DEFAULT 'pending' -- pending, approved, needs_revision, rejected
);

-- =====================================================
-- RLS Policies
-- =====================================================
ALTER TABLE writer_strikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_revisions ENABLE ROW LEVEL SECURITY;

-- Admins can see all strikes
CREATE POLICY admin_view_strikes ON writer_strikes
    FOR ALL USING (true);

-- Researchers can see their own strikes
CREATE POLICY researcher_view_own_strikes ON writer_strikes
    FOR SELECT USING (researcher_id = auth.uid());
