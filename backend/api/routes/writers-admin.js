import { Router } from 'express';
import bcrypt from 'bcryptjs';
import supabase from '../services/supabase.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Get all writers
router.get('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { data: writers, error } = await supabase
            .from('writers')
            .select('id, name, email, active, created_at, posting_days, last_post_date')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ writers });
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

// Update writer details (e.g. Schedule)
router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // e.g. { posting_days: ['Mon', 'Wed'] }

        // Remove sensitive fields if present
        delete updates.password;
        delete updates.id;

        const { data: writer, error } = await supabase
            .from('writers')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Writer updated', writer });
    } catch (err) {
        console.error('Error updating writer:', err);
        res.status(500).json({ error: 'Failed to update writer' });
    }
});

export default router;
