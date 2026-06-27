import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  FileText,
  Phone,
  Award,
  Calendar,
  MapPin,
} from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { getPublicEventById } from "@/services/api/events";
import { useTeamStatus } from "@/hooks/useTeamStatus";
import type { PublicEvent } from "@/types/api";
import {
  formatDateRange,
  formatEventSeason,
  mapRoundStatusLabel,
} from "@/utils/format";
import { COMPETITIONS } from "@/constants/mockData";

export default function EventDetailScreen() {
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams();
  const eventId = id ? parseInt(id as string, 10) : null;

  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: teamStatus } = useTeamStatus(eventId);

  const mockFallback = COMPETITIONS.find((c) => c.id === eventId) ?? COMPETITIONS[0];

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    getPublicEventById(eventId)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [eventId]);

  const team = teamStatus?.teamInfo?.team;
  const teamName = team?.name ?? mockFallback.myTeam ?? "Chưa có đội";
  const trackName = team?.track?.name ?? mockFallback.track ?? "Chưa chọn";
  const hasTeam = !!team;

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    success: "#10B981",
  };

  const displayName = event?.name ?? mockFallback.name;
  const displaySeason = event
    ? formatEventSeason(event.season, event.year)
    : mockFallback.season;
  const displayTheme = event?.description ?? mockFallback.theme;
  const displayDate = event
    ? formatDateRange(event.startDate, event.registrationDeadline)
    : mockFallback.date;
  const rounds = event?.rounds ?? [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Chi tiết cuộc thi</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.heroCard, { backgroundColor: "#2C1D11" }]}>
            <Text style={[styles.heroSeason, { color: colors.accent }]}>{displaySeason}</Text>
            <Text style={styles.heroTitle}>{displayName}</Text>
            <Text style={styles.heroTheme}>{displayTheme}</Text>

            <View style={styles.heroInfoGrid}>
              <View style={styles.heroInfoItem}>
                <Calendar size={12} color="#FFFFFF" opacity={0.7} />
                <Text style={styles.heroInfoText}>{displayDate}</Text>
              </View>
              <View style={styles.heroInfoItem}>
                <MapPin size={12} color="#FFFFFF" opacity={0.7} />
                <Text style={styles.heroInfoText} numberOfLines={1}>
                  {mockFallback.location}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>THÔNG TIN THAM GIA</Text>
            <View style={styles.regInfoRow}>
              <Text style={[styles.regLabel, { color: colors.textSecondary }]}>Trạng thái:</Text>
              <View style={[styles.statusBadge, { backgroundColor: hasTeam ? "rgba(16, 185, 129, 0.15)" : "rgba(243, 112, 33, 0.1)" }]}>
                <Text style={[styles.statusBadgeText, { color: hasTeam ? colors.success : colors.accent }]}>
                  {hasTeam ? "ĐÃ ĐĂNG KÝ" : "CHƯA CÓ ĐỘI"}
                </Text>
              </View>
            </View>
            <View style={styles.regInfoRow}>
              <Text style={[styles.regLabel, { color: colors.textSecondary }]}>Đội thi:</Text>
              <Text style={[styles.regValue, { color: colors.textPrimary }]}>{teamName}</Text>
            </View>
            <View style={styles.regInfoRow}>
              <Text style={[styles.regLabel, { color: colors.textSecondary }]}>Bảng đấu (Track):</Text>
              <Text style={[styles.regValue, { color: colors.textPrimary }]}>{trackName}</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>CÁC VÒNG THI</Text>
          <View style={[styles.roundsCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            {rounds.length === 0 ? (
              <Text style={[styles.regValue, { color: colors.textSecondary, padding: 16 }]}>
                Chưa có vòng thi nào.
              </Text>
            ) : (
              rounds.map((round, idx) => (
                <View
                  key={round.id}
                  style={[
                    styles.roundRow,
                    idx !== rounds.length - 1 && {
                      borderBottomColor: colors.border,
                      borderBottomWidth: 1,
                    },
                  ]}
                >
                  <View style={styles.roundInfoCol}>
                    <Text style={[styles.roundNameText, { color: colors.textPrimary }]}>
                      {round.name}
                    </Text>
                    <Text style={[styles.roundDateText, { color: colors.textSecondary }]}>
                      {mapRoundStatusLabel(round.status)}
                      {round.submissionDeadline
                        ? ` · Hạn: ${new Date(round.submissionDeadline).toLocaleDateString("vi-VN")}`
                        : ""}
                    </Text>
                  </View>
                  <ChevronRight size={16} color={colors.textSecondary} />
                </View>
              ))
            )}
          </View>

          {mockFallback.faq.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>FAQ</Text>
              <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                {mockFallback.faq.map((item, idx) => (
                  <View key={idx} style={{ padding: 16, borderBottomWidth: idx < mockFallback.faq.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <HelpCircle size={14} color={colors.accent} />
                      <Text style={[styles.regValue, { color: colors.textPrimary, flex: 1 }]}>{item.q}</Text>
                    </View>
                    <Text style={[styles.regLabel, { color: colors.textSecondary, marginTop: 8, marginLeft: 22 }]}>
                      {item.a}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border, marginTop: 8 }]}>
            <TouchableOpacity style={styles.linkRow}>
              <FileText size={16} color={colors.accent} />
              <Text style={[styles.regValue, { color: colors.textPrimary, marginLeft: 10 }]}>
                Tài liệu cuộc thi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.linkRow, { marginTop: 12 }]}>
              <Phone size={16} color={colors.accent} />
              <Text style={[styles.regValue, { color: colors.textPrimary, marginLeft: 10 }]}>
                {mockFallback.contact || "seal.hcm@fpt.edu.vn"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.linkRow, { marginTop: 12 }]}>
              <Award size={16} color={colors.accent} />
              <Text style={[styles.regValue, { color: colors.textPrimary, marginLeft: 10 }]}>
                Tiêu chí chấm điểm (xem trên Web)
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
  headerTitle: { fontSize: 16, fontWeight: "800", textTransform: "uppercase" },
  scrollContent: { padding: 16, paddingBottom: 40, gap: 12 },
  heroCard: { borderRadius: 20, padding: 20 },
  heroSeason: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  heroTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "800", marginTop: 6 },
  heroTheme: { color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 8, lineHeight: 20 },
  heroInfoGrid: { marginTop: 16, gap: 8 },
  heroInfoItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  heroInfoText: { color: "#FFFFFF", fontSize: 11, opacity: 0.85 },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  cardTitle: { fontSize: 11, fontWeight: "800", padding: 16, paddingBottom: 8, letterSpacing: 0.5 },
  regInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  regLabel: { fontSize: 13 },
  regValue: { fontSize: 13, fontWeight: "600" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: "800" },
  sectionTitle: { fontSize: 13, fontWeight: "800", marginTop: 8, marginBottom: 4, marginLeft: 4 },
  roundsCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  roundRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  roundInfoCol: { flex: 1 },
  roundNameText: { fontSize: 14, fontWeight: "600" },
  roundDateText: { fontSize: 11, marginTop: 4 },
  linkRow: { flexDirection: "row", alignItems: "center", padding: 16, paddingBottom: 0 },
});
