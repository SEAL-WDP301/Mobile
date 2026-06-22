import { StyleSheet, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Card from "@/components/ui/Card";

import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";

import { useTheme } from "@/constants/theme/ThemeProvider";

export default function LoginScreen() {
    const { theme } = useTheme();

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor:
                        theme.background,
                },
            ]}
        >
            <AuthHeader
                title="Welcome Back"
                subtitle="Sign in to continue to SEAL"
            />

            <Card>
                <LoginForm />
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
});