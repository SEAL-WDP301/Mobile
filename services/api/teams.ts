import type {
  MentorFeedback,
  MyEventEntry,
  RegisterIndividualPayload,
  RegisterTeamPayload,
  RegisteredTeam,
  RegistrationStatus,
  StudentRegistration,
  TeamInvitation,
  WorkspaceOverview,
} from "@/types/api";
import { apiRequest } from "./client";

interface PendingInvitationResponse {
  teamId: number;
  team: {
    name: string;
    event: { name: string };
    leader: { name: string };
  };
}

export async function getMyEvents() {
  return apiRequest<MyEventEntry[]>("/student/teams/my-events");
}

export async function getRegistrationStatus(eventId: number) {
  return apiRequest<RegistrationStatus>(
    `/student/teams/status/${eventId}`,
  );
}

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

export async function updateTeamRegistration(
  eventId: number,
  data: RegisterTeamPayload,
) {
  return apiRequest<RegisteredTeam>(
    `/student/teams/register/team/${eventId}`,
    { method: "PUT", body: data },
  );
}

export async function transferLeadership(teamId: number, newLeaderUserId: number) {
  return apiRequest<unknown>(
    `/student/teams/${teamId}/transfer-leadership/${newLeaderUserId}`,
    { method: "POST" },
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
  const invitations = await apiRequest<PendingInvitationResponse[]>(
    "/student/teams/invitations/pending",
  );
  return invitations.map<TeamInvitation>((invitation) => ({
    teamId: invitation.teamId,
    teamName: invitation.team.name,
    eventName: invitation.team.event.name,
    leaderName: invitation.team.leader.name,
  }));
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
