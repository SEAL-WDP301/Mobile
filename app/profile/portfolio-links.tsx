import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Globe, Github } from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";
import ProfileScreenHeader from "@/components/profile/ProfileScreenHeader";
import { useTheme } from "@/constants/theme/useTheme";
import { useLocale } from "@/contexts/LocaleContext";
import { useEventContext } from "@/contexts/EventContext";
import { useWorkspace } from "@/hooks/useWorkspace";

export default function PortfolioLinksScreen() {
  const { isDark } = useTheme();
  const { t } = useLocale();
  const { selectedEventId } = useEventContext();
  const { data: workspace, loading } = useWorkspace(selectedEventId);

  const teamRepo = workspace?.team?.githubRepoUrl;
  const submissionUrl = workspace?.latestSubmission?.githubUrl;

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
      <ProfileScreenHeader title={t.profile.portfolio} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          Liên kết dự án được lấy từ đội thi và bài nộp trên hệ thống SEAL.
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 24 }} />
        ) : (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.row}>
              <FontAwesome name="github" size={18} color={colors.accent} />
              <View style={styles.rowContent}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>GitHub repo đội</Text>
                <Text style={[styles.value, { color: colors.textPrimary }]}>
                  {teamRepo ?? "Chưa có repo được gán cho đội"}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.row}>
              <Github size={18} color={colors.accent} />
              <View style={styles.rowContent}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Link nộp bài gần nhất</Text>
                <Text style={[styles.value, { color: colors.textPrimary }]}>
                  {submissionUrl ?? "Chưa có bài nộp"}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.row}>
              <Globe size={18} color={colors.textSecondary} />
              <View style={styles.rowContent}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Portfolio / LinkedIn</Text>
                <Text style={[styles.value, { color: colors.textSecondary }]}>
                  Liên kết cá nhân chưa được lưu trên hệ thống.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  desc: { fontSize: 13, lineHeight: 20, marginBottom: 4 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  rowContent: { flex: 1 },
  label: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", marginBottom: 4 },
  value: { fontSize: 13, lineHeight: 20 },
  divider: { height: 1, marginVertical: 14 },
});
