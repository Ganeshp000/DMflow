// Instagram API with Instagram Login (Business Login) Helpers

export const INSTAGRAM_SCOPES = [
  "instagram_business_basic",
  "instagram_business_manage_messages",
  "instagram_business_manage_comments",
].join(",");

export interface InstagramTokenResponse {
  access_token: string;
  user_id?: string | number;
  error_type?: string;
  code?: number;
  error_message?: string;
}

export interface InstagramLongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number; // in seconds (~60 days)
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

export interface InstagramUserProfile {
  user_id: string;
  username: string;
  profile_picture_url?: string;
  id?: string;
}

export interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
}

/**
 * Builds the Instagram Business OAuth Authorization URL
 */
export function getInstagramAuthUrl(state?: string): string {
  const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID || process.env.INSTAGRAM_APP_ID || "";
  const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: INSTAGRAM_SCOPES,
    response_type: "code",
  });

  if (state) {
    params.append("state", state);
  }

  return `https://www.instagram.com/oauth/authorize?${params.toString()}`;
}

/**
 * Step 1: Exchange authorization code for short-lived access token
 */
export async function exchangeCodeForShortLivedToken(code: string): Promise<InstagramTokenResponse> {
  const appId = process.env.INSTAGRAM_APP_ID || process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID || "";
  const appSecret = process.env.INSTAGRAM_APP_SECRET || "";
  const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

  const formData = new URLSearchParams();
  formData.append("client_id", appId);
  formData.append("client_secret", appSecret);
  formData.append("grant_type", "authorization_code");
  formData.append("redirect_uri", redirectUri);
  formData.append("code", code);

  const response = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_message || data.error?.message || "Failed to exchange short-lived token");
  }

  return data;
}

/**
 * Step 2: Exchange short-lived token for long-lived 60-day token
 */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<InstagramLongLivedTokenResponse> {
  const appSecret = process.env.INSTAGRAM_APP_SECRET || "";

  const params = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: appSecret,
    access_token: shortLivedToken,
  });

  const response = await fetch(`https://graph.instagram.com/access_token?${params.toString()}`, {
    method: "GET",
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error?.message || "Failed to exchange long-lived token");
  }

  return data;
}

/**
 * Step 3: Fetch Instagram Professional Account Details
 */
export async function getInstagramUserProfile(accessToken: string): Promise<InstagramUserProfile> {
  const params = new URLSearchParams({
    fields: "user_id,username,profile_picture_url",
    access_token: accessToken,
  });

  const response = await fetch(`https://graph.instagram.com/v24.0/me?${params.toString()}`, {
    method: "GET",
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error?.message || "Failed to fetch Instagram user profile");
  }

  return {
    user_id: data.user_id || data.id,
    username: data.username,
    profile_picture_url: data.profile_picture_url,
  };
}

/**
 * Fetch recent Instagram posts & Reels for media selector
 */
export async function fetchUserInstagramMedia(accessToken: string): Promise<InstagramMediaItem[]> {
  const url = `https://graph.instagram.com/v24.0/me/media?fields=id,caption,media_type,thumbnail_url,permalink,timestamp&limit=20&access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok && Array.isArray(data.data)) {
      return data.data;
    }
  } catch (err) {
    console.warn("Failed to fetch user media from Graph API:", err);
  }

  // Fallback mock media items for preview / testing
  return [
    { id: "17998877665544332", caption: "🚀 Summer Automation Collection Launch (Reel)", media_type: "VIDEO", permalink: "https://instagram.com/p/demo1" },
    { id: "18022334455667788", caption: "🔥 10 Instagram DM Growth Hacks for 2026", media_type: "IMAGE", permalink: "https://instagram.com/p/demo2" },
    { id: "18033445566778899", caption: "💎 VIP Community Masterclass Signup", media_type: "CAROUSEL_ALBUM", permalink: "https://instagram.com/p/demo3" },
  ];
}

/**
 * Fetch comments for a specific Instagram post/Reel (GET /{media-id}/comments)
 */
export async function getInstagramMediaComments(mediaId: string, accessToken: string): Promise<any> {
  const url = `https://graph.instagram.com/v24.0/${mediaId}/comments?fields=id,text,from,timestamp&limit=50&access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) return data;
  } catch (err) {
    console.warn("Failed to fetch media comments from Graph API:", err);
  }

  return {
    data: [
      { id: "c_demo_101", text: "Can you send the app link please?", from: { id: "follower_user_999", username: "alex_creator" } },
      { id: "c_demo_102", text: "Commented repo for code!", from: { id: "follower_user_888", username: "sarah_influencer" } },
      { id: "c_demo_103", text: "Great post!", from: { id: "follower_user_777", username: "dev_founder" } },
    ],
  };
}

/**
 * Publicly reply to a comment (POST /{comment-id}/replies)
 */
export async function replyToInstagramComment(
  commentId: string,
  text: string,
  accessToken: string
): Promise<unknown> {
  const params = new URLSearchParams({
    message: text,
    access_token: accessToken,
  });
  const url = `https://graph.instagram.com/v24.0/${commentId}/replies?${params.toString()}`;

  console.log(`[PUBLIC COMMENT REPLY] Replying to comment ${commentId}: "${text}"`);

  try {
    const response = await fetch(url, { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      console.warn("[Instagram API Comment Reply Warning]:", data);
    }
    return data;
  } catch (err) {
    console.warn("[Instagram API Comment Reply Exception]:", err);
    return { id: `sim_reply_${Date.now()}`, simulated: true };
  }
}

/**
 * Send Instagram Sender Action (e.g. mark_seen, typing_on, typing_off)
 */
export async function sendInstagramSenderAction(
  recipientId: string,
  senderAction: "mark_seen" | "typing_on" | "typing_off",
  accessToken: string
): Promise<unknown> {
  const url = `https://graph.instagram.com/v24.0/me/messages?access_token=${encodeURIComponent(accessToken)}`;
  const payload = {
    recipient: { id: recipientId },
    sender_action: senderAction,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      console.warn(`[Instagram API Warning] Sender action '${senderAction}' response:`, data);
    }
    return data;
  } catch (err) {
    console.warn(`[Instagram API Exception] Failed to send '${senderAction}':`, err);
    return { recipient_id: recipientId, sender_action: senderAction, simulated: true };
  }
}

/**
 * Send Automated Reply DM via Instagram Graph API (POST /me/messages)
 */
export async function sendInstagramMessage(
  recipientId: string,
  text: string,
  accessToken: string
): Promise<unknown> {
  const url = `https://graph.instagram.com/v24.0/me/messages?access_token=${encodeURIComponent(accessToken)}`;
  const payload = {
    recipient: { id: recipientId },
    message: { text: text },
  };

  console.log(`[OUTBOUND DM] Sending message to ${recipientId}: "${text}"`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      console.warn("[Instagram API Outbound Message Warning]:", data);
    }
    return data;
  } catch (err) {
    console.warn("[Instagram API Outbound Message Exception]:", err);
    return { recipient_id: recipientId, message_id: `sim_mid_${Date.now()}`, simulated: true };
  }
}
