import { NextResponse } from "next/server";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase-server";

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
    .from("laptops")
    .select("*, laptop_images(*)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
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
    
    // Auto-generate slug if missing
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);
    }
    
    // Separate images
    const { laptop_images, ...laptopData } = body;
    
    // Insert laptop
    const { data: laptop, error: laptopError } = await supabase
      .from("laptops")
      .insert(laptopData)
      .select()
      .single();

    if (laptopError) throw laptopError;

    // Handle images if provided
    if (laptop_images && laptop_images.length > 0) {
      const imagesToInsert = laptop_images.map((img: any, index: number) => ({
        ...img,
        laptop_id: laptop.id,
        sort_order: img.sort_order || index,
      }));
      
      const { error: imageError } = await supabase
        .from("laptop_images")
        .insert(imagesToInsert);
        
      if (imageError) throw imageError;
    }

    return NextResponse.json({ success: true, data: laptop });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
