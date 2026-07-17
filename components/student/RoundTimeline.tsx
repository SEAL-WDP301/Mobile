import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CheckCircle2, Lock, Circle } from "lucide-react-native";
import type { RoundSubmissionEntry } from "@/types/api";
import { formatDateTime } from "@/utils/format";
import { mapTeamRoundStatusLabel } from "@/utils/eventRegistration";

interface RoundTimelineProps {
  entries: RoundSubmissionEntry[];
  currentActiveRoundId?: number | null;
  selectedRoundId?: number | null;
  onSelectRound?: (roundId: number) => void;
  colors: {
    cardBg: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    success: string;
    border: string;
    isDark: boolean;
  };
}

export default function RoundTimeline({
  entries,
  currentActiveRoundId,
  selectedRoundId,
  onSelectRound,
  colors,
}: RoundTimelineProps) {
  if (entries.length === 0) {
    return (
      <Text style={[styles.empty, { color: colors.textSecondary }]}>
        Chưa có vòng thi nào.
      </Text>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      {entries.map((entry, idx) => {
        const isCurrent = entry.round.id === currentActiveRoundId;
        const isSelected = entry.round.id === selectedRoundId;
        const isPast =
          entry.round.status === "closed" ||
          entry.round.status === "results_published";
        const teamStatus = entry.teamRound?.status;
        const eliminated = teamStatus === "eliminated";
        const canNavigate = entry.canView && !eliminated;

        const stepStatus = eliminated
          ? "eliminated"
          : isCurrent
            ? "current"
            : isPast
              ? "completed"
              : entry.canSubmit
                ? "current"
                : "locked";

        const RowWrapper = onSelectRound && canNavigate ? TouchableOpacity : View;

        return (
          <RowWrapper
            key={entry.round.id}
            style={[
              styles.row,
              idx !== entries.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              isSelected && { backgroundColor: `${colors.accent}08` },
            ]}
            {...(onSelectRound && canNavigate
              ? { onPress: () => onSelectRound(entry.round.id), activeOpacity: 0.8 }
              : {})}
          >
            <View style={styles.indicatorCol}>
              <View
                style={[
                  styles.dot,
                  stepStatus === "completed" && { backgroundColor: colors.success },
                  stepStatus === "current" && { backgroundColor: colors.accent },
                  stepStatus === "locked" && {
                    backgroundColor: colors.isDark ? "#2A2826" : "#E5E7EB",
                  },
                  stepStatus === "eliminated" && { backgroundColor: "#EF4444" },
                ]}
              >
                {stepStatus === "completed" && <CheckCircle2 size={10} color="#FFF" />}
                {stepStatus === "locked" && <Lock size={8} color={colors.textSecondary} />}
                {stepStatus === "eliminated" && <Circle size={8} color="#FFF" />}
              </View>
              {idx !== entries.length - 1 && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor:
                        stepStatus === "completed" ? colors.success : colors.isDark ? "#2A2826" : "#E5E7EB",
                    },
                  ]}
                />
              )}
            </View>

            <View style={styles.contentCol}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.roundName,
                    { color: colors.textPrimary },
                    isCurrent && { color: colors.accent, fontWeight: "800" },
                  ]}
                >
                  Vòng {entry.round.roundNumber}: {entry.round.name}
                </Text>
                {isCurrent && (
                  <View style={[styles.badge, { backgroundColor: `${colors.accent}20` }]}>
                    <Text style={[styles.badgeText, { color: colors.accent }]}>HIỆN TẠI</Text>
                  </View>
                )}
              </View>

              {entry.round.submissionDeadline ? (
                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  Hạn nộp: {formatDateTime(entry.round.submissionDeadline)}
                </Text>
              ) : null}

              {teamStatus ? (
                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  Trạng thái đội: {mapTeamRoundStatusLabel(teamStatus)}
                  {entry.teamRound?.score != null
                    ? ` · Điểm: ${Number(entry.teamRound.score).toFixed(1)}`
                    : ""}
                </Text>
              ) : null}

              {entry.lockReason && !entry.canSubmit ? (
                <Text style={[styles.lockReason, { color: colors.textSecondary }]} numberOfLines={2}>
                  {entry.lockReason}
                </Text>
              ) : null}
            </View>
          </RowWrapper>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  empty: { fontSize: 13, padding: 16 },
  row: { flexDirection: "row", padding: 14 },
  indicatorCol: { width: 24, alignItems: "center" },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  line: { width: 2, flex: 1, minHeight: 20, marginTop: 4 },
  contentCol: { flex: 1, marginLeft: 10 },
  titleRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6 },
  roundName: { fontSize: 14, fontWeight: "600", flex: 1 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 9, fontWeight: "800" },
  meta: { fontSize: 12, marginTop: 4 },
  lockReason: { fontSize: 11, marginTop: 4, fontStyle: "italic" },
});
