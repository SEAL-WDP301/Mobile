import { useCallback, useEffect, useState } from "react";
import type { TeamInvitation } from "@/types/api";
import {
  acceptInvitation,
  getPendingInvitations,
  rejectInvitation,
} from "@/services/api/teams";
import { useAuth } from "@/contexts/AuthContext";

export function usePendingInvitations() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (authLoading || !isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getPendingInvitations();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    void refresh().catch(() => undefined);
  }, [refresh]);

  const accept = useCallback(
    async (teamId: number) => {
      await acceptInvitation(teamId);
      await refresh();
    },
    [refresh],
  );

  const reject = useCallback(
    async (teamId: number) => {
      await rejectInvitation(teamId);
      await refresh();
    },
    [refresh],
  );

  return { items, loading, refresh, accept, reject };
}
