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
import { checkAndAwardBadges } from '../services/gamification.js';
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
 * POST /api/writers/seo-check - Check SEO score using AI (Writer only)
 */
router.post('/seo-check', requireWriter, async (req, res) => {
    const { title, content, excerpt } = req.body;
    
    // Fallback simple word count based on raw HTML
    const textContent = content ? content.replace(/<[^>]*>?/gm, ' ').trim() : '';
    const wordCount = textContent ? textContent.split(/\s+/).length : 0;
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
            const cleanedText = aiResult.response.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedResult = JSON.parse(cleanedText);
        } catch (e) {
            console.error('Failed to parse AI JSON:', aiResult.response);
            throw new Error('AI returned invalid format');
        }

        const aiScore = parsedResult.seoScore || (content ? Math.min(100, Math.max(0, parseInt(wordCount / 10))) : 0);
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
        console.error('AI SEO check failed:', err);
        res.json({
            seoScore: content ? Math.min(100, Math.max(0, parseInt(wordCount / 10))) : 0,
            canPublish: false,
            feedback: ['AI service unavailable. Here is a baseline score.']
        });
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
        const {
            title, slug, excerpt, content, category, thumbnail,
            tags, scheduled_at,
            seo_title, meta_description, focus_keyphrase,
            og_title, og_description, og_image
        } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        // Calculate SEO score
        const textContent = content ? content.replace(/<[^>]*>?/gm, ' ').trim() : '';
        const wordCount = textContent ? textContent.split(/\s+/).length : 0;
        const seoScore = calculateSEOScore(title, content, excerpt);

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

        // Generate a unique slug - check for duplicates and append suffix if needed
        let baseSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        let finalSlug = baseSlug;
        const { data: existingPost } = await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', baseSlug)
            .maybeSingle();
        if (existingPost) {
            finalSlug = `${baseSlug}-${Date.now().toString(36)}`;
        }

        const { data: post, error } = await supabase
            .from('blog_posts')
            .insert({
                title,
                slug: finalSlug,
                excerpt,
                content,
                category: category || 'cybersecurity',
                thumbnail,
                tags: tags || [],
                author: req.writer.name,
                writer_id: req.writer.id,
                seo_score: seoScore,
                word_count: wordCount,
                published: autoPublish,
                published_at: autoPublish ? new Date().toISOString() : null,
                scheduled_at: scheduled_at || null
            })
            .select()
            .single();

        if (error) throw error;

        // Insert metadata into separate table
        if (seo_title || meta_description || focus_keyphrase || og_title || og_description || og_image) {
            const { error: metaError } = await supabase
                .from('post_seo_metadata')
                .insert({
                    post_id: post.id,
                    seo_title: seo_title || null,
                    meta_description: meta_description || null,
                    focus_keyphrase: focus_keyphrase || null,
                    og_title: og_title || null,
                    og_description: og_description || null,
                    og_image: og_image || null
                });
            if (metaError) {
                console.error('Failed to save SEO metadata:', metaError);
                // We don't abort the post creation, just log it
            }
        }

        // Update writer's post count
        const { data: writerData } = await supabase
            .from('writers')
            .select('posts_count')
            .eq('id', req.writer.id)
            .single();
        await supabase
            .from('writers')
            .update({ posts_count: (writerData?.posts_count || 0) + 1 })
            .eq('id', req.writer.id);

        const { sendTelegramPing, sendTelegramMessageWithKeyboard } = await import('../services/telegram.js');

        // Send WhatsApp notification if published
        if (autoPublish) {
            sendWhatsAppNotification(req.writer.name, title, slug);

            // Notify search engines (Google + IndexNow/Bing/Yandex)
            const postUrl = `https://elitechub.com/blog-posts/${post.slug}.html`;
            notifySearchEngines(postUrl).catch(err => console.error('[SEO] Notification error:', err));
            
            // Ping Admin
            await sendTelegramPing(`🚀 <b>New Post Published!</b>\n\nWriter: <b>${req.writer.name}</b>\nTitle: ${title}\nSEO Score: ${seoScore}%\n<a href="${postUrl}">Read it here</a>`);
        } else {
            // Send Interactive Approval Request to Admin
            const adminMessage = `📝 <b>Draft Pending Approval</b>\n\nWriter: <b>${req.writer.name}</b>\nTitle: ${title}\nSEO Score: ${seoScore}%\nWord Count: ${wordCount}\n\n<i>This post did not meet the auto-publish criteria. Please review.</i>`;
            
            const keyboard = {
                inline_keyboard: [
                    [
                        { text: "✅ Approve & Publish", callback_data: `approve_post:${post.id}` },
                        { text: "❌ Reject", callback_data: `reject_post:${post.id}` }
                    ]
                ]
            };
            
            await sendTelegramMessageWithKeyboard(adminMessage, keyboard);
        }

        const newBadges = await checkAndAwardBadges(req.writer.id);

        res.json({
            message: autoPublish ? 'Post published!' : 'Post submitted for Admin review!',
            post,
            seoScore,
            published: autoPublish,
            newBadges,
            feedback: getSEOFeedback(seoScore, wordCount, content)
        });
    } catch (err) {
        console.error('Post creation error:', err);
        res.status(500).json({ error: 'Failed to create post: ' + (err.message || JSON.stringify(err)) });
    }
});

