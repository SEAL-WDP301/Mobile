import React, { useMemo, useState } from "react";
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
import { router } from "expo-router";
import { Award, Calendar, Users, ArrowRight } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { useEventContext } from "@/contexts/EventContext";
import { usePublicEvents } from "@/hooks/usePublicEvents";
import {
  formatDateRange,
  formatEventSeason,
  mapEventStatusLabel,
} from "@/utils/format";
import { isEventRegistrationOpen } from "@/utils/eventRegistration";

type Segment = "participating" | "open" | "ended";

interface DisplayEvent {
  id: number;
  name: string;
  season: string;
  theme: string;
  date: string;
  status: string;
  statusLabel: string;
  myTeam: string;
  isActive: boolean;
  registrationOpen: boolean;
}

export default function CompetitionsScreen() {
  const { isDark } = useTheme();
  const [activeSegment, setActiveSegment] = useState<Segment>("participating");
  const { events: publicEvents, loading: loadingPublic, error: publicEventsError } = usePublicEvents();
  const { myEvents, isLoading: loadingMy } = useEventContext();

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    cardElevated: isDark ? "#211F1D" : "#F5F3EF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    success: "#10B981",
  };

  const myEventMap = useMemo(() => {
    const map = new Map<number, string>();
    myEvents.forEach((entry) => map.set(entry.event.id, entry.teamName));
    return map;
  }, [myEvents]);

  const displayEvents = useMemo((): DisplayEvent[] => {
    return publicEvents.map((event) => {
      const teamName = myEventMap.get(event.id) ?? "";
      const isActive = event.status === "active" || event.status === "ongoing";
      const registrationOpen = isEventRegistrationOpen(event);
      return {
        id: event.id,
        name: event.name,
        season: formatEventSeason(event.season, event.year),
        theme: event.description ?? "Chưa có mô tả",
        date: formatDateRange(event.startDate, event.registrationDeadline),
        status: event.status,
        statusLabel: mapEventStatusLabel(event.status),
        myTeam: teamName,
        isActive,
        registrationOpen,
      };
    });
  }, [publicEvents, myEventMap]);

  const filteredEvents = displayEvents.filter((event) => {
    if (activeSegment === "participating") {
      return event.myTeam !== "";
    }
    if (activeSegment === "open") {
      return event.registrationOpen && event.myTeam === "";
    }
    return (
      event.status === "closed" ||
      (!event.registrationOpen && event.myTeam === "")
    );
  });

  const loading = loadingPublic || loadingMy;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Cuộc thi</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Các giải Hackathon thuộc hệ thống SEAL
        </Text>
      </View>

      <View style={[styles.segmentContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        {[
          { key: "participating", label: "Đang tham gia" },
          { key: "open", label: "Mở đăng ký" },
          { key: "ended", label: "Đã kết thúc" },
        ].map((seg) => {
          const isActive = activeSegment === seg.key;
          return (
            <TouchableOpacity
              key={seg.key}
              style={[styles.segmentTab, isActive && { backgroundColor: colors.accent }]}
              onPress={() => setActiveSegment(seg.key as Segment)}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentLabel, { color: isActive ? "#FFFFFF" : colors.textSecondary }]}>
                {seg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
        ) : publicEventsError ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Award size={32} color={colors.textSecondary} style={{ marginBottom: 12 }} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Không tải được danh sách cuộc thi. Kiểm tra backend đang chạy và kết nối mạng.
            </Text>
            <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>{publicEventsError}</Text>
          </View>
        ) : filteredEvents.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Award size={32} color={colors.textSecondary} style={{ marginBottom: 12 }} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {activeSegment === "open"
                ? "Chưa có cuộc thi nào đang mở đăng ký."
                : "Không có cuộc thi nào ở danh mục này."}
            </Text>
            {activeSegment === "open" && publicEvents.length > 0 ? (
              <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
                Các cuộc thi hiện có thể đã hết hạn đăng ký — xem tab Đã kết thúc.
              </Text>
            ) : null}
          </View>
        ) : (
          filteredEvents.map((event) => (
            <View key={event.id} style={[styles.eventCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <View style={[styles.eventBanner, { backgroundColor: event.isActive ? "#2C1D11" : "#1F1E1E" }]}>
                <View style={styles.bannerRow}>
                  <View style={[styles.eventLogo, { backgroundColor: colors.accent }]}>
                    <Text style={styles.eventLogoText}>
                      {event.name.split(" ")[0][0]}
                      {event.name.split(" ")[1]?.[0] || ""}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: event.isActive ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.08)" }]}>
                    <Text style={[styles.statusBadgeText, { color: event.isActive ? colors.success : colors.textSecondary }]}>
                      {event.statusLabel}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={[styles.eventSeason, { color: colors.accent }]}>{event.season}</Text>
                <Text style={[styles.eventName, { color: colors.textPrimary }]}>{event.name}</Text>
                <Text style={[styles.eventTheme, { color: colors.textSecondary }]} numberOfLines={2}>
                  Chủ đề: {event.theme}
                </Text>

                <View style={styles.divider} />

                <View style={styles.metaRow}>
                  <Calendar size={13} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>{event.date}</Text>
                </View>

                {event.myTeam !== "" && (
                  <View style={[styles.teamBadge, { backgroundColor: colors.cardElevated }]}>
                    <Users size={12} color={colors.accent} style={{ marginRight: 6 }} />
                    <Text style={[styles.teamBadgeText, { color: colors.textPrimary }]}>
                      Đội: <Text style={{ fontWeight: "700" }}>{event.myTeam}</Text>
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.ctaBtn, { backgroundColor: colors.cardElevated }]}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({ pathname: "/event-detail", params: { id: String(event.id) } })
                  }
                >
                  <Text style={[styles.ctaBtnText, { color: colors.textPrimary }]}>Xem cuộc thi</Text>
                  <ArrowRight size={16} color={colors.textPrimary} />
                </TouchableOpacity>

                {activeSegment === "open" && event.myTeam === "" ? (
                  <TouchableOpacity
                    style={[styles.registerBtn, { backgroundColor: colors.accent }]}
                    activeOpacity={0.85}
                    onPress={() => router.push(`/event-register?id=${event.id}`)}
                  >
                    <Text style={styles.registerBtnText}>Đăng ký ngay</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  segmentContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  segmentTab: { flex: 1, height: 38, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  segmentLabel: { fontSize: 12, fontWeight: "700" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 110 },
  eventCard: { borderRadius: 20, borderWidth: 1, overflow: "hidden", marginBottom: 20 },
  eventBanner: { height: 70, justifyContent: "center", paddingHorizontal: 16 },
  bannerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  eventLogo: { width: 38, height: 38, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  eventLogoText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { fontSize: 9, fontWeight: "800" },
  cardBody: { padding: 16 },
  eventSeason: { fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8 },
  eventName: { fontSize: 18, fontWeight: "800", marginTop: 4, marginBottom: 6 },
  eventTheme: { fontSize: 13, lineHeight: 18 },
  divider: { height: 1, backgroundColor: "rgba(255, 255, 255, 0.03)", width: "100%", marginVertical: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  metaText: { fontSize: 12 },
  teamBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  teamBadgeText: { fontSize: 11 },
  ctaBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  ctaBtnText: { fontSize: 13, fontWeight: "700" },
  registerBtn: {
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  registerBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  emptyContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyText: { fontSize: 13, textAlign: "center" },
  emptyHint: { fontSize: 12, textAlign: "center", marginTop: 8, lineHeight: 18 },
});
