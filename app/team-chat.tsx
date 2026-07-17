import React from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import ChatPanel from "@/components/chat/ChatPanel";
import { useTheme } from "@/constants/theme/useTheme";
import { useEventContext } from "@/contexts/EventContext";
import { useTeamStatus } from "@/hooks/useTeamStatus";

export default function TeamChatScreen() {
  const { isDark } = useTheme();
  const { selectedEventId } = useEventContext();
  const { data: teamStatus } = useTeamStatus(selectedEventId);

  const team = teamStatus?.teamInfo?.team;
  const teamId = team?.id;
  const teamName = team?.name ?? "Đội nhóm";

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    accent: "#F37021",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Chat đội</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {teamName}
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {teamId ? (
        <ChatPanel channel="team" teamId={teamId} />
      ) : (
        <View style={styles.emptyState}>
          <Text style={{ color: colors.textPrimary, textAlign: "center" }}>
            Bạn chưa có đội để chat. Tham gia hoặc tạo đội trước.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 32, height: 32, justifyContent: "center", alignItems: "center" },
  headerText: { flex: 1, alignItems: "center" },
  title: { fontSize: 15, fontWeight: "800" },
  subtitle: { fontSize: 12, marginTop: 2 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
});
