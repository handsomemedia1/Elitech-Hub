import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  const authResult = await requireAuth(request);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const researchId = formData.get('researchId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const supabaseAdmin = createServiceClient();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = (researchId || String(Date.now())) + '-v' + Date.now() + '.' + fileExt;
    const filePath = 'research/' + fileName;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from('research-files')
      .upload(filePath, buffer, {
        contentType: file.type || 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    return NextResponse.json({ 
      success: true, 
      filePath: filePath 
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
