import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, BellOff, CheckCheck, Trash2 } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { useNotifications } from "@/hooks/useNotifications";
import { formatRelativeTime } from "@/utils/format";

export default function NotificationsScreen() {
  const { isDark } = useTheme();
  const { items, loading, unreadCount, markRead, markAllRead, remove, refresh } =
    useNotifications();

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    error: "#EF4444",
  };

  const announcements = useMemo(
    () =>
      items.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.content,
        time: formatRelativeTime(n.createdAt),
        unread: !n.isRead,
      })),
    [items],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Thông báo</Text>
            {unreadCount > 0 && (
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {unreadCount} chưa đọc
              </Text>
            )}
          </View>
        </View>

        {announcements.length > 0 && (
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={markAllRead} style={styles.iconActionBtn}>
              <CheckCheck size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
        ) : announcements.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={[styles.emptyIconWrapper, { backgroundColor: `${colors.textSecondary}15` }]}>
              <BellOff size={28} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Hộp thư trống</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Bạn chưa nhận được thông báo mới nào từ Ban tổ chức.
            </Text>
            <TouchableOpacity
              style={[styles.reloadBtn, { backgroundColor: colors.accent }]}
              onPress={refresh}
            >
              <Text style={styles.reloadBtnText}>Tải lại thông báo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {announcements.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.notificationCard,
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                  item.unread && { borderColor: `${colors.accent}40`, borderWidth: 1 },
                ]}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={styles.headerLeftSection}>
                    <View style={[styles.typeIndicator, { backgroundColor: colors.accent }]} />
                    <Text style={[styles.cardTitleText, { color: colors.textPrimary }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                  <Text style={[styles.timeText, { color: colors.textSecondary }]}>{item.time}</Text>
                </View>

                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{item.body}</Text>

                <View style={styles.cardActions}>
                  {item.unread ? (
                    <TouchableOpacity onPress={() => markRead(item.id)} style={styles.actionLink}>
                      <Text style={[styles.actionLinkText, { color: colors.accent }]}>Đánh dấu đã đọc</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={[styles.readLabel, { color: colors.textSecondary }]}>Đã đọc</Text>
                  )}
                  <TouchableOpacity onPress={() => remove(item.id)} style={styles.deleteBtn}>
                    <Trash2 size={14} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: { fontSize: 16, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 11, marginTop: 2 },
  headerActions: { flexDirection: "row", gap: 14 },
  iconActionBtn: { width: 32, height: 32, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  listContainer: { gap: 12 },
  notificationCard: { borderRadius: 16, borderWidth: 1, padding: 14 },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  headerLeftSection: { flexDirection: "row", alignItems: "center", flex: 1, gap: 8 },
  typeIndicator: { width: 8, height: 8, borderRadius: 4 },
  cardTitleText: { fontSize: 14, fontWeight: "700", flex: 1 },
  timeText: { fontSize: 11 },
  bodyText: { fontSize: 12, lineHeight: 18 },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.03)",
  },
  actionLink: { paddingVertical: 4 },
  actionLinkText: { fontSize: 11, fontWeight: "700" },
  readLabel: { fontSize: 11 },
  deleteBtn: { padding: 4 },
  emptyContainer: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    marginTop: 40,
  },
  emptyIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", marginBottom: 6 },
  emptySubtitle: { fontSize: 13, textAlign: "center", lineHeight: 18, marginBottom: 20 },
  reloadBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  reloadBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
});
