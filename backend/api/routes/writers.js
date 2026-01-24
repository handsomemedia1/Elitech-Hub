/**
 * Writers Routes
 * Blog writers panel - login, posts, SEO checker
 */

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../services/supabase.js';
import { sendOTPEmail } from '../services/email.js';

const router = Router();

// In-memory OTP store (for production, use Redis)
const otpStore = new Map();

/**
 * POST /api/writers/login - Writer login (with MFA support)
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password, otp } = req.body;

        const { data: writer, error } = await supabase
            .from('writers')
            .select('*')
            .eq('email', email.toLowerCase())
            .eq('active', true)
            .single();

        if (error || !writer) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, writer.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if MFA is enabled
        if (writer.mfa_enabled) {
            // If OTP not provided, generate and send one
            if (!otp) {
                const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
                const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

                otpStore.set(email.toLowerCase(), { otp: generatedOTP, expiry });

                // Send OTP via email
                await sendOTPEmail(email, generatedOTP, writer.name);

                return res.json({
                    requiresOTP: true,
                    message: 'OTP sent to your email'
                });
            }

            // Verify OTP
            const storedData = otpStore.get(email.toLowerCase());
            if (!storedData || storedData.otp !== otp || Date.now() > storedData.expiry) {
                return res.status(401).json({ error: 'Invalid or expired OTP' });
            }

            // Clear OTP
            otpStore.delete(email.toLowerCase());
        }

        const token = jwt.sign(
            { writerId: writer.id, email: writer.email, role: 'writer' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            writer: { id: writer.id, name: writer.name, email: writer.email },
            token
        });
    } catch (err) {
        console.error('Writer login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * POST /api/writers/resend-otp - Resend OTP
 */
router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;

        const { data: writer } = await supabase
            .from('writers')
            .select('name, email, mfa_enabled')
            .eq('email', email.toLowerCase())
            .eq('active', true)
            .single();

        if (!writer) {
            return res.status(404).json({ error: 'Writer not found' });
        }

        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 5 * 60 * 1000;

        otpStore.set(email.toLowerCase(), { otp: generatedOTP, expiry });

        await sendOTPEmail(email, generatedOTP, writer.name);

        res.json({ message: 'OTP resent successfully' });
    } catch (err) {
        console.error('Resend OTP error:', err);
        res.status(500).json({ error: 'Failed to resend OTP' });
    }
});

/**
 * PATCH /api/writers/mfa - Toggle MFA setting
 */
router.patch('/mfa', async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { enabled } = req.body;

        const { data: writer, error } = await supabase
            .from('writers')
            .update({ mfa_enabled: enabled })
            .eq('id', decoded.writerId)
            .select()
            .single();

        if (error) throw error;

        res.json({
            message: `MFA ${enabled ? 'enabled' : 'disabled'}`,
            mfa_enabled: writer.mfa_enabled
        });
    } catch (err) {
        console.error('MFA toggle error:', err);
        res.status(500).json({ error: 'Failed to update MFA setting' });
    }
});

/**
 * Writer auth middleware
 */
const requireWriter = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'writer') {
            return res.status(403).json({ error: 'Writer access required' });
        }

        const { data: writer } = await supabase
            .from('writers')
            .select('*')
            .eq('id', decoded.writerId)
            .single();

        if (!writer || !writer.active) {
            return res.status(403).json({ error: 'Writer account inactive' });
        }

        req.writer = writer;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

/**
 * GET /api/writers/me - Get current writer
 */
router.get('/me', requireWriter, (req, res) => {
    res.json({ writer: req.writer });
});

/**
 * GET /api/writers/posts - Get writer's posts
 */
