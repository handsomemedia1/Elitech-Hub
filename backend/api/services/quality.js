/**
 * Quality Scoring Service
 * Enhanced quality checks including grammar and plagiarism
 */

import axios from 'axios';

/**
 * Check grammar using LanguageTool API (free)
 * Returns score 0-100 based on error count
 */
export async function checkGrammar(text) {
    try {
        const response = await axios.post('https://api.languagetool.org/v2/check',
            new URLSearchParams({
                text: text.substring(0, 20000), // API limit
                language: 'en-US'
            }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
        );

        const matches = response.data.matches || [];
        const wordCount = text.split(/\s+/).length;

        // Calculate score: fewer errors = higher score
        // Baseline: 1 error per 100 words is acceptable (90 score)
        const errorRate = (matches.length / wordCount) * 100;
        let score = Math.max(0, 100 - (errorRate * 10));
        score = Math.round(score);

        return {
            score,
            errorCount: matches.length,
            errors: matches.slice(0, 10).map(m => ({
                message: m.message,
                context: m.context?.text,
                offset: m.offset,
                suggestions: m.replacements?.slice(0, 3).map(r => r.value)
            }))
        };
    } catch (error) {
        console.error('Grammar check error:', error.message);
        return { score: null, error: 'Grammar check unavailable', errorCount: 0, errors: [] };
    }
}

/**
 * Calculate plagiarism score using local duplicate detection
 * For production, integrate Copyleaks API (20 free/month)
 */
export async function checkPlagiarism(text, existingPosts = []) {
    try {
        // Simple local check against existing posts
        const textWords = text.toLowerCase().split(/\s+/).filter(w => w.length > 4);
        const significantPhrases = [];

        // Extract 5-word phrases
        for (let i = 0; i < textWords.length - 4; i++) {
            significantPhrases.push(textWords.slice(i, i + 5).join(' '));
        }

        let matchCount = 0;
        let matchedSources = [];

        // Check against existing posts
        for (const post of existingPosts) {
            const postContent = (post.content || '').toLowerCase();
            let postMatches = 0;

            for (const phrase of significantPhrases) {
                if (postContent.includes(phrase)) {
                    postMatches++;
                }
            }

            if (postMatches > 0) {
                matchCount += postMatches;
                matchedSources.push({
                    title: post.title,
                    matchCount: postMatches
                });
            }
        }

        // Calculate similarity percentage
        const similarityPercent = significantPhrases.length > 0
            ? Math.round((matchCount / significantPhrases.length) * 100)
            : 0;

        return {
            plagiarismPercent: similarityPercent,
            isOriginal: similarityPercent <= 5,
            matchedSources: matchedSources.slice(0, 5),
            message: similarityPercent <= 2 ? 'Content appears original' :
                similarityPercent <= 5 ? 'Minor similarities detected' :
                    'High similarity detected - please revise'
        };
    } catch (error) {
        console.error('Plagiarism check error:', error.message);
        return { plagiarismPercent: null, error: 'Plagiarism check failed', isOriginal: null };
    }
}

/**
 * Check for AI-generated content (Placeholder)
 * Returns a probability score (0-100)
 */
export async function checkAI(text) {
    // Placeholder logic - requires paid API like Copyleaks or GPTZero
    // For now, we assume original
    return {
        aiProbability: 0,
        isAI: false,
        message: 'AI detection currently in beta (simulated pass)'
    };
}

/**
 * Enhanced SEO scoring with detailed breakdown
 */
export function calculateDetailedSEO(title, content, excerpt, category) {
    const scores = {
        title: { score: 0, max: 20, feedback: [] },
        content: { score: 0, max: 35, feedback: [] },
        meta: { score: 0, max: 15, feedback: [] },
        structure: { score: 0, max: 20, feedback: [] },
        readability: { score: 0, max: 10, feedback: [] }
    };

    // Title (20 points)
    if (title) {
        if (title.length >= 30 && title.length <= 60) {
            scores.title.score += 10;
        } else if (title.length < 30) {
            scores.title.feedback.push('Title too short (aim for 30-60 characters)');
            scores.title.score += 5;
        } else {
            scores.title.feedback.push('Title too long (aim for 30-60 characters)');
            scores.title.score += 5;
        }
        if (/^[A-Z]/.test(title)) scores.title.score += 5;
        if (/[0-9]/.test(title) || /how|what|why|best|top|guide/i.test(title)) {
            scores.title.score += 5;
        } else {
            scores.title.feedback.push('Add numbers or power words (How, Best, Guide)');
        }
    } else {
        scores.title.feedback.push('Title is required');
    }

    // Content (35 points)
    if (content) {
        const wordCount = content.split(/\s+/).length;
        const minWords = category === 'tutorial' ? 2000 : category === 'news' ? 1200 : 800;

        if (wordCount >= minWords) {
            scores.content.score += 15;
        } else {
            scores.content.feedback.push(`Add ${minWords - wordCount} more words (min: ${minWords})`);
            scores.content.score += Math.floor((wordCount / minWords) * 15);
        }

        if (content.includes('<img')) scores.content.score += 10;
        else scores.content.feedback.push('Add at least one image');

        if (content.includes('<a')) scores.content.score += 5;
        else scores.content.feedback.push('Add internal/external links');

        if (content.includes('<ul>') || content.includes('<ol>')) scores.content.score += 5;
        else scores.content.feedback.push('Add bullet points or numbered lists');
    }

    // Meta/Excerpt (15 points)
    if (excerpt) {
        if (excerpt.length >= 120 && excerpt.length <= 160) {
            scores.meta.score += 15;
        } else if (excerpt.length < 120) {
            scores.meta.feedback.push('Meta description too short (120-160 chars)');
            scores.meta.score += 8;
        } else {
            scores.meta.feedback.push('Meta description too long (120-160 chars)');
            scores.meta.score += 8;
        }
    } else {
        scores.meta.feedback.push('Add a meta description');
    }

    // Structure (20 points)
    if (content) {
        const h2Count = (content.match(/<h2>/g) || []).length;
        const h3Count = (content.match(/<h3>/g) || []).length;

        if (h2Count >= 2) scores.structure.score += 10;
        else if (h2Count >= 1) {
            scores.structure.score += 5;
            scores.structure.feedback.push('Add more H2 subheadings');
        } else {
            scores.structure.feedback.push('Add H2 subheadings to structure content');
        }

        if (h3Count >= 2) scores.structure.score += 10;
        else if (h3Count >= 1) scores.structure.score += 5;
    }

    // Readability (10 points)
    if (content) {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = content.split(/\s+/).length;
        const avgSentenceLength = words / sentences.length;

        if (avgSentenceLength >= 12 && avgSentenceLength <= 20) {
            scores.readability.score += 10;
        } else if (avgSentenceLength < 12) {
            scores.readability.feedback.push('Sentences too short - add more detail');
            scores.readability.score += 5;
        } else {
            scores.readability.feedback.push('Sentences too long - break them up');
            scores.readability.score += 5;
        }
    }

    // Calculate total
    const totalScore = Object.values(scores).reduce((sum, s) => sum + s.score, 0);
    const maxScore = Object.values(scores).reduce((sum, s) => sum + s.max, 0);
    const percentage = Math.round((totalScore / maxScore) * 100);

    return {
        totalScore: percentage,
        breakdown: scores,
        grade: percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F',
        canPublish: percentage >= 70
    };
}

/**
 * Word count requirements by category
 */
export const WORD_COUNT_REQUIREMENTS = {
    tutorial: { min: 2000, ideal: 2500 },
    news: { min: 1200, ideal: 1500 },
    tips: { min: 800, ideal: 1000 },
    default: { min: 500, ideal: 800 }
};

/**
 * Quality thresholds
 */
export const QUALITY_THRESHOLDS = {
    seo: { min: 70, ideal: 80 },
    grammar: { min: 80, ideal: 90 },
    plagiarism: { max: 5, ideal: 2 }
};

export default {
    checkGrammar,
    checkPlagiarism,
    checkAI,
    calculateDetailedSEO,
    WORD_COUNT_REQUIREMENTS,
    QUALITY_THRESHOLDS
};
