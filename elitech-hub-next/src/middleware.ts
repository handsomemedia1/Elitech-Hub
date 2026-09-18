import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Edge Middleware
 * - Bot/scanner user-agent blocking (production only)
 * - Security headers (CSP, CORS for API routes)
 * - Basic rate-limit signalling (enforced properly in route handlers)
 */

const BLOCKED_AGENTS = [
  'sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab',
  'libwww-perl', 'python-requests', 'go-http-client',
  'java/', 'wget',
];

// Only block curl/postman in production so development stays easy
const PROD_ONLY_BLOCKED = ['curl', 'postmanruntime'];

const IS_PROD = process.env.NODE_ENV === 'production';

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent')?.toLowerCase() || '';
  const path = request.nextUrl.pathname;

  // ── Bot blocking ───────────────────────────────────────────────
  const alwaysBlock = BLOCKED_AGENTS.some(agent => ua.includes(agent));
  const prodBlock   = IS_PROD && PROD_ONLY_BLOCKED.some(agent => ua.includes(agent));

  if (alwaysBlock || prodBlock) {
    return new NextResponse('Access Denied.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const response = NextResponse.next();

  // ── Security headers (applied to every route) ──────────────────
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (IS_PROD) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // ── Content Security Policy ────────────────────────────────────
  // Only set CSP on pages (not on API routes, which don't serve HTML)
  if (!path.startsWith('/api/')) {
      const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://widget.senja.io https://cdn.trustpilot.com https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
      "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
      "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://i.ytimg.com https://lh3.googleusercontent.com https://www.googletagmanager.com https://www.google-analytics.com https://stats.g.doubleclick.net",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://cloudflareinsights.com",
      "frame-src https://www.youtube.com https://www.linkedin.com https://widget.senja.io https://www.trustpilot.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; ');
    response.headers.set('Content-Security-Policy', csp);
  }

  // ── CORS for API routes ────────────────────────────────────────
  if (path.startsWith('/api/')) {
    const origin = request.headers.get('origin') || '';
    const allowed = IS_PROD
      ? ['https://elitechub.com', 'https://www.elitechub.com']
      : ['http://localhost:3000', 'http://127.0.0.1:3000'];

    if (!origin || allowed.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*');
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // ── Route Protection (Basic Cookie Check) ──────────────────────
  // The actual crypto validation happens in Server Components / API routes.
  // This just ensures unauthenticated users are bounced early.
  if (path.startsWith('/admin') && path !== '/admin/login') {
    if (!request.cookies.has('elitech_token')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  if (path.startsWith('/writer') && path !== '/writer/login') {
    if (!request.cookies.has('elitech_token')) {
      return NextResponse.redirect(new URL('/writer/login', request.url));
    }
  }

  if (path.startsWith('/researcher') && path !== '/researcher/login') {
    if (!request.cookies.has('elitech_token')) {
      return NextResponse.redirect(new URL('/researcher/login', request.url));
    }
  }

  return response;
}

export const config = {
  // Apply to ALL routes including /api/*
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
