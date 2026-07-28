import type { TeamChatMessage } from "@/types/api";
import { apiRequest } from "./client";

export async function getChatMessages(teamId: number, cursor?: number) {
  const query = cursor ? `?cursor=${cursor}` : "";
  return apiRequest<TeamChatMessage[]>(`/chat/teams/${teamId}/messages${query}`);
}
