/**
 * Writer Reminder Cron Job
 * Sends reminders to writers on their posting days
 * Checks if they posted and sends follow-up if not
 */

import cron from 'node-cron';
import supabase from './supabase.js';
import { sendReminderEmail, sendMissedPostEmail } from './email.js';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Get today's day name
 */
function getTodayName() {
    return DAYS[new Date().getDay()];
}

/**
 * Send morning reminders (9 AM)
 */
async function sendMorningReminders() {
    const today = getTodayName();
    console.log(`[Reminder] Checking writers for ${today}...`);

    try {
        // Get writers who should post today
        const { data: writers, error } = await supabase
            .from('writers')
            .select('id, name, email, posting_days')
            .eq('active', true)
            .contains('posting_days', [today]);

        if (error) {
            console.error('Error fetching writers:', error);
            return;
        }

        console.log(`[Reminder] Found ${writers?.length || 0} writers posting today`);

        for (const writer of writers || []) {
            try {
                await sendReminderEmail(writer.email, writer.name, today);
                console.log(`[Reminder] Sent to ${writer.email}`);
            } catch (err) {
                console.error(`Failed to send reminder to ${writer.email}:`, err);
            }
        }
    } catch (err) {
        console.error('Morning reminder error:', err);
    }
}

/**
 * Check for missed posts (8 PM)
 */
async function checkMissedPosts() {
    const today = getTodayName();
    const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    console.log(`[MissedCheck] Checking for missed posts on ${today}...`);

    try {
        // Get writers who should have posted today
        const { data: writers, error } = await supabase
            .from('writers')
            .select('id, name, email, posting_days')
            .eq('active', true)
            .contains('posting_days', [today]);

        if (error) {
            console.error('Error fetching writers:', error);
            return;
        }

        for (const writer of writers || []) {
            // Check if they posted today
            const { data: posts } = await supabase
                .from('blog_posts')
                .select('id')
                .eq('writer_id', writer.id)
                .gte('created_at', todayDate)
                .limit(1);

            if (!posts || posts.length === 0) {
                // No post today - send follow-up
                try {
                    await sendMissedPostEmail(writer.email, writer.name, today);
                    console.log(`[MissedCheck] Sent follow-up to ${writer.email}`);
                } catch (err) {
                    console.error(`Failed to send missed post email to ${writer.email}:`, err);
                }
            } else {
                // Update last_post_date
                await supabase
                    .from('writers')
                    .update({ last_post_date: todayDate })
                    .eq('id', writer.id);
            }
        }
    } catch (err) {
        console.error('Missed post check error:', err);
    }
}

/**
 * Initialize cron jobs
 */
export function initReminderCron() {
    // Morning reminder at 9 AM every day
    cron.schedule('0 9 * * *', () => {
        console.log('[Cron] Running morning reminder...');
        sendMorningReminders();
    }, {
        timezone: 'Africa/Lagos' // Nigerian timezone
    });

    // Evening check at 8 PM every day
    cron.schedule('0 20 * * *', () => {
        console.log('[Cron] Running missed post check...');
        checkMissedPosts();
    }, {
        timezone: 'Africa/Lagos'
    });

    console.log('✅ Writer reminder cron jobs initialized');
}

// Export for testing
export { sendMorningReminders, checkMissedPosts };

export default { initReminderCron, sendMorningReminders, checkMissedPosts };
