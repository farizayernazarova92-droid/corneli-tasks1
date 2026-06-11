import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) {
    return Response.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from("store_state")
      .select("*")
      .eq("id", 1)
      .single();

    if (error && error.code !== "PGRST116") {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data?.state || null);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!supabase) {
    return Response.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();

    const { error } = await supabase
      .from("store_state")
      .upsert({ id: 1, state: body.state, updated_at: new Date().toISOString() });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
