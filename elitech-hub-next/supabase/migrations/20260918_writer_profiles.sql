-- Migration: Elitech-Hub Writer Profiles & Approval Workflow

-- 1. Extend Writers Table with Profile and Workflow Fields
ALTER TABLE public.writers
  ADD COLUMN IF NOT EXISTS display_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
  ADD COLUMN IF NOT EXISTS professional_title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS expertise TEXT[],
  ADD COLUMN IF NOT EXISTS location VARCHAR(255),
  ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS website_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS last_profile_update_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended'));

-- Migrate existing 'active' writers to 'approved'
UPDATE public.writers SET status = 'approved' WHERE active = true;

-- 2. Extend Blog Posts Table for Update Timestamps
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

CREATE OR REPLACE FUNCTION update_blog_posts_modtime()
RETURNS TRIGGER AS $}$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$}$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE PROCEDURE update_blog_posts_modtime();

-- 3. Ensure writer profiles bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('writer_profiles', 'writer_profiles', true) 
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public avatars are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'writer_profiles');
