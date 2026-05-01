import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import supabase from '../services/supabase.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Get all writers (include banned status and post count)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        // Try fetching with banned column; fall back if it doesn't exist yet
        let { data: writers, error } = await supabase
            .from('writers')
            .select('id, name, email, active, banned, created_at, posting_days')
            .order('created_at', { ascending: false });

        if (error && error.message && error.message.includes('banned')) {
            // Column doesn't exist yet – fetch without it
            const fallback = await supabase
                .from('writers')
                .select('id, name, email, active, created_at, posting_days')
                .order('created_at', { ascending: false });
            if (fallback.error) throw fallback.error;
            writers = (fallback.data || []).map(w => ({ ...w, banned: false }));
        } else if (error) {
            throw error;
        }

        // Fetch post counts for each writer
        const writersWithCounts = await Promise.all(
            (writers || []).map(async (writer) => {
                const { count } = await supabase
                    .from('blog_posts')
                    .select('id', { count: 'exact', head: true })
                    .eq('writer_id', writer.id);
                return { ...writer, banned: writer.banned || false, post_count: count || 0 };
            })
        );

        res.json({ writers: writersWithCounts });
    } catch (err) {
        console.error('Error fetching writers:', err);
        res.status(500).json({ error: 'Failed to fetch writers' });
    }
});

// Create new writer
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { name, email, password, postingDays } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const { data: writer, error } = await supabase
            .from('writers')
            .insert({
                name,
                email,
                password_hash: passwordHash,
                active: true,
                banned: false,
                posting_days: postingDays || []
            })
            .select('id, name, email, active')
            .single();

        if (error) {
            if (error.code === '23505') { // Unique violation
                return res.status(400).json({ error: 'Email already exists' });
            }
            throw error;
        }

        res.json({ message: 'Writer created successfully', writer });
    } catch (err) {
        console.error('Error creating writer:', err);
        res.status(500).json({ error: 'Failed to create writer' });
    }
});

// Toggle writer status (active/inactive)
router.patch('/:id/toggle-status', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body;

        const { data: writer, error } = await supabase
            .from('writers')
            .update({ active })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ message: `Writer ${active ? 'activated' : 'deactivated'}`, writer });
    } catch (err) {
        console.error('Error updating writer:', err);
        res.status(500).json({ error: 'Failed to update writer status' });
    }
});

// Ban a writer
router.patch('/:id/ban', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { data: writer, error } = await supabase
            .from('writers')
            .update({ banned: true, active: false })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Writer has been banned', writer });
    } catch (err) {
        console.error('Error banning writer:', err);
        res.status(500).json({ error: 'Failed to ban writer' });
    }
});

// Unban a writer
router.patch('/:id/unban', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { data: writer, error } = await supabase
            .from('writers')
            .update({ banned: false, active: true })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Writer has been unbanned', writer });
    } catch (err) {
        console.error('Error unbanning writer:', err);
        res.status(500).json({ error: 'Failed to unban writer' });
    }
});

// Reset writer password
router.post('/:id/reset-password', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Generate a random 12-character password
        const newPassword = crypto.randomBytes(6).toString('hex');

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        const { data: writer, error } = await supabase
            .from('writers')
            .update({ password_hash: passwordHash })
            .eq('id', id)
            .select('id, name, email')
            .single();

        if (error) throw error;

        res.json({
            message: 'Password reset successfully',
            writer,
            newPassword // Admin will see and share this
        });
    } catch (err) {
        console.error('Error resetting writer password:', err);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

// Get writer's posts
router.get('/:id/posts', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { data: posts, error } = await supabase
            .from('blog_posts')
            .select('id, title, slug, published, created_at, published_at')
            .eq('writer_id', id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ posts: posts || [] });
    } catch (err) {
        console.error('Error fetching writer posts:', err);
        res.status(500).json({ error: 'Failed to fetch writer posts' });
    }
});

// Delete a writer permanently
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // First delete or reassign their blog posts
        const { error: postsError } = await supabase
            .from('blog_posts')
            .delete()
            .eq('writer_id', id);

        if (postsError) console.error('Error deleting writer posts:', postsError);

        // Delete the writer
        const { error } = await supabase
            .from('writers')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Writer deleted permanently' });
    } catch (err) {
        console.error('Error deleting writer:', err);
        res.status(500).json({ error: 'Failed to delete writer' });
    }
});

// Update writer details (name, email, posting days)
router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, postingDays, posting_days } = req.body;

        // Build a clean update object (snake_case for Supabase)
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (email !== undefined) updates.email = email;
        // Accept either camelCase (from frontend) or snake_case
        const days = postingDays || posting_days;
        if (days !== undefined) updates.posting_days = days;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        const { data: writer, error } = await supabase
            .from('writers')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Writer updated successfully', writer });
    } catch (err) {
        console.error('Error updating writer:', err);
        res.status(500).json({ error: 'Failed to update writer' });
    }
});

export default router;
