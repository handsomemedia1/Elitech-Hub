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

  const { data: writer, error } = await supabase
    .from('writers')
    .select('id, email, name, password_hash, status, active')
    .eq('email', emailResult.value)
    .single();

  if (error || !writer) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const valid = await bcrypt.compare(body.password, writer.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Check approval status
  if (writer.status === 'pending') {
    return NextResponse.json({ error: 'Your writer application is still awaiting approval.' }, { status: 403 });
  }
  
  if (writer.status === 'rejected') {
    return NextResponse.json({ error: 'Your writer application has been rejected.' }, { status: 403 });
  }
  
  if (writer.status === 'suspended' || writer.active === false) {
    return NextResponse.json({ error: 'Your account is suspended or inactive.' }, { status: 403 });
  }

  // Writer role logic here - maybe signToken supports role: 'writer'
  const token = signToken({
    userId: writer.id,
    email: writer.email,
    tokenVersion: 0, // Since writers may not have token_version yet, default 0
    role: 'writer' // Custom property if your JWT validates it
  });

  const response = NextResponse.json({
    message: 'Login successful',
    user: {
      id: writer.id,
      email: writer.email,
      name: writer.name,
      role: 'writer',
    },
    token,
  });

  response.cookies.set('elitech_writer_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return response;
}
