/**
 * POST /api/auth/signup
 * Mirrors old backend auth.js /signup route
 */
export const runtime = 'nodejs';


import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createServiceClient } from '@/lib/supabase-server';
import { validateEmail, validatePassword, validateField, sanitizeText } from '@/lib/validators';
import { signToken } from '@/lib/auth';
import { authLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // ── Rate limit: 5 attempts / 15 min (matches old authLimiter) ─
  const ip = getClientIp(request);
  const limit = authLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many signup attempts. Please try again in 15 minutes.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // ── Validate ───────────────────────────────────────────────────
  const emailResult = validateEmail(body.email);
  if (!emailResult.valid) return NextResponse.json({ error: emailResult.error }, { status: 400 });

  const pwResult = validatePassword(body.password);
  if (!pwResult.valid) return NextResponse.json({ error: pwResult.error }, { status: 400 });

  const nameResult = validateField(body.name, 'Name', 100);
  if (!nameResult.valid) return NextResponse.json({ error: nameResult.error }, { status: 400 });

  const country = sanitizeText(body.country).slice(0, 10) || 'NG';

  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });

  // ── Duplicate check ────────────────────────────────────────────
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', emailResult.value)
    .single();

  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  }

  // ── Hash password (10 rounds — matches old backend) ────────────
  const passwordHash = await bcrypt.hash(body.password as string, 10);

  // ── Create user ────────────────────────────────────────────────
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      email: emailResult.value,
      password_hash: passwordHash,
      name: nameResult.value,
      country,
      has_access: false,
      role: 'student',
      token_version: 0,  // Start at version 0; bump to revoke all tokens
    })
    .select('id, email, name, has_access, role')
    .single();

  if (error || !user) {
    console.error('[Signup] DB error:', error?.message);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }

  const token = signToken({ userId: user.id, email: user.email, tokenVersion: 0 });

  return NextResponse.json({
    message: 'Account created successfully',
    user: { id: user.id, email: user.email, name: user.name, has_access: user.has_access, role: user.role },
    token,
  });
}
