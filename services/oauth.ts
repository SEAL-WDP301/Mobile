import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { API_BASE_URL } from "@/constants/api";

WebBrowser.maybeCompleteAuthSession();

export function getOAuthRedirectUri(): string {
  return Linking.createURL("auth/callback");
}

export function extractTokensFromUrl(
  url: string,
): { accessToken: string; refreshToken: string } | null {
  try {
    const parsed = new URL(url);
    const accessToken = parsed.searchParams.get("token");
    const refreshToken = parsed.searchParams.get("refreshToken");
    return accessToken && refreshToken ? { accessToken, refreshToken } : null;
  } catch {
    const accessMatch = url.match(/[?&]token=([^&]+)/);
    const refreshMatch = url.match(/[?&]refreshToken=([^&]+)/);
    if (!accessMatch || !refreshMatch) return null;
    return {
      accessToken: decodeURIComponent(accessMatch[1]),
      refreshToken: decodeURIComponent(refreshMatch[1]),
    };
  }
}

export async function startGithubOAuth() {
  const redirectUri = getOAuthRedirectUri();
  const authUrl = `${API_BASE_URL}/auth/github?redirect_uri=${encodeURIComponent(redirectUri)}`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type === "cancel" || result.type === "dismiss") {
    throw new Error("Đăng nhập GitHub đã bị hủy.");
  }

  if (result.type !== "success") {
    throw new Error("Đăng nhập GitHub thất bại.");
  }

  const tokens = extractTokensFromUrl(result.url);
  if (!tokens) {
    throw new Error("Không nhận được token đăng nhập từ GitHub.");
  }

  return tokens;
}
