import AuthHeader from "@/components/auth/AuthHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useTheme } from "@/constants/theme/ThemeProvider";
import { verifyOtp } from "@/services/api/auth";
import { ApiError } from "@/services/api/client";
import { Mail, KeyRound } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyOtpScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!email.trim() || !otp.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mã OTP.");
      return;
    }

    try {
      setLoading(true);
      await verifyOtp(email.trim(), otp.trim());
      Alert.alert("Thành công", "Tài khoản đã được kích hoạt.", [
        { text: "Đăng nhập", onPress: () => router.replace("/auth/login") },
      ]);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Mã OTP không hợp lệ.";
      Alert.alert("Xác thực thất bại", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <AuthHeader
        title="Verify Email"
        subtitle="Enter the OTP sent to your email"
      />

      <Card>
        <View style={styles.form}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            leftIcon={<Mail size={18} color={theme.text} />}
          />
          <Input
            placeholder="OTP Code"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            leftIcon={<KeyRound size={18} color={theme.text} />}
          />
          <Button
            title={loading ? "Verifying..." : "Verify OTP"}
            onPress={handleVerify}
          />
        </View>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  form: {
    gap: 16,
  },
});
