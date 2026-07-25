import { useCallback, useEffect, useState } from "react";
import { getPublicEventById } from "@/services/api/events";
import type { PublicEvent } from "@/types/api";

export function usePublicEvent(eventId: number | null) {
  const [result, setResult] = useState<{
    eventId: number;
    data: PublicEvent;
  } | null>(null);
  const [loadingEventId, setLoadingEventId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!eventId) {
      setResult(null);
      setError(null);
      return;
    }

    const requestedEventId = eventId;
    setLoadingEventId(requestedEventId);
    setError(null);
    try {
      const data = await getPublicEventById(requestedEventId);
      setResult({ eventId: requestedEventId, data });
    } catch (caughtError) {
      setResult(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Không tải được thông tin cuộc thi",
      );
    } finally {
      setLoadingEventId((current) =>
        current === requestedEventId ? null : current,
      );
    }
  }, [eventId]);

  useEffect(() => {
    let active = true;

    if (!eventId) {
      setResult(null);
      setError(null);
      return;
    }

    const requestedEventId = eventId;
    setLoadingEventId(requestedEventId);
    setError(null);
    getPublicEventById(requestedEventId)
      .then((data) => {
        if (active) setResult({ eventId: requestedEventId, data });
      })
      .catch((caughtError) => {
        if (!active) return;
        setResult(null);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Không tải được thông tin cuộc thi",
        );
      })
      .finally(() => {
        if (active) setLoadingEventId(null);
      });

    return () => {
      active = false;
    };
  }, [eventId]);

  return {
    data: result?.eventId === eventId ? result.data : null,
    loading: loadingEventId === eventId,
    error,
    refresh,
  };
}
