import React, { useEffect, useState } from "react";
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
import {
  Crown,
  Users,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Info,
} from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useEventContext } from "@/contexts/EventContext";
import { useTeamStatus } from "@/hooks/useTeamStatus";
import { useWorkspace } from "@/hooks/useWorkspace";
import { usePendingInvitations } from "@/hooks/usePendingInvitations";
import { usePublicEvents } from "@/hooks/usePublicEvents";
import { getInitials, mapTeamRoleLabel } from "@/utils/format";
import { getPublicEventById } from "@/services/api/events";
import TeamManageModal from "@/components/student/TeamManageModal";
import type { PublicEvent } from "@/types/api";

const { width } = Dimensions.get("window");

export default function TeamsScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { selectedEventId } = useEventContext();
  const { data: teamStatus, loading, refresh: refreshTeamStatus } = useTeamStatus(selectedEventId);
  const { data: workspace, refresh: refreshWorkspace } = useWorkspace(selectedEventId);
  const { items: invitations, loading: loadingInvites, accept, reject } = usePendingInvitations();
  const { events: publicEvents } = usePublicEvents();
  const [showManageModal, setShowManageModal] = useState(false);
  const [eventDetail, setEventDetail] = useState<PublicEvent | null>(null);

  const team = teamStatus?.teamInfo?.team;
  const isLeader = teamStatus?.teamInfo?.role === "leader";
  const hasTeam = !!team;
  const acceptedMembers = team?.members?.filter((m) => m.status === "accepted") ?? [];
  const pendingMembers = team?.members?.filter((m) => m.status === "pending") ?? [];
  const members = acceptedMembers;
  const maxMembersPerTeam = team?.track?.maxMembersPerTeam;
  const selectedPublicEvent = publicEvents.find((e) => e.id === selectedEventId);
  const eventMaxTeamSize = selectedPublicEvent?.tracks?.reduce(
    (max, track) => Math.max(max, track.maxMembersPerTeam ?? 0),
    0,
  );
  const mentor = team?.mentorAssignments?.[0]?.mentor;
  const mentorProfile = mentor?.stakeholderProfile;
  const teamName = team?.name ?? "—";
  const trackName = team?.track?.name ?? "—";
  const teamInitials = getInitials(teamName);
  const isApproved = team?.status === "approved";
  const hasSubmission = !!workspace?.latestSubmission;

  useEffect(() => {
    if (!selectedEventId) {
      setEventDetail(null);
      return;
    }
    getPublicEventById(selectedEventId)
      .then(setEventDetail)
      .catch(() => setEventDetail(null));
  }, [selectedEventId]);

  const checklistItems = [
    {
      label: maxMembersPerTeam
        ? `Số thành viên (tối đa ${maxMembersPerTeam})`
        : "Số thành viên trong đội",
      status: maxMembersPerTeam ? members.length > 0 && members.length <= maxMembersPerTeam : members.length > 0,
    },
    { label: "Tất cả thành viên đã xác nhận", status: members.every((m) => m.status === "accepted") },
    { label: `Đã chọn track thi đấu (${trackName})`, status: !!team?.track },
    { label: "Hồ sơ đội thi hợp lệ", status: isApproved },
    { label: "Đã nộp bài giải pháp", status: hasSubmission },
  ];

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
    error: "#EF4444",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Screen Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Đội nhóm</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Quản lý thông tin và tiến độ của đội</Text>
        </View>
        {!loadingInvites && invitations.length > 0 && (
          <View style={[styles.inviteBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.inviteBadgeText}>{invitations.length}</Text>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {hasTeam ? (
          <View style={styles.teamContent}>
            {/* ================= TEAM OVERVIEW ================= */}
            <View style={[styles.teamCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <View style={styles.teamCardHeader}>
                <View style={[styles.teamAvatar, { backgroundColor: colors.accent }]}>
                  <Text style={styles.teamAvatarText}>{teamInitials}</Text>
                </View>
                <View style={styles.teamCardDetails}>
                  <View style={styles.teamNameRow}>
                    <Text style={[styles.teamName, { color: colors.textPrimary }]}>{teamName}</Text>
                    <Crown size={16} color={colors.accent} style={{ marginLeft: 6 }} />
                  </View>
                  <Text style={[styles.teamTrack, { color: colors.textSecondary }]}>
                    {trackName} · {members.length} thành viên
                  </Text>
                  <View style={styles.badgeRow}>
                    <View style={[styles.statusBadge, { backgroundColor: `${isApproved ? colors.success : colors.warning}15` }]}>
                      <Text style={[styles.statusBadgeText, { color: isApproved ? colors.success : colors.warning }]}>
                        {team?.status?.toUpperCase() ?? "PENDING"}
                      </Text>
                    </View>
                    <Text style={[styles.teamCodeText, { color: colors.textSecondary }]}>
                      ID: <Text style={{ color: colors.textPrimary, fontWeight: "700" }}>{team?.id ?? "—"}</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* ================= TEAM PROGRESS ================= */}
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>TIẾN ĐỘ & ĐIỀU KIỆN ĐỘI</Text>
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              {checklistItems.map((item, idx) => (
                <View key={idx} style={styles.checkRow}>
                  {item.status ? (
                    <CheckCircle size={16} color={colors.success} style={{ marginRight: 10 }} />
                  ) : (
                    <AlertCircle size={16} color={colors.warning} style={{ marginRight: 10 }} />
                  )}
                  <Text style={[styles.checkLabel, { color: colors.textPrimary }]}>{item.label}</Text>
                </View>
              ))}
            </View>

            {/* ================= MEMBERS ================= */}
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>THÀNH VIÊN ({members.length})</Text>
            <View style={[styles.membersCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              {members.map((member, idx) => {
                const isYou = member.user.email === user?.email;
                const initials = getInitials(member.user.name);
                const isLeader = member.role === "leader";
                return (
                <View 
                  key={idx} 
                  style={[
                    styles.memberRow, 
                    idx !== members.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                  ]}
                >
                  <View style={styles.memberAvatarWrapper}>
                    <View style={[styles.memberAvatar, { backgroundColor: colors.cardElevated }]}>
                      <Text style={[styles.memberAvatarText, { color: colors.textPrimary }]}>{initials}</Text>
                    </View>
                  </View>

                  <View style={styles.memberInfo}>
                    <View style={styles.memberNameRow}>
                      <Text style={[styles.memberName, { color: colors.textPrimary }]}>{member.user.name}</Text>
                      {isYou && (
                        <View style={[styles.youBadge, { backgroundColor: `${colors.accent}15` }]}>
                          <Text style={[styles.youBadgeText, { color: colors.accent }]}>BẠN</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.memberSubText, { color: colors.textSecondary }]}>
                      {mapTeamRoleLabel(member.role)} · {member.user.email}
                    </Text>
                  </View>

                  {isLeader && (
                    <Crown size={14} color={colors.accent} />
                  )}
                </View>
              );})}
            </View>

            {/* ================= PENDING MEMBERS ================= */}
            {pendingMembers.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  ĐANG CHỜ XÁC NHẬN ({pendingMembers.length})
                </Text>
                <View style={[styles.membersCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                  {pendingMembers.map((member, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.memberRow,
                        idx !== pendingMembers.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: colors.border,
                        },
                      ]}
                    >
                      <View style={styles.memberInfo}>
                        <Text style={[styles.memberName, { color: colors.textPrimary }]}>
                          {member.user.name}
                        </Text>
                        <Text style={[styles.memberSubText, { color: colors.textSecondary }]}>
                          {member.user.email} · Chờ phản hồi
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* ================= LEADER ACTIONS ================= */}
            {isLeader && (
              <TouchableOpacity
                style={[styles.ctaPrimary, { backgroundColor: colors.accent, marginBottom: 8 }]}
                activeOpacity={0.85}
                onPress={() => setShowManageModal(true)}
              >
                <Text style={styles.ctaPrimaryText}>Quản lý đội (mời/xóa thành viên)</Text>
              </TouchableOpacity>
            )}

            {!isLeader && (
              <View style={[styles.warningBox, { backgroundColor: `${colors.warning}10`, borderColor: `${colors.warning}30` }]}>
                <Info size={16} color={colors.warning} style={{ marginRight: 10, marginTop: 2 }} />
                <Text style={[styles.warningText, { color: colors.warning }]}>
                  Chỉ trưởng nhóm mới có thể mời/xóa thành viên hoặc chuyển quyền leader.
                </Text>
              </View>
            )}

            {/* ================= MENTOR CARD ================= */}
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>MENTOR CỦA ĐỘI</Text>
            {mentor ? (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <View style={styles.mentorHeader}>
                <View style={[styles.mentorAvatarLarge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.mentorAvatarTextLarge}>{getInitials(mentor.name)}</Text>
                </View>
                <View style={styles.mentorDetails}>
                  <View style={styles.mentorNameRow}>
                    <Text style={[styles.mentorNameText, { color: colors.textPrimary }]}>{mentor.name}</Text>
                  </View>
                  <Text style={[styles.mentorPosition, { color: colors.textSecondary }]}>
                    {mentorProfile?.jobTitle ?? "Mentor"} · {mentorProfile?.organization ?? ""}
                  </Text>
                </View>
              </View>

              {mentorProfile?.bio ? (
                <Text style={[styles.mentorPosition, { color: colors.textSecondary, marginTop: 8 }]}>
                  {mentorProfile.bio}
                </Text>
              ) : null}

              <TouchableOpacity 
                style={[styles.activityActionBtn, { backgroundColor: colors.cardElevated, marginTop: 12 }]}
                activeOpacity={0.8}
                onPress={() => router.push("/mentor-chat")}
              >
                <Text style={[styles.activityActionBtnText, { color: colors.textPrimary }]}>Chat với mentor</Text>
                <ChevronRight size={16} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            ) : (
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary, marginBottom: 16 }]}>
                Chưa có mentor được phân công.
              </Text>
            )}

            {/* ================= ACTIONS ================= */}
            <View style={styles.actionsRow}>
              <TouchableOpacity 
                style={[styles.actionBtnOutline, { borderColor: colors.border, flex: 1 }]}
                activeOpacity={0.7}
                onPress={() => router.push("/team-chat")}
              >
                <MessageSquare size={16} color={colors.textPrimary} style={{ marginRight: 8 }} />
                <Text style={[styles.actionBtnOutlineText, { color: colors.textPrimary }]}>Chat đội</Text>
              </TouchableOpacity>

              {mentor ? (
                <TouchableOpacity
                  style={[styles.actionBtnOutline, { borderColor: colors.border, flex: 1 }]}
                  activeOpacity={0.7}
                  onPress={() => router.push("/mentor-chat")}
                >
                  <MessageSquare size={16} color={colors.accent} style={{ marginRight: 8 }} />
                  <Text style={[styles.actionBtnOutlineText, { color: colors.textPrimary }]}>Chat mentor</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {isApproved && (
              <TouchableOpacity
                style={[styles.actionBtnOutline, { borderColor: colors.border, marginTop: 8 }]}
                activeOpacity={0.7}
                onPress={() => router.push("/round-detail")}
              >
                <ShieldCheck size={16} color={colors.textPrimary} style={{ marginRight: 8 }} />
                <Text style={[styles.actionBtnOutlineText, { color: colors.textPrimary }]}>Vào workspace</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          /* ================= NO TEAM STATE ================= */
          <View style={[styles.noTeamContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={[styles.noTeamIconWrapper, { backgroundColor: `${colors.accent}15` }]}>
              <Users size={32} color={colors.accent} />
            </View>
            <Text style={[styles.noTeamTitle, { color: colors.textPrimary }]}>Bạn chưa có đội thi</Text>
            <Text style={[styles.noTeamSubtitle, { color: colors.textSecondary }]}>
              {eventMaxTeamSize
                ? `Hãy tạo hoặc tham gia đội để tiếp tục (tối đa ${eventMaxTeamSize} thành viên/track).`
                : "Hãy tạo hoặc tham gia đội để tiếp tục tham gia cuộc thi."}
            </Text>

            <TouchableOpacity 
              style={[styles.ctaPrimary, { backgroundColor: colors.accent }]}
              activeOpacity={0.8}
              onPress={() => {
                if (selectedEventId) {
                  router.push(`/event-register?id=${selectedEventId}`);
                  return;
                }
                router.push("/(tabs)/competitions");
              }}
            >
              <Text style={styles.ctaPrimaryText}>Đăng ký đội thi</Text>
            </TouchableOpacity>

            <View style={styles.noTeamFooter}>
              {loadingInvites ? null : invitations.length > 0 ? (
                <View style={[styles.inviteCard, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
                  <Text style={[styles.inviteTitle, { color: colors.textPrimary }]}>Lời mời tham gia đội</Text>
                  {invitations.map((inv) => (
                    <View key={inv.teamId} style={styles.inviteRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.inviteTeam, { color: colors.textPrimary }]}>{inv.teamName}</Text>
                        <Text style={[styles.inviteMeta, { color: colors.textSecondary }]}>
                          {inv.eventName} · Trưởng nhóm: {inv.leaderName}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.inviteAccept, { backgroundColor: colors.accent }]}
                        onPress={async () => {
                          await accept(inv.teamId);
                          await refreshTeamStatus();
                          await refreshWorkspace();
                        }}
                      >
                        <Text style={styles.inviteBtnText}>Nhận</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.inviteReject, { borderColor: colors.border }]}
                        onPress={() => reject(inv.teamId)}
                      >
                        <Text style={[styles.inviteRejectText, { color: colors.textSecondary }]}>Từ chối</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[styles.noTeamFooterText, { color: colors.textSecondary }]}>
                  Chưa có lời mời tham gia đội nào.
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {team && selectedEventId ? (
        <TeamManageModal
          visible={showManageModal}
          onClose={() => setShowManageModal(false)}
          eventId={selectedEventId}
          event={eventDetail}
          team={team}
          isLeader={isLeader}
          onSuccess={async () => {
            await refreshTeamStatus();
            await refreshWorkspace();
          }}
          colors={{
            cardBg: colors.cardBg,
            textPrimary: colors.textPrimary,
            textSecondary: colors.textSecondary,
            accent: colors.accent,
            border: colors.border,
            cardElevated: colors.cardElevated,
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  inviteBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  inviteBadgeText: { color: "#FFF", fontSize: 12, fontWeight: "800" },
  demoBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  demoBtnText: {
    fontSize: 9,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },
  teamContent: {
    gap: 16,
  },
  teamCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  teamCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  teamAvatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  teamAvatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  teamCardDetails: {
    flex: 1,
  },
  teamNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamName: {
    fontSize: 18,
    fontWeight: "800",
  },
  teamTrack: {
    fontSize: 12,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: "800",
  },
  teamCodeText: {
    fontSize: 11,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 10,
    marginBottom: -4,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  membersCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  memberAvatarWrapper: {
    position: "relative",
    marginRight: 12,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  memberAvatarText: {
    fontSize: 13,
    fontWeight: "700",
  },
  statusDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  memberName: {
    fontSize: 14,
    fontWeight: "600",
  },
  youBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  youBadgeText: {
    fontSize: 8,
    fontWeight: "800",
  },
  memberSubText: {
    fontSize: 11,
    marginTop: 2,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  warningText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  mentorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  mentorAvatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mentorAvatarTextLarge: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  mentorDetails: {
    flex: 1,
  },
  mentorNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mentorNameText: {
    fontSize: 15,
    fontWeight: "700",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
  },
  mentorPosition: {
    fontSize: 12,
    marginTop: 2,
  },
  mentorExpertiseContainer: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
  },
  expertBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  expertBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  appointmentBox: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
  },
  appointmentLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  appointmentValue: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  activityActionBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
  },
  activityActionBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    marginBottom: 10,
  },
  actionBtnOutline: {
    flex: 1.2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionBtnOutlineText: {
    fontSize: 13,
    fontWeight: "700",
  },
  actionBtnDanger: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  actionBtnDangerText: {
    fontSize: 13,
    fontWeight: "700",
  },
  noTeamContainer: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    marginTop: 20,
  },
  noTeamIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  noTeamTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  noTeamSubtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
  },
  ctaPrimary: {
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  ctaPrimaryText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
  noTeamFooter: {
    marginTop: 16,
    width: "100%",
  },
  noTeamFooterText: {
    fontSize: 11,
    textAlign: "center",
  },
  inviteCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  inviteTitle: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  inviteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inviteTeam: { fontSize: 14, fontWeight: "700" },
  inviteMeta: { fontSize: 11, marginTop: 2 },
  inviteAccept: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  inviteBtnText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  inviteReject: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  inviteRejectText: { fontSize: 11, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  modalBodyText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
  },
  modalActionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  modalBtnCancel: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBtnCancelText: {
    fontSize: 13,
    fontWeight: "700",
  },
  modalBtnConfirm: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBtnConfirmText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
