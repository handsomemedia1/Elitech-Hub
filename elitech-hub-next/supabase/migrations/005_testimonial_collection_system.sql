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
