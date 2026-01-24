/**
 * Blog Routes
 * CRUD for blog posts
 */

import { Router } from 'express';
import supabase from '../services/supabase.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/blog - Get all published blog posts
 */
router.get('/', async (req, res) => {
    try {
        const { category, limit = 20, offset = 0 } = req.query;

        let query = supabase
            .from('blog_posts')
            .select('id, title, slug, excerpt, category, author, thumbnail, published_at')
            .eq('published', true)
            .order('published_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (category) {
            query = query.eq('category', category);
        }

        const { data: posts, error } = await query;

        if (error) throw error;

        res.json({ posts: posts || [] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
});

/**
 * GET /api/blog/trending - Get the most read blog post (Trending)
 * Logic: Highest views in the last 7 days (simulated by checking high views + recent or just general high views for now)
 */
router.get('/trending', async (req, res) => {
    try {
        // Ideally we would query a 'post_views' table for counts in the last 7 days.
        // For this version, we'll fetch the post with the highest total views
        const { data: post, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .order('views', { ascending: false })
            .limit(1)
            .single();

        if (error) throw error;

        if (!post) {
            // Fallback if no posts
            return res.status(404).json({ error: 'No trending posts found' });
        }

        res.json({ post });
    } catch (err) {
        console.error('Trending fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch trending post' });
    }
});

/**
 * GET /api/blog/:slug - Get single blog post
 */
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const { data: post, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .eq('published', true)
            .single();

        if (error || !post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({ post });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

/**
 * POST /api/blog - Create blog post (admin only)
 */
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { title, slug, excerpt, content, category, author, thumbnail, published } = req.body;

        const { data: post, error } = await supabase
            .from('blog_posts')
            .insert({
                title,
                slug,
                excerpt,
                content,
                category,
                author: author || req.user.name,
                thumbnail,
                published: published || false,
                published_at: published ? new Date().toISOString() : null
            })
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Post created', post });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

/**
 * PATCH /api/blog/:id - Update blog post (admin only)
 */
router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.published && !updates.published_at) {
            updates.published_at = new Date().toISOString();
        }

        const { error } = await supabase
            .from('blog_posts')
            .update(updates)
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Post updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update post' });
    }
});

/**
 * DELETE /api/blog/:id - Delete blog post (admin only)
 */
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

/**
 * POST /api/blog/track-view - Track blog post view
 */
router.post('/track-view', async (req, res) => {
    try {
        const { postId, postSlug } = req.body;

        if (!postId && !postSlug) {
            return res.status(400).json({ error: 'Post ID or slug required' });
        }

        // Find post
        let query = supabase.from('blog_posts');
        if (postId) {
            query = query.eq('id', postId);
        } else {
            query = query.eq('slug', postSlug);
        }

        const { data: post } = await query.select('id, views').single();

        if (post) {
            // Increment view count
            await supabase
                .from('blog_posts')
                .update({ views: (post.views || 0) + 1 })
                .eq('id', post.id);
        }

        res.json({ success: true });
    } catch (err) {
        // Silent fail for tracking
        res.json({ success: false });
    }
});

/**
 * GET /api/blog/stats/overview - Get blog stats for admin (admin only)
 */
router.get('/stats/overview', requireAuth, requireAdmin, async (req, res) => {
    try {
        // Get total posts
        const { count: totalPosts } = await supabase
            .from('blog_posts')
            .select('*', { count: 'exact', head: true });

        // Get published posts
        const { count: publishedPosts } = await supabase
            .from('blog_posts')
            .select('*', { count: 'exact', head: true })
            .eq('published', true);

        // Get total views
        const { data: viewsData } = await supabase
            .from('blog_posts')
            .select('views');

        const totalViews = viewsData?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;

        // Get top posts by views
        const { data: topPosts } = await supabase
            .from('blog_posts')
            .select('id, title, slug, views, published_at')
            .eq('published', true)
            .order('views', { ascending: false })
            .limit(10);

        // Get posts this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: postsThisMonth } = await supabase
            .from('blog_posts')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfMonth.toISOString());

        res.json({
            totalPosts,
            publishedPosts,
            draftPosts: totalPosts - publishedPosts,
            totalViews,
            postsThisMonth,
            topPosts: topPosts || []
        });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

export default router;

