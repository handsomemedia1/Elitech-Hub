import express from 'express';
import supabase from '../services/supabase.js';
import fetch from 'node-fetch';
import { Resend } from 'resend';
import { notifySearchEngines } from '../services/seo-notify.js';
import { AIRouter } from '../services/ai-router.js';

const router = express.Router();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8707043989:AAFz8NMLy-63Hjmh8jYz74aKOX_XPbkp5yA';
const ADMIN_CHAT_ID = parseInt(process.env.TELEGRAM_CHAT_ID || '1141577136', 10);
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Elitech Hub <onboarding@resend.dev>';

// Initialize the AI Router for the Telegram Assistant
const aiRouter = new AIRouter();

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

        // 2. Handle Text Messages (AI Assistant)
        if (update.message && update.message.text) {
            const msg = update.message;
            const fromId = msg.from.id;

            // Security: Only Elitech Hub Admin can talk to the AI
            if (fromId !== ADMIN_CHAT_ID) {
                return res.sendStatus(200);
            }

            const text = msg.text.trim();
            await handleAIAssistant(text, msg.chat.id);
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

async function handleAIAssistant(userText, chatId) {
    try {
        // Show typing indicator
        await sendChatAction(chatId, 'typing');

        const systemPrompt = `You are the Elitech Hub Admin AI Assistant. You are chatting directly with the Website Administrator via Telegram. 
You are helpful, concise, and professional. 
IMPORTANT: You have the ability to send official emails to users/writers on behalf of the administration.
If the Admin asks you or instructs you to send an email (e.g. "email john@test.com and say...", or "tell this writer XYZ"), you must output EXACTLY AND ONLY a valid JSON block containing the email details. DO NOT wrap the JSON in markdown code blocks. DO NOT output any other text besides the JSON.
The JSON MUST follow this exact schema:
{
  "action": "send_email",
  "to": "email@example.com",
  "subject": "Email Subject",
  "body": "Formatted HTML body of the email. Use <br> for line breaks."
}

If the Admin is NOT asking you to send an email (e.g. asking a question, complaining, chatting, or asking for advice), you must reply normally in plain text. DO NOT output JSON in normal conversation.`;

        const aiResponse = await aiRouter.generate(userText, {
            context: systemPrompt,
            history: [] // Stateless for now, but could be wired to a DB later
        });

        let replyText = aiResponse.response.trim();

        // Check if the AI outputted a JSON action block
        if (replyText.startsWith('{') && replyText.endsWith('}')) {
            try {
                const actionData = JSON.parse(replyText);
                
                if (actionData.action === 'send_email') {
                    await sendChatAction(chatId, 'typing'); // Keep typing indicator alive
                    
                    if (!process.env.RESEND_API_KEY) {
                        await sendTelegramMessage(chatId, "⚠️ <b>System Alert:</b> I tried to send the email, but the Resend API Key is missing from the server.");
                        return;
                    }

                    // Send the email via Resend
                    await resend.emails.send({
                        from: FROM_EMAIL,
                        to: actionData.to,
                        subject: actionData.subject,
                        html: `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #1f2937;">
                                ${actionData.body}
                               </div>`
                    });

                    await sendTelegramMessage(chatId, `✅ <b>Email Drafted & Sent!</b>\n\n<b>To:</b> ${actionData.to}\n<b>Subject:</b> ${actionData.subject}\n\n<i>Message delivered successfully.</i>`);
                    return;
                }
            } catch (jsonErr) {
                // If parsing fails, fall back to just sending the text it actually generated
                console.log('AI response was not valid tool JSON, falling back to text:', jsonErr.message);
            }
        }

        // Standard conversational reply
        await sendTelegramMessage(chatId, replyText);

    } catch (err) {
        console.error('Telegram AI Error:', err);
        await sendTelegramMessage(chatId, "🤖 <i>Sorry, my AI connection got interrupted. Try again.</i>");
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

async function sendChatAction(chatId, action) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendChatAction`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, action: action })
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
