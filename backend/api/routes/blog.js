/**
 * Blog Routes
 * CRUD for blog posts
 */

import { Router } from 'express';
import supabase from '../services/supabase.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { aiRouter } from '../services/ai-router.js';

const router = Router();

/**
 * GET /api/blog - Get all blog posts (admins see all, public sees only published)
 */
router.get('/', async (req, res) => {
    try {
        const { category, limit = 20, offset = 0 } = req.query;

        // Check if the request is from an authenticated admin
        // Use JWT verification (same as auth middleware) since the admin panel sends custom JWTs
        let isAdmin = false;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const jwt = (await import('jsonwebtoken')).default;
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded.userId) {
                    const { data: user } = await supabase
                        .from('users')
                        .select('role')
                        .eq('id', decoded.userId)
                        .single();
                    if (user && user.role === 'admin') {
                        isAdmin = true;
                    }
                }
            } catch (e) {
                // Token invalid — treat as public request
            }
        }

        let query;

        if (isAdmin) {
            // Admin sees ALL posts (published + drafts) with full metadata
            query = supabase
                .from('blog_posts')
                .select('id, title, slug, excerpt, category, author, thumbnail, published, published_at, created_at')
                .order('created_at', { ascending: false })
                .range(offset, Number(offset) + Number(limit) - 1);
        } else {
            // Public only sees published posts, ordered by published date
            query = supabase
                .from('blog_posts')
                .select('id, title, slug, excerpt, category, author, thumbnail, published_at')
                .eq('published', true)
                .order('published_at', { ascending: false })
                .range(offset, Number(offset) + Number(limit) - 1);
        }

        if (category) {
            query = query.eq('category', category);
        }

        const { data: posts, error } = await query;

        if (error) throw error;

        res.json({ posts: posts || [] });
    } catch (err) {
        console.error('Blog fetch error:', err);
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
 * GET /api/blog/admin/:id - Get single blog post by ID for editing (admin only, includes drafts)
 */
router.get('/admin/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { data: post, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
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
 * GET /api/blog/:slug - Get single blog post
 */
router.get('/:slug', async (req, res) => {
    try {
        const { slug: identifier } = req.params;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

        let query = supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true);

        if (isUUID) {
            query = query.eq('id', identifier);
        } else {
            query = query.eq('slug', identifier);
        }

        const { data: post, error } = await query.single();

        if (error || !post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({ post });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

/**
 * POST /api/blog/upload-url - Get signed URL for blog image upload (admin only)
 */
router.post('/upload-url', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { filename, contentType } = req.body;

        if (!filename) {
            return res.status(400).json({ error: 'Filename required' });
        }

        // Sanitize filename and add timestamp
        const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `blog/${Date.now()}-${safeName}`;

        const { data, error } = await supabase.storage
            .from('blog-images')
            .createSignedUploadUrl(path);

        if (error) throw error;

        const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/blog-images/${path}`;

        res.json({
            uploadUrl: data.signedUrl,
            token: data.token,
            path: path,
            publicUrl
        });
    } catch (err) {
        console.error('Blog upload URL error:', err);
        res.status(500).json({ error: 'Failed to generate upload URL' });
    }
});



/**
 * POST /api/blog/seo-check - Check SEO score using AI (admin only)
 */
router.post('/seo-check', requireAuth, requireAdmin, async (req, res) => {
    const { title, content, excerpt } = req.body;
    
    const wordCount = content?.split(/\s+/).length || 0;
    const hasImage = content?.includes('<img') || false;

    try {
        const systemContext = `You are an expert SEO auditor for a cybersecurity training company (Elitech Hub).
Analyze the provided blog post data. You must respond ONLY with a valid JSON object matching this exact schema, with no markdown formatting or backticks:
{
  "seoScore": (number between 0 and 100 representing overall SEO health),
  "feedback": (array of strings, provide 3-5 specific, actionable recommendations to improve SEO, readability, or engagement)
}`;

        const userMessage = `Title: ${title || 'None'}
Excerpt: ${excerpt || 'None'}
Word Count: ${wordCount}
Has Image: ${hasImage}
Content (HTML): ${content || 'None'}`;

        const aiResult = await aiRouter.generate(userMessage, { context: systemContext });
        
        let parsedResult;
        try {
            const cleanedText = aiResult.response.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedResult = JSON.parse(cleanedText);
        } catch (e) {
            console.error('Failed to parse AI JSON:', aiResult.response);
            throw new Error('AI returned invalid format');
        }

        const aiScore = parsedResult.seoScore || (content ? Math.min(100, Math.max(0, parseInt(wordCount / 10))) : 0);
        const autoPublish = aiScore >= 70 && wordCount >= 500 && hasImage;

        let finalFeedback = parsedResult.feedback || [];
        if (wordCount < 500) finalFeedback.unshift(`Add ${500 - wordCount} more words (minimum 500)`);
        if (!hasImage) finalFeedback.unshift('Add at least one image');

        res.json({
            seoScore: aiScore,
            wordCount,
            hasImage,
            canPublish: autoPublish,
            feedback: finalFeedback.length > 0 ? finalFeedback : ['Great! Your post meets all criteria.']
        });
    } catch (err) {
        console.error('AI SEO check failed:', err);
        res.json({
            seoScore: content ? Math.min(100, Math.max(0, parseInt(wordCount / 10))) : 0,
            wordCount,
            hasImage,
            canPublish: false,
            feedback: ['Could not reach AI Service for advanced SEO Audit. Ensure content is high quality.']
        });
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

        const { data: updatedPost, error } = await supabase
            .from('blog_posts')
            .update(updates)
            .eq('id', id)
            .select('writer_id, published')
            .single();

        if (error) throw error;

        // Trigger badge check if assigned to a writer
        if (updatedPost && updatedPost.writer_id) {
            const { checkAndAwardBadges } = await import('../services/gamification.js');
            await checkAndAwardBadges(updatedPost.writer_id);
        }

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

