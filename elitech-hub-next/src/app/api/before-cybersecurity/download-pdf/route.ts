import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { checkUserEntitlement } from '@/lib/before-cybersecurity/entitlements';
import { createServiceClient } from '@/lib/supabase-server';

export async function GET() {
  const user = await getServerUser();

  if (!user) {
    return NextResponse.json(
      {
        error: 'Authentication required. Please log in to download the Before Cybersecurity PDF.',
        code: 'AUTH_REQUIRED',
      },
      { status: 401 }
    );
  }

  // Check entitlement
  const entitlement = await checkUserEntitlement(user.id, user.role);

  if (!entitlement.hasAccess) {
    return NextResponse.json(
      {
        error: 'Active product entitlement required. You have not yet unlocked the full Before Cybersecurity package.',
        code: 'ENTITLEMENT_REQUIRED',
      },
      { status: 403 }
    );
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json(
      {
        error: 'Server database configuration unavailable.',
        code: 'SERVER_ERROR',
      },
      { status: 500 }
    );
  }

  const BUCKET_NAME = 'before-cybersecurity-assets';
  const FILE_NAME = 'Before Cybersecurity - The Complete Interactive Book-2.pdf';

  try {
    // Generate a secure, short-lived signed URL (valid for 60 seconds)
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(FILE_NAME, 60, {
        download: true,
      });

    if (error || !data?.signedUrl) {
      // The storage bucket or file has not been uploaded to Supabase yet
      return NextResponse.json(
        {
          error: 'PDF file is queued for deployment in private storage.',
          code: 'FILE_PENDING_STORAGE_UPLOAD',
          message:
            'The Before Cybersecurity PDF is prepared. To enable direct downloads, please upload the file to the private Supabase Storage bucket named "before-cybersecurity-assets". In the meantime, you can read the complete interactive guide online in the reader.',
          bucket: BUCKET_NAME,
          expectedFile: FILE_NAME,
        },
        { status: 404 }
      );
    }

    // Return the secure temporary signed URL
    return NextResponse.json({
      success: true,
      downloadUrl: data.signedUrl,
      expiresInSeconds: 60,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to generate download URL.',
        details: msg,
      },
      { status: 500 }
    );
  }
}
