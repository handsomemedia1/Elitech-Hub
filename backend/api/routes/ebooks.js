/**
 * E-books Routes
 * CRUD operations for e-books
 */

import { Router } from 'express';
import supabase from '../services/supabase.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/ebooks - List all published ebooks
 */
router.get('/', async (req, res) => {
    try {
        const { country } = req.query;

        const { data: ebooks, error } = await supabase
            .from('ebooks')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Add price for user's country
        const ebooksWithPrice = ebooks.map(ebook => ({
            ...ebook,
            price: getPriceForCountry(ebook, country),
            currency: getCurrencyForCountry(country)
        }));

        res.json({ ebooks: ebooksWithPrice });
    } catch (err) {
        console.error('Ebooks fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch ebooks' });
    }
});

/**
 * GET /api/ebooks/:id - Get single ebook
 */
router.get('/:id', async (req, res) => {
    try {
        const { data: ebook, error } = await supabase
            .from('ebooks')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !ebook) {
            return res.status(404).json({ error: 'Ebook not found' });
        }

        res.json({ ebook });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch ebook' });
    }
});

/**
 * POST /api/ebooks - Create ebook (admin only)
 */
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { title, description, cover_url, file_url, price_ngn, price_usd } = req.body;

        const { data: ebook, error } = await supabase
            .from('ebooks')
            .insert({
                title,
                description,
                cover_url,
                file_url,
                price_ngn: price_ngn || 15000,
                price_usd: price_usd || 20,
                price_eur: price_usd || 20,
                price_gbp: price_usd || 20,
                published: true
            })
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Ebook created', ebook });
    } catch (err) {
        console.error('Ebook create error:', err);
        res.status(500).json({ error: 'Failed to create ebook' });
    }
});

/**
 * GET /api/ebooks/:id/download - Download ebook (requires purchase)
 */
router.get('/:id/download', requireAuth, async (req, res) => {
    try {
        // Check if user purchased this ebook
        const { data: purchase } = await supabase
            .from('purchases')
            .select('*')
            .eq('user_id', req.user.id)
            .eq('item_type', 'ebook')
            .eq('item_id', req.params.id)
            .eq('payment_status', 'completed')
            .single();

        if (!purchase) {
            return res.status(403).json({ error: 'Purchase required to download' });
        }

        // Get ebook
        const { data: ebook } = await supabase
            .from('ebooks')
            .select('file_url, title')
            .eq('id', req.params.id)
            .single();

        if (!ebook || !ebook.file_url) {
            return res.status(404).json({ error: 'Ebook file not found' });
        }

        // Increment download count
        await supabase
            .from('ebooks')
            .update({ downloads: supabase.sql`downloads + 1` })
            .eq('id', req.params.id);

        // Redirect to file URL
        res.redirect(ebook.file_url);
    } catch (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Download failed' });
    }
});

/**
 * GET /api/ebooks/user/purchased - Get user's purchased ebooks
 */
router.get('/user/purchased', requireAuth, async (req, res) => {
    try {
        const { data: purchases } = await supabase
            .from('purchases')
            .select(`
                *,
                ebooks:item_id (id, title, description, cover_url)
            `)
            .eq('user_id', req.user.id)
            .eq('item_type', 'ebook')
            .eq('payment_status', 'completed');

        res.json({ ebooks: purchases?.map(p => p.ebooks) || [] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch purchases' });
    }
});

// Helper functions
function getPriceForCountry(item, country) {
    if (country === 'NG') return item.price_ngn;
    if (country === 'GB') return item.price_gbp;
    if (['DE', 'FR', 'IT', 'ES'].includes(country)) return item.price_eur;
    return item.price_usd;
}

function getCurrencyForCountry(country) {
    if (country === 'NG') return 'NGN';
    if (country === 'GB') return 'GBP';
    if (['DE', 'FR', 'IT', 'ES'].includes(country)) return 'EUR';
    return 'USD';
}

export default router;
