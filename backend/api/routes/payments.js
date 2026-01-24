/**
 * Payment Routes
 * Handles payment processing and verification
 */

import { Router } from 'express';
import supabase from '../services/supabase.js';

const router = Router();

/**
 * POST /api/payments - Save a payment record
 */
router.post('/', async (req, res) => {
    try {
        const { reference, gateway, email, name, phone, program, amount } = req.body;

        // Validate required fields
        if (!reference || !gateway || !email || !name || !program || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Save payment to database
        const { data: payment, error } = await supabase
            .from('payments')
            .insert({
                reference,
                gateway,
                customer_email: email,
                customer_name: name,
                customer_phone: phone,
                program,
                amount,
                currency: 'NGN',
                status: 'pending',
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Payment save error:', error);
            throw error;
        }

        res.json({
            success: true,
            message: 'Payment recorded',
            payment
        });
    } catch (err) {
        console.error('Payment error:', err);
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

/**
 * POST /api/payments/verify/paystack - Verify Paystack payment
 */
router.post('/verify/paystack', async (req, res) => {
    try {
        const { reference } = req.body;

        // Verify with Paystack API
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        const data = await response.json();

        if (data.status && data.data.status === 'success') {
            // Update payment status in database
            await supabase
                .from('payments')
                .update({
                    status: 'completed',
                    verified_at: new Date().toISOString(),
                    gateway_response: data.data
                })
                .eq('reference', reference);

            res.json({ success: true, verified: true, data: data.data });
        } else {
            res.json({ success: false, verified: false, message: 'Payment not verified' });
        }
    } catch (err) {
        console.error('Paystack verification error:', err);
        res.status(500).json({ error: 'Verification failed' });
    }
});

/**
 * POST /api/payments/verify/flutterwave - Verify Flutterwave payment
 */
router.post('/verify/flutterwave', async (req, res) => {
    try {
        const { transaction_id } = req.body;

        // Verify with Flutterwave API
        const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
            headers: {
                'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
            }
        });

        const data = await response.json();

        if (data.status === 'success' && data.data.status === 'successful') {
            // Update payment status in database
            await supabase
                .from('payments')
                .update({
                    status: 'completed',
                    verified_at: new Date().toISOString(),
                    gateway_response: data.data
                })
                .eq('reference', data.data.tx_ref);

            res.json({ success: true, verified: true, data: data.data });
        } else {
            res.json({ success: false, verified: false, message: 'Payment not verified' });
        }
    } catch (err) {
        console.error('Flutterwave verification error:', err);
        res.status(500).json({ error: 'Verification failed' });
    }
});

/**
 * GET /api/payments/:reference - Get payment status
 */
router.get('/:reference', async (req, res) => {
    try {
        const { reference } = req.params;

        const { data: payment, error } = await supabase
            .from('payments')
            .select('*')
            .eq('reference', reference)
            .single();

        if (error || !payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json({ payment });
    } catch (err) {
        console.error('Payment fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch payment' });
    }
});

export default router;
