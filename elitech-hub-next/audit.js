const fs = require('fs');

async function crawl() {
  const baseUrl = 'http://localhost:3001';
  const liveUrl = 'https://elitechub.com';
  let errors = [];
  let warnings = [];

  // 1. Check sitemap
  console.log('Fetching sitemap...');
  let sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
  if (!sitemapRes.ok) {
    errors.push(`Sitemap failed: ${sitemapRes.status}`);
    return { errors, warnings };
  }
  let sitemapXml = await sitemapRes.text();
  
  // Extract URLs from sitemap
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  let matches;
  let routes = [];
  while ((matches = urlRegex.exec(sitemapXml)) !== null) {
    let url = matches[1].replace(liveUrl, baseUrl);
    routes.push(url);
  }
  console.log(`Found ${routes.length} routes in sitemap.`);

  // 2. Check robots.txt
  console.log('Fetching robots.txt...');
  let robotsRes = await fetch(`${baseUrl}/robots.txt`);
  if (!robotsRes.ok) {
    errors.push(`Robots.txt failed: ${robotsRes.status}`);
  } else {
    let robotsTxt = await robotsRes.text();
    if (!robotsTxt.includes('sitemap.xml')) {
      errors.push('Robots.txt missing sitemap link.');
    }
  }

  // 3. Crawl routes
  for (const url of routes) {
    console.log(`Crawling ${url}...`);
    let res = await fetch(url);
    if (!res.ok) {
      errors.push(`Failed to fetch ${url} - Status: ${res.status}`);
      continue;
    }
    
    let html = await res.text();
    
    // Check canonical
    const canonicalMatch = /<link[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/i.exec(html);
    if (!canonicalMatch) {
      errors.push(`Missing canonical tag on ${url}`);
    } else if (!canonicalMatch[1].startsWith(liveUrl)) {
      errors.push(`Canonical URL on ${url} is not pointing to production domain: ${canonicalMatch[1]}`);
    }
    
    // Check Title & Description
    if (!/<title>.*?<\/title>/i.test(html)) {
      errors.push(`Missing title on ${url}`);
    }
    if (!/<meta[^>]*name="description"[^>]*>/i.test(html)) {
      errors.push(`Missing description on ${url}`);
    }

    // Check JSON-LD
    if (!/<script type="application\/ld\+json">/.test(html) && !url.includes('/verify') && !url.includes('/thank-you')) {
      warnings.push(`No JSON-LD schema found on ${url}`);
    }

    // Check CountUp (Animated Counters) visibility
    // If the page has counters (like About or Home), verify sr-only
    if (url.endsWith('/about') || url === baseUrl || url.endsWith('/lab')) {
      if (!/<span class="sr-only">/.test(html) && /aria-hidden="true"/.test(html)) {
         errors.push(`Animated counters missing sr-only fallback on ${url}`);
      }
    }
  }

  console.log('=== AUDIT COMPLETE ===');
  console.log(`Errors (${errors.length}):`);
  errors.forEach(e => console.log(' - ' + e));
  console.log(`Warnings (${warnings.length}):`);
  warnings.forEach(w => console.log(' - ' + w));
  
  if (errors.length > 0) process.exit(1);
}

crawl().catch(err => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
