import { useCallback, useEffect, useState } from "react";
import type { PublicEvent } from "@/types/api";
import { getPublicEvents } from "@/services/api/events";

export function usePublicEvents() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicEvents();
      setEvents(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh().catch(() => undefined);
  }, [refresh]);

  return { events, loading, error, refresh };
}
