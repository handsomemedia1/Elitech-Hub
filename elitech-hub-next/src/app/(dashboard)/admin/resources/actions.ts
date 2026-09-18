'use server';

import { createServiceClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { getServerUser } from '@/lib/auth';

export async function saveResource(formData: FormData) {
  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const supabaseAdmin = createServiceClient();
  if (!supabaseAdmin) throw new Error('Database connection failed');

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const author = formData.get('author') as string;
  const topic = formData.get('topic') as string;
  const resource_type = formData.get('resource_type') as string;
  const status = formData.get('status') as string;
  const publication_date = formData.get('publication_date') as string | null;
  const version = formData.get('version') as string | null;
  const references = formData.get('references') as string | null;
  let file_url = formData.get('file_url') as string;
  const file = formData.get('file') as File | null;

  // Handle file upload
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `resource-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `resources/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from('research-files')
      .upload(filePath, buffer, {
        contentType: file.type || 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    file_url = filePath;
  }

  if (!title || !file_url) {
    throw new Error('Title and File/URL are required');
  }

  // Generate slug
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

  const payload: Record<string, any> = {
    title,
    description: description || null,
    author: author || null,
    topic: topic || null,
    resource_type,
    status,
    file_url,
    version: version || null,
    references: references || null,
    ...(publication_date ? { publication_date } : {}),
    ...(id ? {} : { slug })
  };

  let error;
  if (id) {
    const { error: updateError } = await supabaseAdmin.from('resources').update(payload).eq('id', id);
    error = updateError;
  } else {
    const { error: insertError } = await supabaseAdmin.from('resources').insert([payload]);
    error = insertError;
  }

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/resources');
  revalidatePath('/admin/resources');
  return { success: true };
}

export async function deleteResource(id: string) {
  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const supabaseAdmin = createServiceClient();
  if (!supabaseAdmin) throw new Error('Database connection failed');

  const { error } = await supabaseAdmin.from('resources').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/resources');
  revalidatePath('/admin/resources');
  return { success: true };
}
