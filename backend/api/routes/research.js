/**
 * Research Routes
 * Upload and manage research papers and video blogs
 */

import { Router } from 'express';
import supabase from '../services/supabase.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/research - List all research papers
 */
router.get('/', async (req, res) => {
    try {
        const { data: research, error } = await supabase
            .from('research')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ research: research || [] });
    } catch (err) {
        console.error('Research list error:', err);
        res.status(500).json({ error: 'Failed to fetch research' });
    }
});

/**
 * GET /api/research/:idOrSlug - Get single research paper (by ID or slug)
 */
router.get('/:idOrSlug', async (req, res) => {
    try {
        const { idOrSlug } = req.params;

        // Try to find by ID first (UUID format), then by slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

        let query = supabase
            .from('research')
            .select(`
                *,
                researchers (id, name, email, affiliation, orcid, google_scholar_url)
            `);

        if (isUUID) {
            query = query.eq('id', idOrSlug);
        } else {
            query = query.eq('slug', idOrSlug);
        }

        const { data: paper, error } = await query.single();

        if (error || !paper) {
            return res.status(404).json({ error: 'Paper not found' });
        }

        // Only return published papers for public access
        if (!paper.published && paper.status !== 'published') {
            return res.status(404).json({ error: 'Paper not found or not published' });
        }

        res.json({ paper });
    } catch (err) {
        console.error('Research get error:', err);
        res.status(500).json({ error: 'Failed to fetch research' });
    }
});

/**
 * POST /api/research/:id/view - Track paper view (separate endpoint to avoid skewing data)
 */
router.post('/:id/view', async (req, res) => {
    try {
        const { id } = req.params;

        await supabase.rpc('increment_views', { paper_id: id });

        // Fallback if RPC doesn't exist
        await supabase
            .from('research')
            .update({ views: supabase.raw('views + 1') })
            .eq('id', id);

        res.json({ success: true });
    } catch (err) {
        // Fail silently - view tracking is not critical
        res.json({ success: true });
    }
});

/**
 * POST /api/research - Create research paper (admin only)
 */
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { title, description, category, type, file_url, youtube_url, thumbnail } = req.body;

        if (!title || !type) {
            return res.status(400).json({ error: 'Title and type are required' });
        }

        const slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        const { data: research, error } = await supabase
            .from('research')
            .insert({
                title,
                slug,
                description,
                category: category || 'general',
                type, // 'pdf', 'video', 'article'
                file_url, // For PDFs
                youtube_url, // For video blogs
                thumbnail,
                published: true,
                views: 0
            })
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Research created', research });
    } catch (err) {
        console.error('Research create error:', err);
        res.status(500).json({ error: 'Failed to create research' });
    }
});

/**
 * PATCH /api/research/:id - Update research (admin only)
 */
router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        delete updates.id;
        delete updates.views;

        const { data: research, error } = await supabase
            .from('research')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Research updated', research });
    } catch (err) {
        console.error('Research update error:', err);
        res.status(500).json({ error: 'Failed to update research' });
    }
});

/**
 * DELETE /api/research/:id - Delete research (admin only)
 */
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('research')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Research deleted' });
    } catch (err) {
        console.error('Research delete error:', err);
        res.status(500).json({ error: 'Failed to delete research' });
    }
});

/**
 * POST /api/research/upload-url - Get signed URL for PDF upload
 */
router.post('/upload-url', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { filename, contentType } = req.body;

        if (!filename) {
            return res.status(400).json({ error: 'Filename required' });
        }

        const path = `research/${Date.now()}-${filename}`;

        const { data, error } = await supabase.storage
            .from('research-files')
            .createSignedUploadUrl(path);

        if (error) throw error;

        res.json({
            uploadUrl: data.signedUrl,
            path: data.path,
            publicUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/research-files/${path}`
        });
    } catch (err) {
        console.error('Upload URL error:', err);
        res.status(500).json({ error: 'Failed to generate upload URL' });
    }
});

export default router;
