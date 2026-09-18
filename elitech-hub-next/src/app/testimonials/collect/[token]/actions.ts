'use server';

import { createServiceClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function submitTestimonial(formData: FormData) {
  // We use the service client to bypass RLS since the token acts as auth
  const supabase = createServiceClient();
  
  const token = formData.get('token') as string;
  if (!token) return { error: 'Invalid token' };

  try {
    // 1. Verify token is active
    const { data: request, error: reqError } = await supabase
      .from('testimonial_collection_requests')
      .select('id, status, recipient_name, relationship_type, context')
      .eq('token', token)
      .single();

    if (reqError || !request) {
      return { error: 'Invalid collection request link.' };
    }

    if (request.status !== 'active') {
      return { error: 'This testimonial request has already been used or expired.' };
    }

    // 2. Parse form data
    const name = (formData.get('name') as string) || request.recipient_name;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    const organization = formData.get('organization') as string;
    const quote = formData.get('quote') as string;
    const rating = parseInt(formData.get('rating') as string) || 5;
    const relationship_type = formData.get('relationship_type') as string;
    
    // Consents
    const consent_to_publish = formData.get('consent_to_publish') === 'on';
    const consent_to_use_name = formData.get('consent_to_use_name') === 'on';
    const consent_to_use_photo = formData.get('consent_to_use_photo') === 'on';
    const consent_to_use_organization = formData.get('consent_to_use_organization') === 'on';

    if (!quote || quote.length < 20) {
      return { error: 'Testimonial must be at least 20 characters.' };
    }
    if (quote.length > 2000) {
      return { error: 'Testimonial cannot exceed 2000 characters.' };
    }
    if (!consent_to_publish) {
      return { error: 'You must provide consent to publish to submit a testimonial.' };
    }

    // 3. Insert Testimonial
    const { data: testimonial, error: insertError } = await supabase
      .from('testimonials')
      .insert({
        source: 'first_party',
        author_name: name,
        email: email,
        author_role: role,
        organization: organization,
        quote: quote,
        rating: rating,
        relationship_type: relationship_type,
        relationship_context: request.context,
        status: 'pending',
        collection_token: token,
        consent_to_publish,
        consent_to_use_name,
        consent_to_use_photo,
        consent_to_use_organization,
        is_published: false // Fallback for old schema
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert Error:', insertError);
      return { error: `Database Error: ${insertError.message}` };
    }

    // 4. Update the token request to "submitted"
    await supabase
      .from('testimonial_collection_requests')
      .update({ 
        status: 'submitted',
        testimonial_id: testimonial.id,
        submitted_at: new Date().toISOString()
      })
      .eq('token', token);

    revalidatePath('/admin/testimonials');
    return { success: true };

  } catch (err: any) {
    console.error(err);
    return { error: 'An unexpected error occurred.' };
  }
}
