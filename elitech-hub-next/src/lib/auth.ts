/**
 * JWT Auth utilities — mirrors the old backend's middleware/auth.js
 * Upgraded with:
 *  - Token versioning (instant revocation via token_version column)
 *  - Forgot-password helpers (HMAC reset tokens, 1-hour expiry)
 * Use ONLY in server-side code (API Route Handlers)
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { createServiceClient } from './supabase-server';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  userId: string;
  email: string;
  tokenVersion?: number;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  country: string;
  has_access: boolean;
  role: 'student' | 'admin' | 'writer' | 'researcher';
  token_version?: number;
}

// ─── JWT ───────────────────────────────────────────────────────────────────

/**
 * Sign a new JWT.
 * Includes tokenVersion so revocation works server-side by bumping the
 * token_version column in the users table.
 */
export function signToken(payload: {
  userId: string;
  email: string;
  tokenVersion?: number;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/** Verify a JWT and return its payload, or null if invalid/expired */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

/** Extract the Bearer token from an Authorization header */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.replace('Bearer ', '').trim() || null;
}

/**
 * Full auth check: extract → verify → fetch user → version check.
 * Returns { user } on success or { error, status } on failure.
 *
 * Token versioning: if the stored token_version doesn't match the one
 * embedded in the JWT, the token has been revoked (e.g. password change,
 * manual logout-all, or account compromise response).
 */
export async function requireAuth(
  request: Request
): Promise<{ user: AuthUser } | { error: string; status: number }> {
  // Check authorization header first, then fallback to cookie
  let token = extractBearerToken(request.headers.get('authorization'));
  
  if (!token) {
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)elitech_token=([^;]+)/);
      if (match) token = match[1];
    }
  }

  if (!token) {
    return { error: 'Authentication required', status: 401 };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { error: 'Invalid or expired token', status: 401 };
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return { error: 'Server configuration error', status: 500 };
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, name, country, has_access, role, token_version')
    .eq('id', payload.userId)
    .single();

  if (error || !user) {
    return { error: 'User not found', status: 401 };
  }

  // ── Token version check ───────────────────────────────────────────────
  if (
    user.token_version !== undefined &&
    user.token_version !== null &&
    payload.tokenVersion !== user.token_version
  ) {
    return { error: 'Session revoked. Please log in again.', status: 401 };
  }

  return { user: user as AuthUser };
}

import { cookies } from 'next/headers';

/** Server Component utility to get the currently logged-in user via cookie */
export async function getServerUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('elitech_token')?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data: user } = await supabase
    .from('users')
    .select('id, email, name, country, has_access, role, token_version')
    .eq('id', payload.userId)
    .single();

  if (!user) return null;

  if (
    user.token_version !== undefined &&
    user.token_version !== null &&
    payload.tokenVersion !== user.token_version
  ) {
    return null;
  }

  return user as AuthUser;
}

/** Check admin role — call after requireAuth */
export function requireAdmin(
  user: AuthUser
): { error: string; status: number } | null {
  if (user.role !== 'admin') {
    return { error: 'Admin access required', status: 403 };
  }
  return null;
}

/** Check paid access — call after requireAuth */
export function requirePaidAccess(
  user: AuthUser
): { error: string; status: number } | null {
  if (!user.has_access) {
    return {
      error: 'Access denied. Payment required to access this resource.',
      status: 403,
    };
  }
  return null;
}

// ─── Forgot / Reset Password ────────────────────────────────────────────────

const RESET_SECRET = process.env.RESET_TOKEN_SECRET || JWT_SECRET;
const RESET_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

/**
 * Generate a secure, time-bound reset token.
 * Token = HMAC-SHA256(userId + timestamp, RESET_SECRET)
 * Returns { rawToken, tokenHash, expiresAt }
 *   - rawToken: sent in the email link (never stored)
 *   - tokenHash: stored in the DB (bcrypt-like safety without extra deps)
 *   - expiresAt: ISO string for the DB column
 */
export function generateResetToken(userId: string): {
  rawToken: string;
  tokenHash: string;
  expiresAt: string;
} {
  const timestamp = Date.now();
  const rawToken = crypto
    .createHmac('sha256', RESET_SECRET)
    .update(`${userId}:${timestamp}:${crypto.randomBytes(16).toString('hex')}`)
    .digest('hex');

  const tokenHash = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  const expiresAt = new Date(timestamp + RESET_EXPIRY_MS).toISOString();

  return { rawToken, tokenHash, expiresAt };
}

/**
 * Validate a raw reset token against the stored hash and expiry.
 * Returns true if valid, false otherwise.
 */
export function validateResetToken(
  rawToken: string,
  storedHash: string,
  expiresAt: string
): boolean {
  if (new Date() > new Date(expiresAt)) return false;

  const hash = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  // Timing-safe comparison
  const hashBuf = Buffer.from(hash, 'hex');
  const storedBuf = Buffer.from(storedHash, 'hex');
  if (hashBuf.length !== storedBuf.length) return false;

  return crypto.timingSafeEqual(hashBuf, storedBuf);
}
