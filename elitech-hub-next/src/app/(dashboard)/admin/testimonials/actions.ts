'use server';

import { createServiceClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { getServerUser } from '@/lib/auth';

// Define the type to match what the client expects
type CollectionRequest = {
  id: string;
  token: string;
  recipient_name: string;
  recipient_email: string;
  relationship_type: string;
  context: string;
  status: 'active' | 'submitted' | 'expired' | 'revoked';
  created_at: string;
};

export async function fetchAdminTestimonialsData(): Promise<{
  testimonials: any[];
  collectionRequests: any[];
  error?: string;
}> {
  const user = await getServerUser();
  if (!user || user.role !== 'admin') return { testimonials: [], collectionRequests: [], error: 'Unauthorized' };

  const supabaseAdmin = createServiceClient();
  if (!supabaseAdmin) return { testimonials: [], collectionRequests: [], error: 'No DB connection' };

  const [{ data: testimonials, error: te }, { data: requests, error: re }] = await Promise.all([
    supabaseAdmin.from('testimonials').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('testimonial_collection_requests').select('*').order('created_at', { ascending: false }),
  ]);

  if (te) console.error('testimonials fetch error:', te);
  if (re) console.error('requests fetch error:', re);

  return {
    testimonials: (testimonials || []).map(t => ({
      ...t,
      status: t.status || (t.is_published ? 'approved' : 'pending'),
    })),
    collectionRequests: requests || [],
  };
}


export async function createCollectionRequestAction(
  name: string, 
  email: string, 
  relationship: string, 
  context: string
): Promise<{ success: boolean; data?: CollectionRequest; error?: string }> {
  try {
    const user = await getServerUser();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    const supabaseAdmin = createServiceClient();
    if (!supabaseAdmin) {
      return { success: false, error: 'Database connection failed' };
    }

    // Insert using admin privileges (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('testimonial_collection_requests')
      .insert([{
        recipient_name: name,
        recipient_email: email,
        relationship_type: relationship,
        context: context,
        status: 'active'
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/testimonials');
    return { success: true, data };
  } catch (err: any) {
    console.error('Action Error:', err);
    return { success: false, error: err.message || 'Internal Server Error' };
  }
}

export async function revokeCollectionRequestAction(id: string) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== 'admin') return { success: false, error: 'Unauthorized' };

    const supabaseAdmin = createServiceClient();
    if (!supabaseAdmin) return { success: false, error: 'Database connection failed' };

    const { error } = await supabaseAdmin
      .from('testimonial_collection_requests')
      .update({ status: 'revoked' })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    
    revalidatePath('/admin/testimonials');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateTestimonialStatusAction(id: string, newStatus: string) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== 'admin') return { success: false, error: 'Unauthorized' };

    const supabaseAdmin = createServiceClient();
    if (!supabaseAdmin) return { success: false, error: 'Database connection failed' };

    const { error } = await supabaseAdmin
      .from('testimonials')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    
    revalidatePath('/admin/testimonials');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleTestimonialFeaturedAction(id: string, currentValue: boolean) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== 'admin') return { success: false, error: 'Unauthorized' };

    const supabaseAdmin = createServiceClient();
    if (!supabaseAdmin) return { success: false, error: 'Database connection failed' };

    const { error } = await supabaseAdmin
      .from('testimonials')
      .update({ featured: !currentValue })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    
    revalidatePath('/admin/testimonials');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
