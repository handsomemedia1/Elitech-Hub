/**
 * Services Pricing API Routes
 * Public endpoint to get service pricing for frontend
 */

import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Load environment variables FIRST
dotenv.config();

// Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

/**
 * GET /api/services/prices
 * Fetch all service prices (public endpoint)
 */
router.get('/prices', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('service_prices')
            .select('*')
            .order('service_name');

        if (error) throw error;

        res.json({
            success: true,
            prices: data || []
        });

    } catch (error) {
        console.error('Error fetching prices:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch service prices'
        });
    }
});

/**
 * POST /api/admin/services/prices
 * Update service prices (admin only)
 */
router.post('/admin/prices', async (req, res) => {
    try {
        const { service, prices, unit } = req.body;

        if (!service || !prices) {
            return res.status(400).json({
                success: false,
                error: 'Service name and prices are required'
            });
        }

        // Upsert (insert or update)
        const { data, error } = await supabase
            .from('service_prices')
            .upsert({
                service_name: service,
                price_ngn: prices.ngn || 0,
                price_usd: prices.usd || 0,
                price_eur: prices.eur || 0,
                price_gbp: prices.gbp || 0,
                unit: unit || 'per project',
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'service_name'
            })
            .select();

        if (error) throw error;

        res.json({
            success: true,
            data: data?.[0],
            updated: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error updating prices:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update service prices'
        });
    }
});

/**
 * GET /api/admin/services/prices
 * Fetch all prices for admin (with additional metadata)
 */
router.get('/admin/prices', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('service_prices')
            .select('*')
            .order('service_name');

        if (error) throw error;

        res.json({
            success: true,
            prices: data || [],
            count: data?.length || 0
        });

    } catch (error) {
        console.error('Error fetching admin prices:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch service prices'
        });
    }
});

export default router;
