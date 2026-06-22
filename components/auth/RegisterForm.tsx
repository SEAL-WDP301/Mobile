import { useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import { router } from "expo-router";

import {
    User,
    Mail,
    Lock,
} from "lucide-react-native";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { useTheme } from "@/constants/theme/ThemeProvider";

export default function RegisterForm() {
    const { theme } = useTheme();

    const [fullName, setFullName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [loading, setLoading] =
        useState(false);

    const handleRegister =
        async () => {
            try {
                setLoading(true);

                // TODO:
                // call register api

                router.replace(
                    "/auth/login"
                );
            } catch (error) {
                console.log(error);
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
                onChangeText={
                    setConfirmPassword
                }
                secureTextEntry
                leftIcon={<Lock size={18} color={theme.text} />}
            />

            <Button
                title={
                    loading
                        ? "Creating..."
                        : "Create Account"
                }
                onPress={handleRegister}
            />

            <TouchableOpacity
                style={styles.loginLink}
                onPress={() =>
                    router.replace(
                        "/auth/login"
                    )
                }
            >
                <Text
                    style={{
                        color:
                            theme.textSecondary,
                    }}
                >
                    Already have an account?
                </Text>

                <Text
                    style={{
                        color: theme.primary,
                        fontWeight: "600",
                    }}
                >
                    Login
                </Text>
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