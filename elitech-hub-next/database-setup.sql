-- ============================================================
-- Elitech Hub — Missing Tables SQL
-- Run this in your Supabase SQL Editor ONLY if these tables
-- don't already exist (the old backend may have created them).
-- ============================================================

-- ── USERS TABLE — new columns for security features ────────────
-- Run these ALTER statements to add the new security columns.
-- They are safe to run even if the users table already exists.

ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;

ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS reset_token_hash TEXT,
  ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Index for fast reset token lookup
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token_hash)
  WHERE reset_token_hash IS NOT NULL;

-- ── TRIGGER: auto-update updated_at on users ──────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- Applications table (for bootcamp apply form)
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program VARCHAR(100),
    program_name VARCHAR(200),
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country VARCHAR(10),
    city VARCHAR(100),
    source VARCHAR(100),
    skill_level VARCHAR(100),
    motivation TEXT,
    status VARCHAR(50) DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'contacted')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_applications_email  ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at DESC);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Public inserts only (form submissions)
DROP POLICY IF EXISTS "Anyone can apply" ON applications;
CREATE POLICY "Anyone can apply" ON applications
    FOR INSERT WITH CHECK (true);

-- Only service role can read
DROP POLICY IF EXISTS "Service role reads applications" ON applications;
CREATE POLICY "Service role reads applications" ON applications
    FOR SELECT USING (auth.role() = 'service_role');

-- ── Contact messages table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    program_interest VARCHAR(100),
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_email   ON messages(email);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read    ON messages(read);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can send message" ON messages;
CREATE POLICY "Anyone can send message" ON messages
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role reads messages" ON messages;
CREATE POLICY "Service role reads messages" ON messages
    FOR SELECT USING (auth.role() = 'service_role');

-- ── Leads / Newsletter table (already exists from old backend) ─
-- Only add if missing:
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    segment VARCHAR(50),
    source_page VARCHAR(255),
    visit_count INTEGER DEFAULT 1,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email   ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_segment        ON leads(segment);
CREATE INDEX IF NOT EXISTS idx_leads_created        ON leads(created_at DESC);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a lead" ON leads;
CREATE POLICY "Anyone can submit a lead" ON leads
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role reads leads" ON leads;
CREATE POLICY "Service role reads leads" ON leads
    FOR SELECT USING (auth.role() = 'service_role');

-- ── Volunteer applications (already exists from old backend) ───
-- Only add if missing:
CREATE TABLE IF NOT EXISTS volunteer_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    role TEXT NOT NULL,
    linkedin_url TEXT,
    portfolio_url TEXT,
    experience TEXT,
    availability TEXT,
    motivation TEXT NOT NULL,
    goals TEXT,
    tools TEXT,
    status TEXT DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'interviewed')),
    admin_notes TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_volunteer_email   ON volunteer_applications(email);
CREATE INDEX IF NOT EXISTS idx_volunteer_status  ON volunteer_applications(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_applied ON volunteer_applications(applied_at DESC);

ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can volunteer" ON volunteer_applications;
CREATE POLICY "Anyone can volunteer" ON volunteer_applications
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role reads volunteers" ON volunteer_applications;
CREATE POLICY "Service role reads volunteers" ON volunteer_applications
    FOR SELECT USING (auth.role() = 'service_role');


-- ============================================================
-- LEGACY LMS & CMS TABLES (Merged from old backend)
-- ============================================================


-- --- FROM schema.sql ---

-- Elitech Hub LMS Database Schema
-- Run this in Supabase SQL Editor

-- Users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(10) DEFAULT 'NG',
    has_access BOOLEAN DEFAULT FALSE,
    role VARCHAR(50) DEFAULT 'student',
    access_granted_at TIMESTAMP,
    access_granted_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500),
    modules_count INTEGER DEFAULT 0,
    price_ngn DECIMAL(10,2),
    price_usd DECIMAL(10,2),
    price_eur DECIMAL(10,2),
    price_gbp DECIMAL(10,2),
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Modules table
CREATE TABLE modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    video_url VARCHAR(500),
    "order" INTEGER NOT NULL,
    duration_min INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Progress table (module completion)
CREATE TABLE progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    UNIQUE(user_id, module_id)
);

-- Certificates table
CREATE TABLE certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    certificate_id VARCHAR(100) UNIQUE NOT NULL,
    user_name VARCHAR(255),
    course_title VARCHAR(500),
    issued_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Payments table
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(50),
    amount DECIMAL(10,2),
    currency VARCHAR(10),
    status VARCHAR(50) DEFAULT 'pending',
    reference VARCHAR(255) UNIQUE,
    provider VARCHAR(50),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    category VARCHAR(100),
    author VARCHAR(255),
    thumbnail VARCHAR(500),
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create admin user (update with your email)
-- Run after creating tables:
-- INSERT INTO users (email, password_hash, name, role, has_access) 
-- VALUES ('admin@elitechhub.com', '$2a$10$...', 'Admin', 'admin', true);

-- Enable Row Level Security (optional)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;


-- --- FROM schema-phase2.sql ---

-- Phase 2 Database Updates for Elitech Hub LMS
-- Run this in Supabase SQL Editor AFTER the initial schema

-- E-books table
CREATE TABLE IF NOT EXISTS ebooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    cover_url VARCHAR(500),
    file_url VARCHAR(500),
    price_ngn DECIMAL(10,2) DEFAULT 15000,
    price_usd DECIMAL(10,2) DEFAULT 20,
    price_eur DECIMAL(10,2) DEFAULT 20,
    price_gbp DECIMAL(10,2) DEFAULT 20,
    published BOOLEAN DEFAULT FALSE,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Purchases table (for courses, ebooks, services)
