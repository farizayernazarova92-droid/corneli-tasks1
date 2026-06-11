const DEFAULT_STATE = {
  staff: [
    { id: 1, name: "Сотрудник 1", zone: "right",   revenue: 0, receipts: 0, units: 0, calls: 0, task: "" },
    { id: 2, name: "Сотрудник 2", zone: "left",    revenue: 0, receipts: 0, units: 0, calls: 0, task: "" },
    { id: 3, name: "Сотрудник 3", zone: "center",  revenue: 0, receipts: 0, units: 0, calls: 0, task: "" },
    { id: 4, name: "Сотрудник 4", zone: "fitting", revenue: 0, receipts: 0, units: 0, calls: 0, task: "" },
  ],
  generalTask: "",
  activeDay: "Понедельник",
};

async function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(url, key);
}

export async function GET() {
  try {
    const supabase = await getSupabase();
    if (!supabase) {
      return Response.json(DEFAULT_STATE);
    }
    const { data, error } = await supabase
      .from("store_state")
      .select("state")
      .eq("id", 1)
      .single();

    if (error || !data) {
      return Response.json(DEFAULT_STATE);
    }
    return Response.json(data.state || DEFAULT_STATE);
  } catch (e) {
    console.error("GET error:", e.message);
    return Response.json(DEFAULT_STATE);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const supabase = await getSupabase();
    if (!supabase) {
      return Response.json({ ok: true, warning: "Supabase not configured" });
    }
    const { error } = await supabase
      .from("store_state")
      .upsert({ id: 1, state: body.state, updated_at: new Date().toISOString() });

    if (error) {
      console.error("POST error:", error.message);
      return Response.json({ ok: false, error: error.message }, { status: 500 });
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("POST exception:", e.message);
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
