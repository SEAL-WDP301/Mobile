import type {
  MentorFeedback,
  MyEventEntry,
<<<<<<< HEAD
  RegisterIndividualPayload,
  RegisterTeamPayload,
  RegisteredTeam,
  RegistrationStatus,
  StudentRegistration,
=======
  RegistrationStatus,
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
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

<<<<<<< HEAD
export async function registerIndividual(eventId: number, data: RegisterIndividualPayload) {
  return apiRequest<StudentRegistration>(
    `/student/teams/register/individual/${eventId}`,
    { method: "POST", body: data },
  );
}

export async function registerTeam(eventId: number, data: RegisterTeamPayload) {
  return apiRequest<RegisteredTeam>(
    `/student/teams/register/team/${eventId}`,
    { method: "POST", body: data },
  );
}

=======
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
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
