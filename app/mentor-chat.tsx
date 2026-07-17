import React from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import ChatPanel from "@/components/chat/ChatPanel";
import { useTheme } from "@/constants/theme/useTheme";
import { useEventContext } from "@/contexts/EventContext";
import { useTeamStatus } from "@/hooks/useTeamStatus";

export default function MentorChatScreen() {
  const { isDark } = useTheme();
  const { selectedEventId } = useEventContext();
  const { data: teamStatus } = useTeamStatus(selectedEventId);

  const team = teamStatus?.teamInfo?.team;
  const teamId = team?.id;
  const teamName = team?.name ?? "Đội nhóm";
  const mentor = team?.mentorAssignments?.[0]?.mentor;
  const mentorId = mentor?.id;
  const mentorName = mentor?.name ?? "Mentor";

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Chat mentor</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {mentorName} · {teamName}
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {teamId && mentorId ? (
        <ChatPanel channel="mentor" teamId={teamId} mentorId={mentorId} />
      ) : (
        <View style={styles.emptyState}>
          <Text style={{ color: colors.textPrimary, textAlign: "center", lineHeight: 20 }}>
            {teamId
              ? "Đội chưa được phân công mentor. Chat mentor sẽ khả dụng khi BTC gán mentor."
              : "Bạn chưa có đội để chat với mentor."}
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
