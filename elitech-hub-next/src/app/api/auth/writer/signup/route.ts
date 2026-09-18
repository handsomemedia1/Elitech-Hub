import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createServiceClient } from '@/lib/supabase-server';
import { validateEmail, validatePassword, validateField } from '@/lib/validators';
import { authLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = authLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many signup attempts. Please try again in 15 minutes.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const emailResult = validateEmail(body.email);
  if (!emailResult.valid) return NextResponse.json({ error: emailResult.error }, { status: 400 });

  const pwResult = validatePassword(body.password);
  if (!pwResult.valid) return NextResponse.json({ error: pwResult.error }, { status: 400 });

  const nameResult = validateField(body.name, 'Name', 100);
  if (!nameResult.valid) return NextResponse.json({ error: nameResult.error }, { status: 400 });

  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });

  // Duplicate check
  const { data: existing } = await supabase
    .from('writers')
    .select('id')
    .eq('email', emailResult.value)
    .single();

  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(body.password as string, 10);

  // Create writer - Status defaults to 'pending' as per migration
  const { data: writer, error } = await supabase
    .from('writers')
    .insert({
      email: emailResult.value,
      password_hash: passwordHash,
      name: nameResult.value,
      display_name: nameResult.value,
      status: 'pending'
    })
    .select('id, email, name, status')
    .single();

  if (error || !writer) {
    console.error('[Writer Signup] DB error:', error?.message);
    return NextResponse.json({ error: 'Failed to create writer account' }, { status: 500 });
  }

  // Do NOT return a token. Approval is pending.
  return NextResponse.json({
    message: 'Writer account created successfully. Awaiting administrator approval.',
    writer: { id: writer.id, email: writer.email, name: writer.name, status: writer.status },
  });
}
