import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Bell,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Calendar,
  Users,
  ChevronRight,
  QrCode,
  Info,
  Tv,
  CheckCircle2,
  Lock
} from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import {
  CURRENT_USER,
  CURRENT_ROUND,
  TIMELINE_ACTIVITIES,
  ANNOUNCEMENTS,
  MOCK_MENTOR,
  GENERAL_STATS
} from "@/constants/mockData";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { isDark } = useTheme();
  
  // Custom design colors
  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    cardElevated: isDark ? "#211F1D" : "#F5F3EF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    accentLight: "#FF8A3D",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

  // State to simulate event switching
  const [currentEvent, setCurrentEvent] = useState("SEAL Summer 2026");

  // Get next activity
  const nextActivity = TIMELINE_ACTIVITIES.find(a => a.status === "upcoming") || TIMELINE_ACTIVITIES[0];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Subtle decorative glow */}
      <View style={[styles.glowAmbient, { backgroundColor: colors.accent, opacity: isDark ? 0.06 : 0.02 }]} />

      {/* ================= TOP APP BAR ================= */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <View style={styles.topBarLeft}>
          <View style={[styles.logoWrapper, { backgroundColor: colors.accent }]}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <TouchableOpacity 
            style={styles.eventSelector} 
            activeOpacity={0.7}
            onPress={() => router.push("/event-detail")}
          >
            <Text style={[styles.eventName, { color: colors.textPrimary }]}>{currentEvent}</Text>
            <ChevronDown size={14} color={colors.textSecondary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.circleButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          activeOpacity={0.7}
          onPress={() => router.push("/notifications")}
        >
          <Bell size={18} color={colors.textPrimary} />
          <View style={[styles.badge, { backgroundColor: colors.accent }]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= GREETING HEADER ================= */}
        <View style={styles.greetingHeader}>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>Xin chào,</Text>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>{CURRENT_USER.name} 👋</Text>
          <View style={styles.roleRow}>
            <Text style={[styles.teamName, { color: colors.accent }]}>Team Phoenix</Text>
            <Text style={[styles.roleDivider, { color: colors.border }]}>|</Text>
            <Text style={[styles.roleLabel, { color: colors.textSecondary }]}>{CURRENT_USER.role}</Text>
          </View>
        </View>

        {/* ================= CURRENT ROUND CARD ================= */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.roundHeader}>
            <Text style={[styles.cardTag, { color: colors.accent }]}>{CURRENT_ROUND.label}</Text>
            <View style={[styles.statusBadge, { backgroundColor: "rgba(243, 112, 33, 0.1)" }]}>
              <Text style={[styles.statusBadgeText, { color: colors.accent }]}>{CURRENT_ROUND.status}</Text>
            </View>
          </View>

          <Text style={[styles.roundName, { color: colors.textPrimary }]}>{CURRENT_ROUND.name}</Text>
          
          <View style={styles.timeRow}>
            <Clock size={14} color={colors.warning} />
            <Text style={[styles.timeLeft, { color: colors.warning }]}>{CURRENT_ROUND.timeLeft}</Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: isDark ? "#2A2826" : "#E5E7EB" }]}>
              <View style={[styles.progressFill, { width: `${CURRENT_ROUND.progress * 100}%`, backgroundColor: colors.accent }]} />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              Hạn nộp: 23:59 · 29/06
            </Text>
          </View>

          {/* Submission status */}
          <View style={[styles.submissionStatusBox, { backgroundColor: colors.cardElevated }]}>
            {CURRENT_ROUND.submissionStatus === "Đã nộp bài" ? (
              <>
                <View style={styles.subStatusTextRow}>
                  <CheckCircle size={16} color={colors.success} style={{ marginRight: 6 }} />
                  <Text style={[styles.submissionStatusLabel, { color: colors.textPrimary }]}>
                    Trạng thái: <Text style={{ color: colors.success, fontWeight: "700" }}>Đã nộp bài</Text>
                  </Text>
                </View>
                <Text style={[styles.submissionTime, { color: colors.textSecondary }]}>
                  Nộp lúc: {CURRENT_ROUND.submissionTime}
                </Text>
              </>
            ) : (
              <>
                <View style={styles.subStatusTextRow}>
                  <AlertCircle size={16} color={colors.warning} style={{ marginRight: 6 }} />
                  <Text style={[styles.submissionStatusLabel, { color: colors.textPrimary }]}>
                    Trạng thái: <Text style={{ color: colors.warning, fontWeight: "700" }}>Chưa ghi nhận bài nộp</Text>
                  </Text>
                </View>
                <Text style={[styles.submissionNote, { color: colors.textSecondary }]}>
                  ⚠️ Vui lòng sử dụng <Text style={{ color: colors.accent, fontWeight: "600" }}>SEAL Web</Text> để nộp bài làm.
                </Text>
              </>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.cardActionBtn, { borderTopColor: colors.border }]}
            activeOpacity={0.8}
            onPress={() => router.push("/round-detail")}
          >
            <Text style={[styles.cardActionBtnText, { color: colors.textPrimary }]}>Xem chi tiết vòng thi</Text>
            <ArrowRight size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ================= NEXT ACTIVITY ================= */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>TIẾP THEO</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/schedule")}>
            <Text style={[styles.seeAllText, { color: colors.accent }]}>Xem lịch trình</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.activityHeader}>
            <View style={styles.timeTag}>
              <Clock size={12} color={colors.accent} />
              <Text style={[styles.timeTagText, { color: colors.accent }]}>{nextActivity.time}</Text>
            </View>
            <Text style={[styles.activityCountdown, { color: colors.warning }]}>
              {nextActivity.countdownText}
            </Text>
          </View>

          <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>{nextActivity.title}</Text>
          
          <View style={styles.activityMetaRow}>
            <View style={styles.metaLabelContainer}>
              <Text style={[styles.metaTypeBadge, { backgroundColor: `${colors.accent}15`, color: colors.accent }]}>
                {nextActivity.type}
              </Text>
            </View>
            <Text style={[styles.activityLocation, { color: colors.textSecondary }]}>
              📍 {nextActivity.location}
            </Text>
          </View>

          {nextActivity.type === "Mentoring" && (
            <Text style={[styles.activityMentorInfo, { color: colors.textSecondary }]}>
              Người hướng dẫn: <Text style={{ color: colors.textPrimary, fontWeight: "600" }}>{nextActivity.mentorName || MOCK_MENTOR.name}</Text>
            </Text>
          )}

          <TouchableOpacity 
            style={[styles.activityActionBtn, { backgroundColor: colors.cardElevated }]}
            activeOpacity={0.8}
            onPress={() => router.push({
              pathname: "/activity-detail",
              params: { id: nextActivity.id }
            })}
          >
            <Text style={[styles.activityActionBtnText, { color: colors.textPrimary }]}>
              {nextActivity.meetingUrl ? "Tham gia trực tuyến" : "Xem chi tiết hoạt động"}
            </Text>
            <ChevronRight size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ================= COMPETITION PROGRESS ================= */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: 24, marginBottom: 12 }]}>
          TIẾN TRÌNH CUỘC THI
        </Text>
        <View style={[styles.progressCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          {[
            { label: "Đăng ký", status: "completed" },
            { label: "Thành lập đội", status: "completed" },
            { label: "Round 1: Prototype", status: "current" },
            { label: "Round 2: Final", status: "locked" },
            { label: "Kết quả chung cuộc", status: "locked" },
          ].map((step, idx) => (
            <View key={idx} style={styles.progressStepRow}>
              <View style={styles.stepIndicatorCol}>
                <View style={[
                  styles.stepDot,
                  step.status === "completed" && { backgroundColor: colors.success },
                  step.status === "current" && { backgroundColor: colors.accent, borderWidth: 2, borderColor: colors.bg },
                  step.status === "locked" && { backgroundColor: isDark ? "#2A2826" : "#E5E7EB" }
                ]}>
                  {step.status === "completed" && <CheckCircle2 size={12} color="#FFFFFF" />}
                </View>
                {idx !== 4 && <View style={[
                  styles.stepLine,
                  { backgroundColor: step.status === "completed" ? colors.success : (isDark ? "#2A2826" : "#E5E7EB") }
                ]} />}
              </View>
              <View style={styles.stepContentCol}>
                <Text style={[
                  styles.stepLabel, 
                  { color: colors.textPrimary },
                  step.status === "current" && { color: colors.accent, fontWeight: "700" },
                  step.status === "locked" && { color: colors.textSecondary }
                ]}>
                  {step.label}
                </Text>
                <Text style={[styles.stepStatusText, { color: colors.textSecondary }]}>
                  {step.status === "completed" && "Đã hoàn thành"}
                  {step.status === "current" && "Đang diễn ra"}
                  {step.status === "locked" && "Đang khóa"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ================= TEAM STATUS CARD ================= */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: 24, marginBottom: 12 }]}>
          TRẠNG THÁI ĐỘI
        </Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.teamHeaderRow}>
            <View style={[styles.teamAvatar, { backgroundColor: colors.accent }]}>
              <Text style={styles.teamAvatarText}>TP</Text>
            </View>
            <View style={styles.teamDetailCol}>
              <Text style={[styles.teamNameText, { color: colors.textPrimary }]}>Team Phoenix</Text>
              <Text style={[styles.teamTrackText, { color: colors.textSecondary }]}>Track: AI for Education</Text>
            </View>
          </View>

          <View style={styles.teamStatsGrid}>
            <View style={styles.teamStatItem}>
              <Text style={[styles.teamStatLabel, { color: colors.textSecondary }]}>Thành viên</Text>
              <Text style={[styles.teamStatValue, { color: colors.textPrimary }]}>4 / 5</Text>
            </View>
            <View style={styles.teamStatItem}>
              <Text style={[styles.teamStatLabel, { color: colors.textSecondary }]}>Trạng thái</Text>
              <Text style={[styles.teamStatValue, { color: colors.success }]}>Đủ điều kiện</Text>
            </View>
          </View>

          <View style={styles.mentorBriefRow}>
            <Text style={[styles.mentorBriefLabel, { color: colors.textSecondary }]}>Mentor:</Text>
            <Text style={[styles.mentorBriefValue, { color: colors.textPrimary }]}>{MOCK_MENTOR.name}</Text>
          </View>

          <TouchableOpacity 
            style={[styles.activityActionBtn, { backgroundColor: colors.cardElevated, marginTop: 12 }]}
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/teams")}
          >
            <Text style={[styles.activityActionBtnText, { color: colors.textPrimary }]}>Xem chi tiết đội</Text>
            <ArrowRight size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ================= IMPORTANT ANNOUNCEMENTS ================= */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>THÔNG BÁO QUAN TRỌNG</Text>
          <TouchableOpacity onPress={() => router.push("/notifications")}>
            <Text style={[styles.seeAllText, { color: colors.accent }]}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.announcementList}>
          {ANNOUNCEMENTS.slice(0, 3).map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.announcementCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
              activeOpacity={0.85}
              onPress={() => router.push("/notifications")}
            >
              <View style={styles.announcementIconWrapper}>
                <View style={[
                  styles.announcementIconDot, 
                  { backgroundColor: item.type === "warning" ? colors.warning : (item.type === "success" ? colors.success : colors.accent) }
                ]} />
                {item.unread && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}
              </View>
              <View style={styles.announcementContent}>
                <View style={styles.announcementTitleRow}>
                  <Text style={[styles.announcementTitleText, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.announcementTimeText, { color: colors.textSecondary }]}>{item.time}</Text>
                </View>
                <Text style={[styles.announcementBodyText, { color: colors.textSecondary }]} numberOfLines={2}>
                  {item.body}
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textSecondary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ================= PARTICIPANT PASS SHORTCUT ================= */}
        <TouchableOpacity 
          style={[styles.passCard, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}
          activeOpacity={0.9}
          onPress={() => router.push("/participant-pass")}
        >
          <View style={styles.passLeft}>
            <QrCode size={24} color={colors.accent} style={{ marginRight: 12 }} />
            <View>
              <Text style={[styles.passTitle, { color: colors.textPrimary }]}>THẺ THAM GIA CUỘC THI</Text>
              <Text style={[styles.passSubtitle, { color: colors.textSecondary }]}>Mã số: {CURRENT_USER.studentId} · Team Phoenix</Text>
            </View>
          </View>
          <View style={[styles.passButton, { backgroundColor: colors.accent }]}>
            <Text style={styles.passButtonText}>QUÉT MÃ</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowAmbient: {
    position: "absolute",
    top: -100,
    left: width / 2 - 120,
    width: 240,
    height: 240,
    borderRadius: 120,
    pointerEvents: "none",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoWrapper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  eventSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventName: {
    fontSize: 15,
    fontWeight: "700",
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  greetingHeader: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 13,
    fontWeight: "500",
  },
  userName: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 2,
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  teamName: {
    fontSize: 13,
    fontWeight: "600",
  },
  roleDivider: {
    marginHorizontal: 8,
    fontSize: 12,
  },
  roleLabel: {
    fontSize: 13,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  roundHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTag: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  roundName: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  timeLeft: {
    fontSize: 13,
    fontWeight: "600",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "500",
  },
  submissionStatusBox: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  subStatusTextRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  submissionStatusLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  submissionTime: {
    fontSize: 11,
    marginLeft: 22,
  },
  submissionNote: {
    fontSize: 11,
    marginLeft: 22,
    lineHeight: 16,
  },
  cardActionBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
  },
  cardActionBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "600",
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  timeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeTagText: {
    fontSize: 13,
    fontWeight: "700",
  },
  activityCountdown: {
    fontSize: 12,
    fontWeight: "700",
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  activityMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  metaLabelContainer: {
    alignSelf: "flex-start",
  },
  metaTypeBadge: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activityLocation: {
    fontSize: 13,
  },
  activityMentorInfo: {
    fontSize: 12,
    marginTop: 4,
  },
  activityActionBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  activityActionBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  progressCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  progressStepRow: {
    flexDirection: "row",
  },
  stepIndicatorCol: {
    alignItems: "center",
    marginRight: 14,
    width: 20,
  },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
    zIndex: 1,
  },
  stepLine: {
    width: 2,
    flex: 1,
    height: 36,
    marginVertical: -2,
  },
  stepContentCol: {
    flex: 1,
    paddingBottom: 20,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  stepStatusText: {
    fontSize: 11,
    marginTop: 2,
  },
  teamHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  teamAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  teamAvatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  teamDetailCol: {
    flex: 1,
  },
  teamNameText: {
    fontSize: 16,
    fontWeight: "700",
  },
  teamTrackText: {
    fontSize: 12,
    marginTop: 2,
  },
  teamStatsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  teamStatItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
    padding: 10,
    borderRadius: 12,
  },
  teamStatLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  teamStatValue: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  mentorBriefRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.03)",
    paddingTop: 10,
  },
  mentorBriefLabel: {
    fontSize: 12,
  },
  mentorBriefValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  announcementList: {
    gap: 10,
  },
  announcementCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  announcementIconWrapper: {
    position: "relative",
    marginRight: 10,
  },
  announcementIconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  announcementTitleText: {
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  announcementTimeText: {
    fontSize: 10,
  },
  announcementBodyText: {
    fontSize: 11,
    lineHeight: 15,
  },
  passCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  passLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  passTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  passSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  passButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  passButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
});