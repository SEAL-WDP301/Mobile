import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ProfileScreenHeader from "@/components/profile/ProfileScreenHeader";
import { useTheme } from "@/constants/theme/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { updateStudentProfile } from "@/services/api/users";
import { getSkills, saveSkills } from "@/services/profileStorage";
import { ApiError } from "@/services/api/client";
import { User, Mail, Phone, GraduationCap } from "lucide-react-native";

type StudentType = "fpt" | "external";

export default function PersonalInfoScreen() {
  const { isDark } = useTheme();
  const { t } = useLocale();
  const { user, refreshProfile } = useAuth();

  const [studentType, setStudentType] = useState<StudentType>("fpt");
  const [studentCode, setStudentCode] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

  useEffect(() => {
    const profile = user?.studentProfile;
    if (profile) {
      setStudentType((profile.studentType as StudentType) ?? "fpt");
      setStudentCode(profile.studentCode ?? "");
      setUniversityName(profile.universityName ?? "");
      setPhone(profile.phone ?? "");
    }
    getSkills().then(setSkills);
  }, [user]);

  const handleSave = async () => {
    if (!studentCode.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mã sinh viên.");
      return;
    }

    try {
      setLoading(true);
      await updateStudentProfile({
        studentType,
        studentCode: studentCode.trim(),
        universityName: universityName.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      await saveSkills(skills.trim());
      await refreshProfile();
      Alert.alert("OK", t.profile.saved);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Không lưu được hồ sơ.";
      Alert.alert("Lỗi", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <ProfileScreenHeader title={t.profile.personalInfo} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t.profile.fullName}</Text>
          <Input
            value={user?.name ?? ""}
            onChangeText={() => {}}
            placeholder={t.profile.fullName}
            editable={false}
            leftIcon={<User size={18} color={colors.textSecondary} />}
          />
          <Text style={[styles.hint, { color: colors.textSecondary }]}>{t.profile.readOnly}</Text>

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>{t.profile.email}</Text>
          <Input
            value={user?.email ?? ""}
            onChangeText={() => {}}
            placeholder={t.profile.email}
            editable={false}
            leftIcon={<Mail size={18} color={colors.textSecondary} />}
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t.profile.studentType}</Text>
          <View style={styles.typeRow}>
            {(["fpt", "external"] as StudentType[]).map((type) => {
              const active = studentType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: active ? colors.accent : colors.bg,
                      borderColor: active ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => setStudentType(type)}
                >
                  <Text style={{ color: active ? "#FFF" : colors.textPrimary, fontWeight: "700", fontSize: 12 }}>
                    {type === "fpt" ? t.profile.studentTypeFpt : t.profile.studentTypeExternal}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>{t.profile.studentCode}</Text>
          <Input
            value={studentCode}
            onChangeText={setStudentCode}
            placeholder="SE170123"
            leftIcon={<GraduationCap size={18} color={colors.textPrimary} />}
          />

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>{t.profile.university}</Text>
          <Input
            value={universityName}
            onChangeText={setUniversityName}
            placeholder="FPT University HCM"
            leftIcon={<GraduationCap size={18} color={colors.textPrimary} />}
          />

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>{t.profile.phone}</Text>
          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder="0901234567"
            keyboardType="phone-pad"
            leftIcon={<Phone size={18} color={colors.textPrimary} />}
          />

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>{t.profile.skills}</Text>
          <Input
            value={skills}
            onChangeText={setSkills}
            placeholder={t.profile.skillsHint}
          />
        </View>

        <Button title={loading ? "..." : t.profile.save} onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 16 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  label: { fontSize: 12, fontWeight: "700", marginBottom: 8, textTransform: "uppercase" },
  hint: { fontSize: 11, marginTop: 4 },
  typeRow: { flexDirection: "row", gap: 8 },
  typeChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
});
