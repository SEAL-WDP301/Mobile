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
import { router } from "expo-router";
import { ChevronLeft, Clock, CheckCircle, AlertTriangle, ExternalLink, ShieldCheck, HelpCircle } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { CURRENT_ROUND } from "@/constants/mockData";

const { width } = Dimensions.get("window");

export default function RoundDetailScreen() {
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
    warning: "#F59E0B",
    error: "#EF4444",
  };

  const handleOpenWeb = () => {
    Alert.alert(
      "Mở cổng nộp bài",
      "Hệ thống sẽ mở trình duyệt để truy cập SEAL Web Portal (http://seal.fpt.edu.vn/submissions). Bạn cần đăng nhập bằng tài khoản sinh viên FPT để nộp bài làm.",
      [
        { text: "Bỏ qua", style: "cancel" },
        { text: "Mở Web Portal", onPress: () => {} }
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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Chi tiết vòng thi</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ================= ROUND HEADER CARD ================= */}
        <View style={[styles.roundHero, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.cardTag, { color: colors.accent }]}>VÒNG THI HIỆN TẠI</Text>
          <Text style={[styles.roundName, { color: colors.textPrimary }]}>{CURRENT_ROUND.name}</Text>
          <View style={styles.timeRow}>
            <Clock size={16} color={colors.warning} />
            <Text style={[styles.timeLeft, { color: colors.warning }]}>{CURRENT_ROUND.timeLeft}</Text>
          </View>
        </View>

        {/* ================= SUBMISSION STATUS ALERT ================= */}
        <View style={[styles.statusBox, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 12 }]}>TRẠNG THÁI BÀI NỘP</Text>
          
          {CURRENT_ROUND.submissionStatus === "Đã nộp bài" ? (
            <View style={styles.submittedContainer}>
              <View style={[styles.alertBanner, { backgroundColor: `${colors.success}10`, borderColor: `${colors.success}30` }]}>
                <CheckCircle size={18} color={colors.success} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.alertTitle, { color: colors.success }]}>Đã ghi nhận bài nộp</Text>
                  <Text style={[styles.alertBody, { color: colors.textSecondary }]}>
                    Đội của bạn đã nộp bài thành công vào lúc {CURRENT_ROUND.submissionTime}. Bạn vẫn có thể cập nhật bài nộp trên Web trước khi hết hạn.
                  </Text>
                </View>
              </View>

              <View style={[styles.detailsBlock, { backgroundColor: colors.cardElevated }]}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Sản phẩm nộp:</Text>
                <Text style={[styles.detailValue, { color: colors.textPrimary }]}>Phoenix AI Assistant App</Text>
                
                <Text style={[styles.detailLabel, { color: colors.textSecondary, marginTop: 10 }]}>Mã nguồn GitHub:</Text>
                <Text style={[styles.detailValue, { color: colors.accent }]} numberOfLines={1}>github.com/phoenix-team/seal-ai-edu</Text>

                <Text style={[styles.detailLabel, { color: colors.textSecondary, marginTop: 10 }]}>Video demo (YouTube):</Text>
                <Text style={[styles.detailValue, { color: colors.accent }]} numberOfLines={1}>youtube.com/watch?v=phoenix-demo</Text>
              </View>
            </View>
          ) : (
            <View style={styles.notSubmittedContainer}>
              <View style={[styles.alertBanner, { backgroundColor: `${colors.error}10`, borderColor: `${colors.error}30` }]}>
                <AlertTriangle size={18} color={colors.error} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.alertTitle, { color: colors.error }]}>Chưa ghi nhận bài nộp</Text>
                  <Text style={[styles.alertBody, { color: colors.textSecondary }]}>
                    Hạn nộp bài đang đến gần. Vui lòng hoàn tất nộp bài thi trước thời gian đóng cổng hệ thống.
                  </Text>
                </View>
              </View>
              <Text style={[styles.warningInfoText, { color: colors.textSecondary }]}>
                ⚠️ Ứng dụng di động không hỗ trợ tải file và chỉnh sửa bài nộp. Mọi thao tác submit dự án phải được thực hiện trên SEAL Web Portal.
              </Text>
            </View>
          )}

          {/* Web portal redirect button */}
          <TouchableOpacity 
            style={[styles.webRedirectBtn, { backgroundColor: colors.accent }]}
            activeOpacity={0.8}
            onPress={handleOpenWeb}
          >
            <Text style={styles.webRedirectBtnText}>Mở SEAL Web Portal</Text>
            <ExternalLink size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        {/* ================= DELIVERABLES / YÊU CẦU NỘP BÀI ================= */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginLeft: 4 }]}>YÊU CẦU BÀI NỘP</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          {[
            { title: "Mã nguồn ứng dụng (GitHub/GitLab)", desc: "Repo chứa toàn bộ code của dự án, có tệp README.md hướng dẫn cài đặt cụ thể." },
            { title: "Tài liệu mô tả kiến trúc (PDF)", desc: "Tối đa 10 trang mô tả bài toán, giải pháp kỹ thuật, sơ đồ hệ thống và tích hợp AI." },
            { title: "Video Demo sản phẩm (YouTube/Drive)", desc: "Video dài tối đa 3 phút quay lại các chức năng thực tế của ứng dụng, không chấp nhận video chỉ có slide." },
          ].map((req, idx) => (
            <View key={idx} style={[styles.reqItem, idx !== 2 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
              <View style={styles.reqNumberBox}>
                <Text style={[styles.reqNumber, { color: colors.accent }]}>0{idx + 1}</Text>
              </View>
              <View style={styles.reqContent}>
                <Text style={[styles.reqTitleText, { color: colors.textPrimary }]}>{req.title}</Text>
                <Text style={[styles.reqDescText, { color: colors.textSecondary }]}>{req.desc}</Text>
              </View>
            </View>
          ))}
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
  roundHero: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  cardTag: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  roundName: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 6,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeLeft: {
    fontSize: 14,
    fontWeight: "700",
  },
  statusBox: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  submittedContainer: {
    marginBottom: 16,
  },
  notSubmittedContainer: {
    marginBottom: 16,
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  alertBody: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  detailsBlock: {
    borderRadius: 12,
    padding: 12,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  warningInfoText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  webRedirectBtn: {
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  webRedirectBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  reqItem: {
    flexDirection: "row",
    paddingVertical: 14,
  },
  reqNumberBox: {
    width: 32,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  reqNumber: {
    fontSize: 18,
    fontWeight: "800",
  },
  reqContent: {
    flex: 1,
    marginLeft: 4,
  },
  reqTitleText: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  reqDescText: {
    fontSize: 12,
    lineHeight: 16,
  },
});
