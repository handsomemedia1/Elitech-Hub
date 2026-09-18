import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Client-side Supabase instance (anon key)
 * Use ONLY for public read-only operations (e.g. fetching published blog posts).
 * For any writes or protected reads, use createServiceClient() from supabase-server.ts
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server Component read-only client (anon key, subject to RLS)
 * Safe for reading published public data from Server Components.
 * NEVER use this for writes — import createServiceClient() instead.
 */
export function getSupabaseServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  author: string;
  thumbnail: string | null;
  published_at: string;
  views: number;
  tags: string[];
  word_count: number | null;
};

