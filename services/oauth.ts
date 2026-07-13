import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { API_BASE_URL } from "@/constants/api";

WebBrowser.maybeCompleteAuthSession();

export function getOAuthRedirectUri(): string {
  return Linking.createURL("auth/callback");
}

export function extractAccessTokenFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("token");
  } catch {
    const match = url.match(/[?&]token=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
}

export async function startGithubOAuth(): Promise<string> {
  const redirectUri = getOAuthRedirectUri();
  const authUrl = `${API_BASE_URL}/auth/github?redirect_uri=${encodeURIComponent(redirectUri)}`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type === "cancel" || result.type === "dismiss") {
    throw new Error("Đăng nhập GitHub đã bị hủy.");
  }

  if (result.type !== "success") {
    throw new Error("Đăng nhập GitHub thất bại.");
  }

  const token = extractAccessTokenFromUrl(result.url);
  if (!token) {
    throw new Error("Không nhận được access token từ GitHub.");
  }

  return token;
}
