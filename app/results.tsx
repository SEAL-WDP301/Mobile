import React, { useEffect, useState } from "react";
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
import { ChevronLeft, MessageSquare, Info, Trophy } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { useEventContext } from "@/contexts/EventContext";
import { useTeamStatus } from "@/hooks/useTeamStatus";
import { useWorkspace } from "@/hooks/useWorkspace";
import { getMentorFeedback } from "@/services/api/teams";
import type { MentorFeedback } from "@/types/api";
import { formatDateTime } from "@/utils/format";

export default function ResultsScreen() {
  const { isDark } = useTheme();
  const { selectedEventId } = useEventContext();
  const { data: teamStatus } = useTeamStatus(selectedEventId);
  const { data: workspace } = useWorkspace(selectedEventId);

  const [feedbacks, setFeedbacks] = useState<MentorFeedback[]>([]);
  const [loading, setLoading] = useState(false);

  const team = teamStatus?.teamInfo?.team;
  const teamName = team?.name ?? "Đội của bạn";
  const scoredRounds =
    workspace?.roundSubmissions?.filter(
      (entry) => entry.teamRound?.score != null,
    ) ?? [];

  useEffect(() => {
    if (!selectedEventId) return;
    setLoading(true);
    getMentorFeedback(selectedEventId)
      .then(setFeedbacks)
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false));
  }, [selectedEventId]);

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    cardElevated: isDark ? "#211F1D" : "#F5F3EF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    info: "#06B6D4",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Kết quả & Nhận xét</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.summaryCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>NHẬN XÉT TỪ MENTOR</Text>
          <Text style={[styles.teamName, { color: colors.textPrimary }]}>{teamName}</Text>
          <Text style={[styles.feedbackCount, { color: colors.textSecondary }]}>
            {feedbacks.length} nhận xét
          </Text>
        </View>

        <View style={[styles.researchBox, { backgroundColor: `${colors.info}10`, borderColor: `${colors.info}30` }]}>
          <Info size={16} color={colors.info} style={{ marginRight: 10, marginTop: 2 }} />
          <Text style={[styles.researchText, { color: colors.info }]}>
            Điểm vòng thi và nhận xét mentor được lấy trực tiếp từ hệ thống SEAL.
          </Text>
        </View>

        {scoredRounds.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginLeft: 4 }]}>
              ĐIỂM THEO VÒNG
            </Text>
            <View style={styles.feedbackList}>
              {scoredRounds.map((entry) => (
                <View
                  key={entry.round.id}
                  style={[styles.feedbackCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
                >
                  <View style={styles.feedbackCardHeader}>
                    <Text style={[styles.mentorName, { color: colors.textPrimary }]}>
                      {entry.round.name}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <Trophy size={14} color={colors.accent} />
                      <Text style={[styles.scoreText, { color: colors.accent }]}>
                        {Number(entry.teamRound?.score).toFixed(1)}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.roundLabel, { color: colors.textSecondary }]}>
                    Trạng thái: {entry.teamRound?.status ?? "—"}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginLeft: 4, marginTop: 8 }]}>
          NHẬN XÉT CHI TIẾT
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 24 }} />
        ) : feedbacks.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <MessageSquare size={28} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Chưa có nhận xét nào từ mentor.
            </Text>
          </View>
        ) : (
          <View style={styles.feedbackList}>
            {feedbacks.map((fb) => (
              <View
                key={fb.id}
                style={[styles.feedbackCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
              >
                <View style={styles.feedbackCardHeader}>
                  <Text style={[styles.mentorName, { color: colors.textPrimary }]}>
                    {fb.mentor?.name ?? "Mentor"}
                  </Text>
                  <Text style={[styles.feedbackDate, { color: colors.textSecondary }]}>
                    {formatDateTime(fb.createdAt)}
                  </Text>
                </View>
                {fb.submission?.round?.name && (
                  <Text style={[styles.roundLabel, { color: colors.accent }]}>
                    {fb.submission.round.name}
                  </Text>
                )}
                <View style={[styles.commentBox, { backgroundColor: colors.cardElevated }]}>
                  <MessageSquare size={14} color={colors.accent} style={{ marginRight: 8, marginTop: 2 }} />
                  <Text style={[styles.commentBodyText, { color: colors.textSecondary }]}>
                    {fb.content}
                  </Text>
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
  backBtn: { width: 32, height: 32, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, gap: 16 },
  summaryCard: { borderRadius: 24, borderWidth: 1, padding: 20 },
  summaryLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  teamName: { fontSize: 22, fontWeight: "900", marginTop: 4 },
  feedbackCount: { fontSize: 13, marginTop: 8 },
  researchBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  researchText: { fontSize: 12, lineHeight: 18, flex: 1 },
  sectionTitle: { fontSize: 11, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  emptyCard: {
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
  },
  emptyText: { fontSize: 13, textAlign: "center" },
  feedbackList: { gap: 14 },
  feedbackCard: { borderRadius: 20, borderWidth: 1, padding: 14 },
  feedbackCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  mentorName: { fontSize: 14, fontWeight: "700" },
  scoreText: { fontSize: 16, fontWeight: "800" },
  feedbackDate: { fontSize: 11 },
  roundLabel: { fontSize: 11, fontWeight: "700", marginBottom: 8 },
  commentBox: { borderRadius: 12, padding: 10, flexDirection: "row", alignItems: "flex-start" },
  commentBodyText: { fontSize: 12, lineHeight: 17, flex: 1 },
});
