import { Platform } from "react-native";
import Constants from "expo-constants";

/** IP/host của Metro bundler — dùng chung cho API khi chạy trên máy thật. */
function getMetroHost(): string | null {
  const raw =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.debuggerHost;
  if (!raw) return null;

  const host = raw.split(":")[0];
  if (!host || host === "localhost" || host === "127.0.0.1") return null;
  return host;
}

function getDefaultApiBaseUrl(): string {
  const lanHost = getMetroHost();
  if (lanHost) {
    return `http://${lanHost}:3000/api`;
  }

  const devHost = Platform.select({
    android: "10.0.2.2",
    default: "localhost",
  });
  return `http://${devHost}:3000/api`;
}

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? getDefaultApiBaseUrl();

export const TOKEN_STORAGE_KEY = "seal_access_token";
export const REFRESH_TOKEN_STORAGE_KEY = "seal_refresh_token";

/** Socket.IO server root (Nest namespace `/chat`). */
export function getSocketBaseUrl(): string {
  return API_BASE_URL.replace(/\/api\/?$/, "");
}
