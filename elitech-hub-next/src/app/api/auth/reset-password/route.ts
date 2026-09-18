/**
 * POST /api/auth/reset-password
 * Step 2 of the password reset flow.
 * Accepts { token, uid, newPassword }, validates the token,
 * updates the password, bumps token_version (revokes all JWTs),
 * and clears the reset token from the DB.
 */
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createServiceClient } from '@/lib/supabase-server';
import { validatePassword } from '@/lib/validators';
import { validateResetToken } from '@/lib/auth';

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { token, uid, newPassword } = body as {
    token?: string;
    uid?: string;
    newPassword?: string;
  };

  if (!token || !uid || typeof token !== 'string' || typeof uid !== 'string') {
    return NextResponse.json({ error: 'Invalid reset link' }, { status: 400 });
  }

  const pwResult = validatePassword(newPassword);
  if (!pwResult.valid) {
    return NextResponse.json({ error: pwResult.error }, { status: 400 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  // ── Fetch user with reset token data ───────────────────────────
  const { data: user, error } = await supabase
    .from('users')
    .select('id, reset_token_hash, reset_token_expires, token_version')
    .eq('id', uid)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
  }

  if (!user.reset_token_hash || !user.reset_token_expires) {
    return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
  }

  // ── Validate token (timing-safe) ───────────────────────────────
  const isValid = validateResetToken(token, user.reset_token_hash, user.reset_token_expires);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
  }

  // ── Hash new password ──────────────────────────────────────────
  const passwordHash = await bcrypt.hash(newPassword as string, 10);

  // ── Update DB: new password + bump token_version + clear reset token ─
  // Bumping token_version invalidates ALL existing JWTs — the user must
  // log in fresh after a password reset.
  const { error: updateError } = await supabase
    .from('users')
    .update({
      password_hash: passwordHash,
      token_version: (user.token_version ?? 0) + 1,
      reset_token_hash: null,
      reset_token_expires: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', uid);

  if (updateError) {
    console.error('[ResetPassword] DB update error:', updateError.message);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }

  return NextResponse.json({
    message: 'Password updated successfully. Please log in with your new password.',
  });
}
