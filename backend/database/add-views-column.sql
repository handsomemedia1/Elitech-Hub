-- Add views column to blog_posts
-- Run this in Supabase SQL Editor

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create index for faster view queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_views ON blog_posts(views DESC);
