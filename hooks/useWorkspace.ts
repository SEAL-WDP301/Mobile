import { useCallback, useEffect, useState } from "react";
import type { WorkspaceOverview } from "@/types/api";
import { getWorkspaceOverview } from "@/services/api/teams";
import { useAuth } from "@/contexts/AuthContext";

export function useWorkspace(eventId: number | null) {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<WorkspaceOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !eventId) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const overview = await getWorkspaceOverview(eventId);
      setData(overview);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : "Không tải được workspace");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, eventId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
