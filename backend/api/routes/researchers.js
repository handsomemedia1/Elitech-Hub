/**
 * Researcher Routes
 * Login, profile, and research management for researchers
 */

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../services/supabase.js';
import { sendOTPEmail } from '../services/email.js';
import quality from '../services/quality.js';

const router = Router();

// In-memory OTP store
const otpStore = new Map();

/**
 * Researcher auth middleware
 */
export const requireResearcher = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'researcher') {
            return res.status(403).json({ error: 'Researcher access required' });
        }

        const { data: researcher } = await supabase
            .from('researchers')
            .select('*')
            .eq('id', decoded.researcherId)
            .single();

        if (!researcher || !researcher.active) {
            return res.status(403).json({ error: 'Researcher account inactive' });
        }

        req.researcher = researcher;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

/**
 * POST /api/researchers/register - Self-registration for researchers
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, affiliation, research_area, orcid } = req.body;

        // Validation
        if (!name || !email || !password || !affiliation || !research_area) {
            return res.status(400).json({ error: 'All required fields must be filled' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // Validate research area
        const ALLOWED_AREAS = [
            'cybersecurity', 'cyberpsychology', 'security-engineering',
            'artificial-intelligence', 'machine-learning', 'data-science',
            'network-security', 'digital-forensics', 'cryptography', 'software-engineering'
        ];
        if (!ALLOWED_AREAS.includes(research_area)) {
            return res.status(400).json({ error: 'Invalid research area selected' });
        }

        // Check if email already exists
        const { data: existing } = await supabase
            .from('researchers')
            .select('id')
            .eq('email', email.toLowerCase())
            .single();

        if (existing) {
            return res.status(400).json({ error: 'An account with this email already exists' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 12);

        // Create researcher account
        const { data: researcher, error } = await supabase
            .from('researchers')
            .insert({
                name,
                email: email.toLowerCase(),
                password_hash,
                affiliation,
                research_interests: [research_area],
                orcid: orcid || null,
                active: true,
                mfa_enabled: false,
                publications_count: 0,
                total_citations: 0,
                h_index: 0,
                total_strikes: 0,
                strike_status: 'good'
            })
            .select('id, name, email')
            .single();

        if (error) {
            console.error('Registration error:', error);
            throw error;
        }

        // Log activity
        await supabase.from('researcher_activity').insert({
            researcher_id: researcher.id,
            type: 'account_created',
            data: { research_area, affiliation }
        });

        res.json({
            message: 'Account created successfully! You can now login.',
            researcher: { id: researcher.id, name: researcher.name, email: researcher.email }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Failed to create account. Please try again.' });
    }
});

/**
 * POST /api/researchers/login - Researcher login
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password, otp } = req.body;

        const { data: researcher, error } = await supabase
            .from('researchers')
            .select('*')
            .eq('email', email.toLowerCase())
            .eq('active', true)
            .single();

        if (error || !researcher) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, researcher.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check MFA if enabled
        if (researcher.mfa_enabled) {
            if (!otp) {
                const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
                const expiry = Date.now() + 5 * 60 * 1000;
                otpStore.set(email.toLowerCase(), { otp: generatedOTP, expiry });
                await sendOTPEmail(email, generatedOTP, researcher.name);
                return res.json({ requiresOTP: true, message: 'OTP sent to your email' });
            }

            const storedData = otpStore.get(email.toLowerCase());
            if (!storedData || storedData.otp !== otp || Date.now() > storedData.expiry) {
                return res.status(401).json({ error: 'Invalid or expired OTP' });
            }
            otpStore.delete(email.toLowerCase());
        }

        const token = jwt.sign(
            { researcherId: researcher.id, email: researcher.email, role: 'researcher' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            researcher: {
                id: researcher.id,
                name: researcher.name,
                email: researcher.email,
                affiliation: researcher.affiliation,
                h_index: researcher.h_index,
                total_citations: researcher.total_citations,
                publications_count: researcher.publications_count
            },
            token
        });
    } catch (err) {
        console.error('Researcher login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * GET /api/researchers/me - Get current researcher profile
 */
router.get('/me', requireResearcher, (req, res) => {
    const { password_hash, ...profile } = req.researcher;
    res.json({ researcher: profile });
});

/**
 * PATCH /api/researchers/me - Update researcher profile
 */
