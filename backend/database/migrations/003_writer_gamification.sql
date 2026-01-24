-- Elitech Hub - Writer CMS Database Migration
-- Run this in Supabase SQL Editor

-- =====================================================
-- 1. ADD NEW COLUMNS TO WRITERS TABLE
-- =====================================================

-- Performance tracking columns
ALTER TABLE writers ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0;
ALTER TABLE writers ADD COLUMN IF NOT EXISTS avg_seo_score DECIMAL(5,2) DEFAULT 0;
ALTER TABLE writers ADD COLUMN IF NOT EXISTS avg_grammar_score DECIMAL(5,2) DEFAULT 0;
ALTER TABLE writers ADD COLUMN IF NOT EXISTS total_views INTEGER DEFAULT 0;
ALTER TABLE writers ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}';
ALTER TABLE writers ADD COLUMN IF NOT EXISTS level VARCHAR(50) DEFAULT 'Newcomer';
ALTER TABLE writers ADD COLUMN IF NOT EXISTS has_author_page BOOLEAN DEFAULT FALSE;

-- =====================================================
-- 2. ADD NEW COLUMNS TO BLOG_POSTS TABLE
-- =====================================================

-- Quality scoring columns
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS grammar_score INTEGER;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS plagiarism_score DECIMAL(5,2);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS word_count INTEGER;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- =====================================================
-- 3. CREATE WRITER ACTIVITY TABLE (for tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS writer_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    writer_id UUID REFERENCES writers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'badge_earned', 'post_published', 'quality_check', etc.
    data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_writer_activity_writer ON writer_activity(writer_id);
CREATE INDEX IF NOT EXISTS idx_writer_activity_type ON writer_activity(type);
CREATE INDEX IF NOT EXISTS idx_writer_activity_created ON writer_activity(created_at);

-- =====================================================
-- 4. CREATE MONTHLY WINNERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS monthly_winners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    writer_id UUID REFERENCES writers(id) ON DELETE SET NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    posts_count INTEGER,
    avg_seo_score DECIMAL(5,2),
    total_views INTEGER,
    reward_given BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(year, month)
);

-- =====================================================
-- 5. CREATE FUNCTION TO UPDATE WRITER STATS
-- =====================================================

CREATE OR REPLACE FUNCTION update_writer_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update writer's aggregate stats when a post is published
    IF NEW.published = TRUE AND (OLD IS NULL OR OLD.published = FALSE) THEN
        UPDATE writers SET
            posts_count = posts_count + 1,
            avg_seo_score = (
                SELECT AVG(seo_score) 
                FROM blog_posts 
                WHERE writer_id = NEW.writer_id AND published = TRUE
            ),
            avg_grammar_score = (
                SELECT AVG(grammar_score) 
                FROM blog_posts 
                WHERE writer_id = NEW.writer_id AND published = TRUE AND grammar_score IS NOT NULL
            ),
            total_views = (
                SELECT COALESCE(SUM(views), 0) 
                FROM blog_posts 
                WHERE writer_id = NEW.writer_id
            )
        WHERE id = NEW.writer_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_writer_stats ON blog_posts;
CREATE TRIGGER trigger_update_writer_stats
    AFTER INSERT OR UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_writer_stats();

-- =====================================================
-- 6. CREATE VIEW FOR LEADERBOARD
-- =====================================================

CREATE OR REPLACE VIEW writer_leaderboard AS
SELECT 
    w.id,
    w.name,
    w.posts_count,
    w.avg_seo_score,
    w.total_views,
    COALESCE(array_length(w.badges, 1), 0) as badge_count,
    (COALESCE(w.posts_count, 0) * 10 + COALESCE(w.avg_seo_score, 0) * 5 + COALESCE(w.total_views, 0) / 100) as score,
    w.level,
    w.created_at
FROM writers w
WHERE w.active = TRUE
ORDER BY score DESC;

-- =====================================================
-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- RLS for writer_activity
ALTER TABLE writer_activity ENABLE ROW LEVEL SECURITY;

-- Writers can view their own activity
CREATE POLICY "Writers can view own activity" ON writer_activity
    FOR SELECT USING (auth.uid()::text = writer_id::text);

-- RLS for monthly_winners (public read)
ALTER TABLE monthly_winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view monthly winners" ON monthly_winners
    FOR SELECT USING (true);

-- =====================================================
-- 8. GRANT PERMISSIONS
-- =====================================================

GRANT SELECT ON writer_leaderboard TO authenticated;
GRANT SELECT ON monthly_winners TO authenticated;
GRANT SELECT, INSERT ON writer_activity TO authenticated;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

SELECT 'Migration completed successfully! New tables: writer_activity, monthly_winners. New columns added to writers and blog_posts.' as message;
