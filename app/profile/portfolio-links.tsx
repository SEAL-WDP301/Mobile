<<<<<<< HEAD
import React from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
<<<<<<< HEAD
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
=======
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ProfileScreenHeader from "@/components/profile/ProfileScreenHeader";
import { useTheme } from "@/constants/theme/useTheme";
import { useLocale } from "@/contexts/LocaleContext";
import {
  getProfileLinks,
  saveProfileLinks,
} from "@/services/profileStorage";
import { Globe } from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6

export default function PortfolioLinksScreen() {
  const { isDark } = useTheme();
  const { t } = useLocale();
<<<<<<< HEAD
  const { selectedEventId } = useEventContext();
  const { data: workspace, loading } = useWorkspace(selectedEventId);

  const teamRepo = workspace?.team?.githubRepoUrl;
  const submissionUrl = workspace?.latestSubmission?.githubUrl;
=======

  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [loading, setLoading] = useState(false);
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
<<<<<<< HEAD
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

=======
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

  useEffect(() => {
    getProfileLinks().then((links) => {
      setPortfolioUrl(links.portfolioUrl);
      setGithubUrl(links.githubUrl);
      setLinkedinUrl(links.linkedinUrl);
    });
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveProfileLinks({
        portfolioUrl: portfolioUrl.trim(),
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
      });
      Alert.alert("OK", t.profile.saved);
    } finally {
      setLoading(false);
    }
  };

>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <ProfileScreenHeader title={t.profile.portfolio} />

<<<<<<< HEAD
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
=======
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          {t.profile.portfolioHint}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t.profile.portfolioUrl}</Text>
          <Input
            value={portfolioUrl}
            onChangeText={setPortfolioUrl}
            placeholder="https://your-portfolio.com"
            autoCapitalize="none"
            keyboardType="url"
            leftIcon={<Globe size={18} color={colors.textSecondary} />}
          />

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>{t.profile.githubUrl}</Text>
          <Input
            value={githubUrl}
            onChangeText={setGithubUrl}
            placeholder="https://github.com/username"
            autoCapitalize="none"
            keyboardType="url"
            leftIcon={<FontAwesome name="github" size={18} color={colors.textSecondary} />}
          />

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>{t.profile.linkedinUrl}</Text>
          <Input
            value={linkedinUrl}
            onChangeText={setLinkedinUrl}
            placeholder="https://linkedin.com/in/username"
            autoCapitalize="none"
            keyboardType="url"
            leftIcon={<FontAwesome name="linkedin" size={18} color={colors.textSecondary} />}
          />
        </View>

        <Button title={loading ? "..." : t.profile.save} onPress={handleSave} />
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  desc: { fontSize: 13, lineHeight: 20, marginBottom: 4 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
<<<<<<< HEAD
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  rowContent: { flex: 1 },
  label: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", marginBottom: 4 },
  value: { fontSize: 13, lineHeight: 20 },
  divider: { height: 1, marginVertical: 14 },
=======
  label: { fontSize: 12, fontWeight: "700", marginBottom: 8, textTransform: "uppercase" },
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
});
