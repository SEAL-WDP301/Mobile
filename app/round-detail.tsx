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
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { ChevronLeft, Clock, CheckCircle, AlertTriangle, Upload, FileText } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { useEventContext } from "@/contexts/EventContext";
import { useWorkspace } from "@/hooks/useWorkspace";
import { submitProject } from "@/services/api/submissions";
import { ApiError } from "@/services/api/client";
import RoundTimeline from "@/components/student/RoundTimeline";
import {
  computeDeadlineProgress,
  computeTimeLeft,
  formatDateTime,
  mapRoundStatusLabel,
} from "@/utils/format";

export default function RoundDetailScreen() {
  const { isDark } = useTheme();
  const { roundId: roundIdParam } = useLocalSearchParams<{ roundId?: string }>();
  const parsedRoundId = roundIdParam ? parseInt(roundIdParam, 10) : null;

  const { selectedEventId } = useEventContext();
  const { data: workspace, loading, refresh } = useWorkspace(selectedEventId);

  const [selectedRoundId, setSelectedRoundId] = useState<number | null>(parsedRoundId);
  const [githubUrl, setGithubUrl] = useState("");
  const [description, setDescription] = useState("");
  const [pickedFile, setPickedFile] = useState<{
    uri: string;
    name: string;
    type: string;
    size?: number;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const activeEntry = useMemo(() => {
    if (!workspace) return null;
    const targetId = selectedRoundId ?? parsedRoundId ?? workspace.currentActiveRound?.id;
    if (targetId) {
      const found = workspace.roundSubmissions.find((r) => r.round.id === targetId);
      if (found) return found;
    }
    return (
      workspace.roundSubmissions.find((r) => r.round.id === workspace.currentActiveRound?.id) ??
      workspace.roundSubmissions.find((r) => r.canSubmit) ??
      workspace.roundSubmissions[0] ??
      null
    );
  }, [workspace, selectedRoundId, parsedRoundId]);

  const round = activeEntry?.round;
  const submission = activeEntry?.submission;
  const hasSubmitted = !!submission;
  const isLeader = workspace?.role === "leader";
  const teamApproved = workspace?.team?.status === "approved";
  const canSubmit =
    !!activeEntry?.canSubmit &&
    !!selectedEventId &&
    isLeader &&
    teamApproved;
  const isReadOnly = !activeEntry?.canSubmit;

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
    isDark,
  };

  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    const maxMb = round?.maxFileSizeMb ?? 50;
    if (asset.size && asset.size > maxMb * 1024 * 1024) {
      Alert.alert("Lỗi", `File vượt quá ${maxMb}MB.`);
      return;
    }
    setPickedFile({
      uri: asset.uri,
      name: asset.name,
      type: asset.mimeType ?? "application/octet-stream",
      size: asset.size,
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit || !selectedEventId || !round) return;

    const submissionType = round.submissionType ?? "github_link";
    const repoUrl = workspace?.team?.githubRepoUrl;
    const url = githubUrl.trim() || repoUrl || "";

    if (submissionType === "github_link" && !url) {
      Alert.alert("Lỗi", "Vui lòng nhập link GitHub hoặc đợi BTC gán repo cho đội.");
      return;
    }
    if (submissionType === "file" && !pickedFile && !submission?.fileUrl) {
      Alert.alert("Lỗi", "Vui lòng chọn file để nộp.");
      return;
    }

    try {
      setSubmitting(true);
      await submitProject({
        eventId: selectedEventId,
        roundId: round.id,
        githubUrl: submissionType === "github_link" ? url : undefined,
        description: description.trim() || undefined,
        file: submissionType === "file" && pickedFile ? pickedFile : undefined,
      });
      setPickedFile(null);
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

  if (!workspace || !round) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
        <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Workspace</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Chưa có workspace. Đội cần được duyệt để truy cập.
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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Workspace</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.teamBanner, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.teamName, { color: colors.textPrimary }]}>{workspace.team.name}</Text>
          <Text style={[styles.teamMeta, { color: colors.textSecondary }]}>
            Vai trò: {workspace.role} · Trạng thái: {workspace.team.status}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>CÁC VÒNG THI</Text>
        <RoundTimeline
          entries={workspace.roundSubmissions}
          currentActiveRoundId={workspace.currentActiveRound?.id}
          selectedRoundId={round.id}
          onSelectRound={(id) => setSelectedRoundId(id)}
          colors={{ ...colors, success: colors.success }}
        />

        <View style={[styles.roundHero, { backgroundColor: colors.cardBg, borderColor: colors.border, marginTop: 16 }]}>
          <Text style={[styles.cardTag, { color: colors.accent }]}>
            VÒNG {round.roundNumber}
            {round.id === workspace.currentActiveRound?.id ? " · HIỆN TẠI" : ""}
          </Text>
          <Text style={[styles.roundName, { color: colors.textPrimary }]}>{round.name}</Text>
          <View style={styles.timeRow}>
            <Clock size={16} color={colors.warning} />
            <Text style={[styles.timeLeft, { color: colors.warning }]}>{timeLeft}</Text>
          </View>
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            {mapRoundStatusLabel(round.status)}
            {isReadOnly ? " · Chỉ xem" : ""}
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
                    Nộp lúc {formatDateTime(submission?.submittedAt)} · {submission?.status}
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
                    <TouchableOpacity onPress={() => Linking.openURL(submission.githubUrl!)}>
                      <Text style={[styles.detailValue, { color: colors.accent }]} numberOfLines={2}>
                        {submission.githubUrl}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : null}
                {submission?.fileUrl ? (
                  <>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary, marginTop: 10 }]}>File:</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(submission.fileUrl!)}>
                      <Text style={[styles.detailValue, { color: colors.accent }]} numberOfLines={2}>
                        {submission.fileUrl}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={[styles.alertBanner, { backgroundColor: `${colors.warning}10`, borderColor: `${colors.warning}30` }]}>
              <AlertTriangle size={18} color={colors.warning} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.alertTitle, { color: colors.warning }]}>Chưa ghi nhận bài nộp</Text>
                <Text style={[styles.alertBody, { color: colors.textSecondary }]}>
                  {activeEntry?.lockReason ?? "Vui lòng nộp bài trước deadline."}
                </Text>
              </View>
            </View>
          )}
        </View>

        {canSubmit && (
          <View style={[styles.formBox, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 12 }]}>
              NỘP BÀI (TRƯỞNG NHÓM)
            </Text>

            {(round.submissionType ?? "github_link") === "github_link" && (
              <>
                {workspace.team.githubRepoUrl ? (
                  <Text style={[styles.hint, { color: colors.textSecondary }]}>
                    Repo đội: {workspace.team.githubRepoUrl}
                  </Text>
                ) : null}
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>GitHub URL</Text>
                <TextInput
                  value={githubUrl}
                  onChangeText={setGithubUrl}
                  placeholder={workspace.team.githubRepoUrl ?? "https://github.com/org/repo"}
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="none"
                  keyboardType="url"
                  style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardElevated }]}
                />
              </>
            )}

            {(round.submissionType ?? "github_link") === "file" && (
              <>
                <Text style={[styles.hint, { color: colors.textSecondary }]}>
                  Tối đa {round.maxFileSizeMb ?? 50}MB
                </Text>
                <TouchableOpacity
                  style={[styles.fileBtn, { borderColor: colors.border, backgroundColor: colors.cardElevated }]}
                  onPress={handlePickFile}
                >
                  <Upload size={18} color={colors.accent} />
                  <Text style={[styles.fileBtnText, { color: colors.textPrimary }]}>
                    {pickedFile ? pickedFile.name : "Chọn file"}
                  </Text>
                </TouchableOpacity>
                {pickedFile ? (
                  <View style={styles.fileMeta}>
                    <FileText size={14} color={colors.textSecondary} />
                    <Text style={{ color: colors.textSecondary, fontSize: 12, marginLeft: 6 }}>
                      {(pickedFile.size ? pickedFile.size / 1024 / 1024 : 0).toFixed(2)} MB
                    </Text>
                  </View>
                ) : null}
              </>
            )}

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

        {!isLeader && teamApproved && activeEntry?.canSubmit && (
          <Text style={[styles.hint, { color: colors.textSecondary, textAlign: "center", marginTop: 8 }]}>
            Chỉ trưởng nhóm mới có thể nộp bài.
          </Text>
        )}

        <TouchableOpacity
          style={[styles.resultsLink, { borderColor: colors.border }]}
          onPress={() => router.push("/results")}
        >
          <Text style={{ color: colors.accent, fontWeight: "700" }}>Xem điểm & feedback</Text>
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
  headerTitle: { fontSize: 16, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  emptyText: { textAlign: "center", marginTop: 40, paddingHorizontal: 24 },
  teamBanner: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 12 },
  teamName: { fontSize: 18, fontWeight: "800" },
  teamMeta: { fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
  roundHero: { borderRadius: 20, borderWidth: 1, padding: 16 },
  cardTag: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  roundName: { fontSize: 20, fontWeight: "900", marginTop: 6 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  timeLeft: { fontSize: 13, fontWeight: "700" },
  statusText: { fontSize: 12, marginTop: 6 },
  progressBar: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  statusBox: { borderRadius: 20, borderWidth: 1, padding: 16, marginTop: 16 },
  submittedContainer: { gap: 12 },
  alertBanner: { flexDirection: "row", padding: 12, borderRadius: 12, borderWidth: 1, alignItems: "flex-start" },
  alertTitle: { fontSize: 14, fontWeight: "700" },
  alertBody: { fontSize: 12, marginTop: 2, lineHeight: 17 },
  detailsBlock: { borderRadius: 12, padding: 12 },
  detailLabel: { fontSize: 11, fontWeight: "700" },
  detailValue: { fontSize: 13, marginTop: 4 },
  formBox: { borderRadius: 20, borderWidth: 1, padding: 16, marginTop: 16 },
  hint: { fontSize: 12, marginBottom: 8 },
  inputLabel: { fontSize: 11, fontWeight: "700", marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  textArea: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, minHeight: 80, textAlignVertical: "top" },
  submitBtn: { marginTop: 16, paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  submitBtnText: { color: "#FFF", fontWeight: "800", fontSize: 14 },
  fileBtn: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1 },
  fileBtnText: { fontSize: 14, fontWeight: "600", flex: 1 },
  fileMeta: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  resultsLink: { marginTop: 20, padding: 14, borderWidth: 1, borderRadius: 12, alignItems: "center" },
});
