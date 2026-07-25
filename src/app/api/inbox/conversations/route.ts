import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("user_id") || "1784140982345678";

  try {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("last_message_at", { ascending: false });

    if (error || !data || data.length === 0) {
      // Fallback mock conversations for development preview & testing
      return NextResponse.json({
        conversations: [
          {
            id: `${userId}:follower_user_987654`,
            user_id: userId,
            follower_id: "follower_user_987654",
            follower_username: "follower_user_987654",
            last_message: "Automated Reply: Hello! 👋 Thanks for reaching out to DMflow. How can we help automate your Instagram growth today?",
            last_message_at: new Date().toISOString(),
          },
          {
            id: `${userId}:follower_user_112233`,
            user_id: userId,
            follower_id: "follower_user_112233",
            follower_username: "alex_creator",
            last_message: "Hey! 🚀 Here is the instant access link: https://example.com/checkout",
            last_message_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: `${userId}:follower_user_445566`,
            user_id: userId,
            follower_id: "follower_user_445566",
            follower_username: "sarah_influencer",
            last_message: "Thanks for featuring us in your Story @sarah_influencer! 🎁",
            last_message_at: new Date(Date.now() - 7200000).toISOString(),
          },
        ],
      });
    }

    return NextResponse.json({ conversations: data });
  } catch {
    return NextResponse.json({ conversations: [] });
  }
}
