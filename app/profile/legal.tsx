import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileScreenHeader from "@/components/profile/ProfileScreenHeader";
import { useTheme } from "@/constants/theme/useTheme";
import { useLocale } from "@/contexts/LocaleContext";

type Tab = "terms" | "privacy";

export default function LegalScreen() {
  const { isDark } = useTheme();
  const { t } = useLocale();
  const [tab, setTab] = useState<Tab>("terms");

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

  const body = tab === "terms" ? t.legal.terms : t.legal.privacy;
  const title = tab === "terms" ? t.profile.termsTitle : t.profile.privacyTitle;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <ProfileScreenHeader title={t.profile.legal} />

      <View style={[styles.tabs, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        {(["terms", "privacy"] as Tab[]).map((key) => {
          const active = tab === key;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.tab, active && { backgroundColor: colors.accent }]}
              onPress={() => setTab(key)}
            >
              <Text
                style={{
                  color: active ? "#FFF" : colors.textSecondary,
                  fontWeight: "700",
                  fontSize: 12,
                }}
              >
                {key === "terms" ? t.profile.termsTitle : t.profile.privacyTitle}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>{title}</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.body, { color: colors.textPrimary }]}>{body}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  body: { fontSize: 14, lineHeight: 24 },
});
