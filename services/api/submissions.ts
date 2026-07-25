import { API_BASE_URL } from "@/constants/api";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  FeedbackStatus,
  MentorFeedback,
  Submission,
} from "@/types/api";
import { getAccessToken } from "./tokenStorage";
import {
  apiRequest,
  ApiError,
  notifyUnauthorized,
  renewAccessToken,
} from "./client";

export interface SubmitProjectPayload {
  eventId: number;
  roundId: number;
  githubUrl?: string;
  description?: string;
  file?: { uri: string; name: string; type: string };
}

export async function updateFeedbackStatus(
  feedbackId: number,
  status: FeedbackStatus,
) {
  return apiRequest<MentorFeedback>(
    `/student/teams/my-team/feedbacks/${feedbackId}/status`,
    { method: "PATCH", body: { status } },
  );
}

export async function submitProject(payload: SubmitProjectPayload): Promise<Submission> {
  const form = new FormData();
  form.append("eventId", String(payload.eventId));
  form.append("roundId", String(payload.roundId));
  if (payload.githubUrl) form.append("githubUrl", payload.githubUrl);
  if (payload.description) form.append("description", payload.description);
  if (payload.file) {
    form.append("file", {
      uri: payload.file.uri,
      name: payload.file.name,
      type: payload.file.type,
    } as unknown as Blob);
  }

  let token = await getAccessToken();
  if (!token) {
    await notifyUnauthorized();
    throw new ApiError("Unauthorized", 401);
  }
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const requestUrl = `${API_BASE_URL}/student/teams/my-team/submissions`;
  let response = await fetch(requestUrl, {
    method: "POST",
    headers,
    body: form,
  });

  if (response.status === 401) {
    token = await renewAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      response = await fetch(requestUrl, {
        method: "POST",
        headers,
        body: form,
      });
    }
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) await notifyUnauthorized();
    const message =
      json && typeof json === "object" && "message" in json
        ? (() => {
            const apiMessage = (json as ApiErrorResponse).message;
            return Array.isArray(apiMessage)
              ? apiMessage.join(", ")
              : String(apiMessage);
          })()
        : `HTTP ${response.status}`;
    throw new ApiError(message, response.status);
  }

  if (json && typeof json === "object" && "data" in json) {
    return (json as ApiSuccessResponse<Submission>).data;
  }
  return json as Submission;
}
