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
import { router } from "expo-router";
import { ChevronLeft, Star, Briefcase, Calendar, MessageSquare, Award, Clock } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { MOCK_MENTOR } from "@/constants/mockData";

const { width } = Dimensions.get("window");

export default function MentorDetailScreen() {
  const { isDark } = useTheme();

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

  const handleBookSlot = () => {
    Alert.alert(
      "Đặt lịch Mentoring",
      "Vui lòng truy cập SEAL Web Portal để đặt lịch hẹn chính thức với Mentor. Bạn có thể chọn các slot thời gian rảnh được cung cấp dưới đây.",
      [
        { text: "Đóng", style: "cancel" }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* ================= HEADER ================= */}
      <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Thông tin Mentor</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ================= PROFILE CARD ================= */}
        <View style={[styles.profileCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarLarge, { backgroundColor: colors.accent }]}>
              <Text style={styles.avatarText}>{MOCK_MENTOR.name.split(" ").slice(-2).map(n => n[0]).join("")}</Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.nameText, { color: colors.textPrimary }]}>{MOCK_MENTOR.name}</Text>
                <View style={styles.ratingRow}>
                  <Star size={12} color={colors.accent} fill={colors.accent} />
                  <Text style={[styles.ratingText, { color: colors.accent }]}>{MOCK_MENTOR.rating}</Text>
                </View>
              </View>
              <Text style={[styles.positionText, { color: colors.textSecondary }]}>
                {MOCK_MENTOR.position}
              </Text>
              <Text style={[styles.orgText, { color: colors.textSecondary }]}>
                {MOCK_MENTOR.org}
              </Text>
            </View>
          </View>

          {/* Expertise badges */}
          <View style={styles.expertiseContainer}>
            {MOCK_MENTOR.expertise.map((exp, idx) => (
              <View key={idx} style={[styles.expertBadge, { backgroundColor: colors.cardElevated }]}>
                <Text style={[styles.expertBadgeText, { color: colors.textSecondary }]}>{exp}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ================= BIO / GIỚI THIỆU ================= */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginLeft: 4 }]}>GIỚI THIỆU MENTOR</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.bodyText, { color: colors.textPrimary }]}>
            {MOCK_MENTOR.bio}
          </Text>
        </View>

        {/* ================= SLOTS / LỊCH RẢNH ================= */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginLeft: 4 }]}>KHUNG GIỜ HỖ TRỢ</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.slotRow}>
            <Clock size={16} color={colors.accent} style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.slotLabel, { color: colors.textSecondary }]}>Khung giờ rảnh cố định:</Text>
              <Text style={[styles.slotValue, { color: colors.textPrimary }]}>
                {MOCK_MENTOR.slots}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.slotRow}>
            <Calendar size={16} color={colors.accent} style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.slotLabel, { color: colors.textSecondary }]}>Số đội thi đang hỗ trợ:</Text>
              <Text style={[styles.slotValue, { color: colors.textPrimary }]}>
                {MOCK_MENTOR.assignedTeams}
              </Text>
            </View>
          </View>
        </View>

        {/* ================= NEXT BOOKED APPOINTMENT ================= */}
        {MOCK_MENTOR.nextAppointment && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginLeft: 4 }]}>CUỘC HẸN SẮP DIỄN RA</Text>
            <View style={[styles.appointmentCard, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
              <View style={styles.appointmentLeft}>
                <Clock size={18} color={colors.accent} style={{ marginRight: 10 }} />
                <View>
                  <Text style={[styles.appointmentLabelText, { color: colors.textSecondary }]}>LỊCH HẸN DUYỆT PROJECT</Text>
                  <Text style={[styles.appointmentValueText, { color: colors.textPrimary }]}>{MOCK_MENTOR.nextAppointment}</Text>
                </View>
              </View>
              <View style={[styles.activeStatusBadge, { backgroundColor: "rgba(243, 112, 33, 0.15)" }]}>
                <Text style={[styles.activeStatusText, { color: colors.accent }]}>ĐÃ XÁC NHẬN</Text>
              </View>
            </View>
          </>
        )}

        {/* ================= BOOK ACTION BUTTON ================= */}
        <TouchableOpacity 
          style={[styles.bookBtn, { backgroundColor: colors.accent }]}
          activeOpacity={0.8}
          onPress={handleBookSlot}
        >
          <Calendar size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.bookBtnText}>Đặt lịch hướng dẫn trên Web</Text>
        </TouchableOpacity>

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
  profileCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  avatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "800",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "750",
  },
  positionText: {
    fontSize: 12,
    marginTop: 2,
  },
  orgText: {
    fontSize: 12,
  },
  expertiseContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
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
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
  },
  slotRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  slotLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  slotValue: {
    fontSize: 13,
    fontWeight: "650",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    width: "100%",
    marginVertical: 12,
  },
  appointmentCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appointmentLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  appointmentLabelText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  appointmentValueText: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  activeStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeStatusText: {
    fontSize: 9,
    fontWeight: "800",
  },
  bookBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  bookBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
