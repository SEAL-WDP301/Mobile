import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Calendar, ChevronRight } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { useEventContext } from "@/contexts/EventContext";
import { useWorkspace } from "@/hooks/useWorkspace";
import RoundTimeline from "@/components/student/RoundTimeline";
import { computeTimeLeft, formatDateTime } from "@/utils/format";

export default function ScheduleScreen() {
  const { isDark } = useTheme();
  const { selectedEventId } = useEventContext();
  const { data: workspace, loading, error } = useWorkspace(selectedEventId);

  const entries = workspace?.roundSubmissions ?? [];
  const currentRound = workspace?.currentActiveRound;
  const nextDeadline = entries.find((e) => e.canSubmit)?.round?.submissionDeadline;

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    success: "#10B981",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    isDark,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Lịch trình</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Timeline các vòng thi (từ workspace đội)
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
      ) : !selectedEventId || !workspace ? (
        <View style={[styles.emptyContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Calendar size={36} color={colors.accent} style={{ marginBottom: 16 }} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            {error ? "Không tải được lịch trình" : "Chưa có lịch trình"}
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {error ??
              "Tham gia đội và được duyệt để xem timeline các vòng thi. Lịch mentor meeting/workshop chưa có trên hệ thống."}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.summaryCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>TỔNG QUAN</Text>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
              {entries.length} vòng thi
            </Text>
            {currentRound ? (
              <Text style={[styles.summaryMeta, { color: colors.accent }]}>
                Vòng hiện tại: {currentRound.name}
              </Text>
            ) : null}
            {nextDeadline ? (
              <Text style={[styles.summaryMeta, { color: colors.textSecondary }]}>
                Deadline sắp tới: {formatDateTime(nextDeadline)} ({computeTimeLeft(nextDeadline)})
              </Text>
            ) : null}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>CÁC VÒNG THI</Text>
          <RoundTimeline
            entries={entries}
            currentActiveRoundId={currentRound?.id}
            onSelectRound={(roundId) => router.push(`/round-detail?roundId=${roundId}`)}
            colors={colors}
          />

          {entries.map((entry) => (
            <TouchableOpacity
              key={`detail-${entry.round.id}`}
              style={[styles.roundDetailLink, { borderColor: colors.border }]}
              onPress={() => entry.canView && router.push(`/round-detail?roundId=${entry.round.id}`)}
              disabled={!entry.canView}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.linkTitle, { color: colors.textPrimary }]}>
                  {entry.round.name}
                </Text>
                {entry.round.startDate ? (
                  <Text style={[styles.linkMeta, { color: colors.textSecondary }]}>
                    Bắt đầu: {formatDateTime(entry.round.startDate)}
                  </Text>
                ) : null}
                {entry.round.endDate ? (
                  <Text style={[styles.linkMeta, { color: colors.textSecondary }]}>
                    Kết thúc: {formatDateTime(entry.round.endDate)}
                  </Text>
                ) : null}
              </View>
              {entry.canView && <ChevronRight size={18} color={colors.textSecondary} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  headerSubtitle: { fontSize: 13, marginTop: 4 },
  scroll: { paddingHorizontal: 16, paddingBottom: 100, gap: 12 },
  emptyContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 20,
    borderWidth: 1,
    padding: 40,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  emptyText: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  summaryCard: { borderRadius: 16, borderWidth: 1, padding: 16 },
  summaryLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  summaryValue: { fontSize: 20, fontWeight: "900", marginTop: 4 },
  summaryMeta: { fontSize: 12, marginTop: 6 },
  sectionTitle: { fontSize: 11, fontWeight: "800", letterSpacing: 1, marginTop: 8 },
  roundDetailLink: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 4,
  },
  linkTitle: { fontSize: 14, fontWeight: "600" },
  linkMeta: { fontSize: 11, marginTop: 2 },
});
