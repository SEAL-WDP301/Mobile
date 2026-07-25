import type { AuthUser, SignInResponse } from "@/types/api";
import { apiRequest } from "./client";
import { clearAuthTokens, setAuthTokens } from "./tokenStorage";

export async function signIn(email: string, password: string) {
  const data = await apiRequest<SignInResponse>("/auth/signin", {
    method: "POST",
    auth: false,
    body: { email, password },
  });
  await setAuthTokens(data.accessToken, data.refreshToken);
  try {
    const { getProfile } = await import("./users");
    return { ...data, user: await getProfile() };
  } catch (error) {
    await clearAuthTokens();
    throw error;
  }
}

export async function signUp(
  email: string,
  password: string,
  fullName: string,
) {
  return apiRequest<null>("/auth/signup", {
    method: "POST",
    auth: false,
    body: { email, password, fullName },
  });
}

export async function verifyOtp(email: string, otp: string) {
  return apiRequest<null>("/auth/verify-otp", {
    method: "POST",
    auth: false,
    body: { email, otp },
  });
}

export async function forgotPassword(email: string) {
  return apiRequest<null>("/auth/forgot-password", {
    method: "POST",
    auth: false,
    body: { email },
  });
}

export async function signOut() {
  try {
    await apiRequest<null>("/auth/logout", { method: "POST" });
  } finally {
    await clearAuthTokens();
  }
}

export async function completeOAuthLogin(
  accessToken: string,
  refreshToken: string,
) {
  await setAuthTokens(accessToken, refreshToken);
  try {
    const { getProfile } = await import("./users");
    return await getProfile();
  } catch (error) {
    await clearAuthTokens();
    throw error;
  }
}

export async function restoreSession(): Promise<AuthUser | null> {
  const { getAccessToken } = await import("./tokenStorage");
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const { getProfile } = await import("./users");
    return await getProfile();
  } catch {
    await clearAuthTokens();
    return null;
  }
}
