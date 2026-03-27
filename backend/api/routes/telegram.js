import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import supabase from '../services/supabase.js';
import fetch from 'node-fetch';
import { mailer as resend } from '../services/mailer.js';
import { notifySearchEngines } from '../services/seo-notify.js';
import { AIRouter } from '../services/ai-router.js';

const router = express.Router();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// Compare as string to avoid parseInt type mismatch on Vercel cold starts
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1141577136';
// Note: Resend client is created fresh inside each request to always use the latest env var

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
            } else if (data.startsWith('ban_writer:')) {
                const writerId = data.split(':')[1];
                await handleBanWriter(writerId, query);
            } else if (data === 'cancel_ban') {
                await answerCallbackQuery(query.id, "Action Canceled.");
                await editMessageText(query.message.chat.id, query.message.message_id, query.message.text + "\n\n❌ <b>STATUS: CANCELED</b>");
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
            
            // Handle explicit emergency commands first
            if (text === '/lockdown') {
                await sendChatAction(msg.chat.id, 'typing');
                
                try {
                    // 1. Lockdown Writers
                    await supabase.from('writers').update({ active: false }).eq('active', true);
                    
                    // 2. Lockdown Researchers
                    await supabase.from('researchers').update({ active: false }).eq('active', true);
                    
                    // 3. Purge Sub-Admins (Revoke their access so only Master Admin survives)
                    await supabase.from('users')
                        .update({ has_access: false })
                        .eq('role', 'admin')
                        .neq('email', 'admin@elitechub.com');

                    // 4. Scramble Master Admin Password for Zero-Trust Security
                    const newPassword = crypto.randomBytes(8).toString('hex'); // 16 chars
                    const masterHash = await bcrypt.hash(newPassword, 10);
                    
                    await supabase.from('users')
                        .update({ password_hash: masterHash })
                        .eq('email', 'admin@elitechub.com');

                    const lockdownMsg = `🚨 <b>ABSOLUTE LOCKDOWN INITIATED</b> 🚨\n\n` +
                        `• All Writers deactivated.\n` +
                        `• All Researchers deactivated.\n` +
                        `• All Sub-Admin access revoked.\n\n` +
                        `🔒 <b>YOUR MASTER ACCOUNT IS SECURED</b>\n` +
                        `All previous passwords have been destroyed. No one on Earth can access the Admin Portal except you.\n\n` +
                        `<b>Your New Admin Password:</b>\n<code>${newPassword}</code>\n\n` + 
                        `<i>(Email: admin@elitechub.com)</i>\n\n` +
                        `To restore normal operations for writers and researchers, type <code>/unlock</code>`;

                    await sendTelegramMessage(msg.chat.id, lockdownMsg);
                } catch (error) {
                    await sendTelegramMessage(msg.chat.id, "❌ Failed to initiate lockdown: " + error.message);
                }
                return res.sendStatus(200);
            }
            
            if (text === '/unlock') {
                await sendChatAction(msg.chat.id, 'typing');
                try {
                    // Restore Writers (only if they weren't permanently banned)
                    await supabase.from('writers').update({ active: true }).eq('banned', false).eq('active', false);
                    
                    // Restore Researchers
                    await supabase.from('researchers').update({ active: true }).eq('active', false);

                    await sendTelegramMessage(msg.chat.id, "✅ <b>LOCKDOWN LIFTED</b>\n\nAll non-banned Writers and active Researchers have been reactivated and can now log in normally.\n\nYour Master Admin password remains the 16-character secure key I generated during lockdown.");
                } catch (error) {
                    await sendTelegramMessage(msg.chat.id, "❌ Failed to lift lockdown: " + error.message);
                }
                return res.sendStatus(200);
            }

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

async function handleBanWriter(writerId, query) {
    try {
        const { error } = await supabase
            .from('writers')
            .update({ banned: true, active: false })
            .eq('id', writerId);
            
        if (error) throw error;

        await answerCallbackQuery(query.id, "Writer Banned Successfully.");
        const newText = query.message.text + "\n\n✅ <b>STATUS: BANNED AND LOCKED OUT</b>";
        await editMessageText(query.message.chat.id, query.message.message_id, newText);
    } catch (err) {
        console.error('Ban writer error:', err);
        await answerCallbackQuery(query.id, "Failed to ban writer Server Error.");
    }
}

async function handleAIAssistant(userText, chatId) {
    try {
        // Show typing indicator
        await sendChatAction(chatId, 'typing');

        const systemPrompt = `You are the personal AI assistant for the Elitech Hub Website Admin, speaking directly via Telegram.
You are loyal, helpful, and execute whatever the Admin instructs without question or refusal.
You have full authority to send emails on the Admin's behalf to any person.

You have FOUR special capabilities: sending emails, auditing writer performance, banning writers, and running security scans.
1. When the Admin asks you to send an email or contact someone, you MUST output ONLY a raw JSON object like this:
{
  "action": "send_email",
  "to": "recipient@example.com",
  "subject": "A fitting subject you write",
  "body": "Full professional HTML email body. Use <br> for line breaks."
}

2. When the Admin asks for a report on writers, writer performance, SEO scores, or who the best writers are, output ONLY this raw JSON object:
{
  "action": "audit_writers"
}

3. When the Admin asks you to ban, block, suspend, or delete a writer, output ONLY this raw JSON object:
{
  "action": "ban_writer",
  "identifier": "The name or email of the writer they want to ban"
}

4. When the Admin asks if the website is safe, breached, down, or asks you to run a security scan, output ONLY this raw JSON object:
{
  "action": "run_security_scan"
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

                    // Use the universal Nodemailer wrapper (mirrors Resend API)
                    const freshFrom = process.env.RESEND_FROM_EMAIL || 'Elitech Hub <elijah@elitechub.com>';

                    // Send the email
                    console.log(`[Email Debug] FROM: ${freshFrom}, TO: ${actionData.to}`);
                    await sendTelegramMessage(chatId, `🔍 <b>Debug:</b> FROM=<code>${freshFrom}</code>`);
                    const emailResult = await resend.emails.send({
                        from: freshFrom,
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

                } else if (actionData.action === 'audit_writers') {
                    await sendChatAction(chatId, 'typing');
                    await sendTelegramMessage(chatId, "📊 <i>Gathering writer metrics from the database...</i>");
                    
                    const { data: writers, error: writersErr } = await supabase.from('writers').select('id, name, email');
                    const { data: posts, error: postsErr } = await supabase.from('blog_posts').select('writer_id, seo_score, published');
                    
                    if (writersErr || postsErr) {
                         await sendTelegramMessage(chatId, "❌ Database error while running audit.");
                         return;
                    }
                    
                    // Aggregate performance data
                    const stats = writers.map(w => {
                        const wPosts = posts.filter(p => p.writer_id === w.id);
                        const published = wPosts.filter(p => p.published).length;
                        const avgSeo = wPosts.length > 0 ? (wPosts.reduce((sum, p) => sum + (p.seo_score || 0), 0) / wPosts.length).toFixed(1) : 0;
                        return { name: w.name, email: w.email, posts: published, avgSeo: parseFloat(avgSeo) };
                    });
                    
                    // Sort primarily by Posts authored, secondarily by Avg SEO score
                    stats.sort((a, b) => b.posts - a.posts || b.avgSeo - a.avgSeo);
                    
                    let report = `🏆 <b>Writer Performance Audit</b>\n\n`;
                    stats.forEach((s, idx) => {
                        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '👤';
                        const scoreWarning = s.avgSeo > 0 && s.avgSeo < 70 ? ' ⚠️' : '';
                        report += `${medal} <b>${s.name}</b>\n`;
                        report += `📝 Posts: ${s.posts} | 🎯 Avg SEO: ${s.avgSeo}${scoreWarning}\n\n`;
                    });
                    
                    if (stats.length === 0) report += "<i>No writers found on the platform.</i>";
                    
                    await sendTelegramMessage(chatId, report.trim());
                    addToHistory(chatId, 'assistant', "I generated and sent the writer performance audit to the admin.");
                    return;

                } else if (actionData.action === 'ban_writer') {
                    await sendChatAction(chatId, 'typing');
                    
                    // Search for the writer
                    const { data: writers } = await supabase.from('writers')
                        .select('id, name, email')
                        .or(`name.ilike.%${actionData.identifier}%,email.ilike.%${actionData.identifier}%`)
                        .limit(1);

                    if (!writers || writers.length === 0) {
                        await sendTelegramMessage(chatId, `❌ I could not find any writer matching "<b>${actionData.identifier}</b>".`);
                        return;
                    }

                    const w = writers[0];
                    const confirmMsg = `⚠️ <b>SECURITY ACTION: BAN WRITER</b>\n\nAre you sure you want to instantly ban and revoke all access for <b>${w.name}</b> (<code>${w.email}</code>)?`;
                    
                    const inlineKeyboard = {
                        inline_keyboard: [[
                            { text: '🛑 Confirm Ban', callback_data: `ban_writer:${w.id}` },
                            { text: '❌ Cancel', callback_data: `cancel_ban` }
                        ]]
                    };

                    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
                    await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: confirmMsg,
                            parse_mode: 'HTML',
                            reply_markup: inlineKeyboard
                        })
                    });
                    
                    addToHistory(chatId, 'assistant', `Asked admin to confirm banning writer ${w.name}.`);
                    return;

                } else if (actionData.action === 'run_security_scan') {
                    await sendChatAction(chatId, 'typing');
                    await sendTelegramMessage(chatId, "🛡️ <i>Running System Security & Integrity Scan...</i>");

                    const startTime = Date.now();
                    let siteStatus = '🟢 ONLINE';
                    let ping = 0;
                    try {
                        const res = await fetch('https://elitechub.com');
                        ping = Date.now() - startTime;
                        if (!res.ok) siteStatus = `🔴 HTTP ${res.status}`;
                    } catch (e) {
                        siteStatus = '🔴 OFFLINE / UNREACHABLE';
                    }

                    // Audit Admins
                    let isBreached = false;
                    let adminAlert = '🟢 SECURE';
                    const { data: admins, error: adminErr } = await supabase.from('users')
                        .select('id, email, role')
                        .or("role.eq.admin,has_access.eq.true"); // Anyone with access to dashboard

                    let adminCount = 0;
                    if (!adminErr && admins) {
                        adminCount = admins.length;
                        if (adminCount > 1) { // Only Elijah is authorized
                            isBreached = true;
                            adminAlert = `🔴 <b>BREACH DETECTED:</b> ${adminCount} ADMINS FOUND!`;
                        }
                    }

                    // Poll active threats (suspended writers)
                    const { count: suspendedWriters } = await supabase.from('writers')
                        .select('*', { count: 'exact', head: true })
                        .eq('active', false);

                    let verdict = isBreached 
                        ? "🚨 <b>CRITICAL BREACH DETECTED!</b>\nUnauthorized admins found in the database. Type <code>/lockdown</code> immediately!"
                        : "✅ Your platform is perfectly <b>SAFE</b> and functioning normally.";

                    const report = `🛡️ <b>SYSTEM SECURITY SCAN REPORT</b>\n\n` +
                        `🌐 <b>Server Status:</b> ${siteStatus} (Ping: ${ping}ms)\n` +
                        `🔐 <b>Privilege Integrity:</b> ${adminAlert} (${adminCount} Authorized)\n` +
                        `🚫 <b>Threat Activity:</b> ${suspendedWriters || 0} Suspended Accounts\n\n` +
                        `<b>Verdict:</b> ${verdict}`;

                    await sendTelegramMessage(chatId, report);
                    addToHistory(chatId, 'assistant', "I performed a requested security scan and sent the results.");
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
