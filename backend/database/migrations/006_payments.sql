-- =============================================
-- Payments Table Migration
-- For Elitech Hub Payment Processing
-- =============================================

-- Drop existing table if it has wrong schema
DROP TABLE IF EXISTS payments CASCADE;

-- payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(255) UNIQUE NOT NULL,
    gateway VARCHAR(50) NOT NULL, -- 'paystack', 'flutterwave', 'selar'
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    program VARCHAR(50) NOT NULL, -- '6week', '16week'
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    gateway_response JSONB,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payments_email ON payments(customer_email);
CREATE INDEX idx_payments_reference ON payments(reference);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- Drop trigger if exists then recreate
DROP TRIGGER IF EXISTS payments_updated_at ON payments;
DROP FUNCTION IF EXISTS update_payments_updated_at();

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_payments_updated_at();

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admin full access to payments" ON payments;

-- RLS Policies
CREATE POLICY "Admin full access to payments"
    ON payments FOR ALL
    USING (true)
    WITH CHECK (true);
