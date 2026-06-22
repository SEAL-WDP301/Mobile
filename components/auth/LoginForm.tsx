import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, } from "react-native";

import { router } from "expo-router";

import { Mail, Lock, } from "lucide-react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Divider from "@/components/ui/Divider";

import { useTheme } from "@/constants/theme/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginForm() {
    const { theme } = useTheme();
    const { login } = useAuth();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [remember, setRemember] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);

            // TODO:
            // gọi API login ở đây

            login();

            router.replace("/(tabs)");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin =
        async () => {
            try {
                // TODO

                console.log(
                    "Google Login"
                );
            } catch (error) {
                console.log(error);
            }
        };

    return (
        <View style={styles.container}>
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

            <View style={styles.optionRow}>
                <View style={styles.row}>
                    <Checkbox
                        checked={remember}
                        onChange={setRemember}
                    />

                    <Text
                        style={{
                            color:
                                theme.textSecondary,
                        }}
                    >
                        Remember me
                    </Text>
                </View>

                <TouchableOpacity onPress={() =>
                    router.push("/auth/forgot-password")
                }>
                    <Text
                        style={{
                            color: theme.primary,
                        }}
                    >
                        Forgot Password?
                    </Text>
                </TouchableOpacity>
            </View>

            <Button
                title={
                    loading
                        ? "Signing In..."
                        : "Login"
                }
                onPress={handleLogin}
            />

            <Divider text="Or continue with" />

            <TouchableOpacity
                style={[
                    styles.socialButton,
                    {
                        borderColor:
                            theme.border,
                    },
                ]}
            >
                <AntDesign
                    name="google"
                    size={20}
                    color={theme.text}
                />

                <Text
                    style={{
                        color: theme.text,
                    }}
                >
                    Google
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.socialButton,
                    {
                        borderColor:
                            theme.border,
                    },
                ]}
            >
                <FontAwesome
                    name="github"
                    size={20}
                    color={theme.text}
                />

                <Text
                    style={{
                        color: theme.text,
                    }}
                >
                    Github
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.registerLink}
                onPress={() =>
                    router.push(
                        "/auth/register"
                    )
                }
            >
                <Text
                    style={{
                        color:
                            theme.textSecondary,
                    }}
                >
                    {"Don't have an account?"}
                </Text>

                <Text
                    style={{
                        color: theme.primary,
                        fontWeight: "600",
                    }}
                >
                    Register
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    optionRow: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        alignItems: "center",
    },

    socialButton: {
        height: 52,
        borderWidth: 1,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },

    registerLink: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
    },
});