router.patch('/me', requireResearcher, async (req, res) => {
    try {
        const { name, bio, affiliation, orcid, profile_image, research_interests,
            linkedin_url, researchgate_url, google_scholar_url } = req.body;

        const updates = {};
        if (name) updates.name = name;
        if (bio !== undefined) updates.bio = bio;
        if (affiliation !== undefined) updates.affiliation = affiliation;
        if (orcid !== undefined) updates.orcid = orcid;
        if (profile_image !== undefined) updates.profile_image = profile_image;
        if (research_interests) updates.research_interests = research_interests;
        if (linkedin_url !== undefined) updates.linkedin_url = linkedin_url;
        if (researchgate_url !== undefined) updates.researchgate_url = researchgate_url;
        if (google_scholar_url !== undefined) updates.google_scholar_url = google_scholar_url;
        updates.updated_at = new Date().toISOString();

        const { data: researcher, error } = await supabase
            .from('researchers')
            .update(updates)
            .eq('id', req.researcher.id)
            .select()
            .single();

        if (error) throw error;

        const { password_hash, ...profile } = researcher;
        res.json({ message: 'Profile updated', researcher: profile });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

/**
 * GET /api/researchers/stats - Get researcher stats
 */
router.get('/stats', requireResearcher, async (req, res) => {
    try {
        const { data: papers } = await supabase
            .from('research')
            .select('id, title, status, citations, downloads, views, created_at')
            .eq('researcher_id', req.researcher.id);

        const published = papers?.filter(p => p.status === 'published') || [];
        const drafts = papers?.filter(p => p.status === 'draft') || [];
        const underReview = papers?.filter(p => p.status === 'under_review') || [];

        const totalCitations = published.reduce((sum, p) => sum + (p.citations || 0), 0);
        const totalDownloads = papers?.reduce((sum, p) => sum + (p.downloads || 0), 0) || 0;
        const totalViews = papers?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;

        // Calculate simple H-index
        const citationCounts = published.map(p => p.citations || 0).sort((a, b) => b - a);
        let hIndex = 0;
        for (let i = 0; i < citationCounts.length; i++) {
            if (citationCounts[i] >= i + 1) hIndex = i + 1;
            else break;
        }

        res.json({
            stats: {
                totalPapers: papers?.length || 0,
                publishedPapers: published.length,
                drafts: drafts.length,
                underReview: underReview.length,
                totalCitations,
                totalDownloads,
                totalViews,
                hIndex
            },
            recentPapers: published.slice(0, 5)
        });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

/**
 * GET /api/researchers/papers - Get researcher's papers
 */
router.get('/papers', requireResearcher, async (req, res) => {
    try {
        const { data: papers } = await supabase
            .from('research')
            .select('*')
            .eq('researcher_id', req.researcher.id)
            .order('created_at', { ascending: false });

        res.json({ papers: papers || [] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch papers' });
    }
});

/**
 * POST /api/researchers/papers - Create new research paper
 */
router.post('/papers', requireResearcher, async (req, res) => {
    try {
        const {
            title, abstract, description, category, type, keywords,
            file_url, pdf_url, youtube_url, thumbnail, journal, doi,
            co_authors, publication_date, status,
            // New quality fields from wizard
            orcid, plagiarism_claimed, plagiarism_tool, plagiarism_report_url,
            grammar_score, grammar_tool, ethics_approval, conflicts_of_interest,
            license, citation_style, references_json, word_count
        } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        // 1. Niche Enforcement (Expanded Categories)
        const ALLOWED_CATEGORIES = [
            'cybersecurity', 'cyberpsychology', 'security-engineering',
            'artificial-intelligence', 'machine-learning', 'data-science',
            'network-security', 'digital-forensics', 'cryptography', 'software-engineering'
        ];
        if (!ALLOWED_CATEGORIES.includes(category)) {
            return res.status(400).json({
                error: 'Invalid category. Please select a valid research category.'
            });
        }

        // 2. Validate self-reported quality (if submitting for review)
        if (status === 'under_review') {
            // Check plagiarism - writer self-reported
            if (plagiarism_claimed === undefined || plagiarism_claimed === null) {
                return res.status(400).json({ error: 'Plagiarism score is required for submission' });
            }
            if (plagiarism_claimed > 15) {
                return res.status(400).json({
                    error: `Plagiarism score (${plagiarism_claimed}%) exceeds maximum (15%). Please revise your paper.`,
                    details: ['Reduce plagiarism to below 15% before submitting']
                });
            }
            if (!plagiarism_report_url) {
                return res.status(400).json({ error: 'Plagiarism report URL is required' });
            }

            // Check grammar - writer self-reported
            if (grammar_score === undefined || grammar_score === null) {
                return res.status(400).json({ error: 'Grammar score is required for submission' });
            }
            if (grammar_score < 70) {
                return res.status(400).json({
                    error: `Grammar score (${grammar_score}/100) is below minimum (70/100). Please improve your writing.`,
                    details: ['Improve grammar score to at least 70/100 before submitting']
                });
            }

            // Check word count
            if (word_count && word_count < 1000) {
                return res.status(400).json({
                    error: `Paper is too short (${word_count} words). Minimum is 2,000 words.`
                });
            }
        }

        const slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        const { data: paper, error } = await supabase
            .from('research')
            .insert({
                title,
                slug,
                abstract,
                description: description || abstract,
                category,
                type: type || 'original',
                keywords: keywords || [],
                file_url,
                pdf_url: pdf_url || file_url,
                youtube_url,
                thumbnail,
                journal,
                doi,
                co_authors: co_authors || [],
                publication_date,
                status: status || 'draft',
                researcher_id: req.researcher.id,
                views: 0,
                citations: 0,
                downloads: 0,
                published: false,
                // New fields
                orcid,
                plagiarism_claimed,
                plagiarism_tool,
                plagiarism_report_url,
                grammar_score,
                grammar_tool,
                ethics_approval,
                conflicts_of_interest,
                license: license || 'CC-BY-4.0',
                citation_style: citation_style || 'apa7',
                references_json: references_json || [],
                word_count: word_count || 0
            })
            .select()
            .single();

        if (error) throw error;

        // Log activity
        await supabase.from('researcher_activity').insert({
            researcher_id: req.researcher.id,
            type: 'paper_created',
            data: {
                paper_id: paper.id,
                title: paper.title,
                status: paper.status,
                plagiarism_claimed,
                grammar_score
            }
        });

        res.json({
            message: status === 'draft' ? 'Draft saved' : 'Paper submitted for admin review',
            paper
        });
    } catch (err) {
        console.error('Create paper error:', err);
        res.status(500).json({ error: 'Failed to create paper' });
    }
});

/**
 * PATCH /api/researchers/papers/:id - Update paper
 */
router.patch('/papers/:id', requireResearcher, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        delete updates.id;
        delete updates.researcher_id;
        delete updates.views;

        // Update published flag based on status
        if (updates.status === 'published') {
            updates.published = true;
        }

        const { data: paper, error } = await supabase
            .from('research')
            .update(updates)
            .eq('id', id)
            .eq('researcher_id', req.researcher.id)
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Paper updated', paper });
    } catch (err) {
        console.error('Update paper error:', err);
        res.status(500).json({ error: 'Failed to update paper' });
    }
});

/**
 * DELETE /api/researchers/papers/:id - Delete paper
 */
router.delete('/papers/:id', requireResearcher, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('research')
            .delete()
            .eq('id', id)
            .eq('researcher_id', req.researcher.id);

        if (error) throw error;

        res.json({ message: 'Paper deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete paper' });
    }
});

/**
 * GET /api/researchers/leaderboard - Get researcher leaderboard
 */
router.get('/leaderboard', async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const { data: researchers } = await supabase
            .from('researchers')
            .select('id, name, affiliation, publications_count, total_citations, h_index, badges')
            .eq('active', true)
            .order('total_citations', { ascending: false })
            .limit(parseInt(limit));

        const ranked = (researchers || []).map((r, index) => ({
            rank: index + 1,
            ...r,
            badgeCount: (r.badges || []).length,
            score: (r.publications_count || 0) * 10 + (r.total_citations || 0) + (r.h_index || 0) * 50
        }));

        res.json({ leaderboard: ranked });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

/**
 * GET /api/researchers/badges - Get researcher badges
 */
router.get('/badges', requireResearcher, async (req, res) => {
    try {
        const BADGES = {
            first_paper: { id: 'first_paper', name: 'First Research', icon: '🔬', description: 'Published your first paper' },
            prolific_5: { id: 'prolific_5', name: 'Prolific Researcher', icon: '📚', description: 'Published 5 papers' },
            prolific_10: { id: 'prolific_10', name: 'Research Leader', icon: '🏅', description: 'Published 10 papers' },
            cited_100: { id: 'cited_100', name: 'Citation Leader', icon: '📖', description: '100+ total citations' },
            cited_500: { id: 'cited_500', name: 'Highly Cited', icon: '🌟', description: '500+ total citations' },
            downloads_1k: { id: 'downloads_1k', name: 'Popular Research', icon: '📥', description: '1,000+ downloads' },
            h_index_5: { id: 'h_index_5', name: 'Rising Scholar', icon: '📈', description: 'H-Index of 5' },
            h_index_10: { id: 'h_index_10', name: 'Expert Researcher', icon: '🎓', description: 'H-Index of 10' }
        };

        const earnedBadges = (req.researcher.badges || []).map(id => ({
            ...BADGES[id],
            earned: true
        }));

        const availableBadges = Object.values(BADGES)
            .filter(b => !req.researcher.badges?.includes(b.id))
            .map(b => ({ ...b, earned: false }));

        res.json({
            earned: earnedBadges,
            available: availableBadges,
            total: Object.keys(BADGES).length
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch badges' });
    }
});

export default router;
