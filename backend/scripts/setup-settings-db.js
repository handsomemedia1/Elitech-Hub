/**
 * Supabase Setup Script for Site Settings
 * Run this to create the necessary tables for dynamic site settings (cohort, prices)
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env from backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

async function setupDatabase() {
    console.log('🚀 Setting up Supabase database for site settings...\n');

    try {
        // Create site_settings table via SQL
        const { error: tableError } = await supabase.rpc('exec_sql', {
            sql: `
                CREATE TABLE IF NOT EXISTS site_settings (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    setting_key TEXT UNIQUE NOT NULL,
                    setting_value JSONB NOT NULL,
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                -- Create index for faster lookups
                CREATE INDEX IF NOT EXISTS idx_setting_key ON site_settings(setting_key);
            `
        });

        if (tableError) {
            console.log('ℹ️  Note: Table might already exist or SQL execution not available via RPC');
            console.log('   You can create the table manually in Supabase SQL Editor:');
            console.log('');
            console.log('   CREATE TABLE site_settings (');
            console.log('       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
            console.log('       setting_key TEXT UNIQUE NOT NULL,');
            console.log('       setting_value JSONB NOT NULL,');
            console.log('       updated_at TIMESTAMP DEFAULT NOW()');
            console.log('   );');
            console.log('');
        }

        // Seed initial data
        console.log('\n📝 Seeding initial site settings...\n');

        const settings = [
            {
                setting_key: 'elitechub_cohort',
                setting_value: { month: "January", year: "2026" }
            },
            {
                setting_key: 'elitechub_prices',
                setting_value: {
                    bootcamp: { ngn: "75000", usd: "75", gbp: "60", eur: "70" },
                    professional: { ngn: "200000", usd: "200", gbp: "160", eur: "185" }
                }
            }
        ];

        for (const setting of settings) {
            const { data, error } = await supabase
                .from('site_settings')
                .upsert(setting, { onConflict: 'setting_key' })
                .select();

            if (error) {
                console.log(`   ❌ Failed to seed ${setting.setting_key}:`, error.message);
            } else {
                console.log(`   ✅ Seeded ${setting.setting_key}`);
            }
        }

        console.log('\n✅ Database setup complete!\n');

    } catch (error) {
        console.error('❌ Setup error:', error);
    }
}

setupDatabase();
