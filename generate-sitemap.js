const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://elitechub.com';
const ROOT_DIR = __dirname;
const BLOG_DIR = path.join(ROOT_DIR, 'blog-posts');

// Page priorities and change frequencies
const PAGE_CONFIG = {
    'index.html':               { priority: '1.0', changefreq: 'daily' },
    'blog.html':                { priority: '0.9', changefreq: 'daily' },
    'programs.html':            { priority: '0.9', changefreq: 'weekly' },
    'about.html':               { priority: '0.8', changefreq: 'monthly' },
    'contact.html':             { priority: '0.7', changefreq: 'monthly' },
    'services.html':            { priority: '0.8', changefreq: 'weekly' },
    'portfolio.html':           { priority: '0.7', changefreq: 'weekly' },
    'research.html':            { priority: '0.7', changefreq: 'weekly' },
    'get-involved.html':        { priority: '0.7', changefreq: 'monthly' },
    'security.html':            { priority: '0.6', changefreq: 'monthly' },
    'volunteer.html':           { priority: '0.6', changefreq: 'monthly' },
    'mentor-application.html':  { priority: '0.6', changefreq: 'monthly' },
    'policies.html':            { priority: '0.5', changefreq: 'yearly' },
    'research-paper.html':      { priority: '0.6', changefreq: 'monthly' },
    'payment.html':             { priority: '0.6', changefreq: 'monthly' },
    'apply.html':               { priority: '0.8', changefreq: 'weekly' },
    'lab.html':                 { priority: '0.7', changefreq: 'weekly' },
    'researcher-guidelines.html': { priority: '0.6', changefreq: 'monthly' },
};

function toISODate(date) {
    return new Date(date).toISOString().split('T')[0];
}

function generateSitemap() {
    let urls = [];

    // Add root pages
    Object.entries(PAGE_CONFIG).forEach(([page, cfg]) => {
        const filePath = path.join(ROOT_DIR, page);
        if (fs.existsSync(filePath)) {
            const stat = fs.statSync(filePath);
            const lastmod = toISODate(stat.mtime);
            urls.push({
                loc: `${DOMAIN}/${page}`,
                lastmod,
                changefreq: cfg.changefreq,
                priority: cfg.priority
            });
        }
    });

    // Add blog posts
    let blogCount = 0;
    if (fs.existsSync(BLOG_DIR)) {
        const blogFiles = fs.readdirSync(BLOG_DIR)
            .filter(file => file.endsWith('.html'))
            .sort();
        blogFiles.forEach(file => {
            const filePath = path.join(BLOG_DIR, file);
            const stat = fs.statSync(filePath);
            const lastmod = toISODate(stat.mtime);
            urls.push({
                loc: `${DOMAIN}/blog-posts/${file}`,
                lastmod,
                changefreq: 'weekly',
                priority: '0.8'
            });
            blogCount++;
        });
    }

    // Build XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    sitemap += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
    sitemap += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`;
    sitemap += `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

    urls.forEach(u => {
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${u.loc}</loc>\n`;
        sitemap += `    <lastmod>${u.lastmod}</lastmod>\n`;
        sitemap += `    <changefreq>${u.changefreq}</changefreq>\n`;
        sitemap += `    <priority>${u.priority}</priority>\n`;
        sitemap += `  </url>\n`;
    });

    sitemap += `</urlset>`;

    fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemap, 'utf8');
    console.log(`sitemap.xml generated: ${urls.length - blogCount} pages + ${blogCount} blog posts = ${urls.length} total URLs`);
}

generateSitemap();
