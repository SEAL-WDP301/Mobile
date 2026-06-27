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
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && auth) {
      await clearAccessToken();
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
