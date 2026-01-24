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
