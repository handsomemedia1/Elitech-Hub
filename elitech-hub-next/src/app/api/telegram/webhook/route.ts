import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { 
    sendTelegramPing, 
    editMessageText, 
    answerCallbackQuery, 
    sendChatAction 
} from '@/lib/telegram';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1141577136';

// AI Integration via Vercel AI SDK (Groq Provider setup)
const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
  baseURL: 'https://api.groq.com/openai/v1',
});

// Basic system prompt for the Telegram bot assistant
const SYSTEM_PROMPT = `You are Elitech Hub's internal AI Assistant, talking directly to the master Admin.
Be concise, extremely helpful, and professional. You have full awareness of the LMS, CRM, and website programs.
If asked to summarize stats or write an email, do it perfectly.`;

export async function POST(req: Request) {
    try {
        const update = await req.json();
        
        // 1. Handle Inline Keyboard Button Clicks (Callback Queries)
        if (update.callback_query) {
            const query = update.callback_query;
            const data = query.data; // e.g. "approve_post:12345"
            const fromId = query.from.id;

            // Security: Only allow the Admin to click buttons
            if (String(fromId) !== ADMIN_CHAT_ID) {
                await answerCallbackQuery(query.id, "Unauthorized. Only the Admin can do this.");
                return NextResponse.json({ success: true });
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
                const newText = (query.message.text || "Action") + "\n\n❌ <b>STATUS: CANCELED</b>";
                await editMessageText(query.message.chat.id, query.message.message_id, newText);
            }

            return NextResponse.json({ success: true });
        }

        // 2. Handle Text Messages (Commands & AI Assistant)
        if (update.message && update.message.text) {
            const msg = update.message;
            const fromId = msg.from.id;

            // Security: Only Elitech Hub Admin can talk to the bot
            if (String(fromId) !== ADMIN_CHAT_ID) {
                return NextResponse.json({ success: true });
            }

            const text = msg.text.trim();
            
            // COMMAND: /lockdown
            if (text === '/lockdown') {
                await sendChatAction(msg.chat.id, 'typing');
                
                try {
                    // Lockdown Writers
                    await supabaseAdmin.from('writers').update({ active: false }).eq('active', true);
                    
                    // Lockdown Researchers
                    await supabaseAdmin.from('researchers').update({ active: false }).eq('active', true);
                    
                    // Revoke Sub-Admin access
                    await supabaseAdmin.from('users')
                        .update({ has_access: false })
                        .eq('role', 'admin')
                        .neq('email', 'admin@elitechub.com');

                    // Scramble Master Admin Password
                    const newPassword = crypto.randomBytes(8).toString('hex'); // 16 chars
                    const masterHash = await bcrypt.hash(newPassword, 10);
                    
                    // Update password (assumes token_version bump happens automatically via DB trigger or manual)
                    await supabaseAdmin.from('users')
                        .update({ password_hash: masterHash })
                        .eq('email', 'admin@elitechub.com');

                    const lockdownMsg = `🚨 <b>ABSOLUTE LOCKDOWN INITIATED</b> 🚨\n\n` +
                        `• All Writers deactivated.\n` +
                        `• All Researchers deactivated.\n` +
                        `• All Sub-Admin access revoked.\n\n` +
                        `🔒 <b>YOUR MASTER ACCOUNT IS SECURED</b>\n` +
                        `<b>Your New Admin Password:</b>\n<code>${newPassword}</code>\n\n` + 
                        `To restore normal operations, type <code>/unlock</code>`;

                    await sendTelegramPing(lockdownMsg);
                } catch (error: any) {
                    await sendTelegramPing("❌ Failed to initiate lockdown: " + error.message);
                }
                return NextResponse.json({ success: true });
            }
            
            // COMMAND: /unlock
            if (text === '/unlock') {
                await sendChatAction(msg.chat.id, 'typing');
                try {
                    await supabaseAdmin.from('writers').update({ active: true }).eq('active', false);
                    await supabaseAdmin.from('researchers').update({ active: true }).eq('active', false);

                    await sendTelegramPing("✅ <b>LOCKDOWN LIFTED</b>\n\nAll Writers and Researchers have been reactivated.");
                } catch (error: any) {
                    await sendTelegramPing("❌ Failed to lift lockdown: " + error.message);
                }
                return NextResponse.json({ success: true });
            }

            // AI CHATBOT HANDLER (Groq via Vercel AI SDK)
            try {
                await sendChatAction(msg.chat.id, 'typing');
                
                const { text: aiResponse } = await generateText({
                    model: groq('llama-3.3-70b-versatile'), // Using Groq's blazing fast model
                    system: SYSTEM_PROMPT,
                    prompt: text,
                });
                
                await sendTelegramPing(aiResponse);
            } catch (e: any) {
                await sendTelegramPing("⚠️ AI Offline or Error: " + e.message);
            }
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Webhook Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// --- Handlers for Callback Queries ---

async function handleApprovePost(postId: string, query: any) {
    try {
        const { data: post, error } = await supabaseAdmin
            .from('blog_posts')
            .update({ published: true, published_at: new Date().toISOString() })
            .eq('id', postId)
            .select()
            .single();

        if (error || !post) {
            await answerCallbackQuery(query.id, "Error: Post not found.");
            return;
        }

        await answerCallbackQuery(query.id, "Post Approved successfully!");

        const newText = (query.message.text || "") + "\n\n✅ <b>STATUS: APPROVED & PUBLISHED</b>";
        await editMessageText(query.message.chat.id, query.message.message_id, newText);

    } catch (err) {
        await answerCallbackQuery(query.id, "Failed to approve post.");
    }
}

async function handleRejectPost(postId: string, query: any) {
    try {
        await answerCallbackQuery(query.id, "Post Rejected.");
        const newText = (query.message.text || "") + "\n\n❌ <b>STATUS: REJECTED</b>";
        await editMessageText(query.message.chat.id, query.message.message_id, newText);
    } catch (err) {
        await answerCallbackQuery(query.id, "Failed to reject post.");
    }
}

async function handleBanWriter(writerId: string, query: any) {
    try {
        await supabaseAdmin.from('writers').update({ active: false }).eq('id', writerId);
        await answerCallbackQuery(query.id, "Writer Banned.");
        const newText = (query.message.text || "") + "\n\n🚫 <b>STATUS: WRITER BANNED</b>";
        await editMessageText(query.message.chat.id, query.message.message_id, newText);
    } catch (err) {
        await answerCallbackQuery(query.id, "Failed to ban writer.");
    }
}
