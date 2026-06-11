import { supabase } from "@/lib/supabase";

// GET /api/tasks  → returns current store state
export async function GET() {
  const { data, error } = await supabase
    .from("store_state")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data?.state || null);
}

// POST /api/tasks  body: { state }  → upserts store state
export async function POST(request) {
  const body = await request.json();

  const { error } = await supabase
    .from("store_state")
    .upsert({ id: 1, state: body.state, updated_at: new Date().toISOString() });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
