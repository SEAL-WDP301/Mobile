import { useCallback, useEffect, useState } from "react";
import type { RegistrationStatus } from "@/types/api";
import { getRegistrationStatus } from "@/services/api/teams";
import { useAuth } from "@/contexts/AuthContext";

export function useTeamStatus(eventId: number | null) {
<<<<<<< HEAD
  const { isAuthenticated, isLoading: authLoading } = useAuth();
=======
  const { isAuthenticated } = useAuth();
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
  const [data, setData] = useState<RegistrationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
<<<<<<< HEAD
    if (authLoading || !isAuthenticated || !eventId) {
=======
    if (!isAuthenticated || !eventId) {
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
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
<<<<<<< HEAD
  }, [authLoading, isAuthenticated, eventId]);

  useEffect(() => {
    void refresh().catch(() => undefined);
=======
  }, [isAuthenticated, eventId]);

  useEffect(() => {
    refresh();
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
  }, [refresh]);

  return { data, loading, error, refresh };
}
