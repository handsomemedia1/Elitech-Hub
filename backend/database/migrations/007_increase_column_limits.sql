-- Migration: Increase column limits for blog posts and metadata to prevent submission errors

-- 1. Increase blog_posts columns
ALTER TABLE blog_posts ALTER COLUMN title TYPE TEXT;
ALTER TABLE blog_posts ALTER COLUMN slug TYPE TEXT;
ALTER TABLE blog_posts ALTER COLUMN thumbnail TYPE TEXT;
ALTER TABLE blog_posts ALTER COLUMN excerpt TYPE TEXT;

-- 2. Increase post_seo_metadata columns (if the table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'post_seo_metadata') THEN
        ALTER TABLE post_seo_metadata ALTER COLUMN seo_title TYPE TEXT;
        ALTER TABLE post_seo_metadata ALTER COLUMN meta_description TYPE TEXT;
        ALTER TABLE post_seo_metadata ALTER COLUMN focus_keyphrase TYPE TEXT;
        ALTER TABLE post_seo_metadata ALTER COLUMN og_title TYPE TEXT;
        ALTER TABLE post_seo_metadata ALTER COLUMN og_description TYPE TEXT;
        ALTER TABLE post_seo_metadata ALTER COLUMN og_image TYPE TEXT;
    END IF;
END $$;
