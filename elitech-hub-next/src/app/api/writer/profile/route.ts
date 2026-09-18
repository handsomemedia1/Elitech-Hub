import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data: writer, error } = await supabase
    .from('writers')
    .select('id, name, display_name, email, slug, professional_title, bio, full_bio, expertise, location, linkedin_url, portfolio_url, website_url, avatar_url, status, is_public')
    .eq('id', decoded.userId)
    .single();

  if (error || !writer) return NextResponse.json({ error: 'Writer not found' }, { status: 404 });
  return NextResponse.json({ writer });
}

export async function PUT(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const supabase = createServiceClient();

  let slug = body.slug;
  if (!slug && (body.display_name || body.name)) {
    let baseSlug = slugify(body.display_name || body.name);
    const { data: existing } = await supabase.from('writers').select('id').eq('slug', baseSlug).neq('id', decoded.userId).single();
    if (existing) {
      baseSlug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;
    }
    slug = baseSlug;
  }

  const { data: writer, error } = await supabase
    .from('writers')
    .update({
      display_name: body.display_name,
      slug,
      professional_title: body.professional_title,
      bio: body.bio,
      full_bio: body.full_bio,
      expertise: body.expertise,
      location: body.location,
      linkedin_url: body.linkedin_url,
      portfolio_url: body.portfolio_url,
      website_url: body.website_url,
      last_profile_update_at: new Date().toISOString()
    })
    .eq('id', decoded.userId)
    .select('id, name, display_name, email, slug, professional_title, bio, full_bio, expertise, location, linkedin_url, portfolio_url, website_url, avatar_url, status, is_public')
    .single();

  if (error) {
    console.error('[Writer Profile] Update error:', error.message);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Profile updated', writer });
}
