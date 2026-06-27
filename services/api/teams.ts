import type {
  MentorFeedback,
  MyEventEntry,
  RegistrationStatus,
  TeamInvitation,
  WorkspaceOverview,
} from "@/types/api";
import { apiRequest } from "./client";

export async function getMyEvents() {
  return apiRequest<MyEventEntry[]>("/student/teams/my-events");
}

export async function getRegistrationStatus(eventId: number) {
  return apiRequest<RegistrationStatus>(
    `/student/teams/status/${eventId}`,
  );
}

export async function getWorkspaceOverview(eventId: number) {
  return apiRequest<WorkspaceOverview>(
    `/student/teams/my-team/workspace?eventId=${eventId}`,
  );
}

export async function getMentorFeedback(eventId: number) {
  return apiRequest<MentorFeedback[]>(
    `/student/teams/my-team/feedback?eventId=${eventId}`,
  );
}

export async function getPendingInvitations() {
  return apiRequest<TeamInvitation[]>("/student/teams/invitations/pending");
}

export async function acceptInvitation(teamId: number) {
  return apiRequest<unknown>(`/student/teams/invitations/${teamId}/accept`, {
    method: "POST",
  });
}

export async function rejectInvitation(teamId: number) {
  return apiRequest<unknown>(`/student/teams/invitations/${teamId}/reject`, {
    method: "POST",
  });
}
