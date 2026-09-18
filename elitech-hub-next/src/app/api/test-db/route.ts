import { createServiceClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('testimonials').select('*').limit(1);
  return Response.json({ data, error });
}
