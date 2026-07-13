import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { MyEventEntry } from "@/types/api";
import { getMyEvents } from "@/services/api/teams";
import { useAuth } from "./AuthContext";

interface EventContextType {
  myEvents: MyEventEntry[];
  selectedEventId: number | null;
  setSelectedEventId: (id: number) => void;
  isLoading: boolean;
  refreshMyEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType>({} as EventContextType);

export function EventProvider({ children }: { children: React.ReactNode }) {
<<<<<<< HEAD
  const { isAuthenticated, isLoading: authLoading } = useAuth();
=======
  const { isAuthenticated } = useAuth();
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
  const [myEvents, setMyEvents] = useState<MyEventEntry[]>([]);
  const [selectedEventId, setSelectedEventIdState] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const refreshMyEvents = useCallback(async () => {
<<<<<<< HEAD
    if (authLoading || !isAuthenticated) {
      setMyEvents([]);
      if (!isAuthenticated) {
        setSelectedEventIdState(null);
      }
=======
    if (!isAuthenticated) {
      setMyEvents([]);
      setSelectedEventIdState(null);
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
      return;
    }
    setIsLoading(true);
    try {
      const events = await getMyEvents();
      setMyEvents(events);
      setSelectedEventIdState((prev) => {
        if (prev && events.some((e) => e.event.id === prev)) return prev;
        return events[0]?.event.id ?? null;
      });
    } catch {
      setMyEvents([]);
    } finally {
      setIsLoading(false);
    }
<<<<<<< HEAD
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    void refreshMyEvents().catch(() => undefined);
=======
  }, [isAuthenticated]);

  useEffect(() => {
    refreshMyEvents();
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
  }, [refreshMyEvents]);

  const setSelectedEventId = useCallback((id: number) => {
    setSelectedEventIdState(id);
  }, []);

  const value = useMemo(
    () => ({
      myEvents,
      selectedEventId,
      setSelectedEventId,
      isLoading,
      refreshMyEvents,
    }),
    [myEvents, selectedEventId, setSelectedEventId, isLoading, refreshMyEvents],
  );

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}

export const useEventContext = () => useContext(EventContext);

export function useSelectedEvent() {
  const { myEvents, selectedEventId } = useEventContext();
  return myEvents.find((e) => e.event.id === selectedEventId) ?? null;
}
