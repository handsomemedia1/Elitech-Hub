/**
 * Leads API Route
 * Handles popup lead capture submissions (email + WhatsApp)
 */

import express from 'express';

const router = express.Router();

// Supabase client
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_API_KEY
);

/**
 * POST /api/leads
 * Store a new lead from popup form
 */
router.post('/', async (req, res) => {
    try {
        const { email, whatsapp, segment, page, visits } = req.body;

        // Validate required fields
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Get IP and user agent for analytics
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
            || req.socket?.remoteAddress
            || null;
        const userAgent = req.headers['user-agent'] || null;

        // Upsert: if email already exists, update the record
        const { data: lead, error } = await supabase
            .from('leads')
            .upsert([{
                email: email.toLowerCase().trim(),
                whatsapp: whatsapp || null,
                segment: segment || 'unknown',
                source_page: page || null,
                visit_count: visits || 1,
                ip_address: ipAddress,
                user_agent: userAgent
            }], {
                onConflict: 'email',
                ignoreDuplicates: false  // Update existing record
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase leads error:', error);
            // Still return success to user — don't block UX for DB issues
            return res.json({
                success: true,
                message: 'Thanks for subscribing!'
            });
        }

        console.log(`📧 New lead captured: ${email} (${segment})`);

        res.json({
            success: true,
            message: 'Thanks for subscribing!',
            leadId: lead?.id || null
        });

    } catch (err) {
        console.error('Lead capture error:', err);
        // Still return success — never let backend errors block popup UX
        res.json({
            success: true,
            message: 'Thanks for subscribing!'
        });
    }
});

/**
 * GET /api/leads
 * Get all leads (admin only)
 */
router.get('/', async (req, res) => {
    try {
        // TODO: Add admin authentication check

        const { segment } = req.query;

        let query = supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200);

        if (segment) {
            query = query.eq('segment', segment);
        }

        const { data: leads, error } = await query;

        if (error) {
            throw error;
        }

        res.json({
            success: true,
            count: leads?.length || 0,
            leads: leads || []
        });

    } catch (err) {
        console.error('Get leads error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leads'
        });
    }
});

/**
 * GET /api/leads/stats
 * Get lead capture statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const { data: leads, error } = await supabase
            .from('leads')
            .select('segment, created_at');

        if (error) throw error;

        const stats = {
            total: leads?.length || 0,
            bySegment: {},
            last7Days: 0,
            last30Days: 0
        };

        const now = Date.now();
        const day7 = 7 * 24 * 60 * 60 * 1000;
        const day30 = 30 * 24 * 60 * 60 * 1000;

        (leads || []).forEach(lead => {
            // Count by segment
            stats.bySegment[lead.segment] = (stats.bySegment[lead.segment] || 0) + 1;

            // Count by time
            const age = now - new Date(lead.created_at).getTime();
            if (age <= day7) stats.last7Days++;
            if (age <= day30) stats.last30Days++;
        });

        res.json({ success: true, stats });

    } catch (err) {
        console.error('Lead stats error:', err);
        res.status(500).json({ success: false, message: 'Failed to get stats' });
    }
});

export default router;
