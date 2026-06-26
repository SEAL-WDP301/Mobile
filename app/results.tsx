import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, Trophy, Award, MessageSquare, Info, Star, Bookmark } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { JUDGE_RESULTS, GENERAL_STATS } from "@/constants/mockData";

const { width } = Dimensions.get("window");

export default function ResultsScreen() {
  const { isDark } = useTheme();

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    cardElevated: isDark ? "#211F1D" : "#F5F3EF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    success: "#10B981",
    info: "#06B6D4",
  };

  // Calculate average score
  const totalScore = JUDGE_RESULTS.reduce((acc, curr) => acc + curr.score, 0);
  const averageScore = (totalScore / JUDGE_RESULTS.length).toFixed(1);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* ================= HEADER ================= */}
      <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Kết quả & Nhận xét</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ================= SUMMARY SCORE CARD ================= */}
        <View style={[styles.summaryCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={[styles.summaryGlow, { backgroundColor: colors.accent, opacity: isDark ? 0.08 : 0.03 }]} />
          
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>SEAL SUMMER 2026 · ROUND 1</Text>
          <Text style={[styles.teamName, { color: colors.textPrimary }]}>Team Phoenix</Text>

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={[styles.statTitle, { color: colors.textSecondary }]}>ĐIỂM TRUNG BÌNH</Text>
              <View style={styles.scoreRow}>
                <Text style={[styles.scoreValue, { color: colors.accent }]}>{averageScore}</Text>
                <Text style={[styles.scoreMax, { color: colors.textSecondary }]}>/ 10</Text>
              </View>
            </View>
            <View style={[styles.statColDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statCol}>
              <Text style={[styles.statTitle, { color: colors.textSecondary }]}>XẾP HẠNG HIỆN TẠI</Text>
              <View style={styles.scoreRow}>
                <Trophy size={20} color={colors.warning} style={{ marginRight: 6, marginTop: 4 }} />
                <Text style={[styles.rankValue, { color: colors.textPrimary }]}>#{GENERAL_STATS.currentRank}</Text>
                <Text style={[styles.scoreMax, { color: colors.textSecondary }]}>/ {GENERAL_STATS.totalTeams}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.resultBadge, { backgroundColor: "rgba(16, 185, 129, 0.12)" }]}>
            <Text style={[styles.resultBadgeText, { color: colors.success }]}>
              ĐỦ ĐIỀU KIỆN VÀO CHUNG KẾT (TOP 16)
            </Text>
          </View>
        </View>

        {/* ================= RESEARCH BACKGROUND NOTE ================= */}
        <View style={[styles.researchBox, { backgroundColor: `${colors.info}10`, borderColor: `${colors.info}30` }]}>
          <Info size={16} color={colors.info} style={{ marginRight: 10, marginTop: 2 }} />
          <Text style={[styles.researchText, { color: colors.info }]}>
            Điểm số hiển thị là kết quả trung bình đánh giá độc lập từ Ban Giám Khảo. Dữ liệu được mã hóa phục vụ nghiên cứu khoa học về độ tin cậy liên đánh giá viên (ICC) trong Kỹ nghệ Phần mềm.
          </Text>
        </View>

        {/* ================= DETAILED CRITERIA & FEEDBACK ================= */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginLeft: 4 }]}>CHI TIẾT ĐIỂM THEO TIÊU CHÍ</Text>
        
        <View style={styles.feedbackList}>
          {JUDGE_RESULTS.map((result, idx) => (
            <View key={idx} style={[styles.feedbackCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <View style={styles.feedbackCardHeader}>
                <View style={styles.criteriaInfo}>
                  <Text style={[styles.criteriaIndex, { color: colors.accent }]}>TIÊU CHÍ 0{idx + 1}</Text>
                  <Text style={[styles.criteriaNameText, { color: colors.textPrimary }]}>{result.criterion}</Text>
                </View>
                <View style={styles.criteriaScoreBox}>
                  <Text style={[styles.criteriaScoreValue, { color: colors.accent }]}>{result.score.toFixed(1)}</Text>
                  <Text style={[styles.criteriaScoreMax, { color: colors.textSecondary }]}>/{result.maxScore}</Text>
                </View>
              </View>

              <View style={[styles.commentBox, { backgroundColor: colors.cardElevated }]}>
                <MessageSquare size={14} color={colors.accent} style={{ marginRight: 8, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.commentTitle, { color: colors.textPrimary }]}>Nhận xét của Giám khảo:</Text>
                  <Text style={[styles.commentBodyText, { color: colors.textSecondary }]}>
                    {result.comment}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  summaryCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    overflow: "hidden",
    position: "relative",
  },
  summaryGlow: {
    position: "absolute",
    right: -30,
    top: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  teamName: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statCol: {
    flex: 1,
  },
  statColDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  statTitle: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 4,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
  },
  scoreMax: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 2,
    marginBottom: 4,
  },
  rankValue: {
    fontSize: 24,
    fontWeight: "900",
  },
  resultBadge: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  resultBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  researchBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  researchText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  feedbackList: {
    gap: 14,
  },
  feedbackCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
  },
  feedbackCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  criteriaInfo: {
    flex: 1,
    marginRight: 10,
  },
  criteriaIndex: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  criteriaNameText: {
    fontSize: 14,
    fontWeight: "750",
    marginTop: 2,
    lineHeight: 18,
  },
  criteriaScoreBox: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  criteriaScoreValue: {
    fontSize: 20,
    fontWeight: "900",
  },
  criteriaScoreMax: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 2,
  },
  commentBox: {
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  commentTitle: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  commentBodyText: {
    fontSize: 12,
    lineHeight: 17,
  },
});
