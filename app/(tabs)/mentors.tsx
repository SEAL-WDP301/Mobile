import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { GraduationCap, MessageSquare, ChevronRight } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { useEventContext } from "@/contexts/EventContext";
import { useTeamStatus } from "@/hooks/useTeamStatus";
import Avatar from "@/components/ui/Avatar";

export default function MentorsScreen() {
  const { isDark } = useTheme();
  const { selectedEventId } = useEventContext();
  const { data: teamStatus } = useTeamStatus(selectedEventId);

  const mentor = teamStatus?.teamInfo?.team?.mentorAssignments?.[0]?.mentor;
  const profile = mentor?.stakeholderProfile;

  const colors = {
    bg: isDark ? "#0C0A09" : "#F9F6F0",
    cardBg: isDark ? "rgba(20, 17, 15, 0.75)" : "rgba(255, 255, 255, 0.95)",
    cardBorder: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.05)",
    textPrimary: isDark ? "#FFFFFF" : "#1C1917",
    textSecondary: isDark ? "#A39690" : "#78716C",
    accent: "#f37021",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Mentor</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Mentor được phân công cho đội
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!mentor ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <GraduationCap size={36} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Chưa có mentor</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Đội của bạn chưa được phân công mentor. Vui lòng liên hệ Ban tổ chức nếu cần hỗ trợ.
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.mentorCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
            activeOpacity={0.85}
            onPress={() => router.push("/mentor-detail")}
          >
            <Avatar
              name={mentor.name}
              imageUrl={mentor.avatarUrl}
              size={52}
              borderRadius={14}
              backgroundColor={colors.accent}
            />
            <View style={styles.mentorInfo}>
              <Text style={[styles.mentorName, { color: colors.textPrimary }]}>{mentor.name}</Text>
              <Text style={[styles.mentorRole, { color: colors.textSecondary }]}>
                {profile?.jobTitle ?? "Mentor"} · {profile?.organization ?? "—"}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {mentor && (
          <TouchableOpacity
            style={[styles.chatBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.push("/mentor-chat")}
            activeOpacity={0.85}
          >
            <MessageSquare size={18} color="#FFFFFF" />
            <Text style={styles.chatBtnText}>Nhắn tin với mentor</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: "900", letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 110 },
  emptyCard: {
    padding: 40,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
    marginTop: 24,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800" },
  emptyText: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  mentorCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  mentorInfo: { flex: 1 },
  mentorName: { fontSize: 16, fontWeight: "700" },
  mentorRole: { fontSize: 12, marginTop: 4 },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 24,
    marginTop: 16,
  },
  chatBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
