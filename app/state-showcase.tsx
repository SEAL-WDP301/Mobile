import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { 
  ChevronLeft, 
  WifiOff, 
  AlertTriangle, 
  Calendar, 
  Users, 
  UserX, 
  Clock, 
  CheckCircle,
  FileQuestion,
  Hourglass,
  HelpCircle,
  Sparkles
} from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";

const { width } = Dimensions.get("window");

export default function StateShowcaseScreen() {
  const { isDark } = useTheme();
  const [selectedState, setSelectedState] = useState<string>("skeleton");

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
    info: "#06B6D4",
  };

  const stateOptions = [
    { id: "skeleton", label: "Loading Skeleton" },
    { id: "offline", label: "Offline State" },
    { id: "error", label: "Error State" },
    { id: "empty_schedule", label: "No Schedule" },
    { id: "empty_team", label: "No Team" },
    { id: "empty_mentor", label: "No Mentor Assigned" },
    { id: "event_not_started", label: "Event Not Started" },
    { id: "event_completed", label: "Event Completed" },
    { id: "eliminated", label: "Team Eliminated" },
    { id: "qualified", label: "Team Qualified" },
    { id: "submission_not_found", label: "Submission Not Found" },
    { id: "submission_received", label: "Submission Received" },
    { id: "result_pending", label: "Result Pending" },
    { id: "result_released", label: "Result Released" },
  ];

  const renderStateContent = () => {
    switch (selectedState) {
      case "skeleton":
        return (
          <View style={styles.stateWrapper}>
            <Text style={[styles.stateTitleText, { color: colors.textPrimary }]}>1. Trạng thái Loading Skeleton</Text>
            <View style={[styles.mockSkeletonCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <View style={[styles.skeletonHeader, { backgroundColor: isDark ? "#2A2826" : "#E5E7EB" }]} />
              <View style={[styles.skeletonLine, { width: "80%", backgroundColor: isDark ? "#2A2826" : "#E5E7EB" }]} />
              <View style={[styles.skeletonLine, { width: "60%", backgroundColor: isDark ? "#2A2826" : "#E5E7EB" }]} />
              <View style={[styles.skeletonFooter, { backgroundColor: isDark ? "#2A2826" : "#E5E7EB" }]} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20, gap: 10 }}>
              <ActivityIndicator size="small" color={colors.accent} />
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Đang tải dữ liệu sự kiện...</Text>
            </View>
          </View>
        );

      case "offline":
        return (
          <View style={styles.stateWrapper}>
            <Text style={[styles.stateTitleText, { color: colors.textPrimary }]}>2. Trạng thái Mất kết nối (Offline State)</Text>
            <View style={[styles.stateCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <WifiOff size={40} color={colors.error} style={styles.stateIcon} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Mất kết nối Internet</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Không thể tải thông tin. Vui lòng kiểm tra lại kết nối mạng trên thiết bị và thử lại.
              </Text>
              <TouchableOpacity style={[styles.stateBtn, { backgroundColor: colors.accent }]}>
                <Text style={styles.stateBtnText}>Thử kết nối lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case "error":
        return (
          <View style={styles.stateWrapper}>
            <Text style={[styles.stateTitleText, { color: colors.textPrimary }]}>3. Trạng thái Lỗi (Error State)</Text>
            <View style={[styles.stateCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <AlertTriangle size={40} color={colors.warning} style={styles.stateIcon} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Đã xảy ra sự cố</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Lỗi hệ thống (500) hoặc máy chủ đang bảo trì. Vui lòng báo cáo sự cố nếu lỗi này tiếp tục xảy ra.
              </Text>
              <View style={{ flexDirection: "row", gap: 10, width: "100%", marginTop: 12 }}>
                <TouchableOpacity style={[styles.stateBtnOutline, { borderColor: colors.border, flex: 1 }]}>
                  <Text style={[styles.stateBtnOutlineText, { color: colors.textPrimary }]}>Báo cáo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.stateBtn, { backgroundColor: colors.accent, flex: 1.5 }]}>
                  <Text style={styles.stateBtnText}>Tải lại trang</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case "empty_schedule":
        return (
          <View style={styles.stateWrapper}>
            <Text style={[styles.stateTitleText, { color: colors.textPrimary }]}>4. Trạng thái Không có lịch trình sắp tới</Text>
            <View style={[styles.stateCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Calendar size={40} color={colors.textSecondary} style={styles.stateIcon} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Không có hoạt động nào</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Chưa ghi nhận hoạt động hay sự kiện nào trong ngày thi được chọn này.
              </Text>
            </View>
          </View>
        );

      case "empty_team":
        return (
          <View style={styles.stateWrapper}>
            <Text style={[styles.stateTitleText, { color: colors.textPrimary }]}>5. Trạng thái Chưa lập đội thi (No Team)</Text>
            <View style={[styles.stateCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Users size={40} color={colors.accent} style={styles.stateIcon} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Chưa tham gia đội thi</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Vui lòng tạo hoặc tham gia đội thi để tiếp tục.
              </Text>
            </View>
          </View>
        );

      case "empty_mentor":
        return (
          <View style={styles.stateWrapper}>
            <Text style={[styles.stateTitleText, { color: colors.textPrimary }]}>6. Trạng thái Chưa phân công Mentor</Text>
            <View style={[styles.stateCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <UserX size={40} color={colors.textSecondary} style={styles.stateIcon} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Chưa phân công Mentor</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Đội của bạn chưa được phân công mentor. Ban tổ chức sẽ cập nhật thông tin khi mentor được xác nhận.
              </Text>
            </View>
          </View>
        );

      case "event_not_started":
        return (
          <View style={styles.stateWrapper}>
            <Text style={[styles.stateTitleText, { color: colors.textPrimary }]}>7. Trạng thái Cuộc thi chưa bắt đầu</Text>
            <View style={[styles.stateCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Clock size={40} color={colors.warning} style={styles.stateIcon} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Cuộc thi chưa bắt đầu</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Cuộc thi chưa bắt đầu. Thông tin thời gian sẽ được cập nhật trên hệ thống.
              </Text>
            </View>
          </View>
        );

      case "event_completed":
        return (
          <View style={styles.stateWrapper}>
            <Text style={[styles.stateTitleText, { color: colors.textPrimary }]}>8. Trạng thái Cuộc thi đã kết thúc</Text>
            <View style={[styles.stateCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <CheckCircle size={40} color={colors.success} style={styles.stateIcon} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Cuộc thi đã khép lại</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Cảm ơn bạn đã tham gia. Hẹn gặp lại ở các mùa giải tiếp theo!
              </Text>
            </View>
          </View>
        );

      case "eliminated":
        return (
          <View style={styles.stateWrapper}>
            <Text style={[styles.stateTitleText, { color: colors.textPrimary }]}>9. Trạng thái Đội thi bị loại (Eliminated)</Text>
            <View style={[styles.stateCard, { backgroundColor: colors.cardBg, borderColor: colors.border, borderColor: colors.error, borderWidth: 1 }]}>
              <AlertTriangle size={40} color={colors.error} style={styles.stateIcon} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Dừng bước tại cuộc thi</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Rất tiếc, đội của bạn đã không đủ điểm để bước tiếp vào Vòng Chung Kết. Chúc các bạn gặt hái thêm nhiều kinh nghiệm ở các giải đấu sau.
              </Text>
            </View>
          </View>
        );

      case "qualified":
        return (
          <View style={styles.stateWrapper}>
            <Text style={[styles.stateTitleText, { color: colors.textPrimary }]}>10. Trạng thái Đội thi thăng hạng (Qualified)</Text>
            <View style={[styles.stateCard, { backgroundColor: colors.cardBg, borderColor: colors.border, borderColor: colors.success, borderWidth: 1 }]}>
              <Sparkles size={40} color={colors.success} style={styles.stateIcon} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Lọt vào Vòng Chung Kết!</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Chúc mừng đội của bạn đã đủ điều kiện bước tiếp vào vòng sau!
              </Text>
            </View>
          </View>
        );

      case "submission_not_found":
        return (
          <View style={styles.stateWrapper}>
            <Text style={[styles.stateTitleText, { color: colors.textPrimary }]}>11. Trạng thái Chưa ghi nhận bài nộp</Text>
            <View style={[styles.stateCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <FileQuestion size={40} color={colors.warning} style={styles.stateIcon} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Chưa ghi nhận bài nộp</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Vòng thi hiện tại chưa ghi nhận bài nộp. Vui lòng nộp bài trước deadline.
              </Text>
            </View>
          </View>
        );

      case "submission_received":
        return (
          <View style={styles.stateWrapper}>
            <Text style={[styles.stateTitleText, { color: colors.textPrimary }]}>12. Trạng thái Đã nhận bài nộp</Text>
            <View style={[styles.stateCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <CheckCircle size={40} color={colors.success} style={styles.stateIcon} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Đã ghi nhận bài nộp</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Hệ thống đã lưu trữ bài làm của nhóm thành công. Ban Giám khảo sẽ đánh giá sau khi vòng thi kết thúc.
              </Text>
            </View>
          </View>
        );

      case "result_pending":
        return (
          <View style={styles.stateWrapper}>
            <Text style={[styles.stateTitleText, { color: colors.textPrimary }]}>13. Trạng thái Điểm số đang chờ công bố</Text>
            <View style={[styles.stateCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Hourglass size={40} color={colors.warning} style={styles.stateIcon} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Kết quả đang xử lý</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Ban Giám khảo đang tiến hành chấm điểm độc lập các dự án. Kết quả sẽ được công bố chính thức vào lúc 19:00 ngày mai.
              </Text>
            </View>
          </View>
        );

      case "result_released":
        return (
          <View style={styles.stateWrapper}>
            <Text style={[styles.stateTitleText, { color: colors.textPrimary }]}>14. Trạng thái Đã công bố kết quả</Text>
            <View style={[styles.stateCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Award size={40} color={colors.accent} style={styles.stateIcon} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Kết quả đã được công bố!</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Điểm số trung bình và nhận xét chi tiết của ban giám khảo đã sẵn sàng. Chạm bên dưới để kiểm tra.
              </Text>
              <TouchableOpacity 
                style={[styles.stateBtn, { backgroundColor: colors.accent }]}
                onPress={() => router.push("/results")}
              >
                <Text style={styles.stateBtnText}>Xem bảng điểm của đội</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>State Showcase</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ================= STATE SELECTOR BUTTONS ================= */}
      <View style={[styles.selectorWrapper, { borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
          {stateOptions.map((opt) => {
            const isSelected = selectedState === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.selectorTab,
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                  isSelected && { backgroundColor: colors.accent, borderColor: colors.accent }
                ]}
                onPress={() => setSelectedState(opt.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.selectorLabel, { color: isSelected ? "#FFFFFF" : colors.textSecondary }]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderStateContent()}
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
  selectorWrapper: {
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  selectorScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  selectorTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  selectorLabel: {
    fontSize: 11,
    fontWeight: "750",
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  stateWrapper: {
    width: "100%",
    alignItems: "center",
  },
  stateTitleText: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  stateCard: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
  },
  stateIcon: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  stateBtn: {
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 4,
  },
  stateBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  stateBtnOutline: {
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginTop: 4,
  },
  stateBtnOutlineText: {
    fontSize: 13,
    fontWeight: "800",
  },
  mockSkeletonCard: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  skeletonHeader: {
    height: 18,
    width: "40%",
    borderRadius: 4,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 3,
  },
  skeletonFooter: {
    height: 36,
    width: "100%",
    borderRadius: 8,
    marginTop: 10,
  },
});
