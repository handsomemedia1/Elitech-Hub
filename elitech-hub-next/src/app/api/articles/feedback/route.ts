import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, is_helpful } = body;

    if (!slug || typeof is_helpful !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const supabaseAdmin = createServiceClient();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    // Attempt to get IP or simple session identifier for basic rate limiting/duplicate prevention
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    // Simplified session identifier (just a combination of IP and user-agent in real scenario, here we just use what we get)
    const sessionId = ip;

    // Optional: check if this sessionId already voted on this slug recently to prevent spam
    const { count, error: countError } = await supabaseAdmin
      .from('article_feedback')
      .select('id', { count: 'exact', head: true })
      .eq('slug', slug)
      .eq('session_id', sessionId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

    if (countError) throw countError;

    if (count && count > 5) {
      return NextResponse.json({ error: 'Too many submissions' }, { status: 429 });
    }

    const { error: insertError } = await supabaseAdmin
      .from('article_feedback')
      .insert({
        slug,
        is_helpful,
        session_id: sessionId
      });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Article feedback error:', err);
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}
