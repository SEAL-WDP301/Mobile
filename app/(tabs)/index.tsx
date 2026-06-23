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
  Trophy, 
  Users, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Zap, 
  Megaphone, 
  ChevronRight,
  Sun,
  Moon,
  Bell
} from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";

const { width } = Dimensions.get("window");

// Sprint Deadline Target
const TARGET_DATE = new Date("2026-07-30T23:59:59").getTime();

const SCHEDULE = [
  {
    id: 1,
    title: "Sprint 2 submission",
    date: "Aug 04 · 23:59",
    tag: "Deadline",
    countdown: "in 2d 14h",
    accent: true,
    icon: Clock,
  },
  {
    id: 2,
    title: "Mentor session — Dr. Linh",
    date: "Aug 05 · 19:00",
    tag: "Meeting",
    countdown: "in 3d",
    accent: false,
    icon: Calendar,
  },
  {
    id: 3,
    title: "Demo Day · Finalists",
    date: "Aug 12 · 14:00",
    tag: "Milestone",
    countdown: "in 10d",
    accent: false,
    icon: Zap,
  },
];

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "New track unlocked: AI Agents",
    time: "2h ago",
    body: "An additional track is now open for cross-team submissions.",
    icon: Megaphone,
  },
  {
    id: 2,
    title: "Ranking update — you moved up 4 spots",
    time: "5h ago",
    body: "Team Quantum Drift is now #12 on the global board.",
    icon: Trophy,
  },
  {
    id: 3,
    title: "Mentor assigned: Mr. Hoang Pham",
    time: "Yesterday",
    body: "Expert in distributed systems, available Tue & Thu evenings.",
    icon: Users,
  },
];

