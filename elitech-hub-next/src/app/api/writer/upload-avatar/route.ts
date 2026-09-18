import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('avatar') as File;
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: 'File size exceeds 2MB limit' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' }, { status: 400 });
  }

  const supabase = createServiceClient();
  
  const ext = file.type.split('/')[1];
  const filename = `${decoded.userId}-${Date.now()}.${ext}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('writer_profiles')
    .upload(filename, file, {
      contentType: file.type,
      upsert: true
    });

  if (uploadError) {
    console.error('[Avatar Upload] Storage error:', uploadError.message);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from('writer_profiles')
    .getPublicUrl(filename);

  const url = publicUrlData.publicUrl;

  const { error: updateError } = await supabase
    .from('writers')
    .update({ avatar_url: url, last_profile_update_at: new Date().toISOString() })
    .eq('id', decoded.userId);

  if (updateError) {
    console.error('[Avatar Upload] DB update error:', updateError.message);
    return NextResponse.json({ error: 'Failed to update profile image' }, { status: 500 });
  }

  return NextResponse.json({ url });
}
