import express from 'express';
import { supabase } from '../config/supabase.js';
import fetch from 'node-fetch';
import { Resend } from 'resend';
import { notifySearchEngines } from './writers.js';

const router = express.Router();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8707043989:AAFz8NMLy-63Hjmh8jYz74aKOX_XPbkp5yA';
const ADMIN_CHAT_ID = parseInt(process.env.TELEGRAM_CHAT_ID || '1141577136', 10);
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Elitech Hub <onboarding@resend.dev>';

/**
 * POST /api/telegram/webhook
 * Receives updates from Telegram
 */
router.post('/webhook', async (req, res) => {
    try {
        const update = req.body;
        console.log('[Telegram Webhook]', JSON.stringify(update));

        // 1. Handle Inline Keyboard Button Clicks (Callback Queries)
        if (update.callback_query) {
            const query = update.callback_query;
            const data = query.data; // e.g. "approve_post:12345"
            const fromId = query.from.id;

            // Security: Only allow the Admin to click buttons
            if (fromId !== ADMIN_CHAT_ID) {
                await answerCallbackQuery(query.id, "Unauthorized. Only the Admin can do this.");
                return res.sendStatus(200);
            }

            if (data.startsWith('approve_post:')) {
                const postId = data.split(':')[1];
                await handleApprovePost(postId, query);
            } else if (data.startsWith('reject_post:')) {
                const postId = data.split(':')[1];
                await handleRejectPost(postId, query);
            }

            return res.sendStatus(200);
        }

        // 2. Handle Text Commands (e.g., /email)
        if (update.message && update.message.text) {
            const msg = update.message;
            const fromId = msg.from.id;

            // Security
            if (fromId !== ADMIN_CHAT_ID) {
                return res.sendStatus(200);
            }

            const text = msg.text.trim();

            if (text.startsWith('/email')) {
                await handleSendEmail(text, msg.chat.id);
            }
        }

        res.sendStatus(200);
    } catch (err) {
        console.error('Webhook Error:', err);
        res.sendStatus(500);
    }
});

// --- Handlers ---

async function handleApprovePost(postId, query) {
    try {
        // Find and update the post in Supabase
        const { data: post, error } = await supabase
            .from('blog_posts')
            .update({ 
                published: true, 
                published_at: new Date().toISOString() 
            })
            .eq('id', postId)
            .select()
            .single();

        if (error || !post) {
            await answerCallbackQuery(query.id, "Error: Post not found or already deleted.");
            return;
        }

        await answerCallbackQuery(query.id, "Post Approved successfully!");

        // Fire off SEO pings
        const postUrl = `https://elitechub.com/blog-posts/${post.slug}.html`;
        notifySearchEngines(postUrl).catch(e => console.error(e));

        // Edit original Telegram message to remove buttons and show confirmed status
        const newText = query.message.text + "\n\n✅ <b>STATUS: APPROVED & PUBLISHED</b>";
        await editMessageText(query.message.chat.id, query.message.message_id, newText);

    } catch (err) {
        console.error('Approve post error:', err);
        await answerCallbackQuery(query.id, "Failed to approve post Server Error.");
    }
}

async function handleRejectPost(postId, query) {
    try {
        // Technically stays as draft, we just acknowledge the rejection
        await answerCallbackQuery(query.id, "Post Rejected.");
        
        const newText = query.message.text + "\n\n❌ <b>STATUS: REJECTED</b>";
        await editMessageText(query.message.chat.id, query.message.message_id, newText);
    } catch (err) {
        console.error('Reject post error:', err);
        await answerCallbackQuery(query.id, "Error processing rejection.");
    }
}

async function handleSendEmail(text, chatId) {
    try {
        // Format should be: /email john@example.com "Subject Here" Body of the email...
        // Use a simple regex check or split
        const match = text.match(/^\/email\s+([^\s]+)\s+"([^"]+)"\s+(.+)$/s);
        
        if (!match) {
            await sendTelegramMessage(chatId, "❌ Invalid format.\nUsage:\n`/email writer@elitechhub.com \"Subject Here\" The body of the message`");
            return;
        }

        const toEmail = match[1];
        const subject = match[2];
        const bodyContent = match[3];

        if (!process.env.RESEND_API_KEY) {
            await sendTelegramMessage(chatId, "❌ Resend Email API Key is not configured on the server.");
            return;
        }

        await resend.emails.send({
            from: FROM_EMAIL,
            to: toEmail,
            subject: subject,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                    <p style="white-space: pre-wrap;">${bodyContent}</p>
                   </div>`
        });

        await sendTelegramMessage(chatId, `✅ Email successfully sent to <b>${toEmail}</b>`);

    } catch (err) {
        console.error('Telegram Email Error:', err);
        await sendTelegramMessage(chatId, `❌ Failed to send email:\n${err.message}`);
    }
}

// --- Telegram API Helpers ---

async function answerCallbackQuery(callbackQueryId, text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callbackQueryId, text: text })
    });
}

async function editMessageText(chatId, messageId, newText) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            text: newText,
            parse_mode: 'HTML'
        })
    });
}

async function sendTelegramMessage(chatId, text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        })
    });
}

export default router;
