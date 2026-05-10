/**
 * Vercel Cron Routes
 * Handles scheduled tasks on Vercel
 */

import { Router } from 'express';
import { sendMorningReminders, checkMissedPosts } from '../services/reminder-cron.js';

const router = Router();

// Middleware to protect cron routes
const requireCronSecret = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized. Invalid CRON_SECRET.' });
    }
    next();
};

/**
 * GET /api/cron/reminders
 * Morning Reminders (9 AM WAT)
 */
router.get('/reminders', requireCronSecret, async (req, res) => {
    try {
        console.log('[Cron] Triggered morning reminders via Vercel Cron');
        // We don't await because Vercel Serverless Functions time out quickly.
        // Sending emails might take a few seconds, but doing it synchronously is safer for edge.
        await sendMorningReminders();
        res.status(200).json({ status: 'ok', message: 'Morning reminders executed' });
    } catch (error) {
        console.error('[Cron] Morning reminders failed:', error);
        res.status(500).json({ error: 'Failed to run morning reminders' });
    }
});

/**
 * GET /api/cron/missed-posts
 * Missed Post Check (8 PM WAT)
 */
router.get('/missed-posts', requireCronSecret, async (req, res) => {
    try {
        console.log('[Cron] Triggered missed post check via Vercel Cron');
        await checkMissedPosts();
        res.status(200).json({ status: 'ok', message: 'Missed post check executed' });
    } catch (error) {
        console.error('[Cron] Missed post check failed:', error);
        res.status(500).json({ error: 'Failed to run missed post check' });
    }
});

export default router;
