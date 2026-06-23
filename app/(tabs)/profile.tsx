import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Edit3,
  Mail,
  Phone,
  School,
  KeyRound,
  Trophy,
  Bell,
  Globe,
  Lock,
  Award,
  LogOut,
  Sun,
  Moon,
  ChevronRight
} from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { useAuth } from "@/contexts/AuthContext";

const HISTORY = [
  { year: "2026", event: "SEAL Summer", result: "Sprint 2 · #12", badge: "Active" },
  { year: "2025", event: "FPT CodeWar", result: "1st Place", badge: "Gold" },
  { year: "2025", event: "AI Hack VN", result: "Top 8 Finalist", badge: "Finalist" },
  { year: "2024", event: "SEAL Winter", result: "Top 16", badge: "Cert" },
];

export default function ProfileScreen() {
  const { isDark, toggle } = useTheme();
  const { logout } = useAuth();

  const colors = {
    isDark,
    bg: isDark ? "#0C0A09" : "#F9F6F0",
    cardBg: isDark ? "rgba(20, 17, 15, 0.75)" : "rgba(255, 255, 255, 0.95)",
    cardBorder: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.05)",
    textPrimary: isDark ? "#FFFFFF" : "#1C1917",
    textSecondary: isDark ? "#A39690" : "#78716C",
    textMuted: isDark ? "#57534E" : "#A8A29E",
    accent: "#f37021",
    subAccent: "#ff9248",
  };

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Profile</Text>
        <TouchableOpacity style={[styles.headerEditBtn, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Edit3 size={16} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= PROFILE CARD ================= */}
        <View style={[styles.profileCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          {/* Blur glow background */}
          <View style={[styles.cardGlow, { backgroundColor: colors.accent, opacity: isDark ? 0.1 : 0.03 }]} />

          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
                <Text style={styles.avatarText}>JN</Text>
              </View>
              <TouchableOpacity style={[styles.avatarEditBtn, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <Edit3 size={10} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.profileName, { color: colors.textPrimary }]}>John Nguyen</Text>
            <Text style={[styles.profileMeta, { color: colors.textSecondary }]}>SE171234 · FPT University HCM</Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>john.nguyen@fpt.edu.vn</Text>

            <View style={styles.badgesRow}>
              <Badge label="Top 5%" colors={colors} />
              <Badge label="Sprint Lead" colors={colors} />
              <Badge label="3 Awards" colors={colors} />
            </View>
          </View>
        </View>

        {/* ================= APPEARANCE SWITCH ================= */}
        <View style={[styles.settingBlock, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <View style={styles.appearanceRow}>
            <View style={styles.appearanceLeft}>
              <View style={[styles.settingIconWrapper, { backgroundColor: `${colors.accent}15` }]}>
                {isDark ? (
                  <Moon size={16} color={colors.accent} />
                ) : (
                  <Sun size={16} color={colors.accent} />
                )}
              </View>
              <View style={styles.settingTextWrapper}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>Appearance</Text>
                <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                  {isDark ? "Dark mode" : "Light mode"}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggle}
              trackColor={{ false: "#767577", true: colors.accent }}
              thumbColor="#f4f3f4"
            />
          </View>
        </View>

        {/* ================= PERSONAL INFO ================= */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Personal information</Text>
        <View style={[styles.listBlock, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <InfoRow icon={Mail} label="Email" value="john.nguyen@fpt.edu.vn" colors={colors} />
          <InfoRow icon={Phone} label="Phone" value="+84 901 234 567" colors={colors} />
          <InfoRow icon={School} label="University" value="FPT University HCM" colors={colors} />
          <InfoRow icon={KeyRound} label="Student ID" value="SE171234" colors={colors} last={true} />
        </View>

        {/* ================= COMPETITION HISTORY ================= */}
        <View style={styles.sectionHeaderWrapper}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Competition history</Text>
          <Text style={[styles.historyCount, { color: colors.textSecondary }]}>{HISTORY.length} events</Text>
        </View>

        <View style={styles.historyList}>
          {HISTORY.map((h) => (
            <View
              key={h.event + h.year}
              style={[styles.historyCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.historyIconWrapper, { backgroundColor: `${colors.accent}15` }]}>
                <Trophy size={18} color={colors.accent} />
              </View>

              <View style={styles.historyContent}>
                <View style={styles.historyTitleRow}>
                  <View style={[styles.historyYearBadge, { backgroundColor: isDark ? "#292524" : "#E7E5E4" }]}>
                    <Text style={[styles.historyYear, { color: colors.textPrimary }]}>{h.year}</Text>
                  </View>
                  <Text style={[styles.historyEventName, { color: colors.textPrimary }]} numberOfLines={1}>
                    {h.event}
                  </Text>
                </View>
                <Text style={[styles.historyResult, { color: colors.textSecondary }]}>{h.result}</Text>
              </View>

              <View style={[styles.historyBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.historyBadgeText}>{h.badge}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ================= SETTINGS ================= */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Settings</Text>
        <View style={[styles.listBlock, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <SettingRow icon={Bell} label="Notifications" hint="Push · Email · In-app" colors={colors} />
          <SettingRow icon={Globe} label="Language" hint="English" colors={colors} />
          <SettingRow icon={Lock} label="Privacy" hint="Public profile" colors={colors} />
          <SettingRow icon={Award} label="Certificates" hint="3 issued" colors={colors} last={true} />
        </View>

        {/* ================= ACCOUNT ACTIONS ================= */}
        <View style={styles.accountActions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>Change password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnDanger, { borderColor: "rgba(239, 68, 68, 0.2)" }]}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <LogOut size={16} color="#ef4444" />
            <Text style={[styles.actionBtnText, { color: "#ef4444" }]}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-Component: Badge
function Badge({ label, colors }: { label: string; colors: any }) {
  return (
    <View style={[styles.badge, { backgroundColor: `${colors.accent}15` }]}>
      <Text style={[styles.badgeText, { color: colors.accent }]}>{label}</Text>
    </View>
  );
}

// Sub-Component: Personal Info Row
function InfoRow({
  icon: IconComponent,
  label,
  value,
  colors,
  last
}: {
  icon: any;
  label: string;
  value: string;
  colors: any;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !last && { borderBottomWidth: 1, borderBottomColor: colors.cardBorder }]}>
      <View style={[styles.settingIconWrapper, { backgroundColor: colors.isDark ? "#292524" : "#E7E5E4" }]}>
        <IconComponent size={16} color={colors.accent} />
      </View>
      <View style={styles.infoTextWrapper}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{value}</Text>
      </View>
    </View>
  );
}

// Sub-Component: Setting Navigation Row
function SettingRow({
  icon: IconComponent,
  label,
  hint,
  colors,
  last
}: {
  icon: any;
  label: string;
  hint: string;
  colors: any;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.settingRow,
        !last && { borderBottomWidth: 1, borderBottomColor: colors.cardBorder }
      ]}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIconWrapper, { backgroundColor: colors.isDark ? "#292524" : "#E7E5E4" }]}>
        <IconComponent size={16} color={colors.accent} />
      </View>
      <View style={styles.infoTextWrapper}>
        <Text style={[styles.settingRowTitle, { color: colors.textPrimary }]}>{label}</Text>
        <Text style={[styles.settingRowHint, { color: colors.textSecondary }]}>{hint}</Text>
      </View>
      <ChevronRight size={16} color={colors.textSecondary} />
    </TouchableOpacity>
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
  headerEditBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
    gap: 16,
  },
  profileCard: {
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
  avatarSection: {
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#f37021",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
  },
  avatarEditBtn: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "900",
  },
  profileMeta: {
    fontSize: 12,
    marginTop: 4,
  },
  profileEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  settingBlock: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
  },
  appearanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appearanceLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  settingTextWrapper: {
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  settingDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 8,
  },
  listBlock: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  infoTextWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  sectionHeaderWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
  },
  historyCount: {
    fontSize: 11,
  },
  historyList: {
    gap: 10,
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
  },
  historyIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  historyContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  historyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  historyYearBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  historyYear: {
    fontSize: 10,
    fontWeight: "700",
  },
  historyEventName: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  historyResult: {
    fontSize: 11,
    marginTop: 4,
  },
  historyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  historyBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  settingRowTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  settingRowHint: {
    fontSize: 10,
    marginTop: 2,
  },
  accountActions: {
    gap: 10,
    marginTop: 8,
  },
  actionBtn: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  actionBtnDanger: {
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
