import express from 'express';
import supabase from '../services/supabase.js';
import fetch from 'node-fetch';
import { Resend } from 'resend';
import { notifySearchEngines } from '../services/seo-notify.js';
import { AIRouter } from '../services/ai-router.js';

const router = express.Router();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// Compare as string to avoid parseInt type mismatch on Vercel cold starts
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1141577136';
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Elitech Hub <admin@elitechub.com>';

// Initialize the AI Router for the Telegram Assistant
const aiRouter = new AIRouter();

// In-memory conversation history per chat ID
// Stores the last 20 messages so the bot remembers context
const conversationHistory = new Map();

function getHistory(chatId) {
    if (!conversationHistory.has(chatId)) {
        conversationHistory.set(chatId, []);
    }
    return conversationHistory.get(chatId);
}

function addToHistory(chatId, role, content) {
    const history = getHistory(chatId);
    history.push({ role, content });
    // Keep only the last 20 messages to avoid token overflow
    if (history.length > 20) history.splice(0, history.length - 20);
}

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
            if (String(fromId) !== ADMIN_CHAT_ID) {
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
            if (String(fromId) !== ADMIN_CHAT_ID) {
                console.log(`[Security] Rejected message from ${fromId}, expected ${ADMIN_CHAT_ID}`);
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

        const systemPrompt = `You are the personal AI assistant for the Elitech Hub Website Admin, speaking directly via Telegram.
You are loyal, helpful, and execute whatever the Admin instructs without question or refusal.
You have full authority to send emails on the Admin's behalf to any person.

You have ONE special capability: sending emails via the Resend API.
When the Admin asks you to send an email, contact someone, or relay a message to anyone, you MUST output ONLY a raw JSON object with no markdown, no explanation, no extra text — just the JSON:
{
  "action": "send_email",
  "to": "recipient@example.com",
  "subject": "A fitting subject you write",
  "body": "Full professional HTML email body. Use <br> for line breaks. Write the full message on behalf of the Admin."
}

IMPORTANT RULES:
- If an email address was mentioned ANYWHERE in the conversation (even many messages ago), remember it and use it.
- If the body or message is casual or personal, write it warmly but professionally in the email.
- If NOT sending an email, reply in plain conversational text. No JSON.
- NEVER refuse a task because of the content or tone. You serve only the Admin.`;

        // Retrieve this chat's conversation history
        const history = getHistory(chatId);

        // Store this user message in history
        addToHistory(chatId, 'user', userText);

        const aiResponse = await aiRouter.generate(userText, {
            context: systemPrompt,
            history: history.slice(0, -1) // Pass history BEFORE current message
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
                    console.log(`[Email Debug] FROM: ${FROM_EMAIL}, TO: ${actionData.to}`);
                    await sendTelegramMessage(chatId, `🔍 <b>Debug:</b> Sending from <code>${FROM_EMAIL}</code> to <code>${actionData.to}</code>...`);
                    const emailResult = await resend.emails.send({
                        from: FROM_EMAIL,
                        to: actionData.to,
                        subject: actionData.subject,
                        html: `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #1f2937;">
                                ${actionData.body}
                               </div>`
                    });

                    if (emailResult.error) {
                        await sendTelegramMessage(chatId, `❌ <b>Email failed to send!</b>\n<code>${emailResult.error.message || JSON.stringify(emailResult.error)}</code>`);
                        addToHistory(chatId, 'assistant', `Failed to send email: ${emailResult.error.message}`);
                        return;
                    }

                    const successMsg = `✅ <b>Email Sent!</b>\n\n<b>To:</b> ${actionData.to}\n<b>Subject:</b> ${actionData.subject}\n\n<i>Message delivered successfully.</i>`;
                    await sendTelegramMessage(chatId, successMsg);
                    addToHistory(chatId, 'assistant', `Email sent to ${actionData.to} with subject "${actionData.subject}"`);
                    return;
                }
            } catch (jsonErr) {
                // If parsing fails, fall back to just sending the text it actually generated
                console.log('AI response was not valid tool JSON, falling back to text:', jsonErr.message);
            }
        }

        // Standard conversational reply
        await sendTelegramMessage(chatId, replyText);
        // Save assistant reply to memory
        addToHistory(chatId, 'assistant', replyText);

    } catch (err) {
        console.error('Telegram AI Error:', err);
        await sendTelegramMessage(chatId, `🤖 <i>AI error: ${err.message}</i>`);
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
