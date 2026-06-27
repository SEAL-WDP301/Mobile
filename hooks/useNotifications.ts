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
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
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
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
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
