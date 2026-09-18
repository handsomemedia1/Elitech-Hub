import { NextResponse } from 'next/server';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  const authResult = await requireAuth(request);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const adminCheck = requireAdmin(authResult.user);
  if (adminCheck) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const supabaseAdmin = createServiceClient();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = 'laptop-' + Date.now() + '-' + Math.round(Math.random() * 10000) + '.' + fileExt;
    // We will use 'public' bucket under 'laptops' folder as it's safe if 'laptop-images' doesn't exist
    // Actually the user instructed to use 'laptop-images' bucket or existing. I'll use 'laptop-images'.
    const filePath = fileName;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Make sure bucket 'laptop-images' exists.
    const { error: uploadError } = await supabaseAdmin.storage
      .from('laptop-images')
      .upload(filePath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('laptop-images')
      .getPublicUrl(filePath);

    return NextResponse.json({ 
      success: true, 
      filePath: filePath,
      publicUrl: publicUrlData.publicUrl
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
