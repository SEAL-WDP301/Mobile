import { useState } from "react";

import { View, Alert } from "react-native";
import { Mail } from "lucide-react-native";
import { router } from "expo-router";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { useTheme } from "@/constants/theme/ThemeProvider";
import { forgotPassword } from "@/services/api/auth";
import { ApiError } from "@/services/api/client";

export default function ForgotPasswordForm() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email.");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email.trim());
      Alert.alert(
        "Đã gửi email",
        "Nếu email hợp lệ, link khôi phục mật khẩu sẽ được gửi tới hộp thư của bạn.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Không gửi được yêu cầu. Vui lòng thử lại.";
      Alert.alert("Lỗi", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        leftIcon={<Mail size={18} color={theme.text} />}
      />

      <Button
        title={loading ? "Sending..." : "Send Reset Link"}
        onPress={handleReset}
      />
    </View>
  );
}
