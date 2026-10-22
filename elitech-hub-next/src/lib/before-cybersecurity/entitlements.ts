// ============================================================
// Before Cybersecurity — Entitlements & Product Access
// Authenticated user + Active entitlement for Before Cybersecurity = Paid product access
// Does NOT require global student role; respects product entitlement architecture
// ============================================================

import { createServiceClient } from '@/lib/supabase-server';

export interface EntitlementCheckResult {
  hasAccess: boolean;
  reason: 'entitled' | 'admin_grant' | 'no_entitlement' | 'unauthenticated' | 'db_unavailable';
  grantedAt?: string;
  productVersion?: string;
}

/**
 * Server-side check for user's Before Cybersecurity entitlement.
 */
export async function checkUserEntitlement(userId: string | null | undefined, userRole?: string): Promise<EntitlementCheckResult> {
  if (!userId) {
    return { hasAccess: false, reason: 'unauthenticated' };
  }

  // Administrators have preview/auditing access
  if (userRole === 'admin') {
    return { hasAccess: true, reason: 'admin_grant', productVersion: '1.0' };
  }

  const supabase = createServiceClient();
  if (!supabase) {
    // Graceful fallback if database client cannot be created
    return { hasAccess: false, reason: 'db_unavailable' };
  }

  try {
    // 1. First get the Before Cybersecurity product ID
    const { data: product } = await supabase
      .from('bc_products')
      .select('id, current_version')
      .eq('slug', 'before-cybersecurity')
      .single();

    if (!product) {
      return { hasAccess: false, reason: 'no_entitlement' };
    }

    // 2. Query bc_entitlements for active record
    const { data: entitlement, error } = await supabase
      .from('bc_entitlements')
      .select('id, status, product_version, granted_at')
      .eq('user_id', userId)
      .eq('product_id', product.id)
      .eq('status', 'active')
      .maybeSingle();

    if (error || !entitlement) {
      return { hasAccess: false, reason: 'no_entitlement' };
    }

    return {
      hasAccess: true,
      reason: 'entitled',
      grantedAt: entitlement.granted_at,
      productVersion: entitlement.product_version || product.current_version,
    };
  } catch (err) {
    console.error('[Before-Cybersecurity Entitlement Check Error]:', err);
    return { hasAccess: false, reason: 'db_unavailable' };
  }
}

/**
 * Grants product entitlement upon verified payment webhook or confirmation.
 */
export async function grantProductEntitlement(params: {
  userId: string;
  orderId?: string;
  productSlug?: string;
}): Promise<{ success: boolean; entitlementId?: string; error?: string }> {
  const supabase = createServiceClient();
  if (!supabase) {
    return { success: false, error: 'Database service client unavailable' };
  }

  try {
    const slug = params.productSlug || 'before-cybersecurity';
    const { data: product, error: prodErr } = await supabase
      .from('bc_products')
      .select('id, current_version')
      .eq('slug', slug)
      .single();

    if (prodErr || !product) {
      return { success: false, error: 'Product not found in bc_products' };
    }

    // Upsert entitlement record
    const { data: entitlement, error: entErr } = await supabase
      .from('bc_entitlements')
      .upsert(
        {
          user_id: params.userId,
          product_id: product.id,
          order_id: params.orderId || null,
          product_version: product.current_version || '1.0',
          status: 'active',
          granted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,product_id' }
      )
      .select('id')
      .single();

    if (entErr) {
      return { success: false, error: entErr.message };
    }

    return { success: true, entitlementId: entitlement?.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}
