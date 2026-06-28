import { useCallback, useEffect, useRef, useState } from "react";
import type { MentorChatMessage } from "@/types/api";
import { getMentorMessages } from "@/services/api/chat";
import {
  joinMentorRoom,
  leaveMentorRoom,
  markMentorMessagesRead,
  sendMentorMessage,
  getChatSocket,
} from "@/services/chatSocket";

interface UseMentorChatOptions {
  teamId: number | null;
  mentorId: number | null;
  enabled?: boolean;
}

function mergeMessages(existing: MentorChatMessage[], incoming: MentorChatMessage[]) {
  const map = new Map<number, MentorChatMessage>();
  for (const msg of existing) map.set(msg.id, msg);
  for (const msg of incoming) map.set(msg.id, msg);
  return Array.from(map.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export function useMentorChat({
  teamId,
  mentorId,
  enabled = true,
}: UseMentorChatOptions) {
  const [messages, setMessages] = useState<MentorChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const oldestCursorRef = useRef<number | null>(null);

  const loadInitial = useCallback(async () => {
    if (!teamId || !mentorId || !enabled) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMentorMessages(teamId, mentorId);
      setMessages(data);
      setHasMore(data.length >= 20);
      oldestCursorRef.current = data[0]?.id ?? null;
      await joinMentorRoom(teamId, mentorId);
      await markMentorMessagesRead(teamId, mentorId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được tin nhắn");
    } finally {
      setLoading(false);
    }
  }, [teamId, mentorId, enabled]);

  const loadMore = useCallback(async () => {
    if (
      !teamId ||
      !mentorId ||
      !enabled ||
      loadingMore ||
      !hasMore ||
      !oldestCursorRef.current
    ) {
      return;
    }
    setLoadingMore(true);
    try {
      const data = await getMentorMessages(teamId, mentorId, oldestCursorRef.current);
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
  }, [teamId, mentorId, enabled, loadingMore, hasMore]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!teamId || !mentorId || !content.trim()) return;
      setSending(true);
      setError(null);
      try {
        await sendMentorMessage(teamId, mentorId, content.trim());
        await markMentorMessagesRead(teamId, mentorId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không gửi được tin nhắn");
        throw e;
      } finally {
        setSending(false);
      }
    },
    [teamId, mentorId],
  );

  useEffect(() => {
    if (!teamId || !mentorId || !enabled) {
      setMessages([]);
      return;
    }

    loadInitial();

    let active = true;
    let cleanupListeners: (() => void) | undefined;

    getChatSocket()
      .then((client) => {
        if (!active || !teamId || !mentorId) return;

        const matchesRoom = (message: MentorChatMessage) =>
          message.teamId === teamId && message.mentorId === mentorId;

        const onReceive = (message: MentorChatMessage) => {
          if (!matchesRoom(message)) return;
          setMessages((prev) => mergeMessages(prev, [message]));
          markMentorMessagesRead(teamId, mentorId).catch(() => undefined);
        };

        const onEdited = (message: MentorChatMessage) => {
          if (!matchesRoom(message)) return;
          setMessages((prev) => mergeMessages(prev, [message]));
        };

        const onDeleted = (message: MentorChatMessage) => {
          if (!matchesRoom(message)) return;
          setMessages((prev) => mergeMessages(prev, [message]));
        };

        const onReadUpdated = (updated: MentorChatMessage[]) => {
          setMessages((prev) => mergeMessages(prev, updated));
        };

        client.on("receive_mentor_message", onReceive);
        client.on("mentor_message_edited", onEdited);
        client.on("mentor_message_deleted", onDeleted);
        client.on("mentor_messages_read_updated", onReadUpdated);

        cleanupListeners = () => {
          client.off("receive_mentor_message", onReceive);
          client.off("mentor_message_edited", onEdited);
          client.off("mentor_message_deleted", onDeleted);
          client.off("mentor_messages_read_updated", onReadUpdated);
        };
      })
      .catch(() => undefined);

    return () => {
      active = false;
      cleanupListeners?.();
      if (teamId && mentorId) {
        leaveMentorRoom(teamId, mentorId).catch(() => undefined);
      }
    };
  }, [teamId, mentorId, enabled, loadInitial]);

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