/**
 * GET /api/writers/posts/:id - Get single post for editing (writer must own it)
 */
router.get('/posts/:id', requireWriter, async (req, res) => {
    try {
        const { id } = req.params;

        const { data: post, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .eq('writer_id', req.writer.id)
            .single();

        if (error || !post) {
            return res.status(404).json({ error: 'Post not found or access denied' });
        }

        res.json({ post });
    } catch (err) {
        console.error('Fetch post error:', err);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

/**
 * PATCH /api/writers/posts/:id - Update writer's own post
 */
router.patch('/posts/:id', requireWriter, async (req, res) => {
    try {
        const { id } = req.params;

        // Verify ownership
        const { data: existingPost } = await supabase
            .from('blog_posts')
            .select('id, writer_id, published')
            .eq('id', id)
            .eq('writer_id', req.writer.id)
            .single();

        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found or access denied' });
        }

        const {
            title, slug, excerpt, content, category, thumbnail,
            tags, scheduled_at,
            seo_title, meta_description, focus_keyphrase,
            og_title, og_description, og_image
        } = req.body;

        // Content moderation
        if (content) {
            const moderationResult = moderateContent(content);
            if (!moderationResult.passed) {
                return res.status(400).json({
                    error: 'Content failed moderation',
                    issues: moderationResult.issues
                });
            }
        }

        // Recalculate SEO score
        const textContent = content ? content.replace(/<[^>]*>?/gm, ' ').trim() : '';
        const wordCount = textContent ? textContent.split(/\s+/).length : 0;
        const seoScore = calculateSEOScore(title, content, excerpt);

        // Re-evaluate auto-publish criteria (only if not already published)
        const autoPublish = !existingPost.published && seoScore >= 70 && wordCount >= 500 && content?.includes('<img');

        const updates = {
            title,
            slug,
            excerpt,
            content,
            category: category || 'cybersecurity',
            thumbnail,
            tags: tags || [],
            seo_score: seoScore,
            word_count: wordCount
        };

        // If the edit now meets auto-publish criteria, publish it
        if (autoPublish) {
            updates.published = true;
            updates.published_at = new Date().toISOString();
        }

        if (scheduled_at) {
            updates.scheduled_at = scheduled_at;
        }

        const { data: updatedPost, error } = await supabase
            .from('blog_posts')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Update SEO metadata if provided
        if (seo_title || meta_description || focus_keyphrase || og_title || og_description || og_image) {
            // Upsert metadata
            const { data: existingMeta } = await supabase
                .from('post_seo_metadata')
                .select('id')
                .eq('post_id', id)
                .maybeSingle();

            if (existingMeta) {
                await supabase
                    .from('post_seo_metadata')
                    .update({
                        seo_title: seo_title || null,
                        meta_description: meta_description || null,
                        focus_keyphrase: focus_keyphrase || null,
                        og_title: og_title || null,
                        og_description: og_description || null,
                        og_image: og_image || null
                    })
                    .eq('post_id', id);
            } else {
                await supabase
                    .from('post_seo_metadata')
                    .insert({
                        post_id: id,
                        seo_title: seo_title || null,
                        meta_description: meta_description || null,
                        focus_keyphrase: focus_keyphrase || null,
                        og_title: og_title || null,
                        og_description: og_description || null,
                        og_image: og_image || null
                    });
            }
        }

        // Notify admin if auto-published after edit
        if (autoPublish) {
            const { sendTelegramPing } = await import('../services/telegram.js');
            const postUrl = `https://elitechub.com/blog-posts/${updatedPost.slug}.html`;
            await sendTelegramPing(`🚀 <b>Post Auto-Published After Edit!</b>\n\nWriter: <b>${req.writer.name}</b>\nTitle: ${title}\nSEO Score: ${seoScore}%\n<a href="${postUrl}">Read it here</a>`);
        }

        const newBadges = await checkAndAwardBadges(req.writer.id);

        res.json({
            message: autoPublish ? 'Post updated and published!' : 'Post updated successfully!',
            post: updatedPost,
            seoScore,
            published: updatedPost.published,
            newBadges,
            feedback: getSEOFeedback(seoScore, wordCount, content)
        });
    } catch (err) {
        console.error('Post update error:', err);
        res.status(500).json({ error: 'Failed to update post: ' + (err.message || JSON.stringify(err)) });
    }
});

/**
 * POST /api/writers/seo-check - Check SEO score using AI before publishing
 */
router.post('/seo-check', requireWriter, async (req, res) => {
    const { title, content, excerpt } = req.body;
    
    const textContent = content ? content.replace(/<[^>]*>?/gm, ' ').trim() : '';
    const wordCount = textContent ? textContent.split(/\s+/).length : 0;
    const hasImage = content?.includes('<img') || false;

    try {
        const systemContext = `You are an expert SEO auditor for a cybersecurity training company (Elitech Hub).
Analyze the provided blog post data. You must respond ONLY with a valid JSON object matching this exact schema, with no markdown formatting or backticks:
{
  "feedback": (array of strings, provide 3-5 specific, actionable recommendations to improve SEO, readability, or engagement)
}`;

        const userMessage = `Title: ${title || 'None'}
Excerpt: ${excerpt || 'None'}
Word Count: ${wordCount}
Has Image: ${hasImage}
Content (Text Only): ${textContent || 'None'}`;

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

        const aiScore = calculateSEOScore(title, content, excerpt);
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
    
    // Strip HTML for accurate word count
    const textContent = content ? content.replace(/<[^>]*>?/gm, ' ').trim() : '';
    const wordCount = textContent ? textContent.split(/\s+/).length : 0;

    // Title checks (25 points)
    if (title && title.length > 0) {
        score += 5;
        if (title.length >= 30 && title.length <= 60) score += 20;
    }

    // Excerpt/Meta (15 points)
    if (excerpt && excerpt.length > 0) {
        score += 5;
        if (excerpt.length >= 120 && excerpt.length <= 160) score += 10;
    }

    // Content checks (60 points) - total 100 points
    if (content) {
        if (wordCount >= 300) score += 10;
        if (wordCount >= 500) score += 10;
        if (content.includes('<h2') || content.includes('<h3')) score += 15;
        if (content.includes('<img')) score += 15;
        if (content.includes('<a ')) score += 10;
    }

    return Math.min(100, score);
}

// Helper: Get SEO Feedback
function getSEOFeedback(score, wordCount, content) {
    const feedback = [];

    if (score < 70) feedback.push('SEO score must be at least 70% to auto-publish');
    if (wordCount < 500) feedback.push(`Add ${500 - wordCount} more words (minimum 500)`);
    if (!content?.includes('<img')) feedback.push('Add at least one image');
    if (!content?.includes('<h2') && !content?.includes('<h3')) feedback.push('Add subheadings (H2 or H3)');

    return feedback.length > 0 ? feedback : ['Great! Your post meets all criteria.'];
}

// Helper: Content Moderation
function moderateContent(content) {
    // Strip HTML so that base64 images or inline class names don't trigger false positives
    const textContent = content ? content.replace(/<[^>]*>?/gm, ' ') : '';
    const lowercaseContent = textContent.toLowerCase();
    const issues = [];

    // Check for vulgar words using word boundaries to avoid matching substrings like "class", "pass", "glass", or "asset".
    const vulgarWords = ['fuck', 'shit', 'damn', 'ass', 'bitch', 'bastard'];
    for (const word of vulgarWords) {
        const regex = new RegExp('\\b' + word + '\\b');
        if (regex.test(lowercaseContent)) {
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
