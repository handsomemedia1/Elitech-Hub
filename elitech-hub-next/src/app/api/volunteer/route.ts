/**
 * POST /api/volunteer
 * Volunteer applications — mirrors old volunteers.js
 */
export const runtime = 'nodejs';


import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { validateEmail, validateField, sanitizeText } from '@/lib/validators';
import { sendVolunteerConfirmation, sendVolunteerNotification } from '@/lib/email';
import { formLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // ── Rate limiting ──────────────────────────────────────────────
  const ip = getClientIp(request);
  const limit = formLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  // ── Parse body ─────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // ── Validate required fields ───────────────────────────────────
  const nameResult     = validateField(body.fullName, 'Full Name', 100);
  if (!nameResult.valid) return NextResponse.json({ error: nameResult.error }, { status: 400 });

  const emailResult    = validateEmail(body.email);
  if (!emailResult.valid) return NextResponse.json({ error: emailResult.error }, { status: 400 });

  const phoneResult    = validateField(body.phone, 'Phone Number', 30);
  if (!phoneResult.valid) return NextResponse.json({ error: phoneResult.error }, { status: 400 });

  const locationResult = validateField(body.location, 'Location', 200);
  if (!locationResult.valid) return NextResponse.json({ error: locationResult.error }, { status: 400 });

  const roleResult     = validateField(body.role, 'Role', 100);
  if (!roleResult.valid) return NextResponse.json({ error: roleResult.error }, { status: 400 });

  const motivationResult = validateField(body.motivation, 'Motivation', 3000);
  if (!motivationResult.valid) return NextResponse.json({ error: motivationResult.error }, { status: 400 });

  // Optional
  const linkedin    = sanitizeText(body.linkedin).slice(0, 300) || null;
  const portfolio   = sanitizeText(body.portfolio).slice(0, 300) || null;
  const experience  = sanitizeText(body.experience).slice(0, 3000) || null;
  const availability = sanitizeText(body.availability).slice(0, 100) || null;
  const goals       = sanitizeText(body.goals).slice(0, 3000) || null;
  const tools       = sanitizeText(body.tools).slice(0, 1000) || null;

  // ── Check for duplicate pending application ────────────────────
  const supabase = createServiceClient();
  if (supabase) {
    const { data: existing } = await supabase
      .from('volunteer_applications')
      .select('id')
      .eq('email', emailResult.value)
      .eq('status', 'pending')
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'You already have a pending volunteer application.' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('volunteer_applications').insert([{
      full_name:    nameResult.value,
      email:        emailResult.value,
      phone:        phoneResult.value,
      location:     locationResult.value,
      role:         roleResult.value,
      linkedin_url: linkedin,
      portfolio_url: portfolio,
      experience,
      availability,
      motivation:   motivationResult.value,
      goals,
      tools,
      status:       'pending',
      applied_at:   new Date().toISOString(),
    }]);

    if (error) console.error('[Volunteer] DB insert error:', error.message);
  }

  // ── Send emails ────────────────────────────────────────────────
  await Promise.allSettled([
    sendVolunteerConfirmation({
      to: emailResult.value,
      name: nameResult.value,
      role: roleResult.value,
    }),
    sendVolunteerNotification({
      fullName:   nameResult.value,
      email:      emailResult.value,
      phone:      phoneResult.value,
      role:       roleResult.value,
      location:   locationResult.value,
      motivation: motivationResult.value,
    }),
  ]);

  return NextResponse.json({ success: true, message: 'Application submitted successfully' });
}
