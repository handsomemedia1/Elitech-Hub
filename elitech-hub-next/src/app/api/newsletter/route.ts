/**
 * POST /api/newsletter
 * Newsletter subscription — writes to leads table matching old leads.js
 */
export const runtime = 'nodejs';


import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { validateEmail } from '@/lib/validators';
import { sendNewsletterWelcome } from '@/lib/email';
import { newsletterLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // ── Rate limiting ──────────────────────────────────────────────
  const ip = getClientIp(request);
  const limit = newsletterLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // ── Parse & validate ───────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const emailResult = validateEmail(body.email);
  if (!emailResult.valid) {
    return NextResponse.json({ error: emailResult.error }, { status: 400 });
  }

  // ── Upsert to leads table (duplicate-safe) ─────────────────────
  const supabase = createServiceClient();
  let alreadySubscribed = false;

  if (supabase) {
    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('email', emailResult.value)
      .single();

    if (existing) {
      alreadySubscribed = true;
    } else {
      const { error } = await supabase.from('leads').insert([{
        email: emailResult.value,
        whatsapp: body.whatsapp || null,
        segment: 'newsletter',
        source_page: body.source || 'footer',
        created_at: new Date().toISOString(),
      }]);
      if (error) console.error('[Newsletter] DB insert error:', error.message);
    }
  }

  // ── Send welcome email only for new subscribers ────────────────
  if (!alreadySubscribed) {
    await sendNewsletterWelcome({ to: emailResult.value });
  }

  return NextResponse.json({
    success: true,
    message: alreadySubscribed
      ? "You're already subscribed!"
      : "Successfully subscribed! Check your inbox.",
  });
}
