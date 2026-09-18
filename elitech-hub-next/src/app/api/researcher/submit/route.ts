import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const authResult = await requireAuth(request);
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { editId, researchPayload, authorsPayload } = body;
    
    // Ensure the submitter is always the authenticated user
    researchPayload.submitter_id = authResult.user.id;

    let researchId = editId;

    if (editId) {
      // Security check: only the submitter can update
      const { data: existing } = await supabase.from('research').select('submitter_id').eq('id', editId).single();
      if (!existing || existing.submitter_id !== authResult.user.id) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      const { error } = await supabase.from('research').update(researchPayload).eq('id', editId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from('research').insert([researchPayload]).select('id').single();
      if (error) throw error;
      researchId = data.id;
    }

    if (researchId && authorsPayload) {
      await supabase.from('research_authors').delete().eq('research_id', researchId);
      const authors = authorsPayload.map((a: any) => ({ ...a, research_id: researchId }));
      await supabase.from('research_authors').insert(authors);
    }

    return NextResponse.json({ success: true, id: researchId });
  } catch (err: any) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const authResult = await requireAuth(request);
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data, error } = await supabase.from('research').select('*').eq('id', id).single();
  
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  if (data.submitter_id !== authResult.user.id && authResult.user.role !== 'admin') {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return NextResponse.json({ data });
}
