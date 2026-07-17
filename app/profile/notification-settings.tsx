import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Bell, ChevronRight, Mail, Info } from "lucide-react-native";
import ProfileScreenHeader from "@/components/profile/ProfileScreenHeader";
import { useTheme } from "@/constants/theme/useTheme";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationSettingsScreen() {
  const { isDark } = useTheme();
  const { unreadCount } = useNotifications();

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <ProfileScreenHeader title="Cài đặt thông báo" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          Thông báo trong ứng dụng được lấy từ hệ thống SEAL. Tuỳ chọn Push/Email trên server chưa có API —
          bạn vẫn xem và quản lý hộp thư thông báo tại đây.
        </Text>

        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => router.push("/notifications")}
          >
            <View style={styles.rowLeft}>
              <Bell size={16} color={colors.accent} />
              <View style={styles.rowTextWrap}>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                  Hộp thư thông báo
                </Text>
                <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                  {unreadCount > 0
                    ? `${unreadCount} thông báo chưa đọc`
                    : "Xem thông báo Push/in-app từ hệ thống"}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Mail size={16} color={colors.accent} />
              <View style={styles.rowTextWrap}>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                  Email thông báo
                </Text>
                <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                  Email từ ban tổ chức được gửi theo cấu hình sự kiện trên SEAL Web.
                  Mobile chưa hỗ trợ bật/tắt riêng vì BE chưa có endpoint preference.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.infoBox, { backgroundColor: `${colors.accent}12`, borderColor: `${colors.accent}35` }]}>
          <Info size={16} color={colors.accent} style={{ marginTop: 2 }} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Khi có API cài đặt Push/Email, màn này sẽ được cập nhật để đồng bộ tuỳ chọn lên server.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  hint: { fontSize: 13, lineHeight: 20 },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  row: {
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
  infoBox: {
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
