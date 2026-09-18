import { NextResponse } from "next/server";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase-server";

export async function GET(request: Request, context: any) {
  const params = await context.params;
  const id = params.id;

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
    .from("laptops")
    .select("*, laptop_images(*)")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: Request, context: any) {
  const params = await context.params;
  const id = params.id;

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

  try {
    const body = await request.json();
    const { laptop_images, id: _removeId, ...laptopData } = body;

    const { data: laptop, error: laptopError } = await supabase
      .from("laptops")
      .update(laptopData)
      .eq("id", id)
      .select()
      .single();

    if (laptopError) throw laptopError;

    // Handle images updates (simple replace all for now, or careful merge)
    if (laptop_images !== undefined) {
      // Delete old images not in the new set, but easiest is delete all and insert
      await supabase.from("laptop_images").delete().eq("laptop_id", id);
      
      if (laptop_images.length > 0) {
        const imagesToInsert = laptop_images.map((img: any, index: number) => ({
          laptop_id: id,
          image_url: img.image_url,
          is_primary: img.is_primary || index === 0,
          sort_order: img.sort_order || index,
        }));
        const { error: imageError } = await supabase
          .from("laptop_images")
          .insert(imagesToInsert);
          
        if (imageError) throw imageError;
      }
    }

    return NextResponse.json({ success: true, data: laptop });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  const params = await context.params;
  const id = params.id;

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

  // Soft delete (archive)
  const { error } = await supabase
    .from("laptops")
    .update({ archived: true, published: false })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
