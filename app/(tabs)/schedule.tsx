import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";

export default function ScheduleScreen() {
  const { isDark } = useTheme();

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Lịch trình</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Lịch hoạt động sự kiện
        </Text>
      </View>

      <View style={[styles.emptyContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Calendar size={36} color={colors.accent} style={{ marginBottom: 16 }} />
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Chưa có lịch trình</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Lịch trình sự kiện sẽ hiển thị tại đây khi Ban tổ chức cập nhật.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  headerSubtitle: { fontSize: 13, marginTop: 4 },
  emptyContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 20,
    borderWidth: 1,
    padding: 40,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  emptyText: { fontSize: 13, textAlign: "center", lineHeight: 20 },
});
