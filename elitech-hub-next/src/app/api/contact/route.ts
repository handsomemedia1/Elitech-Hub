/**
 * POST /api/contact
 * Handles the Contact Us form — mirrors old inquiries.js
 */
export const runtime = 'nodejs';


import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { validateEmail, validateField, sanitizeText } from '@/lib/validators';
import { sendContactConfirmation, sendContactNotification } from '@/lib/email';
import { sendTelegramPing } from '@/lib/telegram';
import { formLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // ── Rate limiting ──────────────────────────────────────────────
  const ip = getClientIp(request);
  const limit = formLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // ── Parse body ─────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // ── Validate & sanitise ────────────────────────────────────────
  const nameResult = validateField(body.name, 'Name', 100);
  if (!nameResult.valid) return NextResponse.json({ error: nameResult.error }, { status: 400 });

  const emailResult = validateEmail(body.email);
  if (!emailResult.valid) return NextResponse.json({ error: emailResult.error }, { status: 400 });

  const messageResult = validateField(body.message, 'Message', 5000);
  if (!messageResult.valid) return NextResponse.json({ error: messageResult.error }, { status: 400 });

  const phone = sanitizeText(body.phone).slice(0, 20) || null;
  const program = sanitizeText(body.program).slice(0, 100) || 'General Inquiry';

  // ── Persist to Supabase ────────────────────────────────────────
  const supabase = createServiceClient();
  if (supabase) {
    const { error } = await supabase.from('messages').insert([{
      name: nameResult.value,
      email: emailResult.value,
      phone,
      program_interest: program,
      message: messageResult.value,
      created_at: new Date().toISOString(),
    }]);
    if (error) console.error('[Contact] DB insert error:', error.message);
  }

  // ── Send notifications ─────────────────────────────────────────
  await Promise.allSettled([
    sendContactConfirmation({ to: emailResult.value, name: nameResult.value }),
    sendContactNotification({
      name: nameResult.value,
      email: emailResult.value,
      phone: phone ?? undefined,
      program,
      message: messageResult.value,
    }),
    sendTelegramPing(`📬 <b>NEW CONTACT MESSAGE</b>\n\n<b>Name:</b> ${nameResult.value}\n<b>Email:</b> ${emailResult.value}\n<b>Program:</b> ${program || 'N/A'}\n\n<b>Message:</b>\n<i>${messageResult.value}</i>`)
  ]);

  return NextResponse.json({ success: true, message: 'Message sent successfully' });
}
