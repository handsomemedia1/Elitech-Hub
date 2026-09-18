'use server';

import { createServiceClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { getServerUser } from '@/lib/auth';

export async function fetchMembershipApplications() {
  const user = await getServerUser();
  if (!user || user.role !== 'admin') return { data: [], error: 'Unauthorized' };

  const supabase = createServiceClient();
  if (!supabase) return { data: [], error: 'No DB connection' };

  const { data, error } = await supabase
    .from('research_membership_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Membership fetch error:', error);
    return { data: [], error: error.message };
  }
  return { data: data || [], error: null };
}

export async function updateMembershipStatusAction(id: string, status: string) {
  const user = await getServerUser();
  if (!user || user.role !== 'admin') return { success: false, error: 'Unauthorized' };

  const supabase = createServiceClient();
  if (!supabase) return { success: false, error: 'No DB connection' };

  const { error } = await supabase
    .from('research_membership_applications')
    .update({ status })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/membership');
  return { success: true };
}
