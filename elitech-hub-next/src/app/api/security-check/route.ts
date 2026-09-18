import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { validateEmail, sanitizeText } from '@/lib/validators';
import { formLimit, getClientIp } from '@/lib/rate-limit';
import dns from 'dns';
import { promisify } from 'util';
import ipRangeCheck from 'ip-range-check';

const resolveTxt = promisify(dns.resolveTxt);
const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);

const BANNED_CIDRS = [
  // IPv4
  '10.0.0.0/8',
  '172.16.0.0/12',
  '192.168.0.0/16',
  '127.0.0.0/8',
  '169.254.0.0/16',
  '100.64.0.0/10',
  '0.0.0.0/8',
  '224.0.0.0/4',
  '255.255.255.255/32',
  // IPv6
  '::1/128',
  'fc00::/7',
  'fe80::/10',
  'ff00::/8',
  '::/128',
];

export async function POST(request: Request) {
  // 1. Rate Limiting
  const ip = getClientIp(request);
  const limit = formLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // 2. Parse body
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const emailResult = validateEmail(body.email);
  if (!emailResult.valid) {
    return NextResponse.json({ error: emailResult.error }, { status: 400 });
  }

  // Basic domain sanitization
  let rawDomain = sanitizeText(body.domain).toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
  if (!domainRegex.test(rawDomain)) {
    return NextResponse.json({ error: 'Invalid domain format.' }, { status: 400 });
  }

  // 3. DNS Rebinding & SSRF Protection
  try {
    const [ipv4, ipv6] = await Promise.allSettled([resolve4(rawDomain), resolve6(rawDomain)]);
    
    let resolvedIps: string[] = [];
    if (ipv4.status === 'fulfilled') resolvedIps.push(...ipv4.value);
    if (ipv6.status === 'fulfilled') resolvedIps.push(...ipv6.value);

    if (resolvedIps.length === 0) {
      return NextResponse.json({ error: 'Could not resolve domain.' }, { status: 400 });
    }

    // Check every resolved IP against banned CIDRs
    for (const resIp of resolvedIps) {
      if (ipRangeCheck(resIp, BANNED_CIDRS)) {
        console.warn(`[Security Check] Blocked SSRF attempt for domain ${rawDomain} resolving to ${resIp}`);
        return NextResponse.json({ error: 'Internal domains are not allowed.' }, { status: 400 });
      }
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'DNS resolution failed.' }, { status: 400 });
  }

  // 4. Save Lead
  const supabase = createServiceClient();
  if (supabase) {
    const { error } = await supabase.from('leads').insert([{
      email: emailResult.value,
      domain: rawDomain,
      source: 'security-check',
      created_at: new Date().toISOString(),
    }]);
    if (error) console.error('[Security Check] DB insert error:', error.message);
  }

  // 5. Perform Passive Checks
  const report = {
    domain: rawDomain,
    hsts: false,
    csp: false,
    xContentTypeOptions: false,
    spf: false,
    dmarc: false,
    overallTransport: 'Needs Attention',
    overallWeb: 'Needs Attention',
    overallEmail: 'Needs Attention',
  };

  // HTTP Headers Check (redirect: manual prevents following redirects to internal IPs)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`https://${rawDomain}`, {
      method: 'HEAD',
      redirect: 'manual', // Prevent SSRF via 301/302 redirects
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const hstsHeader = res.headers.get('strict-transport-security');
    if (hstsHeader && hstsHeader.includes('max-age=')) report.hsts = true;

    const cspHeader = res.headers.get('content-security-policy');
    if (cspHeader) report.csp = true;

    const xctoHeader = res.headers.get('x-content-type-options');
    if (xctoHeader && xctoHeader.toLowerCase() === 'nosniff') report.xContentTypeOptions = true;

    if (report.hsts) report.overallTransport = 'Good';
    if (report.csp && report.xContentTypeOptions) report.overallWeb = 'Good';
    else if (report.csp || report.xContentTypeOptions) report.overallWeb = 'Moderate';

  } catch (error: any) {
    console.error(`[Security Check] Error fetching headers for ${rawDomain}:`, error.message);
    // Continue even if HTTP fails
  }

  // DNS TXT Check (SPF, DMARC)
  try {
    const txtRecords = await resolveTxt(rawDomain);
    const flatTxt = txtRecords.map(r => r.join(''));
    
    if (flatTxt.some(r => r.startsWith('v=spf1'))) report.spf = true;
    
    try {
      const dmarcRecords = await resolveTxt(`_dmarc.${rawDomain}`);
      const flatDmarc = dmarcRecords.map(r => r.join(''));
      if (flatDmarc.some(r => r.startsWith('v=DMARC1'))) report.dmarc = true;
    } catch (e) {}

    if (report.spf && report.dmarc) report.overallEmail = 'Good';
    else if (report.spf || report.dmarc) report.overallEmail = 'Moderate';

  } catch (error: any) {
    console.error(`[Security Check] Error fetching DNS for ${rawDomain}:`, error.message);
  }

  return NextResponse.json({ success: true, report });
}