export default function HomeScreen() {
  const { isDark, toggle } = useTheme();
  const [timeLeft, setTimeLeft] = useState(TARGET_DATE - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = TARGET_DATE - Date.now();
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  // Synchronized color scheme
  const colors = {
    bg: isDark ? "#0C0A09" : "#F9F6F0",
    cardBg: isDark ? "rgba(20, 17, 15, 0.75)" : "rgba(255, 255, 255, 0.95)",
    cardBorder: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.05)",
    textPrimary: isDark ? "#FFFFFF" : "#1C1917",
    textSecondary: isDark ? "#A39690" : "#78716C",
    textMuted: isDark ? "#57534E" : "#A8A29E",
    accent: "#f37021",
    subAccent: "#ff9248",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Glow Effect */}
      <View style={[styles.glowAmbient, { backgroundColor: colors.accent, opacity: isDark ? 0.12 : 0.04 }]} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HEADER GREETING ================= */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={[styles.avatarWrapper, { borderColor: colors.accent }]}>
              <Text style={[styles.avatarText, { color: colors.textPrimary }]}>JN</Text>
            </View>
            <View style={styles.welcomeTextGroup}>
              <Text style={[styles.titleLabel, { color: colors.textSecondary }]}>WELCOME BACK</Text>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>John Nguyen</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.circleActionButton, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]} 
              activeOpacity={0.7}
              onPress={toggle}
            >
              {isDark ? (
                <Sun size={18} color={colors.textPrimary} />
              ) : (
                <Moon size={18} color={colors.textPrimary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.circleActionButton, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]} 
              activeOpacity={0.7}
              onPress={() => router.push("/notifications" as any)}
            >
              <Bell size={18} color={colors.textPrimary} />
              <View style={[styles.notifBadge, { backgroundColor: colors.accent }]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= HERO CARD ================= */}
        <View style={[styles.heroCard, { backgroundColor: isDark ? "rgba(20, 17, 15, 0.75)" : "#1C1917" }]}>
          {/* Live Badge */}
          <View style={styles.liveBadge}>
            <View style={[styles.liveDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.liveText, { color: colors.accent }]}>LIVE • SEAL SUMMER 2026</Text>
          </View>

          <Text style={styles.heroTitle}>
            FPT Hackathon • <Text style={{ color: colors.accent }}>Sprint 2</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Team <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Quantum Drift</Text> · Rank #12 globally
          </Text>

          <View style={styles.divider} />

          <Text style={styles.countdownHeading}>SUBMISSION CLOSES IN</Text>

          {/* Countdown timer */}
          <View style={styles.countdownRow}>
            {[
              { val: days, unit: "DAYS" },
              { val: hours, unit: "HRS" },
              { val: minutes, unit: "MIN" },
              { val: seconds, unit: "SEC" },
            ].map((time, idx) => (
              <View key={idx} style={styles.timeSlot}>
                <Text style={styles.timeValue}>
                  {String(time.val).padStart(2, "0")}
                </Text>
                <Text style={styles.timeUnit}>{time.unit}</Text>
              </View>
            ))}
          </View>

          {/* Action buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.btnPrimary} 
              activeOpacity={0.9}
              onPress={() => router.push("/teams" as any)}
            >
              <Text style={styles.btnTextPrimary}>View Team</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.8}>
              <Text style={styles.btnTextSecondary}>View Event</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= SNAPSHOT SECTION ================= */}
        <View style={styles.sectionHeadingWrapper}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Your snapshot</Text>
          <Text style={[styles.updatedLabel, { color: colors.textMuted }]}>Updated now</Text>
        </View>

        <View style={styles.statsGrid}>
          {/* Card: Events Joined */}
          <View style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <View style={styles.statCardHeader}>
              <View style={[styles.iconBox, { backgroundColor: `${colors.accent}15` }]}>
                <Trophy size={16} color={colors.accent} />
              </View>
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>04</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Events Joined</Text>
          </View>

          {/* Card: Members */}
          <View style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <View style={styles.statCardHeader}>
              <View style={[styles.iconBox, { backgroundColor: `${colors.accent}15` }]}>
                <Users size={16} color={colors.accent} />
              </View>
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>05</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Members in team</Text>
          </View>
        </View>

        {/* ================= SCHEDULE / UPCOMING SECTION ================= */}
        <View style={[styles.sectionHeadingWrapper, { marginTop: 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Upcoming</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: colors.accent }]}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scheduleList}>
          {SCHEDULE.map((s) => {
            const IconComponent = s.icon;
            return (
              <View
                key={s.id}
                style={[
                  styles.scheduleItem,
                  {
                    backgroundColor: colors.cardBg,
                    borderColor: s.accent ? `${colors.accent}50` : colors.cardBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.scheduleIconWrapper,
                    {
                      backgroundColor: s.accent ? colors.accent : (isDark ? "#292524" : "#E7E5E4"),
                    },
                  ]}
                >
                  <IconComponent size={18} color={s.accent ? "#FFFFFF" : colors.accent} />
                </View>

                <View style={styles.scheduleTextContent}>
                  <View style={styles.scheduleTagRow}>
                    <Text
                      style={[
                        styles.scheduleTag,
                        {
                          backgroundColor: s.accent ? `${colors.accent}20` : (isDark ? "#292524" : "#E7E5E4"),
                          color: s.accent ? colors.accent : colors.textSecondary,
                        },
                      ]}
                    >
                      {s.tag}
                    </Text>
                    <Text style={[styles.scheduleDate, { color: colors.textMuted }]}>{s.date}</Text>
                  </View>
                  <Text style={[styles.scheduleTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    {s.title}
                  </Text>
                </View>

                <View style={styles.scheduleRight}>
                  <Text style={[styles.scheduleCountdown, { color: colors.textMuted }]}>{s.countdown}</Text>
                  <Zap size={12} color={s.accent ? colors.accent : colors.textMuted} style={{ marginTop: 4, alignSelf: "flex-end" }} />
                </View>
              </View>
            );
          })}
        </View>

        {/* ================= ANNOUNCEMENTS SECTION ================= */}
        <View style={[styles.sectionHeadingWrapper, { marginTop: 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Announcements</Text>
          <TouchableOpacity onPress={() => router.push("/notifications" as any)}>
            <Text style={[styles.seeAllText, { color: colors.accent }]}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.announcementList}>
          {ANNOUNCEMENTS.map((a) => {
            const IconComponent = a.icon;
            return (
              <View
                key={a.id}
                style={[
                  styles.announcementItem,
                  {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <View style={styles.announcementHeader}>
                  <View style={[styles.iconBox, { backgroundColor: `${colors.accent}15` }]}>
                    <IconComponent size={14} color={colors.accent} />
                  </View>
                  <View style={styles.announcementHeaderText}>
                    <View style={styles.announcementTitleRow}>
                      <Text style={[styles.announcementTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                        {a.title}
                      </Text>
                      <Text style={[styles.announcementTime, { color: colors.textMuted }]}>{a.time}</Text>
                    </View>
                    <Text style={[styles.announcementBody, { color: colors.textSecondary }]}>
                      {a.body}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
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
    top: -120,
    left: width / 2 - 150,
    width: 300,
    height: 300,
    borderRadius: 150,
    pointerEvents: "none",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 110, // Generous padding for floating nav
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(20, 17, 15, 0.4)",
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
  },
  welcomeTextGroup: {
    marginLeft: 12,
  },
  titleLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  circleActionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notifBadge: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
    padding: 20,
    marginBottom: 20,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(243, 112, 33, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    marginBottom: 14,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#A39690",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    width: "100%",
    marginVertical: 16,
  },
  countdownHeading: {
    fontSize: 10,
    fontWeight: "700",
    color: "#57534E",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 12,
  },
  countdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 20,
  },
  timeSlot: {
    flex: 1,
    backgroundColor: "#0A0807",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
    paddingVertical: 10,
    alignItems: "center",
  },
  timeValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  timeUnit: {
    fontSize: 8,
    fontWeight: "600",
    color: "#A39690",
    marginTop: 2,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  btnPrimary: {
    flex: 1.3,
    height: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  btnSecondary: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  btnTextPrimary: {
    fontWeight: "700",
    fontSize: 14,
    color: "#000000",
  },
  btnTextSecondary: {
    fontWeight: "600",
    fontSize: 14,
    color: "#FFFFFF",
  },
  sectionHeadingWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  updatedLabel: {
    fontSize: 11,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  statCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  scheduleList: {
    gap: 10,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  scheduleIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  scheduleTextContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  scheduleTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scheduleTag: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
  },
  scheduleDate: {
    fontSize: 10,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  scheduleRight: {
    justifyContent: "center",
  },
  scheduleCountdown: {
    fontSize: 10,
    textTransform: "uppercase",
    textAlign: "right",
  },
  announcementList: {
    gap: 10,
  },
  announcementItem: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  announcementHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  announcementHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  announcementTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  announcementTime: {
    fontSize: 10,
  },
  announcementBody: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
});