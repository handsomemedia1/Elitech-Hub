import { NextResponse } from "next/server";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase-server";

/**
 * GET /api/admin/research
 * Returns ALL research records (including drafts) using the service_role key.
 * Requires a valid elitech_token cookie with role = 'admin'.
 */
export async function GET(request: Request) {
  const authResult = await requireAuth(request);
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const adminCheck = requireAdmin(authResult.user);
  if (adminCheck) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("research")
    .select("*, submitter:users(name, email)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/**
 * PATCH /api/admin/research
 * Update a research record's status. Admin only.
 */
export async function PATCH(request: Request) {
  const authResult = await requireAuth(request);
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const adminCheck = requireAdmin(authResult.user);
  if (adminCheck) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  const body = await request.json();
  const { id, publication_status } = body;

  if (!id || !publication_status) {
    return NextResponse.json({ error: "Missing id or publication_status" }, { status: 400 });
  }

  const isPublished = publication_status === "published";
  const { error } = await supabase
    .from("research")
    .update({ publication_status, published: isPublished })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

/**
 * DELETE /api/admin/research
 * Delete a research record. Admin only.
 */
export async function DELETE(request: Request) {
  const authResult = await requireAuth(request);
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const adminCheck = requireAdmin(authResult.user);
  if (adminCheck) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabase.from("research").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
