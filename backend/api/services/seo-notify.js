/**
 * SEO Notification Service
 * Pings Google Sitemap + IndexNow (Bing, Yandex, Naver, Seznam)
 * Called automatically when a blog post is published
 */

const SITE_URL = 'https://elitechub.com';

// IndexNow API key — host this file at /indexnow-key.txt on your site
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'elitechub-indexnow-key-2026';

/**
 * Notify search engines about a new or updated URL
 * @param {string} url - The full URL that was published/updated
 */
export async function notifySearchEngines(url) {
    const results = { google: null, indexNow: null };

    // 1. Ping Google Sitemap
    try {
        const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITE_URL + '/sitemap.xml')}`;
        const res = await fetch(googlePingUrl);
        results.google = { success: res.ok, status: res.status };
        console.log(`[SEO] Google sitemap ping: ${res.ok ? 'OK' : 'FAILED'} (${res.status})`);
    } catch (err) {
        results.google = { success: false, error: err.message };
        console.error('[SEO] Google ping failed:', err.message);
    }

    // 2. IndexNow (Bing + Yandex + Naver + Seznam at once)
    try {
        const indexNowPayload = {
            host: 'elitechub.com',
            key: INDEXNOW_KEY,
            keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
            urlList: [url]
        };

        const res = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(indexNowPayload)
        });

        results.indexNow = { success: res.ok || res.status === 202, status: res.status };
        console.log(`[SEO] IndexNow ping: ${res.ok || res.status === 202 ? 'OK' : 'FAILED'} (${res.status})`);
    } catch (err) {
        results.indexNow = { success: false, error: err.message };
        console.error('[SEO] IndexNow ping failed:', err.message);
    }

    return results;
}

/**
 * Notify search engines about multiple URLs at once (batch)
 * @param {string[]} urls - Array of full URLs
 */
export async function notifySearchEnginesBatch(urls) {
    if (!urls || urls.length === 0) return null;

    const results = { google: null, indexNow: null };

    // Google sitemap ping (just pings sitemap, doesn't need individual URLs)
    try {
        const res = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(SITE_URL + '/sitemap.xml')}`);
        results.google = { success: res.ok, status: res.status };
    } catch (err) {
        results.google = { success: false, error: err.message };
    }

    // IndexNow supports batch of up to 10,000 URLs
    try {
        const res = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({
                host: 'elitechub.com',
                key: INDEXNOW_KEY,
                keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
                urlList: urls.slice(0, 10000)
            })
        });
        results.indexNow = { success: res.ok || res.status === 202, status: res.status };
    } catch (err) {
        results.indexNow = { success: false, error: err.message };
    }

    return results;
}
