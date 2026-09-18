import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role to perform atomic increment bypassing RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    // Use atomic RPC if migration has been run; fall back gracefully if not
    const { error: rpcError } = await supabaseAdmin.rpc('increment_citation_count', { paper_slug: slug });

    if (rpcError) {
      // Fallback for pre-migration state: read-then-write (best effort)
      const { data: paper } = await supabaseAdmin
        .from('research')
        .select('citations_count')
        .eq('slug', slug)
        .single();

      if (!paper) {
        return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
      }

      await supabaseAdmin
        .from('research')
        .update({ citations_count: (paper.citations_count || 0) + 1 })
        .eq('slug', slug);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging citation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
