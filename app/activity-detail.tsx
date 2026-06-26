import React from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Clock, MapPin, User, Info, ExternalLink, Calendar, QrCode } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { TIMELINE_ACTIVITIES } from "@/constants/mockData";

const { width } = Dimensions.get("window");

export default function ActivityDetailScreen() {
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams();

  // Find selected activity, fallback to first item
  const activityId = id ? parseInt(id as string) : 2;
  const activity = TIMELINE_ACTIVITIES.find(a => a.id === activityId) || TIMELINE_ACTIVITIES[1];

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
  };

  const handleCheckIn = () => {
    Alert.alert(
      "Check-in sự kiện",
      `Bạn có muốn thực hiện quét QR hoặc xác nhận tham gia sự kiện: "${activity.title}"?`,
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xác nhận", 
          onPress: () => {
            Alert.alert("Thành công", "Bạn đã điểm danh tham gia sự kiện thành công!");
          }
        }
      ]
    );
  };

  const handleAddToCalendar = () => {
    Alert.alert("Lịch cá nhân", "Đã lưu hoạt động vào lịch cá nhân của thiết bị thành công.");
  };

  // Determine accent color by activity type
  let typeColor = colors.accent;
  if (activity.type === "Workshop") typeColor = colors.success;
  if (activity.type === "Mentoring") typeColor = colors.warning;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* ================= HEADER ================= */}
      <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Chi tiết hoạt động</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ================= ACTIVITY DETAIL CARD ================= */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.typeBadge, { backgroundColor: `${typeColor}15` }]}>
              <Text style={[styles.typeBadgeText, { color: typeColor }]}>{activity.type}</Text>
            </View>
            <Text style={[styles.countdownText, { color: colors.warning }]}>
              {activity.countdownText}
            </Text>
          </View>

          <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>{activity.title}</Text>

          <View style={styles.divider} />

          {/* Time & Place metadata */}
          <View style={styles.metaRow}>
            <Clock size={16} color={colors.accent} style={{ marginRight: 10 }} />
            <View>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>THỜI GIAN</Text>
              <Text style={[styles.metaValue, { color: colors.textPrimary }]}>{activity.time} · Hôm nay</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <MapPin size={16} color={colors.accent} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>ĐỊA ĐIỂM</Text>
              <Text style={[styles.metaValue, { color: colors.textPrimary }]}>{activity.location}</Text>
            </View>
          </View>

          {activity.mentorName && (
            <View style={styles.metaRow}>
              <User size={16} color={colors.accent} style={{ marginRight: 10 }} />
              <View>
                <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>NGƯỜI PHỤ TRÁCH</Text>
                <Text style={[styles.metaValue, { color: colors.textPrimary }]}>{activity.mentorName}</Text>
              </View>
            </View>
          )}
        </View>

        {/* ================= DESCRIPTION ================= */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginLeft: 4 }]}>MÔ TẢ HOẠT ĐỘNG</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.descText, { color: colors.textPrimary }]}>
            {activity.description || "Không có mô tả bổ sung cho hoạt động này."}
          </Text>
        </View>

        {/* ================= ACTIONS ================= */}
        <View style={styles.btnGroup}>
          {activity.meetingUrl && (
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: colors.accent }]}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>Tham gia Google Meet</Text>
              <ExternalLink size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: colors.accent }, activity.meetingUrl && { backgroundColor: colors.cardElevated }]}
            activeOpacity={0.8}
            onPress={handleCheckIn}
          >
            <QrCode size={16} color={activity.meetingUrl ? colors.textPrimary : "#FFFFFF"} style={{ marginRight: 8 }} />
            <Text style={[styles.actionBtnText, activity.meetingUrl && { color: colors.textPrimary }]}>Check-in tại sự kiện</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtnOutline, { borderColor: colors.border }]}
            activeOpacity={0.8}
            onPress={handleAddToCalendar}
          >
            <Calendar size={16} color={colors.textPrimary} style={{ marginRight: 8 }} />
            <Text style={[styles.actionBtnOutlineText, { color: colors.textPrimary }]}>Thêm vào lịch cá nhân</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  countdownText: {
    fontSize: 12,
    fontWeight: "750",
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    width: "100%",
    marginVertical: 14,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  descText: {
    fontSize: 13,
    lineHeight: 20,
  },
  btnGroup: {
    gap: 10,
    marginTop: 10,
  },
  actionBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  actionBtnOutline: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
  },
  actionBtnOutlineText: {
    fontSize: 14,
    fontWeight: "800",
  },
});
