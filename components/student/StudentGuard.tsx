import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/constants/theme/useTheme";
import Button from "@/components/ui/Button";

interface StudentGuardProps {
  children: React.ReactNode;
}

export default function StudentGuard({ children }: StudentGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { isDark } = useTheme();

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
  };

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg, padding: 24 }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Cần đăng nhập</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Vui lòng đăng nhập bằng tài khoản sinh viên để tiếp tục.
        </Text>
        <Button title="Đăng nhập" onPress={() => router.push("/login")} style={{ marginTop: 16 }} />
      </View>
    );
  }

  if (user?.role && user.role !== "student") {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg, padding: 24 }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Không có quyền truy cập</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Ứng dụng mobile này chỉ dành cho sinh viên (STUDENT).
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center", marginTop: 8, lineHeight: 20 },
});
