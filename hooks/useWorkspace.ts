import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkspaceOverview } from "@/types/api";
import { getWorkspaceOverview } from "@/services/api/teams";
import { useAuth } from "@/contexts/AuthContext";

export function useWorkspace(eventId: number | null) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [result, setResult] = useState<{
    eventId: number;
    data: WorkspaceOverview;
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
      const overview = await getWorkspaceOverview(requestedEventId);
      if (requestId !== requestSequence.current) return;
      setResult({ eventId: requestedEventId, data: overview });
    } catch (e) {
      if (requestId !== requestSequence.current) return;
      setResult(null);
      setError(e instanceof Error ? e.message : "Không tải được workspace");
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
