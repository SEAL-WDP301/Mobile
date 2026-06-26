import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Calendar, Search, SlidersHorizontal, Clock, MapPin, Users, ChevronRight, CheckCircle2 } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { TIMELINE_ACTIVITIES } from "@/constants/mockData";

const { width } = Dimensions.get("window");

export default function ScheduleScreen() {
  const { isDark } = useTheme();
  
  // Custom states
  const [activeDay, setActiveDay] = useState<"day1" | "day2" | "day3">("day1");
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

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

  const filterChips = ["Tất cả", "Của đội tôi", "Workshop", "Mentoring", "Pitching", "Deadline"];

  // Filter activities based on Day, Category, and Search
  const filteredActivities = TIMELINE_ACTIVITIES.filter((activity) => {
    // 1. Day filtering
    let matchesDay = false;
    if (activeDay === "day1") {
      // id 1, 2, 3 are Day 1
      matchesDay = activity.id === 1 || activity.id === 2 || activity.id === 3;
    } else if (activeDay === "day2") {
      // id 4, 5 are Day 2
      matchesDay = activity.id === 4 || activity.id === 5;
    } else if (activeDay === "day3") {
      // id 6 is Day 3
      matchesDay = activity.id === 6;
    }

    // 2. Category filtering
    let matchesCategory = true;
    if (activeFilter === "Của đội tôi") {
      matchesCategory = activity.isMyTeam;
    } else if (activeFilter !== "Tất cả") {
      matchesCategory = activity.type === activeFilter;
    }

    // 3. Search query filtering
    let matchesSearch = true;
    if (searchQuery !== "") {
      matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      activity.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (activity.mentorName && activity.mentorName.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return matchesDay && matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Lịch trình</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
              onPress={() => setShowSearch(!showSearch)}
            >
              <Search size={18} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <SlidersHorizontal size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Lịch trình chi tiết sự kiện SEAL Summer 2026</Text>
      </View>

      {/* ================= SEARCH INPUT ================= */}
      {showSearch && (
        <View style={[styles.searchBar, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <TextInput
            placeholder="Tìm hoạt động, địa điểm, mentor..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
        </View>
      )}

      {/* ================= DAY SELECTOR ================= */}
      <View style={[styles.daySelector, { borderBottomColor: colors.border }]}>
        {[
          { key: "day1", label: "Hôm nay (27/06)", sub: "Ngày 1" },
          { key: "day2", label: "Ngày mai (28/06)", sub: "Ngày 2" },
          { key: "day3", label: "Hạn chót (29/06)", sub: "Ngày 3" },
        ].map((day) => {
          const isActive = activeDay === day.key;
          return (
            <TouchableOpacity
              key={day.key}
              style={[styles.dayTab, isActive && { borderBottomColor: colors.accent }]}
              onPress={() => setActiveDay(day.key as any)}
              activeOpacity={0.8}
            >
              <Text style={[styles.dayLabel, { color: isActive ? colors.accent : colors.textSecondary }]}>
                {day.label}
              </Text>
              <Text style={[styles.daySubLabel, { color: isActive ? colors.accent : colors.textSecondary }]}>
                {day.sub}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ================= FILTER CHIPS ================= */}
      <View style={styles.filterChipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip;
            return (
              <TouchableOpacity
                key={chip}
                style={[
                  styles.chip,
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                  isActive && { backgroundColor: colors.accent, borderColor: colors.accent }
                ]}
                onPress={() => setActiveFilter(chip)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, { color: isActive ? "#FFFFFF" : colors.textSecondary }]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ================= TIMELINE LIST ================= */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredActivities.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Calendar size={32} color={colors.textSecondary} style={{ marginBottom: 12 }} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Không có hoạt động nào phù hợp bộ lọc.
            </Text>
          </View>
        ) : (
          filteredActivities.map((activity, idx) => {
            // Determine type color
            let typeColor = colors.accent;
            if (activity.type === "Workshop") typeColor = colors.success;
            if (activity.type === "Mentoring") typeColor = colors.warning;
            if (activity.type === "Deadline") typeColor = colors.error;

            return (
              <View key={activity.id} style={styles.timelineRow}>
                {/* Timeline Left Column (Time) */}
                <View style={styles.timeLeftCol}>
                  <Text style={[styles.timeText, { color: colors.textPrimary }]}>
                    {activity.time.split(" - ")[0]}
                  </Text>
                  {activity.time.split(" - ")[1] && (
                    <Text style={[styles.timeEndText, { color: colors.textSecondary }]}>
                      - {activity.time.split(" - ")[1]}
                    </Text>
                  )}
                </View>

                {/* Timeline Indicator Column */}
                <View style={styles.timelineIndicatorCol}>
                  <View style={[
                    styles.timelineDot,
                    { backgroundColor: typeColor },
                    activity.status === "ended" && { backgroundColor: colors.border, borderWidth: 1, borderColor: colors.textSecondary }
                  ]} />
                  {idx !== filteredActivities.length - 1 && (
                    <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                  )}
                </View>

                {/* Timeline Right Column (Card Content) */}
                <TouchableOpacity
                  style={[
                    styles.activityCard,
                    { backgroundColor: colors.cardBg, borderColor: colors.border },
                    activity.isMyTeam && { borderColor: `${colors.accent}60`, borderWidth: 1.5 }
                  ]}
                  activeOpacity={0.85}
                  onPress={() => router.push({
                    pathname: "/activity-detail",
                    params: { id: activity.id }
                  })}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.typeBadge, { backgroundColor: `${typeColor}15` }]}>
                      <Text style={[styles.typeBadgeText, { color: typeColor }]}>
                        {activity.type}
                      </Text>
                    </View>
                    {activity.isMyTeam && (
                      <View style={[styles.myTeamBadge, { backgroundColor: `${colors.accent}15` }]}>
                        <Users size={10} color={colors.accent} style={{ marginRight: 4 }} />
                        <Text style={[styles.myTeamBadgeText, { color: colors.accent }]}>ĐỘI TÔI</Text>
                      </View>
                    )}
                  </View>

                  <Text 
                    style={[
                      styles.activityTitleText, 
                      { color: colors.textPrimary },
                      activity.status === "ended" && { color: colors.textSecondary, textDecorationLine: "line-through" }
                    ]}
                  >
                    {activity.title}
                  </Text>

                  <View style={styles.cardFooter}>
                    <View style={styles.footerInfoItem}>
                      <MapPin size={12} color={colors.textSecondary} />
                      <Text style={[styles.footerText, { color: colors.textSecondary }]} numberOfLines={1}>
                        {activity.location}
                      </Text>
                    </View>
                    {activity.mentorName && (
                      <View style={styles.footerInfoItem}>
                        <Users size={12} color={colors.textSecondary} />
                        <Text style={[styles.footerText, { color: colors.textSecondary }]} numberOfLines={1}>
                          {activity.mentorName}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Status labels */}
                  {activity.status === "ongoing" && (
                    <View style={styles.ongoingContainer}>
                      <View style={[styles.pulseDot, { backgroundColor: colors.success }]} />
                      <Text style={[styles.ongoingLabel, { color: colors.success }]}>Đang diễn ra</Text>
                    </View>
                  )}
                  {activity.order && (
                    <Text style={[styles.orderText, { color: colors.accent }]}>{activity.order}</Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })
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
    paddingBottom: 10,
  },
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  searchBar: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 12,
    justifyContent: "center",
    marginBottom: 12,
  },
  searchInput: {
    fontSize: 13,
  },
  daySelector: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  dayTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  daySubLabel: {
    fontSize: 10,
    marginTop: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  filterChipsWrapper: {
    marginVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },
  timelineRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timeLeftCol: {
    width: 75,
    paddingTop: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "800",
  },
  timeEndText: {
    fontSize: 11,
    marginTop: 2,
  },
  timelineIndicatorCol: {
    width: 24,
    alignItems: "center",
    marginHorizontal: 4,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
    marginTop: 6,
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    position: "absolute",
    top: 18,
    bottom: -18,
  },
  activityCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  myTeamBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  myTeamBadgeText: {
    fontSize: 9,
    fontWeight: "800",
  },
  activityTitleText: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  footerInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    maxWidth: "80%",
  },
  footerText: {
    fontSize: 11,
  },
  ongoingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    position: "absolute",
    right: 12,
    top: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  ongoingLabel: {
    fontSize: 10,
    fontWeight: "700",
  },
  orderText: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 8,
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
