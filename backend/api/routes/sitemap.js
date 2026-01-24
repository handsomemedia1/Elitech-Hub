/**
 * Sitemap Generator Route
 * Generates dynamic XML sitemap
 */

import { Router } from 'express';
import supabase from '../services/supabase.js';

const router = Router();

const SITE_URL = 'https://elitechhub.com';

// Static pages
const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/about.html', priority: 0.8, changefreq: 'monthly' },
    { url: '/blog.html', priority: 0.9, changefreq: 'daily' },
    { url: '/programs.html', priority: 0.8, changefreq: 'weekly' },
    { url: '/services.html', priority: 0.8, changefreq: 'weekly' },
    { url: '/research.html', priority: 0.7, changefreq: 'weekly' },
    { url: '/contact.html', priority: 0.6, changefreq: 'monthly' },
    { url: '/payment.html', priority: 0.7, changefreq: 'weekly' },
    { url: '/login.html', priority: 0.5, changefreq: 'monthly' }
];

/**
 * GET /sitemap.xml - Generate sitemap
 */
router.get('/sitemap.xml', async (req, res) => {
    try {
        // Get all published blog posts
        const { data: posts } = await supabase
            .from('blog_posts')
            .select('slug, updated_at, published_at')
            .eq('published', true)
            .order('published_at', { ascending: false });

        // Get all published courses
        const { data: courses } = await supabase
            .from('courses')
            .select('slug, updated_at')
            .eq('published', true);

        // Get all research
        const { data: research } = await supabase
            .from('research')
            .select('slug, updated_at')
            .eq('published', true);

        // Build sitemap XML
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

        // Add static pages
        for (const page of staticPages) {
            xml += `    <url>
        <loc>${SITE_URL}${page.url}</loc>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>
`;
        }

        // Add blog posts
        for (const post of posts || []) {
            const lastmod = post.updated_at || post.published_at;
            xml += `    <url>
        <loc>${SITE_URL}/blog/${post.slug}</loc>
        <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
`;
        }

        // Add courses
        for (const course of courses || []) {
            xml += `    <url>
        <loc>${SITE_URL}/course/${course.slug}</loc>
        <lastmod>${new Date(course.updated_at).toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
`;
        }

        // Add research
        for (const r of research || []) {
            xml += `    <url>
        <loc>${SITE_URL}/research/${r.slug}</loc>
        <lastmod>${new Date(r.updated_at).toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
`;
        }

        xml += `</urlset>`;

        res.set('Content-Type', 'application/xml');
        res.send(xml);

    } catch (err) {
        console.error('Sitemap generation error:', err);
        res.status(500).send('Error generating sitemap');
    }
});

/**
 * GET /robots.txt - Robots file
 */
router.get('/robots.txt', (req, res) => {
    const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
    res.set('Content-Type', 'text/plain');
    res.send(robots);
});

export default router;
