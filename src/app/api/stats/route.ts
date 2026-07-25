import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("user_id") || "1784140982345678";

  const defaultStats = {
    dms_sent: 2200,
    dms_limit: 500,
    bonus_dms: 0,
    ig_accounts: 1,
    ig_accounts_limit: 1,
    active_automations: 10,
    active_threads: 4,
  };

  if (!isSupabaseConfigured()) {
    return NextResponse.json(defaultStats);
  }

  try {
    const supabaseAdmin = createAdminClient();

    const { count: dmsCount } = await supabaseAdmin
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("direction", "outgoing");

    const { count: automationsCount } = await supabaseAdmin
      .from("automations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true);

    const { count: activeThreadsCount } = await supabaseAdmin
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    return NextResponse.json({
      dms_sent: dmsCount || 2200,
      dms_limit: 500,
      bonus_dms: 0,
      ig_accounts: 1,
      ig_accounts_limit: 1,
      active_automations: automationsCount || 10,
      active_threads: activeThreadsCount || 4,
    });
  } catch {
    return NextResponse.json(defaultStats);
  }
}
