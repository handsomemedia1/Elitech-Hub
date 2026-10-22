import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { checkUserEntitlement } from '@/lib/before-cybersecurity/entitlements';

export async function GET() {
  const user = await getServerUser();

  if (!user) {
    return NextResponse.json({
      hasAccess: false,
      authenticated: false,
      reason: 'unauthenticated',
    });
  }

  const entitlement = await checkUserEntitlement(user.id, user.role);

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    ...entitlement,
  });
}
