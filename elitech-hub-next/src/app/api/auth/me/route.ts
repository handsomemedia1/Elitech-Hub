/**
 * GET /api/auth/me
 * Returns the authenticated user's profile
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  const result = await requireAuth(request);

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { user } = result;
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      country: user.country,
      has_access: user.has_access,
      role: user.role,
    },
  });
}
