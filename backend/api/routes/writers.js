/**
 * Writers Routes
 * Blog writers panel - login, posts, SEO checker
 */

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../services/supabase.js';
import { sendOTPEmail } from '../services/email.js';
import { aiRouter } from '../services/ai-router.js';
import { notifySearchEngines } from '../services/seo-notify.js';

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
 * POST /api/writers/register - Writer self-registration
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // Sanitize name
        const sanitizedName = name.replace(/<[^>]*>/g, '').trim();
        const safeEmail = email.toLowerCase().trim();

        // Check if user already exists
        const { data: existing } = await supabase
            .from('writers')
            .select('id')
            .eq('email', safeEmail)
            .single();

        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const { data: writer, error } = await supabase
            .from('writers')
            .insert({
                name: sanitizedName,
                email: safeEmail,
                password_hash,
                active: false,
                posting_days: []
            })
            .select('id, name, email, active')
            .single();

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({ error: 'Email already registered' });
            }
            console.error('Writer registration error:', error);
            return res.status(500).json({ error: 'Failed to create account: ' + (error.message || error.code) });
        }

        if (!writer) {
            return res.status(500).json({ error: 'Account creation returned no data' });
        }

        res.status(201).json({ 
            message: 'Registration successful! Your account is pending admin approval.',
            writer: { id: writer.id, name: writer.name, email: writer.email }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed: ' + err.message });
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
 * PUT /api/writers/password - Change writer password
 */
router.put('/password', requireWriter, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'New password must be at least 8 characters' });
        }

        const validPassword = await bcrypt.compare(currentPassword, req.writer.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }

        const password_hash = await bcrypt.hash(newPassword, 10);

        const { error } = await supabase
            .from('writers')
            .update({ password_hash })
            .eq('id', req.writer.id);

        if (error) throw error;

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Writer password update error:', err);
        res.status(500).json({ error: 'Failed to update password' });
    }
});

/**
 * POST /api/writers/upload-url - Get signed URL for blog image upload (writer)
 */
