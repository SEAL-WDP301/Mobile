import type { MentorChatMessage, TeamChatMessage } from "@/types/api";
import { apiRequest } from "./client";

export async function getTeamMessages(teamId: number, cursor?: number) {
  const query = cursor ? `?cursor=${cursor}` : "";
  return apiRequest<TeamChatMessage[]>(`/chat/teams/${teamId}/messages${query}`);
}

export async function getMentorMessages(
  teamId: number,
  mentorId: number,
  cursor?: number,
) {
  const query = cursor ? `?cursor=${cursor}` : "";
  return apiRequest<MentorChatMessage[]>(
    `/chat/teams/${teamId}/mentor/${mentorId}/messages${query}`,
  );
}
