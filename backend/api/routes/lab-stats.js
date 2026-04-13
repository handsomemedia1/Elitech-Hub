/**
 * Lab Stats Routes
 * Public endpoints for lab/research statistics and latest publications
 * Used by lab.html hero stats, artifact cards, and index.html R&D section
 */

import { Router } from 'express';
import supabase from '../services/supabase.js';

const router = Router();

// Cache to reduce DB calls (5 minute TTL)
let statsCache = null;
let statsCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * GET /api/lab/stats - Public lab statistics
 * Returns paper counts, researcher counts, aggregate metrics, and latest papers
 */
router.get('/stats', async (req, res) => {
    try {
        // Serve from cache if fresh
        if (statsCache && (Date.now() - statsCacheTime) < CACHE_TTL) {
            return res.json(statsCache);
        }

        // Fetch published papers
        const { data: papers, error: papersError } = await supabase
            .from('research')
            .select('id, title, slug, description, category, type, thumbnail, views, downloads, citations, created_at, status')
            .or('published.eq.true,status.eq.published')
            .order('created_at', { ascending: false });

        if (papersError) throw papersError;

        // Fetch active researchers
        const { data: researchers, error: researchersError } = await supabase
            .from('researchers')
            .select('id, name, affiliation, research_area')
            .eq('active', true);

        if (researchersError) throw researchersError;

        // Aggregate metrics
        const totalPapers = papers?.length || 0;
        const totalResearchers = researchers?.length || 0;
        const totalViews = papers?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
        const totalDownloads = papers?.reduce((sum, p) => sum + (p.downloads || 0), 0) || 0;
        const totalCitations = papers?.reduce((sum, p) => sum + (p.citations || 0), 0) || 0;

        // Papers by category
        const byCategory = {};
        papers?.forEach(p => {
            const cat = p.category || 'general';
            byCategory[cat] = (byCategory[cat] || 0) + 1;
        });

        // Papers by type
        const byType = {};
        papers?.forEach(p => {
            const t = p.type || 'article';
            byType[t] = (byType[t] || 0) + 1;
        });

        // Latest 6 papers for display
        const latestPapers = (papers || []).slice(0, 6).map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            description: p.description?.substring(0, 180) || '',
            category: p.category || 'general',
            type: p.type || 'article',
            thumbnail: p.thumbnail || null,
            views: p.views || 0,
            created_at: p.created_at
        }));

        // Research areas from researchers
        const researchAreas = {};
        researchers?.forEach(r => {
            const area = r.research_area || 'general';
            researchAreas[area] = (researchAreas[area] || 0) + 1;
        });

        const response = {
            success: true,
            stats: {
                totalPapers,
                totalResearchers,
                totalViews,
                totalDownloads,
                totalCitations,
                byCategory,
                byType,
                researchAreas
            },
            latestPapers,
            timestamp: new Date().toISOString()
        };

        // Cache the response
        statsCache = response;
        statsCacheTime = Date.now();

        res.json(response);

    } catch (err) {
        console.error('Lab stats error:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch lab stats',
            // Return fallback stats so the page doesn't break
            stats: {
                totalPapers: 0,
                totalResearchers: 0,
                totalViews: 0,
                totalDownloads: 0,
                totalCitations: 0,
                byCategory: {},
                byType: {},
                researchAreas: {}
            },
            latestPapers: []
        });
    }
});

/**
 * GET /api/lab/latest - Just the latest published papers (lightweight)
 */
router.get('/latest', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 6, 20);

        const { data: papers, error } = await supabase
            .from('research')
            .select('id, title, slug, description, category, type, thumbnail, views, created_at')
            .or('published.eq.true,status.eq.published')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        res.json({
            success: true,
            papers: papers || []
        });

    } catch (err) {
        console.error('Lab latest error:', err);
        res.json({ success: true, papers: [] });
    }
});

/**
 * GET /api/lab/artifacts - Securely fetch lab artifacts from Private GitLab repo
 */
router.get('/artifacts', async (req, res) => {
    try {
        const PROJECT_PATH = 'elitech-hub%2FLab';
        const GITLAB_API_TOKEN = process.env.GITLAB_API_TOKEN;

        if (!GITLAB_API_TOKEN) {
            console.error('GITLAB_API_TOKEN is not defined in environment variables');
            return res.status(500).json({ error: 'GitLab API token not configured on server' });
        }

        const url = `https://gitlab.com/api/v4/projects/${PROJECT_PATH}/repository/tree?recursive=true&per_page=100`;

        const response = await fetch(url, {
            headers: {
                'PRIVATE-TOKEN': GITLAB_API_TOKEN
            }
        });

        if (!response.ok) {
            throw new Error(`GitLab API responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        // Return only the raw GitLab node array directly down to the frontend
        res.json(data);

    } catch (err) {
        console.error('GitLab artifact proxy error:', err);
        res.status(500).json({ error: 'Failed to fetch from GitLab securely' });
    }
});

export default router;
