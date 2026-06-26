import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  ImageBackground
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Award, Calendar, MapPin, Users, ArrowRight, ShieldCheck } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { COMPETITIONS } from "@/constants/mockData";

const { width } = Dimensions.get("window");

export default function CompetitionsScreen() {
  const { isDark } = useTheme();
  const [activeSegment, setActiveSegment] = useState<"participating" | "open" | "ended">("participating");

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

  // Filter competitions based on selected segment
  const filteredEvents = COMPETITIONS.filter((event) => {
    if (activeSegment === "participating") {
      return event.status === "Active" || event.myTeam !== "";
    } else if (activeSegment === "open") {
      return event.status === "Registration Open";
    } else {
      return event.status === "Ended";
    }
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Screen Title */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Cuộc thi</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Các giải Hackathon thuộc hệ thống SEAL</Text>
      </View>

      {/* ================= SEGMENTED CONTROL ================= */}
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
              style={[
                styles.segmentTab,
                isActive && { backgroundColor: colors.accent }
              ]}
              onPress={() => setActiveSegment(seg.key as any)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentLabel,
                  { color: isActive ? "#FFFFFF" : colors.textSecondary }
                ]}
              >
                {seg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ================= EVENT LIST ================= */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredEvents.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Award size={32} color={colors.textSecondary} style={{ marginBottom: 12 }} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Không có cuộc thi nào ở danh mục này.
            </Text>
          </View>
        ) : (
          filteredEvents.map((event) => (
            <View key={event.id} style={[styles.eventCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              {/* Event Header Banner (Gradient representation) */}
              <View style={[styles.eventBanner, { backgroundColor: event.status === "Active" ? "#2C1D11" : "#1F1E1E" }]}>
                <View style={styles.bannerRow}>
                  <View style={[styles.eventLogo, { backgroundColor: colors.accent }]}>
                    <Text style={styles.eventLogoText}>{event.name.split(" ")[0][0]}{event.name.split(" ")[1]?.[0] || ""}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: event.status === "Active" ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.08)" }]}>
                    <Text style={[styles.statusBadgeText, { color: event.status === "Active" ? colors.success : colors.textSecondary }]}>
                      {event.status === "Active" ? "ĐANG DIỄN RA" : "ĐÃ KẾT THÚC"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Event Details */}
              <View style={styles.cardBody}>
                <Text style={[styles.eventSeason, { color: colors.accent }]}>{event.season}</Text>
                <Text style={[styles.eventName, { color: colors.textPrimary }]}>{event.name}</Text>
                <Text style={[styles.eventTheme, { color: colors.textSecondary }]} numberOfLines={2}>
                  Chủ đề: {event.theme}
                </Text>

                <View style={styles.divider} />

                {/* Metadata */}
                <View style={styles.metaRow}>
                  <Calendar size={13} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>{event.date}</Text>
                </View>
                <View style={styles.metaRow}>
                  <MapPin size={13} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>{event.location}</Text>
                </View>

                {event.myTeam !== "" && (
                  <View style={[styles.teamBadge, { backgroundColor: colors.cardElevated }]}>
                    <Users size={12} color={colors.accent} style={{ marginRight: 6 }} />
                    <Text style={[styles.teamBadgeText, { color: colors.textPrimary }]}>
                      Đội: <Text style={{ fontWeight: "700" }}>{event.myTeam}</Text>
                    </Text>
                  </View>
                )}

                {/* CTA Action */}
                <TouchableOpacity
                  style={[styles.ctaBtn, { backgroundColor: colors.cardElevated }]}
                  activeOpacity={0.8}
                  onPress={() => router.push({
                    pathname: "/event-detail",
                    params: { id: event.id }
                  })}
                >
                  <Text style={[styles.ctaBtnText, { color: colors.textPrimary }]}>Xem cuộc thi</Text>
                  <ArrowRight size={16} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  segmentContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  segmentTab: {
    flex: 1,
    height: 38,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  segmentLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  eventCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
  },
  eventBanner: {
    height: 70,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  bannerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventLogo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  eventLogoText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: "800",
  },
  cardBody: {
    padding: 16,
  },
  eventSeason: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 6,
  },
  eventTheme: {
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    width: "100%",
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
  },
  teamBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  teamBadgeText: {
    fontSize: 11,
  },
  ctaBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  ctaBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  emptyContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 13,
    textAlign: "center",
  },
});
