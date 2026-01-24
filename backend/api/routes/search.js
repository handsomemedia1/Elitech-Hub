/**
 * Search Routes
 * Search courses and blog posts
 */

import { Router } from 'express';
import supabase from '../services/supabase.js';

const router = Router();

/**
 * GET /api/search?q=keyword - Search courses and blog posts
 */
router.get('/', async (req, res) => {
    try {
        const { q, type, country } = req.query;

        if (!q || q.length < 2) {
            return res.status(400).json({ error: 'Search query must be at least 2 characters' });
        }

        const results = { courses: [], blogs: [] };

        // Search courses (if not filtering by blogs only)
        if (!type || type === 'courses' || type === 'all') {
            const { data: courses } = await supabase
                .from('courses')
                .select('id, title, description, thumbnail, price_ngn, price_usd')
                .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
                .eq('published', true)
                .limit(10);

            results.courses = courses || [];
        }

        // Search blog posts (if not filtering by courses only)
        if (!type || type === 'blogs' || type === 'all') {
            const { data: blogs } = await supabase
                .from('blog_posts')
                .select('id, title, excerpt, slug, category, published_at')
                .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,content.ilike.%${q}%`)
                .eq('published', true)
                .order('published_at', { ascending: false })
                .limit(10);

            results.blogs = blogs || [];
        }

        res.json({
            query: q,
            results,
            totalResults: results.courses.length + results.blogs.length
        });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'Search failed' });
    }
});

/**
 * GET /api/search/suggestions?q=keyword - Get search suggestions
 */
router.get('/suggestions', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.json({ suggestions: [] });
        }

        // Get course titles
        const { data: courses } = await supabase
            .from('courses')
            .select('title')
            .ilike('title', `%${q}%`)
            .eq('published', true)
            .limit(5);

        // Get blog titles
        const { data: blogs } = await supabase
            .from('blog_posts')
            .select('title')
            .ilike('title', `%${q}%`)
            .eq('published', true)
            .limit(5);

        const suggestions = [
            ...(courses?.map(c => c.title) || []),
            ...(blogs?.map(b => b.title) || [])
        ].slice(0, 8);

        res.json({ suggestions });
    } catch (err) {
        res.status(500).json({ suggestions: [] });
    }
});

export default router;
