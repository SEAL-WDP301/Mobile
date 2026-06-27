import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
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

export default function PortfolioLinksScreen() {
  const { isDark } = useTheme();
  const { t } = useLocale();

  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <ProfileScreenHeader title={t.profile.portfolio} />

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  desc: { fontSize: 13, lineHeight: 20, marginBottom: 4 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  label: { fontSize: 12, fontWeight: "700", marginBottom: 8, textTransform: "uppercase" },
});
