import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

// In-memory fallback store when Supabase is not connected
let inMemoryAutomations = [
  {
    id: "rule_demo_1",
    name: "Comment → Instant Link DM",
    trigger_source: "comment",
    trigger_type: "keyword",
    trigger_value: "link, shop",
    response_content: { text: "Hey! 🚀 Here is the instant access link: https://dmflow.app/access" },
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "rule_demo_2",
    name: "Lead Magnet PDF Delivery",
    trigger_source: "comment",
    trigger_type: "keyword",
    trigger_value: "guide, pdf",
    response_content: { text: "Thanks for checking out our guide! 🎁 Tap below to download:" },
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("user_id") || "1784140982345678";

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ automations: inMemoryAutomations });
  }

  try {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from("automations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ automations: inMemoryAutomations });
    }

    return NextResponse.json({ automations: data });
  } catch {
    return NextResponse.json({ automations: inMemoryAutomations });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      trigger_source = "comment",
      trigger_type = "keyword",
      trigger_value = "link",
      response_text,
      public_response_text,
      reply_mode = "both",
      specific_media_id,
      is_ai_enabled = false,
      enable_opening_dm = true,
      enable_follow_gate = false,
      enable_email_capture = false,
      button_text,
      button_url,
      fallback_response_text,
      is_active = true,
      user_id,
    } = body;

    const userId = user_id || "1784140982345678";
    const ruleData = {
      user_id: userId,
      name: name || "New Automation",
      trigger_source,
      trigger_type,
      trigger_value: Array.isArray(trigger_value) ? trigger_value.join(", ") : trigger_value,
      response_content: { text: response_text || "Thanks for your comment!" },
      public_response_content: public_response_text ? { text: public_response_text } : null,
      reply_mode,
      specific_media_id: specific_media_id || null,
      is_ai_enabled: !!is_ai_enabled,
      enable_opening_dm: !!enable_opening_dm,
      enable_follow_gate: !!enable_follow_gate,
      enable_email_capture: !!enable_email_capture,
      button_text: button_text || null,
      button_url: button_url || null,
      fallback_response_text: fallback_response_text || null,
      is_active: !!is_active,
      updated_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured()) {
      if (id) {
        const idx = inMemoryAutomations.findIndex((a) => a.id === id);
        if (idx !== -1) {
          inMemoryAutomations[idx] = { ...inMemoryAutomations[idx], ...ruleData };
          return NextResponse.json({ success: true, automation: inMemoryAutomations[idx] });
        }
      }
      const newRule = { id: id || `rule_${Date.now()}`, ...ruleData, created_at: new Date().toISOString() };
      inMemoryAutomations.unshift(newRule);
      return NextResponse.json({ success: true, automation: newRule });
    }

    const supabaseAdmin = createAdminClient();
    let resultData = null;

    if (id && !id.startsWith("rule_demo")) {
      const { data, error } = await supabaseAdmin
        .from("automations")
        .update(ruleData)
        .eq("id", id)
        .select()
        .single();
      if (!error) resultData = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from("automations")
        .insert(ruleData)
        .select()
        .single();
      if (!error) resultData = data;
    }

    return NextResponse.json({
      success: true,
      automation: resultData || { id: id || `rule_${Date.now()}`, ...ruleData },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save automation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  inMemoryAutomations = inMemoryAutomations.filter((a) => a.id !== id);

  if (isSupabaseConfigured()) {
    try {
      const supabaseAdmin = createAdminClient();
      await supabaseAdmin.from("automations").delete().eq("id", id);
    } catch { /* fallback */ }
  }

  return NextResponse.json({ success: true });
}
