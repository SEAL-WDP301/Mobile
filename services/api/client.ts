import { API_BASE_URL } from "@/constants/api";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "./tokenStorage";

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.statusCode === 401;
}

let onUnauthorized: (() => void) | null = null;
let handlingUnauthorized = false;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

async function handleUnauthorized() {
  if (handlingUnauthorized) return;
  handlingUnauthorized = true;
  try {
    await clearAuthTokens();
    onUnauthorized?.();
  } finally {
    handlingUnauthorized = false;
  }
}

export async function notifyUnauthorized() {
  await handleUnauthorized();
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return null;

    const json = await response.json().catch(() => null);
    const data =
      json && typeof json === "object" && "data" in json
        ? (json as ApiSuccessResponse<RefreshResponse>).data
        : (json as RefreshResponse | null);

    if (!data?.accessToken || !data.refreshToken) return null;
    await setAuthTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  })();

  try {
    return await refreshPromise;
  } catch {
    return null;
  } finally {
    refreshPromise = null;
  }
}

export async function renewAccessToken(): Promise<string | null> {
  return refreshAccessToken();
}

function formatErrorMessage(payload: ApiErrorResponse): string {
  if (Array.isArray(payload.message)) {
    return payload.message.join(", ");
  }
  return payload.message || "Request failed";
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, auth = true, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = await getAccessToken();
    if (!token) {
      await handleUnauthorized();
      throw new ApiError("Unauthorized", 401);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && auth) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      headers.Authorization = `Bearer ${newAccessToken}`;
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    }
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && auth) {
      await handleUnauthorized();
    }
    const message =
      json && typeof json === "object" && "message" in json
        ? formatErrorMessage(json as ApiErrorResponse)
        : `HTTP ${response.status}`;
    throw new ApiError(message, response.status);
  }

  if (json && typeof json === "object" && "data" in json) {
    return (json as ApiSuccessResponse<T>).data;
  }

  return json as T;
}
