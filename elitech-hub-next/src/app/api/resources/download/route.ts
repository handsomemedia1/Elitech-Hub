import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const resourceSlug = url.searchParams.get('slug');

  if (!resourceSlug) {
    return NextResponse.json({ error: 'Missing resource slug' }, { status: 400 });
  }

  const supabaseAdmin = createServiceClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  // 1. Fetch the resource record to check authorization
  const { data: resource, error } = await supabaseAdmin
    .from('resources')
    .select('file_url, status')
    .eq('slug', resourceSlug)
    .single();

  if (error || !resource || !resource.file_url) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const isPublished = resource.status === 'published';

  // 2. Check authorization if NOT published
  if (!isPublished) {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to view draft' }, { status: 401 });
    }
    // Only admin can view unpublished resources
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
  }

  // 3. File path handling. If it's a full URL (external link or already public link), just redirect to it.
  if (resource.file_url.startsWith('http')) {
    return NextResponse.redirect(resource.file_url);
  }

  // 4. Generate a short-lived signed URL from the private bucket
  const { data: signedUrlData, error: signError } = await supabaseAdmin.storage
    .from('research-files') // Using the same private bucket as research
    .createSignedUrl(resource.file_url, 60); // 60 seconds

  if (signError || !signedUrlData) {
    console.error('Signed URL error:', signError);
    return NextResponse.json({ error: 'Could not generate download link' }, { status: 500 });
  }

  return NextResponse.redirect(signedUrlData.signedUrl);
}
