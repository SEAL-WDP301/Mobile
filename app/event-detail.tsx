import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
  Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, ChevronRight, Info, HelpCircle, FileText, Phone, Award, Users, Calendar, MapPin } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { COMPETITIONS } from "@/constants/mockData";

const { width } = Dimensions.get("window");

export default function EventDetailScreen() {
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams();

  // Find event details, fallback to the main active event
  const eventId = id ? parseInt(id as string) : 1;
  const event = COMPETITIONS.find(c => c.id === eventId) || COMPETITIONS[0];

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

  const handleOpenHandbook = () => {
    if (event.handbookUrl) {
      Alert.alert("Tải tài liệu", `Đang mở tài liệu cuộc thi: ${event.handbookUrl}`);
    } else {
      Alert.alert("Thông báo", "Tài liệu cuộc thi chưa được cập nhật.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* ================= HEADER ================= */}
      <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Chi tiết cuộc thi</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ================= EVENT HERO BANNER ================= */}
        <View style={[styles.heroCard, { backgroundColor: "#2C1D11" }]}>
          <Text style={[styles.heroSeason, { color: colors.accent }]}>{event.season}</Text>
          <Text style={styles.heroTitle}>{event.name}</Text>
          <Text style={styles.heroTheme}>{event.theme}</Text>

          <View style={styles.heroInfoGrid}>
            <View style={styles.heroInfoItem}>
              <Calendar size={12} color="#FFFFFF" opacity={0.7} />
              <Text style={styles.heroInfoText}>{event.date}</Text>
            </View>
            <View style={styles.heroInfoItem}>
              <MapPin size={12} color="#FFFFFF" opacity={0.7} />
              <Text style={styles.heroInfoText} numberOfLines={1}>{event.location}</Text>
            </View>
          </View>
        </View>

        {/* ================= MY REGISTRATION STATUS ================= */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>THÔNG TIN THAM GIA</Text>
          <View style={styles.regInfoRow}>
            <Text style={[styles.regLabel, { color: colors.textSecondary }]}>Trạng thái:</Text>
            <View style={[styles.statusBadge, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
              <Text style={[styles.statusBadgeText, { color: colors.success }]}>ĐÃ ĐĂNG KÝ</Text>
            </View>
          </View>
          <View style={styles.regInfoRow}>
            <Text style={[styles.regLabel, { color: colors.textSecondary }]}>Đội thi:</Text>
            <Text style={[styles.regValue, { color: colors.textPrimary }]}>{event.myTeam || "Chưa có đội"}</Text>
          </View>
          <View style={styles.regInfoRow}>
            <Text style={[styles.regLabel, { color: colors.textSecondary }]}>Bảng đấu (Track):</Text>
            <Text style={[styles.regValue, { color: colors.textPrimary }]}>{event.track || "Chưa chọn"}</Text>
          </View>
        </View>

        {/* ================= LIST OF ROUNDS ================= */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>CÁC VÒNG THI</Text>
        <View style={[styles.roundsCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          {[
            { name: "Sơ loại hồ sơ", status: "Completed", date: "15/06 - 20/06" },
            { name: "Round 1: Prototype Development", status: "Current", date: "22/06 - 29/06" },
            { name: "Round 2: Demo Day & Final Pitching", status: "Locked", date: "05/07 - 12/07" },
          ].map((round, idx) => (
            <View key={idx} style={[styles.roundRow, idx !== 2 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
              <View style={styles.roundInfoCol}>
                <Text style={[
                  styles.roundNameText, 
                  { color: colors.textPrimary },
                  round.status === "Current" && { color: colors.accent, fontWeight: "700" },
                  round.status === "Locked" && { color: colors.textSecondary }
                ]}>
                  {round.name}
                </Text>
                <Text style={[styles.roundDateText, { color: colors.textSecondary }]}>Thời gian: {round.date}</Text>
              </View>

              <View style={[
                styles.roundStatusBadge,
                round.status === "Completed" && { backgroundColor: `${colors.success}15` },
                round.status === "Current" && { backgroundColor: "rgba(243, 112, 33, 0.15)" },
                round.status === "Locked" && { backgroundColor: colors.cardElevated }
              ]}>
                <Text style={[
                  styles.roundStatusText,
                  round.status === "Completed" && { color: colors.success },
                  round.status === "Current" && { color: colors.accent },
                  round.status === "Locked" && { color: colors.textSecondary }
                ]}>
                  {round.status === "Completed" && "ĐÃ XONG"}
                  {round.status === "Current" && "HIỆN TẠI"}
                  {round.status === "Locked" && "ĐANG KHÓA"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ================= COMPETITION RULES ================= */}
        {event.rules && event.rules.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>QUY CHẾ CUỘC THI</Text>
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              {event.rules.map((rule, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Info size={14} color={colors.accent} style={{ marginRight: 10, marginTop: 2 }} />
                  <Text style={[styles.bulletText, { color: colors.textPrimary }]}>{rule}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ================= JUDGING CRITERIA ================= */}
        {event.criteria && event.criteria.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>TIÊU CHÍ CHẤM ĐIỂM</Text>
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              {event.criteria.map((item, idx) => (
                <View key={idx} style={styles.criteriaItem}>
                  <View style={styles.criteriaHeader}>
                    <Text style={[styles.criteriaName, { color: colors.textPrimary }]}>{item.criterion}</Text>
                    <Text style={[styles.criteriaWeight, { color: colors.accent }]}>Trọng số: {item.weight}</Text>
                  </View>
                  <Text style={[styles.criteriaDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ================= PARTICIPANT HANDBOOK ================= */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>TÀI LIỆU HƯỚNG DẪN</Text>
        <TouchableOpacity 
          style={[styles.handbookCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          activeOpacity={0.85}
          onPress={handleOpenHandbook}
        >
          <View style={styles.handbookLeft}>
            <FileText size={24} color={colors.accent} style={{ marginRight: 12 }} />
            <View>
              <Text style={[styles.handbookTitle, { color: colors.textPrimary }]}>SEAL Participant Handbook</Text>
              <Text style={[styles.handbookDesc, { color: colors.textSecondary }]}>Cẩm nang hướng dẫn thí sinh thi SEAL Hackathon</Text>
            </View>
          </View>
          <ChevronRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* ================= FAQ ================= */}
        {event.faq && event.faq.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>CÂU HỎI THƯỜNG GẶP (FAQ)</Text>
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              {event.faq.map((faq, idx) => (
                <View key={idx} style={styles.faqItem}>
                  <Text style={[styles.faqQuestion, { color: colors.textPrimary }]}>Q: {faq.q}</Text>
                  <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>A: {faq.a}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ================= CONTACT ORGANIZER ================= */}
        <View style={[styles.contactCard, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
          <Phone size={18} color={colors.accent} style={{ marginRight: 10 }} />
          <Text style={[styles.contactText, { color: colors.textPrimary }]}>
            Ban tổ chức SEAL Hackathon: <Text style={{ color: colors.accent, fontWeight: "700" }}>{event.contact}</Text>
          </Text>
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
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  heroSeason: {
    fontSize: 11,
    fontWeight: "850",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
    marginBottom: 8,
  },
  heroTheme: {
    color: "#E7E5E4",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  heroInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  heroInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroInfoText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  regInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  regLabel: {
    fontSize: 13,
  },
  regValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
    marginLeft: 4,
  },
  roundsCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
  },
  roundRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  roundInfoCol: {
    flex: 1,
  },
  roundNameText: {
    fontSize: 13,
    fontWeight: "600",
  },
  roundDateText: {
    fontSize: 11,
    marginTop: 2,
  },
  roundStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roundStatusText: {
    fontSize: 9,
    fontWeight: "800",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  bulletText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  criteriaItem: {
    marginBottom: 14,
  },
  criteriaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  criteriaName: {
    fontSize: 13,
    fontWeight: "700",
  },
  criteriaWeight: {
    fontSize: 12,
    fontWeight: "700",
  },
  criteriaDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  handbookCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  handbookLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  handbookTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  handbookDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  faqItem: {
    marginBottom: 14,
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 12,
    lineHeight: 16,
  },
  contactCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  contactText: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
});
