/**
 * POST /api/auth/forgot-password
 * Step 1 of the password reset flow.
 * Accepts { email }, generates a short-lived reset token,
 * stores its hash in the DB, and emails the user a reset link.
 *
 * Security:
 *  - Always returns 200 regardless of whether the email exists
 *    (prevents email enumeration)
 *  - Rate-limited to 3 requests / 15 min per IP
 */
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { validateEmail } from '@/lib/validators';
import { generateResetToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';
import { authLimit, getClientIp } from '@/lib/rate-limit';

const GENERIC_OK = {
  message: 'If that email is registered, a reset link has been sent.',
};

export async function POST(request: Request) {
  // ── Rate limit ─────────────────────────────────────────────────
  const ip = getClientIp(request);
  const limit = authLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const emailResult = validateEmail(body.email);
  if (!emailResult.valid) {
    // Return generic message even for bad email to prevent enumeration
    return NextResponse.json(GENERIC_OK, { status: 200 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  // ── Look up user ───────────────────────────────────────────────
  const { data: user } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('email', emailResult.value)
    .single();

  // Always respond with success even if user not found
  if (!user) {
    return NextResponse.json(GENERIC_OK, { status: 200 });
  }

  // ── Generate reset token ───────────────────────────────────────
  const { rawToken, tokenHash, expiresAt } = generateResetToken(user.id);

  // Store hash and expiry in DB (never store the raw token)
  const { error: updateError } = await supabase
    .from('users')
    .update({
      reset_token_hash: tokenHash,
      reset_token_expires: expiresAt,
    })
    .eq('id', user.id);

  if (updateError) {
    console.error('[ForgotPassword] Failed to store token:', updateError.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  // ── Send email ─────────────────────────────────────────────────
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://elitechub.com';
  const resetLink = `${appUrl}/reset-password?token=${rawToken}&uid=${user.id}`;

  await sendPasswordResetEmail({
    to: user.email,
    name: user.name,
    resetLink,
  });

  return NextResponse.json(GENERIC_OK, { status: 200 });
}
