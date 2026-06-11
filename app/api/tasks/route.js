async function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(url, key);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("store") || "almaty-mega";

  try {
    const supabase = await getSupabase();
    if (!supabase) return Response.json(null);

    const { data, error } = await supabase
      .from("store_state")
      .select("state")
      .eq("id", storeId)
      .single();

    if (error || !data) return Response.json(null);
    return Response.json(data.state);
  } catch (e) {
    return Response.json(null);
  }
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("store") || "almaty-mega";

  try {
    const body = await request.json();
    const supabase = await getSupabase();
    if (!supabase) return Response.json({ ok: true });

    const { error } = await supabase
      .from("store_state")
      .upsert({ id: storeId, state: body.state, updated_at: new Date().toISOString() });

    if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}