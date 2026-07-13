import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, Briefcase, Calendar, MessageSquare, Award } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { useEventContext } from "@/contexts/EventContext";
import { useTeamStatus } from "@/hooks/useTeamStatus";
import { getInitials } from "@/utils/format";

export default function MentorDetailScreen() {
  const { isDark } = useTheme();
  const { selectedEventId } = useEventContext();
  const { data: teamStatus } = useTeamStatus(selectedEventId);

  const mentor = teamStatus?.teamInfo?.team?.mentorAssignments?.[0]?.mentor;
  const profile = mentor?.stakeholderProfile;

  const displayName = mentor?.name ?? "—";
  const position = profile?.jobTitle ?? "—";
  const org = profile?.organization ?? "—";
  const bio = profile?.bio ?? "Chưa có giới thiệu.";

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    cardElevated: isDark ? "#211F1D" : "#F5F3EF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

  const handleBookSlot = () => {
    Alert.alert(
      "Đặt lịch Mentoring",
      "Tính năng đặt lịch sẽ có khi BE bổ sung API mentor booking.",
      [{ text: "Đóng", style: "cancel" }],
    );
  };

  if (!mentor) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Thông tin Mentor</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Chưa có mentor</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Đội của bạn chưa được phân công mentor.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Thông tin Mentor</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarLarge, { backgroundColor: colors.accent }]}>
              <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.nameText, { color: colors.textPrimary }]}>{displayName}</Text>
              <Text style={[styles.positionText, { color: colors.textSecondary }]}>{position}</Text>
              <Text style={[styles.orgText, { color: colors.textSecondary }]}>{org}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>GIỚI THIỆU</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.bioText, { color: colors.textSecondary }]}>{bio}</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <Briefcase size={16} color={colors.accent} />
            <Text style={[styles.infoText, { color: colors.textPrimary }]}>{org}</Text>
          </View>
          <View style={styles.infoRow}>
            <Award size={16} color={colors.accent} />
            <Text style={[styles.infoText, { color: colors.textPrimary }]}>Mentor được phân công cho đội</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookBtn, { backgroundColor: colors.accent }]}
          onPress={handleBookSlot}
          activeOpacity={0.85}
        >
          <Calendar size={18} color="#FFFFFF" />
          <Text style={styles.bookBtnText}>Đặt lịch Mentoring</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.messageBtn, { borderColor: colors.border }]}
          onPress={() => router.push("/team-chat")}
        >
          <MessageSquare size={16} color={colors.textPrimary} />
          <Text style={[styles.messageBtnText, { color: colors.textPrimary }]}>Nhắn tin</Text>
        </TouchableOpacity>
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
  backBtn: { width: 32, height: 32, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "800", textTransform: "uppercase" },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  profileCard: { borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 16 },
  profileHeader: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatarLarge: { width: 64, height: 64, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#FFFFFF", fontSize: 22, fontWeight: "900" },
  profileInfo: { flex: 1 },
  nameText: { fontSize: 20, fontWeight: "800" },
  positionText: { fontSize: 13, marginTop: 4 },
  orgText: { fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  bioText: { fontSize: 14, lineHeight: 22 },
  infoCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12, marginBottom: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoText: { fontSize: 14, fontWeight: "500", flex: 1 },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 26,
    marginBottom: 12,
  },
  bookBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  messageBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
  },
  messageBtnText: { fontSize: 14, fontWeight: "600" },
});
