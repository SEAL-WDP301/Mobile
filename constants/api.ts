import { Platform } from "react-native";

const DEV_HOST = Platform.select({
  android: "10.0.2.2",
  default: "localhost",
});

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${DEV_HOST}:3000/api`;

export const TOKEN_STORAGE_KEY = "seal_access_token";
