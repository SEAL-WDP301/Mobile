import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, Calendar } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";

export default function ActivityDetailScreen() {
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Chi tiết hoạt động</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.emptyState}>
        <View style={[styles.emptyIcon, { backgroundColor: `${colors.accent}15` }]}>
          <Calendar size={32} color={colors.accent} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Không tìm thấy hoạt động</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Hoạt động này không tồn tại hoặc đã bị xóa khỏi lịch trình.
        </Text>
        <TouchableOpacity
          style={[styles.backLink, { borderColor: colors.border }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backLinkText, { color: colors.textPrimary }]}>Quay lại</Text>
        </TouchableOpacity>
      </View>
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
  backBtn: { width: 32, height: 32, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 20 },
  backLink: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  backLinkText: { fontSize: 14, fontWeight: "600" },
});
