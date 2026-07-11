import express from 'express';
import supabase from '../services/supabase.js';

const router = express.Router();

/**
 * GET /api/certificates
 * Get all issued certificates (Admin only)
 */
router.get('/', async (req, res) => {
    try {
        const { data: certificates, error } = await supabase
            .from('certificates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error fetching certificates:', error);
            return res.status(500).json({ error: 'Failed to fetch certificates' });
        }

        res.json(certificates);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/certificates/:id
 * Verify a certificate (Public)
 */
router.get('/:id', async (req, res) => {
    try {
        const certId = req.params.id;
        
        const { data: cert, error } = await supabase
            .from('certificates')
            .select('*')
            .eq('cert_id', certId)
            .single();

        if (error || !cert) {
            // Return 404 so the frontend knows it's invalid
            return res.status(404).json({ error: 'Certificate not found or invalid' });
        }

        res.json(cert);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/certificates
 * Save a newly generated certificate
 */
router.post('/', async (req, res) => {
    try {
        const { cert_id, recipient_name, cert_type, course_name, issue_date } = req.body;

        if (!cert_id || !recipient_name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { data, error } = await supabase
            .from('certificates')
            .insert([
                { 
                    cert_id, 
                    recipient_name, 
                    cert_type, 
                    course_name, 
                    issue_date 
                }
            ])
            .select();

        if (error) {
            console.error('Supabase error saving certificate:', error);
            // If duplicate cert_id (23505), handle it gracefully
            if (error.code === '23505') {
                return res.status(409).json({ error: 'Certificate ID already exists' });
            }
            return res.status(500).json({ error: 'Failed to save certificate' });
        }

        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
