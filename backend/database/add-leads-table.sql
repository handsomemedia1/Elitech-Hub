-- Leads table for popup email/WhatsApp capture
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    segment VARCHAR(50),          -- 'homepage', 'programs', 'content', 'business'
    source_page VARCHAR(255),     -- which page they were on
    visit_count INTEGER DEFAULT 1,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Prevent duplicate emails
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Index for segment filtering
CREATE INDEX IF NOT EXISTS idx_leads_segment ON leads(segment);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public popup form)
CREATE POLICY "Anyone can submit a lead" ON leads
    FOR INSERT WITH CHECK (true);

-- Only admins can view leads
CREATE POLICY "Admins can view leads" ON leads
    FOR SELECT USING (
        auth.role() = 'service_role'
    );
