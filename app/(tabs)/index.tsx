import React from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import {
  Bell,
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
import { useAuth } from "@/contexts/AuthContext";
import { useEventContext, useSelectedEvent } from "@/contexts/EventContext";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useTeamStatus } from "@/hooks/useTeamStatus";
import { usePublicEvent } from "@/hooks/usePublicEvent";
import { useNotifications } from "@/hooks/useNotifications";
import RoundTimeline from "@/components/student/RoundTimeline";
import { mapTeamStatusLabel } from "@/utils/eventRegistration";
import {
  computeDeadlineProgress,
  computeTimeLeft,
  formatDateTime,
  formatRelativeTime,
  getInitials,
  mapEventStatusLabel,
  mapRoundStatusLabel,
  mapTeamRoleLabel,
} from "@/utils/format";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { eventId: eventIdParam } = useLocalSearchParams<{
    eventId?: string | string[];
  }>();
  const { myEvents, selectedEventId } = useEventContext();
  const routeEventIdValue = Array.isArray(eventIdParam) ? eventIdParam[0] : eventIdParam;
  const parsedRouteEventId = routeEventIdValue
    ? Number.parseInt(routeEventIdValue, 10)
    : null;
  const routeEventId =
    parsedRouteEventId && Number.isFinite(parsedRouteEventId)
      ? parsedRouteEventId
      : null;
  const workspaceEventId = routeEventId ?? selectedEventId;
  const selectedEventFromContext = useSelectedEvent();
  const selectedEvent =
    myEvents.find((entry) => entry.event.id === workspaceEventId) ??
    (routeEventId ? null : selectedEventFromContext);
  const { data: eventDetail } = usePublicEvent(workspaceEventId);
  const { data: workspace } = useWorkspace(workspaceEventId);
  const { data: teamStatus } = useTeamStatus(workspaceEventId);
  const { unreadCount, items: notificationItems } = useNotifications();
  const eventEnded = eventDetail?.status === "closed";

  const roundSubmissions = workspace?.roundSubmissions ?? [];
  const activeEntry =
    roundSubmissions.find(
      (r) => r.round.id === workspace?.currentActiveRound?.id,
    ) ??
    (eventEnded
      ? [...roundSubmissions]
          .reverse()
          .find((entry) => entry.round.status === "results_published") ??
        roundSubmissions[roundSubmissions.length - 1]
      : roundSubmissions.find((r) => r.canSubmit)) ??
    roundSubmissions[0];

  const currentRound = activeEntry?.round;
  const currentSubmission = activeEntry?.submission;
  const team = workspace?.team ?? teamStatus?.teamInfo?.team;
  const mentor = team?.mentorAssignments?.[0]?.mentor;
  const memberCount = team?.members?.filter((m) => m.status === "accepted").length ?? 0;

  const displayName = user?.name ?? "Bạn";
  const roleLabel = workspace?.role ? mapTeamRoleLabel(workspace.role) : "Sinh viên";
  const eventName =
    eventDetail?.name ??
    selectedEvent?.event.name ??
    "Cuộc thi";
  const teamName = team?.name ?? selectedEvent?.teamName ?? "—";
  const trackName = team?.track?.name ?? "—";
  const teamInitials = getInitials(teamName);

  const roundLabel = currentRound ? `VÒNG ${currentRound.roundNumber}` : "VÒNG THI";
  const roundName = currentRound?.name ?? "Chưa có vòng thi";
  const roundStatus = currentRound ? mapRoundStatusLabel(currentRound.status) : "—";
  const timeLeft = computeTimeLeft(currentRound?.submissionDeadline);
  const roundProgress = computeDeadlineProgress(null, currentRound?.submissionDeadline);
  const hasSubmitted = !!currentSubmission;

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

  const recentNotifications = notificationItems.slice(0, 3);

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
          <View style={styles.eventSelector}>
            <Text style={[styles.eventName, { color: colors.textPrimary }]} numberOfLines={1}>
              {eventName}
            </Text>
            {eventDetail ? (
              <Text style={[styles.eventStatus, { color: eventEnded ? colors.textSecondary : colors.accent }]}>
                {mapEventStatusLabel(eventDetail.status)}
              </Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.circleButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          activeOpacity={0.7}
          onPress={() => router.push("/notifications")}
        >
          <Bell size={18} color={colors.textPrimary} />
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.accent }]}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= GREETING HEADER ================= */}
        <View style={styles.greetingHeader}>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>Xin chào,</Text>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>{displayName} 👋</Text>
          <View style={styles.roleRow}>
            <Text style={[styles.teamName, { color: colors.accent }]}>{teamName}</Text>
            <Text style={[styles.roleDivider, { color: colors.border }]}>|</Text>
            <Text style={[styles.roleLabel, { color: colors.textSecondary }]}>{roleLabel}</Text>
          </View>
        </View>

        {/* ================= CURRENT ROUND CARD ================= */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.roundHeader}>
            <Text style={[styles.cardTag, { color: colors.accent }]}>{roundLabel}</Text>
            <View style={[styles.statusBadge, { backgroundColor: "rgba(243, 112, 33, 0.1)" }]}>
              <Text style={[styles.statusBadgeText, { color: colors.accent }]}>{roundStatus}</Text>
            </View>
          </View>

          <Text style={[styles.roundName, { color: colors.textPrimary }]}>
            {eventEnded ? `${eventName} đã kết thúc` : roundName}
          </Text>
          
          <View style={styles.timeRow}>
            <Clock size={14} color={eventEnded ? colors.textSecondary : colors.warning} />
            <Text style={[styles.timeLeft, { color: eventEnded ? colors.textSecondary : colors.warning }]}>
              {eventEnded
                ? `Kết thúc: ${formatDateTime(eventDetail?.endDate ?? eventDetail?.end_date)}`
                : timeLeft}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: isDark ? "#2A2826" : "#E5E7EB" }]}>
              <View style={[styles.progressFill, { width: `${roundProgress * 100}%`, backgroundColor: colors.accent }]} />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {currentRound?.submissionDeadline
                ? `Hạn nộp: ${formatDateTime(currentRound.submissionDeadline)}`
                : "Chưa có deadline"}
            </Text>
          </View>

          <View style={[styles.submissionStatusBox, { backgroundColor: colors.cardElevated }]}>
            {hasSubmitted ? (
              <>
                <View style={styles.subStatusTextRow}>
                  <CheckCircle size={16} color={colors.success} style={{ marginRight: 6 }} />
                  <Text style={[styles.submissionStatusLabel, { color: colors.textPrimary }]}>
                    Trạng thái: <Text style={{ color: colors.success, fontWeight: "700" }}>Đã nộp bài</Text>
                  </Text>
                </View>
                <Text style={[styles.submissionTime, { color: colors.textSecondary }]}>
                  Nộp lúc: {formatDateTime(currentSubmission?.submittedAt)}
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
                  Vào màn chi tiết vòng thi để nộp hoặc cập nhật bài làm.
                </Text>
              </>
            )}
          </View>

          <TouchableOpacity
            style={[styles.cardActionBtn, { borderTopColor: colors.border }]}
            activeOpacity={0.8}
            onPress={() =>
              eventEnded
                ? router.push({
                    pathname: "/event-detail",
                    params: { id: String(workspaceEventId) },
                  })
                : router.push({
                    pathname: "/round-detail",
                    params: { eventId: String(workspaceEventId) },
                  })
            }
          >
            <Text style={[styles.cardActionBtnText, { color: colors.textPrimary }]}>
              {eventEnded ? "Xem thông tin & kết quả" : "Xem chi tiết vòng thi"}
            </Text>
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
              <Calendar size={12} color={colors.accent} />
              <Text style={[styles.timeTagText, { color: colors.accent }]}>Lịch trình</Text>
            </View>
          </View>

          <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>
            Chưa có hoạt động sắp tới
          </Text>
          <Text style={[styles.activityLocation, { color: colors.textSecondary, marginTop: 8 }]}>
            Lịch trình sự kiện sẽ hiển thị khi BTC cập nhật trên hệ thống.
          </Text>

          <TouchableOpacity
            style={[styles.activityActionBtn, { backgroundColor: colors.cardElevated }]}
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/schedule")}
          >
            <Text style={[styles.activityActionBtnText, { color: colors.textPrimary }]}>
              Xem lịch trình
            </Text>
            <ChevronRight size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ================= COMPETITION PROGRESS ================= */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: 24, marginBottom: 12 }]}>
          TIẾN TRÌNH CUỘC THI
        </Text>
        {workspace?.roundSubmissions?.length ? (
          <RoundTimeline
            entries={workspace.roundSubmissions}
            currentActiveRoundId={workspace.currentActiveRound?.id}
            onSelectRound={(roundId) => router.push(`/round-detail?roundId=${roundId}`)}
            colors={{ ...colors, isDark }}
          />
        ) : (
          <View style={[styles.progressCard, { backgroundColor: colors.cardBg, borderColor: colors.border, padding: 20 }]}>
            <Text style={[styles.stepStatusText, { color: colors.textSecondary, textAlign: "center" }]}>
              Tiến trình vòng thi sẽ hiển thị khi đội được duyệt và có workspace.
            </Text>
          </View>
        )}

        {/* ================= TEAM STATUS CARD ================= */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: 24, marginBottom: 12 }]}>
          TRẠNG THÁI ĐỘI
        </Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.teamHeaderRow}>
            <View style={[styles.teamAvatar, { backgroundColor: colors.accent }]}>
              <Text style={[styles.teamAvatarText, { color: "#FFFFFF" }]}>{teamInitials}</Text>
            </View>
            <View style={styles.teamDetailCol}>
              <Text style={[styles.teamNameText, { color: colors.textPrimary }]}>{teamName}</Text>
              <Text style={[styles.teamTrackText, { color: colors.textSecondary }]}>Track: {trackName}</Text>
            </View>
          </View>

          <View style={styles.teamStatsGrid}>
            <View style={styles.teamStatItem}>
              <Text style={[styles.teamStatLabel, { color: colors.textSecondary }]}>Thành viên</Text>
              <Text style={[styles.teamStatValue, { color: colors.textPrimary }]}>{memberCount || "—"}</Text>
            </View>
            <View style={styles.teamStatItem}>
              <Text style={[styles.teamStatLabel, { color: colors.textSecondary }]}>Trạng thái</Text>
              <Text style={[styles.teamStatValue, { color: colors.success }]}>
                {mapTeamStatusLabel(team?.status)}
              </Text>
            </View>
          </View>

          <View style={styles.mentorBriefRow}>
            <Text style={[styles.mentorBriefLabel, { color: colors.textSecondary }]}>Mentor:</Text>
            <Text style={[styles.mentorBriefValue, { color: colors.textPrimary }]}>
              {mentor?.name ?? "Chưa phân công"}
            </Text>
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
          {recentNotifications.length === 0 ? (
            <View style={[styles.announcementCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Text style={[styles.announcementBodyText, { color: colors.textSecondary, padding: 4 }]}>
                Chưa có thông báo nào.
              </Text>
            </View>
          ) : (
            recentNotifications.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.announcementCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
              activeOpacity={0.85}
              onPress={() => router.push("/notifications")}
            >
              <View style={styles.announcementIconWrapper}>
                <View style={[styles.announcementIconDot, { backgroundColor: colors.accent }]} />
                {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}
              </View>
              <View style={styles.announcementContent}>
                <View style={styles.announcementTitleRow}>
                  <Text style={[styles.announcementTitleText, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.announcementTimeText, { color: colors.textSecondary }]}>
                    {formatRelativeTime(item.createdAt)}
                  </Text>
                </View>
                <Text style={[styles.announcementBodyText, { color: colors.textSecondary }]} numberOfLines={2}>
                  {item.content}
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textSecondary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )))}
        </View>

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
    flex: 1,
    minWidth: 0,
    marginRight: 12,
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
    flex: 1,
    minWidth: 0,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  eventName: {
    fontSize: 15,
    fontWeight: "700",
    width: "100%",
  },
  eventStatus: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.4,
    marginTop: 1,
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
    top: -5,
    right: -6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
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
