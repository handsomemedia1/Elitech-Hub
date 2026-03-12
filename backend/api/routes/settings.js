/**
 * Site Settings API Routes
 * Endpoint to get and update dynamic site settings (cohort, prices)
 */

import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

/**
 * GET /api/settings
 * Fetch all site settings (public endpoint)
 */
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*');

        if (error) throw error;

        // Transform array into an object format
        const settingsMap = {};
        if (data && data.length > 0) {
            data.forEach(item => {
                settingsMap[item.setting_key] = item.setting_value;
            });
        }

        res.json({
            success: true,
            settings: settingsMap
        });

    } catch (error) {
        console.error('Error fetching site settings:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch site settings'
        });
    }
});

/**
 * POST /api/settings/admin
 * Update site settings (admin only)
 * The logic assumes the admin authorization middleware is on the route mounted in index.js or called before this endpoint.
 * Note: Add authentication layer inside this block if standard route protection isn't sufficient.
 */
router.post('/admin', async (req, res) => {
    try {
        const { key, value } = req.body;

        if (!key || value === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Setting key and value are required'
            });
        }

        const { data, error } = await supabase
            .from('site_settings')
            .upsert({
                setting_key: key,
                setting_value: value,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'setting_key'
            })
            .select();

        if (error) throw error;

        res.json({
            success: true,
            data: data?.[0],
            message: 'Setting updated successfully'
        });

    } catch (error) {
        console.error('Error updating site setting:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update site setting'
        });
    }
});

export default router;