CREATE TABLE IF NOT EXISTS purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- 'course', 'ebook', 'service'
    item_id UUID,
    reference_code VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2),
    currency VARCHAR(10),
    payment_provider VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    purchased_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Services table (consulting packages)
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    price_ngn DECIMAL(10,2) DEFAULT 150000,
    price_usd DECIMAL(10,2) DEFAULT 200,
    price_eur DECIMAL(10,2) DEFAULT 200,
    price_gbp DECIMAL(10,2) DEFAULT 200,
    includes TEXT[], -- array of features
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Service members table (for those who bought services)
CREATE TABLE IF NOT EXISTS service_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    reference_code VARCHAR(50) UNIQUE NOT NULL,
    access_tag VARCHAR(100) UNIQUE NOT NULL,
    schedule_link VARCHAR(500),
    chat_link VARCHAR(500),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Writers table (for blog writers panel)
CREATE TABLE IF NOT EXISTS writers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    posts_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Update blog_posts to link to writers
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS writer_id UUID REFERENCES writers(id);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0;

-- Enable RLS on new tables
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE writers ENABLE ROW LEVEL SECURITY;

-- Insert default services
INSERT INTO services (title, description, price_ngn, price_usd, includes)
VALUES 
('Cybersecurity Training Package', 'Complete hands-on cybersecurity training with mentorship', 150000, 200, 
 ARRAY['1-on-1 Mentorship', 'Live Training Sessions', 'Course Materials', 'E-books Access', 'WhatsApp Support Group', 'Career Guidance']);


-- --- FROM add-research-table.sql ---

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

DROP POLICY IF EXISTS "Research visible to all" ON research;
CREATE POLICY "Research visible to all" ON research
    FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Research admin only write" ON research;
CREATE POLICY "Research admin only write" ON research
    FOR ALL USING (true);

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
-- Elitech Hub Migration 005: Testimonial Collection System

-- 1. Create the testimonial_collection_requests table
CREATE TABLE IF NOT EXISTS public.testimonial_collection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    recipient_name TEXT NOT NULL,
    recipient_email TEXT,
    relationship_type TEXT,
    context TEXT,
    requested_by UUID,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'submitted', 'expired', 'revoked')),
    expires_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    testimonial_id UUID, -- Will be linked after submission
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger for updated_at
CREATE TRIGGER update_testimonial_requests_modtime
    BEFORE UPDATE ON public.testimonial_collection_requests
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE public.testimonial_collection_requests ENABLE ROW LEVEL SECURITY;

-- Policies for requests: Only authenticated users (admins) can view or manage requests
CREATE POLICY "Admins can view collection requests" 
    ON public.testimonial_collection_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert collection requests" 
    ON public.testimonial_collection_requests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update collection requests" 
    ON public.testimonial_collection_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete collection requests" 
    ON public.testimonial_collection_requests FOR DELETE TO authenticated USING (true);
-- Note: Service Role will be used by the public collection form server action to read token validity and update status, bypassing RLS safely.

-- 2. Expand testimonials table
ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS collection_token UUID REFERENCES public.testimonial_collection_requests(token) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS relationship_type TEXT,
ADD COLUMN IF NOT EXISTS relationship_context TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
ADD COLUMN IF NOT EXISTS consent_to_publish BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_to_use_name BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_to_use_photo BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_to_use_organization BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

-- Migrate existing 'is_published' state to 'status'
UPDATE public.testimonials SET status = 'approved' WHERE is_published = true;
UPDATE public.testimonials SET status = 'pending' WHERE is_published = false;

-- Allow source to be 'first_party' or 'imported' in addition to existing check
-- Wait, to alter a CHECK constraint in Postgres, we have to drop it and recreate it.
-- Let's drop the constraint if we know its name. Typically it's table_column_check. 
-- Since we didn't name it explicitly in 001, it might be named `testimonials_source_check`.
DO $$
DECLARE constraint_name text;
BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.testimonials'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) LIKE '%source%';
    
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.testimonials DROP CONSTRAINT ' || constraint_name;
    END IF;
END $$;
-- Re-add source constraint with expanded options
ALTER TABLE public.testimonials ADD CONSTRAINT testimonials_source_check 
CHECK (source IN ('senja', 'trustpilot', 'manual', 'first_party', 'imported', 'linkedin'));

-- Update existing policies for testimonials to use 'status' instead of 'is_published'
DROP POLICY IF EXISTS "Public can view published testimonials" ON public.testimonials;
CREATE POLICY "Public can view published testimonials" 
    ON public.testimonials FOR SELECT TO anon USING (status = 'approved');

-- Allow anonymous users to INSERT into testimonials IF they are using the server action / valid flow.
-- Usually, we restrict INSERT to authenticated users and let the Server Action (using Service Role) handle it, 
-- which is much safer than allowing anon INSERTs. So we will rely on Service Role for the public form submission.
-- No anon INSERT policy needed.

-- Add foreign key from requests to testimonials now that testimonials exists
ALTER TABLE public.testimonial_collection_requests
ADD CONSTRAINT fk_testimonial 
FOREIGN KEY (testimonial_id) REFERENCES public.testimonials(id) ON DELETE SET NULL;
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
