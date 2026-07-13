import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check } from "lucide-react-native";
import ProfileScreenHeader from "@/components/profile/ProfileScreenHeader";
import { useTheme } from "@/constants/theme/useTheme";
import { useLocale } from "@/contexts/LocaleContext";
import type { Locale } from "@/constants/i18n/translations";

export default function LanguageScreen() {
  const { isDark } = useTheme();
  const { locale, setLocale, t } = useLocale();

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

  const options: { key: Locale; label: string }[] = [
    { key: "vi", label: t.profile.languageVi },
    { key: "en", label: t.profile.languageEn },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <ProfileScreenHeader title={t.profile.language} />

      <View style={styles.content}>
        {options.map((opt) => {
          const selected = locale === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.row,
                {
                  backgroundColor: colors.cardBg,
                  borderColor: selected ? colors.accent : colors.border,
                },
              ]}
              onPress={() => setLocale(opt.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.label, { color: colors.textPrimary }]}>{opt.label}</Text>
              {selected && <Check size={20} color={colors.accent} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  label: { fontSize: 15, fontWeight: "600" },
});
