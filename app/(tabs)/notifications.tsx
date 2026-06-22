import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  CheckCheck,
  Trash2,
  Clock,
  Trophy,
  GraduationCap,
  Megaphone,
  UserPlus
} from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";

const SEED = [
  { id: 1, type: "Team", icon: UserPlus, title: "Team invitation", body: "Async Wolves invited you to join their team.", time: "2m", unread: true },
  { id: 2, type: "Deadline", icon: Clock, title: "Sprint 2 closes in 2 days", body: "Submit your build before Aug 4 · 23:59.", time: "1h", unread: true },
  { id: 3, type: "Ranking", icon: Trophy, title: "You moved up to #12", body: "Quantum Drift overtook 4 teams in 24 hours.", time: "5h", unread: true },
  { id: 4, type: "Mentor", icon: GraduationCap, title: "Mentor assigned", body: "Mr. Hoang Pham is now mentoring your team.", time: "1d", unread: false },
  { id: 5, type: "Event", icon: Megaphone, title: "AI Agents track unlocked", body: "Cross-team submissions are now allowed.", time: "2d", unread: false },
];

const FILTERS = ["All", "Team", "Event", "Deadline", "Ranking", "Mentor"];

export default function NotificationsScreen() {
  const { isDark } = useTheme();
  const [items, setItems] = useState(SEED);
  const [activeFilter, setActiveFilter] = useState("All");

  const colors = {
    bg: isDark ? "#0C0A09" : "#F9F6F0",
    cardBg: isDark ? "rgba(20, 17, 15, 0.75)" : "rgba(255, 255, 255, 0.95)",
    cardBorder: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.05)",
    textPrimary: isDark ? "#FFFFFF" : "#1C1917",
    textSecondary: isDark ? "#A39690" : "#78716C",
    textMuted: isDark ? "#57534E" : "#A8A29E",
    accent: "#f37021",
    subAccent: "#ff9248",
  };

  const filtered = activeFilter === "All" ? items : items.filter((i) => i.type === activeFilter);
  const unreadCount = items.filter((i) => i.unread).length;

  const markAllRead = () => setItems((arr) => arr.map((i) => ({ ...i, unread: false })));
  const toggleRead = (id: number) =>
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, unread: !i.unread } : i)));
  const removeItem = (id: number) => setItems((arr) => arr.filter((i) => i.id !== id));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Screen Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notifications</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{unreadCount} unread</Text>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={markAllRead}
            style={[styles.readAllBtn, { backgroundColor: `${colors.accent}15` }]}
            activeOpacity={0.8}
          >
            <CheckCheck size={12} color={colors.accent} />
            <Text style={[styles.readAllBtnText, { color: colors.accent }]}>Read all</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= FILTER CHIPS ================= */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map((f) => {
            const isActive = f === activeFilter;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? colors.accent : colors.cardBg,
                    borderColor: isActive ? colors.accent : colors.cardBorder,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isActive ? "#FFFFFF" : colors.textSecondary,
                      fontWeight: isActive ? "700" : "600",
                    },
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ================= NOTIFICATIONS LIST ================= */}
        <View style={styles.listContainer}>
          {filtered.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Bell size={32} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>You're all caught up.</Text>
            </View>
          ) : (
            filtered.map((n) => {
              const IconComponent = n.icon;
              return (
                <View
                  key={n.id}
                  style={[
                    styles.notificationItem,
                    {
                      backgroundColor: colors.cardBg,
                      borderColor: n.unread ? `${colors.accent}40` : colors.cardBorder,
                    },
                  ]}
                >
                  {/* Unread indicator dot */}
                  {n.unread && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}

                  <View style={styles.itemContent}>
                    {/* Left Icon Wrapper */}
                    <View
                      style={[
                        styles.iconWrapper,
                        {
                          backgroundColor: n.unread ? colors.accent : (isDark ? "#292524" : "#E7E5E4"),
                        },
                      ]}
                    >
                      <IconComponent size={16} color={n.unread ? "#FFFFFF" : colors.accent} />
                    </View>

                    {/* Notification Text */}
                    <View style={styles.textWrapper}>
                      <View style={styles.metaRow}>
                        <View style={[styles.typeBadge, { backgroundColor: isDark ? "#292524" : "#E7E5E4" }]}>
                          <Text style={[styles.typeBadgeText, { color: colors.textSecondary }]}>{n.type}</Text>
                        </View>
                        <Text style={[styles.timeText, { color: colors.textMuted }]}>{n.time} ago</Text>
                      </View>

                      <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{n.title}</Text>
                      <Text style={[styles.itemBody, { color: colors.textSecondary }]}>{n.body}</Text>

                      {/* Action buttons */}
                      <View style={styles.itemActions}>
                        <TouchableOpacity
                          onPress={() => toggleRead(n.id)}
                          style={[styles.actionBtn, { backgroundColor: isDark ? "#292524" : "#E7E5E4" }]}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>
                            {n.unread ? "Mark read" : "Mark unread"}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => removeItem(n.id)}
                          style={[styles.actionBtn, styles.actionBtnDanger]}
                          activeOpacity={0.8}
                        >
                          <Trash2 size={12} color="#ef4444" />
                          <Text style={[styles.actionBtnText, { color: "#ef4444" }]}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  readAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  readAllBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  filterScrollView: {
    marginBottom: 12,
    marginHorizontal: -16,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
  },
  listContainer: {
    gap: 10,
  },
  emptyCard: {
    padding: 40,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
    marginTop: 24,
  },
  emptyText: {
    fontSize: 13,
  },
  notificationItem: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    position: "relative",
    overflow: "hidden",
  },
  unreadDot: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
  },
  typeBadgeText: {
    fontSize: 8,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  timeText: {
    fontSize: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 6,
  },
  itemBody: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  itemActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionBtnDanger: {
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