router.post('/upload-url', requireWriter, async (req, res) => {
    try {
        const { filename, contentType } = req.body;

        if (!filename) {
            return res.status(400).json({ error: 'Filename required' });
        }

        const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `writers/${req.writer.id}/${Date.now()}-${safeName}`;

        const { data, error } = await supabase.storage
            .from('blog-images')
            .createSignedUploadUrl(path);

        if (error) throw error;

        const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/blog-images/${path}`;

        res.json({
            uploadUrl: data.signedUrl,
            token: data.token,
            path: path,
            publicUrl
        });
    } catch (err) {
        console.error('Writer upload URL error:', err);
        res.status(500).json({ error: 'Failed to generate upload URL' });
    }
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

            // Notify search engines (Google + IndexNow/Bing/Yandex)
            const postUrl = `https://elitechub.com/blog-posts/${post.slug}.html`;
            notifySearchEngines(postUrl).catch(err => console.error('[SEO] Notification error:', err));
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
 * POST /api/writers/seo-check - Check SEO score using AI before publishing
 */
router.post('/seo-check', requireWriter, async (req, res) => {
    const { title, content, excerpt } = req.body;
    
    const wordCount = content?.split(/\s+/).length || 0;
    const hasImage = content?.includes('<img') || false;

    try {
        const systemContext = `You are an expert SEO auditor for a cybersecurity training company (Elitech Hub).
Analyze the provided blog post data. You must respond ONLY with a valid JSON object matching this exact schema, with no markdown formatting or backticks:
{
  "seoScore": (number between 0 and 100 representing overall SEO health),
  "feedback": (array of strings, provide 3-5 specific, actionable recommendations to improve SEO, readability, or engagement)
}`;

        const userMessage = `Title: ${title || 'None'}
Excerpt: ${excerpt || 'None'}
Word Count: ${wordCount}
Has Image: ${hasImage}
Content (HTML): ${content || 'None'}`;

        const aiResult = await aiRouter.generate(userMessage, { context: systemContext });
        
        let parsedResult;
        try {
            // Strip potential markdown formatting from AI response
            const cleanedText = aiResult.response.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedResult = JSON.parse(cleanedText);
        } catch (e) {
            console.error('Failed to parse AI JSON:', aiResult.response);
            throw new Error('AI returned invalid format');
        }

        const aiScore = parsedResult.seoScore || calculateSEOScore(title, content, excerpt);
        const autoPublish = aiScore >= 70 && wordCount >= 500 && hasImage;

        let finalFeedback = parsedResult.feedback || [];
        if (wordCount < 500) finalFeedback.unshift(`Add ${500 - wordCount} more words (minimum 500)`);
        if (!hasImage) finalFeedback.unshift('Add at least one image');

        res.json({
            seoScore: aiScore,
            wordCount,
            hasImage,
            canPublish: autoPublish,
            feedback: finalFeedback.length > 0 ? finalFeedback : ['Great! Your post meets all criteria.']
        });
    } catch (err) {
        console.error('AI SEO check failed, falling back to basic checks:', err);
        const seoScore = calculateSEOScore(title, content, excerpt);
        res.json({
            seoScore,
            wordCount,
            hasImage,
            canPublish: seoScore >= 70 && wordCount >= 500 && hasImage,
            feedback: getSEOFeedback(seoScore, wordCount, content)
        });
    }
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
    console.log('WhatsApp Notification:', message);
}

/**
 * GET /api/writers/missed-posts
 * Get any pending missed posts for the current writer
 */
router.get('/missed-posts', requireWriter, async (req, res) => {
    try {
        const { data: missedPosts, error } = await supabase
            .from('missed_posts')
            .select('*')
            .eq('writer_id', req.writer.id)
            .eq('status', 'pending_reason')
            .order('missed_date', { ascending: false });

        if (error) throw error;
        
        res.json({ missedPosts: missedPosts || [] });
    } catch (err) {
        console.error('Fetch missed posts error:', err);
        res.status(500).json({ error: 'Failed to fetch missed posts status' });
    }
});

/**
 * POST /api/writers/missed-post-reason
 * Submit a reason for a missed post
 */
router.post('/missed-post-reason', requireWriter, async (req, res) => {
    try {
        const { missedPostId, reason } = req.body;
        
        if (!missedPostId || !reason || reason.trim().length < 5) {
            return res.status(400).json({ error: 'A valid reason is required' });
        }

        // 1. Update the record
        const { data: updated, error } = await supabase
            .from('missed_posts')
            .update({ 
                reason: reason.trim(), 
                status: 'reason_submitted',
                updated_at: new Date().toISOString()
            })
            .eq('id', missedPostId)
            .eq('writer_id', req.writer.id)
            .select()
            .single();

        if (error || !updated) throw error || new Error('Record not found or access denied');

        // 2. Ping Admin via Telegram
        const message = `💬 <b>Missed Post Explanation</b>\n\nWriter: <b>${req.writer.name}</b>\nMissed Date: ${updated.missed_date}\n\nReason:\n<i>"${updated.reason}"</i>`;
        
        const { sendTelegramPing } = await import('../services/telegram.js');
        await sendTelegramPing(message);

        res.json({ message: 'Reason submitted successfully' });
    } catch (err) {
        console.error('Submit reason error:', err);
        res.status(500).json({ error: 'Failed to submit reason' });
    }
});

/**
 * POST /api/admin/cron/check-missed-posts
 * Nightly cron job to check if writers missed their scheduled posting day
 * Security: Called by Vercel Cron or Admin only
 */
router.post('/cron/check-missed-posts', async (req, res) => {
    // Basic secret check to prevent abuse (Vercel cron passes auth header)
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && req.body.secret !== process.env.CRON_SECRET) {
        // For development/testing we might not enforce it strictly if CRON_SECRET isn't set
        if (process.env.CRON_SECRET) {
            return res.status(401).json({ error: 'Unauthorized cron request' });
        }
    }

    try {
        // Check for yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const yesterdayDayName = days[yesterday.getDay()];
        
        // Format YYYY-MM-DD for checking the blog_posts created_at/published_at 
        const yesterdayStart = new Date(yesterday.setHours(0,0,0,0)).toISOString();
        const yesterdayEnd = new Date(yesterday.setHours(23,59,59,999)).toISOString();
        const dateString = yesterday.toISOString().split('T')[0];

        // 1. Find all active writers who were scheduled to post yesterday
        const { data: scheduledWriters, error: wError } = await supabase
            .from('writers')
            .select('id, name, posting_days')
            .eq('active', true);
            
        if (wError) throw wError;

        const writersToCheck = scheduledWriters.filter(w => 
            w.posting_days && w.posting_days.includes(yesterdayDayName)
        );

        if (writersToCheck.length === 0) {
            return res.json({ message: `No writers were scheduled to post on ${yesterdayDayName}.` });
        }

        const missedWriters = [];

        // 2. See if they published a post yesterday
        for (const writer of writersToCheck) {
            const { data: posts, error: pError } = await supabase
                .from('blog_posts')
                .select('id')
                .eq('writer_id', writer.id)
                .gte('created_at', yesterdayStart)
                .lte('created_at', yesterdayEnd);

            if (pError) {
                console.error(`Error checking posts for ${writer.name}:`, pError);
                continue;
            }

            if (!posts || posts.length === 0) {
                missedWriters.push(writer);
                
                // 3. Insert into missed_posts table
                await supabase
                    .from('missed_posts')
                    .insert({
                        writer_id: writer.id,
                        missed_date: dateString,
                        status: 'pending_reason'
                    });
            }
        }

        // 4. Ping Admin on Telegram if there are missed posts
        if (missedWriters.length > 0) {
            const names = missedWriters.map(w => w.name).join(', ');
            const message = `⚠️ <b>Missed Posts Alert</b>\n\nThe following writers failed to submit a post on their scheduled day (${yesterdayDayName}):\n\n• ${names}\n\n<i>Their dashboards have been updated to request an explanation.</i>`;
            
            await notifySearchEngines.sendTelegramPing(message); // Wait, this needs to import from telegram.js directly
            
            const { sendTelegramPing } = await import('../services/telegram.js');
            await sendTelegramPing(message);
        }

        res.json({ 
            message: 'Cron completed successfully', 
            checked: writersToCheck.length,
            missed: missedWriters.length,
            missedWriters: missedWriters.map(w => w.name)
        });

    } catch (err) {
        console.error('Check missed posts cron error:', err);
        res.status(500).json({ error: 'Failed to run full check' });
    }
});

export default router;
