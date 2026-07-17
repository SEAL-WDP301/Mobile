import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, QrCode } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";

export default function ParticipantPassScreen() {
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
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Thẻ tham gia</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <QrCode size={40} color={colors.accent} style={{ marginBottom: 16 }} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>Chưa khả dụng</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Backend chưa cung cấp API check-in / thẻ tham gia QR. Tính năng này sẽ được bật khi có endpoint tương ứng.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: "800" },
  card: {
    margin: 16,
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  body: { fontSize: 13, textAlign: "center", lineHeight: 20 },
});
