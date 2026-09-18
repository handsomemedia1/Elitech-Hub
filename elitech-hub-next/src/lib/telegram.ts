import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Send a simple text message via Telegram Bot
 */
export async function sendTelegramPing(message: string): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('⚠️ Telegram ping skipped: Missing credentials.');
        return false;
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        if (!data.ok) {
            console.error('Telegram API Error:', data.description);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Failed to send Telegram ping:', error);
        return false;
    }
}

/**
 * Send a message via Telegram Bot with an Inline Keyboard (Buttons)
 */
export async function sendTelegramMessageWithKeyboard(message: string, replyMarkup: any): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('⚠️ Telegram ping with keyboard skipped: Missing credentials.');
        return false;
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML',
                reply_markup: replyMarkup
            })
        });

        const data = await response.json();
        if (!data.ok) {
            console.error('Telegram API Error (Keyboard):', data.description);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Failed to send Telegram message with keyboard:', error);
        return false;
    }
}

/**
 * Edit an existing message text
 */
export async function editMessageText(chatId: string | number, messageId: number, text: string): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN) return false;
    
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                text: text,
                parse_mode: 'HTML'
            })
        });
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Answer a callback query (removes loading state on inline buttons)
 */
export async function answerCallbackQuery(callbackQueryId: string, text: string): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN) return false;
    
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                callback_query_id: callbackQueryId,
                text: text
            })
        });
        return true;
    } catch (e) {
        return false;
    }
}

export async function sendChatAction(chatId: string | number, action: 'typing'): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN) return false;
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendChatAction`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                action: action
            })
        });
        return true;
    } catch (e) {
        return false;
    }
}
