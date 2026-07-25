import { useCallback, useEffect, useRef, useState } from "react";
import type { RegistrationStatus } from "@/types/api";
import { getRegistrationStatus } from "@/services/api/teams";
import { useAuth } from "@/contexts/AuthContext";

export function useTeamStatus(eventId: number | null) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [result, setResult] = useState<{
    eventId: number;
    data: RegistrationStatus;
  } | null>(null);
  const [loadingEventId, setLoadingEventId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++requestSequence.current;
    if (authLoading || !isAuthenticated || !eventId) {
      setResult(null);
      return;
    }
    const requestedEventId = eventId;
    setLoadingEventId(requestedEventId);
    setError(null);
    try {
      const status = await getRegistrationStatus(requestedEventId);
      if (requestId !== requestSequence.current) return;
      setResult({ eventId: requestedEventId, data: status });
    } catch (e) {
      if (requestId !== requestSequence.current) return;
      setResult(null);
      setError(e instanceof Error ? e.message : "Không tải được thông tin đội");
    } finally {
      if (requestId === requestSequence.current) {
        setLoadingEventId((current) =>
          current === requestedEventId ? null : current,
        );
      }
    }
  }, [authLoading, isAuthenticated, eventId]);

  useEffect(() => {
    void refresh().catch(() => undefined);
  }, [refresh]);

  return {
    data: result?.eventId === eventId ? result.data : null,
    loading: loadingEventId === eventId,
    error,
    refresh,
  };
}
