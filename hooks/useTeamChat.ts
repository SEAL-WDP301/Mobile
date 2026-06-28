import { useCallback, useEffect, useRef, useState } from "react";
import type { TeamChatMessage } from "@/types/api";
import { getTeamMessages } from "@/services/api/chat";
import {
  joinTeamRoom,
  leaveTeamRoom,
  markTeamMessagesRead,
  sendTeamMessage,
  getChatSocket,
} from "@/services/chatSocket";

interface UseTeamChatOptions {
  teamId: number | null;
  enabled?: boolean;
}

function mergeMessages(existing: TeamChatMessage[], incoming: TeamChatMessage[]) {
  const map = new Map<number, TeamChatMessage>();
  for (const msg of existing) map.set(msg.id, msg);
  for (const msg of incoming) map.set(msg.id, msg);
  return Array.from(map.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export function useTeamChat({ teamId, enabled = true }: UseTeamChatOptions) {
  const [messages, setMessages] = useState<TeamChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const oldestCursorRef = useRef<number | null>(null);

  const loadInitial = useCallback(async () => {
    if (!teamId || !enabled) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTeamMessages(teamId);
      setMessages(data);
      setHasMore(data.length >= 20);
      oldestCursorRef.current = data[0]?.id ?? null;
      await joinTeamRoom(teamId);
      await markTeamMessagesRead(teamId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được tin nhắn");
    } finally {
      setLoading(false);
    }
  }, [teamId, enabled]);

  const loadMore = useCallback(async () => {
    if (!teamId || !enabled || loadingMore || !hasMore || !oldestCursorRef.current) return;
    setLoadingMore(true);
    try {
      const data = await getTeamMessages(teamId, oldestCursorRef.current);
      if (data.length === 0) {
        setHasMore(false);
        return;
      }
      setMessages((prev) => mergeMessages(data, prev));
      setHasMore(data.length >= 20);
      oldestCursorRef.current = data[0]?.id ?? oldestCursorRef.current;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải thêm tin nhắn");
    } finally {
      setLoadingMore(false);
    }
  }, [teamId, enabled, loadingMore, hasMore]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!teamId || !content.trim()) return;
      setSending(true);
      setError(null);
      try {
        await sendTeamMessage(teamId, content.trim());
        await markTeamMessagesRead(teamId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không gửi được tin nhắn");
        throw e;
      } finally {
        setSending(false);
      }
    },
    [teamId],
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

        const onReceive = (message: TeamChatMessage) => {
          if (message.teamId !== teamId) return;
          setMessages((prev) => mergeMessages(prev, [message]));
          markTeamMessagesRead(teamId).catch(() => undefined);
        };

        const onEdited = (message: TeamChatMessage) => {
          if (message.teamId !== teamId) return;
          setMessages((prev) => mergeMessages(prev, [message]));
        };

        const onDeleted = (message: TeamChatMessage) => {
          if (message.teamId !== teamId) return;
          setMessages((prev) => mergeMessages(prev, [message]));
        };

        const onReadUpdated = (updated: TeamChatMessage[]) => {
          setMessages((prev) => mergeMessages(prev, updated));
        };

        client.on("receive_chat_message", onReceive);
        client.on("chat_message_edited", onEdited);
        client.on("chat_message_deleted", onDeleted);
        client.on("messages_read_updated", onReadUpdated);

        cleanupListeners = () => {
          client.off("receive_chat_message", onReceive);
          client.off("chat_message_edited", onEdited);
          client.off("chat_message_deleted", onDeleted);
          client.off("messages_read_updated", onReadUpdated);
        };
      })
      .catch(() => undefined);

    return () => {
      active = false;
      cleanupListeners?.();
      if (teamId) {
        leaveTeamRoom(teamId).catch(() => undefined);
      }
    };
  }, [teamId, enabled, loadInitial]);

  return {
    messages,
    loading,
    loadingMore,
    sending,
    error,
    hasMore,
    loadMore,
    refresh: loadInitial,
    sendMessage,
  };
}
