import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Switch,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  QrCode,
  Briefcase,
  Award,
  ShieldAlert,
  Globe,
  Bell,
  Lock,
  Edit2
} from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
<<<<<<< HEAD
import { useSelectedEvent } from "@/contexts/EventContext";
=======
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
import {
  computeProfileCompletion,
  getInitials,
} from "@/utils/format";
<<<<<<< HEAD
import {
  formatParticipantPassId,
  formatSupportContact,
} from "@/constants/config";
=======
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const { isDark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const { t, localeLabel } = useLocale();
<<<<<<< HEAD
  const selectedEvent = useSelectedEvent();
=======
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6

  const displayName = user?.name ?? "—";
  const displayEmail = user?.email ?? "—";
  const studentId = user?.studentProfile?.studentCode ?? "—";
  const university = user?.studentProfile?.universityName ?? "Chưa cập nhật";
  const avatarInitials = getInitials(displayName);
  const profileCompletion = user ? computeProfileCompletion(user) : 0;
<<<<<<< HEAD
  const passBadge = selectedEvent
    ? formatParticipantPassId(selectedEvent.event.year, selectedEvent.teamId)
    : null;
=======
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    cardElevated: isDark ? "#211F1D" : "#F5F3EF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    error: "#EF4444",
  };

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đăng xuất", 
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/auth/login");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Screen Title */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{t.profile.title}</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{t.profile.subtitle}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= PROFILE CARD ================= */}
        <View style={[styles.profileCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
              <Text style={styles.avatarText}>{avatarInitials}</Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>{displayName}</Text>
              <Text style={[styles.profileSubText, { color: colors.textSecondary }]}>
                {university} · MSSV: {studentId}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                {displayEmail}
              </Text>
            </View>
          </View>

          {/* Profile completion progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressLabelRow}>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Hoàn thiện hồ sơ</Text>
              <Text style={[styles.progressValue, { color: colors.accent }]}>{profileCompletion}%</Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: isDark ? "#2A2826" : "#E5E7EB" }]}>
              <View style={[styles.progressFill, { width: `${profileCompletion}%`, backgroundColor: colors.accent }]} />
            </View>
          </View>
        </View>

        {/* ================= GROUP: HỒ SƠ CÁ NHÂN ================= */}
        <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>HỒ SƠ CÁ NHÂN</Text>
        <View style={[styles.groupBlock, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.rowItem, { borderBottomColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => router.push("/profile/personal-info")}
          >
            <View style={styles.rowLeft}>
              <User size={16} color={colors.accent} style={{ marginRight: 12 }} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>{t.profile.personalInfo}</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rowItem}
            activeOpacity={0.7}
            onPress={() => router.push("/profile/portfolio-links")}
          >
            <View style={styles.rowLeft}>
              <Briefcase size={16} color={colors.accent} style={{ marginRight: 12 }} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>{t.profile.portfolio}</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ================= GROUP: HOẠT ĐỘNG ================= */}
        <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>HOẠT ĐỘNG CUỘC THI</Text>
        <View style={[styles.groupBlock, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.rowItem, { borderBottomColor: colors.border }]} 
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/competitions")}
          >
            <View style={styles.rowLeft}>
              <Award size={16} color={colors.accent} style={{ marginRight: 12 }} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>Cuộc thi đã tham gia & Kết quả</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.rowItem, { borderBottomColor: colors.border }]} 
            activeOpacity={0.7}
            onPress={() => router.push("/results")}
          >
            <View style={styles.rowLeft}>
              <ShieldAlert size={16} color={colors.accent} style={{ marginRight: 12 }} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>Nhận xét của Giám khảo (Feedback)</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Award size={16} color={colors.accent} style={{ marginRight: 12 }} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>Chứng nhận & Lịch sử check-in</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ================= GROUP: PARTICIPANT PASS ================= */}
        <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>THẺ ĐỒNG HÀNH (PASS)</Text>
        <View style={[styles.groupBlock, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.rowItem} 
            activeOpacity={0.7}
            onPress={() => router.push("/participant-pass")}
          >
            <View style={styles.rowLeft}>
              <QrCode size={16} color={colors.accent} style={{ marginRight: 12 }} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>Mở QR Participant Pass</Text>
            </View>
            <View style={styles.rowRight}>
              {passBadge ? (
                <Text style={[styles.badgeTextText, { color: colors.textSecondary }]}>{passBadge}</Text>
              ) : null}
              <ChevronRight size={16} color={colors.textSecondary} style={{ marginLeft: 6 }} />
            </View>
          </TouchableOpacity>
        </View>

        {/* ================= GROUP: THIẾT LẬP ================= */}
        <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>THIẾT LẬP HỆ THỐNG</Text>
        <View style={[styles.groupBlock, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={[styles.rowItem, { borderBottomColor: colors.border }]}>
            <View style={styles.rowLeft}>
              {isDark ? (
                <Moon size={16} color={colors.accent} style={{ marginRight: 12 }} />
              ) : (
                <Sun size={16} color={colors.accent} style={{ marginRight: 12 }} />
              )}
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>Chế độ giao diện tối (Dark Mode)</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggle}
              trackColor={{ false: "#767577", true: colors.accent }}
              thumbColor="#f4f3f4"
            />
          </View>

          <TouchableOpacity style={[styles.rowItem, { borderBottomColor: colors.border }]} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Bell size={16} color={colors.accent} style={{ marginRight: 12 }} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>Cài đặt thông báo (Push & Email)</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rowItem, { borderBottomColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => router.push("/profile/language")}
          >
            <View style={styles.rowLeft}>
              <Globe size={16} color={colors.accent} style={{ marginRight: 12 }} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>{t.profile.language}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.badgeTextText, { color: colors.textSecondary }]}>{localeLabel}</Text>
              <ChevronRight size={16} color={colors.textSecondary} style={{ marginLeft: 6 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.rowItem, { borderBottomColor: colors.border }]} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Lock size={16} color={colors.accent} style={{ marginRight: 12 }} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>Quyền riêng tư & Thiết bị</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ================= GROUP: HỖ TRỢ ================= */}
        <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>HỖ TRỢ & LIÊN HỆ</Text>
        <View style={[styles.groupBlock, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <TouchableOpacity style={[styles.rowItem, { borderBottomColor: colors.border }]} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <HelpCircle size={16} color={colors.accent} style={{ marginRight: 12 }} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>Câu hỏi thường gặp (FAQ)</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.rowItem, { borderBottomColor: colors.border }]} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Edit2 size={16} color={colors.accent} style={{ marginRight: 12 }} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>Báo cáo sự cố hoặc ý kiến đóng góp</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rowItem, { borderBottomColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => {
              const contact = formatSupportContact();
              Alert.alert(
                "Liên hệ ban tổ chức",
                contact ?? "Chưa cấu hình thông tin liên hệ. Thêm EXPO_PUBLIC_SUPPORT_EMAIL hoặc EXPO_PUBLIC_SUPPORT_PHONE trong .env.",
              );
            }}
          >
            <View style={styles.rowLeft}>
              <User size={16} color={colors.accent} style={{ marginRight: 12 }} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>Liên hệ ban tổ chức</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rowItem}
            activeOpacity={0.7}
            onPress={() => router.push("/profile/legal")}
          >
            <View style={styles.rowLeft}>
              <Lock size={16} color={colors.accent} style={{ marginRight: 12 }} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>{t.profile.legal}</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ================= LOGOUT BUTTON ================= */}
        <TouchableOpacity 
          style={[styles.logoutBtn, { borderColor: `${colors.error}35`, backgroundColor: colors.cardBg }]}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <LogOut size={18} color={colors.error} style={{ marginRight: 10 }} />
          <Text style={[styles.logoutBtnText, { color: colors.error }]}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>

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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },
  profileCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "800",
  },
  profileSubText: {
    fontSize: 12,
    marginTop: 2,
  },
  profileEmail: {
    fontSize: 12,
    marginTop: 1,
  },
  progressContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.03)",
    paddingTop: 14,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  progressValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  groupTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  groupBlock: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
  },
  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowText: {
    fontSize: 13,
    fontWeight: "600",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeTextText: {
    fontSize: 12,
    fontWeight: "500",
  },
  logoutBtn: {
    borderRadius: 16,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
