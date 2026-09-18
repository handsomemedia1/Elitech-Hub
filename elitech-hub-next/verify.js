const http = require('http');

const ROUTES = [
  '/', 
  '/about', 
  '/programs', 
  '/programs/cybersecurity-bootcamp', 
  '/programs/professional',
  '/thank-you',
  '/robots.txt',
  '/sitemap.xml'
];

async function fetchRoute(path, headers = {}) {
  return new Promise((resolve, reject) => {
    http.get({
      hostname: 'localhost',
      port: 3000,
      path: path,
      headers: headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
  return match ? match[1] : null;
}

function extractJsonLd(html) {
  const matches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  if (!matches) return [];
  return matches.map(m => {
    const jsonStr = m.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
    try {
      return JSON.parse(jsonStr);
    } catch(e) {
      return null;
    }
  });
}

async function runTests() {
  console.log("--- 1. HTTP STATUS & CANONICAL VERIFICATION ---");
  for (const route of ROUTES) {
    if (route.endsWith('.xml') || route.endsWith('.txt')) {
      const res = await fetchRoute(route);
      console.log(`[${res.status}] ${route}`);
      continue;
    }
    const res = await fetchRoute(route);
    const canonical = extractCanonical(res.data);
    console.log(`[${res.status}] ${route} -> Canonical: ${canonical || 'MISSING'}`);
  }

  console.log("\n--- 2. RAW HTML & ANIMATED COUNTER VERIFICATION ---");
  const homeRes = await fetchRoute('/');
  const html = homeRes.data;
  
  // Check for CountUp accessibility pattern
  const srOnlyMatches = html.match(/<span class="sr-only[^"]*">([^<]+)<\/span>/g);
  console.log("SR-Only Spans found:", srOnlyMatches ? srOnlyMatches.length : 0);
  if (srOnlyMatches) {
    console.log("Examples:", srOnlyMatches.slice(0, 3).join(" | "));
  }
  
  const ariaHiddenMatches = html.match(/aria-hidden="true"/g);
  console.log("aria-hidden='true' instances:", ariaHiddenMatches ? ariaHiddenMatches.length : 0);

  console.log("\n--- 3. REGIONAL PRICING & CACHE SAFETY VERIFICATION ---");
  const usRes = await fetchRoute('/programs', { 'Cookie': 'detected_country=US' });
  const ngRes = await fetchRoute('/programs');
  
  const usHtmlPrice = usRes.data.includes('200000') || usRes.data.includes('75000');
  const ngHtmlPrice = ngRes.data.includes('200000') || ngRes.data.includes('75000');
  
  console.log(`US Request has static values in SSR: ${usHtmlPrice}`);
  console.log(`NG Request has static values in SSR: ${ngHtmlPrice}`);

  console.log("\n--- 4. JSON-LD VERIFICATION ---");
  const progRes = await fetchRoute('/programs/cybersecurity-bootcamp');
  const schemas = extractJsonLd(progRes.data);
  console.log(`JSON-LD Schemas on /programs/cybersecurity-bootcamp: ${schemas.length}`);
  schemas.forEach(schema => {
    if (schema && schema.offers) {
      console.log("Offer Currency:", schema.offers.priceCurrency);
      if (schema.offers.eligibleRegion) {
         console.log("Eligible Region:", schema.offers.eligibleRegion.name);
      } else {
         console.log("Eligible Region: NOT SET");
      }
    }
  });

  console.log("\n--- 5. THANK-YOU PAGE APPLICATION VERIFICATION ---");
  const tyRes = await fetchRoute('/thank-you');
  const isPaymentMentioned = tyRes.data.toLowerCase().includes('payment');
  const isApplicationMentioned = tyRes.data.toLowerCase().includes('application');
  console.log(`Mentions "Payment": ${isPaymentMentioned}`);
  console.log(`Mentions "Application": ${isApplicationMentioned}`);

}

runTests().catch(console.error);
