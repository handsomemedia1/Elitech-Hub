/**
 * Writer Performance Routes
 * Stats, leaderboard, badges, and gamification endpoints
 */

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import supabase from '../services/supabase.js';
import { checkGrammar, checkPlagiarism, calculateDetailedSEO, QUALITY_THRESHOLDS } from '../services/quality.js';
import {
    BADGES,
    calculateWriterStats,
    checkAndAwardBadges,
    getLeaderboard,
    getMonthlyWinner,
    getWriterProgression
} from '../services/gamification.js';

const router = Router();

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

// ============== PERFORMANCE STATS ==============

/**
 * GET /api/writers/performance/stats - Get writer's performance stats
 */
router.get('/stats', requireWriter, async (req, res) => {
    try {
        const stats = await calculateWriterStats(req.writer.id);
        const progression = await getWriterProgression(req.writer.id);

        res.json({
            stats,
            progression,
            thresholds: QUALITY_THRESHOLDS
        });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

/**
 * GET /api/writers/performance/posts - Get writer's posts with quality metrics
 */
router.get('/posts', requireWriter, async (req, res) => {
    try {
        const { data: posts } = await supabase
            .from('blog_posts')
            .select('id, title, slug, published, seo_score, grammar_score, plagiarism_score, word_count, views, created_at, category')
            .eq('writer_id', req.writer.id)
            .order('created_at', { ascending: false });

        res.json({ posts: posts || [] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

/**
 * GET /api/writers/performance/rejections - Get rejection reasons
 */
router.get('/rejections', requireWriter, async (req, res) => {
    try {
        const { data: posts } = await supabase
            .from('blog_posts')
            .select('id, title, rejection_reason, seo_score, grammar_score, created_at')
            .eq('writer_id', req.writer.id)
            .eq('published', false)
            .not('rejection_reason', 'is', null)
            .order('created_at', { ascending: false });

        // Categorize rejection reasons
        const reasons = {};
        (posts || []).forEach(post => {
            const reason = post.rejection_reason || 'Other';
            reasons[reason] = (reasons[reason] || 0) + 1;
        });

        res.json({
            rejectedPosts: posts || [],
            reasonsSummary: reasons
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch rejections' });
    }
});

// ============== QUALITY CHECKS ==============

/**
 * POST /api/writers/performance/quality-check - Full quality check
 */
router.post('/quality-check', requireWriter, async (req, res) => {
    try {
        const { title, content, excerpt, category } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        // Run all quality checks
        const [seoResult, grammarResult] = await Promise.all([
            Promise.resolve(calculateDetailedSEO(title, content, excerpt, category)),
            checkGrammar(content.replace(/<[^>]*>/g, ' ')) // Strip HTML
        ]);

        // Get existing posts for plagiarism check
        const { data: existingPosts } = await supabase
            .from('blog_posts')
            .select('title, content')
            .neq('writer_id', req.writer.id)
            .limit(100);

        const plagiarismResult = await checkPlagiarism(
            content.replace(/<[^>]*>/g, ' '),
            existingPosts || []
        );

        const wordCount = content.split(/\s+/).length;

        // Overall assessment
        const passesQuality =
            seoResult.totalScore >= QUALITY_THRESHOLDS.seo.min &&
            (grammarResult.score === null || grammarResult.score >= QUALITY_THRESHOLDS.grammar.min) &&
            (plagiarismResult.plagiarismPercent === null || plagiarismResult.plagiarismPercent <= QUALITY_THRESHOLDS.plagiarism.max);

        res.json({
            seo: seoResult,
            grammar: grammarResult,
            plagiarism: plagiarismResult,
            wordCount,
            passesQuality,
            canPublish: passesQuality && seoResult.canPublish,
            thresholds: QUALITY_THRESHOLDS
        });
    } catch (err) {
        console.error('Quality check error:', err);
        res.status(500).json({ error: 'Quality check failed' });
    }
});

// ============== GAMIFICATION ==============

/**
 * GET /api/writers/performance/badges - Get writer's badges
 */
router.get('/badges', requireWriter, async (req, res) => {
    try {
        const { data: writer } = await supabase
            .from('writers')
            .select('badges')
            .eq('id', req.writer.id)
            .single();

        const earnedBadges = (writer?.badges || []).map(id => ({
            ...BADGES[id],
            earned: true
        }));

        const availableBadges = Object.values(BADGES)
            .filter(b => !writer?.badges?.includes(b.id))
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

/**
 * POST /api/writers/performance/check-badges - Check for new badges
 */
router.post('/check-badges', requireWriter, async (req, res) => {
    try {
        const newBadges = await checkAndAwardBadges(req.writer.id);

        res.json({
            newBadges,
            message: newBadges.length > 0
                ? `Congratulations! You earned ${newBadges.length} new badge(s)!`
                : 'No new badges earned'
        });
    } catch (err) {
        res.status(500).json({ error: 'Badge check failed' });
    }
});

/**
 * GET /api/writers/performance/leaderboard - Get leaderboard
 */
router.get('/leaderboard', async (req, res) => {
    try {
        const { period = 'all', limit = 10 } = req.query;
        const leaderboard = await getLeaderboard(period, parseInt(limit));

        res.json({ leaderboard });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

/**
 * GET /api/writers/performance/monthly-winner - Get monthly winner
 */
router.get('/monthly-winner', async (req, res) => {
    try {
        const now = new Date();
        const { year = now.getFullYear(), month = now.getMonth() + 1 } = req.query;

        const winner = await getMonthlyWinner(parseInt(year), parseInt(month));

        res.json({
            winner,
            month: `${year}-${month.toString().padStart(2, '0')}`
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch monthly winner' });
    }
});

/**
 * GET /api/writers/performance/progression - Get progression status
 */
router.get('/progression', requireWriter, async (req, res) => {
    try {
        const progression = await getWriterProgression(req.writer.id);

        res.json({ progression });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch progression' });
    }
});

// ============== ADMIN ENDPOINTS ==============

/**
 * GET /api/writers/performance/admin/all-stats - Get all writers' stats (admin)
 */
router.get('/admin/all-stats', async (req, res) => {
    try {
        // Simple admin check via query param (should use proper auth in production)
        const { adminKey } = req.query;
        if (adminKey !== process.env.ADMIN_API_KEY) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { data: writers } = await supabase
            .from('writers')
            .select('id, name, email, active, badges, posts_count, avg_seo_score, total_views, created_at')
            .order('posts_count', { ascending: false });

        const writersWithStats = await Promise.all(
            (writers || []).map(async writer => {
                const stats = await calculateWriterStats(writer.id);
                return { ...writer, stats };
            })
        );

        res.json({ writers: writersWithStats });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch all stats' });
    }
});

export default router;
