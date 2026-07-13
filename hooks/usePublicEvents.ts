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
<<<<<<< HEAD
    void refresh().catch(() => undefined);
=======
    refresh();
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
  }, [refresh]);

  return { events, loading, error, refresh };
}
