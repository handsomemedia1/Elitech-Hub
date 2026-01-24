/**
 * Gamification Service
 * Writer achievements, leaderboards, and progression system
 */

import supabase from './supabase.js';

/**
 * Badge definitions
 */
export const BADGES = {
    // Post count badges
    first_post: {
        id: 'first_post',
        name: 'First Steps',
        description: 'Published your first post',
        icon: '🎉',
        requirement: { type: 'posts_published', count: 1 }
    },
    prolific_5: {
        id: 'prolific_5',
        name: 'Getting Started',
        description: 'Published 5 posts',
        icon: '✍️',
        requirement: { type: 'posts_published', count: 5 }
    },
    prolific_10: {
        id: 'prolific_10',
        name: 'Prolific Writer',
        description: 'Published 10 posts',
        icon: '📚',
        requirement: { type: 'posts_published', count: 10 }
    },
    prolific_20: {
        id: 'prolific_20',
        name: 'Content Master',
        description: 'Published 20 posts - Unlocked author page!',
        icon: '🏆',
        requirement: { type: 'posts_published', count: 20 },
        reward: 'author_page'
    },
    prolific_50: {
        id: 'prolific_50',
        name: 'Writing Legend',
        description: 'Published 50 posts',
        icon: '👑',
        requirement: { type: 'posts_published', count: 50 }
    },

    // Quality badges
    seo_expert: {
        id: 'seo_expert',
        name: 'SEO Expert',
        description: 'First post with 90+ SEO score',
        icon: '🎯',
        requirement: { type: 'seo_score', min: 90 }
    },
    perfect_seo: {
        id: 'perfect_seo',
        name: 'SEO Master',
        description: 'Achieved 95+ SEO score',
        icon: '💎',
        requirement: { type: 'seo_score', min: 95 }
    },
    grammar_pro: {
        id: 'grammar_pro',
        name: 'Grammar Pro',
        description: 'First post with 95+ grammar score',
        icon: '📝',
        requirement: { type: 'grammar_score', min: 95 }
    },
    quality_streak: {
        id: 'quality_streak',
        name: 'Consistent Quality',
        description: '5 consecutive posts with 80+ SEO',
        icon: '🔥',
        requirement: { type: 'quality_streak', count: 5 }
    },

    // Traffic badges
    viral_post: {
        id: 'viral_post',
        name: 'Viral Post',
        description: 'Single post reached 1,000 views',
        icon: '🚀',
        requirement: { type: 'post_views', count: 1000 }
    },
    traffic_10k: {
        id: 'traffic_10k',
        name: 'Traffic Driver',
        description: 'Total views reached 10,000',
        icon: '📈',
        requirement: { type: 'total_views', count: 10000 }
    },
    traffic_100k: {
        id: 'traffic_100k',
        name: 'Influence Maker',
        description: 'Total views reached 100,000',
        icon: '🌟',
        requirement: { type: 'total_views', count: 100000 }
    },

    // Special badges
    monthly_champion: {
        id: 'monthly_champion',
        name: 'Monthly Champion',
        description: 'Top writer of the month',
        icon: '🥇',
        requirement: { type: 'monthly_winner', count: 1 },
        reward: 'free_course'
    },
    category_expert: {
        id: 'category_expert',
        name: 'Category Expert',
        description: '10+ posts in a single category',
        icon: '🎓',
        requirement: { type: 'category_posts', count: 10 }
    }
};

/**
 * Calculate writer stats from posts
 */
