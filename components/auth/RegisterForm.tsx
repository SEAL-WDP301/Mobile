import { useState } from "react";

import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

import { router } from "expo-router";

import { User, Mail, Lock } from "lucide-react-native";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { useTheme } from "@/constants/theme/ThemeProvider";
import { signUp } from "@/services/api/auth";
import { ApiError } from "@/services/api/client";

export default function RegisterForm() {
  const { theme } = useTheme();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    try {
      setLoading(true);
      await signUp(email.trim(), password, fullName.trim());
      Alert.alert(
        "Đăng ký thành công",
        "Mã OTP đã được gửi tới email của bạn. Vui lòng xác thực trước khi đăng nhập.",
        [
          {
            text: "Xác thực OTP",
            onPress: () =>
              router.replace({
                pathname: "/auth/verify-otp",
                params: { email: email.trim() },
              }),
          },
        ],
      );
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Đăng ký thất bại. Vui lòng thử lại.";
      Alert.alert("Đăng ký thất bại", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        leftIcon={<User size={18} color={theme.text} />}
      />

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        leftIcon={<Mail size={18} color={theme.text} />}
      />

      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        leftIcon={<Lock size={18} color={theme.text} />}
      />

      <Input
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        leftIcon={<Lock size={18} color={theme.text} />}
      />

      <Button
        title={loading ? "Creating..." : "Create Account"}
        onPress={handleRegister}
      />

      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => router.replace("/auth/login")}
      >
        <Text style={{ color: theme.textSecondary }}>
          Already have an account?
        </Text>

        <Text style={{ color: theme.primary, fontWeight: "600" }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
});
