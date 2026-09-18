import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (id) {
    const { data, error } = await supabase.from('labs').select('*').eq('id', id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } else {
    const { data, error } = await supabase.from('labs').select('*').order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }
}

export async function POST(request: Request) {
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
  
  try {
    const body = await request.json();
    const { data, error } = await supabase.from('labs').insert(body).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
  
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    const { data, error } = await supabase.from('labs').update(updates).eq('id', id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  
  const { error } = await supabase.from('labs').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