export async function calculateWriterStats(writerId) {
    try {
        const { data: posts } = await supabase
            .from('blog_posts')
            .select('id, title, published, seo_score, grammar_score, views, created_at, category')
            .eq('writer_id', writerId);

        if (!posts || posts.length === 0) {
            return {
                totalPosts: 0,
                publishedPosts: 0,
                draftPosts: 0,
                avgSeoScore: 0,
                avgGrammarScore: 0,
                totalViews: 0,
                bestPost: null,
                categoryBreakdown: {},
                approvalRate: 0
            };
        }

        const published = posts.filter(p => p.published);
        const drafts = posts.filter(p => !p.published);

        const avgSeoScore = published.length > 0
            ? Math.round(published.reduce((sum, p) => sum + (p.seo_score || 0), 0) / published.length)
            : 0;

        const avgGrammarScore = published.length > 0
            ? Math.round(published.reduce((sum, p) => sum + (p.grammar_score || 0), 0) / published.length)
            : 0;

        const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

        const bestPost = published.sort((a, b) => (b.views || 0) - (a.views || 0))[0];

        const categoryBreakdown = {};
        posts.forEach(p => {
            categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + 1;
        });

        return {
            totalPosts: posts.length,
            publishedPosts: published.length,
            draftPosts: drafts.length,
            avgSeoScore,
            avgGrammarScore,
            totalViews,
            bestPost,
            categoryBreakdown,
            approvalRate: posts.length > 0 ? Math.round((published.length / posts.length) * 100) : 0
        };
    } catch (error) {
        console.error('Calculate stats error:', error);
        return null;
    }
}

/**
 * Check and award badges
 */
export async function checkAndAwardBadges(writerId) {
    try {
        const stats = await calculateWriterStats(writerId);
        if (!stats) return [];

        // Get existing badges
        const { data: writer } = await supabase
            .from('writers')
            .select('badges')
            .eq('id', writerId)
            .single();

        const existingBadges = writer?.badges || [];
        const newBadges = [];

        // Check each badge
        for (const [badgeId, badge] of Object.entries(BADGES)) {
            if (existingBadges.includes(badgeId)) continue;

            let earned = false;

            switch (badge.requirement.type) {
                case 'posts_published':
                    earned = stats.publishedPosts >= badge.requirement.count;
                    break;
                case 'seo_score':
                    earned = stats.avgSeoScore >= badge.requirement.min;
                    break;
                case 'grammar_score':
                    earned = stats.avgGrammarScore >= badge.requirement.min;
                    break;
                case 'total_views':
                    earned = stats.totalViews >= badge.requirement.count;
                    break;
                case 'post_views':
                    earned = stats.bestPost?.views >= badge.requirement.count;
                    break;
                case 'category_posts':
                    earned = Object.values(stats.categoryBreakdown).some(c => c >= badge.requirement.count);
                    break;
            }

            if (earned) {
                newBadges.push(badgeId);
            }
        }

        // Save new badges
        if (newBadges.length > 0) {
            const allBadges = [...existingBadges, ...newBadges];
            await supabase
                .from('writers')
                .update({ badges: allBadges })
                .eq('id', writerId);

            // Log badge awards
            for (const badgeId of newBadges) {
                await supabase.from('writer_activity').insert({
                    writer_id: writerId,
                    type: 'badge_earned',
                    data: { badge: BADGES[badgeId] }
                });
            }
        }

        return newBadges.map(id => BADGES[id]);
    } catch (error) {
        console.error('Award badges error:', error);
        return [];
    }
}

/**
 * Get leaderboard
 */
export async function getLeaderboard(period = 'all', limit = 10) {
    try {
        let query = supabase
            .from('writers')
            .select(`
                id, name, 
                posts_count,
                avg_seo_score,
                total_views,
                badges
            `)
            .eq('active', true)
            .order('posts_count', { ascending: false })
            .limit(limit);

        const { data: writers } = await query;

        if (!writers) return [];

        // Calculate scores for ranking
        const ranked = writers.map((writer, index) => ({
            rank: index + 1,
            id: writer.id,
            name: writer.name,
            postsCount: writer.posts_count || 0,
            avgSeoScore: writer.avg_seo_score || 0,
            totalViews: writer.total_views || 0,
            badgeCount: (writer.badges || []).length,
            // Composite score: posts * 10 + seo * 5 + views/100
            score: (writer.posts_count || 0) * 10 +
                (writer.avg_seo_score || 0) * 5 +
                Math.floor((writer.total_views || 0) / 100)
        }));

        // Re-sort by composite score
        ranked.sort((a, b) => b.score - a.score);
        ranked.forEach((r, i) => r.rank = i + 1);

        return ranked;
    } catch (error) {
        console.error('Leaderboard error:', error);
        return [];
    }
}

