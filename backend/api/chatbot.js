/**
 * Elitech Hub Chatbot API (Enhanced Multi-AI Version)
 * AI-powered chatbot using AI Router with 5 providers
 */

import express from 'express';
import { aiRouter } from './services/ai-router.js';
import { WEBSITE_CONTEXT } from './services/website-context.js';

const router = express.Router();

// Chat endpoint with AI Router
router.post('/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Generate response using AI Router
        try {
            const result = await aiRouter.generate(message, {
                history: history.slice(-10), // Last 10 messages for context
                context: WEBSITE_CONTEXT
            });

            res.json({
                response: result.response,
                provider: result.provider,
                latency: result.latency
            });

        } catch (aiError) {
            console.error('AI Router failed:', aiError.message);

            // Fallback to static responses
            const fallbackResponse = getFallbackResponse(message);
            res.json({
                response: fallbackResponse,
                provider: 'fallback',
                latency: 0
            });
        }

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: 'Failed to process message',
            response: "I'm having trouble right now. Please try again or contact us on WhatsApp: +234 708 196 8062"
        });
    }
});

// Get AI Router stats (for admin dashboard)
router.get('/stats', (req, res) => {
    try {
        const stats = aiRouter.getStats();
        res.json({
            providers: stats,
            lastUsedProvider: aiRouter.lastUsedProvider
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

// Fallback responses when all AI providers fail
function getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Pricing questions
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('fee')) {
        return `Great question! 💰 We have two main programs:\n\n**6-Week Bootcamp**: ₦70,000 (or $70/€70/£70)\nPerfect for getting started quickly with foundational skills.\n\n**16-Week Professional Program**: ₦200,000 (or $200/€200/£200)\nOur comprehensive program with **guaranteed internship** and **85% job placement rate**!\n\nFlexible payment plans available for the 16-week program. Would you like to know more?`;
    }

    // Why choose Elitech Hub
    if (lowerMessage.includes('why choose') || lowerMessage.includes('why elitech') || lowerMessage.includes('better than')) {
        return `Great question! Here's what sets Elitech Hub apart:\n\n🎯 **Guaranteed internship** (not just "assistance")\n📈 **85% job placement** rate (proven results)\n💰 **Best value**: ₦200K vs ₦300-500K at competitors\n👨‍🏫 **Industry pros** as instructors (not just academics)\n🔧 **70% hands-on** training (real tools, real scenarios)\n💼 **Lifetime support** + alumni network\n\nWe don't just teach theory - we get you hired! Want to know more about our programs?`;
    }

    // Program questions
    if (lowerMessage.includes('6 week') || lowerMessage.includes('6-week') || lowerMessage.includes('bootcamp')) {
        return `The 6-Week Intensive Bootcamp is perfect if you're short on time! 🚀\n\n**What you get:**\n• Weekend classes (flexible schedule)\n• Hands-on labs with real security tools\n• Capstone project for portfolio\n• Certificate of completion\n\n**You'll learn:**\nNetwork security, vulnerability assessment, penetration testing, system hardening, incident response.\n\n**Investment**: ₦70,000 / $70\n\nReady to enroll? Contact us on WhatsApp: +234 708 196 8062`;
    }

    if (lowerMessage.includes('16 week') || lowerMessage.includes('16-week') || lowerMessage.includes('professional') || lowerMessage.includes('internship')) {
        return `The 16-Week Professional Program is our flagship course! 🎯\n\n**What makes it special:**\n🎯 **GUARANTEED internship** with partner companies\n💼 **85% job placement** rate\n🏆 Certification prep (CEH, CompTIA Security+)\n👨‍🏫 1-on-1 mentorship\n📈 Lifetime career support\n\n**Investment**: ₦200,000 / $200 (flexible payment plans available)\n\nThis takes you from beginner to job-ready professional in 4 months. Interested? WhatsApp: +234 708 196 8062`;
    }

    // Experience/beginner questions
    if (lowerMessage.includes('beginner') || lowerMessage.includes('experience') || lowerMessage.includes('no background') || lowerMessage.includes('start')) {
        return `Absolutely no experience needed! 🌟\n\nOur programs are designed for complete beginners. We've trained lawyers, accountants, teachers - all with zero IT background!\n\n**What you need:**\n• Basic computer skills\n• Laptop (8GB RAM minimum)\n• Internet connection\n• Passion for cybersecurity!\n\nWe start from the basics and build up. 90%+ completion rate proves it works! Ready to start?`;
    }

    // Class format questions
    if (lowerMessage.includes('online') || lowerMessage.includes('class') || lowerMessage.includes('schedule') || lowerMessage.includes('zoom')) {
        return `All classes are LIVE online via Zoom! 💻\n\n**What to expect:**\n• Interactive sessions with instructors\n• Hands-on labs and breakout rooms\n• Real-time Q&A\n• Recorded sessions for review\n\n**Schedule:**\n• 6-Week: Weekend classes\n• 16-Week: Flexible (evenings + weekends)\n\nLearn from anywhere while getting personal attention!`;
    }

    // Payment questions
    if (lowerMessage.includes('payment') || lowerMessage.includes('installment') || lowerMessage.includes('pay')) {
        return `We make education accessible! 📚\n\n**Payment Options:**\n• Full payment\n• 2 installments (₦100K + ₦100K)\n• 3 installments (₦70K + ₦65K + ₦65K)\n\nContact us on WhatsApp to discuss the best plan for you: +234 708 196 8062`;
    }

    // Contact
    if (lowerMessage.includes('contact') || lowerMessage.includes('whatsapp') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
        return `We'd love to hear from you! 📞\n\n**WhatsApp**: +234 708 196 8062 (fastest - 9 AM - 9 PM WAT)\n**Email**: info@elitechub.com\n**Website**: elitechub.com\n\nOur team is ready to help you choose the right program!`;
    }

    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage === 'hi' || lowerMessage === 'hello') {
        return `Hello! 👋 Welcome to Elitech Hub - Nigeria's #1 Cybersecurity Training Academy!\n\nI'm Eli, your assistant. I can help you with:\n\n• **Programs**: 6-Week Bootcamp or 16-Week Professional\n• **Why Choose Us**: Guaranteed internship + 85% placement\n• **Pricing**: Flexible payment plans\n• **Career Advice**: Job prospects and support\n\nWhat would you like to know?`;
    }

    // Default response
    return `Thanks for your question! 😊\n\nI'm Eli, your Elitech Hub assistant. I can help with:\n\n• **Programs**: 6-Week (₦70K) or 16-Week (₦200K)\n• **Why Elitech Hub**: Guaranteed internship + 85% job placement\n• **Payment Plans**: Flexible installments available\n• **No Experience Needed**: Designed for beginners\n\nFeel free to ask anything, or contact us on WhatsApp for personalized help: +234 708 196 8062`;
}

export default router;
