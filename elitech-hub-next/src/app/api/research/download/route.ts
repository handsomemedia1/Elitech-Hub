import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const researchId = url.searchParams.get('id');

  if (!researchId) {
    return NextResponse.json({ error: 'Missing research ID' }, { status: 400 });
  }

  const supabaseAdmin = createServiceClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  // 1. Fetch the research record to check authorization
  const { data: research, error } = await supabaseAdmin
    .from('research')
    .select('file_url, published, publication_status, submitter_id')
    .eq('id', researchId)
    .single();

  if (error || !research || !research.file_url) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const isPublished = research.published === true || research.publication_status === 'published';

  // 2. Check authorization if NOT published
  if (!isPublished) {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to view draft' }, { status: 401 });
    }
    // Only submitter or admin can view unpublished files
    if (user.id !== research.submitter_id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
  }

  // 3. File path handling. If it's a full URL (old data), just redirect to it.
  if (research.file_url.startsWith('http')) {
    return NextResponse.redirect(research.file_url);
  }

  // 4. Generate a short-lived signed URL from the private bucket
  const { data: signedUrlData, error: signError } = await supabaseAdmin.storage
    .from('research-files')
    .createSignedUrl(research.file_url, 60); // 60 seconds

  if (signError || !signedUrlData) {
    console.error('Signed URL error:', signError);
    return NextResponse.json({ error: 'Could not generate download link' }, { status: 500 });
  }

  return NextResponse.redirect(signedUrlData.signedUrl);
}
