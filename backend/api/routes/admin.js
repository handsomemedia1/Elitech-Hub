/**
 * Admin Routes
 * Grant access, manage users, manage courses
 */

import { Router } from 'express';
import supabase from '../services/supabase.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/admin/grant-access - Grant dashboard access to user
 */
router.post('/grant-access', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { userId, email } = req.body;

        let targetUserId = userId;

        // Find by email if userId not provided
        if (!targetUserId && email) {
            const { data: user } = await supabase
                .from('users')
                .select('id')
                .eq('email', email.toLowerCase())
                .single();

            if (user) targetUserId = user.id;
        }

        if (!targetUserId) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Grant access
        const { error } = await supabase
            .from('users')
            .update({
                has_access: true,
                access_granted_at: new Date().toISOString(),
                access_granted_by: req.user.id
            })
            .eq('id', targetUserId);

        if (error) throw error;

        res.json({ message: 'Access granted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to grant access' });
    }
});

/**
 * POST /api/admin/revoke-access - Revoke dashboard access
 */
router.post('/revoke-access', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { userId } = req.body;

        const { error } = await supabase
            .from('users')
            .update({ has_access: false })
            .eq('id', userId);

        if (error) throw error;

        res.json({ message: 'Access revoked' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to revoke access' });
    }
});

/**
 * GET /api/admin/users - List all users
 */
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, email, name, country, has_access, role, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

/**
 * GET /api/admin/payments - List all payments
 */
router.get('/payments', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { data: payments, error } = await supabase
            .from('payments')
            .select(`
                *,
                users (id, email, name)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ payments });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

/**
 * POST /api/admin/courses - Create course
 */
router.post('/courses', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { title, description, price_ngn, price_usd, price_eur, price_gbp, thumbnail } = req.body;

        const { data: course, error } = await supabase
            .from('courses')
            .insert({
                title,
                description,
                price_ngn,
                price_usd,
                price_eur,
                price_gbp,
                thumbnail,
                published: false,
                modules_count: 0
            })
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Course created', course });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create course' });
    }
});

export default router;
