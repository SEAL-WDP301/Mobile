import { useCallback, useEffect, useState } from "react";
import type { RegistrationStatus } from "@/types/api";
import { getRegistrationStatus } from "@/services/api/teams";
import { useAuth } from "@/contexts/AuthContext";

export function useTeamStatus(eventId: number | null) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<RegistrationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (authLoading || !isAuthenticated || !eventId) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const status = await getRegistrationStatus(eventId);
      setData(status);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : "Không tải được thông tin đội");
    } finally {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, eventId]);

  useEffect(() => {
    void refresh().catch(() => undefined);
  }, [refresh]);

  return { data, loading, error, refresh };
}
