-- Elitech Hub Migration 003: Ecosystem Entities, Gamification & Knowledge Graph

-- 1. Writers Gamification Additions
ALTER TABLE public.writers
ADD COLUMN IF NOT EXISTS points INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;

-- 2. Knowledge Graph (Content Relationships)
CREATE TABLE IF NOT EXISTS public.content_relationships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_type TEXT NOT NULL, -- e.g., 'blog', 'research', 'lab', 'resource', 'topic', 'researcher', 'writer', 'advisor'
    source_id UUID NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    relationship_type TEXT, -- e.g., 'related_to', 'authored', 'has_lab', 'expertise_in'
    confidence_score NUMERIC DEFAULT 1.0, -- for AI suggestions
    created_by UUID REFERENCES auth.users(id),
    approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(source_type, source_id, target_type, target_id, relationship_type)
);

-- RLS for content_relationships
ALTER TABLE public.content_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved content_relationships"
ON public.content_relationships FOR SELECT
USING (approved = true);

-- 3. Research Membership Applications (Jan 2027)
CREATE TABLE IF NOT EXISTS public.research_membership_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id), -- Nullable if they haven't created a login account yet
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    country TEXT,
    professional_title TEXT,
    institution TEXT,
    department TEXT,
    research_interests TEXT[],
    specialization TEXT,
    orcid TEXT,
    google_scholar_url TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    research_background TEXT,
    publications TEXT,
    current_projects TEXT,
    motivation TEXT,
    contribution TEXT,
    expectations TEXT,
    supporting_file_url TEXT,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Under Review', 'Shortlisted', 'Accepted', 'Waitlisted', 'Rejected', 'Withdrawn')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for research_membership_applications
ALTER TABLE public.research_membership_applications ENABLE ROW LEVEL SECURITY;

-- Admins can view and manage all applications (assuming auth.users role logic is managed externally, or restricting to just authenticated for now, but usually it's handled via a profile role. For safety, we deny public access.)
CREATE POLICY "Users can insert their own application"
ON public.research_membership_applications FOR INSERT
WITH CHECK (true); -- Anyone can apply (public form)

CREATE POLICY "Users can view their own application"
ON public.research_membership_applications FOR SELECT
USING (user_id = auth.uid()); 

-- 4. Advisors Table
CREATE TABLE IF NOT EXISTS public.advisors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    professional_title TEXT,
    biography TEXT,
    expertise TEXT[],
    areas_of_specialization TEXT[],
    organization TEXT,
    role_at_elitech TEXT,
    advisor_start_date DATE,
    achievements TEXT,
    credentials TEXT,
    publications TEXT,
    profile_image_url TEXT,
    linkedin_url TEXT,
    x_url TEXT,
    personal_website_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'former')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for advisors
ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active advisors"
ON public.advisors FOR SELECT
USING (status = 'active');

-- 5. Researchers Profiles
-- (Assuming researchers are currently stored in users or profiles, we will create a dedicated table or extend existing. A dedicated table is cleaner.)
CREATE TABLE IF NOT EXISTS public.researchers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    biography TEXT,
    profile_image_url TEXT,
    institution TEXT,
    department TEXT,
    country TEXT,
    affiliation TEXT,
    orcid TEXT,
    research_interests TEXT[],
    publications TEXT,
    projects TEXT,
    datasets TEXT,
    linkedin_url TEXT,
    personal_website_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for researchers
ALTER TABLE public.researchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active researchers"
ON public.researchers FOR SELECT
USING (status = 'active');

CREATE POLICY "Researchers can update their own profile"
ON public.researchers FOR UPDATE
USING (user_id = auth.uid());

-- 6. Resources Table (for PDF landing pages)
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    author TEXT,
    resource_type TEXT, -- e.g., 'guide', 'report', 'checklist', 'template'
    topic TEXT,
    publication_date DATE,
    version TEXT,
    file_url TEXT NOT NULL,
    references TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for resources
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published resources"
ON public.resources FOR SELECT
USING (status = 'published');

-- Create trigger functions to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_relationships_modtime
    BEFORE UPDATE ON public.content_relationships
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_research_membership_applications_modtime
    BEFORE UPDATE ON public.research_membership_applications
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_advisors_modtime
    BEFORE UPDATE ON public.advisors
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_researchers_modtime
    BEFORE UPDATE ON public.researchers
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_resources_modtime
    BEFORE UPDATE ON public.resources
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
