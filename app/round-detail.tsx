import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, Clock, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { useEventContext } from "@/contexts/EventContext";
import { useWorkspace } from "@/hooks/useWorkspace";
import {
  computeDeadlineProgress,
  computeTimeLeft,
  formatDateTime,
  mapRoundStatusLabel,
} from "@/utils/format";

export default function RoundDetailScreen() {
  const { isDark } = useTheme();
  const { selectedEventId } = useEventContext();
  const { data: workspace, loading } = useWorkspace(selectedEventId);

  const activeEntry = useMemo(() => {
    if (!workspace) return null;
    const activeRoundId = workspace.currentActiveRound?.id;
    return (
      workspace.roundSubmissions.find((r) => r.round.id === activeRoundId) ??
      workspace.roundSubmissions.find((r) => r.canSubmit) ??
      workspace.roundSubmissions[0] ??
      null
    );
  }, [workspace]);

  const round = activeEntry?.round;
  const submission = activeEntry?.submission;
  const hasSubmitted = !!submission;

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
  };

  const handleOpenWeb = () => {
    Alert.alert(
      "Mở cổng nộp bài",
      "Vui lòng sử dụng SEAL Web để nộp hoặc cập nhật bài làm.",
      [{ text: "OK", style: "cancel" }],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  if (!round) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
        <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Chi tiết vòng thi</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Không có vòng thi đang hoạt động.
        </Text>
      </SafeAreaView>
    );
  }

  const timeLeft = computeTimeLeft(round.submissionDeadline);
  const progress = computeDeadlineProgress(null, round.submissionDeadline);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Chi tiết vòng thi</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.roundHero, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.cardTag, { color: colors.accent }]}>VÒNG THI HIỆN TẠI</Text>
          <Text style={[styles.roundName, { color: colors.textPrimary }]}>{round.name}</Text>
          <View style={styles.timeRow}>
            <Clock size={16} color={colors.warning} />
            <Text style={[styles.timeLeft, { color: colors.warning }]}>{timeLeft}</Text>
          </View>
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            {mapRoundStatusLabel(round.status)}
          </Text>
          <View style={[styles.progressBar, { backgroundColor: isDark ? "#2A2826" : "#E5E7EB", marginTop: 12 }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: colors.accent }]} />
          </View>
        </View>

        <View style={[styles.statusBox, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 12 }]}>
            TRẠNG THÁI BÀI NỘP
          </Text>

          {hasSubmitted ? (
            <View style={styles.submittedContainer}>
              <View style={[styles.alertBanner, { backgroundColor: `${colors.success}10`, borderColor: `${colors.success}30` }]}>
                <CheckCircle size={18} color={colors.success} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.alertTitle, { color: colors.success }]}>Đã ghi nhận bài nộp</Text>
                  <Text style={[styles.alertBody, { color: colors.textSecondary }]}>
                    Nộp lúc {formatDateTime(submission?.submittedAt)}. Cập nhật bài trên Web trước hạn.
                  </Text>
                </View>
              </View>

              <View style={[styles.detailsBlock, { backgroundColor: colors.cardElevated }]}>
                {submission?.description ? (
                  <>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Mô tả:</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{submission.description}</Text>
                  </>
                ) : null}
                {submission?.githubUrl ? (
                  <>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary, marginTop: 10 }]}>GitHub:</Text>
                    <Text style={[styles.detailValue, { color: colors.accent }]} numberOfLines={2}>
                      {submission.githubUrl}
                    </Text>
                  </>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={styles.notSubmittedContainer}>
              <View style={[styles.alertBanner, { backgroundColor: `${colors.warning}10`, borderColor: `${colors.warning}30` }]}>
                <AlertTriangle size={18} color={colors.warning} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.alertTitle, { color: colors.warning }]}>Chưa ghi nhận bài nộp</Text>
                  <Text style={[styles.alertBody, { color: colors.textSecondary }]}>
                    {activeEntry?.lockReason ?? "Vui lòng nộp bài trên SEAL Web trước deadline."}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.webPortalBtn, { backgroundColor: colors.accent }]}
          onPress={handleOpenWeb}
          activeOpacity={0.85}
        >
          <ExternalLink size={18} color="#FFFFFF" />
          <Text style={styles.webPortalBtnText}>Mở SEAL Web để nộp bài</Text>
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
  scrollContent: { padding: 16, paddingBottom: 40, gap: 16 },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 14 },
  roundHero: { borderRadius: 16, borderWidth: 1, padding: 20 },
  cardTag: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  roundName: { fontSize: 20, fontWeight: "800", marginTop: 8 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 },
  timeLeft: { fontSize: 14, fontWeight: "700" },
  statusText: { fontSize: 12, marginTop: 6 },
  progressBar: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  statusBox: { borderRadius: 16, borderWidth: 1, padding: 16 },
  sectionTitle: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  submittedContainer: { gap: 12 },
  notSubmittedContainer: { gap: 12 },
  alertBanner: { flexDirection: "row", padding: 14, borderRadius: 12, borderWidth: 1 },
  alertTitle: { fontSize: 14, fontWeight: "700" },
  alertBody: { fontSize: 12, marginTop: 4, lineHeight: 18 },
  detailsBlock: { padding: 14, borderRadius: 12 },
  detailLabel: { fontSize: 11, fontWeight: "600" },
  detailValue: { fontSize: 13, marginTop: 4 },
  webPortalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 14,
  },
  webPortalBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
