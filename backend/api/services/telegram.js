/**
 * Telegram Notification Service
 * Sends instant alerts to the Elitech Hub Admin group/chat
 */

import fetch from 'node-fetch';

// The bot token provided by the user
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8707043989:AAFz8NMLy-63Hjmh8jYz74aKOX_XPbkp5yA';

// The Chat ID where messages should be sent. 
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1141577136';

/**
 * Send a message via Telegram Bot
 * @param {string} message - The text message to send
 * @returns {Promise<boolean>} - Success status
 */
export async function sendTelegramPing(message) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('⚠️ Telegram ping skipped: Missing TELEGRAM_CHAT_ID in environment variables.');
        console.log('Would have texted:', message);
        return false;
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML' // Allows us to use <b>bold</b> and <i>italic</i> in messages
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
