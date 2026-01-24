/**
 * Courses Routes
 * Course listing, enrollment, progress
 */

import { Router } from 'express';
import supabase from '../services/supabase.js';
import { requireAuth, requirePaidAccess } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/courses - Get all courses (public)
 */
router.get('/', async (req, res) => {
    try {
        const { country } = req.query;

        const { data: courses, error } = await supabase
            .from('courses')
            .select('id, title, description, thumbnail, modules_count, price_ngn, price_usd, price_eur, price_gbp')
            .eq('published', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Add region-specific pricing
        const coursesWithPricing = courses.map(course => ({
            ...course,
            price: getPriceForCountry(course, country || 'NG'),
            currency: getCurrencyForCountry(country || 'NG')
        }));

        res.json({ courses: coursesWithPricing });
    } catch (err) {
        console.error('Courses fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

/**
 * GET /api/courses/:id - Get single course
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { country } = req.query;

        const { data: course, error } = await supabase
            .from('courses')
            .select(`
                *,
                modules (id, title, order, duration_min)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        course.price = getPriceForCountry(course, country || 'NG');
        course.currency = getCurrencyForCountry(country || 'NG');

        res.json({ course });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch course' });
    }
});

/**
 * GET /api/courses/my-courses - Get user's enrolled courses (requires paid access)
 */
router.get('/my/enrolled', requireAuth, requirePaidAccess, async (req, res) => {
    try {
        const { data: enrollments, error } = await supabase
            .from('enrollments')
            .select(`
                id,
                enrolled_at,
                progress,
                completed_at,
                courses (id, title, description, thumbnail, modules_count)
            `)
            .eq('user_id', req.user.id);

        if (error) throw error;

        res.json({ enrollments });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch enrollments' });
    }
});

/**
 * POST /api/courses/:id/enroll - Enroll in course (requires paid access)
 */
router.post('/:id/enroll', requireAuth, requirePaidAccess, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if already enrolled
        const { data: existing } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', req.user.id)
            .eq('course_id', id)
            .single();

        if (existing) {
            return res.status(400).json({ error: 'Already enrolled in this course' });
        }

        // Enroll
        const { data: enrollment, error } = await supabase
            .from('enrollments')
            .insert({
                user_id: req.user.id,
                course_id: id,
                progress: 0
            })
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Enrolled successfully', enrollment });
    } catch (err) {
        res.status(500).json({ error: 'Failed to enroll' });
    }
});

/**
 * POST /api/courses/modules/:id/complete - Mark module as complete
 */
router.post('/modules/:id/complete', requireAuth, requirePaidAccess, async (req, res) => {
    try {
        const { id } = req.params;

        // Record completion
        const { error } = await supabase
            .from('progress')
            .upsert({
                user_id: req.user.id,
                module_id: id,
                completed: true,
                completed_at: new Date().toISOString()
            });

        if (error) throw error;

        // Update enrollment progress
        await updateEnrollmentProgress(req.user.id, id);

        res.json({ message: 'Module completed' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update progress' });
    }
});

// Helper functions
function getPriceForCountry(course, country) {
    const priceMap = {
        'NG': course.price_ngn,
        'US': course.price_usd,
        'GB': course.price_gbp,
        'UK': course.price_gbp,
        'DE': course.price_eur,
        'FR': course.price_eur,
        'DEFAULT': course.price_usd
    };
    return priceMap[country] || priceMap['DEFAULT'];
}

function getCurrencyForCountry(country) {
    const currencyMap = {
        'NG': 'NGN',
        'US': 'USD',
        'GB': 'GBP',
        'UK': 'GBP',
        'DE': 'EUR',
        'FR': 'EUR',
        'DEFAULT': 'USD'
    };
    return currencyMap[country] || currencyMap['DEFAULT'];
}

async function updateEnrollmentProgress(userId, moduleId) {
    // Get module's course
    const { data: module } = await supabase
        .from('modules')
        .select('course_id')
        .eq('id', moduleId)
        .single();

    if (!module) return;

    // Count completed modules
    const { count: completedCount } = await supabase
        .from('progress')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('completed', true);

    // Get total modules in course
    const { count: totalCount } = await supabase
        .from('modules')
        .select('*', { count: 'exact' })
        .eq('course_id', module.course_id);

    // Update progress percentage
    const progress = Math.round((completedCount / totalCount) * 100);

    await supabase
        .from('enrollments')
        .update({
            progress,
            completed_at: progress === 100 ? new Date().toISOString() : null
        })
        .eq('user_id', userId)
        .eq('course_id', module.course_id);
}

export default router;