router.get('/posts', requireWriter, async (req, res) => {
    try {
        const { data: posts } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('writer_id', req.writer.id)
            .order('created_at', { ascending: false });

        res.json({ posts: posts || [] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

/**
 * POST /api/writers/posts - Create/submit post
 */
router.post('/posts', requireWriter, async (req, res) => {
    try {
        const { title, slug, excerpt, content, category, thumbnail } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        // Calculate SEO score
        const seoScore = calculateSEOScore(title, content, excerpt);
        const wordCount = content.split(/\s+/).length;

        // Check content moderation
        const moderationResult = moderateContent(content);
        if (!moderationResult.passed) {
            return res.status(400).json({
                error: 'Content failed moderation',
                issues: moderationResult.issues
            });
        }

        // Auto-publish if meets criteria
        const autoPublish = seoScore >= 70 && wordCount >= 500 && content.includes('<img');

        const { data: post, error } = await supabase
            .from('blog_posts')
            .insert({
                title,
                slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                excerpt,
                content,
                category: category || 'cybersecurity',
                thumbnail,
                author: req.writer.name,
                writer_id: req.writer.id,
                seo_score: seoScore,
                word_count: wordCount,
                published: autoPublish,
                published_at: autoPublish ? new Date().toISOString() : null
            })
            .select()
            .single();

        if (error) throw error;

        // Update writer's post count
        await supabase
            .from('writers')
            .update({ posts_count: supabase.sql`posts_count + 1` })
            .eq('id', req.writer.id);

        // Send WhatsApp notification if published
        if (autoPublish) {
            sendWhatsAppNotification(req.writer.name, title, slug);
        }

        res.json({
            message: autoPublish ? 'Post published!' : 'Post saved as draft',
            post,
            seoScore,
            published: autoPublish,
            feedback: getSEOFeedback(seoScore, wordCount, content)
        });
    } catch (err) {
        console.error('Post creation error:', err);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

/**
 * POST /api/writers/seo-check - Check SEO score before publishing
 */
router.post('/seo-check', requireWriter, (req, res) => {
    const { title, content, excerpt } = req.body;

    const seoScore = calculateSEOScore(title, content, excerpt);
    const wordCount = content?.split(/\s+/).length || 0;
    const hasImage = content?.includes('<img') || false;

    res.json({
        seoScore,
        wordCount,
        hasImage,
        canPublish: seoScore >= 70 && wordCount >= 500 && hasImage,
        feedback: getSEOFeedback(seoScore, wordCount, content)
    });
});

// Helper: Calculate SEO Score
function calculateSEOScore(title, content, excerpt) {
    let score = 0;

    // Title checks (25 points)
    if (title) {
        score += 5;
        if (title.length >= 30 && title.length <= 60) score += 10;
        if (title.length < 60) score += 5;
        if (/[A-Z]/.test(title[0])) score += 5;
    }

    // Content checks (50 points)
    if (content) {
        const wordCount = content.split(/\s+/).length;
        if (wordCount >= 300) score += 10;
        if (wordCount >= 500) score += 10;
        if (wordCount >= 800) score += 5;
        if (content.includes('<h2>') || content.includes('<h3>')) score += 10;
        if (content.includes('<img')) score += 10;
        if (content.includes('<a')) score += 5;
    }

    // Excerpt/Meta (15 points)
    if (excerpt) {
        score += 5;
        if (excerpt.length >= 120 && excerpt.length <= 160) score += 10;
    }

    // Readability bonus (10 points)
    if (content) {
        const sentences = content.split(/[.!?]+/).length;
        const words = content.split(/\s+/).length;
        const avgSentenceLength = words / sentences;
        if (avgSentenceLength >= 10 && avgSentenceLength <= 20) score += 10;
    }

    return Math.min(100, score);
}

// Helper: Get SEO Feedback
function getSEOFeedback(score, wordCount, content) {
    const feedback = [];

    if (score < 70) feedback.push('SEO score must be at least 70% to auto-publish');
    if (wordCount < 500) feedback.push(`Add ${500 - wordCount} more words (minimum 500)`);
    if (!content?.includes('<img')) feedback.push('Add at least one image');
    if (!content?.includes('<h2>') && !content?.includes('<h3>')) feedback.push('Add subheadings (H2 or H3)');

    return feedback.length > 0 ? feedback : ['Great! Your post meets all criteria.'];
}

// Helper: Content Moderation
function moderateContent(content) {
    const lowercaseContent = content.toLowerCase();
    const issues = [];

    // Check for vulgar words (simplified list)
    const vulgarWords = ['fuck', 'shit', 'damn', 'ass', 'bitch', 'bastard'];
    for (const word of vulgarWords) {
        if (lowercaseContent.includes(word)) {
            issues.push(`Contains inappropriate language: "${word}"`);
        }
    }

    // Check for spam patterns
    if ((lowercaseContent.match(/buy now/g) || []).length > 3) {
        issues.push('Too many promotional phrases');
    }

    return {
        passed: issues.length === 0,
        issues
    };
}

// Helper: Send WhatsApp Notification
async function sendWhatsAppNotification(writerName, postTitle, slug) {
    const message = `📝 New Blog Post Published!\n\nWriter: ${writerName}\nTitle: ${postTitle}\nLink: https://elitechhub.com/blog/${slug}`;

    // Using WhatsApp Business API or Twilio
    // For now, log it (implement actual API later)
    console.log('WhatsApp Notification:', message);

    // TODO: Implement actual WhatsApp notification
    // You'll need Twilio or WhatsApp Business API credentials
}

export default router;
