-- Elitech Hub Migration 006: Laptops Catalog & Article Feedback

-- 1. Laptops Table
CREATE TABLE IF NOT EXISTS public.laptops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'NGN',
    condition TEXT DEFAULT 'new' CHECK (condition IN ('new', 'uk-used')),
    availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'limited', 'sold', 'reserved')),
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    archived BOOLEAN DEFAULT false,
    
    -- Specifications
    cpu TEXT,
    cpu_generation TEXT,
    ram_gb INTEGER,
    storage_gb INTEGER,
    storage_type TEXT,
    gpu TEXT,
    display_size TEXT,
    display_resolution TEXT,
    os TEXT,
    battery TEXT,
    weight TEXT,
    ports TEXT,
    connectivity TEXT,
    upgradeability TEXT,
    
    -- Suitability and Use Cases
    cybersecurity_suitability TEXT,
    programming_suitability TEXT,
    use_cases TEXT[],
    
    -- Content
    short_description TEXT,
    description TEXT,
    
    -- SEO
    seo_title TEXT,
    seo_description TEXT,
    
    -- Timestamps
    last_inventory_check TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for laptops
CREATE INDEX IF NOT EXISTS idx_laptops_slug ON public.laptops(slug);
CREATE INDEX IF NOT EXISTS idx_laptops_published ON public.laptops(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_laptops_brand ON public.laptops(brand);
CREATE INDEX IF NOT EXISTS idx_laptops_availability ON public.laptops(availability);

-- 2. Laptop Images Table
CREATE TABLE IF NOT EXISTS public.laptop_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laptop_id UUID REFERENCES public.laptops(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_laptop_images_laptop_id ON public.laptop_images(laptop_id);

-- 3. Article Feedback Table
CREATE TABLE IF NOT EXISTS public.article_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL,
    is_helpful BOOLEAN NOT NULL,
    session_id TEXT, -- basic abuse prevention
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_article_feedback_slug ON public.article_feedback(slug);

-- 4. Triggers for updated_at
CREATE TRIGGER update_laptops_modtime
    BEFORE UPDATE ON public.laptops
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 5. Row Level Security
ALTER TABLE public.laptops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laptop_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_feedback ENABLE ROW LEVEL SECURITY;

-- Laptops Public Policies
CREATE POLICY "Public can view published and unarchived laptops"
ON public.laptops FOR SELECT
USING (published = true AND archived = false);

CREATE POLICY "Public can view images of published laptops"
ON public.laptop_images FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.laptops 
        WHERE laptops.id = laptop_images.laptop_id 
        AND laptops.published = true 
        AND laptops.archived = false
    )
);

-- Article Feedback Policies
CREATE POLICY "Anyone can insert article feedback"
ON public.article_feedback FOR INSERT
WITH CHECK (true);

-- (Admin policies are handled via service_role bypassing RLS via api routes)
