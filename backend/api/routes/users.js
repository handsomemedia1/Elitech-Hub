/**
 * Users Routes
 * Profile, dashboard data
 */

import { Router } from 'express';
import supabase from '../services/supabase.js';
import { requireAuth, requirePaidAccess } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/users/dashboard - Dashboard data (requires paid access)
 */
router.get('/dashboard', requireAuth, requirePaidAccess, async (req, res) => {
    try {
        // Get enrollments with progress
        const { data: enrollments } = await supabase
            .from('enrollments')
            .select(`
                id, progress, enrolled_at, completed_at,
                courses (id, title, thumbnail, modules_count)
            `)
            .eq('user_id', req.user.id);

        // Get certificates
        const { data: certificates } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', req.user.id);

        // Stats
        const totalCourses = enrollments?.length || 0;
        const completedCourses = enrollments?.filter(e => e.completed_at)?.length || 0;
        const inProgress = totalCourses - completedCourses;
        const totalCertificates = certificates?.length || 0;

        res.json({
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email
            },
            stats: {
                totalCourses,
                completedCourses,
                inProgress,
                totalCertificates
            },
            enrollments: enrollments || [],
            certificates: certificates || []
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).json({ error: 'Failed to load dashboard' });
    }
});

/**
 * PATCH /api/users/profile - Update profile
 */
router.patch('/profile', requireAuth, async (req, res) => {
    try {
        const { name, country } = req.body;

        const { error } = await supabase
            .from('users')
            .update({ name, country })
            .eq('id', req.user.id);

        if (error) throw error;

        res.json({ message: 'Profile updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

/**
 * GET /api/users/progress/:courseId - Get course progress
 */
router.get('/progress/:courseId', requireAuth, requirePaidAccess, async (req, res) => {
    try {
        const { courseId } = req.params;

        // Get all modules for course
        const { data: modules } = await supabase
            .from('modules')
            .select('id, title, order')
            .eq('course_id', courseId)
            .order('order');

        // Get completed modules
        const { data: completed } = await supabase
            .from('progress')
            .select('module_id')
            .eq('user_id', req.user.id)
            .eq('completed', true);

        const completedIds = completed?.map(p => p.module_id) || [];

        const modulesWithProgress = modules?.map(m => ({
            ...m,
            completed: completedIds.includes(m.id)
        })) || [];

        res.json({ modules: modulesWithProgress });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

export default router;
