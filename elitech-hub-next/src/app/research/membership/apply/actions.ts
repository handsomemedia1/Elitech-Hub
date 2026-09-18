'use server';

import { supabaseAdmin } from '@/lib/supabase-server';

export async function submitApplication(prevState: any, formData: FormData) {
  try {
    const rawData = {
      full_name: formData.get('full_name') as string,
      email: formData.get('email') as string,
      country: formData.get('country') as string,
      professional_title: formData.get('professional_title') as string,
      institution: formData.get('institution') as string,
      department: formData.get('department') as string,
      specialization: formData.get('specialization') as string,
      orcid: formData.get('orcid') as string,
      google_scholar_url: formData.get('google_scholar_url') as string,
      linkedin_url: formData.get('linkedin_url') as string,
      website_url: formData.get('website_url') as string,
      research_background: formData.get('research_background') as string,
      publications: formData.get('publications') as string,
      current_projects: formData.get('current_projects') as string,
      motivation: formData.get('motivation') as string,
      contribution: formData.get('contribution') as string,
      expectations: formData.get('expectations') as string,
      // Handle array input (comma separated string)
      research_interests: (formData.get('research_interests') as string)
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) || [],
      // Keep status as default 'New' handled by DB
    };

    if (!rawData.full_name || !rawData.email) {
      return { success: false, message: 'Full name and email are required.' };
    }

    const { error } = await supabaseAdmin
      .from('research_membership_applications')
      .insert([rawData]);

    if (error) {
      console.error('Supabase Insert Error:', error);
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Application submitted successfully.' };
  } catch (error: any) {
    console.error('Server Action Error:', error);
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}
