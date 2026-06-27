import type { AuthUser, SignInResponse } from "@/types/api";
import { apiRequest } from "./client";
import { clearAccessToken, setAccessToken } from "./tokenStorage";

export async function signIn(email: string, password: string) {
  const data = await apiRequest<SignInResponse>("/auth/signin", {
    method: "POST",
    auth: false,
    body: { email, password },
  });
  await setAccessToken(data.accessToken);
  return data;
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
    await clearAccessToken();
  }
}

export async function completeOAuthLogin(accessToken: string) {
  await setAccessToken(accessToken);
  const { getProfile } = await import("./users");
  const user = await getProfile();
  return user;
}

export async function restoreSession(): Promise<AuthUser | null> {
  const { getAccessToken } = await import("./tokenStorage");
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const { getProfile } = await import("./users");
    return await getProfile();
  } catch {
    await clearAccessToken();
    return null;
  }
}
