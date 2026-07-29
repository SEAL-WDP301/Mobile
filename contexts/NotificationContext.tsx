import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  AppState,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Bell } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/constants/theme/useTheme";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/api/users";
import {
  disconnectNotificationSocket,
  getNotificationSocket,
} from "@/services/notificationSocket";
import type { AppNotification } from "@/types/api";

interface IncomingNotification {
  title?: string;
  content?: string;
  actionUrl?: string | null;
}

interface NotificationContextValue {
  items: AppNotification[];
  loading: boolean;
  unreadCount: number;
  refresh: () => Promise<void>;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<IncomingNotification | null>(null);
  const bannerY = useRef(new Animated.Value(-160)).current;
  const appState = useRef(AppState.currentState);

  const refresh = useCallback(async () => {
    if (authLoading || !isAuthenticated) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      setItems(await getNotifications());
    } catch {
      // Keep the last successful list when a background refresh fails.
    } finally {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      const becameActive =
        appState.current !== "active" && nextState === "active";
      appState.current = nextState;
      if (becameActive) {
        void refresh();
      }
    });

    return () => subscription.remove();
  }, [refresh]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      disconnectNotificationSocket();
      return;
    }

    let disposed = false;
    let cleanupSocket: (() => void) | undefined;

    void getNotificationSocket()
      .then((client) => {
        if (disposed) return;

        const joinUserRoom = () => {
          client.emit("joinUser", { userId: user.id });
        };
        const onNotification = (notification: IncomingNotification) => {
          if (appState.current === "active") {
            setBanner(notification);
            void Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success,
            ).catch(() => undefined);
          }
          void refresh();
        };

        client.on("connect", joinUserRoom);
        client.on("notification.new", onNotification);
        if (client.connected) joinUserRoom();

        cleanupSocket = () => {
          client.off("connect", joinUserRoom);
          client.off("notification.new", onNotification);
        };
      })
      .catch(() => {
        // The foreground refresh still keeps notifications usable if realtime
        // connectivity is temporarily unavailable.
      });

    return () => {
      disposed = true;
      cleanupSocket?.();
      disconnectNotificationSocket();
    };
  }, [isAuthenticated, refresh, user]);

  useEffect(() => {
    if (!banner) return;

    bannerY.setValue(-160);
    Animated.spring(bannerY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
    }).start();

    const timeout = setTimeout(() => {
      Animated.timing(bannerY, {
        toValue: -160,
        duration: 220,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setBanner(null);
      });
    }, 4500);

    return () => clearTimeout(timeout);
  }, [banner, bannerY]);

  const markRead = useCallback(async (id: number) => {
    await markNotificationRead(id);
    setItems((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  }, []);

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead();
    setItems((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  }, []);

  const remove = useCallback(async (id: number) => {
    await deleteNotification(id);
    setItems((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const value = useMemo(
    () => ({
      items,
      loading,
      unreadCount: items.filter((notification) => !notification.isRead).length,
      refresh,
      markRead,
      markAllRead,
      remove,
    }),
    [items, loading, markAllRead, markRead, refresh, remove],
  );

  const openNotifications = () => {
    const actionUrl = banner?.actionUrl;
    setBanner(null);
    if (actionUrl === "/teams") {
      router.push("/(tabs)/teams");
      return;
    }
    router.push("/notifications");
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {banner && (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[
              styles.bannerPosition,
              {
                top: insets.top + 8,
                transform: [{ translateY: bannerY }],
              },
            ]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mở thông báo mới"
              onPress={openNotifications}
              style={[
                styles.banner,
                {
                  backgroundColor: isDark ? "#25211F" : "#FFFFFF",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)",
                },
              ]}
            >
              <View style={styles.bannerIcon}>
                <Bell size={18} color="#FFFFFF" />
              </View>
              <View style={styles.bannerText}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.bannerTitle,
                    { color: isDark ? "#FFFFFF" : "#1C1917" },
                  ]}
                >
                  {banner.title ?? "Thông báo mới"}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.bannerContent,
                    { color: isDark ? "#B8AEA9" : "#78716C" },
                  ]}
                >
                  {banner.content ?? "Bạn vừa nhận được một thông báo mới."}
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        </View>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  }
  return context;
}

const styles = StyleSheet.create({
  bannerPosition: {
    position: "absolute",
    left: 14,
    right: 14,
    zIndex: 1000,
    elevation: 20,
  },
  banner: {
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 12,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F37021",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 3,
  },
  bannerContent: {
    fontSize: 12,
    lineHeight: 17,
  },
});
