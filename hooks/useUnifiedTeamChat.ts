import { useCallback, useEffect, useMemo, useState } from "react";
import type { MentorChatMessage, TeamChatMessage } from "@/types/api";
import { getMentorMessages, getTeamMessages } from "@/services/api/chat";
import {
  getChatSocket,
  joinMentorRoom,
  joinTeamRoom,
  leaveMentorRoom,
  leaveTeamRoom,
  markMentorMessagesRead,
  markTeamMessagesRead,
  sendMentorMessage,
  sendTeamMessage,
} from "@/services/chatSocket";

export type UnifiedChatMessage =
  | (TeamChatMessage & { channel: "team" })
  | (MentorChatMessage & { channel: "mentor" });

interface UseUnifiedTeamChatOptions {
  teamId: number | null;
  mentorId?: number | null;
  enabled?: boolean;
}

function toUnified(messages: TeamChatMessage[]): UnifiedChatMessage[];
function toUnified(messages: MentorChatMessage[], channel: "mentor"): UnifiedChatMessage[];
function toUnified(
  messages: TeamChatMessage[] | MentorChatMessage[],
  channel: "team" | "mentor" = "team",
): UnifiedChatMessage[] {
  return messages.map((message) =>
    channel === "mentor"
      ? { ...(message as MentorChatMessage), channel: "mentor" as const }
      : { ...(message as TeamChatMessage), channel: "team" as const },
  );
}

function mergeMessages(
  existing: UnifiedChatMessage[],
  incoming: UnifiedChatMessage[],
): UnifiedChatMessage[] {
  const map = new Map<string, UnifiedChatMessage>();
  for (const msg of existing) {
    map.set(`${msg.channel}-${msg.id}`, msg);
  }
  for (const msg of incoming) {
    map.set(`${msg.channel}-${msg.id}`, msg);
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export function useUnifiedTeamChat({
  teamId,
  mentorId = null,
  enabled = true,
}: UseUnifiedTeamChatOptions) {
  const [messages, setMessages] = useState<UnifiedChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMentor = !!mentorId;

  const loadInitial = useCallback(async () => {
    if (!teamId || !enabled) return;
    setLoading(true);
    setError(null);
    try {
      const [teamMessages, mentorMessages] = await Promise.all([
        getTeamMessages(teamId),
        hasMentor ? getMentorMessages(teamId, mentorId!) : Promise.resolve([]),
      ]);

      setMessages(mergeMessages(toUnified(teamMessages), toUnified(mentorMessages, "mentor")));

      await joinTeamRoom(teamId);
      await markTeamMessagesRead(teamId);

      if (hasMentor) {
        await joinMentorRoom(teamId, mentorId!);
        await markMentorMessagesRead(teamId, mentorId!);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được tin nhắn");
    } finally {
      setLoading(false);
    }
  }, [teamId, mentorId, hasMentor, enabled]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!teamId || !content.trim()) return;
      setSending(true);
      setError(null);
      try {
        if (hasMentor) {
          await sendMentorMessage(teamId, mentorId!, content.trim());
          await markMentorMessagesRead(teamId, mentorId!);
        } else {
          await sendTeamMessage(teamId, content.trim());
          await markTeamMessagesRead(teamId);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không gửi được tin nhắn");
        throw e;
      } finally {
        setSending(false);
      }
    },
    [teamId, mentorId, hasMentor],
  );

  useEffect(() => {
    if (!teamId || !enabled) {
      setMessages([]);
      return;
    }

    loadInitial();

    let active = true;
    let cleanupListeners: (() => void) | undefined;

    getChatSocket()
      .then((client) => {
        if (!active || !teamId) return;

        const onTeamReceive = (message: TeamChatMessage) => {
          if (message.teamId !== teamId) return;
          setMessages((prev) => mergeMessages(prev, toUnified([message])));
          markTeamMessagesRead(teamId).catch(() => undefined);
        };

        const onTeamEdited = (message: TeamChatMessage) => {
          if (message.teamId !== teamId) return;
          setMessages((prev) => mergeMessages(prev, toUnified([message])));
        };

        const onTeamDeleted = (message: TeamChatMessage) => {
          if (message.teamId !== teamId) return;
          setMessages((prev) => mergeMessages(prev, toUnified([message])));
        };

        const onTeamReadUpdated = (updated: TeamChatMessage[]) => {
          setMessages((prev) => mergeMessages(prev, toUnified(updated)));
        };

        const onMentorReceive = (message: MentorChatMessage) => {
          if (message.teamId !== teamId || message.mentorId !== mentorId) return;
          setMessages((prev) => mergeMessages(prev, toUnified([message], "mentor")));
          if (mentorId) {
            markMentorMessagesRead(teamId, mentorId).catch(() => undefined);
          }
        };

        const onMentorEdited = (message: MentorChatMessage) => {
          if (message.teamId !== teamId || message.mentorId !== mentorId) return;
          setMessages((prev) => mergeMessages(prev, toUnified([message], "mentor")));
        };

        const onMentorDeleted = (message: MentorChatMessage) => {
          if (message.teamId !== teamId || message.mentorId !== mentorId) return;
          setMessages((prev) => mergeMessages(prev, toUnified([message], "mentor")));
        };

        const onMentorReadUpdated = (updated: MentorChatMessage[]) => {
          setMessages((prev) => mergeMessages(prev, toUnified(updated, "mentor")));
        };

        client.on("receive_chat_message", onTeamReceive);
        client.on("chat_message_edited", onTeamEdited);
        client.on("chat_message_deleted", onTeamDeleted);
        client.on("messages_read_updated", onTeamReadUpdated);
        client.on("receive_mentor_message", onMentorReceive);
        client.on("mentor_message_edited", onMentorEdited);
        client.on("mentor_message_deleted", onMentorDeleted);
        client.on("mentor_messages_read_updated", onMentorReadUpdated);

        cleanupListeners = () => {
          client.off("receive_chat_message", onTeamReceive);
          client.off("chat_message_edited", onTeamEdited);
          client.off("chat_message_deleted", onTeamDeleted);
          client.off("messages_read_updated", onTeamReadUpdated);
          client.off("receive_mentor_message", onMentorReceive);
          client.off("mentor_message_edited", onMentorEdited);
          client.off("mentor_message_deleted", onMentorDeleted);
          client.off("mentor_messages_read_updated", onMentorReadUpdated);
        };
      })
      .catch(() => undefined);

    return () => {
      active = false;
      cleanupListeners?.();
      if (teamId) {
        leaveTeamRoom(teamId).catch(() => undefined);
        if (mentorId) {
          leaveMentorRoom(teamId, mentorId).catch(() => undefined);
        }
      }
    };
  }, [teamId, mentorId, enabled, loadInitial]);

  const subtitle = useMemo(
    () =>
      hasMentor
        ? "Kênh chat chung của đội và mentor được phân công."
        : "Kênh chat của các thành viên trong đội.",
    [hasMentor],
  );

  return {
    messages,
    loading,
    sending,
    error,
    subtitle,
    refresh: loadInitial,
    sendMessage,
  };
}