/**
 * Get monthly winner
 */
export async function getMonthlyWinner(year, month) {
    try {
        const startDate = new Date(year, month - 1, 1).toISOString();
        const endDate = new Date(year, month, 0).toISOString();

        const { data: posts } = await supabase
            .from('blog_posts')
            .select('writer_id, seo_score, views')
            .eq('published', true)
            .gte('published_at', startDate)
            .lte('published_at', endDate);

        if (!posts || posts.length === 0) return null;

        // Aggregate by writer
        const writerScores = {};
        posts.forEach(post => {
            if (!writerScores[post.writer_id]) {
                writerScores[post.writer_id] = { count: 0, totalSeo: 0, totalViews: 0 };
            }
            writerScores[post.writer_id].count++;
            writerScores[post.writer_id].totalSeo += post.seo_score || 0;
            writerScores[post.writer_id].totalViews += post.views || 0;
        });

        // Find winner (most posts with good quality)
        let winnerId = null;
        let maxScore = 0;

        for (const [writerId, stats] of Object.entries(writerScores)) {
            const avgSeo = stats.totalSeo / stats.count;
            const score = stats.count * avgSeo;
            if (score > maxScore) {
                maxScore = score;
                winnerId = writerId;
            }
        }

        if (!winnerId) return null;

        const { data: winner } = await supabase
            .from('writers')
            .select('id, name, email')
            .eq('id', winnerId)
            .single();

        return {
            ...winner,
            stats: writerScores[winnerId],
            month: `${year}-${month.toString().padStart(2, '0')}`
        };
    } catch (error) {
        console.error('Monthly winner error:', error);
        return null;
    }
}

/**
 * Get writer's progression
 */
export async function getWriterProgression(writerId) {
    const stats = await calculateWriterStats(writerId);
    if (!stats) return null;

    const nextMilestones = [];

    // Posts milestones
    const postMilestones = [5, 10, 20, 50, 100];
    const nextPostMilestone = postMilestones.find(m => m > stats.publishedPosts);
    if (nextPostMilestone) {
        nextMilestones.push({
            type: 'posts',
            current: stats.publishedPosts,
            target: nextPostMilestone,
            progress: Math.round((stats.publishedPosts / nextPostMilestone) * 100),
            reward: nextPostMilestone === 20 ? 'Author page unlock' : `${nextPostMilestone} Posts badge`
        });
    }

    // Views milestones
    const viewMilestones = [1000, 10000, 100000];
    const nextViewMilestone = viewMilestones.find(m => m > stats.totalViews);
    if (nextViewMilestone) {
        nextMilestones.push({
            type: 'views',
            current: stats.totalViews,
            target: nextViewMilestone,
            progress: Math.round((stats.totalViews / nextViewMilestone) * 100),
            reward: `${nextViewMilestone.toLocaleString()} Views badge`
        });
    }

    // Author page eligibility
    const hasAuthorPage = stats.publishedPosts >= 20;

    return {
        stats,
        nextMilestones,
        hasAuthorPage,
        level: stats.publishedPosts < 5 ? 'Newcomer' :
            stats.publishedPosts < 10 ? 'Contributor' :
                stats.publishedPosts < 20 ? 'Regular Writer' :
                    stats.publishedPosts < 50 ? 'Senior Writer' : 'Expert Writer'
    };
}

export default {
    BADGES,
    calculateWriterStats,
    checkAndAwardBadges,
    getLeaderboard,
    getMonthlyWinner,
    getWriterProgression
};
