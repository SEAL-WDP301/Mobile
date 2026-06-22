import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  StatusBar,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Crown,
  Sparkles,
  Shield,
  Trophy,
  UserPlus,
  MessageSquare,
  LogOut,
  Plus,
  Mail,
  X,
  Users
} from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";

const { width } = Dimensions.get("window");

const MEMBERS = [
  { name: "John Nguyen", role: "Team Lead", uni: "FPT University HCM", status: "Online", you: true, initials: "JN" },
  { name: "Linh Tran", role: "Backend", uni: "FPT University HN", status: "Online", initials: "LT" },
  { name: "Minh Pham", role: "Frontend", uni: "FPT University DN", status: "Idle", initials: "MP" },
  { name: "Anh Le", role: "ML Engineer", uni: "FPT University HCM", status: "Offline", initials: "AL" },
  { name: "Hoa Vu", role: "Designer", uni: "FPT University HN", status: "Online", initials: "HV" },
];

export default function TeamsScreen() {
  const { isDark } = useTheme();
  const [hasTeam, setHasTeam] = useState(true);
  const [modalKind, setModalKind] = useState<null | "create" | "join">(null);

  const colors = {
    bg: isDark ? "#0C0A09" : "#F9F6F0",
    cardBg: isDark ? "rgba(20, 17, 15, 0.75)" : "rgba(255, 255, 255, 0.95)",
    cardBorder: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.05)",
    textPrimary: isDark ? "#FFFFFF" : "#1C1917",
    textSecondary: isDark ? "#A39690" : "#78716C",
    textMuted: isDark ? "#57534E" : "#A8A29E",
    accent: "#f37021",
    subAccent: "#ff9248",
    inputBg: isDark ? "#0C0A09" : "#FFFFFF",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Screen Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My Team</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Sprint 2 · qualifying round</Text>
        </View>
        <TouchableOpacity onPress={() => setHasTeam(!hasTeam)}>
          <Text style={[styles.demoToggle, { color: colors.textMuted }]}>demo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {hasTeam ? (
          <View style={styles.teamContent}>
            {/* ================= TEAM HEADER CARD ================= */}
            <View style={[styles.teamCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              {/* Glow background accent */}
              <View style={[styles.cardGlow, { backgroundColor: colors.accent, opacity: isDark ? 0.1 : 0.03 }]} />

              <View style={styles.teamCardInfo}>
                <View style={[styles.teamAvatar, { backgroundColor: colors.accent }]}>
                  <Text style={styles.teamAvatarText}>QD</Text>
                </View>
                <View style={styles.teamDetails}>
                  <View style={styles.teamNameRow}>
                    <Text style={[styles.teamName, { color: colors.textPrimary }]}>Quantum Drift</Text>
                    <Crown size={16} color={colors.accent} style={{ marginLeft: 6 }} />
                  </View>
                  <Text style={[styles.teamMeta, { color: colors.textSecondary }]}>
                    AI Infrastructure · 5 members
                  </Text>
                  <View style={styles.teamTags}>
                    <View style={[styles.tagBadge, { backgroundColor: `${colors.accent}15` }]}>
                      <Text style={[styles.tagText, { color: colors.accent }]}>RANK #12</Text>
                    </View>
                    <View style={[styles.tagBadge, { backgroundColor: isDark ? "#292524" : "#E7E5E4" }]}>
                      <Text style={[styles.tagText, { color: colors.textPrimary }]}>ROUND 2</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* ================= PROGRESS TILES ================= */}
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginVertical: 12 }]}>Team progress</Text>
            <View style={styles.progressGrid}>
              <ProgressTile label="Current round" value="Sprint 2" icon={Sparkles} accent={false} colors={colors} isDark={isDark} />
              <ProgressTile label="Submission" value="In review" icon={Shield} accent={true} colors={colors} isDark={isDark} />
              <ProgressTile label="Ranking" value="#12 / 280" icon={Trophy} accent={false} colors={colors} isDark={isDark} />
              <ProgressTile label="Qualified" value="Top 16" icon={Crown} accent={true} colors={colors} isDark={isDark} />
            </View>

            {/* ================= MEMBERS SECTION ================= */}
            <View style={[styles.sectionHeaderWrapper, { marginTop: 24, marginBottom: 12 }]}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Members · {MEMBERS.length}</Text>
              <TouchableOpacity style={[styles.inviteBtn, { backgroundColor: `${colors.accent}15` }]} activeOpacity={0.8}>
                <UserPlus size={12} color={colors.accent} />
                <Text style={[styles.inviteBtnText, { color: colors.accent }]}>Invite</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.membersCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              {MEMBERS.map((m, idx) => (
                <View
                  key={m.name}
                  style={[
                    styles.memberRow,
                    idx !== MEMBERS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.cardBorder }
                  ]}
                >
                  <View style={styles.memberAvatarWrapper}>
                    <View style={[styles.memberAvatar, { backgroundColor: isDark ? "#292524" : "#E7E5E4" }]}>
                      <Text style={[styles.memberAvatarText, { color: colors.textPrimary }]}>{m.initials}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor:
                            m.status === "Online"
                              ? "#22c55e"
                              : m.status === "Idle"
                                ? "#f59e0b"
                                : colors.textMuted,
                          borderColor: colors.cardBg,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.memberInfo}>
                    <View style={styles.memberNameRow}>
                      <Text style={[styles.memberName, { color: colors.textPrimary }]}>{m.name}</Text>
                      {m.you && (
                        <View style={[styles.youBadge, { backgroundColor: `${colors.accent}15` }]}>
                          <Text style={[styles.youBadgeText, { color: colors.accent }]}>YOU</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.memberMeta, { color: colors.textSecondary }]}>
                      {m.role} · {m.uni}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* ================= ACTIONS ================= */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                activeOpacity={0.8}
              >
                <MessageSquare size={16} color={colors.textPrimary} />
                <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>Team chat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnDanger, { borderColor: "rgba(239, 68, 68, 0.2)" }]}
                activeOpacity={0.8}
              >
                <LogOut size={16} color="#ef4444" />
                <Text style={[styles.actionBtnText, { color: "#ef4444" }]}>Leave team</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ================= NO TEAM SCREEN ================= */
          <View style={[styles.noTeamCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <View style={[styles.noTeamIconWrapper, { backgroundColor: colors.accent }]}>
              <Users size={28} color="#FFFFFF" />
            </View>
            <Text style={[styles.noTeamTitle, { color: colors.textPrimary }]}>You don't have a team yet</Text>
            <Text style={[styles.noTeamSubtitle, { color: colors.textSecondary }]}>
              Create your own squad or join an existing one with an invite code.
            </Text>

            <View style={styles.noTeamActions}>
              <TouchableOpacity
                style={[styles.ctaBtn, { backgroundColor: colors.accent }]}
                activeOpacity={0.9}
                onPress={() => setModalKind("create")}
              >
                <Plus size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.ctaBtnText}>Create</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.ctaBtnSecondary, { backgroundColor: isDark ? "#292524" : "#E7E5E4" }]}
                activeOpacity={0.8}
                onPress={() => setModalKind("join")}
              >
                <Mail size={16} color={colors.textPrimary} style={{ marginRight: 6 }} />
                <Text style={[styles.ctaBtnSecondaryText, { color: colors.textPrimary }]}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ================= MODAL CREATE / JOIN ================= */}
      <Modal
        visible={modalKind !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalKind(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {modalKind === "create" ? "Create new team" : "Join a team"}
              </Text>
              <TouchableOpacity
                onPress={() => setModalKind(null)}
                style={[styles.modalCloseBtn, { backgroundColor: isDark ? "#292524" : "#E7E5E4" }]}
              >
                <X size={16} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {modalKind === "create" ? (
                <>
                  <FormField label="Team name" placeholder="e.g. Quantum Drift" colors={colors} />
                  <FormField label="Team description" placeholder="What problem will you ship?" textarea={true} colors={colors} />
                  <FormField label="Category" placeholder="AI Infrastructure" colors={colors} />
                </>
              ) : (
                <>
                  <FormField label="Invitation code" placeholder="e.g. SEAL-7F2K" colors={colors} />
                  <FormField label="Team ID (optional)" placeholder="seal://team/4421" colors={colors} />
                </>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setModalKind(null)}
              style={[styles.modalSubmitBtn, { backgroundColor: colors.accent }]}
              activeOpacity={0.9}
            >
              <Text style={styles.modalSubmitBtnText}>
                {modalKind === "create" ? "Create team" : "Send request"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Sub-Component: Progress Tile
function ProgressTile({
  label,
  value,
  icon: IconComponent,
  accent,
  colors,
  isDark
}: {
  label: string;
  value: string;
  icon: any;
  accent: boolean;
  colors: any;
  isDark: boolean;
}) {
  return (
    <View
      style={[
        styles.progressTile,
        {
          backgroundColor: colors.cardBg,
          borderColor: accent ? `${colors.accent}40` : colors.cardBorder,
        },
      ]}
    >
      <View
        style={[
          styles.tileIconWrapper,
          {
            backgroundColor: accent ? colors.accent : (isDark ? "#292524" : "#E7E5E4"),
          },
        ]}
      >
        <IconComponent size={16} color={accent ? "#FFFFFF" : colors.accent} />
      </View>
      <Text style={[styles.tileLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.tileValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

// Sub-Component: Form Field
function FormField({
  label,
  placeholder,
  textarea,
  colors
}: {
  label: string;
  placeholder: string;
  textarea?: boolean;
  colors: any;
}) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.fieldInput,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.cardBorder,
            color: colors.textPrimary,
          },
          textarea && { height: 80, textAlignVertical: "top", paddingTop: 10 }
        ]}
        multiline={textarea}
        numberOfLines={textarea ? 3 : 1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  demoToggle: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textDecorationLine: "underline",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  teamContent: {
    gap: 12,
  },
  teamCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    position: "relative",
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute",
    right: -20,
    top: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  teamCardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  teamAvatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#f37021",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  teamAvatarText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  teamDetails: {
    flex: 1,
  },
  teamNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamName: {
    fontSize: 18,
    fontWeight: "900",
  },
  teamMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  teamTags: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  tagText: {
    fontSize: 9,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  progressGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  progressTile: {
    width: (width - 44) / 2,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  tileIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tileLabel: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 12,
  },
  tileValue: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 2,
  },
  sectionHeaderWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inviteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  inviteBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
  membersCard: {
    borderRadius: 18,
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
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  memberAvatarText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusIndicator: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
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
    borderRadius: 99,
  },
  youBadgeText: {
    fontSize: 8,
    fontWeight: "800",
  },
  memberMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionBtnDanger: {
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  noTeamCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    textAlign: "center",
    marginTop: 24,
  },
  noTeamIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  noTeamTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 16,
  },
  noTeamSubtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 6,
  },
  noTeamActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    width: "100%",
  },
  ctaBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 46,
    borderRadius: 23,
  },
  ctaBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  ctaBtnSecondary: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 46,
    borderRadius: 23,
  },
  ctaBtnSecondaryText: {
    fontWeight: "700",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    gap: 12,
  },
  modalSubmitBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  modalSubmitBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  fieldWrapper: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldInput: {
    height: 46,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
  },
});
