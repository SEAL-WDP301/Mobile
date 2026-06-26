import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, Bell, BellOff, CheckCheck, Trash2, ShieldAlert } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { ANNOUNCEMENTS as INITIAL_ANNOUNCEMENTS } from "@/constants/mockData";

const { width } = Dimensions.get("window");

export default function NotificationsScreen() {
  const { isDark } = useTheme();
  
  // Custom states to demonstrate interactions
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    cardElevated: isDark ? "#211F1D" : "#F5F3EF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  };

  const handleMarkAllRead = () => {
    const updated = announcements.map(a => ({ ...a, unread: false }));
    setAnnouncements(updated);
    Alert.alert("Thông báo", "Đã đánh dấu đọc tất cả thông báo.");
  };

  const handleClearAll = () => {
    Alert.alert(
      "Xóa thông báo",
      "Bạn có chắc chắn muốn xóa tất cả thông báo?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa sạch", 
          style: "destructive",
          onPress: () => setAnnouncements([])
        }
      ]
    );
  };

  const toggleReadStatus = (id: number) => {
    const updated = announcements.map(a => {
      if (a.id === id) {
        return { ...a, unread: !a.unread };
      }
      return a;
    });
    setAnnouncements(updated);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* ================= HEADER ================= */}
      <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Thông báo</Text>
        </View>
        
        {announcements.length > 0 && (
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleMarkAllRead} style={styles.iconActionBtn}>
              <CheckCheck size={18} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClearAll} style={styles.iconActionBtn}>
              <Trash2 size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ================= NOTIFICATIONS LIST ================= */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {announcements.length === 0 ? (
          /* ================= EMPTY STATE ================= */
          <View style={[styles.emptyContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={[styles.emptyIconWrapper, { backgroundColor: `${colors.textSecondary}15` }]}>
              <BellOff size={28} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Hộp thư trống</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Bạn chưa nhận được thông báo mới nào từ Ban tổ chức SEAL Hackathon.
            </Text>
            <TouchableOpacity 
              style={[styles.reloadBtn, { backgroundColor: colors.accent }]}
              onPress={() => setAnnouncements(INITIAL_ANNOUNCEMENTS)}
            >
              <Text style={styles.reloadBtnText}>Tải lại thông báo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {announcements.map((item) => {
              // Custom type colors
              let typeColor = colors.accent;
              if (item.type === "warning") typeColor = colors.warning;
              if (item.type === "success") typeColor = colors.success;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.notificationCard,
                    { backgroundColor: colors.cardBg, borderColor: colors.border },
                    item.unread && { borderColor: `${colors.accent}40`, borderWidth: 1 }
                  ]}
                  activeOpacity={0.8}
                  onPress={() => toggleReadStatus(item.id)}
                >
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.headerLeftSection}>
                      <View style={[styles.typeIndicator, { backgroundColor: typeColor }]} />
                      <Text style={[styles.cardTitleText, { color: colors.textPrimary }]} numberOfLines={1}>
                        {item.title}
                      </Text>
                    </View>
                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>{item.time}</Text>
                  </View>

                  <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                    {item.body}
                  </Text>

                  {item.unread && (
                    <View style={styles.unreadBadgeContainer}>
                      <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />
                      <Text style={[styles.unreadLabel, { color: colors.accent }]}>Chưa đọc (Chạm để ẩn)</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: "row",
    gap: 14,
  },
  iconActionBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  listContainer: {
    gap: 12,
  },
  notificationCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  headerLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  typeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardTitleText: {
    fontSize: 14,
    fontWeight: "750",
    flex: 1,
  },
  timeText: {
    fontSize: 11,
  },
  bodyText: {
    fontSize: 12,
    lineHeight: 18,
  },
  unreadBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.03)",
    paddingTop: 8,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  unreadLabel: {
    fontSize: 10,
    fontWeight: "700",
  },
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  reloadBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  reloadBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
