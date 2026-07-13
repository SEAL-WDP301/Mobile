import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, Clock, CheckCircle, AlertTriangle } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { useEventContext } from "@/contexts/EventContext";
import { useWorkspace } from "@/hooks/useWorkspace";
import { submitProject } from "@/services/api/submissions";
import { ApiError } from "@/services/api/client";
import {
  computeDeadlineProgress,
  computeTimeLeft,
  formatDateTime,
  mapRoundStatusLabel,
} from "@/utils/format";

export default function RoundDetailScreen() {
  const { isDark } = useTheme();
  const { selectedEventId } = useEventContext();
  const { data: workspace, loading, refresh } = useWorkspace(selectedEventId);

  const [githubUrl, setGithubUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
  const canSubmit = !!activeEntry?.canSubmit && !!selectedEventId;

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

  const handleSubmit = async () => {
    if (!canSubmit || !selectedEventId || !round) return;

    const repoUrl = workspace?.team?.githubRepoUrl;
    const url = githubUrl.trim() || repoUrl || "";

    if (!url && round.submissionType === "github_link") {
      Alert.alert("Lỗi", "Vui lòng nhập link GitHub hoặc đợi BTC gán repo cho đội.");
      return;
    }

    try {
      setSubmitting(true);
      await submitProject({
        eventId: selectedEventId,
        roundId: round.id,
        githubUrl: url || undefined,
        description: description.trim() || undefined,
      });
      await refresh();
      Alert.alert("Thành công", "Đã nộp bài thành công.");
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Không nộp được bài.";
      Alert.alert("Nộp bài thất bại", message);
    } finally {
      setSubmitting(false);
    }
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
                    Nộp lúc {formatDateTime(submission?.submittedAt)}. Bạn có thể cập nhật lại trước hạn.
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
                    {activeEntry?.lockReason ?? "Vui lòng nộp bài trước deadline."}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {canSubmit && (
          <View style={[styles.formBox, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 12 }]}>
              NỘP BÀI
            </Text>
            {workspace?.team?.githubRepoUrl ? (
              <Text style={[styles.hint, { color: colors.textSecondary }]}>
                Repo đội: {workspace.team.githubRepoUrl}
              </Text>
            ) : null}
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>GitHub URL</Text>
            <TextInput
              value={githubUrl}
              onChangeText={setGithubUrl}
              placeholder={workspace?.team?.githubRepoUrl ?? "https://github.com/org/repo"}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              keyboardType="url"
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardElevated }]}
            />
            <Text style={[styles.inputLabel, { color: colors.textSecondary, marginTop: 12 }]}>Mô tả</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Mô tả ngắn về bài nộp"
              placeholderTextColor={colors.textSecondary}
              multiline
              style={[styles.textArea, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardElevated }]}
            />
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.accent, opacity: submitting ? 0.7 : 1 }]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>
                {submitting ? "Đang nộp..." : hasSubmitted ? "Cập nhật bài nộp" : "Nộp bài"}
              </Text>
            </TouchableOpacity>
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
  formBox: { borderRadius: 16, borderWidth: 1, padding: 16 },
  hint: { fontSize: 12, marginBottom: 12, lineHeight: 18 },
  inputLabel: { fontSize: 11, fontWeight: "700", marginBottom: 6, textTransform: "uppercase" },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  textArea: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, minHeight: 80, textAlignVertical: "top" },
  submitBtn: { marginTop: 16, padding: 16, borderRadius: 14, alignItems: "center" },
  submitBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
