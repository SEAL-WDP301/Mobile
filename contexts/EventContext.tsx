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
  const { isAuthenticated } = useAuth();
  const [myEvents, setMyEvents] = useState<MyEventEntry[]>([]);
  const [selectedEventId, setSelectedEventIdState] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const refreshMyEvents = useCallback(async () => {
    if (!isAuthenticated) {
      setMyEvents([]);
      setSelectedEventIdState(null);
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
  }, [isAuthenticated]);

  useEffect(() => {
    refreshMyEvents();
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
