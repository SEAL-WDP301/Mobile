import { API_BASE_URL } from "@/constants/api";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";
import { clearAccessToken, getAccessToken } from "./tokenStorage";

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

<<<<<<< HEAD
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
    await clearAccessToken();
    onUnauthorized?.();
  } finally {
    handlingUnauthorized = false;
  }
}

export async function notifyUnauthorized() {
  await handleUnauthorized();
}

=======
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

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
<<<<<<< HEAD
    if (!token) {
      await handleUnauthorized();
      throw new ApiError("Unauthorized", 401);
    }
    headers.Authorization = `Bearer ${token}`;
=======
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && auth) {
<<<<<<< HEAD
      await handleUnauthorized();
=======
      await clearAccessToken();
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
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
