import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Constants from "expo-constants";
import { ChevronRight, Lock, Smartphone, User, LogOut } from "lucide-react-native";
import ProfileScreenHeader from "@/components/profile/ProfileScreenHeader";
import { useTheme } from "@/constants/theme/useTheme";
import { useAuth } from "@/contexts/AuthContext";

export default function PrivacyDeviceScreen() {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    error: "#EF4444",
  };

  const appVersion =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "1.0.0";
  const deviceLabel = Platform.OS === "ios" ? "iOS" : Platform.OS === "android" ? "Android" : Platform.OS;

  const handleClearSession = () => {
    Alert.alert(
      "Xóa phiên đăng nhập",
      "Đăng xuất và xóa token trên thiết bị này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/auth/login");
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <ProfileScreenHeader title="Quyền riêng tư & Thiết bị" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.section, { color: colors.textSecondary }]}>TÀI KHOẢN</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.row}>
            <User size={16} color={colors.accent} />
            <View style={styles.rowTextWrap}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                {user?.name ?? "—"}
              </Text>
              <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                {user?.email ?? "—"}
              </Text>
              <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                Vai trò: {user?.role ?? "student"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.section, { color: colors.textSecondary }]}>THIẾT BỊ</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.row}>
            <Smartphone size={16} color={colors.accent} />
            <View style={styles.rowTextWrap}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                {deviceLabel}
              </Text>
              <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                Phiên bản ứng dụng: {appVersion}
              </Text>
              <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                Token đăng nhập được lưu an toàn trên thiết bị (Secure Store / local storage).
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.section, { color: colors.textSecondary }]}>QUYỀN RIÊNG TƯ</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.navRow}
            activeOpacity={0.7}
            onPress={() => router.push("/profile/legal")}
          >
            <View style={styles.rowLeft}>
              <Lock size={16} color={colors.accent} />
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                Điều khoản & Chính sách bảo mật
              </Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.navRow} activeOpacity={0.7} onPress={handleClearSession}>
            <View style={styles.rowLeft}>
              <LogOut size={16} color={colors.error} />
              <View style={styles.rowTextWrap}>
                <Text style={[styles.rowTitle, { color: colors.error }]}>
                  Xóa phiên trên thiết bị này
                </Text>
                <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                  Đăng xuất và xóa access token cục bộ.
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  section: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 4,
  },
  card: { borderRadius: 16, borderWidth: 1, marginBottom: 12, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowLeft: { flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 12 },
  rowTextWrap: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: "700" },
  rowSub: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  divider: { height: 1, marginLeft: 44 },
});
