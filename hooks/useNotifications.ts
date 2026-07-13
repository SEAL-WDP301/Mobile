import { useCallback, useEffect, useState } from "react";
import type { AppNotification } from "@/types/api";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/api/users";
import { useAuth } from "@/contexts/AuthContext";

export function useNotifications() {
<<<<<<< HEAD
  const { isAuthenticated, isLoading: authLoading } = useAuth();
=======
  const { isAuthenticated } = useAuth();
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
<<<<<<< HEAD
    if (authLoading || !isAuthenticated) {
=======
    if (!isAuthenticated) {
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getNotifications();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
<<<<<<< HEAD
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    void refresh().catch(() => undefined);
=======
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
  }, [refresh]);

  const markRead = useCallback(
    async (id: number) => {
      await markNotificationRead(id);
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    },
    [],
  );

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead();
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const remove = useCallback(async (id: number) => {
    await deleteNotification(id);
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = items.filter((n) => !n.isRead).length;

  return {
    items,
    loading,
    unreadCount,
    refresh,
    markRead,
    markAllRead,
    remove,
  };
}
