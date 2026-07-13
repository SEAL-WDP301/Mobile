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
  container: { flex: 1 },
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
    paddingHorizontal: 16,
    paddingVertical: 10,
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
