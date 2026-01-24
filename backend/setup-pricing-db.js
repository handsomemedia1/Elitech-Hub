/**
 * Supabase Setup Script for Service Pricing
 * Run this to create the necessary tables
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

async function setupDatabase() {
    console.log('🚀 Setting up Supabase database for service pricing...\\n');

    try {
        // Create service_prices table via SQL
        const { error: tableError } = await supabase.rpc('exec_sql', {
            sql: `
                CREATE TABLE IF NOT EXISTS service_prices (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    service_name TEXT UNIQUE NOT NULL,
                    price_ngn INTEGER DEFAULT 0,
                    price_usd INTEGER DEFAULT 0,
                    price_eur INTEGER DEFAULT 0,
                    price_gbp INTEGER DEFAULT 0,
                    unit TEXT DEFAULT 'per project',
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                -- Create index for faster lookups
                CREATE INDEX IF NOT EXISTS idx_service_name ON service_prices(service_name);
            `
        });

        if (tableError) {
            console.log('ℹ️  Note: Table might already exist or SQL execution not available via RPC');
            console.log('   You can create the table manually in Supabase SQL Editor:');
            console.log('');
            console.log('   CREATE TABLE service_prices (');
            console.log('       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
            console.log('       service_name TEXT UNIQUE NOT NULL,');
            console.log('       price_ngn INTEGER DEFAULT 0,');
            console.log('       price_usd INTEGER DEFAULT 0,');
            console.log('       price_eur INTEGER DEFAULT 0,');
            console.log('       price_gbp INTEGER DEFAULT 0,');
            console.log('       unit TEXT DEFAULT \\'per project\\',');
            console.log('       updated_at TIMESTAMP DEFAULT NOW()');
            console.log('   );');
            console.log('');
        }

        // Seed initial data
        console.log('\\n📝 Seeding initial service prices...\\n');

        const services = [
            {
                service_name: 'Corporate Training',
                price_ngn: 500000,
                price_usd: 500,
                price_eur: 450,
                price_gbp: 400,
                unit: 'per day'
            },
            {
                service_name: 'Penetration Testing',
                price_ngn: 800000,
                price_usd: 800,
                price_eur: 720,
                price_gbp: 640,
                unit: 'per project'
            },
            {
                service_name: 'Vulnerability Assessment',
                price_ngn: 600000,
                price_usd: 600,
                price_eur: 540,
                price_gbp: 480,
                unit: 'per assessment'
            },
            {
                service_name: 'Security Consulting',
                price_ngn: 150000,
                price_usd: 150,
                price_eur: 135,
                price_gbp: 120,
                unit: 'hourly'
            },
            {
                service_name: 'Compliance Support',
                price_ngn: 1000000,
                price_usd: 1000,
                price_eur: 900,
                price_gbp: 800,
                unit: 'per audit'
            }
        ];

        for (const service of services) {
            const { data, error } = await supabase
                .from('service_prices')
                .upsert(service, { onConflict: 'service_name' })
                .select();

            if (error) {
                console.log(`   ❌ Failed to seed ${service.service_name}:`, error.message);
            } else {
                console.log(`   ✅ Seeded ${service.service_name}`);
            }
        }

        console.log('\\n✅ Database setup complete!\\n');
        console.log('Next steps:');
        console.log('1. Verify table in Supabase dashboard');
        console.log('2. Start your backend server');
        console.log('3. Test pricing API at /api/services/prices');

    } catch (error) {
        console.error('❌ Setup error:', error);
    }
}

setupDatabase();
