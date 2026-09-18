-- Elitech Hub Migration 004: Testimonials System Expansion

-- Add necessary fields to the existing testimonials table
ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS organization TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS author_type TEXT DEFAULT 'client' CHECK (author_type IN ('client', 'student', 'partner', 'researcher', 'community')),
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS service_id TEXT,
ADD COLUMN IF NOT EXISTS project_id TEXT,
ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_testimonials_modtime ON public.testimonials;
CREATE TRIGGER update_testimonials_modtime
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
