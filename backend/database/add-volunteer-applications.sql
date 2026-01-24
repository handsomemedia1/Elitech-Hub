-- Volunteer applications table
CREATE TABLE IF NOT EXISTS volunteer_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    role TEXT NOT NULL,
    linkedin_url TEXT,
    portfolio_url TEXT,
    experience TEXT NOT NULL,
    availability TEXT NOT NULL,
    motivation TEXT NOT NULL,
    goals TEXT NOT NULL,
    tools TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'interviewed')),
    admin_notes TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_volunteer_email ON volunteer_applications(email);
CREATE INDEX IF NOT EXISTS idx_volunteer_status ON volunteer_applications(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_role ON volunteer_applications(role);
CREATE INDEX IF NOT EXISTS idx_volunteer_applied ON volunteer_applications(applied_at DESC);

-- RLS
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Only allow inserts (public can apply)
CREATE POLICY "Anyone can submit application" ON volunteer_applications
    FOR INSERT WITH CHECK (true);

-- Admins can read all
CREATE POLICY "Admins can view all applications" ON volunteer_applications
    FOR SELECT USING (true);
