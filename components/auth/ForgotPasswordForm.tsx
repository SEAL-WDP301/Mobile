import { useState } from "react";

import { View, Alert, } from "react-native";
import { Mail, } from "lucide-react-native";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { useTheme } from "@/constants/theme/ThemeProvider";

export default function ForgotPasswordForm() {
    const { theme } = useTheme();

    const [email, setEmail] =
        useState("");

    const handleReset = () => {
        Alert.alert(
            "Success",
            "Password reset email sent."
        );
    };

    return (
        <View>
            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                leftIcon={
                    <Mail
                        size={18}
                        color={theme.text}
                    />
                }
            />

            <Button
                title="Send Reset Link"
                onPress={handleReset}
            />
        </View>
    );
}