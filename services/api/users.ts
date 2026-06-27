import type { AppNotification, AuthUser, StudentProfile } from "@/types/api";
import { apiRequest } from "./client";

export interface UpsertStudentProfilePayload {
  studentType: "fpt" | "external";
  studentCode: string;
  universityName?: string;
  phone?: string;
}

export async function getProfile() {
  return apiRequest<AuthUser>("/users/profile");
}

export async function updateStudentProfile(data: UpsertStudentProfilePayload) {
  return apiRequest<StudentProfile>("/users/profile/student", {
    method: "PUT",
    body: data,
  });
}

export async function getNotifications() {
  return apiRequest<AppNotification[]>("/users/notifications");
}

export async function markNotificationRead(id: number) {
  return apiRequest<null>(`/users/notifications/${id}/read`, {
    method: "PATCH",
  });
}

export async function markAllNotificationsRead() {
  return apiRequest<null>("/users/notifications/read-all", {
    method: "PATCH",
  });
}

export async function deleteNotification(id: number) {
  return apiRequest<null>(`/users/notifications/${id}`, {
    method: "DELETE",
  });
}
