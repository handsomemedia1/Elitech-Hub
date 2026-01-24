-- Research table for papers and video blogs
CREATE TABLE IF NOT EXISTS research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    type TEXT NOT NULL CHECK (type IN ('pdf', 'video', 'article')),
    file_url TEXT, -- For PDF uploads
    youtube_url TEXT, -- For video embeds
    thumbnail TEXT,
    published BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_research_slug ON research(slug);
CREATE INDEX IF NOT EXISTS idx_research_type ON research(type);
CREATE INDEX IF NOT EXISTS idx_research_category ON research(category);

-- Add RLS policies
ALTER TABLE research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Research visible to all" ON research
    FOR SELECT USING (published = true);

CREATE POLICY "Research admin only write" ON research
    FOR ALL USING (true);
