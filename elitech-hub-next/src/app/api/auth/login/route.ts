import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createServiceClient } from '@/lib/supabase-server';
import { validateEmail } from '@/lib/validators';
import { signToken } from '@/lib/auth';
import { authLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = authLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many login attempts. Please try again in 15 minutes.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const emailResult = validateEmail(body.email);
  if (!emailResult.valid) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

  if (!body.password || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });

  let authUser: any = null;
  let authRole = 'student';

  // 1. Try to fetch from 'users' table
  const { data: user } = await supabase
    .from('users')
    .select('id, email, name, password_hash, has_access, role, country, token_version')
    .eq('email', emailResult.value)
    .single();

  if (user) {
    authUser = user;
    authRole = user.role;
  } else {
    // 2. Try to fetch from 'writers' table
    const { data: writer } = await supabase
      .from('writers')
      .select('id, email, name, password_hash, status, active')
      .eq('email', emailResult.value)
      .single();

    if (writer) {
      authUser = writer;
      authRole = 'writer';
      
      // Explicitly check writer approval status
      if (writer.status === 'pending') {
        return NextResponse.json({ error: 'Your writer application is still awaiting approval.' }, { status: 403 });
      }
      if (writer.status === 'rejected') {
        return NextResponse.json({ error: 'Your writer application has been rejected.' }, { status: 403 });
      }
      if (writer.status === 'suspended' || writer.active === false) {
        return NextResponse.json({ error: 'Your account is suspended or inactive.' }, { status: 403 });
      }
    }
  }

  if (!authUser) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Verify password
  const valid = await bcrypt.compare(body.password, authUser.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = signToken({
    userId: authUser.id,
    email: authUser.email,
    tokenVersion: authUser.token_version ?? 0,
    role: authRole
  });

  const response = NextResponse.json({
    message: 'Login successful',
    user: {
      id: authUser.id,
      email: authUser.email,
      name: authUser.name,
      country: authUser.country,
      has_access: authUser.has_access,
      role: authRole,
    },
    token,
  });

  response.cookies.set('elitech_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return response;
}
