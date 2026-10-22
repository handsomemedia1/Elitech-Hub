import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

describe('Elitech Hub Technical & On-Page SEO Suite', () => {

  test('1. Canonical Domain Consistency', () => {
    // Layout and config must use canonical production domain
    const layoutPath = path.join(ROOT_DIR, 'src/app/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    
    assert.match(layoutContent, /const SITE_URL = 'https:\/\/www\.elitechub\.com'/);
    assert.doesNotMatch(layoutContent, /const SITE_URL = 'https:\/\/elitechub\.com'/);
  });

  test('2. Robots Directives Security and Coverage', () => {
    const robotsPath = path.join(ROOT_DIR, 'src/app/robots.ts');
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');

    // Confirm critical private routes are disallowed
    const expectedDisallows = [
      '/api/',
      '/admin',
      '/before-cybersecurity/dashboard',
      '/before-cybersecurity/account',
      '/before-cybersecurity/report',
      '/before-cybersecurity/roadmap',
      '/before-cybersecurity/guide',
      '/before-cybersecurity/resources',
      '/before-cybersecurity/assessment',
      '/before-cybersecurity/results',
      '/testimonials/collect/',
      '/certificate/'
    ];

    for (const route of expectedDisallows) {
      assert.ok(
        robotsContent.includes(`'${route}'`) || robotsContent.includes(`"${route}"`),
        `robots.ts must disallow private route: ${route}`
      );
    }

    // Confirm sitemap is set to canonical production domain
    assert.match(robotsContent, /https:\/\/www\.elitechub\.com\/sitemap\.xml/);
  });

  test('3. Sitemap Integrity, Deduplication, and Exclusions', () => {
    const sitemapPath = path.join(ROOT_DIR, 'src/app/sitemap.ts');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

    // Confirm misleading static lastModified timestamps have been eliminated in favor of reliable dates/omission
    assert.doesNotMatch(sitemapContent, /STATIC_LAST_MODIFIED/);
    assert.match(sitemapContent, /parseReliableDate/);
    assert.match(sitemapContent, /sitemapMap = new Map/);

    // Confirm redirected slug is explicitly filtered out from sitemap
    assert.ok(
      sitemapContent.includes('step-by-step-cybersecurity-guide-for-overwhelmed-beginners-moftm94x'),
      'sitemap.ts must contain logic filtering out redirected blog slugs'
    );

    // Confirm key high-intent routes and previously missing public routes are included
    const highIntentRoutes = [
      'url: baseUrl',
      'url: `${baseUrl}/programs`',
      'url: `${baseUrl}/programs/cybersecurity-bootcamp`',
      'url: `${baseUrl}/programs/professional`',
      'url: `${baseUrl}/consultation`',
      'url: `${baseUrl}/coaching`',
      'url: `${baseUrl}/before-cybersecurity`',
      'url: `${baseUrl}/security-check`',
      'url: `${baseUrl}/research/membership/apply`',
      'url: `${baseUrl}/research/behavioral-cybersecurity`',
      'url: `${baseUrl}/research-paper`',
      'url: `${baseUrl}/researcher-guidelines`',
      'url: `${baseUrl}/security`',
      'url: `${baseUrl}/volunteer`'
    ];

    for (const r of highIntentRoutes) {
      assert.ok(
        sitemapContent.includes(r),
        `sitemap.ts must include route entry: ${r}`
      );
    }
  });

  test('4. Redirect Rules in next.config.ts', () => {
    const configPath = path.join(ROOT_DIR, 'next.config.ts');
    const configContent = fs.readFileSync(configPath, 'utf8');

    // Confirm 301/308 permanent redirects exist
    assert.ok(configContent.includes("source: '/mentorship'"));
    assert.ok(configContent.includes("destination: '/coaching'"));
    assert.ok(configContent.includes("source: '/blog/step-by-step-cybersecurity-guide-for-overwhelmed-beginners-moftm94x'"));
    assert.ok(configContent.includes("destination: '/blog/what-cybersecurity-means-and-why-it-is-important-mniuol60'"));

    // Deprecated Next 16 eslint config must be removed
    assert.doesNotMatch(configContent, /ignoreDuringBuilds/);
  });

  test('5. Social Preview Images Exist on Disk', () => {
    const appDir = path.join(ROOT_DIR, 'src/app');
    const checkedImages = new Set();

    function scanFiles(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanFiles(fullPath);
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const matches = content.matchAll(/https:\/\/www\.elitechub\.com\/(images\/[a-zA-Z0-9_\-\.]+\.(?:jpg|png|webp))/g);
          for (const m of matches) {
            checkedImages.add(m[1]);
          }
        }
      }
    }

    scanFiles(appDir);

    for (const imgRelPath of checkedImages) {
      const diskPath = path.join(ROOT_DIR, 'public', imgRelPath);
      assert.ok(
        fs.existsSync(diskPath),
        `Referenced image file does not exist on disk: ${imgRelPath} (checked at ${diskPath})`
      );
    }
  });

  test('6. Title Formatting - No Double Brand Suffixes in Page Titles', () => {
    const appDir = path.join(ROOT_DIR, 'src/app');
    const violations = [];

    function checkTitles(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          checkTitles(fullPath);
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          if (entry.name === 'layout.tsx' && fullPath.includes('src/app/layout.tsx')) {
            continue; // layout.tsx defines the template
          }
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');
          let inSubObject = false;
          let braceDepth = 0;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.includes('openGraph:') || line.includes('twitter:') || line.includes('jsonLd =') || line.includes('personSchema =')) {
              inSubObject = true;
              braceDepth = 0;
            }

            if (inSubObject) {
              const openBraces = (line.match(/{/g) || []).length;
              const closeBraces = (line.match(/}/g) || []).length;
              braceDepth += openBraces - closeBraces;
              if (braceDepth <= 0 && line.includes('}')) {
                inSubObject = false;
              }
              continue;
            }

            if (
              line.includes('title:') &&
              (line.includes('| Elitech Hub') || line.includes('- Elitech Hub')) &&
              !line.includes('template') &&
              !line.includes('default')
            ) {
              violations.push(`${fullPath}:${i + 1} -> ${line.trim()}`);
            }
          }
        }
      }
    }

    checkTitles(appDir);
    assert.deepEqual(violations, [], `Found pages with duplicate brand suffixes in metadata.title:\n${violations.join('\n')}`);
  });

  test('7. Truthful Claims and Contact Details in llms.txt and Metadata', () => {
    const llmsPath = path.join(ROOT_DIR, 'public/llms.txt');
    const llmsContent = fs.readFileSync(llmsPath, 'utf8');

    // Confirm no fabricated job placement claims
    assert.doesNotMatch(llmsContent, /100% job placement rate/i);

    // Confirm approved public contact emails
    assert.ok(llmsContent.includes('info@elitechub.com'));
    assert.ok(llmsContent.includes('elijah@elitechub.com'));

    // Confirm forbidden aliases are absent
    assert.doesNotMatch(llmsContent, /support@elitechub\.com/i);
    assert.doesNotMatch(llmsContent, /privacy@elitechub\.com/i);
    assert.doesNotMatch(llmsContent, /mentors@elitechub\.com/i);
  });

  test('8. Structured Schema Entity Consistency in Layout', () => {
    const layoutPath = path.join(ROOT_DIR, 'src/app/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');

    // Verify Organization and EducationalOrganization schema
    assert.ok(layoutContent.includes("addressLocality: 'Ibadan'"));
    assert.ok(layoutContent.includes("addressRegion: 'Oyo State'"));
    assert.ok(layoutContent.includes("telephone: '+234 708 196 8062'"));
    assert.ok(layoutContent.includes("email: 'info@elitechub.com'"));
    assert.ok(layoutContent.includes("latitude: 7.3775"));
    assert.ok(layoutContent.includes("longitude: 3.9470"));
  });

  test('9. Utility and Auth Routes Noindex Directives', () => {
    const authRoutes = ['login', 'register', 'verify', 'certificate/[id]'];

    for (const route of authRoutes) {
      const layoutFile = path.join(ROOT_DIR, 'src/app', route, 'layout.tsx');
      assert.ok(
        fs.existsSync(layoutFile),
        `Route /${route} must have a layout.tsx defining metadata`
      );
      const content = fs.readFileSync(layoutFile, 'utf8');
      assert.match(
        content,
        /index:\s*false/,
        `Route /${route}/layout.tsx must specify index: false in robots metadata`
      );
    }
  });

  test('10. Built XML Sitemap Protocol and Deduplication Validation', () => {
    const sitemapBodyPath = path.join(ROOT_DIR, '.next/server/app/sitemap.xml.body');
    if (!fs.existsSync(sitemapBodyPath)) {
      // Build output is optional if running tests prior to npm run build
      return;
    }

    const xml = fs.readFileSync(sitemapBodyPath, 'utf8').trim();
    assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'Must include valid XML declaration');
    assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), 'Must define valid sitemaps.org namespace');
    assert.ok(xml.endsWith('</urlset>'), 'Must terminate with closing </urlset> tag');

    const locMatches = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m => m[1]);
    assert.ok(locMatches.length > 50, 'Sitemap should contain complete set of static + dynamic URLs');
    assert.ok(locMatches.length <= 50000, 'Sitemap cannot exceed 50,000 URLs per protocol specification');

    // Deduplication assertion
    const uniqueLocs = new Set(locMatches);
    assert.equal(uniqueLocs.size, locMatches.length, 'Sitemap must contain zero duplicate URLs');

    // Canonical protocol and domain assertion
    for (const loc of locMatches) {
      assert.ok(loc.startsWith('https://www.elitechub.com'), `All URLs must use HTTPS canonical host: ${loc}`);
      assert.doesNotMatch(loc, /step-by-step-cybersecurity-guide-for-overwhelmed-beginners-moftm94x/, 'Redirected slugs must not be in sitemap');
    }
  });

  test('11. GSC Legacy Netlify URL 308 Redirects and Missing Query Protection', () => {
    const configPath = path.join(ROOT_DIR, 'next.config.ts');
    const configContent = fs.readFileSync(configPath, 'utf8');

    // Confirm new key legacy static redirects are present
    assert.ok(configContent.includes("source: '/about.html'"), 'Must redirect /about.html');
    assert.ok(configContent.includes("destination: '/about'"), 'Must target /about');
    assert.ok(configContent.includes("source: '/policies.html'"), 'Must redirect /policies.html');
    assert.ok(configContent.includes("destination: '/policies'"), 'Must target /policies');
    assert.ok(configContent.includes("source: '/blog.html'"), 'Must redirect /blog.html');
    assert.ok(configContent.includes("destination: '/blog'"), 'Must target /blog');
    assert.ok(configContent.includes("key: 'tag'"), 'Must protect /blog.html against blanket tag redirection');

    // Confirm specialized slug predecessors
    assert.ok(
      configContent.includes("source: '/blog-posts/tutorial-home-lab-setup'"),
      'Must redirect legacy home lab tutorial'
    );
    assert.ok(
      configContent.includes("destination: '/blog/how-to-set-up-your-first-cybersecurity-lab-at-home-even-with-zero-it-experience'"),
      'Must target canonical home lab article'
    );
    assert.ok(
      configContent.includes("source: '/blog-posts/cybersecurity-bootcamp-guaranteed-internship.html'"),
      'Must redirect legacy bootcamp landing slug'
    );
    assert.ok(
      configContent.includes("destination: '/programs/cybersecurity-bootcamp'"),
      'Must target canonical cybersecurity bootcamp route'
    );

    // Audit JSON coverage: all 58 legacy 308 redirects must be defined in next.config.ts
    const auditPath = path.join(ROOT_DIR, 'scripts/gsc_audit_detailed.json');
    if (fs.existsSync(auditPath)) {
      const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
      const redirects = audit.filter(a => a.action === '308_REDIRECT');
      for (const r of redirects) {
        const parsed = new URL(r.url);
        const slug = parsed.searchParams.get('slug');
        if (slug) {
          assert.ok(configContent.includes(slug), `next.config.ts must handle legacy query slug: ${slug}`);
        } else {
          assert.ok(configContent.includes(parsed.pathname), `next.config.ts must handle legacy pathname: ${parsed.pathname}`);
        }
      }
    }
  });

  test('12. Soft 404 Prevention on Dynamic Topic Category Routes', () => {
    const topicPath = path.join(ROOT_DIR, 'src/app/topics/[slug]/page.tsx');
    const topicContent = fs.readFileSync(topicPath, 'utf8');

    // Confirm notFound() is called when hasContent is false
    assert.match(topicContent, /if\s*\(!hasContent\)\s*{\s*notFound\(\);\s*}/, 'Must call notFound() when no content exists');

    // Confirm metadata returns noindex robots for empty topics
    assert.match(topicContent, /robots:\s*{\s*index:\s*false,\s*follow:\s*false\s*}/, 'Must set noindex robots on empty topics');
  });


  test('13. Before Cybersecurity Product Technical SEO & Structured Data', () => {
    const layoutPath = path.join(ROOT_DIR, 'src/app/before-cybersecurity/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');

    // 1. Correct Title (without duplicate brand suffix)
    assert.match(
      layoutContent,
      /title:\s*'Before Cybersecurity: What to Know Before Learning'/,
      'Product layout title must not contain duplicate brand suffix'
    );
    assert.doesNotMatch(
      layoutContent,
      /title:.*\| Elitech-Hub/,
      'Product layout title must not hardcode | Elitech-Hub'
    );

    // 2. Canonical URL consistency
    assert.match(
      layoutContent,
      /canonical:\s*'https:\/\/www\.elitechub\.com\/before-cybersecurity'/,
      'Canonical URL must target production domain'
    );

    // 3. Dedicated Social Preview Image
    assert.match(
      layoutContent,
      /https:\/\/www\.elitechub\.com\/images\/og-before-cybersecurity\.jpg/,
      'Open Graph image must point to dedicated product visual'
    );

    // 4. Server-rendered JSON-LD (native script, safe serialization, no next/script)
    assert.doesNotMatch(
      layoutContent,
      /from 'next\/script'/,
      'Must not use next/script for JSON-LD structured data'
    );
    assert.match(
      layoutContent,
      /<script\s+type="application\/ld\+json"/,
      'Must use native script tag for server-rendered JSON-LD'
    );
    assert.match(
      layoutContent,
      /safeJsonLd/,
      'Must use safe JSON serializer preventing script breakout'
    );

    // 5. Author attribution
    assert.match(
      layoutContent,
      /name:\s*'Elijah Adegboyega Adeyeye'/,
      'Author attribution must use Elijah Adegboyega Adeyeye'
    );

    // 6. Offer omitted until price lock confirmation
    assert.doesNotMatch(
      layoutContent,
      /'@type':\s*'Offer'/,
      'Unconfirmed commercial Offer schema must be omitted pending price sign-off'
    );

    // 7. Sitemap exclusion of private sub-routes
    const sitemapPath = path.join(ROOT_DIR, 'src/app/sitemap.ts');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    assert.match(
      sitemapContent,
      /url:\s*`\${baseUrl}\/before-cybersecurity`/,
      'Sitemap must include public landing route'
    );
    assert.doesNotMatch(
      sitemapContent,
      /before-cybersecurity\/assessment/,
      'Sitemap must not include blocked /assessment'
    );
    assert.doesNotMatch(
      sitemapContent,
      /before-cybersecurity\/guide/,
      'Sitemap must not include blocked /guide'
    );

    // 8. Sub-route noindex enforcement
    const appLayoutPath = path.join(ROOT_DIR, 'src/app/before-cybersecurity/(app)/layout.tsx');
    const appLayoutContent = fs.readFileSync(appLayoutPath, 'utf8');
    assert.match(appLayoutContent, /index:\s*false/);

    const assessmentLayoutPath = path.join(ROOT_DIR, 'src/app/before-cybersecurity/assessment/layout.tsx');
    const assessmentLayoutContent = fs.readFileSync(assessmentLayoutPath, 'utf8');
    assert.match(assessmentLayoutContent, /index:\s*false/);

    const resultsLayoutPath = path.join(ROOT_DIR, 'src/app/before-cybersecurity/results/layout.tsx');
    const resultsLayoutContent = fs.readFileSync(resultsLayoutPath, 'utf8');
    assert.match(resultsLayoutContent, /index:\s*false/);

    // 9. Navigation and Footer Discoverability
    const navPath = path.join(ROOT_DIR, 'src/components/ScrollNavbar.tsx');
    const navContent = fs.readFileSync(navPath, 'utf8');
    assert.match(
      navContent,
      /href:\s*["']\/before-cybersecurity["']/,
      'ScrollNavbar must link to /before-cybersecurity'
    );
    assert.match(
      navContent,
      /\/before-cybersecurity\/dashboard/,
      'ScrollNavbar must exclude product application shell routes'
    );

    const footerPath = path.join(ROOT_DIR, 'src/components/Footer.tsx');
    const footerContent = fs.readFileSync(footerPath, 'utf8');
    assert.match(
      footerContent,
      /href=["']\/before-cybersecurity["']/,
      'Footer must link to /before-cybersecurity'
    );
  });
});
