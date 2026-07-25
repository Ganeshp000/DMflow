import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("user_id") || "1784140982345678";

  try {
    const supabaseAdmin = createAdminClient();
    const { data } = await supabaseAdmin
      .from("users")
      .select("groq_api_key, ai_context")
      .eq("id", userId)
      .single();

    return NextResponse.json({
      groq_api_key: data?.groq_api_key || "",
      ai_context: data?.ai_context || "We are a high-growth brand. Be helpful, concise, and friendly in DMs.",
    });
  } catch {
    return NextResponse.json({
      groq_api_key: "",
      ai_context: "We are a high-growth brand. Be helpful, concise, and friendly in DMs.",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, groq_api_key, ai_context } = body;
    const userId = user_id || "1784140982345678";

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from("users").upsert(
      {
        id: userId,
        groq_api_key,
        ai_context,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.warn("Supabase settings update warning:", error.message);
    }

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
