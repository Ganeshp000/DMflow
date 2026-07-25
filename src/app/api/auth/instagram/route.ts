import { NextResponse } from "next/server";
import { getInstagramAuthUrl } from "@/lib/instagram";

export async function GET() {
  const authUrl = getInstagramAuthUrl();
  return NextResponse.redirect(authUrl);
}
